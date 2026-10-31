// V8 drop 3a suite: Velvet Ace casino map (rules + 6 slot machines on E), new melee model, character-matched hands. Local only; testguard blocks *.supabase.co.
require('./testguard');const {launch,open,sleep}=require('./b3lib');const fs=require('fs');const SHOTS=process.env.SHOTS;
(async()=>{const br=await launch();const errs=[];let pass=0,fail=0;const R=[];
 const ok=(n,v,info)=>{if(v){pass++;R.push('PASS '+n)}else{fail++;R.push('FAIL '+n+' '+JSON.stringify(info===undefined?'':info).slice(0,500))}};
 const h=await open(br,errs,'?fakenet');await sleep(2000);const ev=(f,a)=>h.evaluate(f,a);
 ok('label V8 DROP 3a',await ev(()=>/v8\.1/.test(document.querySelector('.ptitle').textContent)));
 const mi=await ev(()=>MAPS.findIndex(m=>m.n==='Velvet Ace'));ok('Velvet Ace in MAPS',mi>=0,mi);
 const v=await ev(i=>{const m=MAPS[i];const e=validateMaps().filter(x=>/Velvet Ace/.test(x));const sd=SDMAPS[i];return {e,era:m.era,lanes:m.lanes.length,laneOk:m.laneOk,leaks:m.leaks,elev:m.elevLeaks,elevNodes:m.elevNodes,elevMax:m.elevMax,exits:m.exits,cross:m.cross,flags:m.flags,flagOk:m.flagOk,sdFlagOk:sd.flagOk,slots:m.slots.length*2}},mi);
 ok('validator: no Velvet Ace errors (incl. sudden death)',v.e.length===0,v.e);ok('era 1931 mobster',/1931/.test(v.era),v.era);
 ok('3 lanes, all spawn-to-spawn',v.lanes===3&&v.laneOk.every(Boolean),v.laneOk);ok('walled spawns: 0 spawn sight lines, 2-3 exits',v.leaks===0&&v.exits>=2&&v.exits<=3,v);
 ok('verticality: elevated nodes >= 1m and no elevated spawn peeks',v.elevNodes>20&&v.elevMax>=2&&v.elev===0,v);ok('3 flag spawns (main + SD)',v.flagOk&&v.flags.length===3&&v.sdFlagOk,v.flags);ok('6 slot machines declared',v.slots===6,v.slots);
 ok('map vote pool includes it',await ev(i=>{G={mapIdx:0};let seen=false;for(let k=0;k<300&&!seen;k++)seen=mapVoteOptions().includes(i);G=null;return seen},mi));
 ok('lobby map list includes it',await ev(()=>/Velvet Ace/.test(MAPS.map(m=>m.n+' - '+m.era).join('|'))));
 ok('menu pan visits it',await ev(async i=>{if(typeof mpanBuild!=='function')return false;mpanBuild(i);return !!mapGroup&&mapGroup.children.length>10},mi));
 // random time of day: rollTod can produce all four for this map
 ok('random time of day',await ev(i=>{const s=new Set();for(let k=0;k<400;k++)s.add(rollTod(i));return s.size===4},mi));
 // practice on Velvet Ace: spawn clearance, slot dressing, E interaction with win/lose cues
 await ev(i=>practice(i),mi);await sleep(4500);
 const sc=await ev(()=>({sp:__spawnClear(),n:G.mapDef.n,slots:__slots.list.length,tod:G.tod}));ok('practice loads Velvet Ace',sc.n==='Velvet Ace',sc);ok('spawn check: no props in spawn rooms',sc.sp.length===0,sc.sp);ok('6 slot machines built',sc.slots===6,sc.slots);
 const pull=await ev(async()=>{const me=G.P[ME];const s=__slots.list[0];window.__pin=[{i:ME,pos:[s.front[0],0,s.front[1]],yaw:me.yaw}];await new Promise(r=>setTimeout(r,500));const near=__slots.near;const hint=$('#slotHint')&&$('#slotHint').style.display==='block'&&/Pull the lever/.test($('#slotHint').textContent);
  const money=(typeof ACC!=='undefined'&&ACC.profile)?ACC.profile.money:null;dispatchEvent(new KeyboardEvent('keydown',{code:kc('takeover')}));await new Promise(r=>setTimeout(r,150));const spinning=__slots.list[near].spin>0;
  await new Promise(r=>setTimeout(r,2200));const log1=(window.__slotLog||[]).slice();window.__pin=[];
  // forced win + forced lose on two other machines to check both cues
  __slots.pull(1,true);__slots.pull(2,false);await new Promise(r=>setTimeout(r,1900));const sl=SLOTS.list;
  return {near,hint,spinning,log1,log:window.__slotLog.slice(),winLbl:!!sl[1].lbl,loseLbl:!!sl[2].lbl,winEm:sl[1].light.intensity,loseEm:sl[2].light.intensity,winRes:sl[1].res,loseRes:sl[2].res,money0:money,money1:(typeof ACC!=='undefined'&&ACC.profile)?ACC.profile.money:null}});
 ok('E prompt shown at a slot',pull.near>=0&&pull.hint,pull);ok('E pulls the lever (reels spin)',pull.spinning,pull);ok('result resolved after spin',pull.log1.length===1,pull.log1);
 ok('win cue: matching reels + WINNER label + light',pull.winLbl&&pull.winRes[0]===pull.winRes[1]&&pull.winRes[1]===pull.winRes[2]&&pull.winEm>0,pull);
 ok('lose cue: BUST label + red flash, non-matching reels',pull.loseLbl&&!(pull.loseRes[0]===pull.loseRes[1]&&pull.loseRes[1]===pull.loseRes[2])&&pull.loseEm>0,pull);
 ok('no money involved',pull.money0===pull.money1,pull);
 ok('slot audio functions present',await ev(()=>{try{slotSound('win');slotSound('lose');slotSound('pull');return true}catch(e){return false}}));
 if(SHOTS){await ev(()=>{window.__cam={p:[22,12,-18],l:[0,0,4],fov:70};const m=G.mapDef;for(const p of pMeshes)if(p)p.visible=false;if(vm)vm.visible=false});await sleep(800);await h.screenshot({path:'shots/v8d3a-casino-overview.png'});await ev(()=>{window.__cam=null})}
 // melee model + hands per character
 const mel=await ev(async()=>{MELSEL=true;await new Promise(r=>setTimeout(r,600));const k=vm&&vm.userData.knife;const r={vis:!!k&&k.visible,new3a:!!k&&k.children.some(c=>c.userData.melee3a),km:!!knifeMesh().userData.melee3a,info:window.__vmInfo};MELSEL=false;return r});
 ok('new melee model in first person',mel.new3a&&mel.vis,mel);ok('new melee model for world/thrown knives',mel.km,mel);
 const hands=await ev(async()=>{const out={};for(const c of ['op','ch_nomad','ch_atlas','ch_wisp']){ACC.equipped=ACC.equipped||{};ACC.equipped._char=c;ACC.owned=ACC.owned||{};ACC.owned[c]=1;await new Promise(r=>setTimeout(r,350));
   const hs=vm.children.filter(x=>x.userData&&x.userData.cid);out[c]={cid:hs.map(x=>x.userData.cid),n:hs.length,knife:vm.userData.knife.children.filter(x=>x.userData&&x.userData.cid).map(x=>x.userData.cid)}}return out});
 ok('hands follow equipped character',Object.entries(hands).every(([c,o])=>o.n>=2&&o.cid.every(x=>x===c)&&o.knife[0]===c),hands);
 if(SHOTS){await ev(async()=>{ACC.equipped._char='ch_atlas';const s=__slots.list[0];window.__pin=[{i:ME,pos:[s.front[0],0,s.front[1]],yaw:Math.atan2(-(s.pos[0]-s.front[0]),-(s.pos[1]-s.front[1])),pitch:-.15}];MELSEL=true;await new Promise(r=>setTimeout(r,500));__slots.pull(0,true);await new Promise(r=>setTimeout(r,1700))});
  await h.screenshot({path:'shots/v8d3a-slot-win-melee-hands.png'});await ev(()=>{window.__pin=[];MELSEL=false})}
 await ev(()=>__api.quitToMenu(''));await sleep(500);
 const E=errs.filter(e=>!/favicon|ERR_|net::|WebGL|GPU stall|AudioContext/i.test(e));ok('no page errors',E.length===0,E.slice(0,6));
 console.log(R.join('\n'));console.log(`v8d3a: ${pass} passed, ${fail} failed`);await br.close();process.exit(fail?1:0)})().catch(e=>{console.error(e);process.exit(2)});
