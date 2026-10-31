require('./testguard');const {launch,open,sleep}=require('./b3lib');
module.exports=async function measure(br,errs){const h=await open(br,errs,'?fakenet&q=low');await sleep(1500);
 await h.evaluate(()=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};practice(0)});await sleep(5000);
 const r=await h.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const p=G.P[ME];for(const q of G.P)if(q!==p){q.pos=[999,-50,999];q.alive=false}
  G.boxes=G.boxes.filter(b=>b.liquid&&false);G.rs='live';const types=Object.keys(UT).filter(k=>!UT[k].inst&&!UT[k].throwNow&&!UT[k].knifeCook&&k!=='knife');const out={};
  for(const ty of types)for(const mode of ['full','cooked']){p.pos=[0,0,0];p.vel=[0,0,0];p.yaw=0;p.pitch=.6;p.alive=true;p.crouch=false;p.util=ty;try{utilAdd(p,ty,1)}catch(e){}
   let cap=null;const _sd=sendOrDo;sendOrDo=function(m,pid){cap=m};throwUtil(p,mode==='full'?3:.6);sendOrDo=_sd;if(!cap){out[ty+'_'+mode]=null;continue}
   const n={id:9e6+Math.random(),type:ty,pos:cap.pos.slice(),vel:cap.vel.slice(),fuse:6,owner:p.id,yaw:0,pitch:0};G.nades.push(n);await W(5);
   const o=[p.pos[0],p.pos[2]];const v0=Math.hypot(...n.vel);let carry=null;const t0=performance.now();
   let lp=n.pos.slice();while(performance.now()-t0<5000&&!n.dead){lp=n.pos.slice();if(carry===null&&n.pos[1]<.12&&performance.now()-t0>100)carry=Math.hypot(n.pos[0]-o[0],n.pos[2]-o[1]);if(n.type==='sticky'&&n.stuck)break;await W(8)}
   if(carry===null)carry=Math.hypot(lp[0]-o[0],lp[2]-o[1]);out[ty+'_'+mode]={carry:carry&&+carry.toFixed(1),v0:+v0.toFixed(1)};n.dead=true;n.fuse=-1;await W(40)}
  return out});await h.close();return r};
if(require.main===module)(async()=>{const br=await launch();const e=[];console.log(process.env.TF_PAGE||'index.html',JSON.stringify(await module.exports(br,e)));await br.close()})();
