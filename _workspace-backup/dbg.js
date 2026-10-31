require('./testguard');const {launch,open,sleep}=require('./b3lib');
(async()=>{const br=await launch();const errs=[];const h=await open(br,errs,'?fakenet&q=low');await sleep(1500);
await h.evaluate(()=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};practice(0)});await sleep(4000);
console.log(await h.evaluate(async()=>{const o=[];document.exitPointerLock=()=>{o.push('x');locked=false;o.push('a'+locked);document.dispatchEvent(new Event('pointerlockchange'));o.push('b'+locked)};
 locked=true;o.push('0'+locked);gameMenuToggle();o.push('c'+locked);await new Promise(r=>setTimeout(r,50));o.push('d'+locked);return o.join(' ')}));
await br.close()})();
