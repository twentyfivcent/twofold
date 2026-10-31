require('./testguard.js');const {launch,open,sleep}=require('./b3lib.js');(async()=>{const br=await launch();const e=[];const p=await open(br,e);
console.log(await p.evaluate(()=>JSON.stringify({miss:Object.keys(W).filter(k=>!WIDS.includes(k)),n:WIDS.length})));await br.close()})();
