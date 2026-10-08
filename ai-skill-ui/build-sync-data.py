"""Record actual search re-execution and pinned source sync state for UI."""
from pathlib import Path
import hashlib,json,re,subprocess,tempfile,shutil
ROOT=Path(__file__).resolve().parent;REPO=ROOT.parent
r=json.loads((ROOT/'tests/GUIDELINE_SKILL_STRUCTURAL_DIFF.json').read_text());p=json.loads((REPO/'skill/references/guideline-provenance.json').read_text())
sha=lambda path:hashlib.sha256(path.read_bytes()).hexdigest()
def execute(script):
 result=subprocess.run(['node',str(script)],cwd=REPO,text=True,capture_output=True)
 output=result.stdout+result.stderr
 metrics={};evidence={}
 for mid,label in [('top3','Top-3 case pass rate'),('top5','Top-5 case pass rate'),('hit3','Top-3 expected-control hit rate'),('hit5','Top-5 expected-control hit rate')]:
  m=re.search(re.escape(label)+r': (\d+)/(\d+) \(([^)]+)\)',output);assert m,(label,output)
  metrics[mid]=dict(numerator=int(m[1]),denominator=int(m[2]));evidence[mid]=m[0]
 cases=[]
 for m in re.finditer(r'(PASS|FAIL): (.+)\n(?:  Missing in top 5:.*\n)?  Top 5: (.+)',output):
  candidates=[dict(id=c[1],score=float(c[2])) for c in re.finditer(r'([A-Z]{3}-[CEL]-\d{2})\(([\d.]+)\)',m[3])]
  cases.append(dict(query=m[2],result=m[1],top5=candidates))
 return dict(command='node skill/scripts/test-control-search.mjs',execution=output,exitCode=result.returncode,metrics=metrics,metricEvidence=evidence,cases=cases)
before_path=Path('/tmp/guideline-sync-originals.json')
if before_path.exists():
 originals=json.loads(before_path.read_text())
 with tempfile.TemporaryDirectory(prefix='gapzero-before-search-') as temp:
  root=Path(temp)/'skill';(root/'scripts').mkdir(parents=True);(root/'references').mkdir()
  shutil.copyfile(REPO/'skill/scripts/test-control-search.mjs',root/'scripts/test-control-search.mjs')
  (root/'references/control-index.md').write_text(originals['skill/references/control-index.md'])
  before=execute(root/'scripts/test-control-search.mjs');before['executionContext']='Identical unchanged algorithm; temporary pre-sync index snapshot'
else:
 # Retain the already executed historical baseline; never invent a new before result.
 existing=ROOT/'data/guideline-sync.json'
 if not existing.exists():raise RuntimeError('A pre-sync snapshot or existing measured baseline is required')
 before=json.loads(existing.read_text())['searchBefore']
after=execute(REPO/'skill/scripts/test-control-search.mjs');after['executionContext']='Current synchronized Skill Index'
out=dict(guidelineRevision=p['guidelineRevision'],worktreeRevision=p['worktreeRevision'],guidelineSource=p['sourceRoot'],compared=r['latestCount'],changed=r['changed'],exactBefore=r['exact'],unresolved=len(r['unresolved']),domains=r['domains'],report='ai-skill-ui/tests/GUIDELINE_SKILL_SYNC_REPORT.md',structuralDiff='ai-skill-ui/tests/GUIDELINE_SKILL_STRUCTURAL_DIFF.json',indexSha256=sha(REPO/'skill/references/control-index.md'),searchScriptSha256=sha(REPO/'skill/scripts/test-control-search.mjs'),searchBefore=before,searchAfter=after,runtimeRegression='Actual Codex/Claude Runtime not rerun; historical evidence only',sourceStatus='Pinned origin/main compared; worktree canonical files kept unchanged')
(ROOT/'data/guideline-sync.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print('Search before/after exit',before['exitCode'],after['exitCode']);print('Search after',after['metrics'])
