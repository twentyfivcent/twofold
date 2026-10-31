require('./testguard');const {launch,open,sleep}=require('./b3lib');(async()=>{const br=await launch();const errs=[],R={};const h=await open(br,errs);
const page=(p,id)=>p.evaluate(id=>{MSEL=id;document.querySelectorAll('.mpage').forEach(e=>e.classList.toggle('hide',e.id!==id));renderMenu()},id);
await h.evaluate(async()=>{await ACC.signUp('twentyfivcent','secret123');await ACC.signOut();await ACC.signUp('plainuser','secret123');await ACC.signOut();await ACC.signUp('weebier','secret123');
 for(const p of Object.values(__SBDB.profiles))p.money=99999;localStorage.setItem('__sbdb',JSON.stringify(__SBDB));await ACC.signOut();await ACC.signIn('weebier','secret123');window.__fastReel=1});
await page(h,'mCrates');await sleep(2500);await h.evaluate(()=>{const x=document.querySelector('.xcrate');x&&x.scrollIntoView()});await sleep(400);R.xcrates=await h.evaluate(()=>document.querySelectorAll('.xcrate').length);await h.screenshot({path:'progress/v7-crates-char-emote.png'});
R.open=await h.evaluate(async()=>{const got=[];for(let i=0;i<6;i++){await ACC.buyKey('cast');const r=await ACC.openCrate('cast');got.push(r.skin||r.error)}for(let i=0;i<5;i++){await ACC.buyKey('motion');const r=await ACC.openCrate('motion');got.push(r.skin||r.error)}return got});
await h.evaluate(async()=>{await ACC.buyKey('cast');renderMenu()});await sleep(300);await h.evaluate(()=>openReel('cast'));await sleep(1500);await h.screenshot({path:'progress/v7-char-unbox.png'});await h.evaluate(()=>{const b=$('#reelClose');b&&b.click()});
const own=await h.evaluate(()=>Object.keys(ACC.owned).filter(k=>k.startsWith('ch_')));R.ownedChars=own;
await h.evaluate(async c=>{await ACC.equip('_char',c)},own[0]);await page(h,'mLoad');await sleep(2500);R.eqChar=await h.evaluate(()=>ACC.equipped._char);await h.screenshot({path:'progress/v7-loadout-characters.png'});
// new skins sheet
await h.evaluate(()=>{const d=document.createElement('div');d.id='sk3';d.style.cssText='position:fixed;inset:0;z-index:99;background:#0b0e14;display:grid;grid-template-columns:repeat(5,1fr);gap:8px;padding:12px;color:#ddd;font:12px sans-serif';
 for(const S of SKINS3){const t=skinCanvas(S);const src=t.image||t;const c=document.createElement('canvas');c.width=256;c.height=128;c.getContext('2d').drawImage(src,0,0,256,128);const w=document.createElement('div');w.style.cssText='text-align:center';c.style.cssText='width:100%;height:110px;border:2px solid '+RAR[S.rar].c;w.appendChild(c);w.insertAdjacentHTML('beforeend',`<div>${S.n} <span style="color:${RAR[S.rar].c}">(${S.crate})</span></div>`);d.appendChild(w)}document.body.appendChild(d)});
await sleep(800);await h.screenshot({path:'progress/v7-new-skins.png'});await h.evaluate(()=>$('#sk3').remove());
// MP: host weebier (char equipped), client twentyfivcent, late guest spoofing "weebier" + replaying the host's nonce
await page(h,'mPlay');await h.evaluate(()=>__api.hostOnline());await sleep(800);const code=await h.evaluate(()=>__api.LOBBY.code);
const c=await open(br,errs);await c.evaluate(async()=>{await ACC.signIn('twentyfivcent','secret123')});await sleep(500);await c.evaluate(cd=>__api.joinOnline(cd),code);await sleep(3000);
R.lobbyTagsClient=await c.evaluate(()=>[...document.querySelectorAll('#lobby .devtag')].map(e=>e.parentElement.textContent.trim().slice(0,30)));
await h.evaluate(()=>{const s=__api.LOBBY;s.map=MAPS.findIndex(m=>/Marbleway/.test(m.n))});await h.evaluate(()=>__api.hostStartMatch());await sleep(4000);
await h.evaluate(()=>{G.rs='live';G.rt=999;FRUIT.slice(0,3).forEach((f,i)=>{handleEvent({t:'fruit',i})})});R.mapH=await h.evaluate(()=>G.mapDef.n);
await c.evaluate(()=>{emoPlay('emo_wave')});await sleep(1200);
R.sync=await h.evaluate(()=>G.P.filter(p=>!p.bot).map(p=>({n:p.name,chr:p.chr||charOf(p),emo:p.emo&&p.emo.id,mesh:pMeshes[p.id]&&pMeshes[p.id].userData.charId})));
R.syncC=await c.evaluate(()=>G.P.filter(p=>!p.bot).map(p=>({n:p.name,chr:charOf(p),mesh:pMeshes[p.id]&&pMeshes[p.id].userData.charId})));
await c.bringToFront();await c.evaluate(()=>{G.P[ME].emo=null;emoPlay('emo_wave')});await sleep(600);await h.bringToFront();await sleep(400);R.hostSeesEmo=await h.evaluate(()=>G.P.filter(p=>p.emo).map(p=>p.name+':'+p.emo.id));await h.evaluate(cid=>{const p=G.P.find(x=>!x.bot&&x.id!==ME);const me=G.P[ME];window.__cam={p:[p.pos[0]+2.2,p.pos[1]+1.8,p.pos[2]+2.2],l:[p.pos[0],p.pos[1]+1,p.pos[2]],fov:55}});await sleep(900);await h.screenshot({path:'progress/v7-mp-emote-sync.png'});await h.evaluate(()=>{window.__cam=null});
await c.bringToFront();await sleep(500);
const vid=await h.evaluate(()=>{const v=G.P.find(x=>x.bot&&x.alive&&x.team!==G.P[ME].team);__api.damage(v.id,ME,500,'kestrel',false,G.P[ME].pos,'chest');return v.id});R.dead=await h.evaluate(v=>({alive:G.P[v].alive,rv:G.P[v]._rv,n:RAGS.length}),vid);await sleep(1500);R.ragClient=await c.evaluate(()=>window.__rags().map(r=>r.pid));await c.screenshot({path:'progress/v7-ragdoll-mp-client.png'});R.ragHost=await h.evaluate(()=>window.__rags().map(r=>r.pid));R.vid=vid;
// late joiner (guest) gets shot fruit; spoof: names itself "weebier" and replays the host's nonce
const g=await open(br,errs);await g.evaluate(async()=>{if(ACC.ok())await ACC.signOut()});await g.evaluate(()=>{$('#nameIn').value='weebier';try{$('#nameIn').dispatchEvent(new Event('input'));$('#nameIn').dispatchEvent(new Event('change'))}catch(e){}});
const hpk=await h.evaluate(()=>window.__dev.DEVPK);await g.evaluate(k=>{window.__spoofPk=k;const _ns=netSend;netSend=function(c,m){if(m&&m.t==='hello')m.pk=window.__spoofPk;return _ns.apply(this,arguments)}},hpk);
await g.evaluate(cd=>__api.joinOnline(cd),code);await sleep(3000);await h.evaluate(()=>{promotePending()});await sleep(3000);
R.fruitHost=await h.evaluate(()=>window.__fruit().slice(0,5));R.fruitLate=await g.evaluate(()=>window.__fruit?window.__fruit().slice(0,5):null);
R.names=await h.evaluate(()=>G.P.filter(p=>!p.bot).map(p=>p.name));
const tags=async p=>p.evaluate(()=>G.P.filter(x=>!x.bot).map(x=>x.name+':'+(devB(x.name)?'DEV':'-')));
await sleep(3500);R.tagsHost=await tags(h);R.tagsClient=await tags(c);R.tagsGuest=await tags(g);
await c.bringToFront();await c.evaluate(()=>{K[kc('score')]=true});await sleep(600);await c.screenshot({path:'progress/v7-dev-verified-scoreboard.png'});
console.log(JSON.stringify(R,null,1));console.log('ERRS',JSON.stringify(errs));await br.close()})();
