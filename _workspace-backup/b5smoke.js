require('./testguard');const {launch,open,sleep}=require('./b3lib');(async()=>{const br=await launch();const R=[];let bad=0;
for(let mi=0;mi<12;mi++){const errs=[];const h=await open(br,errs,'tod=day');await h.evaluate(mi=>practice(mi),mi);await sleep(2500);
 const a=await h.evaluate(async()=>{const S=()=>checkSpawns('smoke').ok;const r={n:G.mapDef.n,spawn:S(),boxes:G.boxes.length};const p0=G.P.map(p=>p.pos.slice());G.rs='live';G.rt=60;
  await new Promise(z=>setTimeout(z,4000));r.moved=G.P.filter((p,i)=>p.bot&&Math.hypot(p.pos[0]-p0[i][0],p.pos[2]-p0[i][2])>1).length;r.inBounds=G.P.every(p=>Math.abs(p.pos[0])<=MX+.1&&Math.abs(p.pos[2])<=MZ+.1&&p.pos[1]>-1);
  G.sc=[ROUNDS_TO_WIN-1,ROUNDS_TO_WIN-1];G.rs='end';roundStart();r.sd=G.sd===1&&/Sudden Death/.test(G.mapDef.n);r.sdSpawn=S();r.sdFlag=G.flag.pos;const q0=G.P.map(p=>p.pos.slice());G.rs='live';G.rt=60;
  await new Promise(z=>setTimeout(z,4000));r.sdMoved=G.P.filter((p,i)=>p.bot&&Math.hypot(p.pos[0]-q0[i][0],p.pos[2]-q0[i][2])>1).length;r.sdInside=G.P.every(p=>Math.abs(p.pos[0])<=MX+.1&&Math.abs(p.pos[2])<=MZ+.1&&p.pos[1]>-1);r.sdOut=G.P.filter(p=>Math.abs(p.pos[0])>MX+.1||Math.abs(p.pos[2])>MZ+.1||p.pos[1]<=-1).map(p=>[p.id,p.alive,p.pos.map(v=>+v.toFixed(1))]);r.MX=[MX,MZ];return r});
 a.errs=errs.length;const ok=a.spawn&&a.sd&&a.sdSpawn&&a.inBounds&&a.sdInside&&!errs.length&&a.moved>0&&a.sdMoved>0;if(!ok)bad++;a.ok=ok;R.push(a);console.log(JSON.stringify(a),errs.slice(0,2));await h.close()}
console.log('SMOKE',bad?'FAIL '+bad:'ALL PASS',R.length);await br.close()})();
