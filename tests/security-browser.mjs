import assert from 'node:assert/strict';
import {toXlsx} from '../assets/assessment/excel.mjs';
import {HEADERS} from '../assets/assessment/transfer.mjs';
import {editXlsx,sharedStringXlsx} from './xlsx-fixtures.mjs';

export async function checkSecurity(page,base) {
 const errors=[];
 const onError=error=>errors.push(error.message);
 page.on('pageerror',onError);
 await page.goto(base+'/');
 assert.equal(await page.evaluate(()=>window.jQuery.fn.jquery),'3.7.1');
 assert(await page.evaluate(()=>{let same=false;window.require(['jquery'],jq=>same=jq===window.jQuery);return same;}));
 await page.getByRole('link',{name:'야간 모드로 전환',exact:true}).click();
 assert(await page.locator('.book').evaluate(el=>el.classList.contains('color-theme-2')));
 await page.getByRole('link',{name:'주간 모드로 전환',exact:true}).click();
 for(const suffix of ['?q=%','?h=%E0%A4%A','?q='+ 'x'.repeat(201)]) {
  await page.goto(base+'/'+suffix);
  await page.waitForLoadState('networkidle');
 }
 assert.deepEqual(errors,[],'Malformed or overlong query must not break initialization');
 await page.goto(base+'/');
 await page.getByRole('textbox',{name:'가이드라인 검색',exact:true}).fill('접근권한');
 await page.getByRole('textbox',{name:'가이드라인 검색',exact:true}).press('Enter');
 await page.locator('.search-results-item').first().waitFor();
 assert(await page.locator('.search-highlight-keyword').count()>0);

 // Even index text containing HTML must be rendered as inert text.
 await page.route('**/assets/search_plus_index.json*',route=>route.fulfill({json:{'/introduction/':{title:'audit',body:'audit <img src=x onerror="window.__auditXss=1">'}}}));
 await page.goto(base+'/?q=audit');
 await page.locator('.search-results-item').first().waitFor();
 assert.equal(await page.locator('.search-results-item img').count(),0);
 assert.equal(await page.evaluate(()=>window.__auditXss),undefined);
 await page.unroute('**/assets/search_plus_index.json*');

 await page.goto(base+'/self-assessment/form/');
 await page.locator('.sa-control-form').waitFor();
 const meta={scope:'audit',start:'2026-01-01',end:'2026-09-30',assessor:'audit',date:'2026-10-07'};
 const payload='<img src=x onerror="window.__auditXss=1">';
 const bytes=await toXlsx(HEADERS,[['GOV-C-01','전략 결과 검토·방향 조정','',payload,'=1+1','','','','']],meta).arrayBuffer();
 async function parse(data) {
  return page.evaluate(async data=>{
   const {importXlsx}=await import('/assets/assessment/excel-import.mjs');
   const bank=await(await fetch('/assets/assessment/controls.json')).json();
   try{return {ok:true,result:await importXlsx(Uint8Array.from(data).buffer,bank)};}
   catch(e){return {ok:false,error:e.message};}
  },[...new Uint8Array(data)]);
 }
 for(const good of [bytes,await sharedStringXlsx(bytes)]) {
  const result=await parse(good);assert(result.ok,result.error);
  assert.equal(result.result.state.records['GOV-C-01'].reason,payload);
  assert.equal(result.result.state.records['GOV-C-01'].evidence,'=1+1');
 }
 const shared=(entries,count)=>{
  entries.set('xl/sharedStrings.xml','<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'+'<si><t>x</t></si>'.repeat(count)+'</sst>');
  entries.set('xl/_rels/workbook.xml.rels',entries.get('xl/_rels/workbook.xml.rels').replace('</Relationships>','<Relationship Id="audit" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/></Relationships>'));
 };
 for(const [name,edit] of [
  ['shared string limit',e=>shared(e,5001)],
  ['XML element limit',e=>shared(e,100000)],
  ['non-ASCII XML element limit',e=>e.set('xl/worksheets/sheet1.xml',e.get('xl/worksheets/sheet1.xml').replace('</worksheet>','<추가/>'.repeat(50001)+'</worksheet>'))],
  ['macro default content type',e=>e.set('[Content_Types].xml',e.get('[Content_Types].xml').replace('</Types>','<Default Extension="bin" ContentType="application/vnd.ms-office.vbaProject"/></Types>'))],
  ['XML byte limit',e=>e.set('xl/workbook.xml',' '.repeat(8*1024*1024+1))],
  ['formula',e=>e.set('xl/worksheets/sheet1.xml',e.get('xl/worksheets/sheet1.xml').replace('<is>','<f>1+1</f><is>'))],
  ['DOCTYPE',e=>e.set('xl/worksheets/sheet1.xml',e.get('xl/worksheets/sheet1.xml').replace('<worksheet','<!DOCTYPE x [<!ENTITY x SYSTEM "https://example.invalid/">]><worksheet'))],
  ['external relationship',e=>e.set('xl/_rels/workbook.xml.rels',e.get('xl/_rels/workbook.xml.rels').replace('Target="worksheets/sheet1.xml"','Target="https://example.invalid/sheet.xml" TargetMode="External"'))],
 ]) {
  const malformed=await editXlsx(bytes,edit);
  const result=await parse(malformed);assert.equal(result.ok,false,name);
 }
 const before=await page.evaluate(()=>localStorage.getItem('gapzer0.assessment.controls.v1'));
 const hostile=await editXlsx(bytes,e=>shared(e,300000));
 await page.locator('input[type=file]').setInputFiles({name:'oversized.xlsx',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',buffer:hostile});
 await page.getByText('Excel 내부 데이터가 너무 많습니다.',{exact:false}).waitFor();
 assert.equal(await page.evaluate(()=>localStorage.getItem('gapzer0.assessment.controls.v1')),before);
 assert(!await page.getByRole('button',{name:'Excel 내용으로 교체하기',exact:true}).isVisible());
 assert.deepEqual(errors,[]);
 page.off('pageerror',onError);
 console.log('PASS: shared jQuery 3.7.1, night mode, safe search, bounded XML, valid Excel and rejected import preservation');
}
