require('./testguard');const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',protocolTimeout:60000,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-renderer-backgrounding','--disable-background-timer-throttling','--disable-backgrounding-occluded-windows']});
const U='http://localhost:8765/index.html?fakenet&q=low';const errs=[];const P=[];const R={};
for(let i=0;i<4;i++){const p=await b.newPage();await p.setViewport({width:900,height:500});p.on('pageerror',e=>errs.push(i+': '+e));p.on('console',m=>{if(m.type()==='error'&&!/404/.test(m.text()))errs.push(i+' console: '+m.text())});await p.goto(U);await p.evaluate(n=>{const e=document.querySelector('#nameIn');e.value=n;e.dispatchEvent(new Event('input'))},['Host','Cli1','Cli2','Late'][i]);P.push(p)}
const [H,C1,C2,C3]=P;const all=[H,C1,C2];
await H.evaluate(()=>__api.hostOnline());await sleep(400);const code=await H.evaluate(()=>__api.LOBBY.code);
for(const c of [C1,C2]){await c.evaluate(c=>__api.joinOnline(c),code);await sleep(700)}
// lobby settings: map + friendly fire + mark one free slot empty
await H.evaluate(()=>{const L=__api.LOBBY;const s=document.querySelector('#lMap');s.value='6';s.dispatchEvent(new Event('change'));const f=document.querySelector('#lFF');f.checked=true;f.dispatchEvent(new Event('change'));
 const i=L.slots.findIndex(x=>!x);document.querySelector('.slotT[data-i="'+i+'"]').click()});await sleep(500);
R.lobby=await Promise.all(all.map(p=>p.evaluate(()=>({map:__api.LOBBY.map,ff:__api.LOBBY.ff,slots:__api.LOBBY.slots.map(s=>s?(s.off?'off':s.name):'bot')}))));
await H.screenshot({path:'/tmp/v6-lobby.png'});
// lobby chat from a client
await C1.evaluate(()=>__api.sendChat('hello lobby',false));await sleep(400);
R.lobbyChat=await Promise.all(all.map(p=>p.evaluate(()=>window.__chat||0)));
await H.evaluate(()=>__api.hostStartMatch());await sleep(1500);
R.start=await Promise.all(all.map(p=>p.evaluate(()=>({map:__api.G.mapIdx,ff:__api.G.ff,off:__api.G.P.map(p=>p.off?1:0).join(''),bots:__api.G.P.map(p=>p.bot?1:0).join('')}))));
// votes: only humans count
await H.evaluate(()=>__api.castVote(1));await C1.evaluate(()=>__api.castVote(1));await C2.evaluate(()=>__api.castVote(2));await sleep(500);
R.votes=await H.evaluate(()=>__api.G.votes.join(','));
await H.evaluate(()=>{__api.G.rt=0.01});await sleep(900);R.lo=await H.evaluate(()=>[__api.G.lo.join('/'),JSON.stringify(__api.G.opts[1])]);
await sleep(3600);R.rs=await H.evaluate(()=>__api.G.rs);
R.spawnAsserts=await H.evaluate(()=>(window.__spawnAsserts||[]).map(a=>a.when+':'+a.ok).join(' '));
// late join takes the empty slot
await C3.evaluate(c=>__api.joinOnline(c),code);await sleep(1500);R.late=await C3.evaluate(()=>__api.G?{me:__api.ME,rs:__api.G.rs}:null);
// team chat: only same team receives
const before=await Promise.all([H,C1,C2,C3].map(p=>p.evaluate(()=>window.__chat||0)));
await C1.evaluate(()=>__api.sendChat('team only',true));await sleep(500);
const after=await Promise.all([H,C1,C2,C3].map(p=>p.evaluate(()=>window.__chat||0)));
R.teams=await H.evaluate(()=>__api.G.P.map(p=>p.team+(p.bot?'b':'h')).join(','));R.myslots=await Promise.all([H,C1,C2,C3].map(p=>p.evaluate(()=>__api.ME)));
R.teamChatDelta=after.map((a,i)=>a-before[i]);
// friendly fire: host hurts its teammate
R.ff=await H.evaluate(()=>{const G=__api.G;const me=G.P[__api.ME];const mate=G.P.find(p=>p.team===me.team&&p.id!==me.id);mate.alive=true;mate.hp=100;__api.damage(mate.id,me.id,30,'kestrel',false,me.pos,'body');return mate.hp});
// melee from a client
await C1.evaluate(()=>{window.__forceMelee=1});await sleep(200);await C1.evaluate(()=>{window.__forceMelee=0});await sleep(400);
R.melee=await H.evaluate(()=>__api.G.P.map(p=>+(p.meleeCd>0)).join(''));
// deployables sync: host performs utilities for client slot
await H.evaluate(S=>{const G=__api.G;const p=G.P[S];p.alive=true;p.utilN=5;for(const u of ['decoy','mine','pad','cloak']){p.util=u;__api.hostAction(S,{t:'util',type:u})}},R.myslots[1]);await sleep(600);
R.items=await Promise.all(all.map(p=>p.evaluate(()=>[__api.G.decoys.length,__api.G.mines.length,__api.G.pads.length].join('/'))));
// knife pickup synced
R.knife=await H.evaluate(S=>{const G=__api.G;const p=G.P[S];G.knives.push({id:999,pos:[p.pos[0],p.pos[1],p.pos[2]],yaw:0,pitch:0,stuck:false,t:1});p.util='knife';p.utilN=0;return G.knives.length},R.myslots[2]);await sleep(800);
R.knifeAfter=await H.evaluate(S=>[__api.G.knives.length,__api.G.P[S].utilN],R.myslots[2]);R.knifeCli=await C2.evaluate(()=>__api.G.knives.length);
await C1.bringToFront();await sleep(300);await C1.screenshot({path:'/tmp/v6-mp-client.png'});

// ---- v6 sync checks ----
await sleep(1500);
R.todSync=await Promise.all([H,C1,C2,C3].map(p=>p.evaluate(()=>__api.G.tod)));
R.flagSync=await Promise.all([H,C1,C2,C3].map(p=>p.evaluate(()=>{const f=__api.G.flag;return f&&(f.i+':'+(f.pos||[]).map(v=>v.toFixed(1)).join(',')+':'+f.n)})));
// skins visible to others: C1 equips a skin locally; others should render it on C1's third-person gun
const sk=await C1.evaluate(()=>{const s=SKINS[0];window.equippedSkin=g=>g===s.gun?s.id:'';const me=__api.G.P[__api.ME];me.alive=true;me.inv[0].w=s.gun;me.cur=0;return {id:s.id,gun:s.gun,slot:__api.ME}});await sleep(1500);
R.skinSeen=[];for(const pg of [H,C2,C3]){await pg.bringToFront();await sleep(700);R.skinSeen.push(await pg.evaluate(S=>{const m=pMeshes[S.slot];const g=m&&m.userData.gunHolder&&m.userData.gunHolder.children[0];return {want:S.id,got:m&&m.userData.gid||'',cur:__api.G.P[S.slot].skinCur||''}},sk))}
// remote melee/slot sync: C1 holds knife (melee slot) -> others see held=2
await C1.evaluate(()=>{window.__forceMelee=1});await sleep(250);
R.meleeHeldSeen=await Promise.all([H,C2].map(p=>p.evaluate(S=>__api.G.P[S].held!==undefined?__api.G.P[S].held:heldOf(__api.G.P[S]),sk.slot)));
await C1.evaluate(()=>{window.__forceMelee=0});await sleep(900);
R.slotAfter=await Promise.all([H,C2].map(p=>p.evaluate(S=>heldOf(__api.G.P[S]),sk.slot)));
// muzzle tracers from barrel: record tracer start on C2 for shots by C1, compare with C1's third-person muzzle on C2
await C2.bringToFront();await sleep(300);await C2.evaluate(S=>{window.__trc=[];const t0=performance.now();const f=()=>{for(const t of tracers){if(t.pid!==S)continue;const p=t.m.geometry.attributes.position;const m=muzzleWorld(S);window.__trc.push(m?Math.hypot(p.getX(0)-m.x,p.getY(0)-m.y,p.getZ(0)-m.z):-1)}window.__trAll=(window.__trAll||0)+tracers.length;window.__fr=(window.__fr||0)+1;if(performance.now()-t0<2500)requestAnimationFrame(f)};f()},sk.slot);
await C2.evaluate(S=>{let n=0;const iv=setInterval(()=>{const p=__api.G.P[S];const o=[p.pos[0],p.pos[1]+1.5,p.pos[2]];handleEvent({t:'tr',s:S,o,e:[o[0]+5,o[1],o[2]+20],w:0});tracers[tracers.length-1].t=1;if(++n>=8)clearInterval(iv)},120)},sk.slot);await sleep(1600);
R.tracers=await C2.evaluate(()=>{const t=window.__trc;return {all:window.__trAll,fr:window.__fr,samples:t.length,nullMuzzle:t.filter(x=>x<0).length,maxD:t.length?Math.max(...t).toFixed(3):null}});
// MVP end screen via the real endRound path
await H.evaluate(()=>{const G=__api.G;G.P.forEach((p,i)=>{p.k=[3,7,2,4][i];p.dmg=[300,820,240,410][i];p.as=[1,2,0,1][i]});G.sc=[5,5];G.rs='live';endRound(__api.G.P[1].team,'elim')});await sleep(700);
R.mvp=await Promise.all([H,C1].map(p=>p.evaluate(()=>[JSON.stringify(__api.G.mvp),!!document.querySelector('#mvpBadge')])));
await C1.bringToFront();await C1.screenshot({path:'progress/v6-mvp.png'});
// match over -> map vote -> next map on all pages
await H.evaluate(()=>{const G=__api.G;G.rs='over';G.rt=0.01});await sleep(1200);
R.mapvote=await Promise.all(all.map(p=>p.evaluate(()=>__api.G.rs+' '+JSON.stringify(__api.G.mopts))));
await C1.evaluate(()=>__api.castMapVote(2));await C2.evaluate(()=>__api.castMapVote(2));await H.evaluate(()=>__api.castMapVote(0));await C3.evaluate(()=>__api.castMapVote(1));await sleep(600);
R.mvotes=await H.evaluate(()=>__api.G.mvotes.join(','));await C1.bringToFront();await sleep(200);await C1.screenshot({path:'/tmp/v6-mapvote.png'});
await H.evaluate(()=>{__api.G.rt=0.01});await sleep(3500);
R.next=await Promise.all([H,C1,C2,C3].map(p=>p.evaluate(()=>__api.G?__api.G.mapIdx+' '+__api.G.rs+' ff='+__api.G.ff:'none')));
console.log(JSON.stringify(R,null,1));console.log('errors',errs);await b.close()})().catch(e=>{console.log('FAIL',e.stack);process.exit(1)});
