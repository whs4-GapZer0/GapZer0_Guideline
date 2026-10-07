const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1080}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const results=[];
 async function test(id,name,fn){try{await fn();results.push({id,name,status:'PASS'});}catch(e){results.push({id,name,status:'FAIL',error:e.message});}}
 const visible=async s=>assert(await page.locator(s).isVisible(),s);
 const example=async m=>{await page.click(`[data-example="${m}"]`);await page.click('#submit');await page.locator('#results').waitFor({state:'visible'});};
 await test('U01','메인 화면 렌더링',async()=>{await page.goto(process.env.UI_URL||'http://127.0.0.1:8765/ai-skill-ui/');await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Demo 준비 완료'));assert.equal(await page.locator('h1').textContent(),'GapZer0 AI Assistant');assert.equal(errors.length,0);});
 await test('U02','기능 선택',async()=>{for(const m of ['guide','plan','document']){await page.click(`[data-mode="${m}"]`);assert.equal(await page.locator(`[data-mode="${m}"]`).getAttribute('aria-pressed'),'true');assert.equal(await page.locator('[data-mode][aria-pressed=true]').count(),1);}});
 await test('U03','예시 질문 입력',async()=>{for(const m of ['guide','plan','document']){await page.click(`[data-example="${m}"]`);assert((await page.inputValue('#question')).length>20);assert.equal(await page.locator(`[data-mode="${m}"]`).getAttribute('aria-pressed'),'true');}});
 await test('U04','Control 안내 결과',async()=>{await example('guide');assert.equal(await page.locator('.control-card').count(),4);for(const id of ['IAM-C-01','IAM-C-03','HRS-C-01'])assert((await page.locator('#control-cards').textContent()).includes(id));await page.locator('details').first().click();await visible('details[open] .excerpt');});
 await test('U05','이행계획 결과',async()=>{await example('plan');for(const t of ['목표','실행 활동','Owner','Stakeholders','Timing','Evidence','Status','Source'])assert((await page.locator('#practical').textContent()).includes(t));});
 await test('U06','실무 문서 결과',async()=>{await example('document');for(const t of ['목적','적용범위','역할','업무 절차','Evidence','검토 및 개선'])assert((await page.locator('#practical').textContent()).includes(t));assert.equal(await page.locator('.control-card').count(),9);});
 await test('U07','실제 Source 표시 및 읽기',async()=>{for(const m of ['guide','plan','document']){await example(m);for(const a of await page.locator('a.source').all()){const href=await a.getAttribute('href');assert(href.startsWith('../skill/references/controls/'));const url=new URL(href,page.url());const id=url.hash.slice(1).toUpperCase();url.hash='';const response=await page.request.get(url.href);assert.equal(response.status(),200);assert((await response.text()).includes('## '+id));}}});
 await test('U08','안전성 태그 구분',async()=>{await example('document');for(const t of ['가이드라인 근거','AI 제안','확인 필요','조직 결정 필요'])assert((await page.locator('#results .tag').allTextContents()).includes(t));});
 await test('U09','잘못된 입력 처리',async()=>{await page.fill('#question',' ');await page.click('#submit');await visible('#error');assert(!(await page.locator('#results').isVisible()));await page.fill('#question','<img src=x onerror=alert(1)>');await page.click('#submit');assert((await page.locator('#error').textContent()).includes('예시 질문만'));assert.equal(await page.locator('#results img').count(),0);await page.click('[data-example=guide]');await page.click('[data-mode=plan]');await page.click('#submit');await visible('#error');assert.equal(errors.length,0);});
 await test('U10','Demo 표시 및 레이아웃',async()=>{await example('guide');assert((await page.locator('header .demo').textContent()).includes('실시간 AI 호출 없음'));assert((await page.locator('#results .demo').textContent()).includes('원본 Runtime 응답 전문 아님'));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(__dirname,'main-screen.png'),fullPage:true});await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(errors.length,0);});
 await browser.close();
 const pass=results.filter(r=>r.status==='PASS').length;
 const output={total:results.length,pass,fail:results.length-pass,passRate:pass/results.length*100,browser:'Chromium via Playwright',runtime:'static demo; no LLM',results,browserErrors:errors};
 fs.writeFileSync(path.join(__dirname,'ui-test-results.json'),JSON.stringify(output,null,2)+'\n');console.log(JSON.stringify(output,null,2));process.exitCode=output.fail?1:0;
})().catch(e=>{console.error(e);process.exitCode=1;});
