require('./testguard');const {launch,open,sleep}=require('./b3lib');
(async()=>{const br=await launch();const errs=[];const h=await open(br,errs,'?fakenet&gfx='+(process.env.T||'high'));await sleep(1500);const ev=(f,a)=>h.evaluate(f,a);
 await ev(()=>{botThink=function(){return {f:0,r:0,yaw:0,pitch:0}};practice(12)});await sleep(4000);await ev(async()=>{for(let i=0;i<80&&G.rs!=='live';i++){if(G.rs==='vote'||G.rs==='pre')G.rt=Math.min(G.rt,.05);await new Promise(r=>setTimeout(r,250))}document.querySelectorAll('#hud,.hud').forEach(e=>e.style.visibility='hidden')});
 console.log(JSON.stringify(await ev(()=>({cz:__czInfo(),sc:typeof __spawnClear==='function'?__spawnClear():null,vm:typeof validateMaps==='function'?(()=>{try{return validateMaps()}catch(e){return 'ERR '+e.message}})():null}))).slice(0,1500));
 for(const [n,c] of Object.entries(JSON.parse(process.env.CAMS||'{}'))){await ev(c=>{window.__cam=c},c);await sleep(2500);await h.screenshot({path:'/tmp/'+n+'.png'})}
 console.log(JSON.stringify(errs.slice(0,5)));await br.close()})();
