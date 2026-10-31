require('./testguard');const pp=require('puppeteer-core');const sleep=t=>new Promise(r=>setTimeout(r,t));
const ARGS=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-renderer-backgrounding','--disable-background-timer-throttling','--disable-backgrounding-occluded-windows'];
const diff=process.argv[2]||'normal';
(async()=>{const b=await pp.launch({executablePath:'/usr/bin/google-chrome',headless:'new',protocolTimeout:60000,args:ARGS});const errs=[];
for(let mi=0;mi<6;mi++){const p=await b.newPage();await p.setViewport({width:960,height:540});p.on('pageerror',e=>errs.push(mi+': '+e));p.on('console',m=>{if(m.type()==='error'&&!/404/.test(m.text()))errs.push(mi+': '+m.text())});
 await p.evaluateOnNewDocument(d=>{const s=JSON.parse(localStorage.getItem('twofold')||'{}');s.botDiff=d;localStorage.setItem('twofold',JSON.stringify(s))},diff);
 await p.goto(`http://localhost:8765/index.html?autoplay&practice&map=${mi}&speed=2`);
 let live=0,last=Date.now(),kills=0,rounds=new Set(),maxOngoing=0;
 while(live<60){await sleep(500);const st=await p.evaluate(()=>{const G=__api.G;let mo=0;for(const q of G.P)if(q.bot_&&q.alive)mo=Math.max(mo,q.bot_.stuckT||0);return {rs:G.rs,rn:G.rn,k:G.P.reduce((a,q)=>a+q.k,0),mo}});const now=Date.now();if(st.rs==='live')live+=(now-last)/1000*2;last=now;kills=st.k;rounds.add(st.rn);maxOngoing=Math.max(maxOngoing,st.mo)}
 const r=await p.evaluate(()=>({n:__api.G.mapDef.n,ev:window.__botStuck,mx:window.__botStuckMax}));
 const ev=r.ev;console.log(`${r.n}: ~60s live play, rounds seen ${[...rounds].join(',')}, kills ${kills}, stuck events(>=1s) ${ev.length}, longest ${Math.max(maxOngoing,...ev.map(e=>e.dur),0).toFixed(2)}s`+(ev.length?' '+JSON.stringify(ev.slice(0,6)):''));
 await p.close()}
console.log('errors',errs);await b.close()})();
