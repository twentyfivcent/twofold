require('./testguard');const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',protocolTimeout:30000,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-renderer-backgrounding','--disable-background-timer-throttling','--disable-backgrounding-occluded-windows']});
const U='http://localhost:8765/index.html?fakenet';const errs=[];const P=[];
for(let i=0;i<4;i++){const p=await b.newPage();await p.setViewport({width:900,height:500});p.on('pageerror',e=>errs.push(i+': '+e));await p.goto(U);await p.evaluate(n=>{const e=document.querySelector('#nameIn');e.value=n;e.dispatchEvent(new Event('input'))},['Host','Cli1','Cli2','Cli3'][i]);P.push(p)}
const [H,...C]=P;
await H.evaluate(()=>__api.hostOnline());await sleep(300);const code=await H.evaluate(()=>__api.LOBBY.code);
for(let i=0;i<3;i++){await C[i].evaluate(c=>__api.joinOnline(c),code);await sleep(600)}
await H.evaluate(()=>__api.hostStartMatch());await sleep(1500);
const slots=await H.evaluate(()=>__api.G.P.map(p=>[p.name,p.team,p.bot?1:0]));console.log('slots',JSON.stringify(slots));
console.log('vote phase on clients:',await Promise.all(C.map(c=>c.evaluate(()=>__api.G.rs+' opts='+(__api.G.opts||[]).map(o=>o[0]).join(',')))));
// votes: host 1, cli1 1, cli2 2 (index 0-based: 0,0,1), cli3 via keyboard '3'
await H.evaluate(()=>__api.castVote(0));await C[0].evaluate(()=>__api.castVote(0));await C[1].evaluate(()=>__api.castVote(1));await C[2].bringToFront();await C[2].keyboard.press('Digit3');await sleep(500);
console.log('host votes',await H.evaluate(()=>__api.G.votes.join(',')),'| cli1 sees',await C[0].evaluate(()=>__api.G.votes.join(',')),'| cli1 card counts',await (await C[0].bringToFront(),await sleep(300),C[0]).evaluate(()=>[0,1,2].map(i=>document.querySelector('#vc'+i).innerText).join(' / ')));
await H.evaluate(()=>{__api.G.rt=0.01});await sleep(800);
console.log('winner lo',await H.evaluate(()=>__api.G.lo.join('/')),'expected opt0',await H.evaluate(()=>JSON.stringify(__api.G.opts[0])),'| clients lo',await Promise.all(C.map(c=>c.evaluate(()=>__api.G.lo.join('/')))));
await sleep(3500);console.log('rs',await H.evaluate(()=>__api.G.rs));
// headshot vs body: shooter = Cli1 slot, victim = enemy human slot
const S=await C[0].evaluate(()=>__api.ME);const st=await H.evaluate(s=>__api.G.P.map(p=>[p.team,p.bot?1:0]),S);
const V=st.findIndex((x,i)=>x[0]!==st[S][0]&&!x[1]);const Vpage=[H,...C][await (async()=>{for(let i=0;i<4;i++)if(await [H,...C][i].evaluate(()=>__api.ME)===V)return i})()];
console.log('shooter slot',S,'victim slot',V);
const res=[];
for(const [part,dy,dx] of [['head',1.62,0],['body',1.15,0],['limb',0.45,0.16]]){
 await H.evaluate((S,V)=>{const G=__api.G;for(const p of G.P){p.hp=100;p.alive=true}G.P[S].pos=[0,0,-5];G.P[V].pos=[0,0,0];G.P[V].yaw=0;G.P[V].crouch=false;for(const p of G.P)if(p.bot)p.pos=[14,0,22];__api.equip(G.P[S],['kestrel','sparrow','smoke'])},S,V);
 await C[0].evaluate(()=>{const me=__api.G.P[__api.ME];if(me.inv[0].w!=='kestrel')__api.equip(me,['kestrel','sparrow','smoke'])});await sleep(900);
 for(const pg of [C[0],Vpage])await pg.evaluate((S,V)=>{const G=__api.G;if(__api.ME===S)G.P[S].pos=[0,0,-5];if(__api.ME===V)G.P[V].pos=[0,0,0]},S,V);
 await sleep(250);
 const w=await C[0].evaluate((dy,dx)=>{window.__nospread=1;const G=__api.G,me=G.P[__api.ME];const e=[0,me.pos[1]+(me.crouch?1.1:1.62),-5];const t=[dx,dy,0];const d=[t[0]-e[0],t[1]-e[1],t[2]-e[2]];me.yaw=Math.atan2(-d[0],-d[2]);me.pitch=Math.atan2(d[1],Math.hypot(d[0],d[2]));me.rcAcc=0;const w=me.inv[me.cur];w.mag=Math.max(w.mag,1);return w.w},dy,dx);
 await C[0].bringToFront();await sleep(300);const hp0=await H.evaluate(V=>__api.G.P[V].hp,V);
 await C[0].evaluate(()=>{window.__forceFire=1});await sleep(70);await C[0].evaluate(()=>{window.__forceFire=0});await sleep(500);
 const hp1=await H.evaluate(V=>__api.G.P[V].hp,V);console.log('dbg',part,await C[0].evaluate(()=>{const me=__api.G.P[__api.ME];return JSON.stringify({pos:me.pos,yaw:me.yaw,pitch:me.pitch,mag:me.inv[0].mag,w:me.inv[0].w,rs:__api.G.rs})}),await H.evaluate((S,V)=>JSON.stringify([__api.G.P[S].pos,__api.G.P[V].pos,__api.G.P[V].alive,__api.G.P[S].inv[0].w]),S,V));const dm=await H.evaluate(w=>__api.W[w].dm,w);res.push(`${part}: ${w} took ${hp0-hp1} (table ${dm.join('/')})`)}
console.log(res.join(' | '));
// spectating on a client: kill Cli1, check label names teammate
await H.evaluate(S=>{__api.damage(S,0===S?1:0,200,'kestrel',false,[0,0,0],'body')},S);await sleep(600);
await C[0].bringToFront();await sleep(300);console.log('cli1 spec label:',await C[0].$eval('#spec',e=>e.innerText.replace(/\n/g,' ')),'| recap shown:',await C[0].evaluate(()=>!document.querySelector('#recap').classList.contains('hide')));
await C[0].evaluate(()=>__api.specCycle(1));await sleep(200);console.log('after cycle:',await C[0].$eval('#spec',e=>e.innerText.split('\n')[0]));
await C[0].screenshot({path:'mp-spec.png'});
console.log('errors',errs);await b.close()})().catch(e=>{console.log('FAIL',e.stack);process.exit(1)});
