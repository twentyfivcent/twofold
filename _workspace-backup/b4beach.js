require('./testguard');const {launch,open,sleep}=require('./b3lib');(async()=>{const br=await launch();const errs=[];const h=await open(br,errs,'tod=day');await h.evaluate(()=>practice(11));await sleep(3000);
await h.evaluate(()=>{G.rs='live';window.__cam={p:[-22,16,-40],l:[4,0,-6],fov:62}});await sleep(1500);await h.screenshot({path:'progress/v7-map-coral-point.png'});
await h.evaluate(()=>{window.__cam={p:[-14,5,-30],l:[40,2,10],fov:70}});await sleep(1200);await h.screenshot({path:'progress/v7-map-coral-point-backdrop.png'});
console.log('ERRS',JSON.stringify(errs));await br.close()})();
