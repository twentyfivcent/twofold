require('./testguard');const {launch,open,sleep}=require('./b3lib');
const live=async ev=>ev(async()=>{for(let i=0;i<80&&G.rs!=='live';i++){if(G.rs==='vote'||G.rs==='pre')G.rt=Math.min(G.rt,.05);await new Promise(r=>setTimeout(r,250))}});
(async()=>{const br=await launch();const errs=[];
 for(const [mi,shots] of [[12,1],[6,0]]){const h=await open(br,errs,'?fakenet&gfx=high&tod=dusk');await sleep(1500);const ev=(f,a)=>h.evaluate(f,a);
  await ev(mi=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};practice(mi)},mi);await sleep(5000);await live(ev);
  if(mi===12){await ev(()=>{document.querySelectorAll('#hud,.hud').forEach(e=>e.style.visibility='hidden');window.__cam={p:[-1,4.6,-5],l:[-9,.4,-15],fov:72}});await sleep(3000);await h.screenshot({path:'shots/v8d3b-casino-high.png'});
   await ev(()=>{window.__cam=null;ACC.equipped._char='ch_atlas';const me=G.P[ME];window.__pin=[{i:ME,pos:[-3,0,-6*1.3],yaw:me.yaw,pitch:-.25}];setInterval(()=>{MELSEL=true},40)});await sleep(2500);await h.screenshot({path:'shots/v8d3b-knife-hands.png'})}
  else{await ev(()=>{window.__cam={p:[6,4,-20],l:[0,1,0],fov:70}});await sleep(3000);await h.screenshot({path:'shots/v8d3b-hoshikawa-high.png'})}
  await h.close()}
 console.log(JSON.stringify(errs.slice(0,4)));await br.close()})();
