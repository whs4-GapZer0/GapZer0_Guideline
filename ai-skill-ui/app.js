import {DemoAdapter} from './runtime-adapter.js';
const adapter = new DemoAdapter();
const $ = selector => document.querySelector(selector);
let mode = 'guide';
const el = (tag,text,cls) => {const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const tag = (text,cls) => el('span',text,'tag '+cls);
function select(value) {
  mode=value;
  document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===value)));
  $('#results').hidden=true;$('#error').hidden=true;
}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>select(b.dataset.mode)));
document.querySelectorAll('[data-example]').forEach(b=>b.addEventListener('click',()=>{
  if(!adapter.data)return;
  select(b.dataset.example);$('#question').value=adapter.examples().find(s=>s.mode===mode).question;$('#question').focus();
}));
function block(container,title,text,kind='ground',label='가이드라인 근거') {
  const s=el('section',undefined,'practical-section');s.append(el('h3',title),tag(label,kind),el('div',text,'excerpt'));container.append(s);
}
function render(result) {
  $('#result-question').textContent=result.question;
  const cards=$('#control-cards');cards.replaceChildren();
  for(const c of result.controls){
    const card=el('article',undefined,'control-card');card.append(el('div',c.id+(c.conditional?' · 조건부':''),'control-id'),el('h3',c.name),el('div',c.domain+' · '+c.classification,'meta'),tag('가이드라인 근거','ground'),el('b','왜 관련되는지 — 원문 목표'),el('div',c.fields['Control Objective'],'excerpt'),tag('확인 필요','check'),el('b','적용 시 확인사항 — 원문 조건'),el('div',c.fields['적용 조건'],'excerpt'));
    const details=el('details');details.append(el('summary','적용 방법 · 원문 Implementation Guide'),el('div',c.fields['Implementation Guide'],'excerpt'));card.append(details);
    const a=el('a','Source · '+c.source,'source');a.href='./sources/'+c.id.toLowerCase()+'.html#'+c.id.toLowerCase();a.target='_blank';a.rel='noopener';card.append(a);cards.append(card);
  }
  const practical=$('#practical');practical.replaceChildren();
  if(result.mode==='guide')block(practical,'선택 이유 · 적용 방법','관련성과 적용 방법은 위 카드의 실제 Control 목표·적용 조건·Implementation Guide를 확인하세요. 물리적 접근권한이 있는 경우 PHY-C-02를 함께 검토합니다.','proposal','AI 제안');
  if(result.mode==='plan'){
    const c=result.controls[0];
    for(const [title,key] of [['Control', 'Control Name'],['목표','Control Objective'],['실행 활동','Implementation Guide'],['Owner — 원문 역할','Control Owner'],['Stakeholders — 원문 협업 역할','Stakeholders'],['Timing — 원문 적용 시점','적용 조건'],['Evidence — 필요한 증적 예시, 확보된 증적 아님','Evidence']])block(practical,title,c.fields[key]);
    block(practical,'Status','초안 · 이행 상태 및 실제 증적 확보 여부 확인 필요','check','확인 필요');
    block(practical,'Source',c.source);
  }
  if(result.mode==='document'){
    block(practical,'목적','클라우드 외주 공급자 도입 전에 의존성·위험·계약 요구사항을 검토하는 절차 초안입니다. 조직 승인 전 참고자료입니다.','proposal','AI 제안');
    block(practical,'적용범위','검토 대상 서비스, 처리정보, 접근범위와 중요도를 확인합니다. 개인정보 위탁 등 법적 의무는 원문 조건과 실제 조직 상황을 대조해야 합니다.','check','확인 필요');
    block(practical,'역할 — 원문 역할이며 조직 부서 확정 아님',result.controls.map(c=>c.id+' · '+c.fields['Control Owner']+'\n협업: '+c.fields['Stakeholders']).join('\n\n'));
    block(practical,'업무 절차 — 원문 Implementation Guide',result.controls.map(c=>c.id+' · '+c.name+'\n'+c.fields['Implementation Guide']).join('\n\n'));
    block(practical,'Evidence — 필요한 자료 예시, 확보된 증적 아님',result.controls.map(c=>c.id+'\n'+c.fields['Evidence']).join('\n\n'));
    block(practical,'검토 및 개선','실사 결과·미흡사항·계약 반영 여부를 기록하고 조직의 검토 절차로 연결하는 방안을 제안합니다. 관련 Controls와 Source는 위 카드에서 확인합니다.','proposal','AI 제안');
  }
  block(practical,'확인 필요','실제 담당 역할의 지정 여부, 대상 자산·데이터·권한·공급자 범위, 현재 절차와 확보 Evidence는 확인이 필요합니다.','check','확인 필요');
  block(practical,'조직 결정 필요','수행 주기, 보유기간, 완료기한, 승인 기준 및 수치 기준은 조직에서 결정해야 합니다. 이 Demo는 값을 확정하지 않습니다.','decision','조직 결정 필요');
  $('#results').hidden=false;$('#status').textContent='Demo 결과 표시 완료 · 실시간 AI 생성이 아닙니다.';
}
$('#question-form').addEventListener('submit',async event=>{
  event.preventDefault();$('#error').hidden=true;$('#results').hidden=true;
  try {render(await adapter.ask({mode,question:$('#question').value}));}
  catch(error){$('#error').textContent=error.message;$('#error').hidden=false;}
});
try{await adapter.initialize();$('#status').textContent='Demo 준비 완료 · 예시 질문을 선택하고 질문하기를 누르세요.';}
catch(error){$('#error').textContent=error.message;$('#error').hidden=false;$('#submit').disabled=true;}
