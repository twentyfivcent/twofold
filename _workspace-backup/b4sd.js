require('./testguard');const {launch,open,sleep}=require('./b3lib');(async()=>{const br=await launch();const errs=[],R={};
let h=await open(br,errs,'');await sleep(1500);
R.header=await h.evaluate(()=>document.querySelector('.ptitle span').textContent);
const ops=[];for(let i=0;i<40;i++){ops.push(await h.evaluate(()=>[+(performance.now()/1000-MPAN.t0).toFixed(2),+(window.__mpanOp||0).toFixed(3),window.__mpan&&window.__mpan.i]));await sleep(500)}R.fade=ops;await h.close();
for(const mi of (process.argv[2]||'0,8,11').split(',').map(Number)){h=await open(br,errs,'tod=day');await h.evaluate(mi=>practice(mi),mi);await sleep(2500);
 const r=await h.evaluate(()=>{G.sc=[ROUNDS_TO_WIN-1,ROUNDS_TO_WIN-1];roundStart();return {n:G.mapDef.n,sd:G.sd,flag:G.flag.pos,box:G.boxes.length,sp:checkSpawns('t').ok}});
 await sleep(2500);await h.evaluate(()=>{window.__cam={p:[0,30,-34],l:[0,0,-4],fov:60}});await sleep(800);
 const f='progress/v7-suddendeath-'+r.n.split(' \u2014')[0].toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.png';await h.screenshot({path:f});r.shot=f;R[mi]=r;await h.close()}
console.log(JSON.stringify(R));console.log('ERRS',JSON.stringify(errs));await br.close()})();
