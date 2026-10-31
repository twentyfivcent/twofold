require('./testguard');const {launch,open,sleep}=require('./b3lib');const fs=require('fs');fs.mkdirSync('progress',{recursive:true});
(async()=>{const br=await launch();const errs=[];const h=await open(br,errs,'?fakenet&gfx='+(process.env.T||'med'));await sleep(1500);
await h.evaluate(()=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};practice(0)});await sleep(6000);
const chars=(process.env.CH||'op').split(',');const out=[];
for(const c of chars){await h.evaluate(c=>{ACC.equipped=ACC.equipped||{};ACC.equipped._char=c;ACC.owned=ACC.owned||{};ACC.owned[c]=1;for(const p of G.P)if(p.id!==ME)p.pos=[999,-50,999];const me=G.P[ME];me.pitch=-.05;MELSEL=true;if(!document.getElementById('khs')){const s=document.createElement('style');s.id='khs';s.textContent='body>*:not(canvas){visibility:hidden!important}';document.head.appendChild(s)}},c);await sleep(2500);
 const r=await h.evaluate(()=>window.__knifeHands&&__knifeHands());out.push({c,r});console.log(c,JSON.stringify(r));if(process.env.SHOT)await h.screenshot({path:`progress/knife-${c}.png`})}
console.log('ERRS',JSON.stringify(errs.slice(0,3)));await br.close()})();
