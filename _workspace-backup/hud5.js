require('./testguard');const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const pg=await b.newPage();await pg.setViewport({width:1280,height:720});const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error'&&!/404/.test(m.text()))errs.push(m.text())});
await pg.goto('http://localhost:8765/index.html?q=medium&practice&map=6');await sleep(6000);
await pg.evaluate(()=>{const G=__api.G;G.rs='live';G.rt=99;for(const p of G.P)if(p.id!==__api.ME){p.alive=false;p.pos=[0,-60,0]}G.P[__api.ME].alive=true;G.P[__api.ME].hp=100;window.__lk=1;for(const p of G.P)if(p.team===G.P[__api.ME].team&&p.id!==__api.ME){}});
const R={};
// wheel cycling
await pg.mouse.move(640,360);for(let i=0;i<3;i++){await pg.mouse.wheel({deltaY:100});await sleep(250);R['w'+i]=await pg.evaluate(()=>[window.__wsel,__api.G.P[__api.ME].cur,document.querySelector('.ws.on')&&document.querySelector('.ws.on').dataset.s])}
await pg.mouse.wheel({deltaY:100});await sleep(300);
// damage cues
await pg.evaluate(()=>{const G=__api.G,me=G.P[__api.ME];me.alive=true;me.hp=100;G.rs='live';me.spawnT=0;me.prot=0;const en=G.P.find(p=>p.team!==me.team);en.alive=true;en.pos=[me.pos[0]+5,0,me.pos[2]];__api.damage(me.id,en.id,75,'kestrel',false,[me.pos[0]+5,0,me.pos[2]],'body')});await sleep(250);
R.cues=await pg.evaluate(()=>[window.__cues,document.querySelectorAll('.da').length,__api.G.P[__api.ME].hp]);
await pg.screenshot({path:'v5-damage.png'});
await pg.evaluate(()=>{const me=__api.G.P[__api.ME];me.hp=100});await sleep(1500);await pg.screenshot({path:'v5-hud.png'});
await pg.evaluate(()=>{document.querySelector('#pause').classList.remove('hide')});await sleep(400);await pg.screenshot({path:'v5-pause-menu.png'});
await pg.evaluate(()=>{document.querySelector('.pn[data-p="pSet"]').click();document.querySelector('.pt[data-t="tVc"]').click()});await sleep(300);await pg.screenshot({path:'progress/v5-pause-settings.png'});
await pg.evaluate(()=>{document.querySelector('.pn[data-p="pScore"]').click()});await sleep(500);R.psb=await pg.evaluate(()=>document.querySelector('#pSb').innerText.length);
await pg.evaluate(()=>{document.querySelector('#pause').classList.add('hide');__api.kbOpen('menu')});await sleep(300);R.kbWheel=await pg.evaluate(()=>document.querySelector('#kbTable').innerText.includes('Wheel down'));await pg.screenshot({path:'v5-keybinds.png'});
console.log(JSON.stringify(R));console.log('errs',errs);await b.close()})();
