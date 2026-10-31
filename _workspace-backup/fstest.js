require('./testguard');// Cross-origin (127.0.0.1 page embeds localhost game, like itch.io). Fullscreen inside an itch-style iframe, with and without allowfullscreen. Real clicks (user gesture) via puppeteer.
const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const br=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const R={},errs=[];
for(const k of ['allow','deny']){const p=await br.newPage();await p.setViewport({width:1100,height:650});p.on('pageerror',e=>errs.push(k+': '+e.message));
 await p.goto('http://127.0.0.1:8765/fs_'+k+'.html');await sleep(4000);const f=p.frames().find(x=>x.url().includes('index.html'));
 R[k]={enabled:await f.evaluate(()=>document.fullscreenEnabled)};
 await f.evaluate(()=>{const b=[...document.querySelectorAll('.fsBtn')].find(x=>x.offsetParent);if(!b){document.querySelector('.fsBtn').closest('.mpage,.ptab')&&0}});
 // open settings page so the button is visible, then real-click it
 await f.evaluate(()=>{const m=document.querySelector('.mn[data-m="mSet"]')||[...document.querySelectorAll('.mn')].find(b=>/Settings/.test(b.textContent));m&&m.click()});await sleep(400);
 const b=await f.evaluateHandle(()=>[...document.querySelectorAll('.fsBtn')].find(x=>x.offsetParent));
 if(b.asElement()){await b.asElement().click();await sleep(800)}
 R[k].afterClick=await f.evaluate(()=>({last:window.__fsLast,fs:!!(document.fullscreenElement||document.webkitFullscreenElement),hint:(document.getElementById('fsHint')||{}).textContent||'',hintShown:!!(document.getElementById('fsHint')&&document.getElementById('fsHint').style.display!=='none'),btn:[...document.querySelectorAll('.fsBtn')].map(x=>x.textContent)[0]}));
 await p.screenshot({path:'progress/v7-fullscreen-iframe-'+k+'.png'});
 // Alt+Enter toggles back (exit when on)
 await f.focus('body').catch(()=>{});await p.keyboard.down('Alt');await p.keyboard.press('Enter');await p.keyboard.up('Alt');await sleep(800);
 R[k].afterAltEnter=await f.evaluate(()=>({last:window.__fsLast,fs:!!document.fullscreenElement}));await p.close()}
console.log(JSON.stringify(R,null,1));console.log('ERRS',JSON.stringify(errs));await br.close()})();
