import {editXlsx,sharedStringXlsx} from './xlsx-fixtures.mjs';
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(process.env.THEME_TEST_ROOT||'.');
const server=http.createServer(async(req,res)=>{try{let p=new URL(req.url,'http://localhost').pathname;if(p.endsWith('/'))p+='index.html';const file=path.resolve(root,'.'+p);if(!file.startsWith(root+path.sep))throw Error();res.setHeader('Content-Type',file.endsWith('.mjs')||file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.json')?'application/json':'text/html');res.end(await fs.readFile(file));}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({channel:process.env.CI?undefined:'msedge',headless:true});
try{
 await fs.mkdir('work',{recursive:true});
 const page=await browser.newPage({viewport:{width:1280,height:1000}}),errors=[],writes=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))writes.push(r.url());});
 await page.goto(`http://127.0.0.1:${server.address().port}/self-assessment/form/`);
 await page.locator('.sa-question').first().waitFor();
 const scope=page.getByLabel('평가 범위 (조직·업무·시스템)'),reason=()=>page.locator('.sa-question').first().getByLabel('평가 근거 (필수)');
 await scope.fill('XLSX 복원 시험');await reason().fill('한글, "인용"\n두 번째 줄');
 const getDownload=async name=>{const event=page.waitForEvent('download');await page.getByRole('button',{name,exact:true}).click();return await event;};
 const csvDownload=await getDownload('작성 내용 XLSX 다운로드하기');const csv=await fs.readFile(await csvDownload.path());
 await csvDownload.saveAs('work/assessment-written.xlsx');
 const template=await getDownload('빈 템플릿 XLSX 다운로드하기');await template.saveAs('work/assessment-template.xlsx');
 assert.ok((await fs.readFile('work/assessment-written.xlsx')).subarray(0,2).equals(Buffer.from('PK')));
 await scope.fill('교체 전 원본');await reason().fill('기존 기록');
 const storageKey='gapzer0.assessment.gapzer0-v02-aq1.template-v2';
 const snapshot=await page.evaluate(k=>localStorage.getItem(k),storageKey);
 const choose=async buffer=>{await page.getByLabel('XLSX 파일 선택 (최대 25MB)').setInputFiles({name:'assessment.xlsx',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',buffer});};
 await choose(csv);const apply=page.getByRole('button',{name:'XLSX 내용으로 교체하기',exact:true});await apply.waitFor({state:'visible'});
 await page.getByRole('button',{name:'불러오기 취소',exact:true}).click();assert.equal(await scope.inputValue(),'교체 전 원본');
 await choose(csv);await apply.waitFor({state:'visible'});page.once('dialog',d=>d.dismiss());await apply.click();assert.equal(await reason().inputValue(),'기존 기록');
 await page.evaluate(()=>{window.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='gapzer0.assessment.gapzer0-v02-aq1.template-v2')throw Error('quota');return window.originalSet.call(this,key,value);};});
 page.once('dialog',d=>d.accept());await apply.click();assert.ok((await page.locator('.sa-import').innerText()).includes('적용하지 않았습니다'));assert.equal(await reason().inputValue(),'기존 기록');
 assert.equal(await page.evaluate(k=>localStorage.getItem(k),storageKey),snapshot);
 await page.evaluate(()=>{Storage.prototype.setItem=window.originalSet;localStorage.setItem('unrelated-import-setting','keep');});
 await choose(await editXlsx(csv,e=>e.set('xl/worksheets/sheet1.xml',e.get('xl/worksheets/sheet1.xml').replace('GOV-C-01-AQ-D-01','INVALID-ID'))));
 await page.waitForFunction(()=>document.querySelector('.sa-import').textContent.includes('없는 Question ID'));assert.equal(await apply.isVisible(),false);assert.equal(await scope.inputValue(),'교체 전 원본');
 await choose(Buffer.from([0xff,0xfe,0x00]));await page.waitForFunction(()=>document.querySelector('.sa-import').textContent.includes('지원하지 않는 형식'));assert.equal(await apply.isVisible(),false);
 await choose(csv);await apply.waitFor({state:'visible'});page.once('dialog',d=>d.accept());await apply.click();
 assert.equal(await scope.inputValue(),'XLSX 복원 시험');assert.equal(await reason().inputValue(),'한글, "인용"\n두 번째 줄');
 assert.equal(await page.evaluate(()=>localStorage.getItem('unrelated-import-setting')),'keep');
 await page.reload();await page.locator('.sa-question').first().waitFor();assert.equal(await reason().inputValue(),'한글, "인용"\n두 번째 줄');
 const again=await getDownload('작성 내용 XLSX 다운로드하기');assert.deepEqual(await fs.readFile(await again.path()),csv);
 // Imported strings must never create HTML nodes or send data to the network.
 await choose(await editXlsx(csv,e=>e.set('xl/worksheets/sheet1.xml',e.get('xl/worksheets/sheet1.xml').replace('한글, &quot;인용&quot;','&lt;img src=x onerror=alert(1)&gt;'))));await apply.waitFor({state:'visible'});page.once('dialog',d=>d.accept());await apply.click();
 assert.ok((await reason().inputValue()).includes('<img'));assert.equal(await page.locator('#assessment-app img').count(),0);
 // Shared strings, DEFLATE and both Excel date systems must survive a save/reopen.
 await page.getByLabel('평가기간 시작일',{exact:true}).fill('2026-01-01');
 await page.getByLabel('평가기간 종료일',{exact:true}).fill('2026-09-30');
 await page.getByLabel('평가일',{exact:true}).fill('2026-10-06');
 const dated=await getDownload('작성 내용 XLSX 다운로드하기'),datedBytes=await fs.readFile(await dated.path());
 for(const date1904 of [false,true]){
  await choose(await sharedStringXlsx(datedBytes,date1904));await apply.waitFor({state:'visible'});page.once('dialog',d=>d.accept());await apply.click();
  assert.equal(await page.getByLabel('평가기간 시작일',{exact:true}).inputValue(),'2026-01-01');
  assert.equal(await page.getByLabel('평가일',{exact:true}).inputValue(),'2026-10-06');
  assert.ok((await reason().inputValue()).includes('<img'));
 }
 for(const [modify,message]of [
  [xml=>xml.replace('<c r="I2" s="6" t="inlineStr">','<c r="I2" s="6" t="inlineStr"><f>1+1</f>'),'수식이 있습니다'],
  [xml=>'<!DOCTYPE worksheet [<!ENTITY x "a">]>'+xml,'지원하지 않는 형식'],
  [xml=>xml.replace('r="I2"','r="I999999"'),'지원하지 않는 형식'],
 ]){
  const before=await page.evaluate(k=>localStorage.getItem(k),storageKey);
  await choose(await editXlsx(datedBytes,e=>e.set('xl/worksheets/sheet1.xml',modify(e.get('xl/worksheets/sheet1.xml')))));
  await page.waitForFunction(text=>document.querySelector('.sa-import').textContent.includes(text),message);
  assert.equal(await apply.isVisible(),false);assert.equal(await page.evaluate(k=>localStorage.getItem(k),storageKey),before);
 }
 await page.setViewportSize({width:390,height:844});await page.locator('.sa-import').scrollIntoViewIfNeeded();
 if(await page.locator('.book.with-summary').count())await page.locator('.book-header a.js-toolbar-action').first().click();
 await page.screenshot({path:'work/import-mobile.png'});
 const overflow=await page.locator('#assessment-app').evaluate(e=>e.scrollWidth-e.clientWidth);assert.ok(overflow<=1,String(overflow));
 assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);
 console.log('PASS: XLSX preview/cancel/invalid file/formulas/XML/shared strings/1904 dates/quota failure/restore/reload, local-only processing and Excel downloads.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
