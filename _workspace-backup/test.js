require('./testguard');const puppeteer=require('puppeteer-core');
const U='http://localhost:8765/index.html';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',protocolTimeout:20000,args:['--no-sandbox','--disable-renderer-backgrounding','--disable-background-timer-throttling','--disable-backgrounding-occluded-windows','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--window-size=1280,720']});
 const errs=[];
 const np=async()=>{const p=await b.newPage();await p.setViewport({width:1280,height:720});p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text())});return p};
 const mode=process.argv[2];
 if(mode==='basic'){
  const p=await np();await p.goto(U,{waitUntil:'networkidle0'});await sleep(800);await p.screenshot({path:'menu.png'});
  await p.click('#bPractice');await sleep(1500);
  console.log('after click practice:',await p.evaluate(()=>({rs:__api.G&&__api.G.rs,map:__api.G&&__api.G.mapDef.n,hud:!document.querySelector('#hud').classList.contains('hide')})));
  await p.evaluate(()=>__api.quitToMenu('')); console.log('menu back:',await p.evaluate(()=>!document.querySelector('#menu').classList.contains('hide')));
  // full round sped up
  await p.goto(U+'?practice&map=0&speed=8&autoplay',{waitUntil:'networkidle0'});
  let t0=Date.now(),log=[];
  while(Date.now()-t0<90000){const s=await p.evaluate(()=>{const G=__api.G;return G?{rs:G.rs,rn:G.rn,sc:G.sc.slice(),alive:G.P.map(p=>p.alive?p.hp:0),k:G.P.map(p=>p.k)}:null});log.push(JSON.stringify(s));if(!s||s.rn>=3)break;await sleep(1500)}
  console.log(log.filter((x,i)=>i%3==0||i==log.length-1).join('\n'));
 }
 if(mode==='shots'){
  for(const [m,name] of [[0,'gameplay'],[1,'gameplay2'],[2,'gameplay3']]){const p=await np();await p.goto(U+`?practice&map=${m}&autoplay`,{waitUntil:'networkidle0'});await sleep(7000);await p.screenshot({path:name+'.png'});await p.close()}
  for(const m of [0,1,2]){const p=await np();await p.goto(U+`?practice&map=${m}&overview&speed=2`,{waitUntil:'networkidle0'});await sleep(6500);await p.screenshot({path:`map${m+1}.png`});await p.close()}
  // ads/scope + smoke check
  const p=await np();await p.goto(U+'?practice&map=2',{waitUntil:'networkidle0'});await sleep(500);
  await p.evaluate(()=>{const G=__api.G;G.rs='live';G.rt=60;});
  await p.evaluate(()=>{const G=__api.G;const me=G.P[0];me.inv[0]={w:'longreach',mag:5,res:15};});
  await p.mouse.move(640,360);await p.mouse.down({button:'right'});await p.mouse.up({button:'right'});await sleep(300);await p.mouse.down({button:'right'});
  console.log('locked?',await p.evaluate(()=>document.pointerLockElement!=null));
  await sleep(800);await p.screenshot({path:'ads.png'});
 }
 if(mode==='mp'){
  const A=await np(),B=await np();
  await A.goto(U+'?fakenet',{waitUntil:'networkidle0'});await B.goto(U+'?fakenet',{waitUntil:'networkidle0'});
  await A.evaluate(()=>{document.querySelector('#nameIn').value='HostGuy';document.querySelector('#nameIn').dispatchEvent(new Event('input'))});
  await B.evaluate(()=>{document.querySelector('#nameIn').value='Buddy';document.querySelector('#nameIn').dispatchEvent(new Event('input'))});
  console.log('step host');await A.evaluate(()=>document.querySelector('#bHost').click());await sleep(300);const code=await A.$eval('#codeTxt',e=>e.textContent);console.log('code',code,/^[A-HJ-NP-Z]{5}$/.test(code));
  await B.type('#codeIn',code);await B.evaluate(()=>document.querySelector('#bJoin').click());await sleep(800);
  console.log('A lobby:',await A.$eval('#lobbyTeams',e=>e.innerText.replace(/\n/g,' | ')));
  console.log('B lobby:',await B.$eval('#lobbyTeams',e=>e.innerText.replace(/\n/g,' | ')));
  await B.evaluate(()=>document.querySelector('#bSwitch').click());await sleep(500);
  console.log('after switch A:',await A.$eval('#lobbyTeams',e=>e.innerText.replace(/\n/g,' | ')));
  await A.evaluate(()=>document.querySelector('#bStart').click());await sleep(1500);await A.screenshot({path:'mp-lobby-host.png'});
  const st=async()=>({A:await A.evaluate(()=>{const G=__api.G;return G&&{rs:G.rs,rn:G.rn,me:__api.ME,P:G.P.map(p=>[p.name,p.bot,p.pos.map(v=>+v.toFixed(1)).join(','),p.hp])}}),B:await B.evaluate(()=>{const G=__api.G;return G&&{rs:G.rs,rn:G.rn,me:__api.ME,lo:G.lo,P:G.P.map(p=>[p.name,p.bot,p.pos.map(v=>+v.toFixed(1)).join(','),p.hp])}})});
  console.log('start',JSON.stringify(await st()));
  await sleep(5000);
  // move client forward via keyboard
  await B.bringToFront();await B.keyboard.down('KeyW');await sleep(1500);await B.keyboard.up('KeyW');await sleep(500);
  console.log('after client moved',JSON.stringify(await st()));
  // client shoots: aim at an enemy and fire via api
  const shot=await B.evaluate(()=>{const G=__api.G,me=G.P[__api.ME];const en=G.P.find(p=>p.team!==me.team&&p.alive);const dx=en.pos[0]-me.pos[0],dz=en.pos[2]-me.pos[2],dy=en.pos[1]+1.2-(me.pos[1]+1.65);me.yaw=Math.atan2(-dx,-dz);me.pitch=Math.atan2(dy,Math.hypot(dx,dz));return en.id});
  await sleep(200);await B.screenshot({path:'mp-client.png'});
  await sleep(15000);
  console.log('mid',JSON.stringify(await st()));
  console.log('B killfeed:',await B.$eval('#kf',e=>e.innerText));
  await B.close({runBeforeUnload:true});await sleep(1500);
  console.log('after client left (host):',JSON.stringify((await st().catch(()=>null))||await A.evaluate(()=>__api.G.P.map(p=>[p.name,p.bot]))));
  // host-leaves test
  const C=await np();await C.goto(U+'?fakenet',{waitUntil:'networkidle0'});
  await A.evaluate(()=>__api.quitToMenu(''));await A.evaluate(()=>document.querySelector('#bHost').click());await sleep(300);const code2=await A.$eval('#codeTxt',e=>e.textContent);
  await C.type('#codeIn',code2);await C.evaluate(()=>document.querySelector('#bJoin').click());await sleep(700);await A.evaluate(()=>document.querySelector('#bStart').click());await sleep(1500);
  console.log('C in game:',await C.evaluate(()=>!!__api.G));
  await A.close({runBeforeUnload:true});await sleep(1500);
  console.log('C after host left:',await C.evaluate(()=>({G:!!__api.G,menu:!document.querySelector('#menu').classList.contains('hide'),msg:document.querySelector('#menuMsg').textContent})));
 }
 console.log('ERRORS:',errs.length?errs.join('\n'):'none');
 await b.close();
})().catch(e=>{console.error('FAIL',e);process.exit(1)});
