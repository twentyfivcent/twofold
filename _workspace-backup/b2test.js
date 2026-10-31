require('./testguard');const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const br=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-angle=swiftshader']});const pg=await br.newPage();await pg.setViewport({width:1280,height:720});const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await pg.goto('http://localhost:8765/index.html?q=high&practice&map='+(process.argv[2]||0));await sleep(4500);
const R={};const ev=(f,a)=>pg.evaluate(f,a);
await ev(()=>{const G=__api.G;G.rs='live';G.rt=999;for(const p of G.P)if(p.team!==G.P[__api.ME].team){p.pos=[60,-60,60];p.hp=9999}document.querySelectorAll('.hint,#clickHint').forEach(e=>e.style.display='none')});
// slide
await ev(()=>{const me=__api.G.P[__api.ME];const l=MAPS[__api.G.mapIdx].lpw[1];me.pos=[l[1][0],0,l[1][1]-4];me.yaw=Math.PI;window.__forceSprint=1});await sleep(900);
await ev(()=>{window.__sl=0;const o=onSlide;window.onSlide=function(p){if(p.id===__api.ME)window.__sl++;return o(p)};window.__forceSlide=1});await sleep(350);R.slide=await ev(()=>{const me=__api.G.P[__api.ME];return {slides:window.__sl,slideT:me.slideT,stam:me.stam,v:Math.hypot(me.vel[0],me.vel[2])}});await pg.screenshot({path:'v6-slide.png'});
await ev(()=>{window.__forceSlide=0;window.__forceSprint=0});await sleep(1200);
// HUD with stamina (sprint for a while)
await ev(()=>{window.__forceSprint=1;window.__forceTac=1;const me=__api.G.P[__api.ME];const l=MAPS[__api.G.mapIdx].lpw[0];me.pos=[l[1][0],0,l[1][1]-4];me.yaw=Math.PI});await sleep(700);R.tac=await ev(()=>{const me=__api.G.P[__api.ME];return {stam:me.stam,tac:me.tac}});await pg.screenshot({path:'v6-hud-stamina.png'});await ev(()=>{window.__forceSprint=0;window.__forceTac=0});
// mantle: find a mantle-able box
R.mantle=await ev(()=>{const G=__api.G,me=G.P[__api.ME];const bs=G.boxes.filter(b=>!b.wall&&!b.liquid&&!b.dyn&&b.min[1]<.05&&b.max[1]>.7&&b.max[1]<1.5&&(b.max[0]-b.min[0])>.8&&(b.max[2]-b.min[2])>.8);
 for(const b of bs){const cz=(b.min[2]+b.max[2])/2;me.pos=[(b.min[0]+b.max[0])/2,0,b.min[2]-.5];me.vel=[0,0,0];me.yaw=Math.PI;me.ground=true;let clear=true;for(const c of G.boxes)if(overlapX(me,c))clear=false;if(!clear)continue;
  if(mantleProbe(me)){window.__mb=b;return {box:[b.min,b.max],ok:1}}}return {ok:0,n:bs.length};function overlapX(p,c){return overlap(p,c,1.8)}});
if(R.mantle.ok){await ev(()=>{K[kc('jump')]=true});await sleep(120);await pg.screenshot({path:'v6-mantle.png'});await ev(()=>{K[kc('jump')]=false});await sleep(800);R.mantle.after=await ev(()=>{const me=__api.G.P[__api.ME];return {y:me.pos[1],top:window.__mb.max[1],mant:!!me.mant}})}
// inspect
await ev(()=>{const me=__api.G.P[__api.ME];me.pos=[0,0,-20];me.yaw=Math.PI;v6Press(kc('inspect'))});await sleep(900);R.insp=await ev(()=>__api.G.P[__api.ME].inspT);await pg.screenshot({path:'v6-inspect.png'});
await ev(()=>{window.__forceFire=1});await sleep(100);R.inspCancel=await ev(()=>__api.G.P[__api.ME].inspT);await ev(()=>{window.__forceFire=0});
// melee stuck test: wheel to melee, die, respawn -> knife must be gone
await ev(()=>{MELSEL=true;window.__forceMelee=1});await sleep(200);await ev(()=>{window.__forceMelee=0;const me=__api.G.P[__api.ME];me.alive=false;me.hp=0});await sleep(300);await ev(()=>{const me=__api.G.P[__api.ME];me.alive=true;me.hp=100;__api.G.ss++});await sleep(300);
R.melee=await ev(()=>({MELSEL,knife:vm.userData.knife.visible,mel:VK.mel}));
// takeover
R.take=await ev(()=>{const G=__api.G,me=G.P[__api.ME];const mate=G.P.find(p=>p.team===me.team&&p.id!==me.id);mate.alive=true;mate.hp=100;mate.bot=true;me.alive=false;me.hp=0;const before=__api.ME;window.__rs=G.rs;requestTakeover(mate.id);return {before,after:ME,mate:mate.id,matebot:mate.bot,oldbot:G.P[before].bot,rs:window.__rs,took:G.took}});
await sleep(500);R.take2=await ev(()=>{const r=hostTakeover(ME,ME);return r});R.decoy=await ev(()=>__assertNoDecoyPlayers());
console.log(JSON.stringify(R));console.log('ERRS',errs.slice(0,6));await br.close()})()
