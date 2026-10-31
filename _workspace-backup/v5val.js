require('./testguard');const pp=require('puppeteer-core');const sleep=t=>new Promise(r=>setTimeout(r,t));
const ARGS=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'];
(async()=>{const b=await pp.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:ARGS});const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(''+e));p.on('console',m=>{if(m.type()==='error'&&!/404/.test(m.text()))errs.push(m.text())});
await p.goto('http://localhost:8765/index.html');await sleep(2500);
console.log(await p.evaluate(()=>__api.MAPS.map(m=>`${m.n} [${m.size}] lanes: ${m.lanes.map((l,i)=>l+(m.laneOk[i]?' ok':' FAIL')).join(' | ')} | exits ${m.exits} | cross ${m.cross} | spawn sightlines ${m.leaks}`).join('\n')));
console.log('icons',await p.evaluate(()=>[window.__icons,window.__iconMs]));console.log('errs',errs);await b.close()})();
