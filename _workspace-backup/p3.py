import re
s=open('index.html').read()
def block(start,end,new):
    global s
    i=s.index(start); j=s.index(end,i); s=s[:i]+new+s[j:]
TEX=r"""// ===================== PROCEDURAL TEXTURES (all generated in code) =====================
const TEXC={};
function rr(a,b){return a+Math.random()*(b-a)}
function cnv(n,f,S){if(TEXC[n])return TEXC[n];S=S||128;const c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d');f(x,S);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;TEXC[n]=t;return t}
function grain(x,S,base,amp){x.fillStyle=base;x.fillRect(0,0,S,S);const id=x.getImageData(0,0,S,S),d=id.data;for(let i=0;i<d.length;i+=4){const r=(Math.random()-.5)*amp;d[i]+=r;d[i+1]+=r;d[i+2]+=r}x.putImageData(id,0,0)}
function blot(x,S,n,c,r0,r1){for(let i=0;i<n;i++){x.fillStyle=c;x.beginPath();x.arc(rr(0,S),rr(0,S),rr(r0,r1),0,7);x.fill()}}
const TEXGEN={
 concrete:(x,S)=>{grain(x,S,'#c9c9c6',34);blot(x,S,26,'rgba(0,0,0,.05)',4,16);blot(x,S,18,'rgba(255,255,255,.05)',3,10);x.strokeStyle='rgba(0,0,0,.18)';x.lineWidth=1;for(let i=0;i<3;i++){x.beginPath();let a=rr(0,S),b=rr(0,S);x.moveTo(a,b);for(let k=0;k<6;k++){a+=rr(-12,12);b+=rr(-12,12);x.lineTo(a,b)}x.stroke()}x.strokeStyle='rgba(0,0,0,.25)';x.strokeRect(0,0,S,S)},
 metal:(x,S)=>{grain(x,S,'#cfd2d6',14);for(let i=0;i<S;i+=2){x.fillStyle=`rgba(255,255,255,${rr(0,.06)})`;x.fillRect(0,i,S,1)}x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=2;x.strokeRect(1,1,S-2,S-2);x.beginPath();x.moveTo(0,S/2);x.lineTo(S,S/2);x.stroke();x.fillStyle='rgba(0,0,0,.4)';for(const [a,b] of [[6,6],[S-6,6],[6,S-6],[S-6,S-6],[6,S/2-6],[S-6,S/2+6]]){x.beginPath();x.arc(a,b,2,0,7);x.fill()}},
 crate:(x,S)=>{grain(x,S,'#d9bf92',22);for(let i=0;i<S;i+=S/6){x.fillStyle='rgba(90,55,20,.35)';x.fillRect(0,i,S,2);for(let k=0;k<5;k++){x.fillStyle='rgba(120,80,40,.18)';x.fillRect(rr(0,S),i+rr(3,18),rr(10,40),1)}}x.strokeStyle='#7a5530';x.lineWidth=12;x.strokeRect(6,6,S-12,S-12);x.lineWidth=10;x.beginPath();x.moveTo(10,10);x.lineTo(S-10,S-10);x.stroke();x.fillStyle='#3a3a3a';for(const [a,b] of [[8,8],[S-8,8],[8,S-8],[S-8,S-8]])x.fillRect(a-3,b-3,6,6)},
 container:(x,S)=>{grain(x,S,'#d0d0d0',16);for(let i=0;i<S;i+=16){const g=x.createLinearGradient(i,0,i+16,0);g.addColorStop(0,'rgba(0,0,0,.25)');g.addColorStop(.5,'rgba(255,255,255,.15)');g.addColorStop(1,'rgba(0,0,0,.25)');x.fillStyle=g;x.fillRect(i,0,16,S)}blot(x,S,10,'rgba(120,60,20,.12)',3,9);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(0,0,S,5);x.fillRect(0,S-5,S,5)},
 sand:(x,S)=>{grain(x,S,'#e9d6ae',30);x.strokeStyle='rgba(150,110,60,.18)';x.lineWidth=2;for(let i=0;i<9;i++){x.beginPath();const y=rr(0,S);x.moveTo(0,y);for(let k=0;k<=S;k+=8)x.lineTo(k,y+Math.sin(k*.08+i)*4);x.stroke()}blot(x,S,30,'rgba(120,90,50,.25)',.6,1.6)},
 roof:(x,S)=>{grain(x,S,'#bdbdbd',50);blot(x,S,120,'rgba(0,0,0,.18)',.5,1.8);blot(x,S,60,'rgba(255,255,255,.18)',.5,1.4);x.strokeStyle='rgba(0,0,0,.2)';x.lineWidth=2;x.strokeRect(0,0,S,S)},
 adobe:(x,S)=>{grain(x,S,'#e0c39c',26);blot(x,S,30,'rgba(140,90,50,.1)',4,14);x.strokeStyle='rgba(110,70,40,.2)';for(let y=12;y<S;y+=22){x.beginPath();x.moveTo(0,y+rr(-2,2));x.lineTo(S,y+rr(-2,2));x.stroke()}},
 tiles:(x,S)=>{x.fillStyle='#8a8a86';x.fillRect(0,0,S,S);const n=4,t=S/n;for(let i=0;i<n;i++)for(let j=0;j<n;j++){const v=rr(205,235)|0;x.fillStyle=`rgb(${v},${v-4},${v-10})`;x.fillRect(i*t+2,j*t+2,t-4,t-4)}const id=x.getImageData(0,0,S,S),d=id.data;for(let i=0;i<d.length;i+=4){const r=(Math.random()-.5)*14;d[i]+=r;d[i+1]+=r;d[i+2]+=r}x.putImageData(id,0,0)},
 glass:(x,S)=>{const g=x.createLinearGradient(0,0,S,S);g.addColorStop(0,'#e8f4f0');g.addColorStop(.5,'#c4ddd6');g.addColorStop(1,'#e2efe9');x.fillStyle=g;x.fillRect(0,0,S,S);x.fillStyle='rgba(255,255,255,.35)';x.beginPath();x.moveTo(10,S);x.lineTo(40,0);x.lineTo(55,0);x.lineTo(25,S);x.fill();x.strokeStyle='#5d6d66';x.lineWidth=6;x.strokeRect(0,0,S,S);x.lineWidth=3;x.beginPath();x.moveTo(S/2,0);x.lineTo(S/2,S);x.moveTo(0,S/2);x.lineTo(S,S/2);x.stroke()},
 planter:(x,S)=>{grain(x,S,'#cdb08a',20);for(let i=0;i<S;i+=S/5){x.fillStyle='rgba(80,50,25,.4)';x.fillRect(0,i,S,2)}x.fillStyle='#4a6a2a';for(let i=0;i<40;i++){x.fillRect(rr(0,S),rr(0,12),2,rr(4,12))}},
 brick:(x,S)=>{x.fillStyle='#8f8a84';x.fillRect(0,0,S,S);const bh=S/8,bw=S/4;for(let r=0;r<8;r++)for(let c=-1;c<5;c++){const v=rr(190,225)|0;x.fillStyle=`rgb(${v},${v-8},${v-14})`;x.fillRect(c*bw+(r%2?bw/2:0)+2,r*bh+2,bw-4,bh-4)}const id=x.getImageData(0,0,S,S),d=id.data;for(let i=0;i<d.length;i+=4){const r=(Math.random()-.5)*22;d[i]+=r;d[i+1]+=r;d[i+2]+=r}x.putImageData(id,0,0)},
 snow:(x,S)=>{grain(x,S,'#f1f5f8',14);blot(x,S,20,'rgba(160,180,200,.12)',5,16);blot(x,S,50,'rgba(255,255,255,.7)',.4,1)},
 fabric:(x,S)=>{grain(x,S,'#d6d6d6',16);x.globalAlpha=.12;x.fillStyle='#000';for(let i=0;i<S;i+=3){x.fillRect(i,0,1,S);x.fillRect(0,i,S,1)}x.globalAlpha=1;blot(x,S,14,'rgba(0,0,0,.06)',4,12);x.strokeStyle='rgba(0,0,0,.25)';x.setLineDash([3,3]);x.strokeRect(10,10,S-20,S-20)},
 gunmetal:(x,S)=>{grain(x,S,'#c8c8c8',20);for(let i=0;i<S;i++){x.fillStyle=`rgba(0,0,0,${rr(0,.06)})`;x.fillRect(0,i,S,1)}blot(x,S,8,'rgba(255,255,255,.08)',2,6)},
 wood:(x,S)=>{grain(x,S,'#d8b48a',16);x.strokeStyle='rgba(90,50,20,.3)';for(let i=0;i<14;i++){x.beginPath();const y=rr(0,S);x.moveTo(0,y);for(let k=0;k<=S;k+=8)x.lineTo(k,y+Math.sin(k*.05+i)*3);x.stroke()}},
};
function tex(n){return cnv(n,TEXGEN[n]||TEXGEN.concrete)}
const MATT={};function matT(c,t,o){const k=c+'|'+t+(o?'|'+JSON.stringify(o):'');if(!MATT[k])MATT[k]=new THREE.MeshLambertMaterial(Object.assign({color:c,map:tex(t)},o||{}));return MATT[k]}
// box with world-scaled UVs so one shared texture tiles evenly at any box size
function boxGeo(sx,sy,sz,tile){const g=new THREE.BoxGeometry(sx,sy,sz);const uv=g.attributes.uv;const dims=[[sz,sy],[sz,sy],[sx,sz],[sx,sz],[sx,sy],[sx,sy]];for(let f=0;f<6;f++)for(let v=0;v<4;v++){const i=f*4+v;uv.setXY(i,uv.getX(i)*dims[f][0]/tile,uv.getY(i)*dims[f][1]/tile)}uv.needsUpdate=true;return g}
function skyTex(top,bot,night){const c=document.createElement('canvas');c.width=4;c.height=256;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,top);g.addColorStop(.75,bot);g.addColorStop(1,bot);x.fillStyle=g;x.fillRect(0,0,4,256);if(night){x.fillStyle='#fff';for(let i=0;i<40;i++)x.fillRect(rr(0,4)|0,rr(0,150)|0,1,1)}return new THREE.CanvasTexture(c)}
function hex(c){return '#'+c.toString(16).padStart(6,'0')}
function shade(c,f){const r=Math.min(255,((c>>16)&255)*f)|0,g=Math.min(255,((c>>8)&255)*f)|0,b=Math.min(255,(c&255)*f)|0;return (r<<16)|(g<<8)|b}
function propTex(col,m){const r=(col>>16)&255,g=(col>>8)&255,b=col&255;if(r>g&&g>b&&r-b>45&&r<200)return 'crate';if(g>r&&g>b)return 'planter';return m.tex.prop==='crate'?'metal':m.tex.prop}
"""
block("// ===================== RENDERING =====================","const renderer=",TEX+"// ===================== RENDERING =====================\n")
NEWMAP=r"""function buildMap(m){
 if(mapGroup)scene.remove(mapGroup);mapGroup=new THREE.Group();scene.add(mapGroup);
 scene.background=skyTex(hex(shade(m.sky,m.night?.6:.8)),hex(shade(m.sky,m.night?1.4:1.12)),m.night);scene.fog=new THREE.Fog(...m.fog);
 mapGroup.add(new THREE.HemisphereLight(m.night?0xb8c8ff:0xffffff,0x444444,m.night?.55:.75));const dl=new THREE.DirectionalLight(m.night?0xcfdcff:0xffffff,m.night?.45:.65);dl.position.set(10,30,14);mapGroup.add(dl);
 const fg=new THREE.PlaneGeometry(32,48);const fu=fg.attributes.uv;for(let i=0;i<fu.count;i++)fu.setXY(i,fu.getX(i)*32/3,fu.getY(i)*48/3);
 const fl=new THREE.Mesh(fg,matT(m.floor,m.tex.floor));fl.rotation.x=-Math.PI/2;mapGroup.add(fl);
 for(const z of [-21.5,21.5]){const s=new THREE.Mesh(new THREE.PlaneGeometry(10,4),new THREE.MeshBasicMaterial({color:z<0?0x2d8cff:0xff8a1e,transparent:true,opacity:.15}));s.rotation.x=-Math.PI/2;s.position.set(0,.02,z);mapGroup.add(s)}
 const edge=new THREE.LineBasicMaterial({color:0x000000,transparent:true,opacity:.22});
 for(const b of G.boxes){if(b.dyn)continue;const sx=b.max[0]-b.min[0],sz=b.max[2]-b.min[2];let sy=b.max[1]-b.min[1],col=b.col,t;
  if(b.wall&&!b.cover){sy=m.wallH;col=m.wall;t=m.tex.wall}else if(b.cover)t=m.tex.cover;else t=propTex(col,m);
  const g=boxGeo(sx,sy,sz,t==='crate'?Math.max(.8,Math.min(sx,sy,sz)):2.5);const me=new THREE.Mesh(g,matT(col,t));me.position.set((b.min[0]+b.max[0])/2,b.min[1]+sy/2,(b.min[2]+b.max[2])/2);mapGroup.add(me);
  if(!b.wall||b.cover){const e=new THREE.LineSegments(new THREE.EdgesGeometry(g),edge);e.position.copy(me.position);mapGroup.add(e)}}
 if(m.wallH<3){for(let i=0;i<26;i++){const a=i/26*Math.PI*2,r=rnd(70,110),h=rnd(15,60);const t=new THREE.Mesh(boxGeo(rnd(8,16),h,rnd(8,16),6),matT(pick([0x6f7f95,0x8090a8,0x5a6a80]),'glass'));t.position.set(Math.cos(a)*r,h/2-25,Math.sin(a)*r);mapGroup.add(t)}}
 if(m.wallH>=5&&!m.night){for(let x=-12;x<=12;x+=8){const l=new THREE.Mesh(new THREE.BoxGeometry(1.5,.1,30),new THREE.MeshBasicMaterial({color:0xfff2c0}));l.position.set(x,m.wallH+.5,0);mapGroup.add(l)}}
 if(m.tex.floor==='sand'){for(let i=0;i<14;i++){const a=i/14*Math.PI*2,r=rnd(45,80);const d=new THREE.Mesh(new THREE.SphereGeometry(rnd(8,18),8,6),matT(0xb88a55,'sand'));d.scale.y=.35;d.position.set(Math.cos(a)*r,0,Math.sin(a)*r);mapGroup.add(d)}}
 if(m.night){for(const [x,z] of [[-14,-10],[14,10],[-14,10],[14,-10]]){const pl=new THREE.PointLight(0xffd9a0,.9,22);pl.position.set(x,3.6,z);mapGroup.add(pl);const lm=new THREE.Mesh(new THREE.SphereGeometry(.18,8,6),new THREE.MeshBasicMaterial({color:0xffe2b0}));lm.position.copy(pl.position);mapGroup.add(lm)}
  for(let i=0;i<10;i++){const t=new THREE.Mesh(new THREE.ConeGeometry(rnd(2,4),rnd(6,12),6),matT(0x2f4a3a,'snow'));t.position.set(rnd(-60,60),3,pick([-1,1])*rnd(40,70));mapGroup.add(t)}}
 if(m.tex.wall==='glass'){const roof=new THREE.Mesh(new THREE.PlaneGeometry(32,48),new THREE.MeshBasicMaterial({color:0xdff5ea,transparent:true,opacity:.12,side:THREE.DoubleSide}));roof.rotation.x=Math.PI/2;roof.position.y=m.wallH;mapGroup.add(roof)}
 flagMesh=new THREE.Group();const pole=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,2.6),matT(0xdddddd,'metal'));pole.position.y=1.3;flagMesh.add(pole);
 const cloth=new THREE.Mesh(new THREE.BoxGeometry(.9,.55,.04),new THREE.MeshLambertMaterial({color:0xffffff,map:tex('fabric')}));cloth.position.set(.47,2.3,0);flagMesh.add(cloth);flagMesh.cloth=cloth;
 const ring=new THREE.Mesh(new THREE.RingGeometry(2.3,2.5,40),new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide,transparent:true,opacity:.6}));ring.rotation.x=-Math.PI/2;ring.position.y=.03;flagMesh.add(ring);flagMesh.ring=ring;
 flagMesh.position.set(...m.flag);flagMesh.visible=false;mapGroup.add(flagMesh);
}
function gmat(c){const r=(c>>16)&255,g=(c>>8)&255,b=c&255;return matT(c,(r>g+15&&g>b&&r>80)?'wood':'gunmetal')}
function buildGun(id,s){
 const w=W[id],v=w.vm,g=new THREE.Group();
 const bx=(x,y,z,sx,sy,sz,c,rx)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),gmat(c));m.position.set(x,y,z);if(rx)m.rotation.x=rx;g.add(m);return m};
 const cyl=(x,y,z,r,l,c,axis)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,l,10),gmat(c));m.position.set(x,y,z);if(axis==='z')m.rotation.x=Math.PI/2;g.add(m);return m};
 const L=v.len;
 bx(0,0,-L/2,v.pistol?.05:.07,v.pistol?.08:.1,L,v.col);
 bx(0,.035,-L*.55,.055,.03,L*.6,v.acc);
 if(v.dbl){cyl(-.017,.015,-L-v.bar/2,v.bw,v.bar,0x1b1b1b,'z');cyl(.017,.015,-L-v.bar/2,v.bw,v.bar,0x1b1b1b,'z')}
 else if(v.rotary){for(let i=0;i<6;i++){const a=i/6*Math.PI*2;cyl(Math.cos(a)*.03,.015+Math.sin(a)*.03,-L-v.bar/2,.01,v.bar,0x1b1b1b,'z')}cyl(0,.015,-L-.02,.05,.05,0x333333,'z')}
 else cyl(0,.015,-L-v.bar/2,v.bw||.016,v.bar,0x1b1b1b,'z');
 if(v.brake)bx(0,.015,-L-v.bar-.03,.05,.04,.07,0x222222);
 if(v.pistol)bx(0,-.08,-.04,.045,.13,.06,v.acc,-.25);else bx(0,-.09,v.mag==='rear'?-.25:-.08,.045,.12,.06,0x1e1e1e,-.3);
 if(v.mag==='curve')bx(0,-.12,-L*.42,.045,.15,.08,v.acc,.3);
 if(v.mag==='box')bx(0,-.1,-L*.42,.05,.12,.09,v.acc);
 if(v.mag==='stick')bx(0,-.14,-L*.3,.035,.2,.05,v.acc);
 if(v.mag==='drum')cyl(0,-.1,-L*.45,.085,.07,v.acc);
 if(v.mag==='tube')cyl(0,-.04,-L*.7,.022,L*.7,v.acc,'z');
 if(v.mag==='cyl')cyl(0,0,-.08,.045,.08,v.acc,'z');
 if(v.mag==='rear')bx(0,-.1,-.02,.05,.14,.08,v.acc,.15);
 if(v.mag==='top')bx(0,.075,-L*.5,.05,.03,L*.6,v.acc);
 if(v.lever){const r=new THREE.Mesh(new THREE.TorusGeometry(.04,.008,6,12),gmat(0x222222));r.position.set(0,-.08,-.12);r.rotation.y=Math.PI/2;g.add(r)}
 if(v.stock)bx(0,-.02,.1,.05,.09,.2,v.acc);
 if(v.optic){bx(0,.08+(v.mag==='top'?.03:0),-L*.35,.04,.05,.09,0x111111);const lens=new THREE.Mesh(new THREE.PlaneGeometry(.03,.03),new THREE.MeshBasicMaterial({color:0xff2a2a}));lens.position.set(0,.085+(v.mag==='top'?.03:0),-L*.35+.046);g.add(lens)}
 if(w.holo){bx(0,.065,-L*.3,.05,.012,.1,0x111111);bx(-.022,.095,-L*.3,.006,.05,.1,0x111111);bx(.022,.095,-L*.3,.006,.05,.1,0x111111);bx(0,.122,-L*.3,.05,.006,.1,0x111111)}
 if(v.scope){cyl(0,.1,-L*.4,v.scope>1?.035:.028,v.scope>1?.32:.24,0x111111,'z');bx(0,.06,-L*.4,.02,.04,.04,0x111111)}
 if(!v.optic&&!v.scope&&!w.holo){bx(0,.065,-L+.02,.01,.025,.01,0x111111);bx(0,.065,-.02,.03,.02,.01,0x111111)}
 if(id==='typhoon'||id==='anvil'||id==='cinder')bx(0,-.06,-L*.8,.03,.08,.03,0x1e1e1e);
 if(id==='triad')bx(0,0,-L*.75,.09,.06,.15,0x555555);
 if(id==='thumper')cyl(0,.015,-L*.5,.05,L,v.col,'z');
 if(id==='brute')bx(0,-.04,-L*.55,.06,.05,.14,0x8a5a2e);
 if(id==='cinder')bx(0,.09,-L*.4,.025,.05,.18,0x222222);
 g.scale.setScalar(s||1);g.userData.L=L+v.bar;return g;
}
function setViewmodel(id){
 if(vmId===id)return;vmId=id;if(vm)camera.remove(vm);vm=new THREE.Group();const gun=buildGun(id);vm.add(gun);vm.scale.setScalar(.62);
 const skin=matT(0xd2a07a,'fabric'),sl=matT(G&&G.P[ME].team===1?0xd9741a:0x2a6fd1,'fabric');
 const hand=new THREE.Mesh(new THREE.BoxGeometry(.08,.08,.12),skin);hand.position.set(0,-.1,-.05);vm.add(hand);
 const sleeve=new THREE.Mesh(new THREE.BoxGeometry(.1,.1,.35),sl);sleeve.position.set(0,-.13,.15);vm.add(sleeve);
 const hand2=new THREE.Mesh(new THREE.BoxGeometry(.08,.07,.1),skin);hand2.position.set(-.01,-.06,-W[id].vm.len*.7);vm.add(hand2);
 const sl2=new THREE.Mesh(new THREE.BoxGeometry(.09,.09,.3),sl);sl2.position.set(-.06,-.1,-W[id].vm.len*.7+.17);sl2.rotation.y=-.3;vm.add(sl2);
 muzzle=new THREE.Mesh(new THREE.SphereGeometry(.045,6,6),new THREE.MeshBasicMaterial({color:0xffd060}));muzzle.position.set(0,.015,-gun.userData.L-.03);vm.add(muzzle);muzzle.visible=false;
 camera.add(vm);
}
// jointed low-poly humanoid: hips -> thighs -> shins, upper body -> head, shoulders -> elbows. Proportions match partBoxes().
let MARKTEX=null;
function buildPlayerMesh(p){
 const g=new THREE.Group(),c=p.team?0xe07a1c:0x2d7ee6,dark=p.team?0x6a3a12:0x1c3a66;
 const cloth=matT(c,'fabric'),pants=matT(dark,'fabric'),skin=matT(0xd2a07a,'fabric'),boot=matT(0x2a2a2a,'gunmetal'),helm=matT(p.team?0x8a5420:0x2a4a7a,'metal'),vest=matT(p.team?0x5a4a30:0x3a4a3a,'fabric');
 const box=(w,h,d,m,x,y,z,par)=>{const me=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);me.position.set(x,y,z);par.add(me);return me};
 const hips=new THREE.Group();hips.position.y=.85;g.add(hips);box(.4,.16,.24,pants,0,0,0,hips);
 const legs=[];for(const sd of [-1,1]){const th=new THREE.Group();th.position.set(sd*.11,0,0);hips.add(th);box(.17,.42,.19,pants,0,-.21,0,th);const kn=new THREE.Group();kn.position.y=-.42;th.add(kn);box(.15,.38,.17,pants,0,-.19,0,kn);box(.17,.08,.26,boot,0,-.39,-.04,kn);legs.push({th,kn,sd})}
 const up=new THREE.Group();hips.add(up);
 box(.46,.6,.28,cloth,0,.3,0,up);box(.48,.34,.31,vest,0,.36,0,up);box(.3,.08,.05,matT(0x222222,'fabric'),0,.25,-.16,up);
 const head=new THREE.Group();head.position.y=.77;up.add(head);box(.25,.27,.25,skin,0,0,0,head);box(.29,.13,.29,helm,0,.14,0,head);box(.22,.07,.03,new THREE.MeshLambertMaterial({color:0x111111}),0,.02,-.135,head);
 const arms=[];for(const sd of [-1,1]){const sh=new THREE.Group();sh.position.set(sd*.31,.55,0);up.add(sh);box(.13,.32,.14,cloth,0,-.16,0,sh);const el=new THREE.Group();el.position.y=-.32;sh.add(el);box(.11,.3,.12,cloth,0,-.15,0,el);box(.1,.09,.1,skin,0,-.31,0,el);arms.push({sh,el,sd})}
 const gunHolder=new THREE.Group();gunHolder.position.set(.1,.42,-.42);up.add(gunHolder);
 if(!MARKTEX)MARKTEX=cnv('mark',(x,S)=>{x.fillStyle='#ff3030';x.beginPath();x.moveTo(S/2,4);x.lineTo(S-4,S/2);x.lineTo(S/2,S-4);x.lineTo(4,S/2);x.fill();x.strokeStyle='#fff';x.lineWidth=6;x.stroke()},64);
 const marker=new THREE.Sprite(new THREE.SpriteMaterial({map:MARKTEX,depthTest:false,transparent:true}));marker.scale.set(.45,.45,1);marker.position.y=2.2;marker.visible=false;marker.renderOrder=10;g.add(marker);
 g.userData={hips,up,legs,arms,head,gunHolder,gid:null,phase:0,spd:0,marker,hy:.85};scene.add(g);return g;
}
function animPlayer(p,m,dt){const u=m.userData;
 const hyT=p.crouch?.42:.85;u.hy+=(hyT-u.hy)*Math.min(1,dt*12);u.hips.position.y=u.hy;
 const sp=u.spd;u.phase+=dt*sp*2.4;const amp=Math.min(.75,sp*.13);
 for(const L of u.legs){const sw=Math.sin(u.phase+(L.sd>0?Math.PI:0))*amp;
  if(p.crouch){L.th.rotation.x=1.2+sw*.3;L.kn.rotation.x=-2.0}else{L.th.rotation.x=sw;L.kn.rotation.x=-Math.max(0,-Math.sin(u.phase+(L.sd>0?Math.PI:0)))*amp*1.3}}
 const pit=Math.max(-.8,Math.min(.8,p.pitch||0));u.up.rotation.x=(p.crouch?-.15:-.03)+(sp>7?-.12:0);
 for(const A of u.arms){if(A.sd>0){A.sh.rotation.set(1.45+pit,0,0);A.el.rotation.x=.15}else{A.sh.rotation.set(1.3+pit,-.55,0);A.el.rotation.x=.55}}
 u.head.rotation.x=pit*.6;u.gunHolder.rotation.x=pit;u.gunHolder.position.y=.42+Math.sin(pit)*.3*0;}
"""
block("function buildMap(m){","function addTracer(",NEWMAP)
AUD=r"""// ===================== AUDIO (all synthesized with WebAudio) =====================
let AC=null;function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume().catch(()=>{});return AC}
const SND={m:null,nb:null,
 rdy(){const a=AC;if(!a||a.state!=='running')return null;if(!SND.m){SND.m=a.createGain();SND.m.connect(a.destination);const b=a.createBuffer(1,a.sampleRate,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;SND.nb=b}SND.m.gain.value=settings.vol===undefined?.7:+settings.vol;return a},
 out(pos,vol){const a=SND.rdy();if(!a)return null;const g=a.createGain();let v=vol;
  if(pos&&G){const L=camera.position;const dx=pos[0]-L.x,dy=pos[1]-L.y,dz=pos[2]-L.z,d=Math.hypot(dx,dy,dz);if(d>80)return null;v*=1/(1+d*.11);
   if(a.createStereoPanner){const pn=a.createStereoPanner();const y=camera.rotation.y;pn.pan.value=Math.max(-1,Math.min(1,(dx*Math.cos(y)-dz*Math.sin(y))/(d||1)))*.85;g.connect(pn);pn.connect(SND.m)}else g.connect(SND.m)}else g.connect(SND.m);
  g.gain.value=v;return g},
 nz(dst,t0,dur,type,f,q,v,dec){const a=AC;const s=a.createBufferSource();s.buffer=SND.nb;const fl=a.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q||1;const e=a.createGain();e.gain.setValueAtTime(v,t0);e.gain.exponentialRampToValueAtTime(.001,t0+dur);s.connect(fl);fl.connect(e);e.connect(dst);s.start(t0,Math.random()*.5);s.stop(t0+dur+.02)},
 tn(dst,t0,f0,f1,dur,type,v){const a=AC;const o=a.createOscillator();o.type=type||'sine';o.frequency.setValueAtTime(f0,t0);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t0+dur);const e=a.createGain();e.gain.setValueAtTime(v,t0);e.gain.exponentialRampToValueAtTime(.001,t0+dur);o.connect(e);e.connect(dst);o.start(t0);o.stop(t0+dur+.02)},
 cls(w){const c=w.cls;if(/Pistol|Cannon|Sawed/.test(c))return /Sawed/.test(c)?'shotgun':'pistol';if(/SMG|PDW/.test(c))return 'smg';if(/Shotgun|Double/.test(c))return 'shotgun';if(/Sniper/.test(c))return 'sniper';if(/Marksman|Lever/.test(c))return 'dmr';if(/LMG/.test(c))return 'lmg';if(/Launcher/.test(c))return 'launch';return 'rifle'},
 shot(w,pos){try{const g=SND.out(pos,pos?1:.55);if(!g)return;const t=AC.currentTime,k=SND.cls(w);
  const P={pistol:[2600,.12,150,.5],smg:[3200,.09,180,.4],rifle:[2200,.16,110,.6],dmr:[1600,.25,90,.8],sniper:[1100,.45,60,1],shotgun:[1300,.3,70,.9],lmg:[1900,.18,100,.65],launch:[600,.25,80,.6]}[k];
  SND.nz(g,t,P[1],'lowpass',P[0],.7,P[3],1);SND.tn(g,t,P[2]*1.6,P[2]*.5,P[1]*.9,'triangle',P[3]*.8);if(k==='sniper'||k==='dmr')SND.nz(g,t+.05,P[1]*1.6,'bandpass',500,.6,P[3]*.25);
  if(w.mode==='pump'||w.mode==='bolt')setTimeout(()=>{const g2=SND.out(pos,.5);if(g2){const t2=AC.currentTime;SND.nz(g2,t2,.05,'highpass',2500,2,.4);SND.nz(g2,t2+.12,.05,'highpass',1800,2,.4)}},w.mode==='bolt'?450:300)}catch(e){}},
 reload(w){try{const g=SND.out(null,.5);if(!g)return;const t=AC.currentTime,r=w.rel;SND.nz(g,t+.1,.04,'highpass',2000,3,.5);SND.nz(g,t+r*.45,.05,'bandpass',1200,4,.6);SND.nz(g,t+r*.85,.06,'highpass',2600,3,.6)}catch(e){}},
 step(pos,loud){try{const g=SND.out(pos,loud*(pos?1:.35));if(!g)return;const t=AC.currentTime;SND.nz(g,t,.07,'lowpass',380+loud*300,1,.7)}catch(e){}},
 hit(hs,kill){try{const g=SND.out(null,.6);if(!g)return;const t=AC.currentTime;SND.tn(g,t,hs?1900:1300,hs?1700:1100,.07,'square',.25);if(kill)SND.tn(g,t+.07,900,600,.18,'triangle',.4)}catch(e){}},
 hurt(){try{const g=SND.out(null,.5);if(!g)return;SND.nz(g,AC.currentTime,.12,'lowpass',500,1,.8)}catch(e){}},
 boom(pos){try{const g=SND.out(pos,1.4);if(!g)return;const t=AC.currentTime;SND.nz(g,t,.9,'lowpass',500,.7,1);SND.tn(g,t,90,30,.7,'sine',1)}catch(e){}},
 ui(f){try{const g=SND.out(null,.35);if(!g)return;SND.tn(g,AC.currentTime,f||700,(f||700)*1.2,.06,'square',.18)}catch(e){}},
 clink(pos){try{const g=SND.out(pos,.6);if(!g)return;SND.tn(g,AC.currentTime,2400,1800,.12,'triangle',.3)}catch(e){}},
 sting(k){try{const g=SND.out(null,.45);if(!g)return;const t=AC.currentTime;const seq={go:[392,523,659],win:[523,659,784,1046],lose:[440,370,311,247],vote:[660,880]}[k]||[500];seq.forEach((f,i)=>SND.tn(g,t+i*.11,f,f,.22,'triangle',.5))}catch(e){}},
};
function sfx(w,dist,kind){if(kind==='boom')SND.boom(null);else if(w)SND.shot(w,null)}
"""
block("// ===================== AUDIO =====================","// ===================== EVENTS",AUD)
open('index.html','w').write(s);print('p3 ok')
