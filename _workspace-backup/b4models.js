require('./testguard');const {launch,open,sleep}=require('./b3lib');(async()=>{const br=await launch();const errs=[],R={};const p=await open(br,errs,'q=high&tod=day');
await p.evaluate(()=>{__api.practice(6)});await sleep(3000);
await p.evaluate(()=>{G.rs='live';G.rt=999;document.body.classList.add('podium');const S=podStage();const grp=new THREE.Group();scene.add(grp);podSet(grp,S,0,0);window.__S=S;window.__grp=grp;
 window.__cam={p:[S.c[0]-.2,S.c[1]+1.45,S.c[2]+6.6],l:[S.c[0]-.2,S.c[1]+1.0,S.c[2]-.5],fov:50}});
const sets=[['op','ch_vanguard','ch_nomad'],['ch_ronin','ch_bastion','ch_specter'],['ch_atlas','ch_wisp','op']];const xs=[[-4.2,-3.2,-2.2],[-1.2,-.2,.8],[1.8,2.8,3.8]];
for(let k=0;k<3;k++){await p.evaluate((set,xs)=>{const S=window.__S;const ids=G.P.map((x,i)=>i).filter(i=>i!==ME);ids.forEach((i,j)=>{G.P[i].bot=false;G.P[i].chr=set[j];G.P[i].hp=100;G.P[i].alive=true;G.P[i].reloadT=0;G.P[i].inspT=0;G.P[i].inspF=0;G.P[i].meleeT=0;G.P[i].fireCd=99;G.P[i].cur=0;G.P[i].emote=null;G.P[i].emoT=0});G.rs="live";G.rt=999;
  window.__tgt=ids.map((i,j)=>{const g=Math.round((xs[j]+4.2));return [S.c[0]+xs[j]*1.05,S.c[1],S.c[2]+(g%2?-1.1:.4),Math.PI-.55]});window.__pin=ids.map((i,j)=>({i,pos:G.P[i].pos.slice(),yaw:Math.PI+(j-1)*.18,pitch:-.05,keep:1}))},sets[k],xs[k]);
 await sleep(1600);
 await p.evaluate(()=>{for(const i of G.P.map((x,i)=>i).filter(i=>i!==ME)){const m=pMeshes[i];m.updateMatrixWorld(true);const c=m.clone(true);c.traverse(o=>{if(o.isSprite)o.visible=false});const j=G.P.map((x,i)=>i).filter(i=>i!==ME).indexOf(i);const t=window.__tgt[j];c.position.set(t[0],t[1],t[2]);c.rotation.set(0,t[3],0);c.visible=true;window.__grp.add(c)}})}
await p.evaluate(()=>{for(const i of G.P.map((x,i)=>i))if(pMeshes[i])pMeshes[i].visible=false;0});await sleep(600);
R.teams=await p.evaluate(()=>G.P.map(x=>x.team));
await p.screenshot({path:'progress/v7-models-lineup.png'});
await p.evaluate(()=>{const S=window.__S;window.__cam={p:[S.c[0]-2.0,S.c[1]+1.55,S.c[2]+2.2],l:[S.c[0]-3.2,S.c[1]+1.15,S.c[2]+.2],fov:40}});await sleep(800);await p.screenshot({path:'progress/v7-models-hands.png'});
await p.evaluate(()=>{const S=window.__S;window.__cam={p:[S.c[0]+.6,S.c[1]+1.5,S.c[2]+2.0],l:[S.c[0]-.2,S.c[1]+1.15,S.c[2]+.2],fov:40}});await sleep(800);await p.screenshot({path:'progress/v7-models-hands2.png'});
// silhouettes: dark backdrop, flat rim
await p.evaluate(()=>{const S=window.__S;window.__cam={p:[S.c[0]+.4,S.c[1]+2.2,S.c[2]+11],l:[S.c[0]+.4,S.c[1]+.9,S.c[2]],fov:40};window.__sil=[];window.__grp.traverse(o=>{if(o.isMesh&&o.parent!==window.__grp){window.__sil.push([o,o.material])}});
 for(const [o] of window.__sil){let t=null;o.traverseAncestors(a=>{if(a.userData&&a.userData.charId!==undefined)t=a});o.material=new THREE.MeshBasicMaterial({color:0x07080a,fog:false})}});
await sleep(600);await p.screenshot({path:'progress/v7-models-silhouettes.png'});
console.log(JSON.stringify(R));console.log('ERRS',JSON.stringify(errs));await br.close()})();
