"""Build presentation snapshots from canonical sources, without editing them."""
from pathlib import Path
import re,json,hashlib,html
ROOT=Path(__file__).resolve().parent
REPO=ROOT.parent
specs=[('guide','직원이 퇴사하면 계정과 접근권한을 어떻게 회수해야 하나요?',['IAM-C-01','IAM-C-03','HRS-C-01','PHY-C-02']),('plan','CON-C-01을 적용하기 위한 이행계획을 만들어주세요.',['CON-C-01']),('document','클라우드 외주 공급자 도입 전 보안 검토 절차를 작성해주세요.',['SUP-C-06','SUP-E-05','SUP-E-02','SUP-C-02','SUP-C-05','SUP-C-04','SUP-C-07','SUP-C-03','SUP-C-08'])]
index=(REPO/'skill/references/control-index.md').read_text()
data=[]
for mode,question,ids in specs:
    controls=[]
    for cid in ids:
        match=re.search(r'^## '+cid+r' — (.+)\n([\s\S]*?)(?=^## |\Z)',index,re.M)
        assert match,cid
        source=re.search(r'\*\*원문 위치:\*\* `([^`]+)`',match[2])[1]
        path=REPO/'skill'/source.split('#')[0]
        section=re.search(r'^## '+cid+r'\s*\n([\s\S]*?)(?=^## |\Z)',path.read_text(),re.M)[1]
        source_dir=ROOT/'sources'; source_dir.mkdir(exist_ok=True)
        source_html='<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+cid+' · GapZer0 source</title><style>body{max-width:960px;margin:40px auto;padding:0 24px;font:16px/1.7 sans-serif;color:#172d37}pre{white-space:pre-wrap;overflow-wrap:anywhere}a{color:#156b71}</style><a href="../">← UI Demo</a><h1 id="'+cid.lower()+'">'+cid+'</h1><p>가이드라인 원문 snapshot · '+html.escape(source)+'</p><p>조직 적용 조건을 확인해야 합니다. 이 자료는 인증·법적 충족 판정이 아닙니다.</p><pre>'+html.escape('## '+cid+'\n\n'+section)+'</pre></html>'
        (source_dir/(cid.lower()+'.html')).write_text(source_html)
        fields={m[1]:m[2].strip().removesuffix('---').strip() for m in re.finditer(r'^### (.+)\n([\s\S]*?)(?=^### |\Z)',section,re.M)}
        assert fields['Control Name']==match[1]
        controls.append(dict(id=cid,name=fields['Control Name'],domain=fields['Security Domain'],classification=fields['Control Class'],source=source,fields=fields,sha256=hashlib.sha256(path.read_bytes()).hexdigest(),conditional=cid=='PHY-C-02'))
    data.append(dict(mode=mode,question=question,controls=controls))
(ROOT/'demo-data.json').write_text(json.dumps(dict(type='curated-demo-not-live-ai',scenarios=data),ensure_ascii=False,indent=2)+'\n')
print('Generated 3 scenarios / 14 Control records from verified index and actual sources')
