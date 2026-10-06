// Workbook data is read locally. Import is all-or-nothing; callers confirm before saving.
export const MAX_IMPORT_BYTES=25*1024*1024;
export const RESPONSES=['충족','부분 충족','미충족','확인 필요','적용 제외'];
export const RECORD_FIELDS=['response','reason','evidence','noEvidence','absenceReason','action','owner','due','status','outcome','completed'];
export const META_FIELDS=['scope','start','end','assessor','date'];
export const HEADERS=['Control ID','Control Name','Security Domain','Question ID','평가 관점','Assessment Question','Evidence','담당자 응답','평가 근거','확인한 증적','확인한 증적 없음','증적이 없는 사유','조치 유형','개선계획 또는 추가 확인 계획','조치 담당자','완료 예정일','진행 상태','완료일','완료 결과·증적','평가 범위','평가기간 시작일','평가기간 종료일','평가 담당자','평가일'];
const aliases={'평가 증적':'Evidence','판단 근거':'평가 근거'};
const recordColumns={response:'담당자 응답',reason:'평가 근거',evidence:'확인한 증적',absenceReason:'증적이 없는 사유',action:'개선계획 또는 추가 확인 계획',owner:'조치 담당자',due:'완료 예정일',status:'진행 상태',outcome:'완료 결과·증적',completed:'완료일'};
const metaColumns={scope:'평가 범위',start:'평가기간 시작일',end:'평가기간 종료일',assessor:'평가 담당자',date:'평가일'};
const dateOK=value=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;

export function importRows(input,bank){
 if(!Array.isArray(input)||input.length>1000)throw Error('평가 기록 행이 너무 많거나 형식이 올바르지 않습니다.');
 const rows=input.map(row=>{
  if(!Array.isArray(row)||row.length!==HEADERS.length)throw Error('평가 기록 열 개수가 맞지 않습니다.');
  return row.map(v=>{if(typeof v!=='string'||v.length>32767||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v))throw Error('지원하지 않는 셀 내용입니다.');return v;});
 });
 if(rows.length<2)throw Error('Excel에 평가 질문이 없습니다.');
 const headers=rows.shift().map(h=>aliases[h.trim()]||h.trim());
 if(headers.length!==HEADERS.length||new Set(headers).size!==headers.length||HEADERS.some(h=>!headers.includes(h)))throw Error('Excel 열 이름이 맞지 않습니다. 이 사이트에서 다운로드한 Excel의 평가 기록 시트를 사용하세요.');
 if(rows.length>bank.questions.length)throw Error('현재 평가 질문 수보다 Excel 행이 많습니다.');
 const index=Object.fromEntries(headers.map((h,i)=>[h,i]));
 const questions=new Map(bank.questions.map(q=>[q.id,q]));
 const records={},meta=Object.fromEntries(META_FIELDS.map(k=>[k,''])),seen=new Set();let changedQuestions=0;
 for(let i=0;i<rows.length;i++){
  const row=rows[i],at=`Excel ${i+2}행: `;
  if(row.length!==headers.length)throw Error(at+'열 개수가 맞지 않습니다.');
  const get=h=>row[index[h]];
  const id=get('Question ID').trim(),q=questions.get(id);
  if(!q)throw Error(at+'현재 평가 질문 목록에 없는 Question ID입니다: '+id);
  if(seen.has(id))throw Error(at+'Question ID가 중복됩니다: '+id);
  seen.add(id);
  if(get('Control ID').trim()!==q.control||get('평가 관점').trim()!==q.phase)throw Error(at+'Control ID 또는 평가 관점이 현재 질문과 다릅니다.');
  // Question wording and Evidence always come from the current site, never the file.
  if(get('Assessment Question').replace(/\r\n/g,'\n')!==q.text.replace(/\r\n/g,'\n'))changedQuestions++;
  const r={};
  for(const [k,h]of Object.entries(recordColumns)){r[k]=get(h);if(r[k].length>20000)throw Error(at+h+'는 20,000자 이하로 작성하세요.');}
  r.response=r.response.trim();r.status=r.status.trim();
  const noEvidence=get('확인한 증적 없음').trim();
  if(!['','예','아니오'].includes(noEvidence))throw Error(at+'확인한 증적 없음은 예 또는 빈칸으로 작성하세요.');
  r.noEvidence=noEvidence==='예';
  if(r.response&&!RESPONSES.includes(r.response))throw Error(at+'담당자 응답 값이 올바르지 않습니다.');
  if(r.status&&!['예정','진행 중','완료'].includes(r.status))throw Error(at+'진행 상태 값이 올바르지 않습니다.');
  for(const k of ['due','completed']){r[k]=r[k].trim();if(r[k]&&!dateOK(r[k]))throw Error(at+'날짜는 YYYY-MM-DD 형식으로 작성하세요.');}
  for(const [k,h]of Object.entries(metaColumns)){
   const v=get(h);if(v.length>20000)throw Error(at+h+'가 너무 깁니다.');
   if(['start','end','date'].includes(k)&&v&&!dateOK(v))throw Error(at+h+'는 YYYY-MM-DD 형식으로 작성하세요.');
   if(meta[k]&&v&&meta[k]!==v)throw Error(at+'평가 기본정보가 다른 행과 다릅니다: '+h);
   if(v)meta[k]=v;
  }
  if(RECORD_FIELDS.some(k=>k==='noEvidence'?r[k]:r[k].trim()))records[id]=r;
 }
 if(meta.start&&meta.end&&meta.start>meta.end)throw Error('평가기간의 시작일은 종료일 이후일 수 없습니다.');
 const count=Object.keys(records).length;
 if(!count)throw Error('불러올 작성 내용이 없습니다. 빈 템플릿 대신 작성한 Excel를 선택하세요.');
 return {state:{schema:2,bank:bank.version,meta,records},count,changedQuestions};
}
