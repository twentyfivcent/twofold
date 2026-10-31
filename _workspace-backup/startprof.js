require('./testguard');const {launch,open,sleep}=require('./b3lib');
(async()=>{const br=await launch();const errs=[];const h=await open(br,errs,'?fakenet&gfx='+(process.env.T||'med'));await sleep(2500);
const cdp=await h.target().createCDPSession();await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:500});
await h.evaluate(()=>{botThink=function(){return {f:0.6,r:0,yaw:.02,pitch:0}}});await cdp.send('Profiler.start');
await h.evaluate(()=>{window.__fr=[];let l=0;const f=()=>{const n=performance.now();if(l)__fr.push([Math.round(n-l),Math.round(n)]);l=n;requestAnimationFrame(f)};window.__p0=performance.now();practice(1);requestAnimationFrame(f)});await sleep(6000);
const {profile}=await cdp.send('Profiler.stop');const self={},tot={};const dt=profile.timeDeltas;const byId={};profile.nodes.forEach(n=>byId[n.id]=n);
const cnt={};profile.samples.forEach((s,i)=>{cnt[s]=(cnt[s]||0)+(dt[i]||0)});
const par={};profile.nodes.forEach(n=>(n.children||[]).forEach(c=>par[c]=n.id));
for(const id in cnt){const n=byId[id];const k=n.callFrame.functionName||'(anon)';self[k]=(self[k]||0)+cnt[id]/1000;const seen=new Set();let c=+id;while(c){const nm=byId[c].callFrame.functionName||'(anon)';if(!seen.has(nm)){seen.add(nm);tot[nm]=(tot[nm]||0)+cnt[id]/1000}c=par[c]}}
const top=o=>Object.entries(o).sort((a,b)=>b[1]-a[1]).slice(0,40).map(([k,v])=>k+':'+Math.round(v)).join(' ');
console.log('SELF',top(self));console.log('TOTAL',top(tot));console.log('frames',JSON.stringify(await h.evaluate(()=>__fr.filter(x=>x[0]>100).map(x=>[x[0],x[1]-__p0]))));await br.close()})();
