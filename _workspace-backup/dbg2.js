require('./testguard');const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const br=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-angle=swiftshader']});const pg=await br.newPage();pg.on('pageerror',e=>console.log('PE',e.message));
await pg.goto('http://localhost:8765/index.html?q=low&practice&map=0');await sleep(4500);
await pg.evaluate(()=>{const G=__api.G;G.rs='live';G.rt=999;const me=G.P[__api.ME];me.pos=[0,0,-20];window.__forceSprint=1});await sleep(800);
console.log(await pg.evaluate(()=>{const G=__api.G,me=G.P[__api.ME];me.alive=false;const a=G.P[0],b=G.P[1];const ct=[G.rs,!!a,!!b,!a.alive,b.alive,b.bot,!b.pendConn,a.team===b.team,!a.bot,G.took];const r=hostTakeover(0,1);const i={ct,r,ME};return JSON.stringify({rs:G.rs,alive:me.alive,pos:me.pos,i,HOST,ME,w:G.waiting,mate:G.P.map(p=>[p.team,p.bot,p.alive])})}));await br.close()})()
