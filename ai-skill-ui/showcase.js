import {renderMarkdown,evidenceTitles} from './markdown-renderer.js';
import {initializeQuantitative} from './quantitative.js';
const $=s=>document.querySelector(s);
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
let snapshot;
function repositoryHref(path){const kind=/\.[a-z]+(?:#.*)?$/i.test(path)?'blob':'tree';return 'https://github.com/whs4-GapZer0/GapZer0_Guideline/'+kind+'/'+snapshot+'/'+path;}
function repositoryLink(path,label){const a=node('a',label||path);a.href=repositoryHref(path);a.target='_blank';a.rel='noopener';return a;}
function connectRepositoryLinks(){document.querySelectorAll('[data-repo-path]').forEach(a=>{a.href=repositoryHref(a.dataset.repoPath);a.target='_blank';a.rel='noopener';});}
$('#overview-toggle').addEventListener('click',()=>{
  const open=$('#overview-toggle').getAttribute('aria-expanded')!=='true';
  $('#overview-toggle').setAttribute('aria-expanded',String(open));$('#overview-content').hidden=!open;
  $('#overview-toggle').textContent=open?'소개 닫기 ↑':'왜 만들었나요? 기능과 출력 구조 알아보기 ↓';
  if(open)$('#overview-toggle').textContent='소개 닫기 ↑';
});
document.querySelectorAll('[data-start-demo]').forEach(b=>b.addEventListener('click',()=>{
  document.querySelector(`[data-example=${b.dataset.startDemo}]`).click();$('#overview-content').hidden=true;$('#overview-toggle').setAttribute('aria-expanded','false');$('#overview-toggle').textContent='왜 만들었나요? 기능과 출력 구조 알아보기 ↓';$('#try-demo').scrollIntoView();
}));
let catalog,filtered=[],limit=12;
const normalize=s=>s.normalize('NFKC').toLocaleLowerCase('ko').replace(/\s+/g,'');
function applyFilters(){
  const tokens=$('#explorer-search').value.trim().split(/\s+/).filter(Boolean).map(normalize);
  filtered=catalog.controls.filter(c=>(!$('#explorer-domain').value||c.domain===$('#explorer-domain').value)&&(!$('#explorer-class').value||c.classification===$('#explorer-class').value)&&tokens.every(t=>normalize(c.id+' '+c.name+' '+c.keywords.join(' ')).includes(t)));
  limit=12;$('#explorer-detail').hidden=true;renderExplorer();
  document.dispatchEvent(new CustomEvent('explorer:results',{detail:{count:filtered.length,total:catalog.controls.length}}));
}
function renderExplorer(){
  $('#explorer-results').replaceChildren();
  $('#explorer-status').textContent=`${catalog.controls.length}개 중 ${filtered.length}개 Control · ${Math.min(limit,filtered.length)}개 표시`;
  if(!filtered.length)$('#explorer-results').append(node('p','검색 결과가 없습니다. 검색어나 필터를 변경하세요.','empty-state'));
  for(const c of filtered.slice(0,limit)){
    const b=node('button',undefined,'explorer-card');b.type='button';b.dataset.controlId=c.id;
    b.append(node('strong',c.id),node('span',c.name),node('small',c.domain+' · '+c.classification));b.addEventListener('click',()=>selectControl(c));$('#explorer-results').append(b);
  }
  $('#explorer-more').hidden=limit>=filtered.length;
}
function selectControl(c){
  const target=$('#explorer-detail');target.replaceChildren();target.dataset.controlId=c.id;
  target.append(node('h3',c.id+' · '+c.name),node('p',c.domain+' · '+c.classification,'section-note'),node('p','Control → Objective → Statement → Evidence → Source','source-chain'));
  for(const [key,label] of [['Control Objective','Objective'],['Control Statement','Control Statement'],['Control Owner','Owner — 원문 역할'],['Stakeholders','Stakeholders — 원문 역할'],['Evidence','Evidence — 필요한 자료 예시']]){
    if(!Object.hasOwn(c.fields,key))continue;
    const s=node('section');s.dataset.field=key;s.append(node('h4',label));
    if(key==='Evidence'){s.append(node('p','Evidence는 통제를 실제 수행했음을 확인할 수 있는 자료입니다. 필요한 자료 예시이며 확보된 증적이 아닙니다.','section-note'));const chips=node('div',undefined,'evidence-chips');for(const t of evidenceTitles(c.fields[key]))chips.append(node('span',t));s.append(chips);}
    s.append(renderMarkdown(c.fields[key]));target.append(s);
  }
  const source=node('section',undefined,'explorer-source');source.append(node('h4','이 답변의 근거 — Source'),node('p',c.source),node('p',c.repositorySource),repositoryLink(c.repositorySource,'저장소 Control 원문 확인'));target.append(source);
  const details=node('details',undefined,'explorer-original');details.append(node('summary','Control 원문 보기'),renderMarkdown(c.original));target.append(details);
  target.hidden=false;target.scrollIntoView({block:'start'});
}
async function load(){
  const responses=await Promise.all([fetch('./data/controls.json'),fetch('./data/showcase.json')]);
  if(responses.some(r=>!r.ok))throw new Error('Showcase 자료를 읽을 수 없습니다.');
  const [controlData,showcase]=await Promise.all(responses.map(r=>r.json()));catalog=controlData;snapshot=catalog.sourceCommit;connectRepositoryLinks();
  $('#catalog-count').textContent=`${catalog.count} Controls · AI Skill snapshot`;
  for(const [field,id] of [['domain','explorer-domain'],['classification','explorer-class']])for(const value of [...new Set(catalog.controls.map(c=>c[field]))].sort()){
    const option=node('option',value);option.value=value;$('#'+id).append(option);
  }
  for(const m of showcase.metrics){
    const card=node('article',undefined,'metric-card');card.dataset.metric=m.id;
    card.append(node('h3',m.title),node('strong',`${m.numerator} / ${m.denominator}`,'metric-value'),node('p','검증 시나리오 범위 기준','section-note'));
    const d=node('details');d.append(node('summary','검증 내용 보기'),node('p','대상: '+m.scope),node('p',m.details),node('p','PASS / 집계 기준: '+(m.id==='agreement'?'양쪽 Runtime의 대표 기능 기대 동작 충족':m.id==='top5'?'질의별 모든 기대 Control이 Top-5에 포함':m.id==='hit5'?'개별 기대 Control이 Top-5에 포함':'보고서에서 정의한 원문 근거·출력 또는 UI 기대 동작 충족')),node('p','제한사항: '+m.limitations),repositoryLink(m.source,'Report Source · '+m.source));card.append(d);$('#validation-metrics').append(card);
  }
  const names=['AI Skill','Codex Skill','Claude Skill','Control Index','Control Sources','Output Formats','Validation Reports','Web UI'];
  showcase.artifacts.forEach((p,i)=>$('#repository-artifacts').append(repositoryLink(p,names[i]+' · '+p)));
  for(const id of ['explorer-search','explorer-domain','explorer-class'])$('#'+id).addEventListener(id==='explorer-search'?'input':'change',applyFilters);
  $('#explorer-reset').addEventListener('click',()=>{for(const id of ['explorer-search','explorer-domain','explorer-class'])$('#'+id).value='';applyFilters();});
  $('#explorer-more').addEventListener('click',()=>{limit+=12;renderExplorer();});
  document.addEventListener('click',event=>{const a=event.target.closest('[data-explore-control]');if(!a)return;event.preventDefault();openControl(a.dataset.exploreControl);});
  function openControl(id){const c=catalog.controls.find(c=>c.id===id);if(!c)return;$('#explorer-search').value=id;$('#explorer-domain').value='';$('#explorer-class').value='';applyFilters();selectControl(c);}
  applyFilters();
  await initializeQuantitative(catalog,{filter(field,value){$('#explorer-search').value='';$('#explorer-domain').value=field==='domain'?value:'';$('#explorer-class').value=field==='classification'?value:'';applyFilters();$('#control-explorer').scrollIntoView();}});
  $('#showcase-status').textContent='Showcase 자료 준비 완료 · 현재 저장소 검증 보고서와 AI Skill snapshot 기준';
}
load().catch(e=>{$('#showcase-status').textContent=e.message;$('#showcase-status').setAttribute('role','alert');$('#explorer-status').textContent='자료 로딩 실패 · 결과를 표시할 수 없습니다.';});
