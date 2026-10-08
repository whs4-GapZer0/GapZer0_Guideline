"""Exhaustive static source/package/dataset validator; not an LLM Runtime test."""
from pathlib import Path
import hashlib,json,re,subprocess,sys
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(Path(__file__).parent))
from importlib.util import spec_from_file_location,module_from_spec
spec=spec_from_file_location('sync',Path(__file__).with_name('sync-guideline.py'));sync=module_from_spec(spec);spec.loader.exec_module(sync)
p=json.loads((ROOT/'skill/references/guideline-provenance.json').read_text());revision=p['guidelineRevision']
read=lambda rel:(ROOT/rel).read_text();jsonread=lambda rel:json.loads(read(rel));sha=lambda data:hashlib.sha256(data).hexdigest()
source={};results=[]
def check(name,fn):
 try:fn();results.append(dict(id=f'SYNC{len(results)+1:02}',name=name,status='PASS'))
 except Exception as e:results.append(dict(id=f'SYNC{len(results)+1:02}',name=name,status='FAIL',error=str(e)))
def require(value,message='assertion failed'):
 if not value:raise AssertionError(message)
for f in p['files']:source.update(sync.parse(sync.git('show',revision+':'+f['source']),f['source']))
index=read('skill/references/control-index.md');entries={m[1]:dict(name=m[2],body=m[3]) for m in re.finditer(r'^## ([A-Z]{3}-[CEL]-\d{2}) — (.+)\n([\s\S]*?)(?=^## |\Z)',index,re.M)}
field=lambda body,label:re.search(r'\*\*'+re.escape(label)+r':\*\* (.+)',body)[1].strip().strip('`')
catalog=jsonread('ai-skill-ui/data/controls.json');dataset={c['id']:c for c in catalog['controls']};demo=jsonread('ai-skill-ui/demo-data.json');manifest=jsonread('claude-skill/tests/source-manifest.json')
def source_hashes():
 for f in p['files']:require(sha(sync.git('show',revision+':'+f['source']).encode())==f['sourceSha256'],f['source'])
check('Pinned canonical Git file hashes',source_hashes)
def mirrors():
 expected={str(Path(f['mirror']).relative_to('skill/references/controls')) for f in p['files']};actual={str(f.relative_to(ROOT/'skill/references/controls')) for f in (ROOT/'skill/references/controls').rglob('*.md')};require(expected==actual,'Mirror file set')
 for f in p['files']:require(read(f['mirror'])==sync.clean(sync.git('show',revision+':'+f['source'])),f['mirror']);require(sha((ROOT/f['mirror']).read_bytes())==f['mirrorSha256'])
check('All 28 source mirror files byte-preserved after front matter removal',mirrors)
check('Source Index Dataset unique ID sets equal',lambda:require(set(source)==set(entries)==set(dataset) and len(dataset)==len(catalog['controls'])))
def index_identity():
 for cid,c in source.items():
  require(entries[cid]['name']==c['fields']['Control Name'],cid)
  for key,label in [('Domain','Security Domain'),('Class','Control Class')]:require(field(entries[cid]['body'],key)==c['fields'][label],cid+' '+key)
check('All Index ID Name Domain Class identities',index_identity)
check('Index snapshot hash and pinned revision',lambda:require(sha((ROOT/'skill/references/control-index.md').read_bytes())==p['indexSha256'] and revision in index))
def source_paths():
 for cid,c in source.items():
  expected='references/controls/'+c['source'].removeprefix('_pages/control-guide/')
  require(field(entries[cid]['body'],'원문 위치')==expected,cid)
  require(field(entries[cid]['body'],'가이드라인 원본')==c['source'],cid)
check('All source paths and Control anchors resolve',source_paths)
def package(package):
 for f in (ROOT/'skill/references').rglob('*'):
  if f.is_file():require(f.read_bytes()==(ROOT/package/'references'/f.relative_to(ROOT/'skill/references')).read_bytes(),str(f))
check('Codex full reference parity',lambda:package('.codex/skills/gapzero-guide'))
check('Claude full reference parity',lambda:package('claude-skill'))
def manifest_hashes():
 for f in manifest['files']:require(sha((ROOT/f['source']).read_bytes())==f['sha256']==sha((ROOT/f['portable']).read_bytes()),f['source'])
 require(manifest['guideline_source_commit']==revision)
check('Claude manifest actual source and portable hashes',manifest_hashes)
def fields_equal():
 for cid,c in source.items():require(dataset[cid]['fields']==c['fields'],cid+' fields');require(dataset[cid]['guidelineSource']==c['source'] and dataset[cid]['guidelineRevision']==revision,cid+' trace')
check('All 121 Controls every field exact to canonical original',fields_equal)
def dataset_hashes():
 for c in dataset.values():require(c['sourceSha256']==sha((ROOT/c['repositorySource'].split('#')[0]).read_bytes()),c['id'])
 require(catalog['indexSha256']==p['indexSha256'] and catalog['guidelineRevision']==revision)
check('Dataset traceability and source hashes',dataset_hashes)
def assessment():
 a=json.loads(sync.git('show',revision+':'+p['assessmentSource']));require({c['id'] for c in a['controls']}==set(source))
 for c in a['controls']:
  f=source[c['id']]['fields'];require(c['name']==f['Control Name'] and c['domain'].casefold()==f['Security Domain'].casefold() and c['controlClass']==f['Control Class'],c['id'])
  require(c['guide'].split('#')[1]==c['id'].lower(),c['id']+' guide');require(dataset[c['id']]['assessmentGuide']==c['guide'],c['id']+' assessment link')
check('Official Assessment IDs names class case-only domain labels and anchors',assessment)
def demo_equal():
 require(len(demo['scenarios'])==3)
 for scenario in demo['scenarios']:
  for c in scenario['controls']:require(c['fields']==source[c['id']]['fields'],c['id']);require(c['sha256']==dataset[c['id']]['sourceSha256']);require((ROOT/'ai-skill-ui/sources'/f"{c['id'].lower()}.html").exists())
check('3 Demo scenarios / 14 records copied from exact latest Control fields',demo_equal)
check('Fake ID absent from source Index packages and Dataset',lambda:require('GZ-FAKE-999' not in source and 'GZ-FAKE-999' not in entries and 'GZ-FAKE-999' not in dataset and 'GZ-FAKE-999' not in read('claude-skill/references/control-index.md')))
def preserved_rules():
 b=json.loads(Path('/tmp/guideline-sync-before.json').read_text())
 for file in ['skill/SKILL.md','.codex/skills/gapzero-guide/SKILL.md','claude-skill/SKILL.md','skill/references/output-formats.md','ai-skill-ui/runtime-adapter.js']:require(sha((ROOT/file).read_bytes())==b[file],file)
 original_terms=sync.git('show',revision+':_pages/03-term-explanation.md')
 for label in ['Control Statement','Control Owner']:
  match=re.search(r'^- \*\*'+label+r':\*\* (.+)$',read('skill/references/framework-overview.md'),re.M)
  require(match and match[1] in original_terms,label+' definition')
check('Skill behavior rules output formats and Runtime adapter unchanged',preserved_rules)
def mapping_integrity():
 for cid,c in source.items():
  for key,value in c['fields'].items():
   if '매핑' in key or 'Coverage' in key or 'Limitation' in key:require(dataset[cid]['fields'][key]==value,cid+' '+key)
 diff=jsonread('ai-skill-ui/tests/GUIDELINE_SKILL_STRUCTURAL_DIFF.json')
 for e in diff['records']:
  for d in e['changes']:
   if d['field']=='매핑된 ISMS-P 항목':require(re.findall(r'\d+\.\d+\.\d+',d['before'])==re.findall(r'\d+\.\d+\.\d+',d['after']),e['id'])
check('Mapping wording from canonical source only; existing ISMS-P numbers unchanged',mapping_integrity)
def protected():
 b=json.loads(Path('/tmp/guideline-sync-before.json').read_text());allowed=('skill/','.codex/skills/gapzero-guide/','claude-skill/','ai-skill-ui/')
 for f in b:
  if not f.startswith(allowed):require((ROOT/f).is_file() and sha((ROOT/f).read_bytes())==b[f],f)
 paths=sync.git('ls-files','--cached','--others','--exclude-standard').splitlines()
 for f in paths:
  if not f.startswith(allowed):require(f in b,f)
 require(sha((ROOT/'skill/scripts/test-control-search.mjs').read_bytes())==b['skill/scripts/test-control-search.mjs'],'Existing algorithm changed')
check('Canonical worktree and all outside allowed files protected; search algorithm untouched',protected)
check('Counts domains classes actual and provenance-consistent',lambda:require(len(source)==p['controlCount']==catalog['count'] and len({c['fields']['Security Domain'] for c in source.values()})==p['domainCount']))
out=dict(total=len(results),passCount=sum(r['status']=='PASS' for r in results),failCount=sum(r['status']=='FAIL' for r in results),scope='Static exact-source/package/traceability checks; not actual Codex/Claude Runtime',guidelineRevision=revision,results=results)
(ROOT/'skill/tests/guideline-sync-validation.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps(out,ensure_ascii=False,indent=2));sys.exit(1 if out['failCount'] else 0)
