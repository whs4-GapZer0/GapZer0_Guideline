export const responses=['충족','부분 충족','미충족','확인 필요','적용 제외'];
const fields=['response','reason','evidence','noEvidence','absenceReason','action','owner','due','status','outcome','completed','changeReason'];
const metaFields=['scope','start','end','assessor','date'];
export const blank=()=>Object.fromEntries(fields.map(k=>[k,k==='noEvidence'?false:'']));
const has=x=>typeof x==='string'&&x.trim().length>0;
export const actionType=r=>r.response==='확인 필요'?'추가 확인':['부분 충족','미충족'].includes(r.response)?'개선':has(r.action)?'개선':'';
const dateOK=x=>/^\d{4}-\d{2}-\d{2}$/.test(x)&&!Number.isNaN(Date.parse(x))&&new Date(x).toISOString().slice(0,10)===x;
export function validate(r,meta,history=[]){
 const errors=[];
 for(const [k,label] of [['scope','평가 범위'],['assessor','평가 담당자']])if(!has(meta[k]))errors.push(label+'를 입력하세요.');
 for(const [k,label] of [['start','평가 시작일'],['end','평가 종료일'],['date','평가일']])if(!dateOK(meta[k]))errors.push(label+'을 입력하세요.');
 if(meta.start>meta.end)errors.push('평가기간의 시작일은 종료일 이후일 수 없습니다.');
 if(!responses.includes(r.response))errors.push('담당자 응답을 선택하세요.');
 if(!has(r.reason))errors.push('판단 근거를 입력하세요.');
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
 if(history.length&&!has(r.changeReason))errors.push('재평가 변경 사유를 입력하세요.');
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
 if(!raw||typeof raw!=='object')throw Error('평가 기본정보가 없습니다.');
 return Object.fromEntries(metaFields.map(k=>{const v=raw[k]??'';if(typeof v!=='string'||v.length>20000)throw Error('기본정보 형식 오류');return [k,v];}));
}
export function parseState(raw,bank){
 if(!raw||raw.schema!==1||raw.bank!==bank.version)throw Error('질문은행 버전이 다른 백업입니다.');
 const ids=new Set(bank.questions.map(q=>q.id));
 const records={},history={};
 for(const [id,r] of Object.entries(raw.records||{})){if(!ids.has(id))throw Error('알 수 없는 Question ID: '+id);records[id]=cleanRecord(r);}
 for(const [id,list] of Object.entries(raw.history||{})){
  if(!ids.has(id)||!Array.isArray(list)||list.length>1000)throw Error('이력 형식 오류');
  history[id]=list.map(h=>{
   if(!h||typeof h.savedAt!=='string'||!Number.isFinite(Date.parse(h.savedAt)))throw Error('이력 날짜 오류');
   const record=cleanRecord(h.record),meta=cleanMeta(h.meta);
   if(validate(record,meta,[]).length)throw Error('필수 항목이 누락된 확정 이력이 있습니다.');
   return {savedAt:h.savedAt,record,meta};
  });
 }
 return {schema:1,bank:bank.version,meta:cleanMeta(raw.meta),records,history};
}
export async function mount(root){
 const el=(tag,text,attrs={})=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);return e;};
 let bank;
 try{const response=await fetch(root.dataset.questions);if(!response.ok)throw Error(response.status);bank=await response.json();}
 catch{root.replaceChildren(el('p','질문을 불러오지 못했습니다. 연결을 확인하고 페이지를 새로고침하세요.',{role:'alert'}));return;}
 if(!root.isConnected)return;
 const key='gapzer0.assessment.'+bank.version;
 let state={schema:1,bank:bank.version,meta:Object.fromEntries(metaFields.map(k=>[k,''])),records:{},history:{}};
 let storageEnabled=true,notice='';
 try{const old=localStorage.getItem(key);if(old)state=parseState(JSON.parse(old),bank);}
 catch{storageEnabled=false;notice='이 브라우저의 저장 기록을 읽지 못했습니다. 기존 기록은 덮어쓰지 않습니다. 작성 결과는 JSON으로 백업하세요.';}
 root.replaceChildren();
 root.append(el('p','입력 내용은 이 브라우저에 임시 저장됩니다. 다른 기기와 공유되지 않으므로 JSON 백업을 내려받아 보관하세요. 증적 파일은 업로드하지 않으며 자료명·링크·위치를 기록합니다.'));
 const message=el('p',notice||'질문을 선택하여 평가를 시작하세요.',{role:'status','aria-live':'polite'});root.append(message);
 function persist(){
  if(!storageEnabled){message.textContent=notice;return false;}
  try{localStorage.setItem(key,JSON.stringify(state));message.textContent='브라우저에 임시 저장했습니다. 평가 기록 확정과는 별개입니다.';return true;}
  catch{message.textContent='브라우저 저장에 실패했습니다. 페이지를 닫기 전에 JSON 백업을 내려받으세요.';return false;}
 }
 function input(label,type,value,change){
  const wrap=el('label',label),field=el(type==='textarea'?'textarea':'input');
  if(type!=='textarea')field.type=type;else field.rows=3;
  field.value=value||'';field.addEventListener('input',()=>change(field.value));wrap.append(field);return wrap;
 }
 const metaPanel=el('fieldset');metaPanel.append(el('legend','평가 기본정보'));
 for(const [k,label,type]of [['scope','평가 범위 (조직·업무·시스템)','text'],['start','평가기간 시작일','date'],['end','평가기간 종료일','date'],['assessor','평가 담당자','text'],['date','평가일','date']])metaPanel.append(input(label,type,state.meta[k],v=>{state.meta[k]=v;persist();summary();}));
 root.append(metaPanel);
 const toolbar=el('div',undefined,{class:'sa-toolbar'});
 function download(){const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));const a=el('a',undefined,{href:url,download:'GapZer0-self-assessment-'+new Date().toISOString().slice(0,10)+'.json'});a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 const exp=el('button','JSON 백업 내려받기',{type:'button'});exp.onclick=download;
 const file=el('input',undefined,{type:'file',accept:'.json,application/json'});const fileLabel=el('label','JSON 백업 불러오기');fileLabel.append(file);
 file.onchange=async()=>{
  try{
   const f=file.files[0];if(!f)return;if(f.size>15*1024*1024)throw Error('15MB 이하의 백업을 선택하세요.');
   const next=parseState(JSON.parse(await f.text()),bank);
   if(!confirm('현재 작성 내용을 불러온 백업으로 교체합니다. 필요한 경우 먼저 JSON 백업을 내려받으세요. 계속할까요?'))return;
   // Persist before replacing the visible state; failures leave the current form intact.
   localStorage.setItem(key,JSON.stringify(next));await mount(root);
  }catch(e){message.textContent='불러오기 실패: '+e.message;}finally{file.value='';}
 };
 toolbar.append(exp,fileLabel);root.append(toolbar);
 const progress=el('p');root.append(progress);
 function summary(){
  let answered=0,confirmed=0;const counts=Object.fromEntries(responses.map(s=>[s,0]));
  for(const q of bank.questions){const r=state.records[q.id];if(r?.response){answered++;counts[r.response]++;}
   const h=state.history[q.id]?.at(-1);if(h&&JSON.stringify(h.record)===JSON.stringify(r)&&JSON.stringify(h.meta)===JSON.stringify(state.meta))confirmed++;
  }
  progress.textContent=`전체 ${bank.questions.length}개 · 응답 ${answered}개 · 미응답 ${bank.questions.length-answered}개 · 현재 입력과 일치하는 확정 기록 ${confirmed}개 / `+responses.map(s=>s+' '+counts[s]).join(' · ');
 }
 function select(label,choices,change){const wrap=el('label',label),s=el('select',undefined,{'aria-label':label});for(const [v,t]of choices)s.append(el('option',t,{value:v}));s.onchange=()=>change(s.value);wrap.append(s);return [wrap,s];}
 let domain='',phase='',status='';const filters=el('div',undefined,{class:'sa-filters'});
 const [dl]=select('Security Domain',[['','전체'],...[...new Set(bank.controls.map(c=>c.domain))].map(d=>[d,d])],v=>{domain=v;refreshControls();});
 const [cl,cs]=select('Control',[],()=>render());
 const [pl]=select('평가 관점',[['','전체'],...['Design','Implementation','Operating Effectiveness'].map(p=>[p,p])],v=>{phase=v;render();});
 const [sl]=select('응답 필터',[['','전체'],['미응답','미응답'],...responses.map(s=>[s,s])],v=>{status=v;render();});
 filters.append(dl,cl,pl,sl);root.append(filters);
 const body=el('div');root.append(body);
 function refreshControls(){const old=cs.value;cs.replaceChildren();for(const c of bank.controls.filter(c=>!domain||c.domain===domain))cs.append(el('option',c.id+' · '+c.name,{value:c.id}));if([...cs.options].some(o=>o.value===old))cs.value=old;render();}
 function render(){
  body.replaceChildren();const control=bank.controls.find(c=>c.id===cs.value);if(!control)return;
  body.append(el('h3',control.id+' · '+control.name));
  const details=el('details'),evidence=el('p',control.evidence,{class:'sa-preserve'});details.append(el('summary','평가 증적 안내 보기'),evidence);body.append(details);
  const guide=el('a','Implementation Guide 원문',{href:control.guide,target:'_blank',rel:'noopener noreferrer'});body.append(guide);
  const list=bank.questions.filter(q=>q.control===control.id&&(!phase||q.phase===phase)&&(!status||(state.records[q.id]?.response||'미응답')===status));
  if(!list.length)body.append(el('p','선택한 조건에 해당하는 질문이 없습니다.'));
  for(const q of list){
   const r=state.records[q.id]||(state.records[q.id]=blank()),history=state.history[q.id]||[];
   const card=el('section',undefined,{class:'sa-question'});card.append(el('h4',q.id));card.append(el('strong',q.phase,{class:'sa-phase '+(q.phase==='Design'?'sa-design':q.phase==='Implementation'?'sa-implementation':'sa-operating')}));card.append(el('p',q.text));
   const errors=el('div',undefined,{role:'alert',tabindex:'-1'});
   const changed=()=>{persist();summary();};
   const [rl,rs]=select('담당자 응답 (필수)',[['','선택하세요'],...responses.map(v=>[v,v])],v=>{r.response=v;changed();conditional();});rs.value=r.response;card.append(rl);
   card.append(input('판단 근거 (필수)','textarea',r.reason,v=>{r.reason=v;changed();}));
   card.append(input('확인한 증적 — 자료명·파일/링크·버전·기간·해당 위치','textarea',r.evidence,v=>{r.evidence=v;changed();}));
   const checkLabel=el('label','확인한 증적 없음 (미충족·확인 필요에 한함)'),check=el('input',undefined,{type:'checkbox'});check.checked=r.noEvidence;check.onchange=()=>{r.noEvidence=check.checked;changed();conditional();};checkLabel.prepend(check);card.append(checkLabel);
   const absent=input('증적이 없는 사유 (미충족에서 증적 없음 선택 시 필수)','textarea',r.absenceReason,v=>{r.absenceReason=v;changed();});card.append(absent);
   const action=el('fieldset'),legend=el('legend');action.append(legend);
   for(const [k,label,type]of [['action','조치 내용','textarea'],['owner','조치 담당자','text'],['due','완료 예정일','date']])action.append(input(label,type,r[k],v=>{r[k]=v;changed();}));
   const [st,ss]=select('진행 상태',[['','선택하세요'],...['예정','진행 중','완료'].map(v=>[v,v])],v=>{r.status=v;changed();conditional();});ss.value=r.status;action.append(st);
   const completion=el('div');completion.append(input('완료일 (완료 시 필수)','date',r.completed,v=>{r.completed=v;changed();}),input('완료 결과·증적 (완료 시 필수)','textarea',r.outcome,v=>{r.outcome=v;changed();}));action.append(completion);card.append(action);
   const change=input('재평가 변경 사유 (이전 확정 기록이 있는 경우 필수)','textarea',r.changeReason,v=>{r.changeReason=v;changed();});change.hidden=!history.length;card.append(change);
   function conditional(){checkLabel.hidden=!r.noEvidence&&!['미충족','확인 필요'].includes(r.response);absent.hidden=!r.noEvidence;legend.textContent=(r.response==='확인 필요'?'추가 확인 계획 (필수)':['부분 충족','미충족'].includes(r.response)?'개선계획 (필수)':'개선조치 (선택)');completion.hidden=r.status!=='완료';}
   conditional();
   const save=el('button',history.length?'재평가 기록 확정':'평가 기록 확정',{type:'button'});
   save.onclick=()=>{
    const issues=validate(r,state.meta,history);errors.replaceChildren();
    if(issues.length){for(const issue of issues)errors.append(el('p',issue));errors.focus();return;}
    const prev=history.at(-1);if(prev&&JSON.stringify(prev.record)===JSON.stringify(r)&&JSON.stringify(prev.meta)===JSON.stringify(state.meta)){message.textContent='변경사항이 없습니다.';return;}
    if(!state.history[q.id])state.history[q.id]=[];
    state.history[q.id].push({savedAt:new Date().toISOString(),record:structuredClone(r),meta:structuredClone(state.meta)});const stored=persist();summary();render();if(stored)message.textContent='평가 기록을 확정했습니다. 조치 완료는 응답을 자동으로 변경하지 않습니다. JSON 백업도 보관하세요.';
   };
   card.append(errors,save);
   if(history.length){const h=el('details');h.append(el('summary',`확정·재평가 이력 ${history.length}건`));for(const entry of history){const p=el('pre',JSON.stringify({평가시각:entry.savedAt,평가정보:entry.meta,평가기록:entry.record},null,2));h.append(p);}card.append(h);}
   body.append(card);
  }
 }
 refreshControls();summary();
}
export function boot(){
 const root=document.getElementById('assessment-app');
 if(root&&!root.dataset.mounted){root.dataset.mounted='true';mount(root).catch(()=>{if(root.isConnected)root.textContent='화면을 초기화하지 못했습니다. 새로고침 후 다시 시도하세요.';});}
}
if(typeof document!=='undefined'){
 boot();document.addEventListener('DOMContentLoaded',boot);document.addEventListener('pjax:complete',boot);
}
