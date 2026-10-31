s=open('index.html').read()
BOT=r"""// ===================== BOTS =====================
// Navigation: a walkable grid is built automatically from each map's boxes (any future map gets it for free), A* with
// corner-cut prevention, then string-pulled into straight waypoint runs. Bots replan on a timer, on goal change and when stuck.
const BOTD={easy:{react:[.38,.45],conv:2.2,jit:1.0,rate:3.2,ctrl:.3,head:.06,off:7,tol:1.25},normal:{react:[.3,.4],conv:3.4,jit:.6,rate:4.6,ctrl:.55,head:.15,off:5,tol:1.1},hard:{react:[.25,.3],conv:5,jit:.35,rate:6.5,ctrl:.78,head:.3,off:3.5,tol:.95}};
const NAVC=.75;
function buildNav(boxes){const nx=Math.ceil(2*MX/NAVC),nz=Math.ceil(2*MZ/NAVC),blk=new Uint8Array(nx*nz),r=.42;
 for(let i=0;i<nx;i++)for(let j=0;j<nz;j++){const x=-MX+(i+.5)*NAVC,z=-MZ+(j+.5)*NAVC;if(Math.abs(x)>MX-.45||Math.abs(z)>MZ-.45){blk[i*nz+j]=1;continue}
  for(const b of boxes){if(b.dyn)continue;if(b.min[1]<1.4&&b.max[1]>.5&&x+r>b.min[0]&&x-r<b.max[0]&&z+r>b.min[2]&&z-r<b.max[2]){blk[i*nz+j]=1;break}}}
 return {nx,nz,blk}}
function navCell(N,x,z){return [Math.max(0,Math.min(N.nx-1,Math.floor((x+MX)/NAVC))),Math.max(0,Math.min(N.nz-1,Math.floor((z+MZ)/NAVC)))]}
function navCtr(N,i,j){return [-MX+(i+.5)*NAVC,-MZ+(j+.5)*NAVC]}
function navFree(N,i,j){if(!N.blk[i*N.nz+j])return [i,j];for(let r=1;r<8;r++){let best=null,bd=1e9;for(let a=-r;a<=r;a++)for(let c=-r;c<=r;c++){if(Math.max(Math.abs(a),Math.abs(c))!==r)continue;const u=i+a,v=j+c;if(u<0||v<0||u>=N.nx||v>=N.nz||N.blk[u*N.nz+v])continue;const d=a*a+c*c;if(d<bd){bd=d;best=[u,v]}}if(best)return best}return null}
function navLine(N,p,q){const d=Math.hypot(q[0]-p[0],q[1]-p[1]),n=Math.max(1,Math.ceil(d/(NAVC*.35)));for(let k=0;k<=n;k++){const x=p[0]+(q[0]-p[0])*k/n,z=p[1]+(q[1]-p[1])*k/n;const c=navCell(N,x,z);if(N.blk[c[0]*N.nz+c[1]])return false}return true}
function navPath(N,sx,sz,gx,gz){const s=navFree(N,...navCell(N,sx,sz)),g=navFree(N,...navCell(N,gx,gz));if(!s||!g)return null;
 const nz=N.nz,tot=N.nx*nz,S=s[0]*nz+s[1],GK=g[0]*nz+g[1];const gs=new Float32Array(tot).fill(1e9),from=new Int32Array(tot).fill(-1),closed=new Uint8Array(tot);const heap=[];
 const push=(k,f)=>{heap.push([f,k]);let i=heap.length-1;while(i>0){const p=(i-1)>>1;if(heap[p][0]<=heap[i][0])break;const t=heap[p];heap[p]=heap[i];heap[i]=t;i=p}};
 const pop=()=>{const top=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let i=0;for(;;){const l=2*i+1,r=l+1;let m=i;if(l<heap.length&&heap[l][0]<heap[m][0])m=l;if(r<heap.length&&heap[r][0]<heap[m][0])m=r;if(m===i)break;const t=heap[m];heap[m]=heap[i];heap[i]=t;i=m}}return top};
 const h=k=>{const dx=Math.abs(((k/nz)|0)-g[0]),dz=Math.abs(k%nz-g[1]);return Math.max(dx,dz)+.414*Math.min(dx,dz)};
 gs[S]=0;push(S,h(S));let it=0;
 while(heap.length&&it++<30000){const k=pop()[1];if(closed[k])continue;closed[k]=1;if(k===GK)break;const i=(k/nz)|0,j=k%nz;
  for(let a=-1;a<=1;a++)for(let c=-1;c<=1;c++){if(!a&&!c)continue;const u=i+a,v=j+c;if(u<0||v<0||u>=N.nx||v>=nz)continue;const q=u*nz+v;if(N.blk[q]||closed[q])continue;if(a&&c&&(N.blk[i*nz+v]||N.blk[u*nz+j]))continue;
   const ng=gs[k]+(a&&c?1.414:1);if(ng<gs[q]){gs[q]=ng;from[q]=k;push(q,ng+h(q))}}}
 if(GK!==S&&from[GK]<0)return null;const cells=[];for(let k=GK;k!==-1;k=from[k]){cells.push(k);if(k===S)break}cells.reverse();
 const pts=cells.map(k=>navCtr(N,(k/nz)|0,k%nz));const out=[pts[0]];let a=0;
 while(a<pts.length-1){let b=Math.min(pts.length-1,a+40);while(b>a+1&&!navLine(N,pts[a],pts[b]))b--;out.push(pts[b]);a=b}
 return out}
function wrapA(a){while(a>Math.PI)a-=Math.PI*2;while(a<-Math.PI)a+=Math.PI*2;return a}
// cover: a nearby walkable spot the threat cannot see (chest height); peek: a spot next to that cover with sight on the threat
function findCover(N,p,thr){const te=[thr[0],thr[1]+1.6,thr[2]];let best=null,bs=1e9;const [ci,cj]=navCell(N,p.pos[0],p.pos[2]);const R=Math.ceil(8/NAVC);let n=0;
 for(let a=-R;a<=R;a+=1)for(let c=-R;c<=R;c+=1){const u=ci+a,v=cj+c;if(u<0||v<0||u>=N.nx||v>=N.nz||N.blk[u*N.nz+v])continue;const [x,z]=navCtr(N,u,v);const d=Math.hypot(x-p.pos[0],z-p.pos[2]);if(d<1.2||d>8)continue;
  const sc=d-Math.min(3,Math.hypot(x-thr[0],z-thr[2])-Math.hypot(p.pos[0]-thr[0],p.pos[2]-thr[2]));if(sc>=bs)continue;if(++n>140)break;if(los(te,[x,1.2,z],false))continue;bs=sc;best=[x,z]}return best}
function findPeek(N,cv,thr){const tc=[thr[0],thr[1]+1.2,thr[2]];let best=null,bd=1e9;const [ci,cj]=navCell(N,cv[0],cv[1]);const R=Math.ceil(3.5/NAVC);
 for(let a=-R;a<=R;a++)for(let c=-R;c<=R;c++){const u=ci+a,v=cj+c;if(u<0||v<0||u>=N.nx||v>=N.nz||N.blk[u*N.nz+v])continue;const [x,z]=navCtr(N,u,v);const d=Math.hypot(x-cv[0],z-cv[1]);if(d<.7||d>=bd)continue;if(!los([x,1.6,z],tc,false))continue;if(!navLine(N,cv,[x,z]))continue;bd=d;best=[x,z]}return best}
window.__botStuck=[];window.__botStuckMax={};
function logStuck(p,dur){const m=G.mapDef?G.mapDef.n:'?';window.__botStuck.push({map:m,bot:p.name+'#'+p.id,dur:+dur.toFixed(2),at:[+p.pos[0].toFixed(1),+p.pos[2].toFixed(1)]});const k=m;window.__botStuckMax[k]=Math.max(window.__botStuckMax[k]||0,dur)}
function botThink(p,dt){
 const D=BOTD[settings.botDiff]||BOTD.normal;
 const b=p.bot_||(p.bot_={tgt:-1,seenT:0,react:0,lostT:9,off:[0,0],jit:[0,0],jitTo:[0,0],jitT:0,head:false,path:null,pi:0,gk:'',repl:0,lastPos:p.pos.slice(),chk:0,stuckT:0,unstick:0,usDir:[0,0],tmp:null,strafe:1,strafeT:0,mode:'roam',modeT:0,hold:0,cover:null,peek:null,threat:null,lane:pick([-1,0,1]),leg:0,coverCd:0,lastHp:100,nadeOk:Math.random()<.45,alert:null,ttl:0});
 const inp={f:0,r:0,fire:false,ads:false,reload:false,crouch:false,jump:false,sprint:false,util:false};
 if(G.rs!=='live'&&G.rs!=='end'){b.path=null;b.lastPos=p.pos.slice();b.stuckT=0;return inp}
 if(!G.nav||G.navFor!==G.mapDef){G.nav=buildNav(G.boxes);G.navFor=G.mapDef}
 const N=G.nav,now=performance.now()/1000;
 p.blind=Math.max(0,p.blind-dt);
 const e=eye(p);let tgt=null,td=1e9;
 // perception: needs real line of sight (smoke blocks) to head or chest, roughly in front unless very close or already engaged
 if(p.blind<=0)for(const q of G.P){if(!q.alive||q.team===p.team)continue;const c=chest(q),d=dist3(e,c);if(d>60||d>=td)continue;
  const ang=Math.abs(wrapA(Math.atan2(-(c[0]-e[0]),-(c[2]-e[2]))-p.yaw));if(!(ang<1.45||d<4||q.id===b.tgt))continue;if(los(e,c,true)||los(e,eye(q),true)){tgt=q;td=d}}
 for(const q of G.P){if(q.alive&&q.team!==p.team&&q._shotT&&now-q._shotT<.4&&dist3(q.pos,p.pos)<32&&!tgt)b.alert=[q.pos[0],0,q.pos[2]]}
 if(p.hp<b.lastHp&&!tgt){b.hurt=1.2}b.lastHp=p.hp;b.hurt=Math.max(0,(b.hurt||0)-dt);
 const slot=p.inv[p.cur],w=W[slot.w];
 if(p.cur===0&&slot.mag===0&&(slot.res===0||tgt&&td<8&&p.inv[1].w!=='thumper'))inp.sw=1;
 if(p.cur===1&&slot.mag===0&&(p.inv[0].mag>0||p.inv[0].res>0))inp.sw=0;
 let mv=[0,0],look=null,goal=null;b.coverCd-=dt;
 if(tgt){
  if(b.tgt!==tgt.id||b.lostT>1){b.tgt=tgt.id;b.seenT=0;b.react=rnd(D.react[0],D.react[1]);const o=D.off*DEG*(1+Math.min(1,td/30));b.off=[pick([-1,1])*rnd(.6,1)*o,rnd(-.3,.9)*o];b.head=Math.random()<D.head}
  b.lostT=0;b.seenT+=dt;b.threat=tgt.pos.slice();b.alert=[tgt.pos[0],0,tgt.pos[2]];
  if(b.mode==='roam'||b.mode==='peek'||b.mode==='cover'&&!b.cover)b.mode='fight';
  b.jitT-=dt;if(b.jitT<=0){const j=D.jit*DEG*(1+td/20);b.jitT=rnd(.15,.35);b.jitTo=[rnd(-j,j),rnd(-j,j)*.7]}
  for(const k of [0,1])b.jit[k]+=(b.jitTo[k]-b.jit[k])*Math.min(1,dt*6);
  if(b.seenT>b.react){const k=Math.exp(-D.conv*dt);b.off[0]*=k;b.off[1]*=k}
  const ap=b.head?eye(tgt):chest(tgt);const dx=ap[0]-e[0],dy=ap[1]-e[1],dz=ap[2]-e[2],hd=Math.hypot(dx,dz);
  const ty=Math.atan2(-dx,-dz),tp=Math.atan2(dy,hd);
  if(b.seenT>b.react)look=[ty+b.off[0]+b.jit[0],tp+b.off[1]+b.jit[1]+(1-D.ctrl)*(p.rcAcc||0)];
  const tol=Math.atan2(.3,td)*D.tol+(w.pellets?.05:0);
  if(b.seenT>b.react+.04&&Math.abs(wrapA(p.yaw-ty))<tol*1.7&&Math.abs(p.pitch-tp)<tol*2.2){
   if(w.mode==='auto')inp.fire=!(td>25&&Math.random()<.3);else if(w.mode==='burst')inp.fire=Math.random()<.7;else inp.fire=!p.trig&&Math.random()<dt*(w.mode==='bolt'?3:7)}
  inp.ads=td>10&&w.mode!=='launch'&&b.seenT>b.react;
  if(b.mode==='fight'){b.strafeT-=dt;if(b.strafeT<=0){b.strafe=-b.strafe;b.strafeT=rnd(.35,1.1)}
   const rx=Math.cos(p.yaw),rz=-Math.sin(p.yaw),fx=-Math.sin(p.yaw),fz=-Math.cos(p.yaw);const sm=inp.ads?.55:.85;mv=[rx*b.strafe*sm,rz*b.strafe*sm];
   if(td>(w.pellets?7:26)){mv[0]+=fx*.7;mv[1]+=fz*.7}else if(td<3.5){mv[0]-=fx*.5;mv[1]-=fz*.5}
   if(Math.random()<dt*.18)inp.crouch=true;
   if(b.coverCd<=0&&((slot.mag<=Math.ceil(w.mag*.2)&&slot.res>0)||p.hp<45)){const c=findCover(N,p,tgt.pos);b.coverCd=5;if(c){b.mode='cover';b.cover=c;b.path=null;b.modeT=0;b.hold=0}}}
  if(p.utilN>0&&p.cook<0&&b.seenT>1){if((p.util==='frag'||p.util==='sticky')&&b.nadeOk&&td>8&&td<22)p.cook=p.util==='frag'?1.6:2.4;else if(p.util==='stim'){if(p.hp<55)p.cook=0}else if(p.util!=='frag'&&p.util!=='sticky'&&Math.random()<dt*.3)p.cook=p.util==='knife'?0:1.2}
 }else{if(b.tgt>=0){b.lostT+=dt;if(b.lostT>1.2)b.tgt=-1}b.seenT=0;if(b.mode==='fight'&&b.lostT>.5)b.mode='roam'}
 // ---- choose where to go
 if(b.mode==='cover'){goal=b.cover;b.modeT+=dt;const dc=Math.hypot(p.pos[0]-b.cover[0],p.pos[2]-b.cover[1]);
  if(dc<.7){b.hold+=dt;goal=null;if(slot.mag<w.mag&&slot.res>0)inp.reload=true;if(b.hold<.5)inp.crouch=true;
   if(b.hold>rnd(.9,1.6)&&p.reloadT<=0){b.peek=b.threat?findPeek(N,b.cover,b.threat):null;b.mode=b.peek?'peek':'roam';b.modeT=0;b.path=null}}
  if(b.modeT>6){b.mode='roam';b.path=null}}
 if(b.mode==='peek'){goal=b.peek;b.modeT+=dt;if(Math.hypot(p.pos[0]-b.peek[0],p.pos[2]-b.peek[1])<.6){goal=null;b.hold+=dt}if(b.modeT>3.2){b.mode='roam';b.path=null}}
 if(b.mode==='roam'){
  if(G.flag.on)goal=[G.mapDef.flag[0],G.mapDef.flag[2]];
  else if(b.alert){goal=[b.alert[0],b.alert[2]];if(Math.hypot(p.pos[0]-goal[0],p.pos[2]-goal[1])<2){b.alert=null;goal=null}}
  if(!goal){const lx=b.lane*(LANE_D+MX)/2,sg=p.team===0?1:-1;const pts=[[lx,-sg*6],[lx,sg*8],[lx*.4,sg*18]];if(b.leg<3){goal=pts[b.leg];if(Math.hypot(p.pos[0]-goal[0],p.pos[2]-goal[1])<2.5)b.leg++}
   else{let best=null,bd=1e9;for(const q of G.P)if(q.alive&&q.team!==p.team){const d=dist3(p.pos,q.pos);if(d<bd){bd=d;best=q}}if(best){if(!b.hunt||b.huntT<=0){b.hunt=[best.pos[0]+rnd(-5,5),best.pos[2]+rnd(-5,5)];b.huntT=4}b.huntT-=dt;goal=b.hunt}}}}
 if(b.mode==='fight')goal=null;
 if(b.tmp){goal=b.tmp;if(Math.hypot(p.pos[0]-b.tmp[0],p.pos[2]-b.tmp[1])<.8||(b.tmpT-=dt)<=0)b.tmp=null}
 // ---- path following
 b.repl-=dt;let wantMove=false;
 if(goal){const gk=Math.round(goal[0])+','+Math.round(goal[1]);if(!b.path||b.gk!==gk||b.repl<=0){b.path=navPath(N,p.pos[0],p.pos[2],goal[0],goal[1]);b.pi=1;b.gk=gk;b.repl=1.5}
  if(b.path){while(b.pi<b.path.length-1&&Math.hypot(p.pos[0]-b.path[b.pi][0],p.pos[2]-b.path[b.pi][1])<.55)b.pi++;const wp=b.path[Math.min(b.pi,b.path.length-1)];
   const dx=wp[0]-p.pos[0],dz=wp[1]-p.pos[2],L=Math.hypot(dx,dz);if(L>.25){mv=[dx/L,dz/L];wantMove=true}
   if(!look){look=[Math.atan2(-dx,-dz),0]; if((b.mode==='peek'||b.mode==='cover')&&b.threat){const tx=b.threat[0]-p.pos[0],tz=b.threat[2]-p.pos[2];if(b.mode==='peek'||L<2)look=[Math.atan2(-tx,-tz),0]}}
   inp.sprint=!tgt&&b.mode==='roam'&&Math.hypot(goal[0]-p.pos[0],goal[1]-p.pos[2])>8}}
 if(!look&&b.threat&&!tgt&&(b.mode==='peek'||b.mode==='cover')){const tx=b.threat[0]-p.pos[0],tz=b.threat[2]-p.pos[2];look=[Math.atan2(-tx,-tz),0]}
 if(!look&&b.hurt>0)look=[p.yaw+dt*3,0];
 if(Math.hypot(mv[0],mv[1])>.3&&b.mode==='fight')wantMove=true;
 // ---- stuck detection & recovery (escalates: replan -> jump + sidestep -> detour to a random nearby open cell)
 b.chk+=dt;if(b.chk>=.5){const d=Math.hypot(p.pos[0]-b.lastPos[0],p.pos[2]-b.lastPos[2]);
  if(wantMove&&d<.22)b.stuckT+=b.chk;else{if(b.stuckT>=1)logStuck(p,b.stuckT);b.stuckT=0}
  b.lastPos=p.pos.slice();b.chk=0;
  if(b.stuckT>=.5){b.path=null}
  if(b.stuckT>=1){inp.jump=true;const a=Math.atan2(mv[1],mv[0])+pick([-1,1])*Math.PI/2;b.usDir=[Math.cos(a),Math.sin(a)];b.unstick=.45;
   const c=navFree(N,...navCell(N,p.pos[0],p.pos[2]));if(c){const [cx,cz]=navCtr(N,c[0],c[1]);if(Math.hypot(cx-p.pos[0],cz-p.pos[2])>.3){b.usDir=[cx-p.pos[0],cz-p.pos[2]];const l=Math.hypot(...b.usDir);b.usDir=[b.usDir[0]/l,b.usDir[1]/l]}}}
  if(b.stuckT>=2){for(let t=0;t<12;t++){const x=p.pos[0]+rnd(-5,5),z=p.pos[2]+rnd(-5,5);const c=navCell(N,x,z);if(!N.blk[c[0]*N.nz+c[1]]){b.tmp=navCtr(N,c[0],c[1]);b.tmpT=2.5;break}}}}
 if(b.unstick>0){b.unstick-=dt;mv=b.usDir}
 // world move dir -> local input
 const sy=Math.sin(p.yaw),cy=Math.cos(p.yaw);inp.f=-sy*mv[0]-cy*mv[1];inp.r=cy*mv[0]-sy*mv[1];if(inp.f<.5)inp.sprint=false;
 // ---- human-ish aim: turn-rate limited, eases in near the target
 if(look){const dy=wrapA(look[0]-p.yaw),dp=look[1]-p.pitch;const k=D.rate*dt;const sy2=Math.min(Math.abs(dy),k*Math.min(1,.2+Math.abs(dy)*1.6)),sp2=Math.min(Math.abs(dp),k*Math.min(1,.2+Math.abs(dp)*1.6));p.yaw+=Math.sign(dy)*sy2;p.pitch=Math.max(-1.4,Math.min(1.4,p.pitch+Math.sign(dp)*sp2))}
 if(!tgt&&slot.mag<w.mag*.5&&slot.res>0&&b.mode!=='peek')inp.reload=true;
 if(slot.mag===0)inp.reload=true;
 return inp;
}
"""
a=s.index("// ===================== BOTS =====================");b=s.index("// ===================== PROCEDURAL TEXTURES")
s=s[:a]+BOT+s[b:]
open('index.html','w').write(s);print('p6 ok')
