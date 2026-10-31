require('./testguard');// v7.1 checks: menu map row gone, practice setup, QP random + QP end panel, lobby default/vote key, DEV tag colour cycling, loadout tabs + previews, crate order, emote camera position
const {launch,open,sleep}=require('./b3lib');const SHOT=process.env.SHOT==='1';
(async()=>{const br=await launch();const errs=[],R={},fail=[];const ok=(k,c,v)=>{R[k]=v===undefined?!!c:v;if(!c)fail.push(k)};
const freeze=h=>h.evaluate(()=>{G.rs='live';G.rt=999;window.__frz=setInterval(()=>{if(G&&G.rs==='live')G.rt=999},200);for(const p of G.P)if(p.team!==G.P[ME].team){p.pos=[60,-60,60];p.hp=99999}});
// ---- 1. menu + practice setup
let h=await open(br,errs);
ok('noMapSel',await h.evaluate(()=>!document.querySelector('#mapSel')));
ok('versionV8d1',await h.evaluate(()=>/v8\.1/i.test(document.querySelector('.ptitle').textContent)));
await h.evaluate(()=>$('#bPractice').click());await sleep(300);
const ps=await h.evaluate(()=>({vis:!$('#pracSetup').classList.contains('hide'),menu:$('#menu').classList.contains('hide'),n:$('#pMap').options.length,slots:document.querySelectorAll('#pracSetup .slot').length}));
ok('pracSetupShown',ps.vis&&ps.menu&&ps.n===14&&ps.slots===4,ps);
await h.evaluate(()=>{$('#pMap').value='4'});if(SHOT)await h.screenshot({path:'progress/v71-practice-setup.png'});
await h.evaluate(()=>$('#bPBack').click());await sleep(200);ok('pracBack',await h.evaluate(()=>!$('#menu').classList.contains('hide')&&$('#pracSetup').classList.contains('hide')));
await h.evaluate(()=>{$('#bPractice').click();$('#pMap').value='4';$('#bPStart').click()});await sleep(2500);
ok('pracMap4',await h.evaluate(()=>G&&G.mapIdx===4&&$('#pracSetup').classList.contains('hide')),await h.evaluate(()=>G&&G.mapIdx));
// ---- emote camera at the live position, not spawn
await freeze(h);await sleep(300);
const em=await h.evaluate(async()=>{const me=G.P[ME];const sp=me.pos.slice();me.pos=[sp[0]+0,sp[1],sp[2]+(sp[2]<0?6:-6)];me.vel=[0,0,0];await new Promise(r=>setTimeout(r,300));const cur=me.pos.slice();
 emoPlay('emo_wave');await new Promise(r=>setTimeout(r,600));const m=pMeshes[ME];const d=(a,b)=>Math.hypot(a[0]-b[0],a[2]-b[2]);
 const body=[m.position.x,m.position.y,m.position.z],cam=[camera.position.x,camera.position.y,camera.position.z];const r={spawn:sp,cur,body,cam,bodyErr:d(body,cur),camR:d(cam,cur),camFromSpawn:d(cam,sp),emoCam:window.__emoCam,vis:m.visible};
 emoCancel(me,'test');await new Promise(r=>setTimeout(r,500));const c2=[camera.position.x,camera.position.y,camera.position.z];r.after=d(c2,me.pos);r.afterCam=window.__emoCam;return r});
ok('emoteAtLivePos',em.emoCam===1&&em.vis&&em.bodyErr<0.5&&em.camR<3.6&&em.camFromSpawn>em.camR,em);ok('emoteCancelFP',em.afterCam===0&&em.after<0.5,em.after);
await h.close();
// ---- practice random
h=await open(br,errs);await h.evaluate(()=>{$('#bPractice').click();$('#pMap').value='-1';$('#bPStart').click()});await sleep(2500);
ok('pracRandom',await h.evaluate(()=>G&&G.mapIdx>=0&&G.mapIdx<MAPS.length));await h.close();
// ---- DEV tag colour animates in chat + killfeed
h=await open(br,errs);await h.evaluate(async()=>{await ACC.signUp('twentyfivcent','secret123')});await sleep(800);await h.evaluate(()=>practice(0));await sleep(2500);await freeze(h);
await h.evaluate(()=>{chatShow({n:myName(),m:'hello team',team:0});addKF(nm(ME)+' test entry');kfList[kfList.length-1].t=30;CHATLOG[CHATLOG.length-1].t=30});await sleep(300);
const col=()=>h.evaluate(()=>({chat:(document.querySelector('#chat .devtag')&&getComputedStyle(document.querySelector('#chat .devtag')).color)||null,kf:(document.querySelector('#kf .devtag')&&getComputedStyle(document.querySelector('#kf .devtag')).color)||null}));
const c=[];for(let i=0;i<4;i++){c.push(await col());await sleep(450)}
ok('devTagChatAnim',c[0].chat&&new Set(c.map(x=>x.chat)).size>=3,c.map(x=>x.chat));ok('devTagKfAnim',c[0].kf&&new Set(c.map(x=>x.kf)).size>=3,c.map(x=>x.kf));
await h.close();
// ---- Quick Play: always random, end panel, keys
for(const pick of ['menu','again']){h=await open(br,errs);
 await h.evaluate(async()=>{await hostOnline('QPABC');});await sleep(1200);
 const q=await h.evaluate(()=>{const r={qp:LOBBY.qp,map0:LOBBY.map};LOBBY.map=3;const mr=Math.random;Math.random=()=>.999;try{hostStartMatch()}finally{Math.random=mr}r.mapIdx=G.mapIdx;r.gqp=G.qp;return r});
 ok('qpRandom_'+pick,q.qp&&q.map0===-1&&q.mapIdx===MAPS_N(q)&&q.gqp,q);
 await sleep(2000);await h.evaluate(()=>{window.__mmStart=0;MM.start=async function(){window.__mmStart++};G.rs='over';G.rt=0});await sleep(1500);
 const pn=await h.evaluate(()=>({rs:G.rs,again:!!$('#bQpAgain'),menu:!!$('#bQpMenu'),votes:document.querySelectorAll('#mvote .mvc[data-i]').length,txt:$('#mvote').textContent}));
 ok('qpEndPanel_'+pick,pn.rs==='mapvote'&&pn.again&&pn.menu&&pn.votes===0&&/\[1\]/.test(pn.txt)&&/\[4\]/.test(pn.txt),pn);
 if(SHOT&&pick==='menu')await h.screenshot({path:'progress/v71-podium-qp.png'});
 await h.keyboard.press(pick==='menu'?'Digit4':'Digit1');await sleep(800);
 const af=await h.evaluate(()=>({G:!!G,menu:!$('#menu').classList.contains('hide'),mm:window.__mmStart}));
 ok('qpKey_'+pick,!af.G&&af.menu&&(pick==='menu'?af.mm===0:af.mm===1),af);await h.close()}
// QP timeout -> menu
h=await open(br,errs);await h.evaluate(async()=>{await hostOnline('QPXYZ')});await sleep(1200);await h.evaluate(()=>hostStartMatch());await sleep(2000);
await h.evaluate(()=>{G.rs='over';G.rt=0});await sleep(1000);await h.evaluate(()=>{QPEND.t=performance.now()+300});await sleep(1200);
ok('qpTimeoutMenu',await h.evaluate(()=>!G&&!$('#menu').classList.contains('hide')));await h.close();
// ---- hosted lobby: default random, pick works, vote panel + back-to-lobby key
h=await open(br,errs);await h.evaluate(async()=>{await hostOnline()});await sleep(1200);
const lb=await h.evaluate(()=>({qp:LOBBY.qp,map:LOBBY.map,sel:$('#lMap').value}));ok('lobbyDefaultRandom',!lb.qp&&lb.map===-1&&lb.sel==='-1',lb);
await h.evaluate(()=>{const s=$('#lMap');s.value='5';s.dispatchEvent(new Event('change'));hostStartMatch()});await sleep(2500);ok('lobbyPickMap5',await h.evaluate(()=>G.mapIdx===5&&!G.qp));
await h.evaluate(()=>{G.rs='over';G.rt=0});await sleep(1500);
const vp=await h.evaluate(()=>({votes:document.querySelectorAll('#mvote .mvc[data-i]').length,back:$('#bBackLobby')&&$('#bBackLobby').textContent,qp:!!$('#bQpAgain')}));
ok('lobbyVotePanel',vp.votes===3&&/\[4\]/.test(vp.back||'')&&!vp.qp,vp);if(SHOT)await h.screenshot({path:'progress/v71-podium-lobby-vote.png'});
await h.keyboard.press('Digit4');await sleep(800);ok('backLobbyKey',await h.evaluate(()=>!G&&!$('#lobby').classList.contains('hide')));
ok('kbRebindable',await h.evaluate(()=>KB_ACTIONS.some(a=>a[0]==='backlobby'&&a[2]==='Digit4')&&KB_ACTIONS.some(a=>a[0]==='requeue')&&!Object.keys(kbConflicts()).length));
await h.close();
// ---- crates order + loadout tabs/previews/equip
h=await open(br,errs);const page=(id)=>h.evaluate(id=>{MSEL=id;document.querySelectorAll('.mpage').forEach(e=>e.classList.toggle('hide',e.id!==id));renderMenu()},id);
await h.evaluate(async()=>{await ACC.signUp('loaduser','secret123');for(const p of Object.values(__SBDB.profiles))p.money=99999;localStorage.setItem('__sbdb',JSON.stringify(__SBDB));await ACC.signOut();await ACC.signIn('loaduser','secret123');window.__fastReel=1;
 for(let i=0;i<4;i++){await ACC.buyKey('cast');await ACC.openCrate('cast')}await ACC.load()});
await page('mCrates');await sleep(1500);
const co=await h.evaluate(()=>{const O=['Common','Uncommon','Rare','Epic','Legendary'];return [...document.querySelectorAll('#crateGrid .crate')].map(c=>{const r=[...c.querySelectorAll('.cskins img')].map(i=>{const m=/\((\w+)\)/.exec(i.title);return O.indexOf(m&&m[1])});return r.every((v,i)=>v>=0&&(i===0||v>=r[i-1]))&&r.length>0})});
ok('crateOrder',co.length>=3&&co.every(Boolean),co);
await h.evaluate(()=>menuTab('mLoad'));await sleep(800);ok('ldTabs',await h.evaluate(()=>document.querySelectorAll('#ldTabs .pt').length===3));
const blank=()=>h.evaluate(()=>{const L=__ld.LDV;if(!L.r)return -1;const gl=L.r.getContext(),w=gl.drawingBufferWidth,hh=gl.drawingBufferHeight;const px=new Uint8Array(4*w*hh);gl.readPixels(0,0,w,hh,gl.RGBA,gl.UNSIGNED_BYTE,px);let n=0;for(let i=3;i<px.length;i+=4)if(px[i]>20)n++;return n});
await h.evaluate(()=>{document.querySelector('#ldTabs .pt[data-t="chars"]').click()});await sleep(1500);
const own=await h.evaluate(()=>CHARS.filter(c=>!c.free&&ACC.owned[c.id]).map(c=>c.id));const lockC=await h.evaluate(()=>{const c=CHARS.find(c=>!c.free&&!ACC.owned[c.id]);return c&&c.id});
if(lockC){await h.evaluate(id=>document.querySelector(`.ldgrid .scard[data-i="${id}"]`).click(),lockC);await sleep(800);ok('lockedPreview',await h.evaluate(()=>$('#ldvEquip').disabled&&/Not owned/.test($('#ldvInfo').textContent))&&(await blank())>500)}
const pv=await blank();ok('charPreviewRender',pv>500&&await h.evaluate(()=>getComputedStyle(document.querySelector('#skinGrid')).display==='none'),pv);
await h.evaluate(id=>document.querySelector(`.ldgrid .scard[data-i="${id}"]`).click(),own[0]);await sleep(500);await h.evaluate(()=>$('#ldvEquip').click());await sleep(800);
const eqd=await h.evaluate(async id=>{const db=__SBDB.eq.find(e=>e.gun==='_char');await ACC.load();return {db:db&&db.skin_id,acc:ACC.equipped._char,id}},own[0]);
ok('charEquipPersist',eqd.db===own[0]&&eqd.acc===own[0],eqd);if(SHOT){await h.evaluate(()=>skinsPage());await sleep(1200);await h.screenshot({path:'progress/v71-characters-menu.png'})}
await h.evaluate(()=>{document.querySelector('#ldTabs .pt[data-t="emotes"]').click()});await sleep(400);
await h.evaluate(()=>document.querySelector('.ldgrid .scard[data-i="emo_salute"]')?.click());await sleep(900);
const f0=await h.evaluate(()=>window.__ldvFrames);await sleep(500);const f1=await h.evaluate(()=>({f:window.__ldvFrames,t:window.__ldvT,key:__ld.LDV.key}));
ok('emotePreviewAnim',f1.f>f0&&f1.t>0&&/\|emo_salute/.test(f1.key)&&(await blank())>500,f1);
await h.evaluate(()=>{document.querySelector('#ldTabs .pt[data-t="skins"]').click()});await sleep(300);ok('skinsTabBack',await h.evaluate(()=>getComputedStyle($('#skinGrid')).display!=='none'&&$('#charSec').style.display==='none'));
await h.close();
console.log(JSON.stringify(R,null,0));console.log('ERRS',JSON.stringify(errs));console.log(fail.length||errs.length?'FAIL '+fail.join(','):'PASS');await br.close();process.exit(fail.length||errs.length?1:0)})();
function MAPS_N(){return 12}
