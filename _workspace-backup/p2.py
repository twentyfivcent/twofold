s=open('index.html').read()
def rep(a,b,cnt=1):
    global s
    assert a in s,a[:80]; s=s.replace(a,b,cnt)
rep("const ROUNDS_TO_WIN=6, ROUND_TIME=60, FLAG_AT=40, FLAG_HOLD=3, PRE_TIME=5, END_TIME=4;","const ROUNDS_TO_WIN=6, ROUND_TIME=60, FLAG_AT=40, FLAG_HOLD=3, PRE_TIME=3, VOTE_TIME=10, END_TIME=4;")
rep("function chest(p){return [p.pos[0],p.pos[1]+pH(p)*.65,p.pos[2]]}","""function chest(p){return [p.pos[0],p.pos[1]+pH(p)*.65,p.pos[2]]}
// per-part hitboxes in the player's local frame (model faces -z); must match buildPlayerMesh proportions
function hipY(p){return p.crouch?.42:.85}
function partBoxes(q){const hy=hipY(q);return [['head',[-.15,hy+.6,-.15],[.15,hy+.95,.15]],['body',[-.24,hy,-.15],[.24,hy+.6,.15]],['limb',[.24,hy+.1,-.16],[.38,hy+.6,.16]],['limb',[-.38,hy+.1,-.16],[-.24,hy+.6,.16]],['limb',[-.22,0,-.14],[.22,hy,.14]]]}
function hitPlayer(q,o,d,maxT){const c=Math.cos(q.yaw),s=Math.sin(q.yaw);const rx=o[0]-q.pos[0],ry=o[1]-q.pos[1],rz=o[2]-q.pos[2];
 const lo=[rx*c-rz*s,ry,rx*s+rz*c],ld=[d[0]*c-d[2]*s,d[1],d[0]*s+d[2]*c];let best=maxT,part=null;
 for(const [n,mn,mx] of partBoxes(q)){const t=rayBox(lo,ld,mn,mx,best);if(t>=0&&t<best){best=t;part=n}}return part?{t:best,part}:null}
function hitScan(o,d,maxT,excl){let best=rayWorld(o,d,maxT),who=-1,part=null;for(const q of G.P){if(q.id===excl||!q.alive)continue;const h=hitPlayer(q,o,d,best);if(h){best=h.t;who=q.id;part=h.part}}return {t:best,who,part}}
const PART_I={head:0,body:1,limb:2},PARTS=['head','body','limb'];""")
rep("p.reloadT=0;p.fireCd=0;p.burst=0;p.cook=-1;p.swapT=0;p.shotIdx=0}","p.reloadT=0;p.fireCd=0;p.burst=0;p.cook=-1;p.swapT=0;p.shotIdx=0;p.rcAcc=0;p.rcT=0}")
rep(""" if(canFire&&p.util&&p.utilN>0){
  if(inp.util&&p.cook<0)p.cook=0;
  if(p.cook>=0){p.cook+=dt;const fuse=p.util==='frag'?3.2:1.6;
   if(!inp.util||p.cook>=fuse){throwUtil(p,Math.max(.05,fuse-p.cook));p.cook=-1;p.utilN--}}
 }""",""" p.rcT=(p.rcT||0)+dt;if(p.rcT>.12&&p.rcAcc>0){const r=Math.min(p.rcAcc,dt*Math.max(.15,p.rcAcc*7));p.pitch-=r;p.rcAcc-=r}
 if(canFire&&p.util&&p.utilN>0){const u=UT[p.util];
  if(u.inst||u.throwNow){if((inp.util&&!p.utilHeld)||p.cook>=0){if(u.inst)sendOrDo({t:'util',type:p.util},p.id);else throwUtil(p,3);p.utilN--;p.cook=-1;if(p.id===ME)SND.ui(u.inst?660:520)}}
  else{if(inp.util&&p.cook<0)p.cook=0;
  if(p.cook>=0){p.cook+=dt;const fuse=p.util==='frag'?3.2:p.util==='sticky'?2.5:1.6;
   if(!inp.util||p.cook>=fuse){throwUtil(p,p.util==='sticky'?2.5:Math.max(.05,fuse-p.cook));p.cook=-1;p.utilN--}}}
 }
 p.utilHeld=!!inp.util;""")
rep("if(inp.reload&&p.reloadT<=0&&slot.mag<w.mag&&slot.res>0){p.reloadT=w.rel;p.burst=0}","if(inp.reload&&p.reloadT<=0&&slot.mag<w.mag&&slot.res>0){p.reloadT=w.rel;p.burst=0;if(p.id===ME)SND.reload(w)}")
rep("if(slot.mag<=0){if(want&&slot.res>0)p.reloadT=w.rel;return}","if(slot.mag<=0){if(want&&slot.res>0){p.reloadT=w.rel;if(p.id===ME)SND.reload(w)}return}")
rep("if(slot.mag<=0&&slot.res>0)p.reloadT=w.rel+.15;","if(slot.mag<=0&&slot.res>0){p.reloadT=w.rel+.15;if(p.id===ME)SND.reload(w)}")
rep(""" for(let i=0;i<n;i++){const s=sp*DEG*Math.sqrt(Math.random())*(n>1?1:.6),a=Math.random()*Math.PI*2;dirs.push(dirYP(p.yaw+Math.cos(a)*s,p.pitch+Math.sin(a)*s))}
 const m=(ads?.65:1)*(p.crouch?.8:1);p.shotIdx++;
 p.pitch=Math.min(1.5,p.pitch+w.rv*.45*DEG*m*(.85+Math.random()*.3));
 p.yaw+=w.rh*.45*DEG*m*(Math.sin(p.shotIdx*.9+w.seed)+(Math.random()-.5)*.6);
 if(p.id===ME){VK.kick=Math.min(1,VK.kick+.25+w.rv*.06);VK.flash=.05;sfx(w,0)}""",""" if(window.__nospread)sp=0;
 const swy=p.id===ME&&ads?SWAY[0]:0,swp=p.id===ME&&ads?SWAY[1]:0;
 for(let i=0;i<n;i++){const s=sp*DEG*Math.sqrt(Math.random())*(n>1?1:.6),a=Math.random()*Math.PI*2;dirs.push(dirYP(p.yaw+swy+Math.cos(a)*s,p.pitch+swp+Math.sin(a)*s))}
 // recoil: per-gun learnable pattern (mostly vertical + snaking horizontal), small randomness, reduced by ADS/crouch, recovers after firing stops
 const m=(ads?.6:1)*(p.crouch?.75:1);const pt=w.pat[Math.min(39,Math.floor(p.shotIdx))];p.shotIdx++;
 const dv=w.rv*.42*DEG*m*pt[0]*(.92+Math.random()*.16);p.pitch=Math.min(1.5,p.pitch+dv);p.rcAcc=(p.rcAcc||0)+dv;p.rcT=0;
 p.yaw+=w.rh*.5*DEG*m*(pt[1]+(Math.random()-.5)*.25);
 if(p.id===ME){VK.kick=Math.min(1,VK.kick+.25+w.rv*.06);VK.flash=.05;SND.shot(w,null)}""")
rep("function throwUtil(p,fuse){const d=dirYP(p.yaw,p.pitch+.12);const o=eye(p);const v=p.crouch?11:15;",
"function throwUtil(p,fuse){const kn=p.util==='knife';const d=dirYP(p.yaw,p.pitch+(kn?.02:.12));const o=eye(p);const v=kn?30:p.crouch?11:15;")
# host shot handling with hitboxes
rep(""" if(m.t==='shot'){const w=W[m.w];if(!w||!Array.isArray(m.dirs))return;
  const hits={};let hs=false;
  for(const d0 of m.dirs.slice(0,10)){const d=norm(d0);const wallT=rayWorld(m.o,d,200);let best=wallT,who=-1,head=false;
   for(const q of G.P){if(q===p||!q.alive)continue;const h=pH(q);
    const th=rayBox(m.o,d,[q.pos[0]-.2,q.pos[1]+h-.42,q.pos[2]-.2],[q.pos[0]+.2,q.pos[1]+h,q.pos[2]+.2],best);
    if(th>=0&&th<best){best=th;who=q.id;head=true}
    const tb=rayBox(m.o,d,[q.pos[0]-.36,q.pos[1],q.pos[2]-.36],[q.pos[0]+.36,q.pos[1]+h-.42,q.pos[2]+.36],best);
    if(tb>=0&&tb<best){best=tb;who=q.id;head=false}}
   if(pid!==ME&&Math.random()<.5)emit({t:'tr',s:pid,o:m.o,e:[m.o[0]+d[0]*best,m.o[1]+d[1]*best,m.o[2]+d[2]*best]});
   if(who>=0){const fall=best<=w.r0?w.dmg:best>=w.r1?w.dmin:w.dmg+(w.dmin-w.dmg)*(best-w.r0)/(w.r1-w.r0);hits[who]=(hits[who]||0)+fall*(head?w.head:1);if(head)hs=true}}
  for(const v in hits)damage(+v,pid,hits[v],m.w,hs,m.o);
 }else if(m.t==='nade'){if(!['frag','smoke','flash','rocket'].includes(m.type))return;G.nades.push({id:nadeId++,type:m.type,pos:m.pos.slice(),vel:m.vel.slice(),fuse:Math.min(5,m.fuse),owner:pid})}""",
""" if(m.t==='shot'){const w=W[m.w];if(!w||!Array.isArray(m.dirs))return;
  const hits={},best={};
  for(const d0 of m.dirs.slice(0,10)){const d=norm(d0);const r=hitScan(m.o,d,200,pid);
   if(pid!==ME&&Math.random()<.5)emit({t:'tr',s:pid,o:m.o,e:[m.o[0]+d[0]*r.t,m.o[1]+d[1]*r.t,m.o[2]+d[2]*r.t]});
   if(r.who>=0){const f=r.t<=w.r0?1:r.t>=w.r1?w.dmin/w.dmg:1+(w.dmin/w.dmg-1)*(r.t-w.r0)/(w.r1-w.r0);const pi=PART_I[r.part];hits[r.who]=(hits[r.who]||0)+w.dm[pi]*f;best[r.who]=Math.min(best[r.who]===undefined?9:best[r.who],pi)}}
  if(pid!==ME)emit({t:'fx',s:pid,w:m.w,x:m.o[0],y:m.o[1],z:m.o[2]});
  for(const v in hits)damage(+v,pid,hits[v],m.w,best[v]===0,m.o,PARTS[best[v]]);
 }else if(m.t==='nade'){if(!['frag','smoke','flash','rocket','sticky','knife'].includes(m.type)||!Array.isArray(m.pos)||!Array.isArray(m.vel))return;G.nades.push({id:nadeId++,type:m.type,pos:m.pos.slice(),vel:m.vel.slice(),fuse:Math.min(5,m.fuse),owner:pid})}
 else if(m.t==='util'){const u=m.type;
  if(u==='stim'){p.hp=Math.min(100,p.hp+50);emit({t:'stim',s:pid})}
  else if(u==='pulse'){const ids=G.P.filter(q=>q.alive&&q.team!==p.team&&dist3(q.pos,p.pos)<20).map(q=>q.id);emit({t:'pulse',team:p.team,ids,s:pid,x:p.pos[0],z:p.pos[2]})}
  else if(u==='shield'){const f=dirYP(p.yaw,0),cx=p.pos[0]+f[0]*1.3,cz=p.pos[2]+f[2]*1.3,alongX=Math.abs(f[2])>=Math.abs(f[0]);const hw=.85,ht=.13;
   const b={min:[cx-(alongX?hw:ht),p.pos[1],cz-(alongX?ht:hw)],max:[cx+(alongX?hw:ht),p.pos[1]+1.35,cz+(alongX?ht:hw)],dyn:smokeId++,ttl:15,col:0x6fb6ff};G.boxes.push(b);emit({t:'shield',s:pid,x:cx,z:cz})}}""")
rep("""function damage(vid,aid,amt,wid,hs,from){
 const v=G.P[vid],a=G.P[aid];if(!v.alive||G.rs!=='live')return;
 amt=Math.min(v.hp,Math.round(amt));if(amt<=0)return;
 v.hp-=amt;if(a&&a!==v&&a.team!==v.team)a.dmg+=amt;
 emit({t:'dmg',v:vid,x:from[0],z:from[2]});
 if(a)emit({t:'hit',s:aid,hs,kill:v.hp<=0});""","""function damage(vid,aid,amt,wid,hs,from,part){
 const v=G.P[vid],a=G.P[aid];if(!v.alive||G.rs!=='live')return;
 amt=Math.min(v.hp,Math.round(amt));if(amt<=0)return;
 v.hp-=amt;if(a&&a!==v&&a.team!==v.team)a.dmg+=amt;
 emit({t:'dmg',v:vid,a:aid,amt,w:wid,hs:!!hs,part:part||'blast',x:from[0],z:from[2]});
 if(a)emit({t:'hit',s:aid,v:vid,hs:!!hs,kill:v.hp<=0,amt,p:chest(v)});""")
rep(""" const R=n.type==='rocket'?4.5:6,D=n.type==='rocket'?150:130;""",""" if(n.type==='knife')return;
 const R=n.type==='frag'?6:4.5,D=n.type==='rocket'?150:n.type==='sticky'?135:130;""")
rep("damage(q.id,n.owner,D*(1-dd/R)*(q.id===n.owner?.6:1)+5,n.type==='rocket'?'thumper':'frag',false,n.pos)}","damage(q.id,n.owner,D*(1-dd/R)*(q.id===n.owner?.6:1)+5,n.type==='rocket'?'thumper':n.type,false,n.pos,'blast')}")
rep(""" for(const n of G.nades){n.fuse-=dt;n.vel[1]-=(n.type==='rocket'?9:18)*dt;let hit=false;""",""" for(const n of G.nades){n.fuse-=dt;
  if(n.type==='knife'){n.vel[1]-=6*dt;const sp=Math.hypot(...n.vel),d=norm(n.vel);const r=hitScan(n.pos,d,sp*dt,n.owner);
   if(r.who>=0){damage(r.who,n.owner,[100,75,55][PART_I[r.part]],'knife',r.part==='head',n.pos,r.part);n.dead=true;continue}
   if(r.t<sp*dt-1e-4||n.pos[1]<.05){emit({t:'clink',x:n.pos[0],y:n.pos[1],z:n.pos[2]});n.dead=true;continue}
   for(let a=0;a<3;a++)n.pos[a]+=n.vel[a]*dt;if(n.fuse<=0)n.dead=true;continue}
  if(n.stuck){if(n.att!==undefined){const q=G.P[n.att];if(q&&q.alive)n.pos=[q.pos[0],q.pos[1]+1.1,q.pos[2]]}if(n.fuse<=0){explode(n);n.dead=true}continue}
  if(n.type==='sticky'){for(const q of G.P){if(q.alive&&q.id!==n.owner&&Math.abs(q.pos[0]-n.pos[0])<.45&&Math.abs(q.pos[2]-n.pos[2])<.45&&n.pos[1]>q.pos[1]&&n.pos[1]<q.pos[1]+pH(q)){n.stuck=true;n.att=q.id}}if(n.stuck)continue}
  n.vel[1]-=(n.type==='rocket'?9:18)*dt;let hit=false;""")
rep("  if(n.fuse<=0){explode(n);n.dead=true}}\n G.nades=G.nades.filter(n=>!n.dead);","  if(hit&&n.type==='sticky'){n.stuck=true;n.vel=[0,0,0]}\n  if(n.fuse<=0){explode(n);n.dead=true}}\n G.nades=G.nades.filter(n=>!n.dead);\n for(const b of G.boxes)if(b.dyn){b.ttl-=dt}G.boxes=G.boxes.filter(b=>!b.dyn||b.ttl>0);")
# voting
rep("""function newLoadout(){let pr;do pr=pick(PRIMS);while(pr===G.lastPrim);G.lastPrim=pr;return [pr,pick(SECS),pick(UTS)]}""",
"""function newLoadout(){let pr;do pr=pick(PRIMS);while(pr===G.lastPrim);G.lastPrim=pr;return [pr,pick(SECS),pick(UTS)]}
function voteOptions(){const used=new Set();const o=[];while(o.length<3){const l=newLoadout();if(used.has(l[0]))continue;used.add(l[0]);o.push(l)}return o}
function hostVote(pid,i){if(!G||G.rs!=='vote'||!(i>=0&&i<3)||!G.P[pid])return;G.votes[pid]=i|0}
function castVote(i){if(!G||G.rs!=='vote')return;SND.ui(880);if(HOST)hostVote(ME,i);else netSend(hostConn,{t:'vote',i});G.myVote=i}
function tallyVotes(){const c=[0,0,0];for(const v of G.votes)if(v>=0)c[v]++;const mx=Math.max(...c);const top=[0,1,2].filter(i=>c[i]===mx);return pick(top)}""")
rep("promotePending();G.rn++;G.rs='pre';G.rt=PRE_TIME;G.el=0;G.lo=newLoadout();","promotePending();G.rn++;G.rs='vote';G.rt=VOTE_TIME;G.el=0;G.opts=voteOptions();G.votes=[-1,-1,-1,-1];G.lo=G.opts[0];G.boxes=G.boxes.filter(b=>!b.dyn);")
rep(" if(G.rs==='pre'){if(G.rt<=0){G.rs='live';G.rt=ROUND_TIME;emit({t:'go'})}}",""" if(G.rs==='vote'){for(const p of G.P)if(p.bot&&G.votes[p.id]<0&&G.rt<VOTE_TIME-1.5&&Math.random()<dt*.8)G.votes[p.id]=Math.floor(Math.random()*3);
  const all=G.P.every(p=>G.votes[p.id]>=0);if(G.rt<=0||(all&&G.rt<VOTE_TIME-3)){const win=tallyVotes();G.lo=G.opts[win];G.voteWin=win;for(const p of G.P)equip(p,G.lo);G.ss++;G.rs='pre';G.rt=PRE_TIME;emit({t:'voted',i:win})}}
 else if(G.rs==='pre'){if(G.rt<=0){G.rs='live';G.rt=ROUND_TIME;emit({t:'go'})}}""")
rep("return {t:'snap',rs:G.rs,rt:+G.rt.toFixed(2),el:+G.el.toFixed(1),sc:G.sc,rn:G.rn,ss:G.ss,lo:G.lo,win:G.win,fl:G.flag,",
"return {t:'snap',rs:G.rs,rt:+G.rt.toFixed(2),el:+G.el.toFixed(1),sc:G.sc,rn:G.rn,ss:G.ss,lo:G.lo,win:G.win,fl:G.flag,op:G.opts,vt:G.votes,vw:G.voteWin,D:G.boxes.filter(b=>b.dyn).map(b=>[b.dyn,...b.min.map(v=>+v.toFixed(2)),...b.max.map(v=>+v.toFixed(2))]),")
rep("N:G.nades.map(n=>[n.id,n.type,","N:G.nades.map(n=>[n.id,n.type,")
rep(" else if(d.t==='shot'||d.t==='nade')hostAction(c.slot,d);"," else if(d.t==='shot'||d.t==='nade'||d.t==='util')hostAction(c.slot,d);\n else if(d.t==='vote')hostVote(c.slot,d.i);")
# bot util usage
rep("if(p.utilN>0&&p.cook<0&&b.seen>1){if(p.util==='frag'&&b.nadeOk&&td>8&&td<22)p.cook=1.6;else if(p.util!=='frag'&&Math.random()<dt*.3)p.cook=1.2}",
"if(p.utilN>0&&p.cook<0&&b.seen>1){if((p.util==='frag'||p.util==='sticky')&&b.nadeOk&&td>8&&td<22)p.cook=p.util==='frag'?1.6:2.4;else if(p.util==='stim'){if(p.hp<55)p.cook=0}else if(p.util!=='frag'&&p.util!=='sticky'&&Math.random()<dt*.3)p.cook=p.util==='knife'?0:1.2}")
# tick freeze for vote
rep(" const live=G.rs==='live',pre=G.rs==='pre';\n if(G.waiting){}"," const live=G.rs==='live',pre=G.rs==='pre'||G.rs==='vote';\n if(G.waiting){}")
open('index.html','w').write(s);print('p2 ok')
