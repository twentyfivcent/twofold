require('./testguard');const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',protocolTimeout:90000,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-renderer-backgrounding','--disable-background-timer-throttling','--disable-backgrounding-occluded-windows']});
const U='http://localhost:8765/index.html?fakenet&q=low';const errs=[];const P=[];const R={};const LOBBYWAIT=+(process.argv[2]||12000);
for(let i=0;i<4;i++){const p=await b.newPage();await p.setViewport({width:900,height:500});p.on('pageerror',e=>errs.push(i+': '+e));p.on('console',m=>{if(m.type()==='error'&&!/404|supabase|Failed to load/i.test(m.text()))errs.push(i+' console: '+m.text())});await p.goto(U);await p.evaluate(n=>{const e=document.querySelector('#nameIn');if(e){e.value=n;e.dispatchEvent(new Event('input'))}},['Host','Cli1','Cli2','Cli3'][i]);P.push(p)}
const [H,...C]=P;
await H.evaluate(()=>__api.hostOnline());await sleep(500);const code=await H.evaluate(()=>__api.LOBBY.code);
for(const c of C){await c.evaluate(c=>__api.joinOnline(c),code);await sleep(700)}
R.lobby=await H.evaluate(()=>__api.LOBBY.slots.map(s=>s?s.name:'-').join(','));
await sleep(LOBBYWAIT); // players idle in lobby
await H.evaluate(()=>__api.hostStartMatch());
await sleep(12000);
R.after=await Promise.all(P.map(p=>p.evaluate(()=>__api.G?{me:__api.ME,humans:__api.G.P.map(p=>p.bot?'b':'h').join(''),rs:__api.G.rs}:{menu:document.querySelector('#menuMsg').textContent})));
if(process.argv[3]){// drop + rejoin test: kill client 1's connection
 await C[0].evaluate(()=>window.__api.simDrop&&__api.simDrop());await sleep(9000);
 R.rejoin=await Promise.all(P.map(p=>p.evaluate(()=>__api.G?{me:__api.ME,humans:__api.G.P.map(p=>p.bot?'b':'h').join(''),names:__api.G.P.map(p=>p.name).join('|')}:{menu:document.querySelector('#menuMsg').textContent})));}
console.log(JSON.stringify(R,null,1));console.log('errs',errs.slice(0,10));await b.close()})();
