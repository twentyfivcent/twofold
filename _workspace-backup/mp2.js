require('./testguard');const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',protocolTimeout:20000,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-renderer-backgrounding','--disable-background-timer-throttling','--disable-backgrounding-occluded-windows']});
const U='http://localhost:8765/index.html?fakenet';const A=await b.newPage(),B=await b.newPage();const errs=[];for(const p of [A,B])p.on('pageerror',e=>errs.push(e+''));
await A.goto(U);await B.goto(U);await A.evaluate(()=>__api.hostOnline());await sleep(300);const code=await A.evaluate(()=>__api.LOBBY.code);
await B.evaluate(c=>__api.joinOnline(c),code);await sleep(700);await A.evaluate(()=>__api.hostStartMatch());await sleep(6000);
// host: put an enemy bot 5m in front of client and freeze it
await A.evaluate(()=>{const G=__api.G;const c=G.P[2];const e=G.P[1];e.bot=false;e.pos=[c.pos[0],0,c.pos[2]-5]});
await sleep(300);
const before=await A.evaluate(()=>__api.G.P[1].hp);
await B.evaluate(()=>{const G=__api.G,me=G.P[__api.ME];const e=G.P[1];me.yaw=0;me.pitch=Math.atan2((e.pos[1]+1.2)-(me.pos[1]+1.65),5);me.adsAmt=1;const w=__api.W[me.inv[0].w];__api.fireShot(me,w);});
await sleep(500);
const after=await A.evaluate(()=>__api.G.P[1].hp);
const hm=await B.evaluate(()=>document.querySelector('#hm').style.opacity);
console.log('enemy hp on host before/after client shot:',before,after,'weapon',await B.evaluate(()=>__api.G.P[__api.ME].inv[0].w),'client sees hp',await B.evaluate(()=>__api.G.P[1].hp));
console.log('errors',errs);await b.close()})();
