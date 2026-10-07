import {RESPONSES,HEADERS,META_FIELDS,META_LABELS,STORAGE_KEY,MAX_IMPORT_BYTES,blank,hasDraft,emptyState,parseState,validate,exportRows} from './transfer.mjs?v=control2';
export {validate,exportRows,parseState,hasDraft} from './transfer.mjs?v=control2';
const criteria=[
 ['충족','조직에 적용되는 Implementation Guide의 활동을 모두 이행하고 있으며, 관련 Evidence가 현재 운영 상태를 반영하고 이행 사실을 확인할 수 있는 상태'],
 ['부분 충족','핵심 활동은 이행하고 있으나, 일부 활동이 미흡하거나 Evidence의 누락·최신성·확인 가능성에 보완이 필요한 상태'],
 ['미충족','통제 목적을 달성하기 위한 핵심 활동이 이행되지 않거나, 대부분의 활동이 이행되지 않은 상태'],
 ['적용 제외','조직의 업무·시스템·정보처리 범위와 적용 조건을 검토한 결과 해당 Control이 적용되지 않으며, 그 사유를 기록한 상태']
];
export async function mount(root){
 const el=(tag,text,attrs={})=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);return e;};
 const button=(text,handler,cls)=>{const b=el('button',text,{type:'button',...(cls?{class:cls}:{})});b.onclick=handler;return b;};
 let bank;try{const res=await fetch(root.dataset.controls);if(!res.ok)throw Error();bank=await res.json();}catch{root.textContent='통제 목록을 불러오지 못했습니다. 페이지를 새로고침하세요.';return;}
 if(!root.isConnected)return;
 let state=emptyState(bank),storageEnabled=true,notice='';
 try{const raw=localStorage.getItem(STORAGE_KEY);if(raw)state=parseState(JSON.parse(raw),bank);}catch{storageEnabled=false;notice='기존 Control 저장 기록을 읽지 못해 자동 저장을 중지했습니다. 입력 내용은 Excel로 백업한 뒤 초기화하거나, 올바른 Excel 파일을 불러오세요.';}
 root.replaceChildren();
 const message=el('p',notice||'Control을 선택하고 이행 상태를 점검하세요.',{role:'status','aria-live':'polite'});root.append(message);
 function persist(){if(!storageEnabled){message.textContent=notice;return false;}try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));message.textContent='이 브라우저에 저장했습니다.';return true;}catch{message.textContent='브라우저 저장에 실패했습니다. 페이지를 닫기 전에 Excel로 다운로드하세요.';return false;}}
 function input(label,type,value,change){const wrap=el('label',label),field=el(type==='textarea'?'textarea':'input');if(type==='textarea'){field.rows=3;field.maxLength=20000;}else{field.type=type;if(type==='text')field.maxLength=20000;}field.value=value||'';field.oninput=()=>change(field.value);wrap.append(field);return wrap;}
 function select(label,options,change){const wrap=el('label',label),field=el('select',undefined,{'aria-label':label});for(const [v,t] of options)field.append(el('option',t,{value:v}));field.onchange=()=>change(field.value);wrap.append(field);return [wrap,field];}
 const metaPanel=el('fieldset');metaPanel.append(el('legend','평가 기본정보'));
 META_FIELDS.forEach((k,i)=>metaPanel.append(input(META_LABELS[i],['start','end','date'].includes(k)?'date':'text',state.meta[k],v=>{state.meta[k]=v;persist();})));root.append(metaPanel);
 function saveFile(blob,name){const url=URL.createObjectURL(blob),a=el('a',undefined,{href:url,download:name});document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 async function download(empty){try{const rows=exportRows(bank,state,empty);if(!rows.length){message.textContent='다운로드할 작성 내용이 없습니다. 빈 템플릿을 이용하세요.';return;}const {toXlsx}=await import('./excel.mjs?v=control7');if(root.isConnected)saveFile(toXlsx(HEADERS,rows,empty?{}:state.meta),`GapZer0-Control-${empty?'Template':'Assessment'}-${new Date().toISOString().slice(0,10)}.xlsx`);}catch(e){message.textContent='Excel 다운로드 실패: '+e.message;}}
 const toolbar=el('div',undefined,{class:'sa-toolbar'});toolbar.append(button('브라우저에 저장',persist),button('작성 내용 Excel로 다운로드',()=>download(false)),button('빈 템플릿 Excel로 다운로드',()=>download(true)));root.append(toolbar);
 root.append(el('p','빈 템플릿에는 121개 Control이 포함됩니다. 작성 내용을 Excel로 다운로드하면 지금까지 작성한 모든 Control이 포함됩니다. 평가 결과를 선택하지 않은 작성 중인 내용도 저장·다운로드할 수 있습니다.'));
 // Legacy records are never rewritten, aggregated, or removed by this version.
 try{
  const oldKeys=Object.keys(localStorage).filter(k=>k.startsWith('gapzer0.assessment.gapzer0-v02-aq1'));
  if(oldKeys.length){const box=el('details');box.append(el('summary','이전 질문별 평가 기록 백업'),el('p','기존 질문별 기록은 보존되어 있습니다. 새 Control 평가로 자동 합산하지 않습니다. 아래 버튼으로 이전 기록을 내려받아 참고하세요.'));
   for(const key of oldKeys)box.append(button(key.endsWith('template-v2')?'이전 평가 Excel 백업':'이전 형식 평가 Excel 백업',async()=>{try{const [{exportRows:oldRows,parseState:oldParse},{HEADERS:oldHeaders},{toXlsx},oldBank]=await Promise.all([import('./legacy/app.mjs'),import('./legacy/transfer.mjs'),import('./legacy/excel.mjs'),fetch(new URL('./legacy/questions.json',import.meta.url)).then(r=>r.json())]);const raw=localStorage.getItem(key),oldState=oldParse(JSON.parse(raw),oldBank),rows=oldRows(oldBank,oldState);if(!rows.length)throw Error('작성된 기록이 없습니다.');saveFile(toXlsx(oldHeaders,rows),'GapZer0-Previous-Questions.xlsx');}catch(e){message.textContent='이전 Excel 백업 실패: '+e.message;}}));
   box.append(button('이전 저장 원본 백업',()=>{const raw=Object.fromEntries(oldKeys.map(k=>[k,localStorage.getItem(k)]));saveFile(new Blob([JSON.stringify(raw,null,2)],{type:'application/json'}),'GapZer0-Previous-Backup.json');}));root.append(box);
  }
 }catch{}
 const importArea=el('fieldset',undefined,{class:'sa-import'});importArea.append(el('legend','PC의 Excel 파일 불러오기'),el('p','새 Control 템플릿의 평가 기록 시트를 불러옵니다. 확정하면 현재 평가 전체를 파일 내용으로 교체합니다. 기존 내용은 먼저 Excel로 보관하세요. 파일은 서버로 전송되지 않습니다.'));
 const fileLabel=el('label','Excel 파일 선택 (최대 25MB)'),file=el('input',undefined,{type:'file',accept:'.xlsx'}),preview=el('div',undefined,{role:'status','aria-live':'polite'});fileLabel.append(file);
 let pending=null,sequence=0;
 const apply=button('Excel 내용으로 교체하기',()=>{if(!pending)return;if(!confirm(`현재 평가 기본정보와 모든 작성 내용을 Excel의 ${pending.count}개 Control 기록으로 교체합니다. 파일에 없는 기존 기록도 지워집니다. 계속할까요?`))return;try{localStorage.setItem(STORAGE_KEY,JSON.stringify(pending.state));}catch{preview.textContent='저장에 실패해 현재 내용을 유지합니다.';return;}state=pending.state;storageEnabled=true;META_FIELDS.forEach((k,i)=>{metaPanel.querySelectorAll('input')[i].value=state.meta[k];});clearImport();refresh();summary();message.textContent='Excel 내용을 불러와 이 브라우저에 저장했습니다. 작성 내용 점검으로 누락된 항목을 확인하세요.';});
 const cancel=button('불러오기 취소',()=>clearImport());
 function clearImport(){sequence++;pending=null;file.value='';preview.replaceChildren();apply.hidden=cancel.hidden=true;}
 clearImport();file.onchange=async()=>{const n=++sequence;pending=null;apply.hidden=cancel.hidden=true;preview.replaceChildren();const f=file.files[0];if(!f)return;try{if(!/\.xlsx$/i.test(f.name)||f.size>MAX_IMPORT_BYTES)throw Error('25MB 이하의 .xlsx 파일을 선택하세요.');const {importXlsx}=await import('./excel-import.mjs?v=security1'),parsed=await importXlsx(await f.arrayBuffer(),bank);if(n!==sequence||!root.isConnected)return;pending=parsed;preview.append(el('p',`작성한 Control ${parsed.count}개 · 평가 범위: ${parsed.state.meta.scope||'미입력'} · 담당자: ${parsed.state.meta.assessor||'미입력'} · 평가일: ${parsed.state.meta.date||'미입력'}`));if(parsed.changedNames)preview.append(el('p','통제 이름이 현재 사이트와 다른 항목이 있습니다. 사이트의 최신 기준을 확인하여 재평가하세요.'));apply.hidden=cancel.hidden=false;}catch(e){if(n===sequence&&root.isConnected)preview.textContent=e.message;}};
 importArea.append(fileLabel,preview,apply,cancel);root.append(importArea);
 const overview=el('div',undefined,{class:'sa-overview','aria-live':'polite'}),progress=el('p'),breakdown=el('ul',undefined,{class:'sa-result-counts','aria-label':'전체 Control 평가 결과별 개수'});
 overview.append(progress,breakdown);root.append(overview);
 function summary(){
  const counts=RESPONSES.map(response=>bank.controls.filter(c=>state.records[c.id]?.response===response).length),count=counts.reduce((sum,n)=>sum+n,0);
  progress.textContent=`전체 ${bank.controls.length}개 통제 · 평가 결과 선택 ${count}개 · 미평가 ${bank.controls.length-count}개`;
  breakdown.replaceChildren(...RESPONSES.flatMap((response,i)=>counts[i]>0?[el('li',`${response} ${counts[i]}개`,{class:`sa-result-count sa-result-count-${i}`})]:[]));
  breakdown.hidden=count===0;
 }
 let domain='',result='';const filters=el('div',undefined,{class:'sa-filters'});
 const [dl]=select('보안 영역',[['','전체'],...[...new Set(bank.controls.map(c=>c.domain))].map(d=>[d,d])],v=>{domain=v;refresh();});
 const [rl]=select('평가 결과별 보기',[['','전체'],['미평가','미평가'],...RESPONSES.map(r=>[r,r])],v=>{result=v;refresh();});
 const [cl,cs]=select('Control',[],()=>render());filters.append(dl,rl,cl);root.append(filters);
 const body=el('div',undefined,{class:'sa-control-content'});root.append(body);
 function refresh(){const old=cs.value;cs.replaceChildren();for(const c of bank.controls.filter(c=>(!domain||c.domain===domain)&&(!result||(state.records[c.id]?.response||'미평가')===result)))cs.append(el('option',c.id+' · '+c.name,{value:c.id}));if([...cs.options].some(o=>o.value===old))cs.value=old;render();}
 function render(){
  body.replaceChildren();const c=bank.controls.find(c=>c.id===cs.value);if(!c){body.append(el('p','선택한 조건에 해당하는 Control이 없습니다.'));return;}
  const r=state.records[c.id]||blank();
  body.append(el('h3',c.id+' · '+c.name));
  body.append(el('a','이행 가이드 원문 보기',{href:c.guide,target:'_blank',rel:'noopener noreferrer'}));
  const rules=el('details');rules.append(el('summary','평가 기준 보기'));for(const [name,text] of criteria){const p=el('p');p.append(el('strong',name+' — '),document.createTextNode(text));rules.append(p);}body.append(rules);
  const card=el('section',undefined,{class:'sa-control-form'}),errors=el('div',undefined,{role:'alert',tabindex:'-1'});
  const changed=()=>{state.records[c.id]=r;errors.replaceChildren();persist();summary();};
  const [response,field]=select('평가 결과 (필수)',[['','선택하세요'],...RESPONSES.map(v=>[v,v])],v=>{r.response=v;changed();legend.textContent=['부분 충족','미충족'].includes(v)?'개선계획 (필수)':'개선계획 (선택)';});field.value=r.response;card.append(response);
  card.append(input('평가 근거 (적용 제외 통제는 제외한 사유를 적어주세요)','textarea',r.reason,v=>{r.reason=v;changed();}),input('확인한 증적 (자료명·보관 위치·버전·기간)','textarea',r.evidence,v=>{r.evidence=v;changed();}));
  card.append(el('p','판단에 필요한 정보가 부족하면 결과를 선택하지 않은 채 평가 근거에 추가 확인할 내용을 기록하세요.'));
  const action=el('fieldset'),legend=el('legend',['부분 충족','미충족'].includes(r.response)?'개선계획 (필수)':'개선계획 (선택)');action.append(legend);
  for(const [k,label,type] of [['action','개선조치','textarea'],['owner','조치 담당자','text'],['due','완료 예정일','date']])action.append(input(label,type,r[k],v=>{r[k]=v;changed();}));
  const [st,sf]=select('진행 상태',[['','선택하세요'],...['예정','진행 중','완료'].map(v=>[v,v])],v=>{r.status=v;changed();});sf.value=r.status;action.append(st,el('p','완료 시 개선조치에 수행 결과를 덧붙이고, 평가 근거와 확인한 증적을 갱신해 다시 평가하세요.'));card.append(action);
  card.append(button('작성 내용 점검',()=>{const issues=validate(r,state.meta);errors.replaceChildren();for(const issue of issues)errors.append(el('p',issue));if(!issues.length)errors.append(el('p','필수 입력 항목을 작성했습니다. 평가 결과의 적절성은 담당자가 확인하세요.',{class:'sa-validation-ok'}));errors.focus();}),errors);body.append(card);
 }
 const resetArea=el('div',undefined,{class:'sa-reset-area'});resetArea.append(button('작성 내용 초기화',()=>{if(!confirm('현재 Control 평가의 기본정보와 모든 작성 내용을 초기화합니다. 필요한 내용은 먼저 Excel로 보관하세요. 이전 질문별 백업 기록은 유지됩니다. 초기화할까요?'))return;try{localStorage.removeItem(STORAGE_KEY);}catch{message.textContent='저장 기록을 지우지 못해 초기화를 취소했습니다.';return;}state=emptyState(bank);storageEnabled=true;clearImport();metaPanel.querySelectorAll('input').forEach(i=>i.value='');domain=result='';filters.querySelectorAll('select').forEach(s=>s.value='');refresh();summary();message.textContent='현재 Control 평가를 초기화했습니다.';},'sa-reset'));root.append(resetArea);refresh();summary();
}
export function boot(){const root=document.getElementById('assessment-app');if(root?.dataset.controls&&!root.dataset.mounted){root.dataset.mounted='true';mount(root).catch(()=>{if(root.isConnected)root.textContent='자가진단 화면을 불러오지 못했습니다. 새로고침하세요.';});}}
if(typeof document!=='undefined'){boot();document.addEventListener('DOMContentLoaded',boot);document.addEventListener('pjax:complete',boot);}
