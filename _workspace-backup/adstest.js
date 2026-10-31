require('./testguard');const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));const {PNG}=(()=>{try{return require('pngjs')}catch(e){return {}}})();
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const pg=await b.newPage();await pg.setViewport({width:960,height:540});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('http://localhost:8765/index.html?q=low&practice&map=0');await sleep(4000);
const ids=await pg.evaluate(()=>Object.keys(__api.W));const out=[];
await pg.evaluate(()=>{const G=__api.G;G.rs='live';G.rt=999;for(const p of G.P)if(p.id!==__api.ME){p.alive=false;p.pos=[0,-60,0]}const me=G.P[__api.ME];me.pos=[0,0,-10];me.yaw=Math.PI;me.pitch=0;window.__forceADS=1});
for(const id of ids){
 await pg.evaluate(id=>{const G=__api.G,me=G.P[__api.ME];__api.equip(me,[id,'sparrow','frag']);me.reloadT=0;me.swapT=0;me.pitch=0;},id);await sleep(900);
 const r=await pg.evaluate(async()=>{const c=document.querySelector('canvas');const grab=()=>new Promise(res=>requestAnimationFrame(()=>requestAnimationFrame(()=>{const t=document.createElement('canvas');t.width=c.width;t.height=c.height;const x=t.getContext('2d');x.drawImage(c,0,0);res(x.getImageData(0,0,t.width,t.height))})));
  const a=await grab();window.__hideVM=1;const b2=await grab();window.__hideVM=0;const W=a.width,H=a.height;let n=0,d=0,ctr=0;const bw=W*.14,bh=H*.14;
  for(let y=Math.floor(H/2-bh/2);y<H/2+bh/2;y++)for(let x=Math.floor(W/2-bw/2);x<W/2+bw/2;x++){const i=(y*W+x)*4;n++;const df=Math.abs(a.data[i]-b2.data[i])+Math.abs(a.data[i+1]-b2.data[i+1])+Math.abs(a.data[i+2]-b2.data[i+2]);if(df>40)d++}
  const big=[0,0];for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;const df=Math.abs(a.data[i]-b2.data[i])+Math.abs(a.data[i+1]-b2.data[i+1])+Math.abs(a.data[i+2]-b2.data[i+2]);big[0]++;if(df>40)big[1]++}
  const me=__api.G.P[__api.ME];return {center:+(d/n*100).toFixed(1),screen:+(big[1]/big[0]*100).toFixed(1),adsAmt:+me.adsAmt.toFixed(2)}});
 const w=await pg.evaluate(id=>{const w=__api.W[id];return {n:w.n,cls:w.cls,scope:!!w.scopeOv,sight:w.sight}},id);
 out.push({id,...w,...r});console.log(JSON.stringify(out[out.length-1]));
 if(id==='cinder'||id==='kestrel'||id==='corvid')await pg.screenshot({path:'/tmp/ads-'+id+'.png'})}
console.log('errs',errs);await b.close()})();
