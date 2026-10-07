import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {HEADERS,exportRows,emptyState,importRows,parseState,validate,blank} from '../assets/assessment/transfer.mjs';
import {toXlsx} from '../assets/assessment/excel.mjs';
const bank=JSON.parse(await fs.readFile(new URL('../assets/assessment/controls.json',import.meta.url),'utf8'));
assert.equal(bank.controls.length,121);
assert.equal(new Set(bank.controls.map(c=>c.id)).size,121);
for(const c of bank.controls){assert(c.implementation&&c.evidence&&c.conditions);assert(!c.evidence.includes('gitbook'));assert(!c.evidence.includes('<script'));}
const state=emptyState(bank);state.meta={scope:'검증용 범위',start:'2026-10-01',end:'2026-10-07',assessor:'검증용 담당자',date:'2026-10-07'};
state.records[bank.controls[0].id]={...blank(),response:'부분 충족',reason:'일부 검토 누락\n<문자> & 확인',evidence:'검토 기록 v1',action:'누락 검토 수행',owner:'담당자',due:'2026-10-30',status:'예정'};
state.records[bank.controls[1].id]={...blank(),reason:'결과 미선택 작성 중'};
state.records[bank.controls[2].id]=blank();
const rows=exportRows(bank,state);assert.equal(rows.length,2);assert.equal(exportRows(bank,state,true).length,121);
assert.deepEqual(importRows([HEADERS,...rows],bank,state.meta).state,state.records[bank.controls[2].id]?{...state,records:Object.fromEntries(Object.entries(state.records).filter(([_,r])=>r.reason))}:state);
assert.equal(validate(state.records[bank.controls[0].id],state.meta).length,0);
assert(validate({...state.records[bank.controls[0].id],action:''},state.meta).length>0);
assert.throws(()=>importRows([HEADERS,rows[0],rows[0]],bank,state.meta),/중복/);
assert.throws(()=>importRows([HEADERS,[...rows[0].slice(0,2),'확인 필요',...rows[0].slice(3)]],bank,state.meta));
assert.throws(()=>parseState({...state,schema:2},bank));
const near=exportRows(bank,state);near[0][3]='=1+1';near[0][4]='literal _x0041_ & <tag>';

const bytes = await toXlsx(HEADERS,near,state.meta).arrayBuffer();
assert.equal(new DataView(bytes).getUint32(0,true),0x04034b50);
console.log('PASS: 121 controls, nine columns, drafts, import validation and legacy isolation');
