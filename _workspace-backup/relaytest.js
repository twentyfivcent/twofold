require('./testguard');const pp=require('puppeteer-core');const sleep=t=>new Promise(r=>setTimeout(r,t));
(async()=>{const b=await pp.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage();await p.setViewport({width:1280,height:1000});const errs=[];p.on('pageerror',e=>errs.push(''+e));
await p.goto('http://localhost:8765/index.html?fakenet');await p.click('#bRelay');await p.select('#rMode','manual');await p.type('#rUrl','turns:example.invalid:443?transport=tcp');await p.type('#rUser','u');await p.type('#rCred','c');await p.click('#rSave');
console.log('stat:',await p.$eval('#rStat',e=>e.textContent),'stored:',await p.evaluate(()=>localStorage.getItem('twofold')));
await p.reload();console.log('persisted url:',await p.$eval('#rUrl',e=>e.value));
await p.screenshot({path:'relay_panel.png'});
await p.evaluate(()=>__api.joinOnline('ZZZZZ'));await sleep(11000);console.log('10s:',await p.$eval('#menuMsg',e=>e.textContent));
await sleep(20000);console.log('30s:',await p.$eval('#menuMsg',e=>e.textContent));console.log('errors',errs);await b.close()})();
