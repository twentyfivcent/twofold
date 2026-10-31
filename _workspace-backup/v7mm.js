require('./testguard');// Quick Play mock test: mock Supabase (shared localStorage queue) + fakenet PeerJS, 4-5 browser pages.
const puppeteer=require('puppeteer-core');const fs=require('fs');const sleep=ms=>new Promise(r=>setTimeout(r,ms));const MOCK=fs.readFileSync(__dirname+'/mock-supabase.js','utf8');
(async()=>{const br=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',protocolTimeout:120000,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-renderer-backgrounding','--disable-background-timer-throttling','--disable-backgrounding-occluded-windows']});
const errs=[];const R={};
async function page(i){const p=await br.newPage();await p.setViewport({width:1000,height:600});p.on('pageerror',e=>errs.push(i+': '+e.message));
 await p.setRequestInterception(true);p.on('request',r=>{if(r.url().includes('supabase-js'))r.respond({status:200,contentType:'application/javascript',body:MOCK});else r.continue()});
 await p.goto('http://localhost:8765/index.html?fakenet&q=low');return p}
const st=p=>p.evaluate(()=>({mm:MM.st,me:typeof ME!=='undefined'?ME:-1,G:!!__api.G,hum:__api.G?__api.G.P.map(q=>q.bot?'b':'h').join(''):'',names:__api.G?__api.G.P.map(q=>q.name).join('|'):'',lobby:LOBBY?{code:LOBBY.code,host:LOBBY.host,qp:LOBBY.qp}:null,msg:document.querySelector('#menuMsg').textContent,mmBox:!document.querySelector('#mmBox').classList.contains('hide'),sub:document.querySelector('#mmSub').textContent}));
// A) 4 players queue -> one match, longest waiter hosts
let P=[];for(let i=0;i<4;i++)P.push(await page(i));await sleep(3000);await P[0].evaluate(()=>localStorage.removeItem('__mmq'));
for(let i=0;i<4;i++){await P[i].evaluate(n=>{settings.name=n},'QP'+i);await P[i].evaluate(()=>MM.start());await sleep(i===2?0:900);if(i===1){await sleep(400);await P[1].screenshot({path:'progress/v7-quickplay-search.png'})}}
await sleep(15000);R.fourPlayers=await Promise.all(P.map(st));
// B) cancel search
const c=await page(9);await sleep(2500);await c.evaluate(()=>{MM.fill=60;MM.start()});await sleep(2500);const before=await c.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('__mmq')||'{}')).length);
await c.evaluate(()=>MM.cancel());await sleep(500);R.cancel={queueBefore:before,queueAfter:await c.evaluate(()=>Object.values(JSON.parse(localStorage.getItem('__mmq')||'{}')).filter(r=>r.status==='waiting').length),st:await st(c)};
// C) lone player -> bot fill after fill window (set to 6s for the test; production 20s)
await c.evaluate(()=>{MM.fill=6;MM.start()});await sleep(3000);R.loneSearching=await st(c);await sleep(16000);R.loneBotFill=await st(c);await c.screenshot({path:'progress/v7-quickplay-botfill.png'});
await c.evaluate(()=>quitToMenu(''));
// D) leaver: ghost queues then closes tab; a newcomer must not be matched with the ghost
const g=await page(7);await sleep(2500);await g.evaluate(()=>{MM.fill=60;MM.start()});await sleep(2000);await g.close();await sleep(13500);
await c.evaluate(()=>{MM.fill=60;MM.start()});await sleep(3000);R.leaverPurged=await c.evaluate(()=>Object.values(JSON.parse(localStorage.getItem('__mmq')||'{}')).map(r=>r.name+':'+r.status));await c.evaluate(()=>MM.cancel());
// E) matched host leaves before start -> clients requeue
for(const p of P)await p.evaluate(()=>quitToMenu(''));await sleep(500);await P[0].evaluate(()=>localStorage.removeItem('__mmq'));
await P[0].evaluate(()=>{MM.fill=5;MM.start()});await sleep(700);await P[1].evaluate(()=>{MM.fill=5;MM.start()});await sleep(9000);
const hs=await st(P[0]),cs=await st(P[1]);await P[0].evaluate(()=>{MM.st='x';cleanupNet()});await sleep(24000);R.hostLeft={hostWas:hs,clientWas:cs,clientNow:await st(P[1])};
console.log(JSON.stringify(R,null,1));console.log('ERRS',errs.slice(0,8));await br.close()})();
