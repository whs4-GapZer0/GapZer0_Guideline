"""Read current AI Skill snapshot and existing reports; writes only UI data."""
from pathlib import Path
import re,json,hashlib,subprocess
ROOT=Path(__file__).resolve().parent
REPO=ROOT.parent
DATA=ROOT/'data'; DATA.mkdir(exist_ok=True)
def read(rel):return (REPO/rel).read_text()
def sha(rel):return hashlib.sha256((REPO/rel).read_bytes()).hexdigest()
index=read('skill/references/control-index.md')
provenance_path=REPO/'skill/references/guideline-provenance.json'
provenance=json.loads(provenance_path.read_text()) if provenance_path.exists() else None
assessment_by_id={}
if provenance:
 assessment=json.loads(subprocess.check_output(['git','show',provenance['guidelineRevision']+':'+provenance['assessmentSource']],cwd=REPO,text=True))
 assessment_by_id={c['id']:c for c in assessment['controls']}
controls=[]
for match in re.finditer(r'^## ([A-Z]{3}-[CEL]-\d{2}) — (.+)\n([\s\S]*?)(?=^## |\Z)',index,re.M):
    cid,name,body=match.groups()
    def indexfield(label):return re.search(r'\*\*'+re.escape(label)+r':\*\* (.+)',body)[1].strip()
    source=indexfield('원문 위치').strip('`')
    rel,anchor=source.split('#')
    path='skill/'+rel
    section=re.search(r'^## '+cid+r'\s*\n([\s\S]*?)(?=^## |\Z)',read(path),re.M)[1]
    fields={m[1]:m[2].strip().removesuffix('---').strip() for m in re.finditer(r'^### (.+)\n([\s\S]*?)(?=^### |\Z)',section,re.M)}
    assert fields['Control Name']==name
    assert fields['Security Domain']==indexfield('Domain')
    assert fields['Control Class']==indexfield('Class')
    assert anchor==cid.lower()
    controls.append(dict(assessmentGuide=assessment_by_id[cid]['guide'] if provenance else None,assessmentSource=provenance['assessmentSource'] if provenance else None,guidelineSource=(rel.replace('references/controls/','_pages/control-guide/')+'#'+anchor),guidelineRevision=provenance['guidelineRevision'] if provenance else None,id=cid,name=name,domain=fields['Security Domain'],classification=fields['Control Class'],keywords=[v.strip() for v in indexfield('검색 키워드').split(',')],source=source,repositorySource=path+'#'+anchor,sourceSha256=sha(path),fields=fields,original='## '+cid+'\n\n'+section))
assert len({c['id'] for c in controls})==len(controls)
(DATA/'controls.json').write_text(json.dumps(dict(source='skill/references/control-index.md → skill/references/controls/',sourceCommit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=REPO,text=True).strip(),indexSha256=sha('skill/references/control-index.md'),count=len(controls),guidelineRevision=provenance['guidelineRevision'] if provenance else None,synchronization='pinned canonical main Guideline → Skill → generated dataset' if provenance else 'current AI Skill snapshot; latest Guideline synchronization not performed',controls=controls),ensure_ascii=False,indent=2)+'\n')
metrics=[]
def metric(mid,title,n,d,source,evidence,scope,details,limitations):
    text=read(source)
    assert evidence in text,(mid,evidence)
    metrics.append(dict(id=mid,title=title,numerator=n,denominator=d,source=source,sourceSha256=sha(source),reportEvidence=evidence,scope=scope,details=details,limitations=limitations))
runtime='skill/tests/runtime-test-results.md';quant='skill/tests/AI_SKILL_QUANTITATIVE_EVALUATION.md';claude='claude-skill/tests/CLAUDE_PORT_VALIDATION.md'
metric('codex','Codex Runtime',13,13,runtime,'총 13/13 PASS','V01–V03 + T01–T10','Control 안내·이행계획·문서 초안과 부족한 정보·가짜 ID·인증 판단 등 예외 요청을 검사한 보고서입니다.','정의한 13개 시나리오 범위이며 모든 질의의 정확도가 아닙니다.')
metric('core','Core Functions',3,3,runtime,'V01~V03: 3/3 PASS','핵심 기능 V01–V03','세 기능의 기대 출력 구조와 실제 원문 근거를 검증했습니다.','모든 Control을 실행한 exhaustive test가 아닙니다.')
metric('regression','Regression Scenarios',10,10,runtime,'T01~T10: 10/10 PASS','실무·예외 T01–T10','퇴사, 백업 계획, 공급자, 가짜 ID, 인증판정, 개인정보, 취약점, 사고 등 정의한 요청을 검사했습니다.','향후 모든 입력의 안전성을 보장하지 않습니다.')
metric('top5','Search Top-5 Case',8,8,quant,'| Top-5 Case Pass Rate | 8 / 8 |','검색 질의 8개','각 질의의 모든 기대 Control이 Top-5 안에 포함돼야 해당 Case가 PASS입니다.','보고서의 2차 개선 결과입니다. Explorer 문자열 검색과 다른 평가이며 Top-3 Case는 7/8입니다.')
metric('hit5','Expected-Control Top-5 Hit',11,11,quant,'| Top-5 Expected-Control Hit Rate | 11 / 11 |','기대 Control 11개','검색 상위 5개에서 개별 기대 Control을 찾았는지 집계했습니다.','일반 정확도 100%가 아닙니다. 기대값 11개 범위입니다.')
metric('claude','Claude Runtime',3,3,claude,'| Claude Runtime Validation | 3/3 PASS |','대표 C01–C03','사용자가 실제 Claude 웹 Skill 업로드·활성화 후 실행한 결과를 문서화했습니다.','사용자 제공 실행 요약입니다. 모델 버전·응답 전문·trace 독립 재평가와 장기 안정성은 미검증입니다.')
metric('agreement','Cross-runtime Representative Agreement',3,3,claude,'| Cross-Runtime Functional Agreement | 3/3 = 100% |','대표 기능 유형 3개','기존 Codex V01–V03와 Claude C01–C03 모두 핵심 기능 기대 동작을 충족했습니다.','동일 입력 paired 재실행이나 문장 동일성을 측정한 수치가 아닙니다.')
ui='ai-skill-ui/tests/ui-test-results.json';obj=json.loads(read(ui));assert obj['total']==10 and obj['pass']==10 and obj['fail']==0
metric('ui','UI Tests',obj['pass'],obj['total'],ui,'"pass": 10','UI U01–U10','실제 로컬 Chromium에서 화면, 기능 선택, 예시, 세 결과, Source, 태그, 오류, Demo 표시를 검사했습니다.','실시간 LLM·운영 배포 검증이 아닙니다.')
sync_result=DATA/'guideline-sync.json'
if sync_result.exists():
    sync=json.loads(sync_result.read_text())
    for m in metrics:
        if m['id'] in ['top5','hit5']:
            actual=sync['searchAfter']['metrics'][m['id']]
            m.update(numerator=actual['numerator'],denominator=actual['denominator'],source='ai-skill-ui/data/guideline-sync.json',sourceSha256=sha('ai-skill-ui/data/guideline-sync.json'),reportEvidence=sync['searchAfter']['metricEvidence'][m['id']],limitations='최신 pinned Guideline Index로 다시 실행한 선정 검색 평가; 일반 정확도가 아님.')
paths=['skill/SKILL.md','.codex/skills/gapzero-guide/SKILL.md','claude-skill/SKILL.md','skill/references/control-index.md','skill/references/controls','skill/references/output-formats.md','skill/tests','ai-skill-ui']
assert all((REPO/p).exists() for p in paths)
e03=read('skill/tests/VIRTUAL_CHIBBO_GRC_E2E_E03.md');assert 'D — local verification' in e03 and 'Production E2E: NOT VERIFIED' in e03
(DATA/'showcase.json').write_text(json.dumps(dict(metrics=metrics,artifacts=paths,sources={'skill':'skill/SKILL.md','formats':'skill/references/output-formats.md','e03':'skill/tests/VIRTUAL_CHIBBO_GRC_E2E_E03.md'},snapshots={p:sha(p) for p in ['skill/SKILL.md','skill/references/output-formats.md','skill/tests/VIRTUAL_CHIBBO_GRC_E2E_E03.md']}),ensure_ascii=False,indent=2)+'\n')
print(f'Built {len(controls)} Controls, {len(metrics)} sourced metrics; only UI data written')
