"""Mirror a pinned canonical Git Guideline revision; no checkout/merge or source edits.
Analysis is written before --apply mutates any copy. Ambiguous ID/path/class or
assessment identity conflicts abort application. No AI runtime is invoked.
"""
from pathlib import Path
from collections import Counter
import argparse, hashlib, html, json, os, re, shutil, subprocess, tempfile
ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / 'ai-skill-ui/tests/GUIDELINE_SKILL_STRUCTURAL_DIFF.json'
PROVENANCE = ROOT / 'skill/references/guideline-provenance.json'

def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT, text=True)

def digest(data):
    return hashlib.sha256(data).hexdigest()

def clean(text):
    return re.sub(r'^---\r?\n[\s\S]*?\r?\n---\r?\n+', '', text).strip() + '\n'

def parse(text, source):
    records = {}
    for match in re.finditer(r'^## ([A-Z]{3}-[CEL]-\d{2})\s*\n([\s\S]*?)(?=^## |\Z)', text, re.M):
        fields = {m[1]: m[2].strip().removesuffix('---').strip() for m in re.finditer(r'^### (.+)\n([\s\S]*?)(?=^### |\Z)', match[2], re.M)}
        if match[1] in records:
            raise ValueError('Duplicate ID: ' + match[1])
        records[match[1]] = dict(fields=fields, source=source+'#'+match[1].lower())
    return records

def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument('--revision', required=True, help='Already fetched immutable canonical main commit SHA')
    cli.add_argument('--apply', action='store_true')
    args = cli.parse_args()
    revision = git('rev-parse', args.revision+'^{commit}').strip()
    head = git('rev-parse', 'HEAD').strip()
    paths = [p for p in git('ls-tree','-r','--name-only',revision,'_pages/control-guide').splitlines() if Path(p).name in {'common.md','enhancement.md','local.md'}]
    raw = {p: git('show',revision+':'+p) for p in paths}
    latest = {}; old = {}; unresolved = []
    for p,text in raw.items():
        parsed = parse(text,p)
        if set(parsed)&set(latest): raise ValueError('Duplicate source ID')
        latest.update(parsed)
        expected = {'common.md':'Common','enhancement.md':'Enhancement','local.md':'Local'}[Path(p).name]
        for cid,c in parsed.items():
            if c['fields'].get('Control Class') != expected: unresolved.append(dict(id=cid,reason='Class/file mismatch'))
    for p in sorted((ROOT/'skill/references/controls').rglob('*.md')):
        parsed = parse(p.read_text(),str(p.relative_to(ROOT)).replace('skill/references/controls/','_pages/control-guide/'))
        if set(parsed)&set(old): raise ValueError('Duplicate Skill ID')
        old.update(parsed)
    assessment_path = 'assets/assessment/controls.json'
    assessment = json.loads(git('show',revision+':'+assessment_path))
    label_differences=[]
    if {c['id'] for c in assessment['controls']} != set(latest): unresolved.append(dict(reason='Assessment/source ID set mismatch'))
    for c in assessment['controls']:
        if c['id'] not in latest: continue
        for key,field in [('name','Control Name'),('domain','Security Domain'),('controlClass','Control Class')]:
            a=c[key]; b=latest[c['id']]['fields'].get(field)
            if a != b:
                if isinstance(b,str) and a.casefold()==b.casefold(): label_differences.append(dict(id=c['id'],field=field,assessment=a,guideline=b,reason='case-only display label; source value preserved'))
                else: unresolved.append(dict(id=c['id'],field=field,before=a,after=b,reason='Assessment/source identity conflict'))
    entries=[];categories=Counter();fields=Counter()
    for cid in sorted(set(old)|set(latest)):
        before=old.get(cid); after=latest.get(cid); changes=[]; cats=[]
        if before is None: cats=['D']; changes=[dict(field='Control',before=None,after=after)]
        elif after is None: cats=['E']; changes=[dict(field='Control',before=before,after=None)]
        else:
            for field in sorted(set(before['fields'])|set(after['fields'])):
                a=before['fields'].get(field);b=after['fields'].get(field)
                if a != b:
                    changes.append(dict(field=field,before=a,after=b));fields[field]+=1
                    cats.append('C' if a is None or b is None else 'B')
                    if field in {'Security Domain','Control Class'}: cats.append('G')
                    if field=='Evidence': cats.append('H')
            if before['source']!=after['source']:changes.append(dict(field='Source path',before=before['source'],after=after['source']));cats.append('I')
            if not changes:cats=['A']
        cats=sorted(set(cats));categories.update(cats)
        entries.append(dict(id=cid,categories=cats,changes=changes,source=(after or before)['source'],applied=False))
    # ID renames cannot be inferred just from similar text. Add/delete require review.
    if categories['D'] or categories['E']: unresolved.append(dict(reason='Control add/delete requires explicit review; do not infer ID rename'))
    categories['J']=len(unresolved)
    report=dict(guidelineRevision=revision,worktreeRevision=head,sourceBranch='origin/main',sourceRoot='_pages/control-guide/',approvalBasis='Official main tree and main history; no individual sign-off record asserted',latestCount=len(latest),oldCount=len(old),domains=len({c['fields']['Security Domain'] for c in latest.values()}),exact=categories['A'],changed=sum(bool(e['changes']) for e in entries),categories={k:categories[k] for k in 'ABCDEFGHIJ'},fieldChanges=dict(fields),fieldChangeCount=sum(fields.values()),assessmentSource=assessment_path,assessmentCount=len(assessment['controls']),assessmentLabelDifferences=label_differences,unresolved=unresolved,records=entries)
    # Two explanatory field definitions also changed in official terms. Copy
    # literal definitions, rather than rewriting behavior instructions.
    terms_path = '_pages/03-term-explanation.md'
    terms = git('show',revision+':'+terms_path)
    overview_path = ROOT/'skill/references/framework-overview.md'
    overview = overview_path.read_text(); definition_changes=[]
    for label in ['Control Statement','Control Owner']:
        blocks = [m[1] for m in re.finditer(r'<details class="gz-term">(.*?)</details>',terms,re.S) if re.search(r'<span[^>]*>'+re.escape(label)+r'</span>',m[1])]
        if len(blocks)!=1: raise ValueError('Ambiguous official term definition: '+label)
        match = re.search(r'gz-term-content"><p>(.*?)</p>',blocks[0],re.S)
        if not match: raise ValueError('Missing official term definition: '+label)
        definition = html.unescape(re.sub('<[^>]+>','',match[1]))
        line = re.search(r'^- \*\*'+re.escape(label)+r':\*\* (.+)$',overview,re.M)
        if not line: raise ValueError('Missing Framework field definition: '+label)
        if line[1]!=definition:
            definition_changes.append(dict(field=label,before=line[1],after=definition,source=terms_path,guidelineRevision=revision,applied=args.apply))
            overview=overview[:line.start(1)]+definition+overview[line.end(1):]
    overview=re.sub(r'canonical main `[0-9a-f]{40}`', 'canonical main `'+revision+'`',overview)
    report['frameworkDefinitionChanges']=definition_changes
    REPORT.parent.mkdir(parents=True,exist_ok=True)
    REPORT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:report[k] for k in ['guidelineRevision','latestCount','oldCount','domains','exact','changed','categories','fieldChangeCount']},ensure_ascii=False,indent=2))
    if not args.apply: return
    if unresolved: raise ValueError('Unresolved structural conflicts; report only')
    with tempfile.TemporaryDirectory(prefix='gapzero-guideline-') as temp:
        source_root=Path(temp)
        for p,text in raw.items():
            target=source_root/Path(p).relative_to('_pages/control-guide');target.parent.mkdir(parents=True,exist_ok=True);target.write_text(text)
        subprocess.run(['node','skill/scripts/build-control-data.mjs'],cwd=ROOT,env={**os.environ,'GAPZERO_GUIDELINE_ROOT':str(source_root),'GAPZERO_GUIDELINE_REVISION':revision},check=True)
    provenance=dict(guidelineRevision=revision,worktreeRevision=head,canonicalBranch='origin/main',sourceRoot='_pages/control-guide/',controlCount=len(latest),domainCount=report['domains'],assessmentSource=assessment_path,assessmentSha256=digest(git('show',revision+':'+assessment_path).encode()),files=[dict(source=p,sourceSha256=digest(text.encode()),mirror='skill/references/controls/'+str(Path(p).relative_to('_pages/control-guide')),mirrorSha256=digest(clean(text).encode())) for p,text in raw.items()],indexSha256=digest((ROOT/'skill/references/control-index.md').read_bytes()))
    PROVENANCE.write_text(json.dumps(provenance,ensure_ascii=False,indent=2)+'\n')
    overview_path.write_text(overview)
    for package in [ROOT/'.codex/skills/gapzero-guide',ROOT/'claude-skill']:
        for p in (ROOT/'skill/references').rglob('*'):
            if p.is_file():
                target=package/'references'/p.relative_to(ROOT/'skill/references');target.parent.mkdir(parents=True,exist_ok=True)
                if not target.exists() or target.read_bytes()!=p.read_bytes():shutil.copyfile(p,target)
    manifest_path=ROOT/'claude-skill/tests/source-manifest.json';manifest=json.loads(manifest_path.read_text())
    existing={i['source']:i for i in manifest['files']}
    for p in sorted((ROOT/'skill/references').rglob('*')):
        if p.is_file():
            source=str(p.relative_to(ROOT));existing[source]=dict(source=source,portable='claude-skill/references/'+str(p.relative_to(ROOT/'skill/references')),sha256=digest(p.read_bytes()))
    manifest['files']=list(existing.values());manifest['guideline_source_commit']=revision;manifest['sync_type']='static source synchronization; no Claude Runtime rerun'
    manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    for e in report['records']:e['applied']=bool(e['changes'])
    report['applicationStatus']='APPLIED; canonical Guideline untouched'
    REPORT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print('Applied canonical source mirrors, generated index, Codex/Claude parity and provenance.')

if __name__=='__main__': main()
