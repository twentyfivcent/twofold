require('./testguard');const {launch,open,sleep}=require('./b3lib');const puppeteer=require('puppeteer-core');
let pass=0,fail=0;const ok=(n,c,x)=>{if(c){pass++;console.log('PASS',n)}else{fail++;console.log('FAIL',n,x!==undefined?JSON.stringify(x).slice(0,600):'')}};
const ONLY=process.env.ONLY||'AEDKIJLMNCFGHB2';
(async()=>{const br=await launch();const errs=[];
const killEnemies=`(()=>{const me=G.P[ME];for(const q of G.P)if(q.team!==me.team&&q.alive)damage(q.id,me.id,999,'kestrel',false,q.pos,'body')})()`;
const nextLive=async(h,rn)=>{for(let i=0;i<120;i++){const s=await h.evaluate(()=>({rn:G&&G.rn,rs:G&&G.rs}));if(s.rn>rn&&s.rs==='live')return s;if(s.rs==='live'&&i%4===0)await h.evaluate(killEnemies);await sleep(500)}return null};
// ---------- E: label
if(ONLY.includes('E')){const h=await open(br,errs,'?fakenet&q=low');await sleep(1500);
 const r=await h.evaluate(()=>({t:[...document.querySelectorAll('.appVer,.ptitle')].map(e=>e.textContent).join('|'),bad:/\bDROP\b|\bv\d+d\d+/.test(document.body.innerText)}));
 ok('E version label shows v8.1, no DROP/test labels',/v8\.1/.test(r.t)&&!r.bad,r);
 const fs=require('fs');const html=fs.readFileSync(__dirname+'/'+(process.env.TF_PAGE||'index.html'),'utf8');ok('E built html carries v8.1 appVer',/class="appVer">v8\.1</.test(html));await h.close()}
// ---------- A: menu pan worst frame (Med)
if(ONLY.includes('A')){const h=await open(br,errs,'?fakenet&gfx=med');await sleep(3000);
 const r=await h.evaluate(async()=>{MPAN.dur=9;MPAN.t0=performance.now()/1000-(MPAN.t0>1e6?0:0);const W=ms=>new Promise(r=>setTimeout(r,ms));const fr=[];let last=performance.now(),run=true,sw=[];let pi=MPAN.i;
  const f=()=>{const n=performance.now();fr.push(n-last);last=n;if(MPAN.i!==pi){pi=MPAN.i;sw.push(fr.length-1)}if(run)requestAnimationFrame(f)};requestAnimationFrame(f);
  const T0=performance.now();while(sw.length<3&&performance.now()-T0<90000)await W(500);run=false;const per=sw.slice(1).map(k=>Math.max(...fr.slice(Math.max(1,k-3),k+15)));
  const s=fr.slice(1).sort((a,b)=>a-b);return {per:per.map(Math.round),med:Math.round(s[s.length>>1]),warm:window.__mwarm&&window.__mwarm.done,compile:window.__compileMs}});
 const worst=Math.max(...r.per);ok('A menu map switch worst frame (Med) <= 1300ms (v8: 2171ms)',r.per.length>=2&&worst<=1300,r);ok('A next map textures prewarmed + shaders compiled',!!r.compile||r.compile===0,r);await h.close()}
// ---------- D: Esc / keyboard lock / open-menu bind
if(ONLY.includes('D')){const h=await open(br,errs,'?fakenet&q=low');await sleep(1500);
 await h.evaluate(()=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};practice(0)});await sleep(4000);
 const r=await h.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const L={locks:[],unl:0,exitFS:0,exitPL:0,reqPL:0};
  Object.defineProperty(navigator,'keyboard',{configurable:true,value:{lock:k=>{L.locks.push(k);return Promise.resolve()},unlock:()=>{L.unl++}}});KL.sup=true;
  document.exitFullscreen=()=>{L.exitFS++;return Promise.resolve()};let PLE=renderer.domElement;Object.defineProperty(document,'pointerLockElement',{configurable:true,get:()=>PLE});document.exitPointerLock=()=>{L.exitPL++;PLE=null;document.dispatchEvent(new Event('pointerlockchange'))};
  renderer.domElement.requestPointerLock=()=>{L.reqPL++;PLE=renderer.domElement;document.dispatchEvent(new Event('pointerlockchange'));return Promise.resolve()};
  let fs=document.body;fsEl=()=>fs;document.dispatchEvent(new Event('fullscreenchange'));await W(50);
  const out={bind:KBM.menu,clash:KB_ACTIONS.filter(a=>KBM[a[0]]===KBM.menu).length,locked1:L.locks.length,act:KL.active};
  PLE=renderer.domElement;document.dispatchEvent(new Event('pointerlockchange'));
  const esc=()=>document.dispatchEvent(new KeyboardEvent('keydown',{code:'Escape',key:'Escape',bubbles:true}));
  esc();await W(50);out.lkA=locked;out.mtA=window.__menuT;out.open=!$('#pause').classList.contains('hide');out.exitPL=L.exitPL;
  esc();await W(50);out.reqPL=L.reqPL;out.exitFS=L.exitFS;out.mt=window.__menuT;out.closed=$('#pause').classList.contains('hide');out.lk=locked;out.pz=$("#pause").className;
  fs=null;document.dispatchEvent(new Event('fullscreenchange'));fs=document.body;document.dispatchEvent(new Event('fullscreenchange'));await W(50);out.relocks=L.locks.length;out.unl=L.unl;
  // no Keyboard Lock API: Esc left to the browser, P still toggles
  KL.sup=false;KL.active=false;fs=null;PLE=renderer.domElement;document.dispatchEvent(new Event('pointerlockchange'));const e0=L.exitPL;esc();await W(30);out.escNoApi=L.exitPL-e0;
  document.dispatchEvent(new KeyboardEvent('keydown',{code:KBM.menu,key:'p',bubbles:true}));await W(30);out.pOpen=!$('#pause').classList.contains('hide');out.pExit=L.exitPL-e0;
  return out});
 ok('D keyboard.lock([Escape]) on fullscreen enter',r.locked1===1&&r.act,r);ok('D Esc opens menu without leaving fullscreen',r.open&&r.exitPL===1&&r.exitFS===0,r);
 ok('D Esc again closes menu + re-acquires pointer lock',r.reqPL===1&&r.closed&&r.lk,r);ok('D re-lock on fullscreen re-entry',r.relocks===2&&r.unl>=1,r);
 ok('D open-menu bind default KeyP, no clash',r.bind==='KeyP'&&r.clash===1,r);ok('D without API: Esc untouched, P opens menu',r.escNoApi===0&&r.pOpen&&r.pExit===1,r);await h.close()}
// ---------- G: mantle every Velvet Ace prop from 4 sides
if(ONLY.includes('G')){const h=await open(br,errs,'?fakenet&q=low');await sleep(1500);
 await h.evaluate(()=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};practice(MAPS.findIndex(m=>m.n==='Velvet Ace'))});await sleep(5000);
 const r0=await h.evaluate(async()=>{const p=G.P[ME];for(const q of G.P)if(q!==p){q.pos=[999,-50,999]}
  p.hp=1e9;const res={tried:0,started:0,refused:0,bad:[]};
  const floorAt=(x,z,yMax)=>{let f=0;for(const c of G.boxes)if(!c.liquid&&x>c.min[0]&&x<c.max[0]&&z>c.min[2]&&z<c.max[2]&&c.max[1]<=yMax+.01)f=Math.max(f,c.max[1]);return f};
  const emb=(q)=>G.boxes.some(c=>!c.liquid&&overlap({pos:q},c,1.7));
  const props=G.boxes.filter(b=>!b.liquid&&!b.dyn&&!(b.wall&&b.max[1]>=4)).filter(b=>{const sx=b.max[0]-b.min[0],sz=b.max[2]-b.min[2];if(sx>12||sz>12)return false;const fl=floorAt((b.min[0]+b.max[0])/2,b.min[2]-.8,b.min[1]+.05);const ht=b.max[1]-fl;return ht>=.45&&ht<=1.6&&Math.abs(b.min[1]-fl)<.3});
  res.props=props.length;
  window.__G={res,props,floorAt,emb,p};return {n:props.length}});
 const np=r0.n;for(let i=0;i<np;i++)await h.evaluate(async i=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const {res,props,floorAt,emb,p}=window.__G;const b=props[i];
  {const cx=(b.min[0]+b.max[0])/2,cz=(b.min[2]+b.max[2])/2;
   for(const [dx,dz,sx,sz] of [[0,-1,cx,b.min[2]-.6],[0,1,cx,b.max[2]+.6],[-1,0,b.min[0]-.6,cz],[1,0,b.max[0]+.6,cz]]){
    const fl=floorAt(sx,sz,b.min[1]+.05);if(!isFinite(fl)||fl<-1e8)continue;const st=[sx,fl+.001,sz];if(emb(st))continue;res.tried++;for(let att=0;att<2;att++){
    p.pos=st.slice();p.vel=[0,0,0];p.ground=true;p.mant=null;p.alive=true;p.yaw=Math.atan2(-(-dx),-dz);
    const ok=tryMantle(p,{f:1},[-dx,0,-dz]);if(!ok){res.refused++;break}res.started++;const exp=[p.mant.x1,p.mant.y1,p.mant.z1];const rv=window.__mantRevert||0;
    let prev=p.pos.slice(),jump=0;const t0=performance.now();while(performance.now()-t0<1500){await W(16);const d=Math.hypot(p.pos[0]-prev[0],p.pos[1]-prev[1],p.pos[2]-prev[2]);jump=Math.max(jump,d);prev=p.pos.slice();if(!p.mant)break}
    await W(150);const fin=p.pos.slice();const dist=Math.hypot(fin[0]-exp[0],fin[2]-exp[2]),dy=Math.abs(fin[1]-exp[1]);
    const vd=Math.hypot(exp[0]-st[0],exp[1]-st[1],exp[2]-st[2]);const why=[p.mant&&'active',jump>vd+.3&&'jump',dist>.35&&'dist',dy>.12&&'dy',emb(fin)&&'emb',(window.__mantRevert||0)>rv&&'revert',!p.alive&&'dead'].filter(Boolean);if(!why.length)break;if(att===0){res.retried=(res.retried||0)+1;continue}res.bad.push({why,b:[b.min,b.max].map(v=>v.map(x=>+x.toFixed(2))),side:[dx,dz],exp,fin,jump:+jump.toFixed(2),dist:+dist.toFixed(2)})}}}
},i);
 const r=await h.evaluate(()=>__G.res);
 ok('G casino props found + mantles tried',r.props>=4&&r.tried>=16,{props:r.props,tried:r.tried});ok('G mantles performed',r.started>=4,r);
 ok('G every mantle ends on top: no stuck, no teleport, within 0.35m of expected top',r.bad.length===0,r);await h.close()}

// ---------- K: throw range per throwable (launch speed from the real throwUtil, flat-ground carry with the host's 18 m/s^2 gravity)
if(ONLY.includes('K')){const h=await open(br,errs,'?fakenet&q=low');await sleep(1500);await h.evaluate(()=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};practice(0)});await sleep(4000);
 const r=await h.evaluate(()=>{const p=G.P[ME];const out={};const types=Object.keys(UT).filter(k=>!UT[k].inst&&!UT[k].throwNow&&!UT[k].knifeCook&&k!=='knife');
  const carry=v=>{let x=0,y=1.6+.45*Math.sin(.2),vx=v[0],vy=v[1];const dt=1/240;for(let i=0;i<4000;i++){vy-=18*dt;x+=vx*dt;y+=vy*dt;if(y<.08)break}return x};
  for(const ty of types)for(const cook of [0,1]){let best=0,v0=0;for(let pt=0;pt<=1;pt+=.05){p.pos=[0,0,0];p.vel=[0,0,0];p.yaw=0;p.pitch=pt;p.crouch=false;p.util=ty;let cap=null;const _s=sendOrDo;sendOrDo=m=>{cap=m};throwUtil(p,cook?.4:3);sendOrDo=_s;if(!cap)continue;const hv=Math.hypot(cap.vel[0],cap.vel[2]);v0=Math.hypot(...cap.vel);best=Math.max(best,carry([hv,cap.vel[1]]))}
   out[ty+(cook?'_cooked':'')]={carry:+best.toFixed(1),v0:+v0.toFixed(1)}}return out});
 const ks=Object.keys(r).filter(k=>!k.endsWith('_cooked'));ok('K every throwable full throw carries 25-30m on flat ground',ks.length>=4&&ks.every(k=>r[k].carry>=25&&r[k].carry<=30),r);
 ok('K cooking never reduces throw speed',ks.every(k=>Math.abs(r[k].v0-r[k+'_cooked'].v0)<.01),r);console.log('K ranges',JSON.stringify(r));await h.close()}
// ---------- I: water impacts
if(ONLY.includes('I')){const h=await open(br,errs,'?fakenet&q=low');await sleep(1500);await h.evaluate(()=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};practice(11)});await sleep(5000);
 const r=await h.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const R=G.mapDef.wadeR||[];const lb=G.boxes.find(b=>b.liquid);let pt=null;
  if(R.length){const w=R[0];pt=[(w.x0+w.x1)/2,0,(w.z0+w.z1)/2]}else if(lb)pt=[(lb.min[0]+lb.max[0])/2,lb.min[1]+.02,(lb.min[2]+lb.max[2])/2];if(!pt)return {none:1};
  const s=waterSurfAt(pt[0],pt[1],pt[2]);const n0=__wimp.n;const pc0=PN&&PN.alive!==undefined?PN.alive:null;addImpact(pt,[0,-.6,.8]);const a=__wimp.n-n0;const last=__wimp.last;
  // dry impact must stay a normal spark
  let dry=null;for(let x=-20;x<=20&&!dry;x+=2)for(let z=-20;z<=20;z+=2)if(waterSurfAt(x,0,z)==null){dry=[x,0,z];break}const n1=__wimp.n;addImpact(dry,[0,-1,0]);const b=__wimp.n-n1;
  // a grenade dropped into the water splashes once
  const n2=__wimp.n;G.nades.push({id:8e6,type:'smoke',pos:[pt[0],s+1.5,pt[2]],vel:[0,-3,0],fuse:2,owner:ME,yaw:0,pitch:0});const t0=performance.now();while(performance.now()-t0<4000&&__wimp.n===n2)await W(50);
  // the host's synced 'tr' event (what clients get) also produces the splash
  const n3=__wimp.n;handleEvent({t:'tr',s:3,o:[pt[0],s+3,pt[2]-2],e:[pt[0],pt[1],pt[2]],w:1});
  return {surf:s,water:a,last,dry:b,nade:__wimp.n-n2>=1,net:__wimp.n-n3}});
 ok('I bullet impact under water -> splash at the surface',r.water===1&&r.last&&Math.abs(r.last[1]-r.surf)<.01,r);ok('I dry ground impact unchanged',r.dry===0,r);ok('I thrown object entering water splashes',r.nade,r);ok('I synced tracer impact (tr event) splashes',r.net===1,r);await h.close()}
// ---------- J: match start worst frame
if(ONLY.includes('J')){const res={};{const w=await open(br,errs,'?fakenet&gfx=low');await sleep(2500);await w.evaluate(()=>practice(1));await sleep(4000);await w.close()}/* browser/GPU-process cold start is not the game's */for(const t of ['low','med','high']){const runs=[];for(let att=0;att<3;att++){/* median of 3: swiftshader frame noise is +-500ms; a real regression moves the median */const h=await open(br,errs,'?fakenet&gfx='+t);await sleep(2500);
  res[t]=await h.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));botThink=function(){return {f:.6,r:0,yaw:.02,pitch:0}};await W(300);const fr=[];let last=0,run=true;const f=()=>{const n=performance.now();if(last)fr.push(n-last);last=n;if(run)requestAnimationFrame(f)};
   practice(1);requestAnimationFrame(f);await W(5000);run=false;await W(1500);const st=[];last=0;run=true;requestAnimationFrame(f);const k=fr.length;await W(3000);run=false;const steady=fr.slice(k+1).sort((a,b)=>a-b);
   return {worst:Math.round(Math.max(...fr.slice(0,k))),steady:Math.round(steady[steady.length>>1]||0),warm:window.__warm,pod:G._podWarm}});runs.push(res[t]);await h.close()}runs.sort((a,b)=>a.worst-b.worst);res[t]=Object.assign({},runs[1],{runs:runs.map(r=>r.worst)})}
 console.log('J',JSON.stringify(res));for(const t in res)ok('J '+t+': first 5s worst frame <= 1300ms (v8.1-pre 1617/1782/1783); warm-up ran in load',res[t].worst<=1300&&res[t].warm&&res[t].pod===1,res[t])}
// ---------- L: emotes play their full duration
if(ONLY.includes('L')){for(const t of ['low','high']){const h=await open(br,errs,'?fakenet&gfx='+t);await sleep(1500);await h.evaluate(()=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};practice(0)});await sleep(5000);
  const r=await h.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const me=G.P[ME];WHL=performance.now()-4000;/* had scrolled the weapon wheel before */for(const k in K)K[k]=false;
   const id='emo_wave';const dur=EMOTE[id].dur*1000;window.__emoCancel=undefined;emoPlay(id);const t0=me.emo.t0;const at=async f=>{while(performance.now()-t0<dur*f)await W(20);/* a slow frame can overshoot past the end: then it counts if it expired naturally (no cancel) */return !!me.emo||(performance.now()-t0>=dur*.97&&!window.__emoCancel)};
   const a50=await at(.5),a90=await at(.9);const cam=window.__emoCam;await at(1.15);const ended=!me.emo;
   emoPlay(id);await W(300);K[kc('forward')]=true;await W(250);K[kc('forward')]=false;const mv=window.__emoCancel;emoPlay(id);await W(300);WHL=performance.now();await W(250);return {a50,a90,cam,ended,mv,wh:window.__emoCancel}});
  ok('L '+t+': emote active at 50% and 90% of its duration with no input',r.a50&&r.a90,r);ok('L '+t+': emote ends on its own; move key / wheel cancel',r.ended&&r.mv==='forward'&&r.wh==='wheel',r);await h.close()}}

// ---------- M (+ L remote): knife pickup credit host + client, all loadout combos, after round reset
if(ONLY.includes('M')){const h0=await open(br,errs,'?fakenet&q=low');await sleep(1500);await h0.evaluate(()=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};practice(0)});await sleep(4000);
 const u=await h0.evaluate(()=>{const p=G.P[ME];const bad=[];let n=0;for(const l of LETHALS)for(const t of [null,...TACTS]){n++;p.lth=l;p.lthN=UT[l].c;p.tcu=t;p.tacN=t?UT[t].c:0;p.xKn=0;p._ls=null;p.cook=-1;p.uAct='t';p.utilN=p.tacN;p.util=t;
   utilSlot(p,{lethal:false,tactical:false},.016);const before=l==='knife'?p.lthN:0;utilAdd(p,'knife',1);utilSlot(p,{lethal:true,tactical:false},.016);
   const ok=p.uAct==='l'&&p.util==='knife'&&p.utilN===before+1&&utilHas(p,'knife');if(!ok)bad.push({l,t,util:p.util,n:p.utilN,x:p.xKn});
   // throw it: lethal count drops to the own lethal again afterwards (non-knife lethal)
   if(l!=='knife'){p.lthN=0;p.utilN=0;utilSlot(p,{lethal:false,tactical:false},.016);if(p.lth!==l||p.lthN!==UT[l].c)bad.push({restore:l,lth:p.lth,n:p.lthN})}}
  // round reset clears extras
  p.xKn=2;equip(p,[p.inv[0].w,p.inv[1].w,'frag',TACTS[0]]);return {n,bad,x:p.xKn|0}});
 ok('M every lethal x tactical combo: pickup credited + throwable on G, own lethal restored after',u.bad.length===0&&u.n>=8,u);ok('M round reset clears extra knives',u.x===0,u);await h0.close();
 const b2=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',protocolTimeout:180000,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-renderer-backgrounding','--disable-background-timer-throttling','--disable-backgrounding-occluded-windows']});
 const U='http://localhost:8765/'+(process.env.TF_PAGE||'index.html')+'?fakenet&q=low';const P=[];for(let i=0;i<2;i++){const p=await b2.newPage();await p.setViewport({width:700,height:400});p.on('pageerror',e=>errs.push('M'+i+': '+e));await p.goto(U);P.push(p)}
 const [H,C]=P;await H.evaluate(()=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};__api.hostOnline();window.__kn={};const _ha=hostAction;hostAction=function(pid,m){if(m&&m.t==='nade'&&m.type==='knife')__kn[pid]=(__kn[pid]||0)+1;return _ha.apply(this,arguments)}});await sleep(500);
 const code=await H.evaluate(()=>__api.LOBBY.code);await C.evaluate(c=>__api.joinOnline(c),code);await sleep(1500);await H.evaluate(()=>__api.hostStartMatch());
 const live=async()=>{for(let i=0;i<120;i++){if(await H.evaluate(()=>G&&G.rs==='live'))return true;await sleep(500)}return false};
 const pick=async(pg,who)=>{const me=await pg.evaluate(()=>ME);await H.evaluate(m=>{const p=G.P[m];G.knives.push({id:7e6+Math.floor(Math.random()*1e5),pos:[p.pos[0],p.pos[1]+.05,p.pos[2]],yaw:0,pitch:0,stuck:false,t:1})},me);await sleep(2500);
  const st=await pg.evaluate(()=>{const me=G.P[ME];try{updateHUD(0)}catch(e){}return {lth:me.lth,ln:me.lthN,x:me.xKn|0,ls:!!me._ls,hud:($('#util')||{}).textContent||'',sync:window.__kpickSync||0}});
  const k0=await H.evaluate(m=>__kn[m]||0,me);await pg.evaluate(()=>{G.P[ME].pitch=-.1;K[kc('util')]=true});await sleep(900);await pg.evaluate(()=>{K[kc('util')]=false});await sleep(1500);const k1=await H.evaluate(m=>__kn[m]||0,me);return {who,me,st,thrown:k1>k0}};
 const res=[];if(await live()){
  for(const [pg,nm,l] of [[H,'host','frag'],[C,'client','frag'],[C,'client','knife'],[H,'host','sticky']]){await pg.evaluate(l=>{const me=G.P[ME];me.lth=l;me.lthN=UT[l].c;me.xKn=0;me._ls=null;me.uAct='l';me.utilN=me.lthN;me.util=l},l);
   if(pg===C)await H.evaluate(([m,l])=>{const me=G.P[m];me.lth=l;me.lthN=UT[l].c;me.xKn=0;me._ls=null;me.uAct='l';me.utilN=me.lthN;me.util=l},[await C.evaluate(()=>ME),l]);res.push(Object.assign({l},await pick(pg,nm)))}
  // after a round reset (client)
  const rn=await H.evaluate(()=>G.rn);await H.evaluate(killEnemies2=>{const me=G.P[ME];for(const q of G.P)if(q.team!==me.team&&q.alive)damage(q.id,me.id,999,'kestrel',false,q.pos,'body')});
  for(let i=0;i<120;i++){const s=await H.evaluate(()=>({rn:G.rn,rs:G.rs}));if(s.rn>rn&&s.rs==='live')break;await sleep(500)}res.push(Object.assign({l:'reset'},await pick(C,'client')))}
 for(const r of res)ok(`M ${r.who} lethal=${r.l}: pickup credited (HUD knife), synced, throw works right after`,r.st.lth==='knife'&&r.st.ln>=1&&/Knife/i.test(r.st.hud)&&r.thrown&&(r.who==='host'||r.st.sync>=1),r);
 ok('M ran 5 MP pickup cases',res.length===5,res.length);
 // L remote: client emote seen by host for the full duration
 const le=await C.evaluate(()=>{for(const k in K)K[k]=false;return emoPlay('emo_wave')?ME:-1});const dur=2400;const t0=Date.now();const seen=[];for(const f of [.5,.9]){while(Date.now()-t0<dur*f)await sleep(30);seen.push(await H.evaluate(m=>!!(G.P[m].emo),le))}
 const cdbg=await C.evaluate(()=>({why:window.__emoCancel,emo:!!G.P[ME].emo,hp:G.P[ME].hp}));ok('L remote players see the full emote (50% / 90%)',le>=0&&seen.every(Boolean),{seen,cdbg});await b2.close()}

// ---------- N: one Graphics control per settings panel + migration
if(ONLY.includes('N')){const h=await open(br,errs,'?fakenet');await sleep(1500);const base='http://localhost:8765/'+(process.env.TF_PAGE||'index.html')+'?fakenet';
 const ui=await h.evaluate(()=>{const panels=[...document.querySelectorAll('#tGfx')].concat([...document.querySelectorAll('.gfxSel')].map(e=>e.closest('.ptab,.panel,section,div[id]')));const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);const dupIds=ids.filter((x,i)=>ids.indexOf(x)!==i);
  const sels=[...document.querySelectorAll('.gfxSel')];const owners=sels.map(e=>{let p=e;while(p&&!(p.id&&/^(tGfx|settings|pause|pSet|menuSet)/i.test(p.id)))p=p.parentElement;return p?p.id:'?'});
  const labels=[...document.querySelectorAll('.prow span')].filter(e=>/graphic|quality/i.test(e.textContent)).map(e=>e.textContent);
  return {n:sels.length,owners,uniqOwners:new Set(owners).size,q:document.querySelectorAll('.qSel').length,labels,opts:sels[0]&&[...sels[0].options].map(o=>o.textContent),dupIds:[...new Set(dupIds)].slice(0,10)}});
 ok('N exactly one Graphics control per settings panel, old Quality gone',ui.q===0&&ui.n===ui.uniqOwners&&ui.n>=1&&ui.labels.every(l=>l==='Graphics'),ui);ok('N options Low/Med/High',JSON.stringify(ui.opts)==='["Low","Med","High"]',ui);
 const mig=async(st)=>{await h.evaluate(st=>{localStorage.setItem('twofold',JSON.stringify(st))},st);await h.goto(base);await sleep(1200);return h.evaluate(()=>({gfx:settings.gfx,q:settings.quality,sel:[...document.querySelectorAll('.gfxSel')].map(e=>e.value),saved:JSON.parse(localStorage.getItem('twofold')).gfx}))};
 const m1=await mig({quality:'low'}),m2=await mig({quality:'high'}),m3=await mig({quality:'high',gfx:'med'}),m4=await mig({}),m5=await mig({gfx:'high'});
 ok('N migration: old quality-only saves keep their choice',m1.gfx==='low'&&m1.q==='low'&&m2.gfx==='high'&&m2.q==='high'&&m1.saved==='low',{m1,m2});
 ok('N migration: gfx wins when both saved; default Med; tier drives quality',m3.gfx==='med'&&m3.q==='medium'&&m4.gfx==='med'&&m4.q==='medium'&&m5.q==='high'&&m5.sel.every(v=>v==='high'),{m3,m4,m5});
 const sw=await h.evaluate(()=>{setGfx('low');const a=[settings.gfx,settings.quality,__gfxInfo().tier];setGfx('high');return {a,b:[settings.gfx,settings.quality],sync:SYNC_KEYS.includes('gfx')&&SYNC_KEYS.includes('quality')}});
 ok('N switching sets both param sets + still account-synced',sw.a.join()==='low,low,low'&&sw.b.join()==='high,high'&&sw.sync,sw);
 await h.evaluate(()=>localStorage.removeItem('twofold'));await h.close()}

// ---------- C: knife hands (right hand on the handle right of centre, empty left hand left of centre, both in the frustum) for all 8 characters
if(ONLY.includes('C')){const h=await open(br,errs,'?fakenet&gfx=med');await sleep(1500);await h.evaluate(()=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};practice(0)});await sleep(6000);
 const chars=await h.evaluate(()=>CHARS.map(c=>c.id));const inF=v=>v&&Math.abs(v[0])<.98&&Math.abs(v[1])<.98&&v[2]<1;const rs=[];
 for(const c of chars){await h.evaluate(c=>{ACC.equipped=ACC.equipped||{};ACC.equipped._char=c;ACC.owned=ACC.owned||{};ACC.owned[c]=1;MELSEL=true},c);await sleep(2500);
  const idle=await h.evaluate(()=>{MELSEL=true;return null});let a;for(let k=0;k<6;k++){await sleep(800);a=await h.evaluate(()=>{MELSEL=true;return __knifeHands()});if(a&&a.knifeVis)break}/* between rounds (free cam) the knife is legitimately hidden */
  await h.evaluate(()=>{MELSEL=true;VK.swA=.125});await sleep(60);const b=await h.evaluate(()=>__knifeHands());rs.push({c,a,b,vc:await h.evaluate(()=>window.__vmInfo&&__vmInfo.cid)});
  const ok1=a&&a.knifeVis&&a.leftVis&&a.rightHand[0]>.1&&a.handle[0]>0&&a.gripDist<.16&&a.leftHand[0]<-.1&&inF(a.rightHand)&&inF(a.handle)&&inF(a.leftHand);
  ok(`C ${c}: knife in visible right hand on the handle (right of centre), empty left hand left of centre, in frustum`,ok1,{a});
  ok(`C ${c}: still sensible mid-swing`,b&&inF(b.rightHand)&&inF(b.leftHand)&&b.rightHand[0]>0&&b.leftHand[0]<0,{b})}
 ok('C covered all 8 characters',chars.length===8&&new Set(rs.map(r=>r.vc)).size===8,rs.map(r=>r.vc));await h.close()}

// ---------- A2: brightness — share of clipped (luma>=250) and washed (>=235) pixels per map and tier, tod=day, 4 view directions
if(ONLY.includes('2')){const lum=async h=>h.evaluate(()=>{renderFrame();const c=renderer.domElement,w=320,hh=180,cv=document.createElement('canvas');cv.width=w;cv.height=hh;const x=cv.getContext('2d');x.drawImage(c,0,0,w,hh);const d=x.getImageData(0,0,w,hh).data;let n=0,cl=0,hi=0,s=0;
  for(let i=0;i<d.length;i+=4){const l=.2126*d[i]+.7152*d[i+1]+.0722*d[i+2];n++;s+=l;if(l>=250)cl++;if(l>=235)hi++}return {clip:100*cl/n,hi:100*hi/n,mean:s/n}});
 const tiers=(process.env.A2T||'low,med,high').split(','),maps=process.env.A2M?process.env.A2M.split(',').map(Number):[11,4,12];/* A2M=all for the full 13-map sweep */if(process.env.A2M==='all')maps.splice(0,3,...Array(13).keys());const all=[];
 for(const t of tiers)for(const i of maps){const h=await open(br,errs,'?fakenet&tod=day&gfx='+t);await sleep(1200);await h.evaluate(i=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};practice(i)},i);await sleep(5000);
  await h.evaluate(()=>{const me=G.P[ME];me.yaw=Math.atan2(me.pos[0],me.pos[2]);me.pitch=-.05;for(const p of G.P)if(p!==me)p.pos=[999,-50,999]});const r={t,i,n:await h.evaluate(()=>G.mapDef.n),clip:0,hi:0,mean:0};
  for(let y=0;y<4;y++){if(y)await h.evaluate(()=>{G.P[ME].yaw+=Math.PI/2});await sleep(y?1500:3000);const v=await lum(h);r.clip+=v.clip/4;r.hi+=v.hi/4;r.mean+=v.mean/4}
  for(const k of ['clip','hi','mean'])r[k]=+r[k].toFixed(1);all.push(r);console.log('A2',JSON.stringify(r));await h.close()}
 ok('A2 no blown-out map: clipped (luma>=250) < 1% and washed (>=235) < 6% on every map/tier',all.every(r=>r.clip<1&&r.hi<6),all.filter(r=>!(r.clip<1&&r.hi<6)));
 ok('A2 no too-dark map: mean luma >= 30 on every map/tier',all.every(r=>r.mean>=30),all.filter(r=>r.mean<30));
 ok('A2 Med/High stay close to the Low look (mean within 30%)',maps.every(i=>{const lo=all.find(r=>r.t==='low'&&r.i===i);return !lo||all.filter(r=>r.i===i&&r.t!=='low').every(r=>Math.abs(r.mean-lo.mean)<=.3*lo.mean+8)}),all)}
// ---------- F + H: one ping per player, pings every round, host + client teammate (fakenet)
if(ONLY.includes('F')||ONLY.includes('H')){const b2=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',protocolTimeout:120000,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-renderer-backgrounding','--disable-background-timer-throttling','--disable-backgrounding-occluded-windows']});
 const U='http://localhost:8765/'+(process.env.TF_PAGE||'index.html')+'?fakenet&q=low';const P=[];for(let i=0;i<2;i++){const p=await b2.newPage();await p.setViewport({width:800,height:450});p.on('pageerror',e=>errs.push(i+': '+e));await p.goto(U);await p.evaluate(n=>{const e=document.querySelector('#nameIn');e.value=n;e.dispatchEvent(new Event('input'))},['H','C'][i]);P.push(p)}
 const [H,C]=P;await H.evaluate(()=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};__api.hostOnline()});await sleep(500);const code=await H.evaluate(()=>__api.LOBBY.code);await C.evaluate(c=>__api.joinOnline(c),code);await sleep(1200);
 await C.evaluate(()=>{const H0=LOBBY.slots.findIndex(x=>x&&x.host);if(slotTeam(LOBBY.me)!==slotTeam(H0<0?0:H0))$('#bSwitch').onclick()});await sleep(1500);
 await H.evaluate(()=>__api.hostStartMatch());let rn=-1;const rounds=[];
 for(let k=0;k<3;k++){const s=await nextLive(H,rn);if(!s)break;rn=s.rn;await sleep(800);
  const same=await H.evaluate(()=>{const h=G.P[ME];return G.P.find(q=>q.id!==ME&&!q.bot&&q.team===h.team)?1:0});
  const res={rn};for(const [nm,pg] of [['host',H],['cli',C]]){await pg.evaluate(()=>{PING.lastT=0;G.P[ME].pitch=-.3;pingPress()});await sleep(900);await pg.evaluate(()=>{PING.lastT=0;G.P[ME].yaw+=.5;pingPress()});await sleep(1200);
   const me=await pg.evaluate(()=>ME);res[nm]={me,self:await pg.evaluate(m=>PING.list.filter(p=>p.from===m).length,me),mate:await (pg===H?C:H).evaluate(m=>PING.list.filter(p=>p.from===m).length,me)}}
  res.same=same;rounds.push(res)}
 ok('H reached 3 rounds',rounds.length===3,rounds);const sameTeam=rounds[0]&&rounds[0].same;
 rounds.forEach((r,i)=>{ok(`H round ${i+1}: host + client pings show locally`,r.host.self>=1&&r.cli.self>=1,r);if(sameTeam)ok(`H round ${i+1}: teammate sees ping`,r.host.mate>=1&&r.cli.mate>=1,r)});
 ok('F at most one active ping per player (after 2 pings each round)',rounds.every(r=>r.host.self===1&&r.cli.self===1&&(!sameTeam||(r.host.mate===1&&r.cli.mate===1))),rounds);
 if(!sameTeam)console.log('note: host and client not on the same team in this lobby layout');await b2.close()}
// ---------- B: connectivity
if(ONLY.includes('B')){const b2=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',protocolTimeout:180000,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-renderer-backgrounding','--disable-background-timer-throttling','--disable-backgrounding-occluded-windows']});
 const U='http://localhost:8765/'+(process.env.TF_PAGE||'index.html')+'?fakenet&q=low';const P=[];for(let i=0;i<3;i++){const p=await b2.newPage();await p.setViewport({width:700,height:400});p.on('pageerror',e=>errs.push('B'+i+': '+e));await p.goto(U);P.push(p)}
 const [H,C,X]=P;await H.evaluate(()=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};__api.hostOnline()});await sleep(500);const code=await H.evaluate(()=>__api.LOBBY.code);
 // P2P blocked, no relay: does not connect
 await X.evaluate(c=>{window.__netSim={failDirect:true};settings.relay={};__api.joinOnline(c)},code);
 // P2P blocked, relay configured: falls back to relay-only ICE and joins
 await C.evaluate(c=>{window.__netSim={failDirect:true};settings.relay={mode:'manual',url:'turn:relay.invalid:3478',user:'u',cred:'c'};__api.joinOnline(c)},code);
 await sleep(13000);const rc=await C.evaluate(()=>({me:LOBBY&&LOBBY.me,retries:__netf.relayRetries,pol:__netf.lastPolicy}));const rx=await X.evaluate(()=>({me:LOBBY?LOBBY.me:-9}));
 ok('B direct P2P blocked + relay set up -> relay-only retry joins',rc.me>=0&&rc.retries===1&&rc.pol==='relay',rc);ok('B blocked without relay -> not joined (control)',rx.me<0,rx);
 await X.close();
 // long match with heavy traffic: no disconnects
 await H.evaluate(()=>__api.hostStartMatch());await sleep(6000);const T=+process.env.LONG||60000;const t0=Date.now();let snaps0=await C.evaluate(()=>{window.__snapN=0;const _h=clientMsg;clientMsg=function(d,t){if(d&&d.t==='snap')__snapN++;return _h(d,t)};return 0});
 await H.evaluate(T=>{const end=Date.now()+T;const iv=setInterval(()=>{if(Date.now()>end)return clearInterval(iv);for(let i=0;i<20;i++)for(const p of G.P)if(p.conn)netSend(p.conn,{t:'note',x:'y'.repeat(4000)})},100)},T);
 await C.evaluate(T=>{const end=Date.now()+T;const iv=setInterval(()=>{if(Date.now()>end)return clearInterval(iv);for(let i=0;i<10;i++)netSend(hostConn,{t:'hb',pad:'z'.repeat(3000)})},100)},T);
 await sleep(T);const lr=await C.evaluate(()=>({g:!!G,rej:window.__rejoins||0,snaps:__snapN,open:!!(hostConn&&hostConn.open)}));
 ok('B long heavy-traffic match: no disconnect / rejoin, snapshots keep flowing',lr.g&&lr.rej===0&&lr.open&&lr.snaps>T/1000*5,lr);
 // silent link (no close event): client detects silence and auto-reconnects
 await H.evaluate(()=>{window.__mute=true;const _s=netSend;window.__unmute=()=>{netSend=_s};netSend=function(c,m){if(c)return;return _s(c,m)};setTimeout(()=>__unmute(),18000)});
 await sleep(30000);const sr=await C.evaluate(()=>({g:!!G,rej:window.__rejoins||0,open:!!(hostConn&&hostConn.open),pol:__netf.lastPolicy}));
 ok('B silent link -> auto reconnect, back in match (relay forced on retry)',sr.g&&sr.rej>=1&&sr.open,sr);await b2.close()}
const errs2=errs.filter(e=>!(/SPAWN ASSERT/.test(e)&&ONLY.includes('G')));/* G teleports players onto props on purpose */ok('no page errors',errs2.length===0,errs2);console.log(`v81: ${pass} passed, ${fail} failed`);await br.close();process.exit(fail?1:0)})();
