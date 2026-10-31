s=open('index.html').read()
def rep(a,b,cnt=1):
    global s
    assert a in s,a[:90]; s=s.replace(a,b,cnt)
# CSS
rep("#cook{position:absolute;left:50%;top:56%;transform:translateX(-50%);color:#fc6}","""#cook{position:absolute;left:50%;top:56%;transform:translateX(-50%);color:#fc6}
#hm.kill{width:34px;height:34px;margin:-17px}#hm.kill:before,#hm.kill:after{left:16px;height:34px;width:3px}
#ret{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}
#ret.dot{width:6px;height:6px;border-radius:50%;background:#ff2a2a;box-shadow:0 0 6px #f00}
#ret.holo{width:30px;height:30px;border-radius:50%;border:2px solid rgba(255,60,60,.9);box-shadow:0 0 6px #f00}
#ret.holo:after{content:"";position:absolute;left:12px;top:12px;width:3px;height:3px;border-radius:50%;background:#ff3a3a}
#scope .mil{position:absolute;left:50%;top:50%;width:66vh;height:2px;margin-left:-33vh;background:repeating-linear-gradient(90deg,transparent 0 calc(6.6vh - 3px),#000 calc(6.6vh - 3px) 6.6vh)}
#scope .ring{position:absolute;left:50%;top:50%;width:66vh;height:66vh;margin:-33vh;border-radius:50%;box-shadow:inset 0 0 6vh 2vh rgba(0,0,0,.85)}
#breath{position:absolute;left:50%;top:calc(50% + 36vh);transform:translateX(-50%);font-size:13px;color:#ddd;text-align:center}
#spec{position:absolute;left:50%;bottom:140px;transform:translateX(-50%);background:rgba(0,0,0,.6);padding:6px 18px;border-radius:4px;font-size:18px;text-align:center}
#recap{position:absolute;left:24px;top:22%;width:360px;background:rgba(8,12,20,.92);border:1px solid #c44;border-radius:8px;padding:12px 14px;font-size:14px}
#recap h3{margin:0 0 6px;font-size:16px;color:#f88}#recap table{width:100%;border-collapse:collapse}#recap td{padding:2px 4px}#recap .sec{color:#9ab;margin-top:8px;font-size:12px;letter-spacing:1px}
#vote{position:absolute;left:50%;top:13%;transform:translateX(-50%);text-align:center;pointer-events:auto}
#vote .cards{display:flex;gap:14px;margin-top:8px}
.vc{width:280px;min-width:0;text-align:left;background:rgba(10,16,26,.92);border:2px solid #3a5a85;padding:12px;font-size:14px}
.vc.mine{border-color:#fff;box-shadow:0 0 12px #7fd0ff}.vc.win{border-color:#7f7}
.vc .vp{font-size:20px;font-weight:bold;color:#7fd0ff}.vc .vs{color:#bcd;margin:2px 0}.vc .vsec{margin-top:6px}.vc .vsec span{color:#9ab}.vc .vk{float:right;color:#9ab}
.vc .vcnt{margin-top:8px;font-size:18px;min-height:22px}
#floats .fn{position:absolute;font-weight:bold;font-size:18px;text-shadow:0 0 3px #000,0 0 2px #000;transform:translate(-50%,-50%)}""")
# HUD html
rep("""<div id="flash"></div><div id="scope" class="hide"></div>""","""<div id="flash"></div><div id="scope" class="hide"><div class="ring"></div><div class="mil"></div><div id="breath"></div></div><div id="ret"></div><div id="floats"></div>""")
rep(""" <div id="sb" class="hide"></div>
</div>""",""" <div id="sb" class="hide"></div><div id="spec" class="hide"></div><div id="recap" class="hide"></div><div id="vote" class="hide"></div>
</div>""")
rep(""" <button class="sm" id="bRelay">""",""" <div class="row"><span>Volume</span><input id="volIn" type="range" min="0" max="1" step="0.05"><span id="volV"></span><label style="font-size:14px;margin-left:10px"><input type="checkbox" id="dnIn"> Damage numbers</label></div>
 <button class="sm" id="bRelay">""")
rep("""<div class="row"><span>Mouse sensitivity</span><input id="sensIn2" type="range" min="0.2" max="3" step="0.05"><span id="sensV2"></span></div>""","""<div class="row"><span>Mouse sensitivity</span><input id="sensIn2" type="range" min="0.2" max="3" step="0.05"><span id="sensV2"></span></div>
 <div class="row"><span>Volume</span><input id="volIn2" type="range" min="0" max="1" step="0.05"><span id="volV2"></span></div>""")
rep("Tab scoreboard &middot; Esc pause</div>","Tab scoreboard &middot; Esc pause<br>Vote loadouts with 1/2/3 &middot; Hold Shift while scoped to steady &middot; Dead: click/Space to cycle spectate</div>")
# events
rep("let kfList=[],hmT=0,hmHS=false,dmgInd=[],flashT=0,bannerT=0;","let kfList=[],hmT=0,hmHS=false,hmKill=false,dmgInd=[],flashT=0,bannerT=0,FLOATS=[],LIFE={taken:[],dealt:[],killer:null},SPEC={i:0,fc:null,fy:0,fp:0},SWAY=[0,0],SWT=0,BREATH=4,VOTEUI={key:''};")
rep("if(e.v===ME)banner('<span style=\"font-size:28px;color:#f66\">YOU WERE ELIMINATED</span>',2)}","if(e.v===ME){banner('<span style=\"font-size:28px;color:#f66\">YOU WERE ELIMINATED</span>',2);LIFE.killer={k:e.k,w:e.w,hs:e.hs};SPEC.i=0;SPEC.fc=null}}")
rep(" else if(e.t==='hit'){if(e.s===ME){hmT=.25;hmHS=e.hs||e.kill}}\n else if(e.t==='dmg'){if(e.v===ME)dmgInd.push({x:e.x,z:e.z,t:1.2})}\n else if(e.t==='tr'){if(e.s!==ME){addTracer(e.o,e.e);sfx(W.kestrel,dist3(e.o,me.pos))}}\n else if(e.t==='boom'){addBoom(e.x,e.y,e.z);sfx(null,dist3([e.x,e.y,e.z],me.pos)*.5,'boom')}",
""" else if(e.t==='hit'){if(e.s===ME&&e.v!==ME){hmT=.3;hmHS=e.hs||e.kill;hmKill=e.kill;SND.hit(e.hs,e.kill);if(settings.dmgNums!==false&&e.p)FLOATS.push({p:e.p.slice(),a:e.amt,hs:e.hs,t:1,ox:rnd(-.3,.3)})}}
 else if(e.t==='dmg'){if(e.v===ME){dmgInd.push({x:e.x,z:e.z,t:1.2});LIFE.taken.push(e);SND.hurt()}if(e.a===ME&&e.v!==ME)LIFE.dealt.push(e)}
 else if(e.t==='tr'){if(e.s!==ME)addTracer(e.o,e.e)}
 else if(e.t==='fx'){if(e.s!==ME&&W[e.w])SND.shot(W[e.w],[e.x,e.y,e.z])}
 else if(e.t==='boom'){addBoom(e.x,e.y,e.z);SND.boom([e.x,e.y,e.z])}
 else if(e.t==='clink'){SND.clink([e.x,e.y,e.z])}
 else if(e.t==='round'){LIFE={taken:[],dealt:[],killer:null};SPEC={i:0,fc:null,fy:0,fp:0};G.myVote=-1;for(const p of G.P)p.revealT=0;SND.sting('vote')}
 else if(e.t==='voted'){const lo=G.opts&&G.opts[e.i];if(lo)banner(`<span style="font-size:26px">LOADOUT: ${W[lo[0]].n}</span>`,2)}
 else if(e.t==='stim'){if(e.s===ME)addKF('<span style="color:#7f7">+50 HP</span>');SND.ui(990)}
 else if(e.t==='shield'){SND.clink([e.x,1,e.z])}
 else if(e.t==='pulse'){if(e.team===me.team){for(const i of e.ids)G.P[i].revealT=4;addKF(`<span style="color:#f88">Echo Pulse: ${e.ids.length} enem${e.ids.length===1?'y':'ies'} revealed</span>`)}SND.sting('vote')}""")
rep(" else if(e.t==='go'){banner('FIGHT!',1.2)}"," else if(e.t==='go'){banner('FIGHT!',1.2);SND.sting('go')}")
rep(" else if(e.t==='rend'){const why="," else if(e.t==='rend'){SND.sting(e.win===me.team?'win':'lose');const why=")
# input
rep("addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;K[e.code]=true;if(e.code==='Tab'||e.code==='Space'&&G)e.preventDefault();if(G&&e.code==='Digit1')swReq=0;if(G&&e.code==='Digit2')swReq=1});",
"""function deadView(){return G&&!G.P[ME].alive&&!G.waiting&&(G.rs==='live'||G.rs==='end')}
function specCycle(d){SPEC.i+=d;SND.ui(500)}
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;K[e.code]=true;if(e.code==='Tab'||e.code==='Space'&&G)e.preventDefault();
 if(G&&G.rs==='vote'&&/^Digit[123]$/.test(e.code)){castVote(+e.code[5]-1);return}
 if(deadView()&&e.code==='Space'&&!e.repeat){specCycle(1);return}
 if(G&&e.code==='Digit1')swReq=0;if(G&&e.code==='Digit2')swReq=1});""")
rep("addEventListener('mousedown',e=>{if(!G||e.target.tagName==='BUTTON'||e.target.tagName==='INPUT')return;if(!locked){lockPointer();return}if(e.button===0)mouseL=true;if(e.button===2)mouseR=true});",
"addEventListener('mousedown',e=>{if(!G||e.target.closest&&e.target.closest('button')||e.target.tagName==='INPUT')return;if(!locked){lockPointer();return}if(deadView()){specCycle(e.button===2?-1:1);return}if(e.button===0)mouseL=true;if(e.button===2)mouseR=true});")
rep("addEventListener('mousemove',e=>{if(!locked||!G)return;const me=G.P[ME];if(!me.alive||G.rs==='over')return;const z=me.adsAmt>.5?camera.fov/75:1;me.yaw-=e.movementX*.0022*settings.sens*z;me.pitch=Math.max(-1.5,Math.min(1.5,me.pitch-e.movementY*.0022*settings.sens*z))});",
"""addEventListener('mousemove',e=>{if(!locked||!G)return;const me=G.P[ME];
 if(deadView()){SPEC.fy-=e.movementX*.0022*settings.sens;SPEC.fp=Math.max(-1.5,Math.min(1.5,SPEC.fp-e.movementY*.0022*settings.sens));return}
 if(!me.alive||G.rs==='over')return;const z=me.adsAmt>.5?camera.fov/75:1;const dy=e.movementY*.0022*settings.sens*z;me.yaw-=e.movementX*.0022*settings.sens*z;me.pitch=Math.max(-1.5,Math.min(1.5,me.pitch-dy));
 if(dy>0&&me.rcAcc>0)me.rcAcc=Math.max(0,me.rcAcc-dy)});""")
# applySnap
rep("G.rs=s.rs;G.rt=s.rt;G.el=s.el;G.sc=s.sc;G.rn=s.rn;G.lo=s.lo;G.win=s.win;G.flag=s.fl;","G.rs=s.rs;G.rt=s.rt;G.el=s.el;G.sc=s.sc;G.rn=s.rn;G.lo=s.lo;G.win=s.win;G.flag=s.fl;G.opts=s.op;G.votes=s.vt;G.voteWin=s.vw;\n G.boxes=G.boxes.filter(b=>!b.dyn).concat((s.D||[]).map(a=>({dyn:a[0],min:[a[1],a[2],a[3]],max:[a[4],a[5],a[6]],col:0x6fb6ff})));")
# render: players
rep("""  if(i!==ME||OVERVIEW){const k=Math.min(1,dt*15/Math.max(1,SPEED/2));""","""  const ox=p.rpos[0],oz=p.rpos[2];
  if(i!==ME||OVERVIEW){const k=Math.min(1,dt*15/Math.max(1,SPEED/2));""")
rep("""  const u=m.userData;u.body.scale.y=p.crouch?.66:1;u.head.position.y=p.crouch?1.0:1.6;u.visor.position.y=p.crouch?1.02:1.62;u.band.position.y=p.crouch?1.08:1.68;u.gunHolder.position.y=p.crouch?.85:1.25;
  if(!p.alive){m.rotation.set(-Math.PI/2*.95,p.ryaw,0,'YXZ');m.position.y+=.3}
  const gw=p.inv[p.cur].w;if(u.gid!==gw){u.gid=gw;while(u.gunHolder.children.length)u.gunHolder.remove(u.gunHolder.children[0]);u.gunHolder.add(buildGun(gw,1.2))}});""",
"""  const u=m.userData;const mv=i===ME&&!OVERVIEW?Math.hypot(p.vel[0],p.vel[2]):dt>0?Math.hypot(p.rpos[0]-ox,p.rpos[2]-oz)/dt:0;u.spd+=(Math.min(9,mv)-u.spd)*Math.min(1,dt*10);
  animPlayer(p,m,dt);
  if(!p.alive){m.rotation.set(-Math.PI/2*.95,p.ryaw,0,'YXZ');m.position.y+=.25}
  p.revealT=Math.max(0,(p.revealT||0)-dt);u.marker.visible=p.revealT>0&&p.alive&&p.team!==me.team;
  // positional footsteps
  if(p.alive&&(G.rs==='live'||G.rs==='end')&&u.spd>1.2&&p.pos[1]<4){p._sd=(p._sd||0)+u.spd*dt;const run=u.spd>6.3;if(p._sd>(run?2.1:1.7)){p._sd=0;SND.step(i===ME?null:[p.rpos[0],p.rpos[1],p.rpos[2]],p.crouch?.15:run?1:.5)}}
  const gw=p.inv[p.cur].w;if(u.gid!==gw){u.gid=gw;while(u.gunHolder.children.length)u.gunHolder.remove(u.gunHolder.children[0]);u.gunHolder.add(buildGun(gw,1.1))}});""")
rep("""  if(i!==ME||OVERVIEW){const k=""","""  if(i!==ME||OVERVIEW||!me.alive&&false){const k=""")
rep(""" let cp=me,spect=false;
 if(G.waiting){const mate=G.P.find(p=>p.team===me.team&&p.alive&&p.id!==ME)||G.P.find(p=>p.alive&&p.id!==ME);if(mate){cp=mate;spect=true}}
 else if(!me.alive&&!OVERVIEW){const mate=G.P.find(p=>p.team===me.team&&p.alive&&p.id!==ME);if(mate){cp=mate;spect=true}}
 const w=curW(me);
 if(OVERVIEW){camera.position.set(0,34,26);camera.lookAt(0,0,2);camera.fov=60}
 else{const p=spect?cp.rpos:me.pos;camera.position.set(p[0],p[1]+pH(cp)-.15,p[2]);camera.rotation.set(spect?cp.pitch:me.pitch+VK.kick*.02,spect?cp.ryaw:me.yaw,0);
  camera.fov=75+(w.zoom-75)*me.adsAmt;if(!me.alive&&!spect){camera.position.y+=3}}""",""" let cp=me,spect=false,free=false;
 if(G.waiting){const mate=G.P.find(p=>p.team===me.team&&p.alive&&p.id!==ME)||G.P.find(p=>p.alive&&p.id!==ME);if(mate){cp=mate;spect=true}}
 else if(!me.alive&&!OVERVIEW){const t=specTarget();if(t){cp=t;spect=true}else free=true}
 const w=curW(me);
 // scope sway (snipers/marksman): hold Shift to steady for a few seconds
 if(me.alive&&!spect&&w.scopeOv&&me.adsAmt>.85){SWT+=dt;const hold=(K.ShiftLeft||K.ShiftRight)&&BREATH>0;if(hold)BREATH=Math.max(0,BREATH-dt);else BREATH=Math.min(4,BREATH+dt*.6);const amp=(w.sway||.5)*DEG*(hold?.12:BREATH<=0?1.6:1);SWAY=[Math.sin(SWT*.8)*amp+Math.sin(SWT*2.1)*amp*.3,Math.sin(SWT*1.15)*amp*.8]}else{SWAY=[0,0];BREATH=Math.min(4,BREATH+dt*.6)}
 if(OVERVIEW){camera.position.set(0,34,26);camera.lookAt(0,0,2);camera.fov=60}
 else if(free){if(!SPEC.fc){SPEC.fc=[me.pos[0],me.pos[1]+3,me.pos[2]];SPEC.fy=me.yaw;SPEC.fp=-.4}const f=dirYP(SPEC.fy,SPEC.fp),r=[Math.cos(SPEC.fy),0,-Math.sin(SPEC.fy)];const mvF=(K.KeyW?1:0)-(K.KeyS?1:0),mvR=(K.KeyD?1:0)-(K.KeyA?1:0),sp=10*dt;for(let a=0;a<3;a++)SPEC.fc[a]+=(f[a]*mvF+r[a]*mvR)*sp;SPEC.fc[0]=Math.max(-15.5,Math.min(15.5,SPEC.fc[0]));SPEC.fc[2]=Math.max(-23.5,Math.min(23.5,SPEC.fc[2]));SPEC.fc[1]=Math.max(.5,Math.min(14,SPEC.fc[1]));
  camera.position.set(...SPEC.fc);camera.rotation.set(SPEC.fp,SPEC.fy,0);camera.fov=75}
 else{const p=spect?cp.rpos:me.pos;camera.position.set(p[0],p[1]+pH(cp)-.15,p[2]);camera.rotation.set(spect?cp.pitch:me.pitch+VK.kick*.02+SWAY[1],spect?cp.ryaw:me.yaw+SWAY[0],0);
  camera.fov=75+(w.zoom-75)*me.adsAmt}
 if(spect){pMeshes[cp.id].visible=false}
 G.specName=spect&&!G.waiting?cp.name:free?'':null;G.free=free;""")
rep(""" $('#scope').classList.toggle('hide',!(w.scopeOv&&a>.85&&me.alive&&!spect));""",""" const scoped=w.scopeOv&&a>.85&&me.alive&&!spect&&!free;$('#scope').classList.toggle('hide',!scoped);if(scoped)$('#breath').textContent=(K.ShiftLeft||K.ShiftRight)&&BREATH>0?'Steadying... '+BREATH.toFixed(1)+'s':BREATH<4?'Catching breath':'Hold Shift to steady';
 const rt=$('#ret');rt.className=me.alive&&!spect&&!free&&a>.8&&(w.sight==='dot'||w.sight==='holo')?w.sight:'';
 vm.visible=vm.visible&&!free;
 const dseen={};for(const b of G.boxes){if(!b.dyn)continue;dseen[b.dyn]=1;if(!dynMeshes[b.dyn]){const sx=b.max[0]-b.min[0],sy=b.max[1]-b.min[1],sz=b.max[2]-b.min[2];const m=new THREE.Mesh(boxGeo(sx,sy,sz,1),matT(0x8fc8ff,'metal',{transparent:true,opacity:.8}));m.position.set((b.min[0]+b.max[0])/2,b.min[1]+sy/2,(b.min[2]+b.max[2])/2);scene.add(m);dynMeshes[b.dyn]=m}}
 for(const id in dynMeshes)if(!dseen[id]){scene.remove(dynMeshes[id]);delete dynMeshes[id]}""")
rep("let mapGroup=null,pMeshes=[],","let dynMeshes={};let mapGroup=null,pMeshes=[],")
rep("mat({frag:0x3a5a2a,smoke:0x888888,flash:0xdddd55,rocket:0x222222}[n.type]));","mat({frag:0x3a5a2a,smoke:0x888888,flash:0xdddd55,rocket:0x222222,sticky:0xc03030,knife:0xcfd6dc}[n.type]||0x888888));if(n.type==='knife')m.scale.set(.5,.5,2.2);")
rep("function render(dt){","""function specTarget(){const me=G.P[ME];const mates=G.P.filter(p=>p.alive&&p.team===me.team&&p.id!==ME);if(!mates.length)return null;const list=mates.concat(G.P.filter(p=>p.alive&&p.team!==me.team));const n=list.length;return list[((SPEC.i%n)+n)%n]}
function recapHTML(){const me=G.P[ME];const grp=(arr,key)=>{const o={};for(const e of arr){const k=key(e);(o[k]=o[k]||{n:0,amt:0,hs:0,e}).n++;o[k].amt+=e.amt;if(e.hs)o[k].hs++}return Object.values(o)};
 const wn=w=>W[w]?W[w].n:UT[w]?UT[w].n:w;let h='<h3>DAMAGE RECAP</h3>';
 if(LIFE.killer){const k=LIFE.killer;h+=`<div>Eliminated by ${k.k===ME?'yourself':nm(k.k)} &middot; ${wn(k.w)}${k.hs?' <b style="color:#f66">HEADSHOT</b>':''}</div>`}
 const tk=grp(LIFE.taken,e=>e.a+'|'+e.w);h+='<div class="sec">DAMAGE TAKEN</div><table>'+(tk.length?tk.map(g=>`<tr><td>${nm(g.e.a)}</td><td style="color:#9ab">${wn(g.e.w)}</td><td>${g.n} hit${g.n>1?'s':''}${g.hs?` <span style="color:#f66">(${g.hs} HS)</span>`:''}</td><td style="text-align:right;color:#f88"><b>${g.amt}</b></td></tr>`).join(''):'<tr><td style="color:#789">none</td></tr>')+'</table>';
 const dl=grp(LIFE.dealt,e=>e.v);const en=G.P.filter(p=>p.team!==me.team);h+='<div class="sec">DAMAGE DEALT</div><table>'+en.map(p=>{const g=dl.find(x=>x.e.v===p.id);return `<tr><td>${nm(p.id)}</td><td>${g?g.n+' hit'+(g.n>1?'s':''):'-'}${g&&g.hs?` <span style="color:#f66">(${g.hs} HS)</span>`:''}</td><td style="text-align:right;color:#7f7"><b>${g?g.amt:0}</b></td><td style="color:#9ab">${p.alive?p.hp+' hp left':'down'}</td></tr>`}).join('')+'</table>';return h}
function voteCard(lo,i){const a=W[lo[0]],b=W[lo[1]],u=UT[lo[2]];return `<button class="vc" data-i="${i}"><div class="vk">[${i+1}]</div><div class="vp">${a.n}</div><div class="vs">${a.cls} &middot; ${a.rpm} RPM &middot; ${a.mag} rds &middot; ${a.sight}</div><div class="vs">Head / Body / Limb: <b>${a.dm.join(' / ')}</b></div><div style="color:#9ab;font-size:12px">${a.d}</div><div class="vsec">${b.n} <span>${b.cls} &middot; ${b.dm.join('/')}</span></div><div class="vsec">${u.n} <span>${u.d}</span></div><div class="vcnt" id="vc${i}"></div></button>`}
function render(dt){""")
# HUD additions
rep(" hmT-=dt/SPEED;const hm=$('#hm');hm.style.opacity=Math.max(0,hmT*4);hm.className=hmHS?'hs':'';",""" hmT-=dt/SPEED;const hm=$('#hm');hm.style.opacity=Math.max(0,hmT*4);hm.className=(hmHS?'hs':'')+(hmKill?' kill':'');
 const fe=$('#floats');FLOATS=FLOATS.filter(f=>(f.t-=dt)>0);let fh='';for(const f of FLOATS){const v=new THREE.Vector3(f.p[0]+f.ox,f.p[1]+.6+(1-f.t)*.8,f.p[2]).project(camera);if(v.z>1)continue;fh+=`<div class="fn" style="left:${(v.x+1)/2*innerWidth}px;top:${(1-v.y)/2*innerHeight}px;opacity:${Math.min(1,f.t*2)};color:${f.hs?'#ff4a4a':'#fff'}">${f.a}</div>`}fe.innerHTML=fh;
 const dv=!me.alive&&!G.waiting&&(G.rs==='live'||G.rs==='end');const sp2=$('#spec');if(dv){sp2.classList.remove('hide');sp2.innerHTML=G.free?'FREE CAMERA <span style="color:#9ab;font-size:14px">- your team is down &middot; WASD to fly, mouse to look</span>':`Spectating <b>${G.specName||''}</b> <div style="color:#9ab;font-size:13px">Left/Right click or Space to cycle</div>`}else sp2.classList.add('hide');
 const rc=$('#recap');if(dv){rc.classList.remove('hide');rc.innerHTML=recapHTML()}else rc.classList.add('hide');
 const vt=$('#vote');if(G.rs==='vote'&&G.opts){vt.classList.remove('hide');const key=G.rn+JSON.stringify(G.opts);if(VOTEUI.key!==key){VOTEUI.key=key;vt.innerHTML=`<div style="font-size:24px;font-weight:bold;text-shadow:0 0 6px #000">ROUND ${G.rn} &middot; VOTE THE LOADOUT <span id="vtT" style="color:#fb6"></span></div><div style="color:#bcd">Press 1 / 2 / 3 or click. Majority wins, ties are random. Everyone gets the winning kit.</div><div class="cards">${G.opts.map(voteCard).join('')}</div>`;vt.querySelectorAll('.vc').forEach(b=>b.onclick=ev=>{ev.stopPropagation();castVote(+b.dataset.i)})}
  $('#vtT').textContent=Math.max(0,Math.ceil(G.rt))+'s';const mv=G.votes?G.votes[ME]:-1;for(let i=0;i<3;i++){const el=$('#vc'+i);if(!el)continue;const vs=(G.votes||[]).map((v,j)=>v===i?j:-1).filter(j=>j>=0);el.innerHTML=`${vs.length} vote${vs.length===1?'':'s'} `+vs.map(j=>`<span style="color:${G.P[j].team?'#ff9b3d':'#5aa8ff'}">&#9679;</span>`).join('');el.parentElement.classList.toggle('mine',mv===i)}}else vt.classList.add('hide');""")
rep("const hideX=me.adsAmt>.7&&(w.scopeOv||w.vm.optic||w.vm.scope)||!me.alive;","const hideX=me.adsAmt>.7&&w.sight!=='iron'||!me.alive||G.rs==='vote';")
rep("!me.alive&&G.rs==='live'?'Spectating teammate - you come back next round':","!me.alive&&G.rs==='live'?'You come back next round':")
rep("const lo=$('#loadout');if(G.rs==='pre'){","const lo=$('#loadout');if(G.rs==='pre'&&G.lo){")
rep("<div style=\"font-size:15px;color:#9ab\">ROUND ${G.rn} LOADOUT - EVERYONE GETS THE SAME KIT</div>","<div style=\"font-size:15px;color:#9ab\">ROUND ${G.rn} LOADOUT (VOTED) - EVERYONE GETS THE SAME KIT</div>")
rep("<b>${W[G.lo[0]].n}</b> <span style=\"color:#9ab\">${W[G.lo[0]].cls}</span></div>","<b>${W[G.lo[0]].n}</b> <span style=\"color:#9ab\">${W[G.lo[0]].cls} &middot; ${W[G.lo[0]].dm.join('/')}</span></div>")
# quit cleanup dyn
rep("nadeMeshes={};smokeMeshes={};if(vm)","nadeMeshes={};smokeMeshes={};for(const k in dynMeshes)scene.remove(dynMeshes[k]);dynMeshes={};if(vm)")
# settings wiring
rep("for(const s of ['#sensIn','#sensIn2'])$(s).oninput=e=>{settings.sens=+e.target.value;saveSettings();syncSens()};syncSens();",
"""for(const s of ['#sensIn','#sensIn2'])$(s).oninput=e=>{settings.sens=+e.target.value;saveSettings();syncSens()};syncSens();
if(settings.vol===undefined)settings.vol=.7;function syncVol(){for(const [a,b] of [['#volIn','#volV'],['#volIn2','#volV2']]){$(a).value=settings.vol;$(b).textContent=Math.round(settings.vol*100)+'%'}}
for(const s of ['#volIn','#volIn2'])$(s).oninput=e=>{settings.vol=+e.target.value;saveSettings();syncVol();ac();SND.ui(600)};syncVol();
$('#dnIn').checked=settings.dmgNums!==false;$('#dnIn').onchange=e=>{settings.dmgNums=e.target.checked;saveSettings()};
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('button')){ac();SND.ui()}});
validateMaps();""")
rep("window.__api={fireShot,hostOnline,joinOnline,hostStartMatch,quitToMenu,W,MAPS,","window.__api={fireShot,hostOnline,joinOnline,hostStartMatch,quitToMenu,W,MAPS,UT,castVote,validateMaps,hitScan,partBoxes,specCycle,hostAction,practice,get SPEC(){return SPEC},get LIFE(){return LIFE},")
open('index.html','w').write(s);print('p4 ok')
