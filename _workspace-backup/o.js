require('./testguard');const pp=require('puppeteer-core');const sleep=t=>new Promise(r=>setTimeout(r,t));
(async()=>{const b=await pp.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage();await p.setViewport({width:1280,height:720});await p.goto('http://localhost:8765/index.html?overview&practice&map=5&speed=3');
for(let i=0;i<60;i++){await sleep(500);if(await p.evaluate(()=>__api.G.rs==='live'))break}await sleep(800);await p.screenshot({path:'v4-map6.png'});await b.close()})();
