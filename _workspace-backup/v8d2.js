// V8 drop 2 suite: crates (refund/cues/auto-roll), leaderboard card, missions, mantle prompt, pings + voice, lethal/tactical, party. Local only; testguard blocks *.supabase.co; RPCs are mock-supabase.js.
require('./testguard');const {launch,open,sleep}=require('./b3lib');const SHOTS=process.env.SHOTS;
(async()=>{const br=await launch();const errs=[];let pass=0,fail=0;const R=[];
 const ok=(n,v,info)=>{if(v){pass++;R.push('PASS '+n)}else{fail++;R.push('FAIL '+n+' '+JSON.stringify(info===undefined?'':info).slice(0,500))}};
 const h=await open(br,errs,'?fakenet');await sleep(2000);const ev=(f,a)=>h.evaluate(f,a);if(process.env.STK)h.on('pageerror',e=>console.log('STACK',(e.stack||'').slice(0,500)));
 ok('label V8 DROP 3a',await ev(()=>/v8\.1/.test(document.querySelector('.ptitle').textContent)));
 await ev(async()=>{window.__noAutoFS=1;window.__SB_NORL=1;await ACC.signUp('d2user','secret123');for(const p of Object.values(__SBDB.profiles))p.money=99999;localStorage.setItem('__sbdb',JSON.stringify(__SBDB));await ACC.signOut();await ACC.signIn('d2user','secret123');await ACC.load()});
 // ---------------- crates
 const cr=await ev(async()=>{const c=CRATES[0];const r={cid:c.id};for(let i=0;i<2;i++)await ACC.buyKey(c.id);window.__SB_ROLL=0;const m0=ACC.profile.money;
  await ACC.openCrate(c.id);r.first=Object.assign({},ACC.lastOpen);const m1=ACC.profile.money;await ACC.openCrate(c.id);r.second=Object.assign({},ACC.lastOpen);const m2=ACC.profile.money;
  const sp=Object.values(__SBDB.profiles)[0];r.srvOpened=sp.crates_opened;r.cliDelta1=m1-m0;r.cliDelta2=m2-m1;r.price=c.price||c.key||null;await ACC.load();r.srvMoney=sp.money;r.cliMoney=ACC.profile.money;delete window.__SB_ROLL;return r});
 ok('crate: first open not a dup, no refund',cr.first&&!cr.first.dup&&cr.first.refund===0,cr);
 ok('crate: duplicate pays ~10% refund (server)',cr.second&&cr.second.dup&&cr.second.refund>0&&cr.cliDelta2===cr.second.refund,cr);
 ok('crate: crates_opened counted server-side',cr.srvOpened===2,cr);ok('crate: client money matches server',cr.srvMoney===cr.cliMoney,cr);
 const cue=await ev(()=>{window.__rarCue=[];for(const r of RAR_ORDER)rarityCue(r);return {n:window.__rarCue.length,ord:RAR_ORDER.slice()}});ok('rarity cues for every tier up to Legendary',cue.n===cue.ord.length&&cue.ord.map(x=>x.toLowerCase()).includes('legendary'),cue);
 // auto-roll through the real UI
 const ar=await ev(async()=>{const W8=ms=>new Promise(r=>setTimeout(r,ms));window.__fastReel=1;const c=CRATES[0];menuTab('mCrates');await W8(300);for(let i=0;i<3;i++)await ACC.buyKey(c.id);renderMenu();await W8(200);
  const k0=ACC.keys[c.id];$('#autoStop').checked=false;$('#autoStop').onchange({target:$('#autoStop')});$('#autoRoll').checked=true;$('#autoRoll').onchange({target:$('#autoRoll')});document.querySelector(`.copen[data-c="${c.id}"]`).click();
  for(let i=0;i<120&&ACC.keys[c.id]>0;i++)await W8(250);await W8(1500);const r={k0,left:ACC.keys[c.id],info:$('#autoInfo').textContent};
  // stop on Epic+: rarest roll
  for(let i=0;i<2;i++)await ACC.buyKey(c.id);window.__SB_ROLL=.99999;$('#autoStop').checked=true;$('#autoStop').onchange({target:$('#autoStop')});$('#reelClose').click();await W8(300);document.querySelector(`.copen[data-c="${c.id}"]`)&&(renderMenu(),document.querySelector(`.copen[data-c="${c.id}"]`).click());await W8(6000);r.left2=ACC.keys[c.id];r.rar=ACC.lastOpen&&ACC.lastOpen.rar;delete window.__SB_ROLL;
  $('#autoRoll').checked=false;$('#autoRoll').onchange({target:$('#autoRoll')});$('#reelClose').click();return r});
 ok('auto-roll opens until out of keys',ar.k0>=3&&ar.left===0,ar);ok('auto-roll stops on Epic+',ar.left2===1&&/epic|legendary/i.test(ar.rar||''),ar);
 // ---------------- leaderboard
 const lb=await ev(async()=>{menuTab('mStats');await new Promise(r=>setTimeout(r,900));const t=$('#lbTbl');const th=t?t.innerText:'';const c=document.querySelector('.lbn[data-i]');if(c)c.dispatchEvent(new MouseEvent('mouseover',{bubbles:true,clientX:300,clientY:300}));if(c)c.dispatchEvent(new MouseEvent('mouseenter',{bubbles:true,clientX:300,clientY:300}));await new Promise(r=>setTimeout(r,500));const card=$('#lbCard');return {crates:/Crates/i.test(th),cell:!!c,card:!!card&&getComputedStyle(card).display!=='none',img:!!(card&&card.querySelector('img,canvas')),txt:card?card.innerText.slice(0,200):''}});
 ok('leaderboard shows crates opened',lb.crates,lb);ok('leaderboard hover card: model + stats',lb.cell&&lb.card&&lb.img&&/K\/?D|Kills|Wins/i.test(lb.txt),lb);
 // ---------------- missions: day boundary (4 AM Pacific, DST safe)
 const md=await ev(()=>{const f=s=>{window.__SB_NOW=Date.parse(s);const d=__missionDay();delete window.__SB_NOW;return d};return [f('2026-10-30T10:59:00Z'),f('2026-10-30T11:00:00Z'),f('2027-01-15T11:59:00Z'),f('2027-01-15T12:00:00Z'),f('2026-11-01T11:30:00Z'),f('2026-11-01T12:00:00Z'),f('2027-03-14T10:59:00Z'),f('2027-03-14T11:00:00Z')]});
 ok('mission day flips at 4:00 AM PDT',md[0]==='2026-10-29'&&md[1]==='2026-10-30',md);ok('mission day flips at 4:00 AM PST',md[2]==='2027-01-14'&&md[3]==='2027-01-15',md);ok('DST change days',md[4]==='2026-10-31'&&md[5]==='2026-11-01'&&md[6]==='2027-03-13'&&md[7]==='2027-03-14',md);
 const pool=await ev(()=>{const t=k=>MISSIONS.filter(m=>m.tier===k).length;return {n:MISSIONS.length,e:t('easy'),m:t('medium'),h:t('hard'),min:Math.min(...MISSIONS.map(m=>m.reward)),max:Math.max(...MISSIONS.map(m=>m.reward)),uniq:new Set(MISSIONS.map(m=>m.id)).size,caps:MISSIONS.every(m=>MISSION_CAPS[m.stat]>0)}});
 ok('mission pool >=50, 3 tiers, $25-$200',pool.n>=50&&pool.e&&pool.m&&pool.h&&pool.min>=25&&pool.max<=200&&pool.uniq===pool.n&&pool.caps,pool);
 // pick missions we can finish in one match: matches / wins / kills
 await ev(async()=>{const pick=t=>{const L=MISSIONS.filter(m=>m.tier===t);return (L.find(m=>m.stat==='matches'&&m.goal===1)||L.find(m=>m.stat==='wins'&&m.goal===1)||L.sort((a,b)=>a.goal-b.goal)[0]).id};window.__SB_MISSIONS=[pick('easy'),pick('medium'),pick('hard')];
  const k=Object.keys(__SBDB.mp||{});for(const x of k)delete __SBDB.mp[x];MISS.rows=null;menuTab('mMissions');await new Promise(r=>setTimeout(r,800))});
 const mt=await ev(()=>{const rows=[...document.querySelectorAll('#missList .ms')];return {n:rows.length,tiers:rows.map(r=>r.querySelector('.tr').textContent),dis:[...document.querySelectorAll('#missList button')].every(b=>b.disabled),reset:/4:00 AM Pacific/.test($('#missList').innerText),tab:!!document.querySelector('.mn[data-m="mMissions"]'),rows:MISS.rows}});
 ok('missions tab: 3 dailies easy/medium/hard',mt.tab&&mt.n===3&&mt.tiers.join()==='easy,medium,hard',mt);ok('missions: claim locked until complete + reset time shown',mt.dis&&mt.reset,mt);
 if(SHOTS){await ev(()=>{const r=MISS.rows;if(r){r[0].progress=r[0].goal;r[1].progress=Math.ceil(r[1].goal/2)}missionsRender()});await sleep(300);await h.screenshot({path:'previews/v8d2-missions.png'});await ev(()=>MISS.load());await sleep(400)}
 // practice vs bots: must not count
 const endMatch=async(online)=>ev(async(online)=>{if(online)G.P.find(p=>p.bot).bot=false;G.rs='live';delete window.__missionSent;
  const me=G.P[ME];handleEvent({t:'round'});for(let i=0;i<3;i++){const v=G.P.find(p=>p.team!==me.team);handleEvent({t:'kf',k:ME,v:v.id,w:'knife',hs:i===0,tk:0})}
  const team=me.team;G.sc[team]=ROUNDS_TO_WIN-1;endRound(team,'test');await new Promise(r=>setTimeout(r,2500));return {sent:window.__missionSent||null,res:window.__missionRes,mode:ACC.lastReport&&ACC.lastReport.p_mode,rows:(await ACC.sb.rpc('my_missions')).data}},online);
 await ev(()=>practice(0));await sleep(3000);
 const pr=await endMatch(false);ok('practice vs bots: no mission progress',pr.mode==='practice'&&!pr.sent&&pr.rows.every(r=>r.progress===0),pr);
 await ev(()=>__api.quitToMenu(''));await sleep(800);await ev(()=>practice(0));await sleep(3000);await ev(()=>{G.practice=false});
 const on=await endMatch(true);
 ok('online match: counters sent (kills/hs/knife/matches/wins)',on.mode==='online'&&on.sent&&on.sent.kills===3&&on.sent.headshots===1&&on.sent.knife_kills===3&&on.sent.matches===1&&on.sent.wins===1&&on.res==='ok',on);
 ok('online match: mission progress advanced',on.rows&&on.rows.some(r=>r.progress>0),on.rows);
 const rep2=await ev(async()=>{const q=await ACC.sb.rpc('mission_report',{p_counters:{matches:1,wins:1,kills:99}});return q.error?String(q.error.message):'accepted'});ok('second report for same match refused',/already/.test(rep2),rep2);
 await ev(()=>__api.quitToMenu(''));await sleep(800);
 const cl=await ev(async()=>{const W8=ms=>new Promise(r=>setTimeout(r,ms));menuTab('mMissions');await MISS.load();const done=MISS.rows.find(r=>r.progress>=r.goal&&!r.claimed);if(!done)return {none:true,rows:MISS.rows};const m0=ACC.profile.money;const sp=Object.values(__SBDB.profiles)[0];const s0=sp.money;
  document.querySelector(`.mclaim[data-slot="${done.slot}"]`).click();await W8(800);const r={reward:done.reward,cli:ACC.profile.money-m0,srv:sp.money-s0,msg:MISS.msg};const q=await ACC.sb.rpc('claim_mission',{p_slot:done.slot});r.again=q.error?String(q.error.message):'paid twice';
  const nd=MISS.rows.find(x=>x.progress<x.goal);if(nd){const q2=await ACC.sb.rpc('claim_mission',{p_slot:nd.slot});r.early=q2.error?String(q2.error.message):'paid early'}return r});
 ok('claim pays reward once (server)',cl.srv===cl.reward&&cl.cli===cl.reward&&/already/.test(cl.again),cl);ok('incomplete mission cannot be claimed',!cl.early||/not complete/.test(cl.early),cl);
 // counters unit
 await ev(()=>practice(0));await sleep(3000);
 const mc=await ev(()=>{MC.reset();G.rs='live';const me=G.P[ME];const en=G.P.filter(p=>p.team!==me.team);en[0].pos=[me.pos[0]+40,me.pos[1],me.pos[2]];en[1].pos=[me.pos[0]+2,me.pos[1],me.pos[2]];
  handleEvent({t:'round'});handleEvent({t:'kf',k:en[0].id,v:ME,w:'kestrel',hs:0,tk:0});handleEvent({t:'kf',k:ME,v:en[0].id,w:Object.keys(W).find(k=>W[k].cls==='Bolt Sniper'),hs:1,tk:0});handleEvent({t:'kf',k:ME,v:en[1].id,w:Object.keys(W).find(k=>/Pump/.test(W[k].cls)),hs:0,tk:0});
  handleEvent({t:'rend',win:me.team});return Object.assign({},MC.c)});
 ok('mission counters: long/close/sniper/shotgun/revenge/doubles',mc.long_kills===1&&mc.close_kills===1&&mc.sniper_kills===1&&mc.shotgun_kills===1&&mc.revenge===1&&mc.doubles===1&&mc.rounds_won===1&&!mc.flawless&&!mc.first_bloods,mc);
 // ---------------- lethal / tactical split
 const ut=await ev(()=>{const me=G.P[ME];equip(me,['kestrel','sparrow','frag','smoke']);me.alive=true;G.rs='live';const r={lth:me.lth,tac:me.tcu,act0:me.uAct,cats:{l:LETHALS.slice(),t:TACTS.length}};
  weaponTick(me,{tactical:true,lethal:false},1/60,true);r.act1=me.uAct;r.util1=me.util;weaponTick(me,{tactical:false,lethal:false},1/60,true);me.cook=-1;
  weaponTick(me,{lethal:true,tactical:false},1/60,true);r.act2=me.uAct;r.util2=me.util;weaponTick(me,{lethal:false,tactical:false},1/60,true);r.lthN=me.lthN;r.cook=me.cook;
  updateHUD(0);const ic=[...document.querySelectorAll('#utilIcons .ui')];r.icons=ic.map(x=>x.dataset.u+':'+x.querySelector('b').textContent+':'+x.querySelector('span').textContent);r.inAmmo=!!document.querySelector('#ammo #utilIcons');
  r.kb=['util','tactical','ping'].map(a=>kc(a));r.lethalOnly=['frag','sticky','knife','mine'].every(k=>LETHALS.includes(k))&&!LETHALS.includes('smoke');r.nl=newLoadout().length;return r});
 ok('loadout has lethal + tactical',ut.lth==='frag'&&ut.tac==='smoke'&&ut.nl===4,ut);ok('lethal = frag/burr/knife/snare only',ut.lethalOnly&&ut.cats.t>4,ut);
 ok('Q selects tactical, G selects lethal',ut.act1==='t'&&ut.util1==='smoke'&&ut.act2==='l'&&ut.util2==='frag',ut);ok('default keys G / Q / Z',ut.kb.join()==='KeyG,KeyQ,KeyZ',ut.kb);
 ok('HUD icons in ammo panel with counts + keys',ut.inAmmo&&ut.icons.length===2&&/^frag:\d+:G$/.test(ut.icons[0])&&/^smoke:\d+:Q$/.test(ut.icons[1]),ut.icons);
 const rb=await ev(()=>{const o=KBM.tactical;KBM.tactical='KeyV';const a=down('tactical');K['KeyV']=true;const b=down('tactical');K['KeyV']=false;KBM.tactical=o;return {a,b}}).catch(e=>({err:e.message}));ok('tactical rebindable',rb.b===true&&rb.a===false,rb);
 const vc=await ev(()=>{const h=voteCard(['kestrel','sparrow','frag','smoke'],0);return /LETHAL/.test(h)&&/TACTICAL/.test(h)&&h.includes(UT.smoke.n)});ok('vote card shows both utilities',vc);
 const bt=await ev(()=>{const b=G.P.find(p=>p.bot);equip(b,['kestrel','sparrow','frag','smoke']);b.alive=true;let bad=0;for(let i=0;i<600;i++){const inp=botThink(b,1/60);weaponTick(b,inp,1/60,true);if(b.util&&!UT[b.util])bad++}return {bad,u:b.util}});ok('bots handle two utility slots',bt.bad===0,bt);
 // ---------------- mantle
 const mn=await ev(async()=>{const W8=ms=>new Promise(r=>setTimeout(r,ms));window.__mantleTipProbe=()=>({h:1});G.P[ME].alive=true;G.P[ME].mant=null;await W8(350);const el=$('#mantleTip');const r={on:!!el&&el.style.display!=='none',txt:el&&el.textContent};delete window.__mantleTipProbe;await W8(350);r.off=getComputedStyle($('#mantleTip')).display==='none'||!window.__mantleTip;
  r.botOnly=/\(p\.bot\|\|inp\.autoMantle\)&&inp\.f>0&&!p\.ground/.test([...document.scripts].map(s=>s.textContent).join(''));return r});
 ok('mantle prompt "[Space] Mantle" when a ledge is ahead',mn.on&&/\[Space\] Mantle/.test(mn.txt)&&mn.off,mn);ok('passive auto-mantle is bot-only',mn.botOnly,mn);
 // ---------------- pings
 const pg=await ev(async()=>{const W8=ms=>new Promise(r=>setTimeout(r,ms));const me=G.P[ME];G.rs='live';me.alive=true;PING.list.length=0;window.__voxPlayed=[];VOX.played=[];VOX.last=0;PING.lastT=0;const en=G.P.find(p=>p.team!==me.team);en.alive=true;
  const d=dirYP(me.yaw,me.pitch);en.pos=[me.pos[0]+d[0]*10,me.pos[1],me.pos[2]+d[2]*10];const ol=los;los=()=>true;me.pitch=Math.atan2(1.1-(pH(me)-.15),10);pingPress();los=ol;await W8(150);
  const r={first:PING.list[0]&&PING.list[0].k,red:!!document.querySelector('.png.e'),vox:(window.__voxPlayed||[]).slice()};
  en.pos=[me.pos[0]-d[0]*10,me.pos[1],me.pos[2]-d[2]*10];VOX.last=0;PING.lastT=0;K['Mouse1']=true;await W8(120);K['Mouse1']=false;await W8(150);r.second=PING.list.length&&PING.list[PING.list.length-1].k;/* v8.1 F: one active ping per player, the new one replaces the old */r.blue=!!document.querySelector('.png.l');r.vox2=(window.__voxPlayed||[]).slice();
  const n0=EV.length;const ev0=G.P.filter(p=>p.team===me.team).length;for(let i=0;i<6;i++)hostPing(ME,{k:'l',pos:[0,1,0]});r.rate=EV.filter(e=>e.t==='ping').length;
  const got=[];const fake=(slot)=>({open:true,slot,send:m=>got.push([slot,m])});const mate=G.P.find(p=>p.team===me.team&&p.id!==ME);
  netSend(fake(en.id),{t:'snap',ev:[{t:'ping',team:me.team,k:'l',pos:[0,0,0]},{t:'round'}]});netSend(fake(mate.id),{t:'snap',ev:[{t:'ping',team:me.team,k:'l',pos:[0,0,0]},{t:'round'}]});
  r.enemyGot=got.find(g=>g[0]===en.id)[1].ev.filter(e=>e.t==='ping').length;r.mateGot=got.find(g=>g[0]===mate.id)[1].ev.filter(e=>e.t==='ping').length;
  const before=PING.list.length;handleEvent({t:'ping',team:1-me.team,from:en.id,k:'l',tg:-1,pos:[0,0,0]});r.otherTeamShown=PING.list.length>before;r.clips=Object.keys(VOICE_CLIPS);return r});
 ok('ping on enemy = red enemy ping',pg.first==='e'&&pg.red,pg);ok('middle mouse ping on location = blue',pg.second==='l'&&pg.blue,pg);ok('radio voice lines play (enemy + location)',pg.vox.some(x=>/^enemy/.test(x))&&pg.vox2.some(x=>/^loc/.test(x))&&pg.clips.length===6,pg);
 ok('host rate-limits pings (burst 3)',pg.rate<=3+2,pg.rate);ok('pings are team-only on the wire',pg.enemyGot===0&&pg.mateGot===1,pg);ok('other team pings never shown',!pg.otherTeamShown,pg);
 if(SHOTS){await ev(()=>{__api.quitToMenu('');practice(0)});await sleep(6000);await ev(()=>{const me=G.P[ME];G.rs='live';G.rt=60;me.hp=100;G.P.forEach(p=>{p.alive=true;p.hp=100});try{banner('',.01)}catch(e){}me.alive=true;equip(me,['kestrel','sparrow','sticky','flash']);const d=dirYP(me.yaw,0);PING.list=[{k:'e',tg:-1,pos:[me.pos[0]+d[0]*14+d[2]*3,me.pos[1]+1.8,me.pos[2]+d[2]*14-d[0]*3],t:performance.now(),life:60000},{k:'l',tg:-1,pos:[me.pos[0]+d[0]*22-d[2]*6,me.pos[1]+.5,me.pos[2]+d[2]*22+d[0]*6],t:performance.now(),life:60000}];window.__shotHold=1});await sleep(900);await h.screenshot({path:'previews/v8d2-hud-pings.png'})}
 await ev(()=>__api.quitToMenu(''));await sleep(800);
 // ---------------- party
 const pt=await ev(async()=>{const sb=ACC.sb;const T=['s1','pa','s2','pb'];for(const t of T)await sb.rpc('mm_join',{p_ticket:t,p_name:t});await sb.rpc('mm_party',{p_ticket:'pa',p_party:'DUO42'});await sb.rpc('mm_party',{p_ticket:'pb',p_party:'DUO42'});
  const bad=await sb.rpc('mm_party',{p_ticket:'s1',p_party:'bad code!'});let res={};for(let i=0;i<40;i++){for(const t of T){const q=await sb.rpc('mm_poll',{p_ticket:t});if(q.data)res[t]=q.data}if(T.every(t=>res[t]&&res[t].status==='matched'))break;await new Promise(r=>setTimeout(r,300))}
  const tm=t=>res[t]&&res[t].team_slot!=null?(res[t].team_slot<2?0:1):null;return {pa:tm('pa'),pb:tm('pb'),s1:tm('s1'),s2:tm('s2'),bad:!!bad.error,st:T.map(t=>res[t]&&res[t].status)}});
 ok('quick play: party of 2 lands on the same team',pt.pa!==null&&pt.pa===pt.pb&&pt.s1!==pt.pa&&pt.s2!==pt.pa,pt);ok('party code validated',pt.bad,pt);
 const lob=await ev(async()=>{partySet('');const W8=ms=>new Promise(r=>setTimeout(r,ms));hostOnline();for(let i=0;i<30&&!LOBBY;i++)await W8(200);if(!LOBBY)return {nolobby:true};
  const fc=n=>({open:true,send(){},close(){},peer:n,link:'Test'});partySet('PALS1');const a=fc('a'),b=fc('b'),c=fc('c');
  hostMsg(a,{t:'hello',name:'Solo',party:''});hostMsg(b,{t:'hello',name:'Other',party:'ZZZZ9'});hostMsg(c,{t:'hello',name:'Mate',party:'PALS1'});const host=LOBBY.slots.findIndex(s=>s&&s.human&&!s.conn);
  const r={host,solo:a.slot,other:b.slot,mate:c.slot,hostTeam:host<2?0:1,mateTeam:c.slot<2?0:1,ui:!!$('#partyCode')};partySet('');return r});
 ok('hosted lobby: party mate placed on host team',lob.ui&&lob.mate!==undefined&&lob.hostTeam===lob.mateTeam,lob);
 await ev(()=>__api.quitToMenu(''));await sleep(500);
 const E=errs.filter(e=>!/favicon|ERR_|net::|WebGL|GPU stall|AudioContext/i.test(e));ok('no page errors',E.length===0,E.slice(0,6));
 console.log(R.join('\n'));console.log(`v8d2: ${pass} passed, ${fail} failed`);await br.close();process.exit(fail?1:0)})().catch(e=>{console.error(e);process.exit(2)});
