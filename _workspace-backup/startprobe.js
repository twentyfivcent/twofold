require('./testguard');const {launch,open,sleep}=require('./b3lib');
(async()=>{const br=await launch();const out={};
for(const t of (process.env.TIERS||'low,med,high').split(',')){const errs=[];const h=await open(br,errs,'?fakenet&gfx='+t);await sleep(2500);
 out[t]=await h.evaluate(async(mp)=>{const W=ms=>new Promise(r=>setTimeout(r,ms));botThink=function(){return {f:0.6,r:0,yaw:.02,pitch:0,fire:Math.random()<.3}};
  await W(500);const fr=[];let last=0,run=true;const f=()=>{const n=performance.now();if(last)fr.push(n-last);last=n;if(run)requestAnimationFrame(f)};
  const t0=performance.now();practice(mp);const build=performance.now()-t0;requestAnimationFrame(f);await W(5000);run=false;
  const s=fr.slice().sort((a,b)=>a-b);return {build:Math.round(build),worst:Math.round(Math.max(...fr)),med:Math.round(s[s.length>>1]),spikes:fr.filter(x=>x>3*s[s.length>>1]).length,n:fr.length,top:fr.map(Math.round).sort((a,b)=>b-a).slice(0,4)}},+(process.env.MAP||1));
 await h.close()}
console.log(process.env.TF_PAGE||'index.html',JSON.stringify(out));await br.close()})();
