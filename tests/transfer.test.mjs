import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {blank,toCsv,exportRows,csvCell} from '../assets/assessment/app.mjs';
import {CSV_HEADERS,importCsv,parseCsv,MAX_IMPORT_BYTES} from '../assets/assessment/transfer.mjs';
import {toXlsx} from '../assets/assessment/excel.mjs';
const bank=JSON.parse(fs.readFileSync(new URL('../assets/assessment/questions.json',import.meta.url),'utf8'));
const [a,b]=bank.questions;
const meta={scope:'서버, 업무',start:'2026-01-01',end:'2026-09-30',assessor:'보안 담당자',date:'2026-10-06'};
const record={...blank(),response:'부분 충족',reason:'첫째 줄, "인용"\n둘째 줄',evidence:'자료 v1\n보관 위치',action:'개선',owner:'담당자',due:'2026-11-01',status:'진행 중'};
const state={schema:2,bank:bank.version,meta,records:{[a.id]:record,[b.id]:{...blank(),reason:'초안만 작성'}}};
const encode=rows=>rows.map(r=>r.map(csvCell).join(',')).join('\r\n');
const mutate=fn=>{const rows=parseCsv(toCsv(bank,state));fn(rows);return encode(rows);};

test('CSV export/import restores all fields, Korean, comma, quotes, newline and incomplete drafts',()=>{
 const before=JSON.stringify(state),result=importCsv(toCsv(bank,state),bank);
 assert.deepEqual(result.state,state);assert.equal(result.count,2);assert.equal(result.changedQuestions,0);assert.equal(JSON.stringify(state),before);
 const completed={...state,records:{[a.id]:{...record,response:'미충족',evidence:'',noEvidence:true,absenceReason:'미운영',status:'완료',completed:'2026-10-06',outcome:'완료 자료'}}};
 assert.deepEqual(importCsv(toCsv(bank,completed),bank).state,completed);
});
test('old header names and reordered columns remain supported',()=>{
 const text=mutate(rows=>{rows[0][6]='평가 증적';rows[0][8]='판단 근거';rows.forEach(r=>r.reverse());});
 assert.deepEqual(importCsv(text,bank).state,state);
});
test('empty templates and header-only downloads do not clear the current assessment',()=>{
 assert.throws(()=>importCsv(toCsv(bank,state,true),bank),/작성 내용이 없습니다/);
 assert.throws(()=>importCsv(toCsv(bank,{meta,records:{}}),bank),/평가 질문이 없습니다/);
});
test('unknown, duplicate or mismatched questions reject the entire file',()=>{
 for(const update of [r=>{r[2][3]='UNKNOWN';},r=>{r[2][3]=a.id;},r=>{r[2][0]='BAD';},r=>{r[2][4]='Other';}])assert.throws(()=>importCsv(mutate(update),bank));
});
test('ambiguous schemas, cell lengths, statuses and inconsistent metadata are rejected',()=>{
 for(const update of [r=>{r[0][1]=r[0][0];},r=>{r[0].pop();},r=>{r[1].pop();},r=>{r[1][7]='통과';},r=>{r[1][16]='중단';},r=>{r[1][10]='TRUE';},r=>{r[1][8]='x'.repeat(20001);},r=>{r[2][19]='다른 조직';}])assert.throws(()=>importCsv(mutate(update),bank));
});
test('invalid dates are rejected, empty dates and drafts remain allowed',()=>{
 for(const column of [15,17,20,21,23])assert.throws(()=>importCsv(mutate(r=>{r[1][column]='2026-02-30';}),bank),/날짜|YYYY/);
 assert.throws(()=>importCsv(mutate(r=>{for(const row of r.slice(1)){row[20]='2026-12-01';}}),bank),/시작일/);
});
test('quoted CSV grammar and byte limit are bounded',()=>{
 assert.deepEqual(parseCsv('\uFEFF"a","b"\r\n"line1\r\nline2","a""b"\r\n'),[['a','b'],['line1\r\nline2','a"b']]);
 for(const s of ['"unclosed','a"b,c','"a"x,b','a\u0000,b'])assert.throws(()=>parseCsv(s));
 assert.throws(()=>parseCsv('x'.repeat(MAX_IMPORT_BYTES+1)),/25MB/);
});
test('changed question wording is reported without replacing source questions or Evidence',()=>{
 const before=JSON.stringify(bank);const out=importCsv(mutate(r=>{r[1][5]='다른 질문';r[1][6]='다른 자료';}),bank);
 assert.equal(out.changedQuestions,1);assert.deepEqual(out.state,state);assert.equal(JSON.stringify(bank),before);
});
test('formula-like and HTML values remain text and CSV protection does not accumulate',()=>{
 const s={...state,records:{[a.id]:{...record,reason:'=1+1',evidence:'<img src=x onerror=alert(1)>'}}};
 const imported=importCsv(toCsv(bank,s),bank).state;
 assert.equal(imported.records[a.id].reason,'[텍스트] =1+1');assert.equal(imported.records[a.id].evidence,s.records[a.id].evidence);
 assert.equal(toCsv(bank,imported),toCsv(bank,s));
});
test('XLSX contains ZIP workbook parts and no formulas or external links',async()=>{
 const blob=toXlsx(CSV_HEADERS,exportRows(bank,state));const bytes=new Uint8Array(await blob.arrayBuffer());
 assert.equal(new DataView(bytes.buffer).getUint32(0,true),0x04034b50);
 const text=new TextDecoder().decode(bytes);assert.ok(text.includes('평가 기록'));assert.ok(text.includes('작성 안내'));assert.ok(text.includes('autoFilter'));assert.ok(text.includes('dataValidation'));assert.ok(!text.includes('<f>'));assert.ok(!text.includes('externalLink'));
});
