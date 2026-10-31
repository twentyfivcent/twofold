require('./testguard');const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',protocolTimeout:120000,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-renderer-backgrounding','--disable-background-timer-throttling','--disable-backgrounding-occluded-windows']});
const U='http://localhost:8765/'+(process.env.TF_PAGE||'index.html')+'?fakenet&q=low';const P=[];
for(let i=0;i<3;i++){const p=await b.newPage();await p.setViewport({width:800,height:450});await p.goto(U);
 await p.evaluate(n=>{const e=document.querySelector('#nameIn');e.value=n;e.dispatchEvent(new Event('input'));window.__ns={};const o=netSend;window.netSend=netSend=function(c,m){try{const s=JSON.stringify(m).length;const k=m&&m.t||'?';const r=__ns[k]||(__ns[k]={n:0,max:0});r.n++;if(s>r.max)r.max=s}catch(e){}return o(c,m)}},['H','C1','C2'][i]);P.push(p)}
const [H,C1,C2]=P;await H.evaluate(()=>__api.hostOnline());await sleep(500);const code=await H.evaluate(()=>__api.LOBBY.code);
for(const c of [C1,C2]){await c.evaluate(c=>__api.joinOnline(c),code);await sleep(800)}
await H.evaluate(()=>__api.hostStartMatch());await sleep(+process.env.T||25000);
for(const [n,p] of [['host',H],['c1',C1]]){const r=await p.evaluate(()=>window.__ns);const top=Object.entries(r).sort((a,b)=>b[1].max-a[1].max).slice(0,8);console.log(n,JSON.stringify(top))}
await b.close()})();
