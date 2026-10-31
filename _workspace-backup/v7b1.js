require('./testguard');const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const br=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',protocolTimeout:120000,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required']});
const pg=await br.newPage();await pg.setViewport({width:1280,height:720});const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error'&&!/404|supabase|Failed to load/i.test(m.text()))errs.push(m.text())});
await pg.goto('http://localhost:8765/index.html?q=medium&practice&tod=day&map='+(process.argv[2]||0));await sleep(5000);
const R={};const ev=(f,a)=>pg.evaluate(f,a);
await ev(()=>{const G=__api.G;G.rs='live';G.rt=999;window.__frz=setInterval(()=>{if(__api.G){__api.G.rt=999;__api.G.rs=__api.G.rs==='live'?'live':__api.G.rs}},200);for(const p of G.P)if(p.team!==G.P[__api.ME].team){p.pos=[60,-60,60];p.hp=9999}document.querySelectorAll('.hint,#clickHint').forEach(e=>e.style.display='none')});
await ev(()=>{window.__ends=[];const _e=endRound;endRound=function(w,why){window.__ends.push({w,why,t:performance.now()|0,P:__api.G.P.map(p=>[p.team,p.alive,Math.round(p.hp),p.pos.map(v=>+v.toFixed(1))]),st:new Error().stack.split('\n').slice(1,5).join(' / ')});return _e.apply(this,arguments)}});
R.changes=await ev(()=>V7CHG);
// ---- MELEE first draw from every state
const kcount=()=>ev(()=>({vis:camera.children.filter(c=>c.userData&&c.userData.isVMKnife&&c.visible).length,all:camera.children.filter(c=>c.userData&&c.userData.isVMKnife).length,MELSEL}));
R.melee={};
const states={
 idle:()=>{},
 ads:()=>{window.__forceADS=1},
 reload:()=>{const me=__api.G.P[__api.ME];me.inv[me.cur].mag=1;me.reloadT=1.5},
 sprint:()=>{window.__forceSprint=1},
 slide:()=>{const me=__api.G.P[__api.ME];me.slideT=.6;me.crouch=true},
 swapMid:()=>{},
 respawn:()=>{const me=__api.G.P[__api.ME];me.alive=false;setTimeout(()=>{me.alive=true;me.hp=100;__api.G.ss++},150)},
 takeover:()=>{const G=__api.G;const me=G.P[__api.ME];const mate=G.P.find(p=>p.team===me.team&&p.id!==me.id);mate.alive=true;mate.hp=100;mate.pos=me.pos.slice();me.alive=false;try{requestTakeover(mate.id)}catch(e){window.__tkErr=String(e)}},
};
for(const k in states){
 await ev(()=>{vmId=null;window.__forceADS=0;window.__forceSprint=0;MELSEL=false;const me=__api.G.P[__api.ME];me.alive=true;me.hp=100;me.reloadT=0;me.meleeCd=0;me.meleeT=0;me.pos=[0,0,-2];__api.equip(me,[['kestrel','longreach','cinder','corvid'][Math.floor(Math.random()*4)],'sparrow','frag'])});await sleep(250);
 await ev(new Function('('+states[k].toString()+')()'));await sleep(k==='respawn'||k==='takeover'?400:150);
 await ev(()=>{window.__forceMelee=1});await sleep(40);
 if(k==='swapMid')await ev(()=>{swReq=1});
 await ev(()=>{window.__forceMelee=0});await sleep(120);const mid=await kcount();await sleep(900);
 R.melee[k]={duringSwing:mid.vis,after:(await kcount()),tkErr:await ev(()=>window.__tkErr||'')};
}
await ev(()=>{window.__forceADS=0;window.__forceSprint=0});
// ---- guns (host-authoritative damage math on an isolated test range)
R.guns=await ev(()=>{const G=__api.G,me=G.P[__api.ME];const en=G.P.find(p=>p.team!==me.team);const saved=G.boxes;const out={};
 const hits=[];const oh=handleEvent;window.handleEvent=handleEvent;
 const shoot=(wid,dist,box,part,ch)=>{G.boxes=box?[box]:[];me.pos=[0,0,0];me.alive=true;en.alive=true;en.hp=100;en.pos=[0,0,-dist];en.yaw=0;en.crouch=false;
  const o=eye(me);const ty=part==='head'?en.pos[1]+1.7:en.pos[1]+1.15;const d=norm([0,ty-o[1],-dist]);const ev0=EV.length;__api.hostAction(me.id,{t:'shot',o,dirs:[d],w:wid,ch:ch===undefined?1:ch});
  const h=EV.slice(ev0).find(e=>e.t==='hit');G.boxes=saved;return {dmg:100-en.hp,pen:h?h.pen:0,amt:h?h.amt:0,dead:en.hp<=0}};
 const thin={min:[-2,0,-5.15],max:[2,3,-4.85]},thick={min:[-2,0,-5.4],max:[2,3,-4.6]};
 out.kestrelOpen10=shoot('kestrel',10);out.kestrelThin=shoot('kestrel',10,thin);out.kestrelThick=shoot('kestrel',10,thick);out.longreachThick=shoot('longreach',10,thick);out.sparrowThin=shoot('sparrow',10,thin);
 out.falloffKestrel={at10:shoot('kestrel',10).dmg,at35:shoot('kestrel',35).dmg,at60:shoot('kestrel',60).dmg};
 out.stiltHead=shoot('stilt',30,null,'head');out.needleHead=shoot('needle',30,null,'head');out.osprey=shoot('osprey',30,null,'head');out.lancetHead=shoot('lancet',30,null,'head');
 out.corvidBodyFull=shoot('corvid',30,null,'body',1);out.corvidBodyHalf=shoot('corvid',30,null,'body',.5);out.corvidThroughThick=shoot('corvid',20,thick,'body',1);
 out.wasp15=shoot('wasp',15);out.pen=Object.fromEntries(Object.keys(W).map(k=>[k,penCm(W[k])]));
 out.shotgunSp=Object.fromEntries(['brute','typhoon','rook','mauler','flint'].map(k=>[k,V7CHG[k+'.sp']]));
 out.roundedAll=EV.filter(e=>e.t==='hit').every(e=>Number.isInteger(e.amt));
 en.pos=[60,-60,60];en.hp=9999;return out});
// ---- Cinder spin-up: shots in each 0.25s window while holding fire
R.cinder=await ev(()=>{const G=__api.G,me=G.P[__api.ME];__api.equip(me,['cinder','sparrow','frag']);me.cur=0;me.pos=[0,0,0];const saved=G.boxes;const lst=[];let m0=me.inv[0].mag,shots=[];me.spin=0;
 const _fs=fireShot;let n=0;window.fireShot=function(){n++};
 for(let i=0;i<120;i++){weaponTick(me,{fire:true},1/60,true);if(i%15===14){shots.push(m0-me.inv[0].mag);m0=me.inv[0].mag}if(i===30)lst.push(+me.spin.toFixed(2))}
 const spinFull=+me.spin.toFixed(2);for(let i=0;i<30;i++)weaponTick(me,{fire:false},1/60,true);const after=+me.spin.toFixed(2);me.inv[0].mag=100;return {shotsPerQuarterSec:shots,spinAt0_5s:lst[0],spinFull,spinAfter0_5sRelease:after}});
await ev(()=>{const me=__api.G.P[__api.ME];me.pos=[0,0,-2];__api.equip(me,['cinder','sparrow','frag']);window.__forceFire=1});await sleep(500);await pg.screenshot({path:'progress/v7-cinder-spin.png'});R.cinderHud=await ev(()=>{window.__forceFire=0;return document.querySelector('.spinb')?document.querySelector('.spinb i').style.width:'none'});
// ---- wallbang screenshot: real hit event with pen shown in float + HUD PEN
await ev(()=>{const G=__api.G,me=G.P[__api.ME];__api.equip(me,['longreach','sparrow','frag']);me.cur=0;const en=G.P.find(p=>p.team!==me.team);en.hp=500;en.alive=true;
 const box={min:[me.pos[0]-2,0,me.pos[2]-5.4],max:[me.pos[0]+2,3,me.pos[2]-4.6]};const saved=G.boxes;G.boxes=[box];en.pos=[me.pos[0],0,me.pos[2]-9];me.yaw=0;me.pitch=-.05;const o=eye(me);const d=norm([0,en.pos[1]+1.15-o[1],-9]);
 for(let i=0;i<3;i++)__api.hostAction(me.id,{t:'shot',o,dirs:[d],w:'longreach'});G.boxes=saved});await sleep(250);await pg.screenshot({path:'progress/v7-wallbang.png'});
R.floatHtml=await ev(()=>document.querySelector('#floats').innerHTML.slice(0,300));R.wName=await ev(()=>document.querySelector('#wName').innerText);
// ---- movement
R.move=await ev(()=>{const G=__api.G,me=G.P[__api.ME];const saved=G.boxes;G.boxes=[];const o={};const run=(inp,n)=>{for(let i=0;i<n;i++)movePlayer(me,inp,1/60)};
 const reset=()=>{me.pos=[0,0,0];me.vel=[0,0,0];me.yaw=0;me.ground=true;me.stam=100;me.slideT=0;me.slideCd=0;me.crouch=false;me.mant=null;me.grap=null;me.landT=0;me.bhops=0};
 reset();run({f:0,r:1,sprint:true},30);o.sideSprint={sprinting:me.sprinting,speed:+Math.hypot(me.vel[0],me.vel[2]).toFixed(2)};
 reset();run({f:-1,r:0,sprint:true},30);o.backSprint={sprinting:me.sprinting,speed:+Math.hypot(me.vel[0],me.vel[2]).toFixed(2)};
 reset();run({f:0,r:1,sprint:true},30);run({f:0,r:1,sprint:true,crouch:true},2);o.sideSlide={slideT:+me.slideT.toFixed(2),vx:+me.vel[0].toFixed(2),vz:+me.vel[2].toFixed(2)};
 reset();run({f:-1,r:-1,sprint:true},30);run({f:-1,r:-1,sprint:true,crouch:true},2);o.backDiagSlide={slideT:+me.slideT.toFixed(2),vx:+me.vel[0].toFixed(2),vz:+me.vel[2].toFixed(2)};
 reset();run({f:1,r:0,sprint:true},30);const v0=Math.hypot(me.vel[0],me.vel[2]);let mx=v0;for(let i=0;i<240;i++){movePlayer(me,{f:1,r:0,sprint:true,jump:true},1/60);mx=Math.max(mx,Math.hypot(me.vel[0],me.vel[2]))}o.bhop={startSpeed:+v0.toFixed(2),maxSpeed:+mx.toFixed(2),chain:me.bhops};
 reset();G.boxes=[{min:[-2,0,-8],max:[2,2.0,-6]}];me.grap={pt:[0,1.9,-6],t:1.5};let mant=false;for(let i=0;i<120;i++){movePlayer(me,{f:0,r:0},1/60);if(me.mant)mant=true}o.grappleMantle={mantled:mant,finalY:+me.pos[1].toFixed(2),onTop:me.pos[2]<-6&&me.pos[2]>-8};
 reset();G.boxes=[];G.pads=[{id:1,team:0,pos:[0,0,0],t:5}];run({f:0,r:0},2);o.padVy=+me.vel[1].toFixed(2);let my=0;for(let i=0;i<120;i++){movePlayer(me,{f:0,r:0},1/60);my=Math.max(my,me.pos[1])}o.padApex=+my.toFixed(2);G.pads=[];
 G.boxes=saved;reset();me.pos=[0,0,-2];return o});
// ---- throwing knife leaves on the crosshair ray
R.knifePre=await ev(()=>{const G=__api.G,me=G.P[__api.ME];return [G.rs,me.alive,me.util,G.sc,G.sd]});console.log("KPRE",JSON.stringify(R.knifePre),JSON.stringify(await ev(()=>window.__ends)));
R.knife=await ev(()=>{const G=__api.G,me=G.P[__api.ME];G.rs="live";G.rt=60;me.alive=true;me.hp=100;me.util='knife';me.utilN=2;me.yaw=.3;me.pitch=.1;const n0=G.nades.length;throwUtil(me,3);const n=G.nades[G.nades.length-1];const o=eye(me),d=dirYP(me.yaw,me.pitch);const rel=[n.pos[0]-o[0],n.pos[1]-o[1],n.pos[2]-o[2]];const L=Math.hypot(...rel);
 const ang=Math.acos((rel[0]*d[0]+rel[1]*d[1]+rel[2]*d[2])/L)*180/Math.PI;const vd=norm(n.vel);const vang=Math.acos(vd[0]*d[0]+vd[1]*d[1]+vd[2]*d[2])*180/Math.PI;return {spawnOffAxisDeg:+ang.toFixed(3),velOffAxisDeg:+vang.toFixed(3),speed:+Math.hypot(...n.vel).toFixed(1)}});
// ---- footsteps volume
R.steps=await ev(()=>{const rec=[];const o=SND.out;SND.out=function(p,v){rec.push(p?+v.toFixed(3):'own:'+v);return null};const L=camera.position;
 const at=(d,loud)=>{rec.length=0;SND.step([L.x+d,0,L.z],loud);return rec.length?rec[0]:'silent'};const r={own_run:(SND.step(null,1),rec[0]),walk_5m:at(5,.5),walk_12m:at(12,.5),walk_20m:at(20,.5),run_10m:at(10,1),run_20m:at(20,1),run_30m:at(30,1),crouch_4m:at(4,.15),crouch_8m:at(8,.15)};SND.out=o;return r});
// ---- cloak
R.cloakOpacity=await ev(()=>CLOAK_OPACITY);
// ---- bots fire the Corvid Arc
R.botCorvid=await ev(()=>new Promise(res=>{const G=__api.G,me=G.P[__api.ME];me.alive=false;let shots=0;const ha=__api.hostAction;const bots=G.P.filter(p=>p.bot&&!p.off);
 for(const b of G.P){b.alive=true;b.hp=9999;}const t0=G.P.find(p=>p.team===0&&p.bot),t1=G.P.find(p=>p.team===1&&p.bot);
 let total=0;const iv=setInterval(()=>{G.rs='live';G.rt=99;for(const b of bots){if(b.inv[0].w!=='corvid'){b.inv[0]={w:'corvid',mag:8,res:24};b.cur=0}if(b.inv[0].mag<8)total+=8-b.inv[0].mag;b.inv[0].mag=8;b.hp=9999;b.alive=true}},50);
 
 setTimeout(()=>{clearInterval(iv);res({botCorvidShots:total})},12000)}));
console.log(JSON.stringify(R,null,1));console.log('ERRS',errs.slice(0,8));await br.close()})();
