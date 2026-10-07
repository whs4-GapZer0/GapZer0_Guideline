import {chromium} from 'playwright';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(process.env.THEME_TEST_ROOT||'work/theme-preview');
const server=http.createServer(async(req,res)=>{try{let p=new URL(req.url,'http://localhost').pathname;if(p.endsWith('/'))p+='index.html';const f=path.resolve(root,'.'+p);if(!f.startsWith(root+path.sep))throw Error();res.setHeader('Content-Type',f.endsWith('.mjs')||f.endsWith('.js')?'text/javascript':f.endsWith('.json')?'application/json':f.endsWith('.css')?'text/css':f.endsWith('.html')?'text/html':'application/octet-stream');res.end(await fs.readFile(f));}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({channel:process.env.CI?undefined:'msedge',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const base=`http://127.0.0.1:${server.address().port}`;
 await page.goto(base+'/controls/asset-management/common/');
 await page.locator('.doc-control').first().waitFor();
 assert.equal(await page.locator('.markdown-section > h1 + hr').count(),0);
 assert.equal(await page.locator('.doc-control').first().evaluate(e=>getComputedStyle(e).marginTop),'46px');
 async function checkDrawers() {
  for (const topic of ['domains','controls','common','enhancement','local']) {
   await page.locator(`[data-framework-topic="${topic}"]`).click();
   await page.locator('dialog[open]').waitFor();
   const layout=await page.locator('#framework-detail').evaluate(dialog=>{
    const content=dialog.querySelector('.framework-drawer-content');
    return {directChild:content.parentElement===dialog,width:content.getBoundingClientRect().width,panelWidth:dialog.clientWidth,overflow:content.scrollWidth>content.clientWidth};
   });
   assert(layout.directChild,`${topic}: drawer content must remain outside the close-button wrapper after AJAX navigation`);
   assert(layout.width>layout.panelWidth-4,`${topic}: drawer content must fill the panel`);
   assert(!layout.overflow,`${topic}: drawer content must not overflow horizontally`);
   await page.locator('[data-close-framework]').click();
  }
 }
 // A direct load misses GitBook's HTML rewriting bug; enter through its menu.
 await page.locator('.book-summary a[href="/introduction/"]').click();
 await checkDrawers();
 await page.reload();
 await checkDrawers();
 await page.setViewportSize({width:390,height:844});
 await page.goto(base+'/');
 await page.locator('.book-header .fa-align-justify').locator('..').click();
 await page.locator('.book-summary a[href="/introduction/"]').click();
 await checkDrawers();
 await page.setViewportSize({width:1280,height:900});
 await page.reload();
 if (!await page.locator('.book').evaluate(el=>el.classList.contains('with-summary'))) {
  await page.locator('.book-header .fa-align-justify').locator('..').click();
 }
 await page.locator('.book-summary a[href="/self-assessment/"]').click();
 await page.getByRole('link',{name:'자가진단 시작하기',exact:true}).click();
 await page.locator('.sa-control-form').first().waitFor();
 const note=page.locator('.sa-control-form textarea').first();
 await note.fill('작성 중인 Control 기록');
 await page.getByRole('button',{name:'브라우저에 저장',exact:true}).click();
 await page.reload();
 await page.locator('.sa-control-form').first().waitFor();
 assert.equal(await page.locator('.sa-control-form textarea').first().inputValue(),'작성 중인 Control 기록');
 const pending=page.waitForEvent('download');
 await page.getByRole('button',{name:'작성 내용 Excel로 다운로드',exact:true}).click();
 const download=await pending;
 await page.locator('input[type=file]').setInputFiles({name:download.suggestedFilename(),mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',buffer:await fs.readFile(await download.path())});
 await page.getByRole('button',{name:'Excel 내용으로 교체하기',exact:true}).waitFor({state:'visible'});
 page.once('dialog',d=>d.accept());
 await page.getByRole('button',{name:'Excel 내용으로 교체하기',exact:true}).click();
 assert.equal(await page.locator('.sa-control-form textarea').first().inputValue(),'작성 중인 Control 기록');
 await page.screenshot({path:'work/control-site.png'});
 console.log('PASS: Jekyll Control layout, framework drawer, navigation, storage and Excel round trip');
} finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
