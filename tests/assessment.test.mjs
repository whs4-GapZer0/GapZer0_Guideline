import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {blank,validate,parseState,actionType,csvCell,toCsv} from '../assets/assessment/app.mjs';
const bank=JSON.parse(fs.readFileSync(new URL('../assets/assessment/questions.json',import.meta.url),'utf8'));
const meta={scope:'시험 시스템',start:'2026-01-01',end:'2026-09-29',assessor:'담당자',date:'2026-09-29'};
const base=()=>({...blank(),response:'충족',reason:'전체 기준 확인',evidence:'정책 v1 p.3'});
const plan={action:'검토 실시',owner:'담당자',due:'2026-10-15',status:'예정'};
test('question bank IDs and dimensions',()=>{assert.equal(bank.questions.length,489);assert.equal(bank.controls.length,121);assert.equal(new Set(bank.questions.map(q=>q.id)).size,489);for(const c of bank.controls)assert.deepEqual(new Set(bank.questions.filter(q=>q.control===c.id).map(q=>q.phase)),new Set(['Design','Implementation','Operating Effectiveness']));});
test('satisfied and excluded require actual evidence and rationale',()=>{for(const response of ['충족','적용 제외']){assert.deepEqual(validate({...base(),response},meta),[]);assert.ok(validate({...base(),response,evidence:''},meta).length);assert.ok(validate({...base(),response,reason:''},meta).length);assert.ok(validate({...base(),response,evidence:'',noEvidence:true},meta).length);}});
test('partial requires evidence and complete improvement plan',()=>{assert.ok(validate({...base(),response:'부분 충족'},meta).length);assert.deepEqual(validate({...base(),response:'부분 충족',...plan},meta),[]);assert.ok(validate({...base(),response:'부분 충족',...plan,owner:''},meta).length);});
test('not satisfied permits no evidence with reason; uncertain uses follow-up',()=>{const r={...base(),response:'미충족',evidence:'',noEvidence:true,...plan};assert.ok(validate(r,meta).length);assert.deepEqual(validate({...r,absenceReason:'활동 미운영으로 기록 미생성'},meta),[]);assert.deepEqual(validate({...r,response:'확인 필요'},meta),[]);assert.equal(actionType({...r,response:'확인 필요'}),'추가 확인');assert.ok(validate({...r,evidence:'있음',absenceReason:'없음'},meta).length);});
test('completion requires proof without automatic response change',()=>{const r={...base(),response:'부분 충족',...plan,status:'완료'};assert.ok(validate(r,meta).length);assert.deepEqual(validate({...r,outcome:'검토 기록',completed:'2026-09-29'},meta),[]);assert.equal(r.response,'부분 충족');assert.ok(validate({...base(),owner:'담당자'},meta).length);});
test('period and dates',()=>{assert.ok(validate(base(),{...meta,start:'2026-10-01'}).length);assert.ok(validate(base(),{...meta,end:'2026-02-30'}).length);});
test('stored answers restore; legacy data migrates without modifying original history',()=>{
 const id=bank.questions[0].id,s={schema:2,bank:bank.version,meta,records:{[id]:base()}};
 assert.deepEqual(parseState(s,bank),s);
 const old={...s,schema:1,history:{[id]:[{record:base(),meta}]}};
 const before=JSON.stringify(old);assert.deepEqual(parseState(old,bank),s);assert.equal(JSON.stringify(old),before);
 assert.throws(()=>parseState({...s,bank:'wrong'},bank));assert.throws(()=>parseState({...s,records:{UNKNOWN:base()}},bank));
 assert.throws(()=>parseState({...s,records:{[id]:{...base(),response:'합격'}}},bank));
 assert.throws(()=>parseState({...s,meta:[]},bank));assert.throws(()=>parseState({...s,records:[]},bank));
 assert.throws(()=>parseState({...s,records:{[id]:{...base(),reason:'x'.repeat(20001)}}},bank));
});

test('CSV preserves commas, quotes, Korean and newlines while neutralizing formula starters',()=>{
 assert.equal(csvCell('한글,"인용"\n두 번째 줄'),'"한글,""인용""\n두 번째 줄"');
 for(const value of ['=1+1','+1','-1','@SUM(A1)','  =1','\t=1','\n=1','\rtext','＝1','＋1','－1','＠1','\u0000=1'])assert.ok(csvCell(value).startsWith('"[텍스트] '));
 assert.equal(csvCell('GOV-C-01'),'"GOV-C-01"');assert.equal(csvCell('https://example.com'),'"https://example.com"');
});

test('CSV exports every question, current drafts and evidence guidance; empty template excludes all answers',()=>{
 const id=bank.questions[0].id,state={schema:2,bank:bank.version,meta,records:{[id]:{...base(),reason:'CSV 테스트, "인용"\n다음 줄',...plan}}};
 const before=JSON.stringify(state),csv=toCsv(bank,state),empty=toCsv(bank,state,true);
 assert.equal(csv.charCodeAt(0),0xfeff);assert.ok(csv.endsWith('\r\n'));
 for(const q of bank.questions)assert.ok(csv.includes(csvCell(q.id)));
 assert.ok(csv.includes(csvCell(state.records[id].reason)));assert.ok(csv.includes(csvCell(bank.controls[0].evidence)));
 assert.ok(csv.includes(csvCell(meta.scope)));assert.ok(!empty.includes('CSV 테스트'));assert.ok(!empty.includes(csvCell(meta.scope)));
 assert.equal(JSON.stringify(state),before);
});
