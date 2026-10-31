require('./testguard.js');const {launch,open,sleep}=require('./b3lib.js');(async()=>{const br=await launch();const e=[];const p=await open(br,e);
await p.evaluate(()=>{window.__noAutoFS=1;try{menuTab('mCrates')}catch(x){}});await sleep(1500);await p.screenshot({path:'progress/v8d1-menu-crates.png'});
await p.evaluate(()=>practice(6));await sleep(3000);await p.evaluate(()=>{G.rs='live'});await sleep(1500);await p.screenshot({path:'progress/v8d1-gameplay.png'});
console.log('errs',e);await br.close()})();
