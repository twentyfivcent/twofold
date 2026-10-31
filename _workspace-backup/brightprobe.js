require('./testguard');const {launch,open,sleep}=require('./b3lib');const tag=process.env.TAG||'after';const fs=require('fs');const tiers=(process.env.TIERS||'low,med,high').split(',');const only=process.env.MAPS?process.env.MAPS.split(',').map(Number):null;
(async()=>{const br=await launch();const errs=[];
for(const t of tiers){fs.mkdirSync(`bright/${tag}/${t}`,{recursive:true});const U='?fakenet&tod='+(process.env.TOD||'day')+'&gfx='+t+'&q='+({low:'low',med:'medium',high:'high'})[t];const n=13;const names=[];
 for(let i=0;i<n;i++){if(only&&!only.includes(i))continue;const h=await open(br,errs,U);await sleep(1200);await h.evaluate(i=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};practice(i)},i);await sleep(5000);
  const nm=await h.evaluate(()=>{const s=document.createElement('style');s.textContent='body>*:not(canvas){visibility:hidden!important}';document.head.appendChild(s);const me=G.P[ME];me.yaw=Math.atan2(-(0-me.pos[0]),-(0-me.pos[2]));me.pitch=-.05;for(const p of G.P)if(p!==me)p.pos=[999,-50,999];return G.mapDef.n});
  for(let y=0;y<4;y++){await h.evaluate(y=>{const me=G.P[ME];me.yaw+=y?Math.PI/2:0},y);await sleep(y?1800:3500);await h.screenshot({path:`bright/${tag}/${t}/${i}_${y}.png`})}names[i]=nm;console.log(t,i,nm);await h.close()}
 if(names.filter(Boolean).length===13)fs.writeFileSync(`bright/${tag}/names.json`,JSON.stringify(names))}
console.log('ERRS',errs.length);await br.close()})();
