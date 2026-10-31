require('./testguard');const pp=require('puppeteer-core');const sleep=t=>new Promise(r=>setTimeout(r,t));
(async()=>{const b=await pp.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});const p=await b.newPage();await p.setViewport({width:1280,height:720});const errs=[];p.on('pageerror',e=>errs.push(''+e));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text())});
await p.goto('http://localhost:8765/index.html');await sleep(1500);
console.log('errs so far',errs);
console.log('errors',errs);await b.close()})();
