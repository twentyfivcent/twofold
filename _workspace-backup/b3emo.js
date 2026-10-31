require('./testguard');const {launch,open,sleep}=require('./b3lib');(async()=>{const br=await launch();const errs=[],R={};const h=await open(br,errs);
await h.evaluate(()=>__api.hostOnline());await sleep(800);const code=await h.evaluate(()=>__api.LOBBY.code);const c=await open(br,errs);await c.evaluate(cd=>__api.joinOnline(cd),code);await sleep(2500);
await h.evaluate(()=>__api.hostStartMatch());await sleep(4000);await h.evaluate(()=>{G.rs='live';G.rt=999;for(const p of G.P)if(p.bot)p.pos=[p.pos[0],-50,p.pos[2]]});await c.bringToFront();
const keys=['forward','back','left','right','jump','crouch','fire','ads','reload','prim','sec','util','melee','nextw','prevw','damage'];R.cancel={};
for(const k of keys){await c.evaluate(()=>{const me=G.P[ME];me.emo=null;me.alive=true;me.hp=100;me._emoHp=undefined;me.reloadT=0;me.swapT=0;me.meleeT=0;me.cook=-1;me.crouch=false;WHL=false;for(const k in K)K[k]=false});await sleep(1500);await c.evaluate(()=>{G.rt=999;window.__emoCancel='';const me=G.P[ME];me.reloadT=0;me.swapT=0;me.meleeT=0;me.cook=-1;emoPlay('emo_wave')});await sleep(700);const before=await c.evaluate(()=>[!!G.P[ME].emo,window.__emoCam,window.__emoCancel,G.P[ME].alive]);
 const hb=await h.evaluate(()=>G.P.filter(p=>p.emo).map(p=>p.name).length);
 await c.evaluate(k=>{window.__emoCancel='';if(k==='damage'){G.P[ME].hp-=10}else K[kc(k)]=true},k);await sleep(300);await c.evaluate(k=>{if(k!=='damage')K[kc(k)]=false},k);
 const after=await c.evaluate(()=>[!!G.P[ME].emo,window.__emoCancel]);await sleep(600);const ha=await h.evaluate(()=>G.P.filter(p=>p.emo).length);
 R.cancel[k]={before,hostBefore:hb,after,hostAfter:ha};await c.evaluate(()=>{const me=G.P[ME];me.crouch=false;me.vel=[0,0,0]});await sleep(500)}
// smooth snap-back
await c.evaluate(()=>{G.P[ME].emo=null;emoPlay('emo_wave')});await sleep(700);R.blend=await c.evaluate(async()=>{K[kc('forward')]=true;const o=[];for(let i=0;i<8;i++){await new Promise(r=>requestAnimationFrame(r));o.push(!!EMO.out)}K[kc('forward')]=false;return o});
console.log(JSON.stringify(R,null,0));console.log('ERRS',JSON.stringify(errs));await br.close()})();
