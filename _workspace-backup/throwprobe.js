require('./testguard');const {launch,open,sleep}=require('./b3lib');
(async()=>{const br=await launch();const errs=[];const h=await open(br,errs,'?fakenet&q=low');await sleep(1500);
await h.evaluate(()=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};practice(0)});await sleep(5000);
const r=await h.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const p=G.P[ME];for(const q of G.P)if(q!==p)q.pos=[999,-50,999];
 // find open flat spot: try candidates, pick the one with longest clear ray
 let best=null;const sp=p.pos.slice();for(let a=0;a<16;a++){const x=sp[0],z=sp[2];const yaw=a*Math.PI/8;const o=[x,sp[1]+1.6,z];if(G.boxes.some(c=>overlap({pos:[x,0,z]},c,1.8)))continue;const d=dirYP(yaw,0);const t=rayWorld(o,d,60);if(!best||t>best.t)best={x,z,yaw,t}}
 const out={spot:best,lethal:p.lethal,tac:p.tac,utils:Object.keys(typeof UTILS!=='undefined'?UTILS:{}).slice(0,20)};const types=['frag','smoke','flash','sticky','molotov','decoy','knife'];
 for(const ty of types){for(const mode of ['direct','cook']){p.pos=[best.x,sp[1],best.z];p.vel=[0,0,0];p.yaw=best.yaw;p.pitch=.25;p.alive=true;p.crouch=false;p.util=ty;try{utilAdd(p,ty,1)}catch(e){}G.rs='live';const n0=nadeId;
  if(mode==='direct')throwUtil(p,3);else{p.cook=2;throwUtil(p,1)}await W(30);const n=G.nades.find(x=>x.id>=n0);if(!n){out[ty+'_'+mode]='none';continue}
  let maxd=0;const t0=performance.now();while(performance.now()-t0<4000){const d=Math.hypot(n.pos[0]-best.x,n.pos[2]-best.z);maxd=Math.max(maxd,d);if(n.dead||Math.hypot(...n.vel)<.3)break;await W(16)}
  out[ty+'_'+mode]={d:+maxd.toFixed(1),v0:+Math.hypot(...n.vel).toFixed(1)};n.dead=true;await W(50)}}
 return out});console.log(process.env.TF_PAGE||'index.html',JSON.stringify(r));await br.close()})();
