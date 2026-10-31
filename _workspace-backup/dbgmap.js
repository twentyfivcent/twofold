require('./testguard');const pp=require('puppeteer-core');const sleep=t=>new Promise(r=>setTimeout(r,t));
(async()=>{const b=await pp.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox']});const p=await b.newPage();
await p.goto('http://localhost:8765/index.html');await sleep(2000);
console.log(await p.evaluate((mi)=>{const m=__api.MAPS[mi],W=m.WG;let out=[];for(let j=W.nz-1;j>=0;j-=1){let r='';for(let i=0;i<W.nx;i+=1){const h=W.h[i*W.nz+j];r+=h<0?'#':h==0?'.':h<.6?'-':h<1.3?'=':'^'}out.push(r)}return m.n+'\n'+out.join('\n')},+process.argv[2]));
console.log(await p.evaluate(()=>window.__mapErrors.join('\n')));await b.close()})();
