require('./testguard');const pp=require('puppeteer-core');const sleep=t=>new Promise(r=>setTimeout(r,t));
const ARGS=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-renderer-backgrounding','--disable-background-timer-throttling'];
(async()=>{const b=await pp.launch({executablePath:'/usr/bin/google-chrome',headless:'new',protocolTimeout:90000,args:ARGS});const errs=[];
const np=async()=>{const p=await b.newPage();await p.setViewport({width:1280,height:720});p.on('pageerror',e=>errs.push(''+e));p.on('console',m=>{if(m.type()==='error'&&!/404/.test(m.text()))errs.push(m.text())});return p};
let p=await np();await p.goto('http://localhost:8765/index.html');await sleep(1500);
await p.click('#bXh');await sleep(300);
await p.evaluate(()=>{const set=(id,v,ev='input')=>{const e=document.getElementById(id);if(e.type==='checkbox')e.checked=v;else e.value=v;e.dispatchEvent(new Event(ev,{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}))};
 set('xhStyle','crossdot');set('xhHex','#ff2fd0');set('xhSize',14);set('xhThick',3);set('xhGap',6);set('xhOp',0.85);set('xhDyn',false)});
await sleep(300);await p.screenshot({path:'v4-crosshair.png'});
const before=await p.evaluate(()=>JSON.stringify(__api.xhCfg()));
await p.reload();await sleep(1500);
const after=await p.evaluate(()=>JSON.stringify(__api.xhCfg()));
const hud=await p.evaluate(()=>[document.getElementById('xhStyle').value,document.getElementById('xhHex').value]);
console.log('before',before,'\nafter reload',after,'match',before===after,'menu controls',hud);
await p.click('#bXh');await sleep(200);await p.click('#xhReset');await sleep(200);
console.log('after reset',await p.evaluate(()=>JSON.stringify(__api.xhCfg())));
await p.close();
p=await np();await p.goto('http://localhost:8765/index.html?practice&map=0');await sleep(2500);
console.log('vote visible',await p.evaluate(()=>getComputedStyle(document.getElementById('vote')).display),await p.evaluate(()=>document.querySelectorAll('#vote img').length));
await p.screenshot({path:'v4-vote.png'});await p.close();
for(let mi=0;mi<6;mi++){p=await np();await p.goto(`http://localhost:8765/index.html?overview&practice&map=${mi}&speed=3`);
 for(let i=0;i<40;i++){await sleep(500);if(await p.evaluate(()=>__api.G.rs==='live'))break}await sleep(800);
 await p.screenshot({path:`v4-map${mi+1}.png`});await p.close()}
p=await np();await p.goto('http://localhost:8765/index.html?practice&map=5&speed=3');
for(let i=0;i<40;i++){await sleep(500);if(await p.evaluate(()=>__api.G.rs==='live'))break}
await p.evaluate(()=>{const m=__api.G.P[__api.ME];m.pos.set(-12,0,-17);m.yaw=Math.PI*0.88;m.pitch=0.05});await sleep(1200);
await p.screenshot({path:'v4-castle.png'});
console.log('errors',errs);await b.close()})();
