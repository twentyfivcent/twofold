require('./testguard');// Bot stuck test: every map, 4 bots (autoplay) at speed 4; reports the longest no-progress time per map (target < 1.5s).
const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const maps=(process.argv[2]||'0,1,2,3,4,5,6,7,8,9,10').split(',').map(Number),WAIT=+(process.argv[3]||45000);
(async()=>{const br=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',protocolTimeout:300000,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-renderer-backgrounding','--disable-background-timer-throttling','--disable-backgrounding-occluded-windows']});
const out={};await Promise.all(maps.map(async m=>{const pg=await br.newPage();await pg.setViewport({width:480,height:270});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.goto(`http://localhost:8765/index.html?q=low&speed=4&autoplay&practice&map=${m}&tod=day`);await sleep(WAIT);
 out[m]=await pg.evaluate(()=>{const G=window.__G;const k=G.mapDef.n;return {map:k,rn:G.rn,np:(window.__npMax||{})[k]||0,at:(window.__npAt||{})[k],oldStuck:(window.__botStuckMax||{})[k]||0,kills:G.P.map(p=>p.k).join(',')}});out[m].errs=errs.slice(0,3);await pg.close()}));
console.log(JSON.stringify(out,null,0).replace(/\},/g,'},\n'));const worst=Math.max(...Object.values(out).map(o=>o.np));console.log('WORST',worst,worst<1.5?'PASS':'FAIL');await br.close()})();
