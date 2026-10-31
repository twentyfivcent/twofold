require('./testguard');const {launch,open,sleep}=require('./b3lib');
(async()=>{const br=await launch();const errs=[];const h=await open(br,errs,'?fakenet&gfx='+(process.env.T||'med'));await sleep(4000);
 const r=await h.evaluate(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));const T={};const wrap=n=>{const f=window[n];if(typeof f!=='function')return;window[n]=function(){const a=performance.now();try{return f.apply(this,arguments)}finally{T[n]=(T[n]||0)+performance.now()-a}}};
  ['tex','derived','cnv','buildBoxMesh','buildDecor','czDecor','slotDress','makeSky','makeStars','buildBoxes','prepMaps','initFX','buildCastleDecor','matT','boxGeo','setupShadow','todMap'].forEach(wrap);
  const res=[];for(let k=0;k<5;k++){for(const x in T)delete T[x];MPAN.t0-=MPAN.dur+1;await W(300);const b=Object.fromEntries(Object.entries(T).map(([a,v])=>[a,Math.round(v)]));
   const a=performance.now();renderer.compile(scene,camera);const c=performance.now()-a;const a2=performance.now();renderFrame();const rf=performance.now()-a2;res.push({m:MAPS[MPAN.i].n,b,compile:Math.round(c),render:Math.round(rf)});await W(2500)}return res});
 for(const x of r)console.log(JSON.stringify(x));await br.close()})();
