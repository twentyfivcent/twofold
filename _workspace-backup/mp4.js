require('./testguard');const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',protocolTimeout:30000,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-renderer-backgrounding','--disable-background-timer-throttling','--disable-backgrounding-occluded-windows']});
const U='http://localhost:8765/index.html?fakenet';const errs=[];const P=[];
for(let i=0;i<5;i++){const p=await b.newPage();await p.setViewport({width:800,height:450});p.on('pageerror',e=>errs.push(i+': '+e));await p.goto(U);await p.evaluate(n=>{const e=document.querySelector('#nameIn');e.value=n;e.dispatchEvent(new Event('input'))},['Host','Cli1','Cli2','Cli3','Cli4'][i]);P.push(p)}
const [H,...C]=P;
const lob=p=>p.$eval('#lobbyTeams',e=>e.innerText.replace(/\n/g,' | '));
await H.evaluate(()=>__api.hostOnline());await sleep(300);const code=await H.evaluate(()=>__api.LOBBY.code);console.log('code',code);
for(let i=0;i<3;i++){await C[i].evaluate(c=>__api.joinOnline(c),code);await sleep(600)}
console.log('host lobby :',await lob(H));for(let i=0;i<3;i++)console.log('cli'+(i+1)+' lobby:',await lob(C[i]));
await C[3].evaluate(c=>__api.joinOnline(c),code);await sleep(800);
console.log('5th joiner msg:',await C[3].$eval('#menuMsg',e=>e.textContent),'| in lobby?',await C[3].evaluate(()=>!document.querySelector('#lobby').classList.contains('hide')));
// switching: full teams -> switch should be refused; then make room test via swap? test switch when a slot free is covered below
await C[0].evaluate(()=>document.querySelector('#bSwitch').click());await sleep(400);
console.log('switch with full teams ->',await lob(H),'| msg:',await C[0].$eval('#lobbyMsg',e=>e.textContent));
await H.evaluate(()=>__api.hostStartMatch());await sleep(1500);
const st=await H.evaluate(()=>__api.G.P.map(p=>[p.name,p.team,p.bot]));console.log('match slots:',JSON.stringify(st),'bots:',st.filter(x=>x[2]).length);
for(let i=0;i<3;i++)console.log('cli'+(i+1)+' ME=',await C[i].evaluate(()=>__api.ME),'started',await C[i].evaluate(()=>!!__api.G));
await sleep(13500);// past pre-round
const before=await H.evaluate(()=>__api.G.P.map(p=>p.pos.map(v=>+v.toFixed(2))));
for(let i=0;i<3;i++){await C[i].bringToFront();await C[i].keyboard.down('KeyW');await sleep(900);await C[i].keyboard.up('KeyW')}
await sleep(400);
const after=await H.evaluate(()=>__api.G.P.map(p=>p.pos.map(v=>+v.toFixed(2))));
for(let i=0;i<3;i++){const s=await C[i].evaluate(()=>__api.ME);console.log('host sees cli'+(i+1)+' slot',s,JSON.stringify(before[s]),'->',JSON.stringify(after[s]))}

// ---- part 2: lobby switching with free slots, then mid-match joins replacing bots
const Q=[];for(let i=0;i<4;i++){const p=await b.newPage();await p.setViewport({width:800,height:450});p.on('pageerror',e=>errs.push('Q'+i+': '+e));await p.goto(U);await p.evaluate(n=>{const e=document.querySelector('#nameIn');e.value=n;e.dispatchEvent(new Event('input'))},['Host2','Late1','Late2','Late3'][i]);Q.push(p)}
await Q[0].evaluate(()=>__api.hostOnline());await sleep(300);const code2=await Q[0].evaluate(()=>__api.LOBBY.code);
await Q[1].evaluate(c=>__api.joinOnline(c),code2);await sleep(600);console.log('P2 lobby:',await lob(Q[0]));
await Q[1].evaluate(()=>document.querySelector('#bSwitch').click());await sleep(400);console.log('P2 after Late1 switch:',await lob(Q[0]),'| Late1 view:',await lob(Q[1]));
await Q[0].evaluate(()=>__api.hostStartMatch());await sleep(1000);
await Q[2].evaluate(c=>__api.joinOnline(c),code2);await sleep(300);await Q[3].evaluate(c=>__api.joinOnline(c),code2);await sleep(800);
console.log('late joiners in game:',await Q[2].evaluate(()=>!!__api.G),await Q[3].evaluate(()=>!!__api.G),'hint:',await Q[2].$eval('#hint',e=>e.textContent));
await Q[0].evaluate(()=>{const G=__api.G;G.rs='end';G.rt=0.01});await sleep(1500);
const st2=await Q[0].evaluate(()=>__api.G.P.map(p=>[p.name,p.team,p.bot]));console.log('after next round start:',JSON.stringify(st2),'bots:',st2.filter(x=>x[2]).length);
await sleep(13500);const b2=await Q[0].evaluate(()=>__api.G.P.map(p=>p.pos.map(v=>+v.toFixed(2))));
for(const i of [2,3]){await Q[i].bringToFront();await Q[i].keyboard.down('KeyW');await sleep(900);await Q[i].keyboard.up('KeyW')}await sleep(400);
const a2=await Q[0].evaluate(()=>__api.G.P.map(p=>p.pos.map(v=>+v.toFixed(2))));
for(const i of [2,3]){const s=await Q[i].evaluate(()=>__api.ME);console.log('host sees Late'+i+' slot',s,JSON.stringify(b2[s]),'->',JSON.stringify(a2[s]))}
const R=await b.newPage();await R.goto(U);await R.evaluate(c=>__api.joinOnline(c),code2);await sleep(800);console.log('5th mid-match msg:',await R.$eval('#menuMsg',e=>e.textContent));
console.log('errors',errs);await b.close()})().catch(e=>{console.log('FAIL',e.message);process.exit(1)});
