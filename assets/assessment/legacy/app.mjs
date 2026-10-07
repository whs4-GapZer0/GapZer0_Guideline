import {HEADERS,RESPONSES,RECORD_FIELDS,META_FIELDS,MAX_IMPORT_BYTES} from './transfer.mjs';
export const responses=RESPONSES;
const fields=RECORD_FIELDS;
const metaFields=META_FIELDS;
export const blank=()=>Object.fromEntries(fields.map(k=>[k,k==='noEvidence'?false:'']));
const has=x=>typeof x==='string'&&x.trim().length>0;
export const actionType=r=>r.response==='확인 필요'?'추가 확인':['부분 충족','미충족'].includes(r.response)||['action','owner','due','status','outcome','completed'].some(k=>has(r[k]))?'개선':'';
const dateOK=x=>/^\d{4}-\d{2}-\d{2}$/.test(x)&&!Number.isNaN(Date.parse(x))&&new Date(x).toISOString().slice(0,10)===x;
export function validate(r,meta){
 const errors=[];
 for(const [k,label] of [['scope','평가 범위'],['assessor','평가 담당자']])if(!has(meta[k]))errors.push(label+'를 입력하세요.');
 for(const [k,label] of [['start','평가 시작일'],['end','평가 종료일'],['date','평가일']])if(!dateOK(meta[k]))errors.push(label+'을 입력하세요.');
 if(meta.start>meta.end)errors.push('평가기간의 시작일은 종료일 이후일 수 없습니다.');
 if(!responses.includes(r.response))errors.push('담당자 응답을 선택하세요.');
 if(!has(r.reason))errors.push('평가 근거를 입력하세요.');
 const optional=['미충족','확인 필요'].includes(r.response);
 if(r.noEvidence){
  if(!optional)errors.push('이 응답에는 실제로 확인한 증적이 필요합니다.');
  if(r.response==='미충족'&&!has(r.absenceReason))errors.push('증적이 없는 사유를 입력하세요.');
  if(has(r.evidence))errors.push('증적 없음과 확인한 자료를 동시에 기록할 수 없습니다.');
 }else if(!has(r.evidence))errors.push('확인한 증적을 기록하세요. 자료가 없으면 증적 없음을 선택하세요.');
 if(actionType(r)){
  for(const [k,label] of [['action','조치 내용'],['owner','조치 담당자']])if(!has(r[k]))errors.push(label+'을 입력하세요.');
  if(!dateOK(r.due))errors.push('완료 예정일을 입력하세요.');
  if(!['예정','진행 중','완료'].includes(r.status))errors.push('진행 상태를 선택하세요.');
  if(r.status==='완료'){
   if(!has(r.outcome))errors.push('완료 결과·증적을 입력하세요.');
   if(!dateOK(r.completed))errors.push('완료일을 입력하세요.');
  }
 }
 return errors;
}
function cleanRecord(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('평가 기록 형식이 올바르지 않습니다.');
 const r=blank();
 for(const k of fields){
  const v=raw[k]??r[k];
  if(k==='noEvidence'?typeof v!=='boolean':typeof v!=='string'||v.length>20000)throw Error('입력값 형식 또는 길이를 확인하세요.');
  r[k]=v;
 }
 if(r.response&&!responses.includes(r.response))throw Error('알 수 없는 평가 응답입니다.');
 if(r.status&&!['예정','진행 중','완료'].includes(r.status))throw Error('알 수 없는 진행 상태입니다.');
 return r;
}
function cleanMeta(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('평가 기본정보가 없습니다.');
 return Object.fromEntries(metaFields.map(k=>{const v=raw[k]??'';if(typeof v!=='string'||v.length>20000)throw Error('기본정보 형식 오류');return [k,v];}));
}
export function parseState(raw,bank){
 if(!raw||![1,2].includes(raw.schema)||raw.bank!==bank.version)throw Error('저장 형식 또는 평가 질문 버전이 다릅니다.');
 const ids=new Set(bank.questions.map(q=>q.id));
 const records={};
 if(!raw.records||typeof raw.records!=='object'||Array.isArray(raw.records))throw Error('평가 기록 형식 오류');
 for(const [id,r] of Object.entries(raw.records||{})){if(!ids.has(id))throw Error('알 수 없는 Question ID: '+id);records[id]=cleanRecord(r);}
 return {schema:2,bank:bank.version,meta:cleanMeta(raw.meta),records};
}

export const hasDraft=r=>!!r&&fields.some(k=>k==='noEvidence'?r[k]===true:has(r[k]));
export function exportRows(bank,state,empty=false){
 const controls=new Map(bank.controls.map(c=>[c.id,c]));
 return bank.questions.filter(q=>empty||hasDraft(state.records[q.id])).map(q=>{
  const c=controls.get(q.control),r=empty?blank():(state.records[q.id]||blank()),m=empty?{}:state.meta;
  return [c.id,c.name,c.domain,q.id,q.phase,q.text,c.evidence,r.response,r.reason,r.evidence,r.noEvidence?'예':'',r.absenceReason,actionType(r),r.action,r.owner,r.due,r.status,r.completed,r.outcome,m.scope,m.start,m.end,m.assessor,m.date];
 });
}
export async function mount(root){
 const el=(tag,text,attrs={})=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);return e;};
 let bank;
 try{const response=await fetch(root.dataset.questions);if(!response.ok)throw Error(response.status);bank=await response.json();}
 catch{root.replaceChildren(el('p','질문을 불러오지 못했습니다. 연결을 확인하고 페이지를 새로고침하세요.',{role:'alert'}));return;}
 if(!root.isConnected)return;
 const legacyKey='gapzer0.assessment.'+bank.version,key=legacyKey+'.template-v2';
 let state={schema:2,bank:bank.version,meta:Object.fromEntries(metaFields.map(k=>[k,''])),records:{}};
 let storageEnabled=true,notice='';
 // Read previous current answers once; keep the old key and its history untouched.
 try{const old=localStorage.getItem(key)??localStorage.getItem(legacyKey);if(old)state=parseState(JSON.parse(old),bank);}
 catch{storageEnabled=false;notice='브라우저 저장 기록을 읽지 못했습니다. 기존 기록은 덮어쓰지 않습니다. 현재 작성 내용은 Excel로 다운로드하여 보관하세요.';}
 root.replaceChildren();
 root.append(el('p','질문별 현재 상태와 개선계획을 작성하세요. 입력한 내용은 이 브라우저에 자동 저장됩니다. 작성 내용 Excel에는 현재 화면에 표시된 질문뿐 아니라, 지금까지 입력한 모든 질문의 작성 내용이 포함됩니다. 빈 템플릿 Excel에는 전체 489개 질문이 포함됩니다. 브라우저 데이터를 삭제하면 기록이 사라질 수 있으므로 작성이 완료된 내용은 Excel로 다운로드하여 보관하는 것을 권장합니다.'));
 const message=el('p',notice||'질문을 선택하여 평가를 시작하세요.',{role:'status','aria-live':'polite'});root.append(message);
 function persist(){
  if(!storageEnabled){message.textContent=notice;return false;}
  try{localStorage.setItem(key,JSON.stringify(state));message.textContent='브라우저에 저장했습니다.';return true;}
  catch{message.textContent='브라우저 저장에 실패했습니다. 페이지를 닫기 전에 작성 내용 Excel를 다운로드하세요.';return false;}
 }
 function input(label,type,value,change){
  const wrap=el('label',label),field=el(type==='textarea'?'textarea':'input');
  if(type!=='textarea')field.type=type;else field.rows=3;
  if(type==='text'||type==='textarea')field.maxLength=20000;
  field.value=value||'';field.addEventListener('input',()=>change(field.value));wrap.append(field);return wrap;
 }
 const metaPanel=el('fieldset');metaPanel.append(el('legend','평가 기본정보'));
 for(const [k,label,type]of [['scope','평가 범위 (조직·업무·시스템)','text'],['start','평가기간 시작일','date'],['end','평가기간 종료일','date'],['assessor','평가 담당자','text'],['date','평가일','date']])metaPanel.append(input(label,type,state.meta[k],v=>{state.meta[k]=v;persist();summary();}));
 root.append(metaPanel);
 const toolbar=el('div',undefined,{class:'sa-toolbar'});
 function saveFile(blob,extension,empty){
  const url=URL.createObjectURL(blob);
  const a=el('a',undefined,{href:url,download:'GapZer0-'+(empty?'assessment-template':'assessment')+'-'+new Date().toISOString().slice(0,10)+'.'+extension});
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 async function download(empty){
  if(!empty&&!bank.questions.some(q=>hasDraft(state.records[q.id]))){message.textContent='다운로드할 작성 내용이 없습니다. 질문에 내용을 입력하거나 빈 템플릿 Excel를 다운로드하세요.';return;}
  try{
   const rows=exportRows(bank,state,empty);
   const {toXlsx}=await import('./excel.mjs');
   if(root.isConnected)saveFile(toXlsx(HEADERS,rows),'xlsx',empty);
  }catch{message.textContent='Excel 파일을 만들지 못했습니다. 작성 내용은 유지됩니다. 다시 시도하세요.';}
 }
 const saveBrowser=el('button','브라우저에 저장',{type:'button'});saveBrowser.onclick=persist;
 const exp=el('button','작성 내용 Excel 다운로드하기',{type:'button'});exp.onclick=()=>download(false);
 const template=el('button','빈 템플릿 Excel 다운로드하기',{type:'button'});template.onclick=()=>download(true);
 toolbar.append(saveBrowser,exp,template);root.append(toolbar);
 root.append(el('p','Excel(.xlsx) 파일에는 평가 기록 시트 하나가 포함됩니다. 색상·필터·고정 행·선택 목록을 이용해 작성한 뒤 같은 Excel 파일을 바로 불러올 수 있습니다.'));
 const importArea=el('fieldset',undefined,{class:'sa-import'});importArea.append(el('legend','PC의 Excel 파일 불러오기'));
 importArea.append(el('p','파일은 브라우저에서만 읽으며 서버로 전송하지 않습니다. 불러오기를 확정하면 현재 평가 전체가 Excel 내용으로 교체됩니다. 먼저 기존 작성 내용 Excel를 보관하세요.'));
 const fileLabel=el('label','Excel 파일 선택 (최대 25MB)'),fileInput=el('input',undefined,{type:'file',accept:'.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});fileLabel.append(fileInput);
 const preview=el('div',undefined,{role:'status','aria-live':'polite'});
 const apply=el('button','Excel 내용으로 교체하기',{type:'button'}),cancel=el('button','불러오기 취소',{type:'button'});
 apply.hidden=true;cancel.hidden=true;let pendingImport=null,importSequence=0;
 const clearImport=()=>{importSequence++;pendingImport=null;fileInput.value='';preview.replaceChildren();apply.hidden=true;cancel.hidden=true;};
 cancel.onclick=clearImport;
 fileInput.onchange=async()=>{
  const sequence=++importSequence;pendingImport=null;apply.hidden=true;cancel.hidden=true;preview.replaceChildren();
  const file=fileInput.files[0];if(!file)return;
  try{
   if(!/\.xlsx$/i.test(file.name))throw Error('Excel(.xlsx) 파일을 선택하세요.');
   if(file.size>MAX_IMPORT_BYTES)throw Error('Excel 파일은 25MB 이하만 불러올 수 있습니다.');
   const buffer=await file.arrayBuffer();if(sequence!==importSequence||!root.isConnected)return;
   const {importXlsx}=await import('./excel-import.mjs');
   const parsed=await importXlsx(buffer,bank);
   if(sequence!==importSequence||!root.isConnected)return;
   pendingImport=parsed;
   preview.append(el('p',`${file.name}: 작성한 질문 ${parsed.count}개를 불러올 수 있습니다.`));
   preview.append(el('p',`평가 범위: ${parsed.state.meta.scope||'미입력'} / 평가 담당자: ${parsed.state.meta.assessor||'미입력'} / 평가일: ${parsed.state.meta.date||'미입력'}`));
   if(parsed.changedQuestions)preview.append(el('p',`현재 사이트와 질문 문구가 다른 항목이 ${parsed.changedQuestions}개 있습니다. 질문과 Evidence는 사이트의 최신 내용을 사용하므로 불러온 응답과 평가 근거를 다시 확인하세요.`));
   preview.append(el('p','파일에 없는 질문의 기존 기록도 지워집니다. 취소하면 현재 기록을 유지합니다.'));
   apply.hidden=false;cancel.hidden=false;
  }catch(error){if(sequence===importSequence&&root.isConnected)preview.append(el('p',error.message));}
 };
 apply.onclick=()=>{
  if(!pendingImport)return;
  const currentCount=Object.values(state.records).filter(hasDraft).length;
  if(!confirm(`현재 작성한 질문 ${currentCount}개와 평가 기본정보를 Excel의 ${pendingImport.count}개 질문 및 기본정보로 교체합니다. 파일에 없는 기존 기록도 삭제됩니다. 계속할까요?`))return;
  const next=pendingImport.state,count=pendingImport.count;
  // Commit to localStorage first. A quota/security error leaves memory and UI unchanged.
  try{localStorage.setItem(key,JSON.stringify(next));}catch{preview.append(el('p','브라우저에 저장하지 못해 불러오기를 적용하지 않았습니다. 현재 작성 내용은 유지됩니다.'));return;}
  state=next;storageEnabled=true;notice='';clearImport();
  [...metaPanel.querySelectorAll('input')].forEach((field,i)=>{field.value=state.meta[metaFields[i]];});
  domain='';phase='';status='';for(const field of filters.querySelectorAll('select'))field.value='';
  refreshControls();summary();message.textContent=`Excel의 작성 내용 ${count}개를 불러와 이 브라우저에 저장했습니다. 평가 질문별 작성 내용 점검으로 누락된 항목을 확인하세요.`;
 };
 importArea.append(fileLabel,preview,apply,cancel);root.append(importArea);
 const resetArea=el('div',undefined,{class:'sa-reset-area'});
 const reset=el('button','작성 내용 초기화',{type:'button',class:'sa-reset'});
 reset.onclick=()=>{
  if(!confirm('평가 기본정보와 모든 질문의 작성 내용 및 브라우저 저장 기록을 초기화합니다. 복구할 수 없으므로 필요한 내용은 먼저 Excel로 다운로드해 주세요. 초기화할까요?'))return;
  try{
   // Remove only this assessment's current and legacy records, not other site data.
   localStorage.removeItem(legacyKey);
   localStorage.removeItem(key);
  }catch{
   message.textContent='브라우저 저장 기록을 지우지 못해 초기화를 완료하지 않았습니다. 현재 입력은 유지됩니다. 필요한 내용은 Excel로 다운로드하세요.';
   return;
  }
  state={schema:2,bank:bank.version,meta:Object.fromEntries(metaFields.map(k=>[k,''])),records:{}};
  clearImport();
  storageEnabled=true;notice='';
  for(const field of metaPanel.querySelectorAll('input'))field.value='';
  domain='';phase='';status='';
  for(const field of filters.querySelectorAll('select'))field.value='';
  refreshControls();summary();
  message.textContent='평가 기본정보와 모든 질문의 작성 내용 및 브라우저 저장 기록을 초기화했습니다.';
 };
 resetArea.append(reset);root.append(resetArea);
 const progress=el('p');root.append(progress);
 function summary(){
  const answered=bank.questions.filter(q=>state.records[q.id]?.response).length;
  progress.textContent=`전체 ${bank.questions.length}개 · 응답 ${answered}개 · 미응답 ${bank.questions.length-answered}개`;
 }
 function select(label,choices,change){const wrap=el('label',label),s=el('select',undefined,{'aria-label':label});for(const [v,t]of choices)s.append(el('option',t,{value:v}));s.onchange=()=>change(s.value);wrap.append(s);return [wrap,s];}
 let domain='',phase='',status='';const filters=el('div',undefined,{class:'sa-filters'});
 const [dl]=select('Security Domain',[['','전체'],...[...new Set(bank.controls.map(c=>c.domain))].map(d=>[d,d])],v=>{domain=v;refreshControls();});
 const [cl,cs]=select('Control',[],()=>render());
 const [pl]=select('평가 관점',[['','전체'],...['Design','Implementation','Operating Effectiveness'].map(p=>[p,p])],v=>{phase=v;render();});
 const [sl]=select('평가 결과 필터링',[['','전체'],['미응답','미응답'],...responses.map(s=>[s,s])],v=>{status=v;render();});
 filters.append(dl,cl,pl,sl);root.append(filters);
 const body=el('div');root.append(body);
 function refreshControls(){const old=cs.value;cs.replaceChildren();for(const c of bank.controls.filter(c=>!domain||c.domain===domain))cs.append(el('option',c.id+' · '+c.name,{value:c.id}));if([...cs.options].some(o=>o.value===old))cs.value=old;render();}
 function render(){
  body.replaceChildren();const control=bank.controls.find(c=>c.id===cs.value);if(!control)return;
  body.append(el('h3',control.id+' · '+control.name));
  const details=el('details'),evidence=el('p',control.evidence,{class:'sa-preserve'});details.append(el('summary','Evidence 안내 보기'),evidence);body.append(details);
  const guide=el('a','Implementation Guide 원문',{href:control.guide,target:'_blank',rel:'noopener noreferrer'});body.append(guide);
  const list=bank.questions.filter(q=>q.control===control.id&&(!phase||q.phase===phase)&&(!status||(state.records[q.id]?.response||'미응답')===status));
  if(!list.length)body.append(el('p','선택한 조건에 해당하는 질문이 없습니다.'));
  for(const q of list){
   const r=state.records[q.id]||(state.records[q.id]=blank());
   const card=el('section',undefined,{class:'sa-question'});card.append(el('h4',q.id));card.append(el('strong',q.phase,{class:'sa-phase '+(q.phase==='Design'?'sa-design':q.phase==='Implementation'?'sa-implementation':'sa-operating')}));card.append(el('p',q.text));
   const errors=el('div',undefined,{role:'alert',tabindex:'-1'});
   const changed=()=>{errors.replaceChildren();persist();summary();};
   const [rl,rs]=select('담당자 응답 (필수)',[['','선택하세요'],...responses.map(v=>[v,v])],v=>{r.response=v;changed();conditional();});rs.value=r.response;card.append(rl);
   card.append(input('평가 근거 (필수)','textarea',r.reason,v=>{r.reason=v;changed();}));
   card.append(input('확인한 증적 — 자료명·파일 보관 위치/링크·버전·기간·해당 위치','textarea',r.evidence,v=>{r.evidence=v;changed();}));
   const checkLabel=el('label','확인한 증적 없음 (미충족·확인 필요에 한함)'),check=el('input',undefined,{type:'checkbox'});check.checked=r.noEvidence;check.onchange=()=>{r.noEvidence=check.checked;changed();conditional();};checkLabel.prepend(check);card.append(checkLabel);
   const absent=input('증적이 없는 사유 (미충족에서 증적 없음 선택 시 필수)','textarea',r.absenceReason,v=>{r.absenceReason=v;changed();});card.append(absent);
   const action=el('fieldset'),legend=el('legend');action.append(legend);
   for(const [k,label,type]of [['action','조치 내용','textarea'],['owner','조치 담당자','text'],['due','완료 예정일','date']])action.append(input(label,type,r[k],v=>{r[k]=v;changed();}));
   const [st,ss]=select('진행 상태',[['','선택하세요'],...['예정','진행 중','완료'].map(v=>[v,v])],v=>{r.status=v;changed();conditional();});ss.value=r.status;action.append(st);
   const completion=el('div');completion.append(input('완료일 (완료 시 필수)','date',r.completed,v=>{r.completed=v;changed();}),input('완료 결과·증적 (완료 시 필수)','textarea',r.outcome,v=>{r.outcome=v;changed();}));action.append(completion);card.append(action);
   function conditional(){checkLabel.hidden=!r.noEvidence&&!['미충족','확인 필요'].includes(r.response);absent.hidden=!r.noEvidence;legend.textContent=(r.response==='확인 필요'?'추가 확인 계획 (필수)':['부분 충족','미충족'].includes(r.response)?'개선계획 (필수)':'개선조치 (선택)');completion.hidden=r.status!=='완료';}
   conditional();
   const save=el('button','작성 내용 점검',{type:'button'});
   save.onclick=()=>{
    const issues=validate(r,state.meta);errors.replaceChildren();
    if(issues.length){for(const issue of issues)errors.append(el('p',issue));errors.focus();return;}
    errors.append(el('p','필수 입력 항목을 모두 작성했습니다. 응답의 적절성은 담당자가 확인하세요.',{class:'sa-validation-ok'}));
   };
   card.append(errors,save);
   body.append(card);
  }
 }
 refreshControls();summary();
}
export function boot(){
 const root=document.getElementById('assessment-app');
 if(root&&!root.dataset.mounted){root.dataset.mounted='true';mount(root).catch(()=>{if(root.isConnected)root.textContent='자가진단 화면을 불러오지 못했습니다. 새로고침 후 다시 시도하세요.';});}
}
