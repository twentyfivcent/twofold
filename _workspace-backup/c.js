require('./testguard');const pp=require('puppeteer-core');const sleep=t=>new Promise(r=>setTimeout(r,t));
(async()=>{const b=await pp.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage();await p.setViewport({width:1280,height:720});const errs=[];p.on('pageerror',e=>errs.push(''+e));
await p.goto('http://localhost:8765/index.html?practice&map=5&speed=3');
for(let i=0;i<60;i++){await sleep(500);if(await p.evaluate(()=>__api.G.rs==='live'))break}
await p.evaluate(()=>{const me=typeof __api.ME==='function'?__api.ME():__api.ME;const m=typeof me==='object'?me:__api.G.P[me];m.pos[0]=-12;m.pos[1]=0;m.pos[2]=-17;m.yaw=Math.PI*0.88;m.pitch=0.05});await sleep(1200);
await p.screenshot({path:'v4-castle.png'});console.log('errs',errs);await b.close()})();
