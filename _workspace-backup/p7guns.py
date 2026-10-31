def P(f,a,b,cnt=1):
    s=open(f).read();assert s.count(a)==cnt,(f,a[:70],s.count(a));s=s.replace(a,b);open(f,'w').write(s)
W='src/60_weapon.txt'
P(W," const slot=p.inv[p.cur],w=W[slot.w];\n"," const slot=p.inv[p.cur],w=W[slot.w];\n if(w.spinUp){const hold=!!inp.fire&&canFire&&p.meleeT<=0&&p.reloadT<=0&&p.swapT<=0&&slot.mag>0;p.spin=hold?Math.min(1,(p.spin||0)+dt/w.spinUp):Math.max(0,(p.spin||0)-dt/w.spinDown);if(p.id===ME&&hold&&p.spin<1&&typeof SND!=='undefined')SND.charge(p.spin*.5)}else p.spin=0;\n")
P(W," else if(w.mode==='auto')shoot=want&&p.fireCd<=0;"," else if(w.mode==='auto')shoot=want&&p.fireCd<=0&&(!w.spinUp||p.spin>=.25);")
P(W,"else p.fireCd=60/w.rpm;\n fireShot","else p.fireCd=60/(w.rpm*(w.spinUp?.3+.7*p.spin:1));\n fireShot")
P(W,"if((w.mode==='bolt'||w.hs1)&&!ads)","if((w.mode==='bolt'||w.hs1||w.hipPen)&&!ads)")
P(W,"vel:[d[0]*80,d[1]*80,d[2]*80],fuse:4}","vel:[d[0]*XBOW_V,d[1]*XBOW_V,d[2]*XBOW_V],fuse:4}")
P(W,"function throwUtil(p,fuse){const kn=p.util==='knife';const d=dirYP(p.yaw,p.pitch+(kn?.02:.12));const o=eye(p);const v=kn?30:p.crouch?11:15;sendOrDo({t:'nade',type:p.util,pos:[o[0]+d[0]*.4,o[1]+d[1]*.4,o[2]+d[2]*.4],vel:[d[0]*v+p.vel[0]*.5,d[1]*v+1.5,d[2]*v+p.vel[2]*.5],fuse},p.id)}",
 "function throwUtil(p,fuse){const kn=p.util==='knife';const d=dirYP(p.yaw,p.pitch+(kn?0:.12));const o=eye(p);const v=kn?KNIFE_V:p.crouch?11:15;\n // knives leave exactly along the crosshair ray (no upward kick), heavier and faster\n sendOrDo({t:'nade',type:p.util,pos:[o[0]+d[0]*.45,o[1]+d[1]*.45,o[2]+d[2]*.45],vel:kn?[d[0]*v,d[1]*v,d[2]*v]:[d[0]*v+p.vel[0]*.5,d[1]*v+1.5,d[2]*v+p.vel[2]*.5],fuse},p.id)}")
H='src/70_host.txt'
P(H,"const r=hitScan(m.o,d,200,pid);\n","let r=hitScan(m.o,d,200,pid),pen=null;\n   if(r.who<0&&r.t<200&&w.pen>0){pen=penTrace(m.o,d,r.t,w.pen,pid);if(pen&&pen.r.who>=0)r=pen.r;else pen=null}\n")
P(H,"const amt=w.hs1&&pi===0?999:w.dm[pi]*f*cm;","const amt=w.hs1&&pi===0?999:w.dm[pi]*f*cm*(pen?pen.mult:1);if(pen)pens[r.who]=pen.th;")
P(H,"const hits={},best={},hp={};let first=true;","const hits={},best={},hp={},pens={};let first=true;")
P(H,"for(const v in hits)damage(+v,pid,hits[v],m.w,best[v]===0,m.o,PARTS[best[v]],hp[v]);","for(const v in hits){PEN_NOW=pens[v]!==undefined?Math.max(1,Math.round(pens[v]*100)):0;damage(+v,pid,hits[v],m.w,best[v]===0,m.o,PARTS[best[v]],hp[v]);PEN_NOW=0}")
P(H,"function damage(vid,aid,amt,wid,hs,from,part,pt){","// v7 wallbangs: find how thick the cover is along the ray; if the round can get through, keep tracing with reduced damage\nlet PEN_NOW=0;\nfunction inSolid(q){if(q[1]<=.02)return true;for(const b of G.boxes){if(b.liquid)continue;if(q[0]>b.min[0]&&q[0]<b.max[0]&&q[1]>b.min[1]&&q[1]<b.max[1]&&q[2]>b.min[2]&&q[2]<b.max[2])return true}return false}\nfunction penTrace(o,d,t0,pen,pid){let t=t0+.01;const lim=t0+pen+.02;while(t<lim){const q=[o[0]+d[0]*t,o[1]+d[1]*t,o[2]+d[2]*t];if(!inSolid(q))break;t+=.03}if(t>=lim)return null;const th=Math.max(.01,t-t0);if(o[1]+d[1]*t<=.02)return null;\n const o2=[o[0]+d[0]*(t+.01),o[1]+d[1]*(t+.01),o[2]+d[2]*(t+.01)];const r2=hitScan(o2,d,200-t,pid);if(r2.who<0)return null;r2.t+=t+.01;return {r:r2,th,mult:Math.max(.35,.75-.4*th/pen)}}\nfunction damage(vid,aid,amt,wid,hs,from,part,pt){if(amt<999)amt=Math.max(1,Math.round(amt));")
P(H,"emit({t:'hit',s:aid,v:vid,hs:!!hs,kill:v.hp<=0,amt,p:chest(v)});","emit({t:'hit',s:aid,v:vid,hs:!!hs,kill:v.hp<=0,amt:Math.round(amt),p:chest(v),pen:PEN_NOW||0});")
P(H,"n.vel[1]-=(n.type==='bolt'?4:6)*dt;","n.vel[1]-=(n.type==='bolt'?4:KNIFE_G)*dt;")
# client floats show pen
C='src/c0_events.txt'
P(C,"FLOATS.push({p:e.p.slice(),a:e.amt,hs:e.hs,t:1,ox:rnd(-.3,.3)})","FLOATS.push({p:e.p.slice(),a:Math.round(e.amt),hs:e.hs,t:1,ox:rnd(-.3,.3),pen:e.pen|0})")
F='src/f0_loop.txt'
P(F,"color:${f.hs?'#ff4a4a':'#fff'}\">${f.a}</div>`","color:${f.hs?'#ff4a4a':'#fff'}\">${f.a}${f.pen?`<span class=\"fpen\"> &#9638;${f.pen}</span>`:''}</div>`")
P(F,"<div class=\"vs\">Head / Body / Limb: <b>${a.dm.join(' / ')}</b></div>","<div class=\"vs\">Head / Body / Limb: <b>${a.dm.map(Math.round).join(' / ')}</b> &middot; PEN <b>${penCm(a)}</b></div>")
P(F,"<span>${b.cls} &middot; ${b.dm.join('/')}</span>","<span>${b.cls} &middot; ${b.dm.map(Math.round).join('/')} &middot; PEN ${penCm(b)}</span>")
P(F,"$('#wName').innerHTML=`${w.n} <span style=\"color:#9ab\">${w.cls}</span>`;","$('#wName').innerHTML=`${w.n} <span style=\"color:#9ab\">${w.cls}</span> <span class=\"wpen\">DMG ${Math.round(w.dm[1])} &middot; PEN ${penCm(w)}</span>${w.spinUp?`<span class=\"spinb\"><i style=\"width:${Math.round((me.spin||0)*100)}%\"></i></span>`:''}`;")
# knife visual: no muzzle offset, appear on the crosshair
P(F,"const mp=n.owner!==undefined?muzzleWorld(n.owner):null;","const mp=n.owner!==undefined&&n.type!=='knife'?muzzleWorld(n.owner):null;")
B='src/80_bots.txt'
P(B,"else inp.fire=!p.trig&&Math.random()<dt*(w.mode==='bolt'?3:7)}","else if(w.mode==='charge')inp.fire=!((p.chg||0)>=.97);else inp.fire=!p.trig&&Math.random()<dt*(w.mode==='bolt'?3:7)}")
R='src/a0_render.txt'
P(R,"transparent:true,opacity:.07,depthWrite:false});","transparent:true,opacity:.16,depthWrite:false});const CLOAK_OPACITY=[.07,.16];")
