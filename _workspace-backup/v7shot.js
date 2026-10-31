require('./testguard');const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-renderer-backgrounding','--disable-background-timer-throttling']});
const U='http://localhost:8765/index.html?fakenet&q=low';const P=[];for(let i=0;i<2;i++){const p=await b.newPage();await p.setViewport({width:1100,height:650});await p.goto(U);P.push(p)}await sleep(3000);
await P[0].evaluate(()=>__api.hostOnline());await sleep(500);const code=await P[0].evaluate(()=>__api.LOBBY.code);
await P[1].evaluate(c=>__api.joinOnline(c),code);await sleep(2000);await P[1].bringToFront();
const info=await P[1].evaluate(()=>{const e=[...document.querySelectorAll('button')].find(x=>/Switch to/.test(x.textContent));return e?{txt:e.textContent,vis:e.offsetParent!==null}:null});
console.log(JSON.stringify(info));await P[1].screenshot({path:'progress/v7-switch-team.png'});await b.close()})();
