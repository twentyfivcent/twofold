// V8 drop 3b suite: graphics tiers (Low/Med/High, persisted), knife off-hand fix (8 chars), Velvet Ace casino props (collision + spawn clearance). Local only; testguard blocks *.supabase.co.
require('./testguard');const {launch,open,sleep}=require('./b3lib');
(async()=>{const br=await launch();const errs=[];let pass=0,fail=0;const R=[];
 const ok=(n,v,info)=>{if(v){pass++;R.push('PASS '+n)}else{fail++;R.push('FAIL '+n+' '+JSON.stringify(info===undefined?'':info).slice(0,500))}};
 let h=await open(br,errs,'?fakenet');await sleep(2000);let ev=(f,a)=>h.evaluate(f,a);
 ok('label v8.1',await ev(()=>/v8\.1/.test(document.querySelector('.ptitle').textContent)));
 const g0=await ev(()=>{localStorage.removeItem('twofold');return {def:(()=>{const s=settings.gfx;return s})(),sel:document.querySelectorAll('.gfxSel').length,sync:SYNC_KEYS.includes('gfx'),grades:MAPS.every(m=>!!GRADE[m.n])}});
 ok('gfx default Med',g0.def==='med',g0);ok('graphics detail selector in both settings panels',g0.sel===2,g0);ok('gfx synced with account settings',g0.sync);ok('per-map grade for all 13 maps',g0.grades);
 await ev(()=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};practice(MAPS.findIndex(m=>m.n==='Velvet Ace'))});await sleep(4500);
 const tiers={};for(const t of ['low','med','high']){tiers[t]=await ev(async t=>{setGfx(t);await new Promise(r=>setTimeout(r,1500));const p=G.P[0];let det=0;pMeshes.forEach(m=>m&&m.traverse(o=>{if(o.userData.gfxD)det++}));
  return {i:__gfxInfo(),det,pb:JSON.stringify(partBoxes(p)),stored:JSON.parse(localStorage.getItem('twofold')).gfx,sel:[...document.querySelectorAll('.gfxSel')].every(e=>e.value===t),props:Object.keys(__czInfo().props).length}},t)}
 const L=tiers.low,M=tiers.med,H=tiers.high;
 ok('Low = classic pipeline (no env, no AO, 1024 shadows, no HD char detail)',!L.i.env&&!L.i.ao&&L.i.shadow===1024&&L.det===0,L);
 ok('Med = env + soft 2048 shadows + HD detail, no AO',M.i.env&&!M.i.ao&&M.i.composer&&M.i.shadow===2048&&M.det>0,M);
 ok('High = AO + 4096 shadows + 1024 textures',H.i.ao&&H.i.shadow===4096&&H.i.tex===1024&&H.det>0,H);
 ok('setting persists to localStorage + UI',L.stored==='low'&&M.stored==='med'&&H.stored==='high'&&L.sel&&M.sel&&H.sel);
 ok('hitboxes identical across tiers',L.pb===M.pb&&M.pb===H.pb);ok('casino props built on every tier',L.props>=10&&M.props>=10&&H.props>=10,[L.props,M.props,H.props]);
 // casino props: collision + spawn clearance + validator
 const cz=await ev(()=>{const bx=G.boxes.filter(b=>typeof b.tex==='string'&&b.tex.startsWith('cz_'));const p=G.P[1];const sv=JSON.stringify([p.pos,p.vel,p.yaw]);const out=[];let reg=0;
  for(const b of bx){const c=[(b.min[0]+b.max[0])/2,(b.min[2]+b.max[2])/2],hx=(b.max[0]-b.min[0])/2,hz=(b.max[2]-b.min[2])/2;p.pos=[c[0],0,c[1]];if(overlap(p,b,1.8))reg++;
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])for(const yaw of [0,Math.PI/2,Math.PI,-Math.PI/2]){p.pos=[c[0]+dx*(hx+.9),0,c[1]+dz*(hz+.9)];p.vel=[0,0,0];p.yaw=yaw;let bad=0;for(let k=0;k<90;k++){movePlayer(p,{f:1,r:0,yaw,pitch:0},1/60);if(overlap(p,b,1.0)&&p.pos[1]<b.max[1]-.05)bad=1}if(bad)out.push(b.tex+'@'+c.map(v=>v.toFixed(1)))}}
  const z=JSON.parse(sv);p.pos=z[0];p.vel=z[1];p.yaw=z[2];return {n:bx.length,reg,through:out,sc:__spawnClear(),ve:validateMaps().filter(x=>/Velvet/.test(x)),laneOk:MAPS[12].laneOk,wheels:CZ.wheels.length}});
 ok('casino prop boxes present (26)',cz.n===26,cz.n);ok('every prop registers collision',cz.reg===cz.n,cz);ok('no walking through props',cz.through.length===0,cz.through.slice(0,8));
 ok('spawn rooms clear',cz.sc.length===0,cz.sc);ok('validator clean (lanes, exits, LoS, cross-paths)',cz.ve.length===0&&cz.laneOk.every(Boolean),cz);ok('3 roulette wheels',cz.wheels===3,cz.wheels);
 // knife: for all 8 characters the off-hand never touches the blade; gun arms hidden while knife held
 await ev(async()=>{for(let i=0;i<80&&G.rs!=='live';i++){if(G.rs==='vote'||G.rs==='pre')G.rt=Math.min(G.rt,.05);await new Promise(r=>setTimeout(r,250))}window.__kI=setInterval(()=>{MELSEL=true},40)});
 const kn=await ev(async()=>{const out={};for(const c of CHARS.map(x=>x.id)){ACC.equipped=ACC.equipped||{};ACC.owned=ACC.owned||{};ACC.owned[c]=1;ACC.equipped._char=c;await new Promise(r=>setTimeout(r,900));
  const k=vm.userData.knife,off=vm.children.find(o=>o.userData.offHand)||(typeof KVM!=="undefined"&&KVM.off);camera.updateMatrixWorld(true);const pts=o=>{const a=[];o.updateMatrixWorld(true);o.traverse(m=>{if(m.isMesh&&m.visible){const P=m.geometry.attributes.position;for(let i=0;i<P.count;i+=1)a.push(new THREE.Vector3().fromBufferAttribute(P,i).applyMatrix4(m.matrixWorld))}});return a};const bp=pts(k.children[0]),hp=off?pts(off):[];let md=9;for(const a of hp)for(const b of bp)md=Math.min(md,a.distanceTo(b));
  const gunArms=vm.children.filter(o=>o.userData.cid&&!o.userData.offHand);out[c]={char:VMCHAR,knife:k.visible,off:!!off&&off.visible,armsHidden:gunArms.every(o=>!o.visible),touch:md<.03,md:+md.toFixed(3)}}return out});
 const ks=Object.entries(kn);ok('8 characters checked',ks.length===8,Object.keys(kn));ok('knife held: gun-grip arms hidden for all',ks.every(([c,v])=>v.knife&&v.armsHidden),kn);
 ok('relaxed off-hand shown for all',ks.every(([c,v])=>v.off),kn);ok('off-hand never touches the blade',ks.every(([c,v])=>!v.touch),kn);ok('hands match character',ks.every(([c,v])=>v.char===c),kn);
 await ev(()=>{clearInterval(window.__kI);MELSEL=false;setGfx('med')});
 await ev(()=>__api.quitToMenu(''));await sleep(500);
 const E=errs.filter(e=>!/favicon|ERR_|net::|WebGL|GPU stall|AudioContext/i.test(e));ok('no page errors',E.length===0,E.slice(0,6));
 console.log(R.join('\n'));console.log(`v8d3b: ${pass} passed, ${fail} failed`);await br.close();process.exit(fail?1:0)})().catch(e=>{console.error(e);process.exit(2)});
