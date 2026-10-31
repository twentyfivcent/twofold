// V8 drop 1 follow-up suite: takeover payout, crate-roll skip (real UI), menu 3D previews, gun-tip image, remote weapon sync. Local only; testguard blocks *.supabase.co.
require('./testguard');const {launch,open,sleep}=require('./b3lib');
(async()=>{const br=await launch();const errs=[];let pass=0,fail=0;const R=[];
 const ok=(n,v,info)=>{if(v){pass++;R.push('PASS '+n)}else{fail++;R.push('FAIL '+n+' '+JSON.stringify(info===undefined?'':info).slice(0,400))}};
 const h=await open(br,errs,'?fakenet');await sleep(2000);const ev=(f,a)=>h.evaluate(f,a);
 await ev(async()=>{window.__noAutoFS=1;await ACC.signUp('tkuser','secret123');for(const p of Object.values(__SBDB.profiles))p.money=99999;localStorage.setItem('__sbdb',JSON.stringify(__SBDB));await ACC.signOut();await ACC.signIn('tkuser','secret123');await ACC.load()});
 // ---- 1. takeover -> match end: payout/MVP to the human (host)
 await ev(()=>practice(0));await sleep(3000);
 const t1=await ev(async()=>{G.rs='live';const me0=ME,nm=G.P[ME].name;const mate=G.P.find(p=>p.team===G.P[ME].team&&p.id!==ME);G.P.forEach(p=>{p.alive=true;p.k=0;p.d=0;p.dmg=0;p.as=0});G.P[ME].alive=false;G.P[ME].k=1;
  hostTakeover(ME,mate.id);const drove=ME===mate.id;G.P[ME].k+=9;G.P[ME].dmg+=1500;const calls=[];const orpc=ACC.sb.rpc.bind(ACC.sb);ACC.sb.rpc=(fn,a)=>{calls.push([fn,JSON.parse(JSON.stringify(a))]);return orpc(fn,a)};
  const team=G.P[ME].team;G.sc[team]=ROUNDS_TO_WIN-1;endRound(team,'test');await new Promise(r=>setTimeout(r,1200));ACC.sb.rpc=orpc;
  const rep=calls.find(c=>c[0]==='report_match');const bn=document.body.innerText;
  return {drove,meBack:ME===me0,meName:G.P[ME].name===nm,mateBot:mate.bot,mvp:G.mvp,nm,rep:rep&&rep[1],earn:ACC.lastEarn,botsName:/'s bot/.test(G.mvp.name)}});
 ok('takeover: control returns to own slot at match end',t1.drove&&t1.meBack&&t1.meName&&t1.mateBot,t1);
 ok('takeover: MVP is the human (name + not bot)',t1.mvp&&t1.mvp.name===t1.nm&&!t1.mvp.bot&&!t1.botsName,t1.mvp);
 ok('takeover: payout report credits human (kills 10, mvp true)',t1.rep&&t1.rep.p_kills===10&&t1.rep.p_mvp===true,t1.rep);
 ok('takeover: money earned >0',t1.earn>0,t1.earn);
 // client-side 'over' with stale snapshot: stats/name from the event, not stale bot slot
 const t1c=await ev(async()=>{const h0=HOST;const calls=[];const om=ACC.matchOver;ACC.matchOver=function(w,m,i){calls.push({w,m,k:G.P[ME].k,name:i&&i.name});return Promise.resolve()};
  G.P[ME].k=0;G.P[ME].name="Stale's bot";HOST=false;try{handleEvent({t:'over',win:G.P[ME].team,mvp:ME,mvs:99,mvb:0,mvn:'Human',ps:G.P.map((p,i)=>[i===ME?10:1,0,i===ME?'Human':p.name,i===ME?0:1,0])})}finally{HOST=h0;ACC.matchOver=om}return calls[0]});
 ok('takeover: client applies end-of-match stats from host event',t1c&&t1c.m===true&&t1c.k===10&&t1c.name==='Human',t1c);
 await ev(()=>__api.quitToMenu(''));await sleep(800);
 // ---- 2. crate opening roll: Skip button (real UI flow)
 const c2=await ev(async()=>{const W8=ms=>new Promise(r=>setTimeout(r,ms));menuTab('mCrates');await W8(400);const c=CRATES[0];await ACC.buyKey(c.id);cratesPage&&cratesPage();renderMenu();await W8(300);const b=document.querySelector(`.copen[data-c="${c.id}"]`);b.click();
  let vis=false;for(let i=0;i<30&&!vis;i++){await W8(100);vis=getComputedStyle($('#reelSkip')).visibility==='visible'}const t0=performance.now();const resBefore=$('#reelRes').innerHTML.length;$('#reelSkip').click();await W8(150);
  const tr=new DOMMatrix(getComputedStyle($('#reelTrack')).transform).m41;const r={vis,resBefore,resAfter:$('#reelRes').innerHTML.length,close:getComputedStyle($('#reelClose')).visibility,skipHidden:getComputedStyle($('#reelSkip')).visibility==='hidden',ms:Math.round(performance.now()-t0),tr,last:window.__lastOpen};$('#reelClose').click();return r});
 ok('crate roll: Skip button shown during roll',c2.vis,c2);ok('crate roll: Skip jumps straight to result',c2.resBefore===0&&c2.resAfter>50&&c2.close==='visible'&&c2.skipHidden&&c2.tr<-1000,c2);
 // ---- 3. loadout 3D previews: character rotates, emote plays on the equipped character
 const blank=()=>ev(()=>{const L=__ld.LDV;if(!L.r)return -1;const gl=L.r.getContext(),w=gl.drawingBufferWidth,hh=gl.drawingBufferHeight;const px=new Uint8Array(4*w*hh);gl.readPixels(0,0,w,hh,gl.RGBA,gl.UNSIGNED_BYTE,px);let n=0;for(let i=3;i<px.length;i+=4)if(px[i]>20)n++;return n});
 await ev(()=>{menuTab('mLoad')});await sleep(600);await ev(()=>document.querySelector('#ldTabs .pt[data-t="chars"]').click());await sleep(1500);
 const p3=await ev(async()=>{const L=__ld.LDV;const cv=document.querySelector('#ldvCv');const rc=cv.getBoundingClientRect();const r0=L.m.rotation.y,f0=window.__ldvFrames;await new Promise(r=>setTimeout(r,1500));renderMenu();await new Promise(r=>setTimeout(r,800));
  return {same:L.r.domElement===document.querySelector('#ldvCv'),onScreen:rc.width>100&&rc.height>100&&cv.isConnected,rot:+(L.m.rotation.y-r0).toFixed(3),frames:window.__ldvFrames-f0}});
 const px3=await blank();ok('char preview: visible canvas is the one rendered, non-blank',p3.same&&p3.onScreen&&px3>500,{p3,px3});ok('char preview: rotates + keeps animating after menu refresh',Math.abs(p3.rot)>.05&&p3.frames>5,p3);
 await ev(()=>document.querySelector('#ldTabs .pt[data-t="emotes"]').click());await sleep(400);
 const p3e=await ev(async()=>{const id=(EMOTES.find(e=>e.free)||EMOTES[0]).id;const card=document.querySelector(`.ldgrid .scard[data-i="${id}"]`);card.click();await new Promise(r=>setTimeout(r,300));const L=__ld.LDV;const eq=charOf({id:ME,bot:false});
  const s=()=>L.m.userData.arms.map(A=>[A.sh.rotation.x,A.sh.rotation.z,A.el.rotation.x].map(v=>+v.toFixed(3)).join(',')).join('|');const seen=new Set([s()]);for(let i=0;i<6;i++){await new Promise(r=>setTimeout(r,300));seen.add(s())}
  return {key:L.key,eq,id,moved:seen.size>1,same:L.r.domElement===document.querySelector('#ldvCv')}});
 const px3e=await blank();ok('emote preview: plays on equipped character, animating, non-blank',p3e.key===p3e.eq+'|'+p3e.id&&p3e.moved&&p3e.same&&px3e>500,{p3e,px3e});
 // ---- 5. gun stats hover shows an IMAGE of the gun
 const g5=await ev(async()=>{renderMenu();const row=document.querySelector('[data-gun]')||document.querySelector('#gunTbl tr[data-g]');let d=row;if(!d){d=document.createElement('div');d.dataset.gun='kestrel';document.body.appendChild(d)}
  d.dispatchEvent(new MouseEvent('mouseover',{bubbles:true,clientX:300,clientY:300}));const im=document.querySelector('#gunTip img');if(!im)return {img:false};if(!im.complete)await new Promise(r=>{im.onload=r;setTimeout(r,1000)});
  const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const x=c.getContext('2d');x.drawImage(im,0,0);const D=x.getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<D.length;i+=4)if(D[i]>20)n++;
  return {img:true,w:im.naturalWidth,h:im.naturalHeight,px:n,shown:document.querySelector('#gunTip').style.display,real:!!row}});
 ok('gun tooltip shows a gun image (non-blank)',g5.img&&g5.w>50&&g5.px>500&&g5.shown==='block',g5);
 // ---- 4. remote HUMAN weapon sync over the (fake) network: host<->client, every rendered gun change matches a real swap
 const P=[];for(let i=0;i<2;i++){const p=await open(br,errs,'q=low');await p.evaluate(()=>{window.__noAutoFS=1});P.push(p)}const [H,C]=P;
 await H.evaluate(()=>__api.hostOnline());await sleep(500);const code=await H.evaluate(()=>__api.LOBBY.code);await C.evaluate(c=>__api.joinOnline(c),code);await sleep(2000);await H.evaluate(()=>__api.hostStartMatch());
 for(let i=0;i<40;i++){await sleep(1000);if((await H.evaluate(()=>__api.G&&__api.G.rs))==='live')break}
 const ids=await Promise.all(P.map(p=>p.evaluate(()=>__api.ME)));
 const rec=(p,o)=>p.evaluate(o=>{window.__rec=[];window.__ri=setInterval(()=>{const q=__api.G.P[o];window.__rec.push(q.inv[q.cur].w+'|'+(skinOf(q)||'')+'/'+heldOf(q))},16)},o);await rec(H,ids[1]);await rec(C,ids[0]);
 const act=p=>p.evaluate(()=>{const me=__api.G.P[__api.ME];let n=0;window.__sw=0;window.__act=setInterval(()=>{n++;me.yaw+=.02;me.pitch=Math.sin(n/20)*.3;me.ads=n%40<20;if(n%45===0){me.cur=1-me.cur;window.__sw++}},16)});await act(H);await act(C);await sleep(5000);
 const st=async(p,other)=>{const sw=await other.evaluate(()=>{clearInterval(window.__act);return window.__sw});const r=await p.evaluate(()=>{clearInterval(window.__ri);return window.__rec});let ch=0;for(let i=1;i<r.length;i++)if(r[i]!==r[i-1])ch++;return {sw,ch,n:r.length,u:[...new Set(r)]}};
 const hs=await st(H,C),cs=await st(C,H);
 ok('net: host sees client weapon change only on real swaps (no flicker)',hs.n>40&&hs.ch<=hs.sw+1&&hs.ch>=1,hs);ok('net: client sees host weapon change only on real swaps (no flicker)',cs.n>40&&cs.ch<=cs.sw+1&&cs.ch>=1,cs);
 ok('no page errors',errs.length===0,errs.slice(0,5));
 console.log(R.join('\n'));console.log(`v8d1b: ${pass} passed, ${fail} failed`);await br.close()})();
