require('./testguard');const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const br=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-angle=swiftshader']});const pg=await br.newPage();pg.on('pageerror',e=>console.log('PE',e.message));
await pg.goto('http://localhost:8765/index.html?q=low&practice&map=0');await sleep(4500);
await pg.evaluate(()=>{const G=__api.G;G.rs='live';G.rt=999;const me=G.P[__api.ME];const l=MAPS[G.mapIdx].lpw[1];me.pos=[l[1][0],0,l[1][1]-4];me.yaw=Math.PI;window.__forceSprint=1});await sleep(900);
await pg.evaluate(()=>{window.__forceSlide=1});await sleep(150);console.log(await pg.evaluate(()=>{const me=__api.G.P[__api.ME];const i=localInput();const s={g:me.ground,m:me.moving,w:me.wasCr,cd:me.slideCd,st:me.stam,mant:me.mant,sl:me.slideT,i};movePlayer(me,i,1/60);s.after=me.slideT;return JSON.stringify(s)}));await br.close()})()
