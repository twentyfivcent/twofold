require('./testguard');// DEV badge: menu leaderboard, in-game scoreboard (Tab), text chat (lobby + in-game). Mock Supabase + fakenet.
const puppeteer=require('puppeteer-core');const fs=require('fs');const sleep=ms=>new Promise(r=>setTimeout(r,ms));const MOCK=fs.readFileSync(__dirname+'/mock-supabase.js','utf8');
(async()=>{const br=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',protocolTimeout:180000,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-renderer-backgrounding','--disable-background-timer-throttling','--disable-backgrounding-occluded-windows']});
const errs=[],R={};const open=async(ctx)=>{const p=await (ctx||br).newPage();await p.setViewport({width:1280,height:720});p.on('pageerror',e=>errs.push(e.message));await p.setRequestInterception(true);p.on('request',r=>{if(r.url().includes('supabase-js'))r.respond({status:200,contentType:'application/javascript',body:MOCK});else r.continue()});await p.goto('http://localhost:8765/index.html?fakenet&q=low');await sleep(4000);return p};
const tags=(p,sel)=>p.evaluate(s=>[...document.querySelectorAll(s+' .devtag')].map(e=>{const cs=getComputedStyle(e);return e.parentElement.textContent.trim().slice(0,40)+'|anim='+cs.animationName}),sel);
const h=await open();
await h.evaluate(async()=>{await ACC.signUp('twentyfivcent','secret123');await ACC.signOut();await ACC.signUp('plainuser','secret123');await ACC.signOut();await ACC.signUp('weebier','secret123')});
await h.evaluate(()=>{MSEL='mStats';document.querySelectorAll('.mpage').forEach(e=>e.classList.toggle('hide',e.id!=='mStats'));renderMenu()});await sleep(1500);await h.evaluate(async()=>{await ACC.loadLB();renderMenu()});await sleep(500);
R.leaderboard=await tags(h,'#statsBody');await h.screenshot({path:'progress/v7-dev-leaderboard.png'});
// lobby chat: weebier hosts, guest 'twentyfivcent' joins (guest gets '_' suffix -> no badge)
await h.evaluate(()=>__api.hostOnline());await sleep(600);const code=await h.evaluate(()=>__api.LOBBY.code);const c=await open();/* same browser = shared mock session; simulate the other DEV account being signed in on this tab */await c.evaluate(()=>{ACC.acctName=()=>'twentyfivcent'});await c.evaluate(cd=>__api.joinOnline(cd),code);await sleep(2000);
await h.evaluate(()=>__api.sendChat('lobby hello from the dev',false));await sleep(300);await c.evaluate(()=>__api.sendChat('guest here',false));await sleep(800);await h.bringToFront();
R.lobbyChat=await tags(h,'#lchat');R.lobbyChatText=await h.evaluate(()=>document.querySelector('#lchat').innerText);R.lobbyNames=await tags(h,'#lobby');await h.screenshot({path:'progress/v7-dev-chat-lobby.png'});
// in-game: scoreboard (Tab) + in-game chat
await h.evaluate(()=>__api.hostStartMatch());await sleep(3500);await h.evaluate(()=>{__api.G.rs='live';__api.G.rt=999;__api.sendChat('in-game hi from the dev',false)});await sleep(500);
await h.evaluate(()=>{K[kc('score')]=true});await sleep(500);R.scoreboard=await tags(h,'#sb');R.ingameChat=await h.evaluate(()=>[...document.querySelectorAll('#chat .devtag, #chatLog .devtag, #feed .devtag')].length);
await h.screenshot({path:'progress/v7-dev-scoreboard.png'});await h.evaluate(()=>{K[kc('score')]=false});await sleep(400);await h.screenshot({path:'progress/v7-dev-chat.png'});
R.ingameChatText=await h.evaluate(()=>CHATLOG.map(x=>x.h.replace(/<[^>]+>/g,'')).join(' / '));
console.log(JSON.stringify(R,null,1));console.log('ERRS',JSON.stringify(errs));await br.close()})();
