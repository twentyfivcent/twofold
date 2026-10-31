require('./testguard');const pp=require('puppeteer-core');const sleep=t=>new Promise(r=>setTimeout(r,t));
const ARGS=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-renderer-backgrounding','--disable-background-timer-throttling'];
const [a0,a1,secs]=[+(process.argv[2]||0),+(process.argv[3]||11),+(process.argv[4]||40)];
(async()=>{for(let m=a0;m<a1;m++){const b=await pp.launch({executablePath:'/usr/bin/google-chrome',headless:'new',protocolTimeout:120000,args:ARGS});
 try{const p=await b.newPage();await p.setViewport({width:960,height:540});const errs=[];p.on('pageerror',e=>errs.push(''+e));p.on('console',x=>{if(x.type()==='error'&&!/404|supabase|Failed to load/i.test(x.text()))errs.push(x.text())});
 await p.goto(`http://localhost:8765/index.html?q=low&speed=4&autoplay&practice&map=${m}`);const seen=new Set();const tods=new Set();
 for(let t=0;t<secs;t+=2){await sleep(2000);const f=await p.evaluate(()=>window.__G&&__G.flag?[__G.flag.i,__G.rn,__G.tod]:null);if(f){seen.add(f[1]+':'+f[0]);tods.add(f[2])}}
 const st=await p.evaluate(()=>{const G=window.__G;return {map:G.mapDef.n,rn:G.rn,sc:G.sc,stuckMax:window.__botStuckMax,nstuck:(window.__botStuck||[]).length,kills:G.P.map(p=>p.k),ys:G.P.map(p=>+p.pos[1].toFixed(1)),maxY:window.__maxBotY,at:(window.__botStuck||[]).map(s=>s.at.join(",")+"@"+s.dur).join(" ")}});
 st.flags=[...seen].join(' ');st.tod=[...tods].join();st.errs=errs.slice(0,4);console.log(JSON.stringify(st))}catch(e){console.log('ERR',m,e.message.slice(0,100))}await b.close()}})();
