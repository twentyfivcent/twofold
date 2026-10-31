require('./testguard');const {launch,open,sleep}=require('./b3lib');(async()=>{const br=await launch();const errs=[],R={};const p=await open(br,errs);
await p.evaluate(()=>{__api.practice(0)});await sleep(3000);
await p.evaluate(()=>{G.rs='live';G.rt=999;const me=G.P[ME];const sp=me.pos.slice();window.__base=sp;const ids=G.P.map((x,i)=>i).filter(i=>i!==ME);
 const chars=['op','ch_vanguard','ch_nomad','ch_ronin','ch_bastion','ch_specter','ch_atlas','ch_wisp'];
 ids.forEach((i,k)=>{G.P[i].chr=chars[k%8]});window.__pin=ids.map((i,k)=>({i,pos:[sp[0]+(k-(ids.length-1)/2)*1.6,sp[1],sp[2]-6],yaw:Math.PI+.35*(k%2?1:-1),keep:1}));window.__pin.push({i:ME,pos:[sp[0],sp[1],sp[2]+30],yaw:0});
 window.__cam={p:[sp[0],sp[1]+1.5,sp[2]-1.2],l:[sp[0],sp[1]+1.0,sp[2]-6],fov:70}});await sleep(1500);
R.chars=await p.evaluate(()=>G.P.map(x=>x.team+':'+(pMeshes[x.id]&&pMeshes[x.id].userData.charId)));
await p.screenshot({path:'progress/v7-models-lineup.png'});
// hands close-up
await p.evaluate(()=>{const s=window.__pin[0].pos;window.__cam={p:[s[0]+1.2,s[1]+1.5,s[2]+1.3],l:[s[0],s[1]+1.1,s[2]],fov:50}});await sleep(800);await p.screenshot({path:'progress/v7-models-hands.png'});
await p.evaluate(()=>{const s=window.__pin[1].pos;window.__cam={p:[s[0]-1.3,s[1]+1.4,s[2]-.6],l:[s[0],s[1]+1.1,s[2]],fov:50}});await sleep(800);await p.screenshot({path:'progress/v7-models-hands2.png'});
// silhouettes from distance
await p.evaluate(()=>{const s=window.__base;window.__cam={p:[s[0],s[1]+3.2,s[2]+1.5],l:[s[0],s[1]+.9,s[2]-6],fov:62}});await sleep(800);await p.screenshot({path:'progress/v7-models-silhouettes.png'});
// low LOD
await p.evaluate(()=>{settings.quality='low';applyQuality();const s=window.__base;window.__cam={p:[s[0],s[1]+1.5,s[2]-1.2],l:[s[0],s[1]+1.0,s[2]-6],fov:70}});await sleep(1500);
R.low=await p.evaluate(()=>{let tri=0;const m=pMeshes.find(x=>x&&x.userData.charId);m.traverse(o=>{if(o.isMesh&&o.geometry){const g=o.geometry;tri+=(g.index?g.index.count:g.attributes.position.count)/3}});return {low:m.userData.low,tri}});
await p.screenshot({path:'progress/v7-models-low.png'});
await p.evaluate(()=>{settings.quality='medium';applyQuality()});await sleep(1500);
R.med=await p.evaluate(()=>{let tri=0;const m=pMeshes.find(x=>x&&x.userData.charId);m.traverse(o=>{if(o.isMesh&&o.geometry){const g=o.geometry;tri+=(g.index?g.index.count:g.attributes.position.count)/3}});return {low:m.userData.low,tri}});
// hitboxes still line up (shots on model hit)
R.hit=await p.evaluate(()=>{const v=G.P[window.__pin[0].i];const b=__api.partBoxes(v);return Object.keys(b).length||b.length});
console.log(JSON.stringify(R));console.log('ERRS',JSON.stringify(errs));await br.close()})();
