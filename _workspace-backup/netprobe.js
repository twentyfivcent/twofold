require('./testguard');const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',protocolTimeout:90000,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-renderer-backgrounding','--disable-background-timer-throttling','--disable-backgrounding-occluded-windows']});
const U='http://localhost:8765/index.html?fakenet&q=low';const errs=[];const P=[];
for(let i=0;i<2;i++){const p=await b.newPage();await p.setViewport({width:900,height:500});p.on('pageerror',e=>errs.push(i+': '+e));await p.goto(U);await p.evaluate(()=>{window.__noAutoFS=1});P.push(p)}
const [H,C]=P;await H.evaluate(()=>__api.hostOnline());await sleep(500);const code=await H.evaluate(()=>__api.LOBBY.code);await C.evaluate(c=>__api.joinOnline(c),code);await sleep(2000);
await H.evaluate(()=>__api.hostStartMatch());
for(let i=0;i<40;i++){await sleep(1000);if((await H.evaluate(()=>__api.G&&__api.G.rs))==='live')break}
const ids=await Promise.all(P.map(p=>p.evaluate(()=>__api.ME)));
const rec=(p,other)=>p.evaluate(o=>{window.__rec=[];window.__ri=setInterval(()=>{const G=__api.G;const q=G.P[o];window.__rec.push([q.inv[q.cur].w+'|'+(skinOf(q)||''),heldOf(q),+q.yaw.toFixed(2),G.rs])},16)},other);
await rec(H,ids[1]);await rec(C,ids[0]);
// both players act: fire, reload, ads, swap
const act=p=>p.evaluate(()=>{const me=__api.G.P[__api.ME];let n=0;window.__act=setInterval(()=>{n++;me.yaw+=.01;if(n%60===0)me.cur=1-me.cur;me.ads=n%40<20},16)});
await C.bringToFront();await C.mouse.move(450,250);await C.mouse.down();await sleep(1500);await C.mouse.up();for(const k of ['Digit2','KeyR','Digit1','KeyR','Digit2']){await C.keyboard.press(k);await sleep(500)}await C.mouse.down();for(let i=0;i<20;i++){await C.mouse.move(450+i*5,250);await sleep(50)}await C.mouse.up();await sleep(1000);
for(const [n,p] of [['host sees client',H],['client sees host',C]]){const r=await p.evaluate(()=>{clearInterval(window.__ri);clearInterval(window.__act);return window.__rec});let ch=0,hc=0;for(let i=1;i<r.length;i++){if(r[i][0]!==r[i-1][0])ch++;if(r[i][1]!==r[i-1][1])hc++}
 console.log(n,'samples',r.length,'gunChanges',ch,'heldChanges',hc,'rs',r[r.length-1][3],[...new Set(r.map(x=>x[0]+'/'+x[1]))].slice(0,10))}
console.log('errs',errs.slice(0,5));await b.close()})();
