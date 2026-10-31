require('./testguard');// Batch 2 visual + behaviour checks; screenshots into progress/v7-*.png
const puppeteer=require('puppeteer-core');const fs=require('fs');const sleep=ms=>new Promise(r=>setTimeout(r,ms));const MOCK=fs.readFileSync(__dirname+'/mock-supabase.js','utf8');
const ONLY=process.argv[2]||'';
(async()=>{const br=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',protocolTimeout:180000,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-renderer-backgrounding','--disable-background-timer-throttling','--disable-backgrounding-occluded-windows']});
const errs=[];const R={};
async function open(url,mock){const p=await br.newPage();await p.setViewport({width:1280,height:720});p.on('pageerror',e=>errs.push(url.slice(-30)+': '+e.message));
 if(mock){await p.setRequestInterception(true);p.on('request',r=>{if(r.url().includes('supabase-js'))r.respond({status:200,contentType:'application/javascript',body:MOCK});else r.continue()})}
 await p.goto('http://localhost:8765/index.html'+url);await sleep(4500);return p}
const freeze=p=>p.evaluate(()=>{const G=__api.G;G.rs='live';G.rt=999;window.__frz=setInterval(()=>{const G=__api.G;if(!G)return;G.rt=999;for(const q of G.P)if(q.__fix){q.pos=q.__fix.slice();q.yaw=q.__yaw||0;q.vel=[0,0,0]}},16);document.querySelectorAll('.hint,#clickHint').forEach(e=>e.style.display='none')});
const run=async(name,f)=>{if(ONLY&&!ONLY.split(',').includes(name))return;try{R[name]=await f()}catch(e){R[name]='ERR '+e.message}};
// ---------- gameplay visuals (practice)
await run('vis',async()=>{const out={};
 // Gemini third-person + sights gallery + utilities gallery on Dockyard
 let p=await open('?q=medium&practice&tod=day&map=0');await freeze(p);
 out.gemini=await p.evaluate(()=>{const G=__api.G,me=G.P[__api.ME];const b0=me.pos.slice();const dl=Math.hypot(b0[0],b0[2])||1;const dir=[-b0[0]/dl,-b0[2]/dl];window.__B={b0,dir};me.__fix=b0;me.__yaw=Math.atan2(-dir[0],-dir[1]);me.yaw=me.__yaw;me.pitch=-.1;window.__hideVM=1;
  const bots=G.P.filter(q=>q.id!==me.id);bots.forEach((b,i)=>{b.__fix=i===0?[b0[0]+dir[0]*2.4,b0[1],b0[2]+dir[1]*2.4]:[60,-60,60];b.__yaw=me.__yaw+Math.PI*.8;b.hp=9999;b.alive=true});__api.equip(bots[0],['kestrel','gemini','frag']);bots[0].cur=1;bots[0].bot=false;return b0});
 await sleep(1500);await p.screenshot({path:'progress/v7-gemini-two-hands.png'});
 out.geminiHands=await p.evaluate(()=>{const b=__api.G.P.find(q=>q.id!==__api.ME);const m=pMeshes[b.id];const gh=m.userData.gunHolder;const g=gh.children.find(c=>c.userData.dual);if(!g)return 'no dual';m.updateMatrixWorld(true);const v=new THREE.Vector3();
  const hands=m.userData.arms.map(A=>{A.el.updateMatrixWorld(true);return A.el.localToWorld(new THREE.Vector3(0,-.31,0))});const guns=g.userData.dual.map(x=>x.localToWorld(new THREE.Vector3(0,-.06,-.05)));
  return hands.map((h,i)=>Math.min(...guns.map(q=>q.distanceTo(h))).toFixed(2))});
 // galleries rendered with each gun's own mesh
 out.gallery=await p.evaluate(()=>{__api.makeIcons();const I=__api.ICON;const d=document.createElement('div');d.id='gal';d.style.cssText='position:fixed;inset:0;z-index:999;background:#223;display:flex;flex-wrap:wrap;gap:4px;padding:8px;overflow:hidden';
  const ids=Object.keys(__api.W).filter(k=>__api.W[k].vm&&(__api.W[k].vm.scope||__api.W[k].vm.optic||__api.W[k].holo||1));for(const k of ids){const s=I[k];if(!s)continue;d.insertAdjacentHTML('beforeend',`<div style="width:150px;color:#ccd;font:11px sans-serif;text-align:center"><img src="${s}" style="width:150px;height:75px;object-fit:contain;background:#334">${__api.W[k].n}<br><i>${__api.W[k].sight}</i></div>`)}document.body.appendChild(d);return ids.length});
 await sleep(800);await p.screenshot({path:'progress/v7-sights-attached.png'});
 out.utilGallery=await p.evaluate(()=>{const I=__api.ICON;const d=document.querySelector('#gal');d.innerHTML='';for(const k of [...Object.keys(__api.UT),'kestrel','sparrow','wren']){const s=I[k];d.insertAdjacentHTML('beforeend',`<div style="width:180px;color:#ccd;font:12px sans-serif;text-align:center"><img src="${s||''}" style="width:180px;height:100px;object-fit:contain;background:#334">${k}</div>`)}return Object.keys(__api.UT).filter(k=>I[k]).length});
 await sleep(500);await p.screenshot({path:'progress/v7-utility-textures.png'});
 // sight attachment: every sight part must touch the gun body (gap <= 2mm)
 out.sightGaps=await p.evaluate(()=>{const bad=[];for(const k of Object.keys(__api.W)){if(!__api.W[k].vm)continue;const g=buildGun(k,1);const gg=g.userData.dual?g.userData.dual[0]:g;gg.updateMatrixWorld(true);const bs=gg.children.filter(c=>c.isMesh).map(c=>new THREE.Box3().setFromObject(c));
  // connectivity: flood from the receiver (first mesh); any mesh not reachable via touching boxes is floating
  const n=bs.length,seen=new Array(n).fill(0);seen[0]=1;const st=[0];while(st.length){const i=st.pop();for(let j=0;j<n;j++)if(!seen[j]&&bs[i].clone().expandByScalar(.002).intersectsBox(bs[j])){seen[j]=1;st.push(j)}}
  const fl=seen.map((s,i)=>s?null:i).filter(x=>x!==null);if(fl.length)bad.push(k+':'+fl.length)}return bad});
 await p.evaluate(()=>document.querySelector('#gal').remove());
 // thrown utilities use the real util meshes + Bulwark panel texture
 out.bulwark=await p.evaluate(()=>{const G=__api.G,me=G.P[__api.ME];const {b0,dir}=window.__B;G.P.forEach(q=>{if(q.id!==me.id)q.__fix=[60,-60,60]});const c=[b0[0]+dir[0]*3,b0[2]+dir[1]*3];const ax=Math.abs(dir[1])>=Math.abs(dir[0]);
  G.boxes.push({min:[c[0]-(ax?.85:.13),b0[1],c[1]-(ax?.13:.85)],max:[c[0]+(ax?.85:.13),b0[1]+1.35,c[1]+(ax?.13:.85)],dyn:9901,ttl:999,col:0x6fb6ff,team:me.team});
  const s=[dir[1],-dir[0]];G.nades.push({id:777,type:'frag',pos:[b0[0]+dir[0]*1.6+s[0]*.5,b0[1]+1.2,b0[2]+dir[1]*1.6+s[1]*.5],vel:[0,0,0],t:99},{id:778,type:'smoke',pos:[b0[0]+dir[0]*1.6-s[0]*.5,b0[1]+1.2,b0[2]+dir[1]*1.6-s[1]*.5],vel:[0,0,0],t:99});return 'ok'});
 await sleep(1200);await p.screenshot({path:'progress/v7-bulwark-and-nades.png'});
 out.nadeMeshIsUtil=await p.evaluate(()=>!!(nadeMeshes[777]&&nadeMeshes[777].userData.nade3d));
 await p.close();
 // Hoshikawa: mountain clearance + screenshot from the edge
 p=await open('?q=medium&practice&tod=day&map=6');await freeze(p);
 out.hoshikawa=await p.evaluate(()=>{let minGap=1e9;mapGroup.traverse(o=>{if(o.isMesh&&o.geometry.type==='ConeGeometry'&&o.geometry.parameters.radius>10){const d=Math.hypot(o.position.x,o.position.z)-o.geometry.parameters.radius;minGap=Math.min(minGap,d-Math.hypot(MX,MZ))}});const me=__api.G.P[__api.ME];me.__fix=[0,3,MZ-2];me.yaw=0;me.pitch=.08;return +minGap.toFixed(1)});
 await sleep(1500);await p.screenshot({path:'progress/v7-hoshikawa-mountains.png'});await p.close();
 // Marbleway: white marble tone, pillar hitboxes, fruit destruction
 p=await open('?q=medium&practice&tod=day&map=7');await freeze(p);
 out.pillars=await p.evaluate(()=>{const cols=__api.G.boxes.filter(b=>b.tex==='column'&&Math.abs((b.max[0]-b.min[0])-(b.max[2]-b.min[2]))<.05);let cornerPass=0,centerHit=0,capHit=0;
  for(const b of cols){const cx=(b.min[0]+b.max[0])/2,cz=(b.min[2]+b.max[2])/2,h=b.max[0]-b.min[0],ym=(b.min[1]+b.max[1])/2;
   // ray grazing the square corner (inside the box, outside the round shaft) must pass; ray through the centre must hit the shaft surface
   const c=[cx+h*.47,ym,cz+h*.47];const o1=[c[0]-5,ym,c[2]+5],d1=norm([1,0,-1]);const t1=rayWorld(o1,d1,Math.hypot(5,5)+.01);if(t1>Math.hypot(5,5)-.05)cornerPass++;
   const o2=[cx-6,ym,cz],t2=rayWorld(o2,[1,0,0],12);if(Math.abs(t2-(6-h/2*.92))<.06)centerHit++;
   const o3=[cx-6,b.min[1]+.09,cz],t3=rayWorld(o3,[1,0,0],12);if(Math.abs(t3-(6-h/2))<.06)capHit++}
  return {columns:cols.length,cornerPass,centerHit,baseSlabHit:capHit}});
 out.fruit=await p.evaluate(async()=>{const F=FRUIT;if(!F.length)return 'no fruit';const me=__api.G.P[__api.ME];const f=F[0];me.__fix=[f.p[0]-2.2,0,f.p[2]+.01];const o=[f.p[0]-2.2,f.p[1]+.3,f.p[2]];const d=norm([2.2,-.3,0]);me.yaw=Math.atan2(-d[0],-d[2]);me.pitch=-.12;return {n:F.length,o,d}});
 await sleep(900);await p.screenshot({path:'progress/v7-marbleway-fruit-before.png'});
 out.fruitHit=await p.evaluate(({o,d})=>{const me=__api.G.P[__api.ME];__api.equip(me,['kestrel','sparrow','frag']);me.cur=0;__api.hostAction(me.id,{t:'shot',o,dirs:[d],w:'kestrel'});return window.__fruit().filter(x=>x).length},out.fruit);
 await sleep(250);await p.screenshot({path:'progress/v7-marbleway-fruit-shot.png'});
 await p.evaluate(()=>{const me=__api.G.P[__api.ME];me.__fix=[0,0,14];me.yaw=0;me.pitch=.05;window.__hideVM=0});await sleep(1200);await p.screenshot({path:'progress/v7-tonemap-marbleway.png'});
 out.lum=await p.evaluate(()=>{const c=renderer.domElement;const t=document.createElement('canvas');t.width=160;t.height=90;const x=t.getContext('2d');x.drawImage(c,0,0,160,90);const d=x.getImageData(0,0,160,90).data;let clip=0,s=0;for(let i=0;i<d.length;i+=4){const l=(d[i]+d[i+1]+d[i+2])/3;s+=l;if(d[i]>250&&d[i+1]>250&&d[i+2]>250)clip++}return {meanLum:+(s/(d.length/4)).toFixed(1),clippedPct:+(clip/(d.length/4)*100).toFixed(2)}});
 // shadows: thin walls block sun from both faces (shadowSide)
 out.shadowSide=await p.evaluate(()=>{let n=0,ds=0;mapGroup.traverse(o=>{if(o.isMesh&&o.castShadow){n++;if(o.material.shadowSide===THREE.DoubleSide)ds++}});return {casters:n,doubleSided:ds}});
 await p.close();return out});
// ---------- HUD: minimap with teammates + enemy blip when firing
await run('minimap',async()=>{const p=await open('?q=low&practice&tod=day&map=2');await freeze(p);
 const red=()=>p.evaluate(()=>{miniDraw();const c=document.querySelector('#minimap');const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let r=0;for(let i=0;i<d.length;i+=4)if(d[i]>200&&d[i+1]<90&&d[i+2]<90)r++;return r});
 const r=await p.evaluate(()=>{const G=__api.G,me=G.P[__api.ME];me.__fix=[0,0,0];me.__yaw=0;const al=G.P.find(q=>q.team===me.team&&q.id!==me.id);al.__fix=[0,0,25];al.alive=true;const en=G.P.find(q=>q.team!==me.team);en.__fix=[6,0,-8];en.hp=9999;G.P.forEach(q=>{if(q.team!==me.team&&q!==en)q.__fix=[0,0,30]});MINI.lastFire={};
  MINI.lastFire[en.id]={t:performance.now(),pos:[6,0,-8]};return {mini:!!document.querySelector('#minimap')}});
 r.redOnFire=await red();await p.screenshot({path:'progress/v7-minimap.png'});await p.evaluate(()=>{const me=__api.G.P[__api.ME];me.__yaw=Math.PI/2});await sleep(200);
 r.rotates=await p.evaluate(()=>{miniDraw();return document.querySelector('#minimap').toDataURL().length});await p.evaluate(()=>{__api.G.P[__api.ME].__yaw=0});await sleep(200);r.rotates=r.rotates!==await p.evaluate(()=>{miniDraw();return document.querySelector('#minimap').toDataURL().length});
 // centre pixel = own white arrow; off-edge ally clamped to the rim
 r.centreWhite=await p.evaluate(()=>{const c=document.querySelector('#minimap');const d=c.getContext('2d').getImageData(88,86,1,1).data;return d[0]>220&&d[1]>220&&d[2]>220});
 await p.evaluate(()=>{for(const q of __api.G.P)q.__nf=1;MINI.lastFire={}});await sleep(2200);await p.evaluate(()=>{MINI.lastFire={}});r.redAfterFade=await red();
 await sleep(400);await p.screenshot({path:'progress/v7-minimap-rotated.png'});await p.close();return r});
// ---------- RNG loadouts: no repeated combo across a long match
await run('rng',async()=>{const p=await open('?q=low&practice&tod=day&map=1');const r=await p.evaluate(()=>{const G=__api.G;const keys=[];let dup=0;const seen=new Set();for(let i=0;i<40;i++){const o=voteOptions();for(const lo of o){const k=JSON.stringify(lo);if(seen.has(k))dup++;seen.add(k);keys.push(k)}}return {options:keys.length,distinct:seen.size,dupes:dup}});await p.close();return r});
// ---------- vote v2 screenshot (loadout vote)
await run('vote',async()=>{const p=await open('?q=low&practice&tod=day&map=3');await p.evaluate(()=>{const G=__api.G;G.rt=0;G.rs='over';});await sleep(200);
 await p.evaluate(()=>{const G=__api.G;G.rs='vote';G.rt=99;G.opts=voteOptions();G.votes=[1,-1,1,-1];G.lo=G.opts[0];document.querySelectorAll('.hint,#clickHint').forEach(e=>e.style.display='none')});await sleep(900);
 await p.screenshot({path:'progress/v7-vote-v2.png'});const r=await p.evaluate(()=>({cards:document.querySelectorAll('.vc.v2').length,bars:document.querySelectorAll('.vc.v2 .vbar,.vc.v2 .bar,.vc.v2 i').length}));await p.close();return r});
// ---------- MP: back to lobby during next-map vote (fakenet host + client)
await run('backlobby',async()=>{const h=await open('?fakenet&q=low');const c=await open('?fakenet&q=low');await h.evaluate(()=>__api.hostOnline());await sleep(600);const code=await h.evaluate(()=>__api.LOBBY.code);await c.evaluate(cd=>__api.joinOnline(cd),code);await sleep(2000);
 await h.evaluate(()=>__api.hostStartMatch());await sleep(3000);await h.evaluate(()=>{const G=__api.G;G.rs='over';G.rt=0});await sleep(2500);await c.bringToFront();
 const vis=await c.evaluate(()=>{const b=document.querySelector('#bBackLobby');return b?{txt:b.textContent,shown:b.offsetParent!==null,rs:__api.G&&__api.G.rs}:{none:1,rs:__api.G&&__api.G.rs}});await c.screenshot({path:'progress/v7-back-to-lobby.png'});
 await c.evaluate(()=>document.querySelector('#bBackLobby').click());await sleep(1500);const reqSeen=await h.evaluate(()=>({G:!!__api.G,rs:__api.G&&__api.G.rs,btn:!!document.querySelector('#bBackLobby'),lobbyShown:!document.querySelector('#lobby').classList.contains('hide')}));await h.bringToFront();await sleep(500);await h.evaluate(()=>{const b=document.querySelector('#bBackLobby');if(b)b.click();else backToLobbyClick()});await sleep(2500);
 const after=await Promise.all([h,c].map(p=>p.evaluate(()=>({inLobby:!document.querySelector('#lobby')||!document.querySelector('#lobby').classList.contains('hide'),G:!!__api.G,code:__api.LOBBY&&__api.LOBBY.code,slots:__api.LOBBY&&__api.LOBBY.slots?__api.LOBBY.slots.filter(Boolean).length:null}))));
 await h.close();await c.close();return {vis,after,hostAfterClientReq:reqSeen}});
// ---------- menus with mock account: DEV badge, account name row, fullscreen row, crates, skin viewer
await run('menu',async()=>{const p=await open('?q=low',true);const out={};
 out.signup=await p.evaluate(async()=>{const r=await ACC.signUp('weebier','secret123');renderMenu();return r&&r.error||'ok'});await sleep(800);
 out.nameRow=await p.evaluate(()=>({myName:myName(),inputHidden:$('#nameIn')?$('#nameIn').offsetParent===null:null,note:($('#nameNote')||{}).innerText||'',dev:isDev('weebier'),devHtml:devB('weebier').includes('devtag')}));
 await p.screenshot({path:'progress/v7-account-name-dev.png'});
 const page=async id=>{await p.evaluate(i=>{MSEL=i;document.querySelectorAll('.mpage').forEach(e=>e.classList.toggle('hide',e.id!==i));renderMenu()},id);await sleep(700)};
 await page('mSet');await p.evaluate(()=>{const f=document.querySelector('.fsBtn');if(f)f.scrollIntoView()});out.fsRow=await p.evaluate(()=>!!document.querySelector('#mSet .fsBtn')&&!!document.querySelector('#mSet .mmIn'));await p.screenshot({path:'progress/v7-settings-fullscreen-minimap.png'});
 await page('mCrates');out.crateImgs=await p.evaluate(()=>[...document.querySelectorAll('#crateGrid .cimg')].map(i=>i.naturalWidth>0||i.src.length>100).length);await p.screenshot({path:'progress/v7-crate-icons.png'});
 await page('mLoad');out.skinCards=await p.evaluate(()=>document.querySelectorAll('#skinGrid > *').length);
 await p.evaluate(()=>{const c=document.querySelector('#skinGrid > *');c&&c.click()});await sleep(1200);
 out.viewer=await p.evaluate(()=>({open:!$('#skv').classList.contains('hide'),info:$('#skvInfo').textContent.slice(0,60)}));
 const cv=await p.$('#skvCv');const bb=await cv.boundingBox();await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.mouse.down();await p.mouse.move(bb.x+bb.width/2+120,bb.y+bb.height/2+30,{steps:6});await p.mouse.up();await p.mouse.wheel({deltaY:-300});await sleep(600);
 out.viewerRot=await p.evaluate(()=>({yaw:+SKV.yaw.toFixed(2),zoom:+SKV.zoom.toFixed(2)}));await p.screenshot({path:'progress/v7-skin-viewer.png'});
 await p.keyboard.press('Escape');await sleep(300);out.viewerClosed=await p.evaluate(()=>$('#skv').classList.contains('hide'));
 // scoreboard / killfeed / chat with DEV names in a practice match
 await p.evaluate(()=>practice&&__api.practice?__api.practice(0):0).catch(()=>{});await sleep(4000);
 out.ingame=await p.evaluate(()=>{const G=__api.G;if(!G)return 'no game';const me=G.P[__api.ME];const en=G.P.find(q=>q.team!==me.team);en.name='twentyfivcent';handleEvent({t:'kill',k:me.id,v:en.id,w:'kestrel',hs:1});chatShow({team:me.team,n:me.name,m:'gg from the dev account'});chatShow({team:en.team,n:'twentyfivcent',m:'nice shot'});G.rs='live';G.rt=999;K[kc('score')]=true;return {meName:me.name}});
 await sleep(800);out.devTags=await p.evaluate(()=>document.querySelectorAll('.devtag').length);await p.screenshot({path:'progress/v7-dev-badge-ingame.png'});
 await p.close();return out});
console.log(JSON.stringify(R,null,1));console.log('ERRS',JSON.stringify(errs.slice(0,12)));await br.close()})();
