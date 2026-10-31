require('./testguard');const {launch,open,sleep}=require('./b3lib');
(async()=>{const br=await launch();
for(const t of (process.env.TIERS||'low,med,high').split(',')){const errs=[];const h=await open(br,errs,'?fakenet&gfx='+t);await sleep(3000);
 const r=await h.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const fr=[];let last=performance.now(),run=true,sw=[];let pi=MPAN.i;
  const f=()=>{const n=performance.now();fr.push(n-last);last=n;if(MPAN.i!==pi){pi=MPAN.i;sw.push(fr.length-1)}if(run)requestAnimationFrame(f)};requestAnimationFrame(f);
  while(sw.length<4)await W(500);run=false;const per=sw.slice(1).map(k=>{const win=fr.slice(Math.max(1,k-3),k+15);return Math.max(...win)});
  const base=fr.slice(1).sort((a,b)=>a-b);const med=base[base.length>>1];return {per:per.map(x=>Math.round(x)),worst:Math.round(Math.max(...per)),median:Math.round(med),spikes:fr.filter(x=>x>3*med).length,n:fr.length}});
 console.log(t,JSON.stringify(r));await h.close()}
await br.close()})();
