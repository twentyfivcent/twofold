require('./testguard');const {launch,open,sleep}=require('./b3lib');
(async()=>{const br=await launch();const out={};
for(const t of ['low','med','high']){const errs=[];const h=await open(br,errs,'?fakenet&tod=day&gfx='+t);await sleep(1500);const ev=(f,a)=>h.evaluate(f,a);
 await ev(mi=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};practice(mi)},+(process.env.MI||12));await sleep(5000);
 const r=await ev(async()=>{const t0=performance.now();let n=0;await new Promise(res=>{function f(){n++;if(performance.now()-t0<6000)requestAnimationFrame(f);else res()}requestAnimationFrame(f)});return {fps:+(n/6).toFixed(2),info:__gfxInfo(),pm:pMeshes.filter(Boolean).length,det:pMeshes.filter(m=>m&&m.getObjectByProperty&&(()=>{let c=0;m.traverse(o=>{if(o.userData.gfxD)c++});return c})()).length}});
 out[t]={...r,errs:errs.slice(0,3)};await h.close()}
console.log(JSON.stringify(out,null,1));await br.close()})();
