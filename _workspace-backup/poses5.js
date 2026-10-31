require('./testguard');const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const br=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-angle=swiftshader']});const pg=await br.newPage();await pg.setViewport({width:800,height:450});const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await pg.goto('http://localhost:8765/index.html?q=medium&practice&map=1');await sleep(4000);
const ids=process.argv[2].split(',');const poses=(process.argv[3]||'hip,ads,sprint,reload,slide,inspect').split(',');
for(const id of ids)for(const pose of poses){await pg.evaluate((id,pose)=>{const G=__api.G;G.rs='live';G.rt=999;for(const p of G.P)if(p.id!==__api.ME){p.pos=[60,-60,60];p.hp=9999}const me=G.P[__api.ME];me.alive=true;me.hp=100;me.pos=[0,0,-10];me.yaw=Math.PI;me.pitch=-.05;
 if(me.inv[0].w!==id)__api.equip(me,[id,'sparrow','frag']);me.reloadT=0;me.swapT=0;window.__forceADS=pose==='ads'?1:0;window.__forceSprint=pose==='sprint'||pose==='slide';window.__forceSlide=pose==='slide';window.__forceInspect=pose==='inspect';if(pose==='reload')me.reloadT=W[id].rel*.5;},id,pose);
 await sleep(pose==='reload'?150:700);await pg.screenshot({path:`progress/v6pose-${id}-${pose}.png`});}
await pg.evaluate(()=>{window.__forceADS=0;window.__forceSprint=0;window.__forceSlide=0;window.__forceInspect=0});
console.log('ERRS',errs.slice(0,5));await br.close()})()
