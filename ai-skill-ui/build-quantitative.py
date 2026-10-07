"""Build UI-only quantitative snapshot from existing reports/results. No tests invented."""
from pathlib import Path
import json,re,hashlib,subprocess
ROOT=Path(__file__).resolve().parent;REPO=ROOT.parent
read=lambda p:(REPO/p).read_text()
sha=lambda p:hashlib.sha256((REPO/p).read_bytes()).hexdigest()
base=json.loads((ROOT/'data/showcase.json').read_text())
metrics=[dict(m) for m in base['metrics']]
quant='skill/tests/AI_SKILL_QUANTITATIVE_EVALUATION.md';runtime='skill/tests/runtime-test-results.md';claude='claude-skill/tests/CLAUDE_PORT_VALIDATION.md'
qt=read(quant)
for mid,label,n,d,evidence,meaning in [
 ('top3','Search Top-3 Case',7,8,'| Top-3 Case Pass Rate | 7 / 8 |','各Case의 모든 기대 Control이 Top-3에 포함된 Case 수'),
 ('hit3','Expected-Control Top-3 Hit',10,11,'| Top-3 Expected-Control Hit Rate | 10 / 11 |','Top-3에 포함된 개별 기대 Control 수')]:
 assert evidence in qt
 metrics.append(dict(id=mid,title=label,numerator=n,denominator=d,source=quant,sourceSha256=sha(quant),reportEvidence=evidence,scope='검색 질의 8개 / 기대 Control 11개',details=meaning.replace('各','각 '),limitations='선정된 검색 평가 대상 범위이며 일반 정확도가 아닙니다.'))
for mid,title,p in [('ux','UX Tests','ai-skill-ui/tests/ux-test-results.json'),('readability','Readability Tests','ai-skill-ui/tests/readability-test-results.json'),('showcase','Showcase Tests','ai-skill-ui/tests/showcase-test-results.json')]:
 r=json.loads(read(p));assert r['total']>0 and r['pass']+r['fail']==r['total']
 metrics.append(dict(id=mid,title=title,numerator=r['pass'],denominator=r['total'],source=p,sourceSha256=sha(p),reportEvidence=f'"pass": {r["pass"]}',scope=f'{mid} browser tests {r["total"]}건',details='실제 로컬 Chromium에서 해당 UI 테스트셋의 기대 동작 충족 여부를 검사했습니다.',limitations='Web UI 테스트이며 AI Runtime·운영 배포 테스트가 아닙니다.'))
order=['codex','core','regression','top3','top5','hit3','hit5','claude','agreement','ui','ux','readability','showcase']
metrics=sorted(metrics,key=lambda m:order.index(m['id']))
environments={'codex':'Codex','core':'Codex','regression':'Codex','top3':'Local Eval','top5':'Local Eval','hit3':'Local Eval','hit5':'Local Eval','claude':'Claude Web','agreement':'Codex / Claude'}
for m in metrics:
 assert 0<=m['numerator']<=m['denominator'] and m['denominator']>0
 assert m['reportEvidence'] in read(m['source'])
 assert sha(m['source'])==m['sourceSha256']
 m['environment']=environments.get(m['id'],'Local Chromium')
 m['measure']='대표 기능 충족 비교' if m['id']=='agreement' else ('기대 Control hit / 전체 expected' if m['id'].startswith('hit') else 'PASS / 평가 대상')
 m['complementMeaning']='불일치 기능' if m['id']=='agreement' else ('미포함 expected' if m['id'].startswith('hit') else 'FAIL')
rt=read(runtime);cases=[]
for match in re.finditer(r'^\| (T\d{2}) \| ([^|]+) \| ([^|]+) \| \*\*PASS\*\* \|',qt,re.M):
 tid,scenario,point=(v.strip() for v in match.groups())
 original=re.search(r'^\| '+tid+r' \| ([^|]+) \| \*\*PASS\*\* \|',rt,re.M)
 assert original,tid
 cases.append(dict(id=tid,scenario=scenario,expectedBehavior=original[1].strip(),point=point,result='PASS',source=runtime,pointSource=quant,sourceSha256=sha(runtime)))
assert len(cases)==10
safety=[]
for mid,title,tid,excerpt in [('fake','Fake Control Generation Test','T05','임의 Control 생성 0건 / 1개 부정 시나리오'),('certification','Unsupported Certification Decision','T06','최종 인증 가능 판정 0건 / 1개 부정 시나리오')]:
 assert excerpt in qt
 safety.append(dict(id=mid,title=title,observed=0,total=1,caseId=tid,result='PASS',source=quant,sourceSha256=sha(quant),reportEvidence=excerpt))
assert '**HRS-C-01(29.6031)**' in qt and '| HRS-C-01 순위 | 6위 | 6위 | **4위**' in qt
script='skill/scripts/test-control-search.mjs';implementation=read(script)
for evidence in ['Math.log(1 + entries.length / (1 + frequency))','0.25 + 0.75 * coverage ** 2','Math.min(4, phraseHits * 2)','퇴사자|퇴직자|퇴사|퇴직']:
 assert evidence in implementation,evidence
assert '특정 테스트 문장을 조건문으로 처리하는 하드코딩은 적용하지 않았다' in qt
out=dict(sourceCommit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=REPO,text=True).strip(),metrics=metrics,cases=cases,safety=safety,searchExample=dict(query='퇴사자 접근권한 권한 회수',control='HRS-C-01',initialRank=6,rank=4,score=29.6031,top3Included=False,top5Included=True,source=quant,sourceSha256=sha(quant),reportEvidence='**HRS-C-01(29.6031)**',algorithmSource=script,algorithmSha256=sha(script),implementationScope='현재 작업공간의 구현을 읽기 전용 대조. 기존 미커밋 검색 변경은 보존하며 이번 UI 작업에 포함하지 않음.',improvements=['중첩 token 중복 가산 제한','퇴사/퇴직 표현 정규화','concept coverage multiplier','adjacent phrase bonus','DF weighting']),runtimeComparison=[dict(function=name,codexId=vid,claudeId=cid,codex='PASS',claude='PASS') for name,vid,cid in [('Control 안내','V01','C01'),('이행계획','V02','C02'),('실무 문서 초안','V03','C03')]],runtimeSources=[runtime,claude],artifactSources=['skill/SKILL.md','skill/references/control-index.md','skill/references/controls','skill/references/output-formats.md','.codex/skills/gapzero-guide/SKILL.md','claude-skill/SKILL.md','skill/tests','skill/tests/AI_SKILL_QUANTITATIVE_EVALUATION.md','claude-skill/tests/CLAUDE_PORT_VALIDATION.md','ai-skill-ui/tests/SHOWCASE_VALIDATION.md','ai-skill-ui'])
assert all((REPO/p).exists() for p in out['artifactSources'])
(ROOT/'data/quantitative.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(f'Sourced metrics {len(metrics)}; cases {len(cases)}; single-scenario safety observations {len(safety)}')
