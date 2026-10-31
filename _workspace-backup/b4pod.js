require('./testguard');const {launch,open,sleep}=require('./b3lib');(async()=>{const br=await launch();const errs=[],R={};
const LY=JSON.parse(process.env.LY||'{"mw":1}');const maps=(process.argv[2]||'0,5,7').split(',').map(Number);
for(const mi of maps){const h=await open(br,errs,'tod=day');await h.evaluate((mi,ly)=>{window.__LY=ly;practice(mi)},mi,LY);await sleep(3500);
 await h.evaluate(()=>{G.rs='live';G.P.forEach((p,i)=>{p.k=3+i*2;p.d=4-i;p.dmg=300+i*150});const LY=window.__LY;if(LY.off)for(const i of LY.off){const p=G.P[i];p.off=true;p.alive=false;p.pos=[0,-60,0]}if(LY.mw){G.P[ME].k=14;G.P[ME].dmg=1500}G.sc=[5,2];ACC.lastEarn=95;addKF(`<span style="color:#ffd76a">+$95 earned</span>`);kfList[kfList.length-1].t=15;endRound(G.P[ME].team,'test')});
 await sleep(3500);await h.evaluate(()=>castMapVote(1));await sleep(1200);
 const nm=await h.evaluate(()=>G.mapDef.n);const f='progress/v7-podium-'+(process.env.SFX||'')+nm.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.png';await h.screenshot({path:f});
 R[nm]=await h.evaluate(()=>{const vis=[...document.querySelectorAll('#hud>*')].filter(e=>e.offsetParent!==null&&getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().width>0).map(e=>e.id);
  const pl=[...document.querySelectorAll('#podPlates .pplate')].map(e=>{const r=e.getBoundingClientRect();return [r.left|0,r.top|0,r.right|0,r.bottom|0]});return {vis,pl,W:innerWidth,H:innerHeight,pod:!!window.__podium}});R[nm].file=f;await h.close()}
console.log(JSON.stringify(R));console.log('ERRS',JSON.stringify(errs));await br.close()})();
