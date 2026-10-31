require('./testguard');const puppeteer=require('puppeteer-core');const {PNG}=require('pngjs');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const br=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-angle=swiftshader','--window-size=1024,576']});const pg=await br.newPage();await pg.setViewport({width:1024,height:576});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('http://localhost:8765/index.html?q=low&practice&map=0');await sleep(4000);
const ids=process.argv[2].split(',');const shot=async()=>PNG.sync.read(await pg.screenshot());
for(const id of ids){
 const am=await pg.evaluate(id=>{const G=__api.G;G.rs='live';G.rt=999;for(const p of G.P)if(p.id!==__api.ME){p.pos=[60,-60,60];p.hp=9999}const me=G.P[__api.ME];me.alive=true;me.hp=100;me.pos=[0,0,-10];me.yaw=Math.PI;me.pitch=0;window.__forceADS=1;__api.equip(me,[id,'sparrow','frag']);me.reloadT=0;me.swapT=0;},id);await sleep(1000);
 const a=await shot();await pg.screenshot({path:'/tmp/ads/'+id+'.png'});await pg.evaluate(()=>window.__hideVM=1);await sleep(150);const b=await shot();await pg.evaluate(()=>window.__hideVM=0);
 const W=a.width,H=a.height;let n=0,d=0,s=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;const df=Math.abs(a.data[i]-b.data[i])+Math.abs(a.data[i+1]-b.data[i+1])+Math.abs(a.data[i+2]-b.data[i+2]);const c=Math.abs(x-W/2)<W*.04&&Math.abs(y-H/2)<H*.04;if(c){n++;if(df>40)d++}if(df>40)s++}
 const r=await pg.evaluate(()=>{const me=__api.G.P[__api.ME];return {w:me.wpn||me.cur,ads:+(me.adsAmt||0).toFixed(2),alive:me.alive}});
 console.log(JSON.stringify({id,center:+(d/n*100).toFixed(1),screen:+(s/W/H*100).toFixed(1),...r}));}
console.log('errs',JSON.stringify(errs));await br.close();})();
