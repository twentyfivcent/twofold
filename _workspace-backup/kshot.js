require('./testguard');const {launch,open,sleep}=require('./b3lib');
(async()=>{const br=await launch();const errs=[];const h=await open(br,errs,'?fakenet&tod=day');await sleep(2000);const ev=(f,a)=>h.evaluate(f,a);
 await ev(()=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};practice(0)});await sleep(4000);
 await ev(async()=>{for(let i=0;i<80&&G.rs!=='live';i++){if(G.rs==='vote'||G.rs==='pre')G.rt=Math.min(G.rt,.05);await new Promise(r=>setTimeout(r,250))}setInterval(()=>{MELSEL=true},50)});
 for(const c of (process.env.CH||'ch_atlas').split(',')){await ev(async c=>{ACC.equipped=ACC.equipped||{};ACC.owned=ACC.owned||{};ACC.equipped._char=c;ACC.owned[c]=1;await new Promise(r=>setTimeout(r,1500))},c);
  await h.screenshot({path:'/tmp/knife-'+c+'.png'})}
 console.log(JSON.stringify(errs.slice(0,5)));await br.close()})();
