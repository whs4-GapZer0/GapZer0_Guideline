export const MAX_IMPORT_BYTES=25*1024*1024;
export const RESPONSES=['충족','부분 충족','미충족','적용 제외'];
export const RECORD_FIELDS=['response','reason','evidence','action','owner','due','status'];
export const META_FIELDS=['scope','start','end','assessor','date'];
export const META_LABELS=['평가 범위','평가기간 시작일','평가기간 종료일','평가 담당자','평가일'];
export const HEADERS=['Control ID','Control Name','평가 결과','평가 근거','확인한 증적','개선조치','조치 담당자','완료 예정일','진행 상태'];
export const FORMAT='GapZer0 Control Assessment v1';
export const STORAGE_KEY='gapzer0.assessment.controls.v1';
export const blank=()=>Object.fromEntries(RECORD_FIELDS.map(k=>[k,'']));
export const hasDraft=r=>!!r&&RECORD_FIELDS.some(k=>typeof r[k]==='string'&&r[k].trim());
export const dateOK=v=>/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
export const emptyState=bank=>({schema:3,bank:bank.version,meta:Object.fromEntries(META_FIELDS.map(k=>[k,''])),records:{}});
function text(v){if(typeof v!=='string'||v.length>20000||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v))throw Error('입력값 형식 또는 길이를 확인하세요.');return v;}
export function cleanMeta(raw){
 const m=Object.fromEntries(META_FIELDS.map(k=>[k,text(raw?.[k]??'')]));
 for(const k of ['start','end','date'])if(m[k]&&!dateOK(m[k]))throw Error('날짜는 YYYY-MM-DD 형식으로 작성하세요.');
 if(m.start&&m.end&&m.start>m.end)throw Error('평가기간 시작일은 종료일 이후일 수 없습니다.');return m;
}
export function cleanRecord(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('평가 기록 형식이 올바르지 않습니다.');
 const r=Object.fromEntries(RECORD_FIELDS.map(k=>[k,text(raw[k]??'')]));
 r.response=r.response.trim();r.status=r.status.trim();r.due=r.due.trim();
 if(r.response&&!RESPONSES.includes(r.response))throw Error('평가 결과는 충족·부분 충족·미충족·적용 제외 중 선택하세요.');
 if(r.status&&!['예정','진행 중','완료'].includes(r.status))throw Error('진행 상태는 예정·진행 중·완료 중 선택하세요.');
 if(r.due&&!dateOK(r.due))throw Error('완료 예정일은 YYYY-MM-DD 형식으로 작성하세요.');return r;
}
export function parseState(raw,bank){
 if(raw?.schema!==3||raw.bank!==bank.version)throw Error('저장된 평가 형식 또는 통제 버전이 다릅니다.');
 if(!raw.records||typeof raw.records!=='object'||Array.isArray(raw.records))throw Error('평가 기록 형식 오류');
 const state=emptyState(bank),ids=new Set(bank.controls.map(c=>c.id));state.meta=cleanMeta(raw.meta);
 for(const [id,r] of Object.entries(raw.records)){if(!ids.has(id))throw Error('알 수 없는 Control ID: '+id);state.records[id]=cleanRecord(r);}return state;
}
export function validate(r,m){
 const errors=[];
 for(const [k,label] of [['scope','평가 범위'],['assessor','평가 담당자']])if(!m[k]?.trim())errors.push(label+'를 입력하세요.');
 for(const [k,label] of [['start','평가기간 시작일'],['end','평가기간 종료일'],['date','평가일']])if(!dateOK(m[k]||''))errors.push(label+'을 입력하세요.');
 if(m.start>m.end)errors.push('평가기간을 확인하세요.');
 if(!RESPONSES.includes(r.response))errors.push('평가 결과를 선택하세요.');
 if(!r.reason?.trim())errors.push(r.response==='적용 제외'?'평가 근거에 적용 제외 사유를 작성하세요.':'평가 근거를 입력하세요.');
 if(r.response!=='미충족'&&!r.evidence?.trim())errors.push('확인한 증적을 기록하세요.');
 if(['부분 충족','미충족'].includes(r.response)||['action','owner','due','status'].some(k=>r[k]?.trim())){
  for(const [k,label] of [['action','개선조치'],['owner','조치 담당자'],['status','진행 상태']])if(!r[k]?.trim())errors.push(label+'를 입력하세요.');
  if(!dateOK(r.due||''))errors.push('완료 예정일을 입력하세요.');
 }return errors;
}
export function exportRows(bank,state,empty=false){return bank.controls.filter(c=>empty||hasDraft(state.records[c.id])).map(c=>[c.id,c.name,...RECORD_FIELDS.map(k=>empty?'':state.records[c.id]?.[k]||'')]);}
export function importRows(input,bank,meta){
 if(!Array.isArray(input)||input.length<2||input.length>bank.controls.length+1)throw Error('평가 기록의 행 수가 올바르지 않습니다.');
 const [headers,...rows]=input;
 if(headers.length!==9||HEADERS.some((h,i)=>headers[i]!==h))throw Error('9개 열의 이름과 순서를 유지하세요. 새 Control 자가진단 템플릿을 사용하세요.');
 const controls=new Map(bank.controls.map(c=>[c.id,c])),seen=new Set(),state=emptyState(bank);state.meta=cleanMeta(meta);let changedNames=0;
 for(const row of rows){
  if(!Array.isArray(row)||row.length!==9)throw Error('평가 기록 열 개수가 맞지 않습니다.');
  row.forEach(text);const id=row[0].trim(),control=controls.get(id);
  if(!control)throw Error('현재 목록에 없는 Control ID: '+id);
  if(seen.has(id))throw Error('Control ID가 중복됩니다: '+id);seen.add(id);
  if(row[1]!==control.name)changedNames++;
  const r=cleanRecord(Object.fromEntries(RECORD_FIELDS.map((k,i)=>[k,row[i+2]])));
  if(hasDraft(r))state.records[id]=r;
 }
 const count=Object.keys(state.records).length;
 if(!count)throw Error('불러올 Control 작성 내용이 없습니다. 작성한 Excel 파일을 선택하세요.');
 return {state,count,changedNames};
}
