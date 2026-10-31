require('./testguard');const puppeteer=require('puppeteer-core');const fs=require('fs');const sleep=ms=>new Promise(r=>setTimeout(r,ms));const MOCK=fs.readFileSync(__dirname+'/mock-supabase.js','utf8');
async function page(br,mode){const pg=await br.newPage();await pg.setViewport({width:1280,height:760});const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error'&&!/favicon/.test(m.text()))errs.push(m.text())});
 await pg.setRequestInterception(true);pg.on('request',r=>{if(r.url().includes('supabase-js'))r.respond({status:200,contentType:'application/javascript',body:mode==='cdnfail'?'':MOCK});else r.continue()});
 await pg.evaluateOnNewDocument(m=>{if(!sessionStorage.getItem('__init')){sessionStorage.setItem('__init',1);for(const k of ['__sbmode','__sbdb','__sbses','twofold'])localStorage.removeItem(k)}if(m==='nosetup')localStorage.setItem('__sbmode','nosetup');window.__SB_NORL=1},mode);pg.errs=errs;return pg}
(async()=>{const br=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-angle=swiftshader','--autoplay-policy=no-user-gesture-required']});const R={};
 // 1) server not set up + CDN failure fallbacks
 for(const mode of ['nosetup','cdnfail']){const pg=await page(br,mode);await pg.goto('http://localhost:8765/index.html?q=low');await sleep(2500);R[mode]=await pg.evaluate(()=>({st:ACC.status,panel:document.querySelector('#accPanel').innerText.replace(/\n/g,' | ')}));
  await pg.evaluate(()=>menuTab('mCrates'));R[mode].crates=await pg.evaluate(()=>document.querySelector('#crateGrid').innerText.slice(-80));R[mode].errs=pg.errs.slice();await pg.close()}
 // 2) full flow
 const pg=await page(br,'ok');await pg.goto('http://localhost:8765/index.html?q=low');await sleep(3000);const ev=(f,a)=>pg.evaluate(f,a);
 await pg.mouse.click(5,5);await sleep(600);R.music=await ev(()=>({scene:MUS.scene,on:MUS.on,ctx:AC&&AC.state}));
 await pg.screenshot({path:'progress/v6-mainmenu.png'});
 await ev(()=>menuTab('mAcc'));await ev(()=>document.querySelector('#accMUp').click());R.signupFields=await ev(()=>[...document.querySelectorAll('#accBody input')].map(i=>i.id));await pg.type('#accU','TylerC');await pg.type('#accP','hunter22');await pg.screenshot({path:'progress/v6-signup.png'});console.log('VALS',await ev(()=>[...document.querySelectorAll('#accBody input')].map(i=>i.id+'='+i.value)));await ev(()=>document.querySelector('#accGo').click());await sleep(800);
 R.signup=await ev(()=>({msg:ACC.msg,calls:window.__SBCALLS,mode:accPage.mode,ok:ACC.ok(),p:ACC.profile&&{u:ACC.profile.username,m:ACC.profile.money},panel:document.querySelector('#accPanel').innerText.replace(/\n/g,' | '),client:window.__SBCLIENT}));
 // caps: absurd report is clamped server-side
 R.capped=await ev(async()=>{const r=await ACC.sb.rpc('report_match',{p_result:'win',p_kills:999,p_deaths:-5,p_headshots:999,p_map:'Test',p_mode:'tdm',p_team_score:6,p_enemy_score:2,p_damage:999999,p_guns:[{gun:'kestrel',kills:999,headshots:999,shots:10,hits:500,damage:99999},{gun:'DROP TABLE',kills:1}]});if(r.error)return {E:r.error,acc:ACC.status,u:ACC.user,msg:ACC.msg};await ACC.load();return {money:r.data.money,kills:r.data.kills,hist:ACC.history[0],guns:ACC.guns}});
 // real client pipeline: practice match, synthetic hit/kill events through MSTAT, then match over -> report_match with per-gun array
 await ev(()=>practice(2));await sleep(2500);
 R.match=await ev(async()=>{const G=__api.G,me=G.P[__api.ME],foe=G.P.find(p=>p.team!==me.team);for(let i=0;i<30;i++)MSTAT_shot('kestrel');for(let i=0;i<9;i++)MSTAT_shot('sparrow');for(let i=0;i<12;i++)MSTAT_ev({t:'dmg',a:__api.ME,v:foe.id,w:'kestrel',amt:25});MSTAT_ev({t:'dmg',a:__api.ME,v:foe.id,w:'sparrow',amt:40});
  MSTAT_ev({t:'kf',k:__api.ME,v:foe.id,w:'kestrel',hs:true});MSTAT_ev({t:'kf',k:__api.ME,v:foe.id,w:'kestrel',hs:false});me.k=2;me.d=1;G.sc=[6,4];await ACC.matchOver(true);return {args:ACC.lastReport,money:ACC.profile.money,hist:ACC.history.length,top:ACC.history[0]}});
 await ev(()=>__api.quitToMenu(''));await sleep(800);R.musicAfterQuit=await ev(()=>MUS.scene);
 // earn enough money for several keys
 await ev(async()=>{for(let i=0;i<12;i++)await ACC.sb.rpc('report_match',{p_result:'win',p_kills:20,p_deaths:5,p_headshots:12,p_map:['Dockyard','Sunspire Roof','Hoshikawa Temple'][i%3],p_mode:'practice',p_team_score:6,p_enemy_score:i%5,p_damage:2600,p_guns:[{gun:['wasp','strix','hornet','maul'][i%4],kills:12,headshots:6,shots:200,hits:70,damage:1500},{gun:'sparrow',kills:8,headshots:6,shots:40,hits:20,damage:900}]});await ACC.load()});
 R.money=await ev(()=>ACC.profile.money);
 await ev(()=>menuTab('mCrates'));await sleep(600);
 for(const c of ['ember','ember','tide','tide','circuit','circuit','ember']){await ev(c=>document.querySelector(`.cbuy[data-c="${c}"]`).click(),c);await sleep(150)}
 R.keys=await ev(()=>Object.assign({},ACC.keys));await pg.screenshot({path:'progress/v6-crates.png'});
 // open several directly (server roll forced across rarities), then one through the reel UI
 R.opened=await ev(async()=>{const o=[];const rolls=[[ 'ember',.999],['tide',.97],['circuit',.92],['ember',.5],['tide',.1],['circuit',.75]];for(const [c,r] of rolls){window.__SB_ROLL=r;const x=await ACC.openCrate(c);o.push(x.skin||x.error)}delete window.__SB_ROLL;ACC.emit();return o});
 R.noKey=await ev(async()=>(await ACC.openCrate('tide')).error);
 await ev(()=>{window.__SB_ROLL=.995;document.querySelector('.copen[data-c="ember"]').click()});await sleep(2600);await pg.screenshot({path:'progress/v6-crate-open.png'});await sleep(3300);await pg.screenshot({path:'progress/crate-result.png'});R.reel=await ev(()=>({last:window.__lastOpen,res:document.querySelector('#reelRes').innerText.replace(/\n/g,' | ')}));
 await ev(()=>{delete window.__SB_ROLL;document.querySelector('#reelClose').click()});
 // equip 4+ via the Loadout tab
 await ev(()=>menuTab('mLoad'));await sleep(400);
 const owned=await ev(()=>Object.keys(ACC.owned));for(const id of owned){await ev(id=>document.querySelector(`.scard[data-s="${id}"]`).click(),id);await sleep(250)}
 R.equipped=await ev(()=>Object.assign({},ACC.equipped));R.lockedClick=await ev(async()=>{const s=SKINS.find(s=>!ACC.owned[s.id]);return (await ACC.equip(s.gun,s.id)).error});
 await ev(()=>{SKF='owned';skinsPage();PREVIEW='em_caldera'});await sleep(1200);await pg.screenshot({path:'progress/v6-skins.png'});
 // stats + sort
 await ev(()=>menuTab('mStats'));await sleep(500);await ev(()=>document.querySelector('#gunTbl th[data-k="accuracy"]').click());R.sort=await ev(()=>[...document.querySelectorAll('#gunTbl tr')].slice(1).map(r=>r.cells[0].innerText+':'+r.cells[3].innerText));
 R.histRows=await ev(()=>document.querySelectorAll('#statsBody table')[0].rows.length-1);await pg.screenshot({path:'progress/v6-stats.png'});
 // settings sync: music slider -> account
 await ev(()=>menuTab('mSet'));await ev(()=>{const e=document.querySelector('#mSet .musVol');e.value=.25;e.oninput()});await sleep(1700);R.synced=await ev(()=>window.__SBDB.profiles[ACC.user.id].settings.musVol);
 await ev(()=>menuTab('mAcc'));await sleep(300);R.recovery=await ev(async()=>{const r=await ACC.addRecovery('tyler.recovery@example.com');return {r,msg:ACC.msg,stored:window.__SBDB.recovery&&Object.values(window.__SBDB.recovery)}});R.synthHidden=await ev(()=>{const h=document.body.innerHTML,i=h.indexOf('twofold.invalid');return i<0?true:h.slice(Math.max(0,i-300),i+20)});R.synthVisibleText=await ev(()=>document.body.innerText.includes('twofold.invalid'));R.authEmail=await ev(()=>ACC.user.email);await pg.screenshot({path:'progress/v6-account.png'});
 R.mvpPay=await ev(async()=>{const m0=ACC.profile.money;const a=await ACC.sb.rpc('report_match',{p_result:'win',p_kills:30,p_deaths:1,p_headshots:20,p_mvp:true});const b=await ACC.sb.rpc('report_match',{p_result:'loss',p_kills:2,p_deaths:5,p_headshots:1,p_mvp:false});return [a.data.money-m0,b.data.money-a.data.money]});
 // sign out, wipe local music setting, sign back in -> restored from account
 await ev(()=>ACC.signOut());await ev(()=>{settings.musVol=.9;localStorage.setItem('twofold',JSON.stringify(settings))});R.afterOut=await ev(()=>({ok:ACC.ok(),eq:Object.keys(ACC.equipped).length}));
 R.badLogin=await ev(async()=>(await ACC.signIn('TylerC','wrong')).error);R.taken=await ev(async()=>(await ACC.signUp('tylerc','whatever1')).error);R.forgot=await ev(async()=>{accPage.mode='in';accPage();document.querySelector('#accForgot').click();const f=[...document.querySelectorAll('#accBody input')].map(i=>i.id);const r=await ACC.forgot('TylerC','me@example.com');return {fields:f,r,msg:ACC.msg,call:__SBCALLS.filter(c=>/resetPw/.test(c))}});R.relog=await ev(async()=>{await ACC.signIn('tylerc','hunter22');return {ok:ACC.ok(),mus:settings.musVol,eq:Object.keys(ACC.equipped).length}});
 // in-game skin on viewmodel + third person + HUD icon
 const eqGun=Object.keys(R.equipped)[0];await ev(g=>{practice(0);const G=__api.G;},eqGun);await sleep(2000);
 R.ingame=await ev(g=>{const G=__api.G,me=G.P[__api.ME];if(g&&__api.W&&__api.W[g]||g&&typeof W!=='undefined'&&W[g])me.inv[0].w=g;me.cur=0;return true},eqGun);await sleep(1500);
 R.ingame=await ev(()=>{const g=vm&&vm.userData.gun;const me=__api.G.P[__api.ME];const bots=pMeshes.map((m,i)=>i===__api.ME?null:(m.userData.gunHolder.children[0]||{userData:{}}).userData.skin||'');return {vmSkin:g&&(g.userData.skin||(g.children[0]&&g.children[0].userData.skin)),want:equippedSkin(me.inv[0].w),skinOf:skinOf(me),bots,hudImg:(document.querySelector('.ws.on img')||{}).src&&document.querySelector('.ws.on img').src.length}});
 await pg.screenshot({path:'progress/skin-ingame.png'});
 R.errs=pg.errs;console.log(JSON.stringify(R,null,1));await br.close()})().catch(e=>{console.log('FAIL',e);process.exit(1)});
