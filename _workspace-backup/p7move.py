def P(f,a,b,cnt=1):
    s=open(f).read();assert s.count(a)==cnt,(f,a[:70],s.count(a));s=s.replace(a,b);open(f,'w').write(s)
P('src/00_head.txt',"#floats .fn{","#floats .fn .fpen{font-size:12px;color:#ffcf6a}.wpen{font-size:12px;color:#ffcf6a;margin-left:6px}.spinb{display:inline-block;width:70px;height:6px;background:#0008;border:1px solid #fff4;margin-left:8px;vertical-align:middle}.spinb i{display:block;height:100%;background:linear-gradient(90deg,#ffb347,#ff5a2a)}\n#floats .fn{")
M='src/50_move.txt'
# omni sprint (any move direction; backwards a bit slower)
P(M," let sprint=inp.sprint&&inp.f>0&&!p.ads&&p.stam>2&&(!p.crouch||p.slideT>0);"," const mvIn=(inp.f||0)!==0||(inp.r||0)!==0;let sprint=inp.sprint&&mvIn&&!p.ads&&p.stam>2&&(!p.crouch||p.slideT>0);")
# omni slide: slide along current movement (input) direction
P(M,"const f=dirYP(p.yaw,0),sp=Math.max(9.5,Math.hypot(p.vel[0],p.vel[2])*1.35);",
 "const hv=Math.hypot(p.vel[0],p.vel[2]);let f=dirYP(p.yaw,0);{const fi=inp.f||0,ri=inp.r||0;if(fi||ri){const sy_=Math.sin(p.yaw),cy_=Math.cos(p.yaw);let ax=-sy_*fi+cy_*ri,az=-cy_*fi-sy_*ri;const l_=Math.hypot(ax,az);f=[ax/l_,0,az/l_]}else if(hv>1)f=[p.vel[0]/hv,0,p.vel[2]/hv]}const sp=Math.max(9.5,hv*1.35);")
P(M," const spd=5.2*w.spd*(sprint?(tac?1.72:1.45):1)"," const spd=5.2*w.spd*(sprint?(tac?1.72:1.45)*((inp.f||0)<0?.88:1):1)")
# bhop: jumping within .14s of landing keeps (and slightly builds) horizontal speed, capped
P(M," if(!p.grap){const k=p.slideT>0?"," if(!(p.landT>=0))p.landT=0;p.landT=Math.max(0,p.landT-dt);\n if(!p.grap){const bh=p.ground&&p.landT>0&&inp.jump&&!p.ads;const hs0=Math.hypot(p.vel[0],p.vel[2]);const k=bh?0:p.slideT>0?")
P(M,"p.vel[1]=p.stam>5?7:6;p.ground=false;p.stam=Math.max(0,p.stam-6);p.slideT=Math.min(p.slideT,0)}",
 "p.vel[1]=p.stam>5?7:6;p.ground=false;p.stam=Math.max(0,p.stam-6);p.slideT=Math.min(p.slideT,0);\n   if(bh&&hs0>3){const cap=BHOP_CAP*w.spd,ns=Math.min(cap,hs0*BHOP_GAIN);const tl=Math.hypot(tx,tz);let dx=p.vel[0]/hs0,dz=p.vel[2]/hs0;if(tl>.1){dx=dx*.7+tx/tl*.3;dz=dz*.7+tz/tl*.3;const l2=Math.hypot(dx,dz);dx/=l2;dz/=l2}p.vel[0]=dx*ns;p.vel[2]=dz*ns;p.bhops=(p.bhops||0)+1}else p.bhops=0}")
# air control a bit stronger so strafing in the air steers bhops
P(M,"Math.min(1,dt*(p.ground?12:2.5))","Math.min(1,dt*(p.ground?12:(Math.hypot(p.vel[0],p.vel[2])>Math.hypot(tx,tz)?.6:2.5)))")
# landing window
P(M," for(const b of G.boxes){if(!overlap(p,b,h))continue;if(p.vel[1]<=0){p.pos[1]=b.max[1];p.ground=true}else p.pos[1]=b.min[1]-h-.001;p.vel[1]=0}\n if(p.pos[1]<=0){p.pos[1]=0;p.vel[1]=0;p.ground=true}",
 " const wasAir=p._air;for(const b of G.boxes){if(!overlap(p,b,h))continue;if(p.vel[1]<=0){p.pos[1]=b.max[1];p.ground=true}else p.pos[1]=b.min[1]-h-.001;p.vel[1]=0}\n if(p.pos[1]<=0){p.pos[1]=0;p.vel[1]=0;p.ground=true}\n if(p.ground&&wasAir)p.landT=BHOP_WIN;p._air=!p.ground;")
# spring pad higher
P(M,"p.vel[1]=12.5;p.vel[0]+=f[0]*5;","p.vel[1]=PAD_UP;p.vel[0]+=f[0]*5;")
# grapple auto-mantle: near the hook point, try to vault onto the ledge in the pull direction
P(M,"  if(L<1.4||p.grap.t<=0||(inp.jump&&p.grap.t<1.1))p.grap=null;",
 "  if(L<2.6&&tryMantle(p,inp,[d[0],0,d[2]])){p.grap=null;p.grapMant=(p.grapMant||0)+1;p.moving=true;return}\n  if(L<1.4||p.grap.t<=0||(inp.jump&&p.grap.t<1.1))p.grap=null;")
P(M,"function mantleProbe(p){const f=dirYP(p.yaw,0),h=pH(p);let best=null;","function mantleProbe(p,dir){let f=dirYP(p.yaw,0);if(dir){const l=Math.hypot(dir[0],dir[2]);if(l>.05)f=[dir[0]/l,0,dir[2]/l]}const h=pH(p);let best=null;const maxH=dir?2.2:1.6;")
P(M,"const top=b.max[1]-p.pos[1];if(top<.45||top>1.6)continue;","const top=b.max[1]-p.pos[1];if(top<(dir?-.3:.45)||top>maxH)continue;")
P(M,"function tryMantle(p,inp){if(p.mant||p.slideT>0||!G)return false;const m=mantleProbe(p);","function tryMantle(p,inp,dir){if(p.mant||p.slideT>0||!G)return false;const m=mantleProbe(p,dir);")
s=open(M).read();s="const BHOP_WIN=.14,BHOP_GAIN=1.06,BHOP_CAP=11.2;\n"+s;open(M,'w').write(s)
A='src/b0_audio.txt'
P(A," step(pos,loud){try{const g=SND.out(pos,loud*(pos?1:.35));if(!g)return;const t=AC.currentTime;SND.nz(g,t,.07,'lowpass',380+loud*300,1,.7)}catch(e){}},",
 " // v7: own steps quieter (.35 -> .15); others audible only within a radius (crouch 5m, walk 13m, run 22m) with steep falloff, muffled through walls\n step(pos,loud){try{let v=loud*(pos?1:.15),f=380+loud*300;if(pos&&G){const L=camera.position,d=Math.hypot(pos[0]-L.x,pos[1]-L.y,pos[2]-L.z),R=loud<.2?5:loud<.8?13:22;if(d>R)return;v*=Math.pow(1-d/R,1.6)*(1+d*.11);\n   if(!los([L.x,L.y,L.z],[pos[0],pos[1]+.3,pos[2]])){v*=.4;f=180}}const g=SND.out(pos,v);if(!g)return;const t=AC.currentTime;SND.nz(g,t,.07,'lowpass',f,1,.7)}catch(e){}},")
