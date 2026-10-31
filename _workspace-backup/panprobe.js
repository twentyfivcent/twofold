require('./testguard');const {launch,open,sleep}=require('./b3lib');
(async()=>{const br=await launch();const out={};
for(const t of (process.env.TIERS||'low,med,high').split(',')){const errs=[];const h=await open(br,errs,'?fakenet&gfx='+t);await sleep(4000);const ev=(f,a)=>h.evaluate(f,a);
 const r=await ev(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const res=[];
  const _b=mpanBuild;window.__bt=[];mpanBuild=function(i){const a=performance.now();const r=_b.apply(this,arguments);__bt.push([i,+(performance.now()-a).toFixed(0)]);return r};
  const _r=renderFrame;window.__rt=[];renderFrame=function(){const a=performance.now();const r=_r.apply(this,arguments);__rt.push(performance.now()-a);return r};
  for(let k=0;k<4;k++){await W(1500);const fr=[];let last=performance.now(),run=true;const f=()=>{const n=performance.now();fr.push(n-last);last=n;if(run)requestAnimationFrame(f)};requestAnimationFrame(f);__rt.length=0;
   MPAN.t0-=MPAN.dur+1;await W(5000);run=false;const s=fr.slice(1).sort((a,b)=>b-a);const med=fr.slice(1).sort((a,b)=>a-b)[fr.length>>1];
   res.push({map:MAPS[MPAN.i].n,build:__bt[__bt.length-1][1],worst:+s[0].toFixed(0),top3:s.slice(0,3).map(x=>+x.toFixed(0)),median:+med.toFixed(0),spikes:fr.filter(x=>x>3*med).length,rWorst:+Math.max(...__rt).toFixed(0)})}
  return res});out[t]=r;console.log(t,JSON.stringify(r));await h.close()}
await br.close()})();
