require('./testguard');const {launch,open,sleep}=require('./b3lib');(async()=>{const br=await launch();const errs=[],R={};const p=await open(br,errs);
await p.evaluate(()=>{__api.practice(1)});await sleep(3000);
// ragdoll: kill a pinned bot with a body shot from the side
await p.evaluate(()=>{G.rs='live';G.rt=999;const me=G.P[ME];const sp=me.pos.slice();window.__base=sp;const v=G.P.find(x=>x.id!==ME&&x.team!==me.team);window.__vid=v.id;window.__pin=[{i:v.id,pos:[sp[0],sp[1],sp[2]-5],yaw:Math.PI}];window.__cam={p:[sp[0]+4,sp[1]+2.2,sp[2]-2],l:[sp[0],sp[1]+.6,sp[2]-5.5],fov:60}});await sleep(800);
await p.evaluate(()=>{const v=G.P[window.__vid];window.__pin=[];__api.damage(v.id,ME,500,'kestrel',false,G.P[ME].pos,'chest')});
await sleep(250);await p.screenshot({path:'progress/v7-ragdoll-0.png'});R.r0=await p.evaluate(()=>window.__rags());
await sleep(1000);await p.screenshot({path:'progress/v7-ragdoll-1.png'});R.r1=await p.evaluate(()=>window.__rags());
await sleep(4000);R.r5=await p.evaluate(()=>window.__rags());
// emote: wheel + third-person
await p.evaluate(()=>{window.__cam=null;locked=true;K[kc('emote')]=true});await sleep(700);R.wheel=await p.evaluate(()=>{const e=document.querySelector('#emoWheel');return e&&getComputedStyle(e).display});await p.screenshot({path:'progress/v7-emote-wheel.png'});
await p.evaluate(()=>{K[kc('emote')]=false});await sleep(200);
R.play=await p.evaluate(()=>{G.P[ME].emo=null;return emoPlay('emo_wave')});await sleep(900);R.cam=await p.evaluate(()=>window.__emoCam);await p.screenshot({path:'progress/v7-emote-3p.png'});
R.lockedEmote=await p.evaluate(()=>emoPlay('emo_flex'));
// gemini no-ADS
R.gem=await p.evaluate(()=>{const me=G.P[ME];me.inv[0]={w:'gemini',mag:30,res:90};me.cur=0;me.emo=null;return W.gemini?{noAds:W.gemini.noAds}:null});
await p.evaluate(()=>{window.__forceADS=1});await sleep(800);R.gemAds=await p.evaluate(()=>({ads:G.P[ME].ads,amt:G.P[ME].adsAmt,fov:camera.fov}));await p.screenshot({path:'progress/v7-gemini-noads.png'});await p.evaluate(()=>{window.__forceADS=0});
// menu pan
await p.evaluate(()=>__api.quitToMenu());const seen=[];for(let k=0;k<4;k++){await sleep(k?15500:2500);const m=await p.evaluate(()=>window.__mpan&&window.__mpan.n);seen.push(m);await p.screenshot({path:`progress/v7-menu-pan-${k}.png`})}R.pan=seen;
console.log(JSON.stringify(R));console.log('ERRS',JSON.stringify(errs));await br.close()})();
