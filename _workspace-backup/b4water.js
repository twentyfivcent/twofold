require('./testguard');const {launch,open,sleep}=require('./b3lib');(async()=>{const br=await launch();const errs=[],R={};
for(const mi of (process.argv[2]||'11,0,8,10').split(',').map(Number)){const h=await open(br,errs,'tod=day');await h.evaluate(mi=>practice(mi),mi);await sleep(3000);
 const info=await h.evaluate(()=>{const m=G.mapDef,r=m.wadeR||[];G.rs='live';G.P.forEach((p,i)=>{if(i!==ME&&i!==1)p.alive=false});return {n:m.n,R:r.map(q=>[+q.x0.toFixed(1),+q.x1.toFixed(1),+q.z0.toFixed(1),+q.z1.toFixed(1),q.d])}});
 if(!info.R.length){R[info.n]='none';await h.close();continue}
 const r=info.R[0];const cx=(r[0]+r[1])/2,cz=(r[2]+r[3])/2;
 // speed test: dry vs wet using movePlayer directly
 const sp=await h.evaluate((cx,cz)=>{const p=G.P[ME];const run=(x,z)=>{p.pos=[x,0,z];p.vel=[0,0,0];const a=[p.pos[0],p.pos[2]];for(let i=0;i<60;i++)movePlayer(p,{f:1,r:0,yaw:0,pitch:0},1/60);return Math.hypot(p.pos[0]-a[0],p.pos[2]-a[1])};
  const wet=run(cx,cz+0.0),d=__wade.depth(cx,0,cz);const m=G.mapDef;return {wet,depth:d,mul:__wade.mul({pos:[cx,0,cz]})}},cx,cz);
 const dry=await h.evaluate(()=>{const p=G.P[ME];p.pos=[0,0,G.mapDef.spawns?0:0];p.pos=[...p.pos];return __wade.mul(p)});
 // visuals: place player in water walking, camera looking at it
 await h.evaluate((cx,cz)=>{const me=G.P[ME];me.pos=[cx-5,0,cz+5];const b=G.P[1];b.bot=false;b.alive=true;window.__cam={p:[cx-4.5,2.4,cz+4.5],l:[cx,.4,cz],fov:60};let t=0;const L=()=>{requestAnimationFrame(L);t+=.016;b.pos=[cx+Math.sin(t)*1.3,0,cz+Math.cos(t*.7)*1.3];b.vel=[0,0,0];b.moving=true};L()},cx,cz);
 await sleep(2500);const f='progress/v7-water-'+info.n.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.png';await h.screenshot({path:f});
 R[info.n]={rects:info.R.length,first:r,...sp,dryMul:dry,shot:f};await h.close()}
console.log(JSON.stringify(R,null,1));console.log('ERRS',JSON.stringify(errs));await br.close()})();
