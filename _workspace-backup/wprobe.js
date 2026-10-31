require('./testguard.js');const {launch,open,sleep}=require('./b3lib.js');(async()=>{const br=await launch();const e=[];const p=await open(br,e);
await p.evaluate(()=>{window.__noAutoFS=1;practice(6)});await sleep(2500);
console.log(JSON.stringify(await p.evaluate(()=>{G.rs='live';const me=G.P[ME];me.alive=true;const b=G.boxes.find(b=>b.liquid&&b.max[1]-b.min[1]>=1);const cz=(b.min[2]+b.max[2])/2;const R=[];
for(const m of [1,0]){const o=window.wadeMul;if(!m)window.wadeMul=()=>1;me.pos=[b.min[0]+.5,-.55,cz];me.vel=[0,0,0];me.stam=100;const tr=[];for(let i=0;i<20;i++){movePlayer(me,{f:0,r:1,sprint:true,yaw:0,pitch:0},1/60);tr.push(+me.pos[0].toFixed(2))}window.wadeMul=o;R.push({m,mul:wadeMul(me),tr:tr.filter((_,i)=>i%4==0),y:me.pos[1]})}
return {box:[b.min,b.max],R}})));await br.close()})();
