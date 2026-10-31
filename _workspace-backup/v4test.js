require('./testguard');const pp=require('puppeteer-core');const sleep=t=>new Promise(r=>setTimeout(r,t));
const ARGS=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-renderer-backgrounding','--disable-background-timer-throttling','--disable-backgrounding-occluded-windows'];
(async()=>{const b=await pp.launch({executablePath:'/usr/bin/google-chrome',headless:'new',protocolTimeout:60000,args:ARGS});
const errs=[];const mk=async()=>{const p=await b.newPage();await p.setViewport({width:1280,height:720});p.on('pageerror',e=>errs.push(''+e));p.on('console',m=>{if(m.type()==='error'&&!/404|favicon/.test(m.text()))errs.push('console: '+m.text())});return p};
const U='http://localhost:8765/index.html';
let p=await mk();await p.goto(U);await sleep(1200);
console.log('menu ok:',await p.$eval('h1',e=>e.textContent),'| mapErrors',await p.evaluate(()=>JSON.stringify(window.__mapErrors)));
console.log(await p.evaluate(()=>__api.MAPS.map(m=>m.n+': exits '+m.exits+', sightlines '+m.leaks).join('\n')));
// bots-only practice (autoplay = my slot is driven by a bot too)
await p.goto(U+'?autoplay&practice&map=0&speed=3');await sleep(1500);
const st=()=>p.evaluate(()=>{const G=__api.G;return {rs:G.rs,rn:G.rn,rt:+G.rt.toFixed(1),votes:G.votes.join(','),lo:G.lo.join('/'),sc:G.sc.join('-')}});
console.log('start:',JSON.stringify(await st()));
const seen=new Set();let lastRn=0,t0=Date.now();const log=[];
while(Date.now()-t0<150000){const s=await st();const k=s.rn+':'+s.rs;if(!seen.has(k)){seen.add(k);log.push(k+(s.rs==='pre'?' lo='+s.lo+' votes='+s.votes:''))}if(s.rn>=3&&s.rs==='live')break;await sleep(250)}
console.log('phases:',log.join(' | '));
// spawn LOS check in-game during vote/pre: any enemy visible from my eye?
await p.close();
// ---------- screenshots (human view, no autoplay) ----------
p=await mk();await p.goto(U+'?practice&map=0');await sleep(2500);
await p.screenshot({path:'v4-vote.png'});
const vis=await p.evaluate(()=>{const G=__api.G;const me=G.P[0];const e=[me.pos[0],me.pos[1]+1.65,me.pos[2]];return G.P.filter(q=>q.team!==me.team).map(q=>{const t=[q.pos[0],q.pos[1]+1.65,q.pos[2]];const d=[t[0]-e[0],t[1]-e[1],t[2]-e[2]],L=Math.hypot(...d);return __api.hitScan(e,d.map(v=>v/L),L+1,0).who===q.id})});
console.log('enemy visible from spawn at round start:',vis);
await p.evaluate(()=>{const G=__api.G;G.rt=0.01});await sleep(600);// end vote
await p.evaluate(()=>{const G=__api.G;G.P[0].yaw=G.P[0].pos[2]<0?Math.PI:0;G.P[0].pitch=0.05});await sleep(400);
await p.screenshot({path:'v4-spawn-cover.png'});
await p.evaluate(()=>{const G=__api.G;G.rt=0.01});await sleep(4000);
await p.evaluate(()=>{const G=__api.G;const me=G.P[0];me.pos=[-6,0,-3];me.yaw=Math.PI*0.85;G.P[2].pos=[-4,0,4];G.P[2].yaw=0.4});await sleep(700);
await p.screenshot({path:'v4-gameplay.png'});
// scope
await p.evaluate(()=>{const G=__api.G;const me=G.P[0];__api.equip(me,['pike','sparrow','pulse']);me.pos=[0,1.4,-12];me.yaw=Math.PI;window.__forceADS=1});await sleep(900);
await p.screenshot({path:'v4-scope.png'});
// recap: take damage from two bots then die
await p.evaluate(()=>{window.__forceADS=0;const G=__api.G;G.P[0].alive=true;G.P[0].hp=100;__api.damage(0,2,40,'kestrel',true,G.P[2].pos,'head');__api.damage(0,3,22,'kestrel',false,G.P[3].pos,'body');__api.damage(2,0,31,'kestrel',false,G.P[0].pos,'body');__api.damage(0,2,60,'kestrel',false,G.P[2].pos,'limb')});await sleep(700);
await p.screenshot({path:'v4-recap.png'});
const rec=await p.evaluate(()=>({show:!document.querySelector('#recap').classList.contains('hide'),txt:document.querySelector('#recap').innerText.replace(/\n/g,' | '),spec:document.querySelector('#spec').innerText.replace(/\n/g,' ')}));console.log('recap:',JSON.stringify(rec));
await p.evaluate(()=>__api.specCycle(1));await sleep(200);console.log('after cycle:',await p.$eval('#spec',e=>e.innerText.replace(/\n/g,' ')));
await p.evaluate(()=>{const G=__api.G;G.P[1].hp=0;G.P[1].alive=false});await sleep(300);console.log('team dead:',await p.$eval('#spec',e=>e.innerText.replace(/\n/g,' ')));
await p.close();
for(const [mi,f] of [[3,'v4-map4.png'],[4,'v4-map5.png']]){p=await mk();await p.goto(U+'?practice&map='+mi);await sleep(2000);await p.evaluate(()=>{__api.G.rt=0.01});await sleep(500);await p.evaluate(()=>{__api.G.rt=0.01});await sleep(600);
 await p.evaluate(()=>{const G=__api.G;const me=G.P[0];me.pos=[-13,0,-12];me.yaw=Math.PI*.82;me.pitch=-.12;G.P[2].pos=[-5,0,2]});await sleep(800);await p.screenshot({path:f});await p.close()}
console.log('errors',errs);await b.close()})();
