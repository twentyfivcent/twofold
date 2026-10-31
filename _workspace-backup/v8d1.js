// V8 drop 1 regression suite. Local server :8765 + fakenet only; testguard blocks *.supabase.co.
require('./testguard');const {launch,open,sleep}=require('./b3lib');
(async()=>{const br=await launch();const errs=[];let pass=0,fail=0;const R=[];
 const ok=(n,v,info)=>{if(v){pass++;R.push('PASS '+n)}else{fail++;R.push('FAIL '+n+' '+JSON.stringify(info===undefined?'':info).slice(0,300))}};
 const h=await open(br,errs,'?fakenet');await sleep(2500);const ev=(f,a)=>h.evaluate(f,a);
 ok('label',await ev(()=>/v8\.1/.test(document.querySelector('.ptitle').textContent)));
 // ---- damage -4% + crossbow
 const dm=await ev(()=>{const bad=[];let n=0;for(const k in V7CHG){if(!/\.dm\(v8\)$/.test(k))continue;n++;const [o,nw]=V7CHG[k];o.forEach((v,i)=>{const want=v>=100?Math.max(100,Math.round(v*.96)):Math.round(v*.96);if(nw[i]!==want&&!(k==='thistle.dm(v8)'))bad.push([k,i,v,nw[i]])})}
  return {n,bad,th:W.thistle.dm.slice(),k:W.kestrel.dm.slice(),int:Object.values(W).every(w=>!w.dm||w.dm.every(v=>Number.isInteger(v)))}});
 ok('dmg -4% all guns',dm.n>30&&!dm.bad.length,dm);ok('dmg integers',dm.int);ok('crossbow head/body >=100',dm.th[0]>=100&&dm.th[1]>=100,dm.th);
 ok('bot names',await ev(()=>{const a=pickBotNames(4);return BOT_NAMES.length>=100&&new Set(a).size===4}));
 await ev(()=>practice(0));await sleep(3000);
 await ev(()=>{G.rs='live';G.P.forEach(p=>{p.alive=true;p.hp=100})});
 const xb=await ev(()=>{const me=G.P[ME],f=G.P.find(p=>p.team!==me.team);const r={};f.hp=100;damage(f.id,ME,40,'thistle',false,f.pos,'body');r.body=f.hp;const g=G.P.filter(p=>p.team!==me.team)[1];g.alive=true;g.hp=100;damage(g.id,ME,40,'thistle',false,g.pos,'limb');r.limb=g.hp;G.rs='live';return r});
 ok('crossbow chest one-shot',xb.body===0,xb);ok('crossbow limb not lethal',xb.limb>0,xb);
 // ---- knife cook
 const kc=await ev(()=>{G.rs='live';const me=G.P[ME];me.alive=true;me.hp=100;me.util='knife';me.utilN=2;me.cook=-1;me.utilHeld=false;const out={};
  out.p0=knifePower(.05);out.p1=knifePower(.7);out.p2=knifePower(3);out.vmin=knifeThrowVel(me,.1).v;out.vmax=knifeThrowVel(me,2).v;
  const n0=G.nades.length;weaponTick(me,{util:true},1/60,true);me.utilHeld=true;weaponTick(me,{},1/60,true);out.afterTap=G.nades.length-n0;for(let i=0;i<10;i++){weaponTick(me,{},1/60,true)}out.tap=me._lastKnife&&me._lastKnife.k;out.thrown1=G.nades.length-n0;
  me.utilN=2;me.cook=-1;me.utilHeld=false;weaponTick(me,{util:true},1/60,true);me.utilHeld=true;for(let i=0;i<60;i++)weaponTick(me,{util:true},1/60,true);out.heldCook=+me.cook.toFixed(2);out.hud=(updateHUD(0),document.querySelector('#cook').textContent);weaponTick(me,{},1/60,true);out.full=me._lastKnife;out.utilN=me.utilN;const kn=G.nades.filter(n=>n.type==='knife');out.speed=+Math.hypot(...kn[kn.length-1].vel).toFixed(1);return out});
 ok('knife power curve',kc.p0===0&&kc.p1===1&&kc.p2===1,kc);ok('knife speeds 22..44',Math.abs(kc.vmin-22)<.01&&Math.abs(kc.vmax-44)<.01,kc);
 ok('knife tap waits for windup then throws weak',kc.afterTap===0&&kc.thrown1===1&&kc.tap<.2,kc);ok('knife hold = full power, no auto-throw',kc.heldCook>=1&&kc.full&&kc.full.k===1&&Math.abs(kc.speed-44)<1,kc);ok('knife HUD power',/Knife power 100%/.test(kc.hud),kc.hud);
 // ---- smoke LOS
 const sm=await ev(()=>{G.smokes.length=0;G.smokes.push({id:99,pos:[0,1.5,0],r:4,t:10});const a=segSmoke([-10,1.5,4.6],[10,1.5,4.6]),b=segSmoke([-10,1.5,6],[10,1.5,6]);G.smokes[0].r=.3;const c=segSmoke([-10,1.5,.3],[10,1.5,.3]);G.smokes.length=0;return {edge:a,out:b,young:c}});
 ok('smoke blocks to drawn edge (1.15r)',sm.edge&&!sm.out,sm);ok('young smoke blocks',sm.young,sm);
 // ---- mouse spike filter
 const mf=await ev(()=>{for(let i=0;i<30;i++)mouseFilt({movementX:12,movementY:3});const a=mouseFilt({movementX:900,movementY:0});const b=mouseFilt({movementX:12,movementY:0});const c=[mouseFilt({movementX:800}),mouseFilt({movementX:800}),mouseFilt({movementX:800})];return {a,b,c}});
 ok('mouse spike dropped',mf.a[0]===0&&mf.b[0]===12,mf);ok('sustained fast flick passes',mf.c[2][0]===800,mf);
 // ---- ragdoll: one body
 await ev(()=>{G.rs='live';const me=G.P[ME];const f=G.P.find(p=>p.team!==me.team);f.alive=true;f.hp=100;window.__rf=f.id;damage(f.id,ME,999,'kestrel',false,me.pos,'body')});await sleep(700);
 const rg=await ev(()=>{const id=window.__rf;return {vis:pMeshes[id].visible,rags:RAGS.filter(r=>r.pid===id&&r.t<3).length}});ok('dead player drawn only as ragdoll',!rg.vis&&rg.rags===1,rg);
 // ---- takeover revert + MVP
 const tk=await ev(()=>{G.rs='live';const me=G.P[ME];const mate=G.P.find(p=>p.team===me.team&&p.id!==ME);G.P.forEach(p=>{p.alive=true});me.k=3;me.alive=false;const nm=me.name,mn=mate.name;const ok1=hostTakeover(ME,mate.id);const r={ok1,meNow:ME,mateId:mate.id};G.P[ME].k+=2;revertTakeovers();r.meBack=ME;r.name=G.P[0].name===nm;r.mateName=mate.name===mn;r.mateBot=mate.bot;r.k=G.P[0].k;r.mateK=mate.k;r.mvp=computeMVP();return r});
 ok('takeover reverted to own slot',tk.ok1&&tk.meNow===tk.mateId&&tk.meBack===0&&tk.name&&tk.mateName&&tk.mateBot,tk);ok('takeover kills credited to player',tk.k===5,tk);
 // ---- bot no swap ping-pong
 const bs=await ev(()=>{const b=G.P.find(p=>p.bot&&p.id!==ME);b.alive=true;b.hp=100;b.cur=0;b.inv[0].mag=0;b.inv[0].res=0;b.inv[1].mag=0;b.inv[1].res=0;let sw=0,last=b.cur;for(let i=0;i<180;i++){const inp=botThink(b,1/60);weaponTick(b,inp,1/60,true);if(b.cur!==last){sw++;last=b.cur}}return sw});ok('bot never ping-pongs empty guns',bs<=1,bs);
 // ---- practice full pause
 const pz=await ev(async()=>{G.rs='live';const el0=G.el;document.querySelector('#pause').classList.remove('hide');await new Promise(r=>setTimeout(r,1200));const el1=G.el;document.querySelector('#pause').classList.add('hide');await new Promise(r=>setTimeout(r,600));return {frozen:el1===el0,resumed:G.el>el1,prac:G.practice}});ok('practice pauses fully',pz.frozen&&pz.resumed&&pz.prac,pz);
 // ---- HUD skin tag + pickup prompt
 const hud=await ev(()=>{const id=Object.keys(SKIN)[0],s=SKIN[id];ACC.equipped=ACC.equipped||{};ACC.equipped[s.gun]=id;const t=hudSkinTag(s.gun);delete ACC.equipped[s.gun];pickMsg('Knife picked up');return {t,n:s.n,on:document.querySelector('#pickMsg').classList.contains('on'),txt:document.querySelector('#pickMsg').textContent}});
 ok('HUD skin name',hud.t.includes(hud.n),hud);ok('knife pickup prompt',hud.on&&hud.txt==='Knife picked up',hud);
 const kp=await ev(async()=>{const me=G.P[ME];me.alive=true;me.util='knife';const n0=me.utilN;G.knives.push({id:777,pos:[me.pos[0]+.3,.05,me.pos[2]],yaw:0,pitch:0,stuck:false,t:1});document.querySelector('#pickMsg').classList.remove('on');window.__pickMsg='';await new Promise(r=>setTimeout(r,500));return {d:me.utilN-n0,msg:window.__pickMsg}});ok('walk-over knife pickup shows prompt',kp.d===1&&kp.msg==='Knife picked up',kp);
 // ---- Gemini viewmodel
 const gm=await ev(()=>{setViewmodel('gemini',0,'');const g=vm.userData.gun.userData.dual;return {dual:!!vm.userData.dualVM,x:g.map(o=>o.position.x)}});ok('Gemini one pistol per hand',gm.dual&&gm.x[0]>.2&&gm.x[1]<-.2,gm);
 // ---- water: deep pool on Hoshikawa (map 6) and Dockyard
 const wt=[];for(const mi of [6,8,10]){await ev(m=>practice(m),mi);await sleep(2500);wt.push(await ev(()=>{G.rs='live';const me=G.P[ME];me.alive=true;const b=G.boxes.find(b=>b.liquid&&b.max[1]-b.min[1]>=1);if(!b){const sb=G.boxes.find(b=>b.liquid);if(!sb)return {none:G.mapDef.n};const cx=(sb.min[0]+sb.max[0])/2,cz=(sb.min[2]+sb.max[2])/2;me.pos=[sb.min[0]-1,0,cz];me.vel=[0,0,0];let maxY=0;const run=d=>{me.pos=[cx+d*(sb.max[0]-sb.min[0]),0,cz];for(let i=0;i<60;i++){movePlayer(me,{f:0,r:-d,yaw:0,pitch:0},1/60);maxY=Math.max(maxY,me.pos[1])}};run(1);run(-1);return {n:G.mapDef.n,shallow:1,maxY:+maxY.toFixed(2),wade:__wade.depth(cx,0,cz)}}const cx=(b.min[0]+b.max[0])/2,cz=(b.min[2]+b.max[2])/2;
 me.pos=[cx,0,cz];me.vel=[0,0,0];for(let i=0;i<60;i++)movePlayer(me,{f:0,r:0,yaw:0,pitch:0},1/60);const y=me.pos[1],gr=me.ground,sw=!!me.swim,dep=__wade.depth(me.pos[0],me.pos[1],me.pos[2]);
  let apex=y;me.vel=[0,0,0];movePlayer(me,{f:0,r:0,jump:true,yaw:0,pitch:0},1/60);for(let i=0;i<60;i++){movePlayer(me,{f:0,r:0,yaw:0,pitch:0},1/60);apex=Math.max(apex,me.pos[1])}const jumpH=apex-y;
  me.pos=[b.min[0]+.5,y,cz];me.vel=[0,0,0];const a=[me.pos[0]];for(let i=0;i<20;i++)movePlayer(me,{f:0,r:-1,sprint:true,yaw:0,pitch:0},1/60);const ws=me.pos[0]-a[0];
  const owm=window.wadeMul;window.wadeMul=()=>1;me.pos=[b.min[0]+.5,y,cz];me.vel=[0,0,0];const a2=[me.pos[0]];for(let i=0;i<20;i++)movePlayer(me,{f:0,r:-1,sprint:true,yaw:0,pitch:0},1/60);const ds=me.pos[0]-a2[0];window.wadeMul=owm;
  let snd=0,spl=0;const ow=window.wadeSound,os=window.splash;window.wadeSound=function(){snd++;return ow.apply(this,arguments)};window.splash=function(){spl++;return os.apply(this,arguments)};
  const exits=[];for(const [f,r] of [[0,1],[0,-1],[1,0],[-1,0]]){me.pos=[cx,y,cz];me.vel=[0,0,0];me._wd=0;let ok=null;for(let i=0;i<150;i++){movePlayer(me,{f,r,yaw:0,pitch:0},1/60);me.rpos=me.pos.slice();if(i%8===0){try{SND.step()}catch(e){}try{wadeFrame(1/60)}catch(e){}}const q=me.pos;if((q[0]<b.min[0]-.5||q[0]>b.max[0]+.5||q[2]<b.min[2]-.5||q[2]>b.max[2]+.5)&&me.ground&&q[1]>=-.01){ok=+q[1].toFixed(2);break}}exits.push(ok)}
  window.wadeSound=ow;window.splash=os;
  return {n:G.mapDef.n,y:+y.toFixed(2),gr,sw,dep:+dep.toFixed(2),jumpH:+jumpH.toFixed(2),ratio:+(ws/ds).toFixed(2),exits,snd,spl}}))}
 for(const w of wt)ok('water '+(w.n||w.none),!w.none&&(w.shallow?w.maxY<.05:(w.y<-.5&&w.y>-.6&&w.gr&&!w.sw&&w.dep>.5&&w.dep<1&&w.jumpH>1&&w.ratio>.72&&w.ratio<.88&&w.exits.filter(e=>e!==null).length>=3&&w.snd>0&&w.spl>0)),w);
 // ---- props in spawns (all maps) + helipad single H on Sunspire
 const sc=[];for(let mi=0;mi<12;mi++){await ev(m=>practice(m),mi);await sleep(1800);sc.push(await ev(()=>({n:G.mapDef.n,bad:__spawnClear(),h:(()=>{let n=0;mapGroup.traverse(o=>{if(o.userData&&o.userData.helipadH)n++});return n})(),hp:G.boxes.filter(b=>b.tex==='helipad').length})))}
 for(const s of sc)ok('spawn clear '+s.n,s.bad.length===0,s.bad.slice(0,3));const ss=sc.find(s=>/Sunspire/.test(s.n));ok('helipad one H decal per pad',ss&&ss.hp>0&&ss.h===ss.hp,ss);
 await ev(()=>__api.quitToMenu(''));await sleep(800);
 // ---- menu: crate icons, skip, scroll guard, gun tip, fullscreen setting
 const mn=await ev(async()=>{menuTab('mCrates');await new Promise(r=>setTimeout(r,400));const r={};r.xIcons=document.querySelectorAll('#crateGrid .xcrate .cimg').length;let called=0;reelArm(()=>called++,5000);r.skipOk=reelSkip()&&called===1;
  r.fs=[...document.querySelectorAll('.fsDefIn')].length>=1&&document.querySelector('.fsDefIn').checked;const d=document.createElement('div');d.dataset.gun='kestrel';document.body.appendChild(d);d.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));r.tip=document.querySelector('#gunTip').style.display==='block'&&window.__gunTip==='kestrel';d.remove();return r});
 ok('emote/char crate icons',mn.xIcons===2,mn);ok('crate skip',mn.skipOk,mn);ok('start-in-fullscreen setting default on',mn.fs,mn);ok('gun image on hover',mn.tip,mn);
 const b=await ev(()=>{const r=document.querySelector('#crateGrid .crate').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+60}});await h.mouse.move(b.x,b.y);await ev(()=>document.querySelector('#menu .pbody').scrollTop=0);await h.mouse.wheel({deltaY:300});await sleep(500);
 ok('crate tab scrolls with wheel',await ev(()=>document.querySelector('#menu .pbody').scrollTop>100));
 ok('no page errors',errs.filter(e=>!/favicon|fullscreen|Permissions/i.test(e)).length===0,errs.slice(0,5));
 console.log(R.join('\n'));console.log(`v8d1: ${pass} passed, ${fail} failed`);await br.close();process.exit(fail?1:0)})();
