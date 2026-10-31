require('./testguard');const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const br=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const pg=await br.newPage();await pg.goto('http://localhost:8765/index.html?q=low&practice&map=0');await sleep(4000);const ev=(f)=>pg.evaluate(f);
console.log(await ev(()=>{const G=__api.G,me=G.P[__api.ME];const saved=G.boxes;G.boxes=[{min:[-2,0,-8],max:[2,2.0,-6]}];me.pos=[0,0,0];me.vel=[0,0,0];me.mant=null;me.slideT=0;me.grap={pt:[0,1.9,-6],t:1.5};const log=[];
 for(let i=0;i<60;i++){movePlayer(me,{f:0,r:0},1/60);if(i%5==0)log.push([me.pos.map(v=>v.toFixed(2)).join(','),!!me.grap,!!me.mant].join(' '))}
 me.pos=[0,1.0,-5.6];me.yaw=0;const pr=mantleProbe(me,[0,0,-1]);G.boxes=saved;return log.join('\n')+'\nprobe '+JSON.stringify(pr)}));
console.log(await ev(()=>{const G=__api.G;return JSON.stringify({rs:G.rs,bots:G.P.map(p=>[p.bot,p.alive,p.team,p.off])})}));
await br.close()})();
