const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
(async()=>{
 const root=path.resolve(__dirname,'../..');
 const data=JSON.parse(fs.readFileSync(path.join(root,'ai-skill-ui/demo-data.json'),'utf8'));
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1080}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const results=[];
 async function test(id,name,fn){try{await fn();results.push({id,name,status:'PASS'});}catch(e){results.push({id,name,status:'FAIL',error:e.message});}}
 async function choose(mode){await page.click(`[data-example=${mode}]`);}
 async function ask(mode){await choose(mode);await page.click('#submit');await page.locator('#results').waitFor({state:'visible'});}
 const body=()=>page.locator('body').innerText();
 await test('UX01','첫 화면 목적·질문 안내',async()=>{
  await page.goto(process.env.UI_URL||'http://127.0.0.1:8893/ai-skill-ui/');await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Demo 준비 완료'));
  assert.equal(await page.locator('h1').textContent(),'GapZer0 AI Assistant');
  assert((await page.locator('.hero-purpose').textContent()).includes('필요한 보안 통제를 찾아 실행 방법과 문서 초안까지 제공합니다.'));
  assert((await body()).includes('무엇을 해결하고 싶나요?'));
  assert.equal(await page.locator('#question').getAttribute('placeholder'),'예: 직원이 퇴사했습니다. 계정과 접근권한을 어떻게 회수해야 하나요?');
  for(const s of ['.hero-purpose','.usage','[data-mode=guide]','#question','#submit'])assert((await page.locator(s).boundingBox()).y<1080);
  await page.screenshot({path:path.join(__dirname,'ux-main-desktop.png')});
 });
 await test('UX02','3단계 사용법·원래 근거 흐름',async()=>{assert.equal(await page.locator('.usage-steps li').count(),3);for(const t of ['필요한 도움 선택','보안 업무 상황 입력','관련 통제와 실행 방법 확인'])assert((await page.locator('.usage').innerText()).includes(t));for(const t of ['사용자 질문','GapZer0 AI Skill','관련 Control','가이드라인 근거','실무 결과'])assert((await page.locator('.flow').innerText()).includes(t));});
 await test('UX03','3가지 기능과 보조 이름',async()=>{assert.equal(await page.locator('[data-mode]').count(),3);for(const t of ['어떤 보안 통제가 필요한지 찾기','보안 통제 실행계획 만들기','실무 문서 초안 만들기','Control 안내','이행계획','실무 문서 초안'])assert((await page.locator('.modes').innerText()).includes(t));});
 await test('UX04','3가지 기능별 예시 질문',async()=>{assert.equal(await page.locator('[data-example]').count(),3);assert((await page.locator('.examples').innerText()).includes('처음이라면 예시로 시작해보세요'));assert.deepEqual(await page.locator('[data-example] span').allTextContents(),['통제 찾기','이행계획','문서 초안']);});
 await test('UX05','다른 기능에서 예시 선택 자동 전환',async()=>{for(const scenario of data.scenarios){await page.click(`[data-mode=${scenario.mode==='guide'?'plan':'guide'}]`);await choose(scenario.mode);assert.equal(await page.locator(`[data-mode=${scenario.mode}]`).getAttribute('aria-pressed'),'true');assert.equal(await page.locator('[data-mode][aria-pressed=true]').count(),1);assert(!(await page.locator('#error').isVisible()));}});
 await test('UX06','질문 자동 입력·버튼 문구',async()=>{const labels={guide:'관련 보안 통제 확인하기',plan:'이행계획 만들기',document:'문서 초안 만들기'};for(const s of data.scenarios){await choose(s.mode);assert.equal(await page.inputValue('#question'),s.question);assert((await page.locator('#submit').innerText()).includes(labels[s.mode]));}});
 await test('UX07','실행 결과와 요약·활동·Evidence 표시',async()=>{for(const s of data.scenarios){await ask(s.mode);assert((await page.locator('#results h2').textContent()).includes('추천 결과'));assert((await page.locator('#result-summary').innerText()).includes(`Control ${s.controls.length}개`));assert(!(await page.locator('#error').isVisible()));await page.locator('.control-card details').nth(1).click();assert((await page.locator('.control-card').first().innerText()).includes('확보된 증적이 아닙니다'));assert((await page.locator('.glossary').innerText()).includes('통제를 수행했다는 것을 확인할 수 있는 증적'));}});
 await test('UX08','기존 Control ID·이름',async()=>{for(const s of data.scenarios){await ask(s.mode);assert.deepEqual(await page.locator('.control-id').allTextContents(),s.controls.map(c=>c.id+(c.conditional?' · 조건부':'')));assert.deepEqual(await page.locator('.control-card h3').allTextContents(),s.controls.map(c=>c.name));}});
 await test('UX09','실제 Source 표시·상대경로 접근',async()=>{for(const s of data.scenarios){await ask(s.mode);const links=await page.locator('a.source').all();for(let i=0;i<links.length;i++){assert((await links[i].innerText()).includes(s.controls[i].source));const url=new URL(await links[i].getAttribute('href'),page.url());const r=await page.request.get(url.href);assert.equal(r.status(),200);assert((await r.text()).includes('## '+s.controls[i].id));}}});
 await test('UX10','Demo 고지·모바일 표현·오류 없음',async()=>{assert((await page.locator('.demo-note').innerText()).includes('현재 데모에서는 검증이 완료된 대표 시나리오를 제공합니다.'));assert((await page.locator('.demo-note').innerText()).includes('실시간 AI 호출 없음'));assert.equal(errors.length,0);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.setViewportSize({width:390,height:844});await page.reload();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Demo 준비 완료'));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(__dirname,'ux-main-mobile.png'),fullPage:true});await page.setViewportSize({width:1440,height:1080});});
 await test('UX11','기존 3개 시나리오 원문 데이터·안전 태그 유지',async()=>{for(const s of data.scenarios){await ask(s.mode);for(let i=0;i<s.controls.length;i++){const c=s.controls[i];assert((await page.locator('.control-card').nth(i).innerText()).includes(c.fields['Control Objective']));}for(const t of ['가이드라인 근거','AI 제안','확인 필요','조직 결정 필요'])assert((await page.locator('#results .tag').allTextContents()).includes(t));}const baseline=JSON.parse(fs.readFileSync(process.env.UX_BASELINE,'utf8'));for(const p of ['ai-skill-ui/demo-data.json','ai-skill-ui/runtime-adapter.js'])assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex'),baseline[p]);await ask('guide');await page.screenshot({path:path.join(__dirname,'ux-result-desktop.png'),fullPage:true});});
 await test('UX12','ai-skill-ui 외 파일 변경 0',async()=>{assert(process.env.UX_BASELINE,'UX_BASELINE must point to a pre-edit SHA-256 snapshot');const b=JSON.parse(fs.readFileSync(process.env.UX_BASELINE,'utf8'));const files=execFileSync('rg',['--files','--hidden','-g','!.git'],{cwd:root,encoding:'utf8'}).trim().split('\n');for(const f of files.filter(f=>!f.startsWith('ai-skill-ui/'))){assert(f in b,'Unexpected outside file: '+f);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex'),b[f],f);}for(const f of Object.keys(b).filter(f=>!f.startsWith('ai-skill-ui/')))assert(fs.existsSync(path.join(root,f)),f);});
 await browser.close();const pass=results.filter(r=>r.status==='PASS').length;const out={total:12,pass,fail:12-pass,passRate:pass/12*100,browserErrors:errors,scope:'Local UX browser checks; no deployment, no live LLM',results};fs.writeFileSync(path.join(__dirname,'ux-test-results.json'),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));process.exitCode=out.fail?1:0;
})().catch(e=>{console.error(e);process.exitCode=1;});
