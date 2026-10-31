import re
s=open('index.html').read()
def rep(a,b,cnt=1):
    global s
    assert a in s,'MISSING: '+a[:100]; s=s.replace(a,b,cnt)

# ---------- CSS / HTML ----------
rep("#xh div{position:absolute;background:#fff;box-shadow:0 0 2px #000}","#xh{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);pointer-events:none}\n.vc .vimg{width:100%;height:92px;object-fit:contain;background:radial-gradient(#25405e,#0a121c);border-radius:4px;display:block;margin:4px 0}\n.vc .simg{width:78px;height:36px;object-fit:contain;vertical-align:middle;background:#0c1622;border-radius:3px;margin-right:6px}\n.xhp{width:22px;height:22px;min-width:0;padding:0;margin:0 2px;border-radius:4px;border:2px solid #fff3}")
rep(""" <div id="xh"><div></div><div></div><div></div><div></div></div>""",""" <canvas id="xh" width="200" height="200"></canvas>""")
rep(""" <button class="sm" id="bRelay">""",""" <div class="row"><span>Bot difficulty</span><select id="diffSel"><option value="easy">Easy</option><option value="normal">Normal</option><option value="hard">Hard</option></select><button class="sm" id="bXh">Crosshair...</button></div>
 <button class="sm" id="bRelay">""")
rep(""" <button id="bQuit">Leave Match</button>
</div>""",""" <button class="sm" id="bXh2">Crosshair...</button>
 <button id="bQuit">Leave Match</button>
</div>
<div id="xhMenu" class="scr dim hide">
 <h2>CROSSHAIR</h2>
 <div style="display:flex;gap:28px;align-items:flex-start">
  <div>
   <div class="row"><span>Style</span><select id="xhStyle"><option value="cross">Cross</option><option value="dot">Dot</option><option value="circle">Circle</option><option value="crossdot">Cross + dot</option></select></div>
   <div class="row"><span>Color</span><span id="xhPresets"></span><input id="xhHex" maxlength="7" style="width:90px"></div>
   <div class="row"><span>Size</span><input id="xhSize" type="range" min="2" max="30" step="1"><span id="xhSizeV"></span></div>
   <div class="row"><span>Thickness</span><input id="xhThick" type="range" min="1" max="8" step="1"><span id="xhThickV"></span></div>
   <div class="row"><span>Gap</span><input id="xhGap" type="range" min="0" max="20" step="1"><span id="xhGapV"></span></div>
   <div class="row"><span>Opacity</span><input id="xhOp" type="range" min="0.1" max="1" step="0.05"><span id="xhOpV"></span></div>
   <div class="row"><label><input type="checkbox" id="xhOutline"> Outline</label><label style="margin-left:14px"><input type="checkbox" id="xhDyn"> Dynamic spread</label></div>
   <div class="row"><button class="sm" id="xhReset">Reset to default</button><button class="sm" id="xhBack">Back</button></div>
  </div>
  <div><div style="color:#9ab;font-size:13px;margin-bottom:4px">Live preview</div><canvas id="xhPrev" width="200" height="200" style="background:linear-gradient(135deg,#55595f,#8a948a 50%,#b8935c);border-radius:8px"></canvas><div style="color:#9ab;font-size:12px">With dynamic spread on, the preview pulses like firing</div></div>
 </div>
</div>""")
rep("Dead: click/Space to cycle spectate</div>","Dead: click/Space to cycle spectate, F free camera</div>")

# ---------- MAPS ----------
rep("function B(x,z,w,d,h,col,y){return [x,y||0,z,w,h,d,col]}","function B(x,z,w,d,h,col,y,t){return [x,y||0,z,w,h,d,col,t]}\n// All maps are authored on a 32x48 base grid and scaled up by MS (=1.3) at load, then split into 3 lanes by generated divider walls.\nconst MS=1.3,MX=16*MS,MZ=24*MS,LANE_D=6.2*MS;")
CASTLE = r"""
 {n:'Greywater Keep',d:'Original castle courtyard at dusk: a rampart walk with a stair tower and plank bridges on the west, a gatehouse and well in the courtyard, and a timber hall with stables on the east.',floor:0x9a9690,sky:0x4a3e5c,wall:0x8d8a84,wallH:5,fog:[0x3a3048,30,95],flag:[0,1.0,0],mirror:'z',castle:1,dusk:1,
  lanes:['Rampart walk (west)','Courtyard (mid)','Inner hall & stables (east)'],div:{h:3.6,gR:-5.5,gL:-5.5,col:0x8d8a84,tex:'stone',crenel:1},
  half:[
   B(-14.6,-13,2.6,3,2.7,0x8d8a84,0,'stone'),B(-14.6,-11.1,2.6,.8,2.25,0x8d8a84,0,'stone'),B(-14.6,-10.3,2.6,.8,1.8,0x8d8a84,0,'stone'),B(-14.6,-9.5,2.6,.8,1.35,0x8d8a84,0,'stone'),B(-14.6,-8.7,2.6,.8,.9,0x8d8a84,0,'stone'),B(-14.6,-7.9,2.6,.8,.45,0x8d8a84,0,'stone'),
   B(-10,-3.2,3.2,3.6,.4,0x8a6a44,0,'planks'),B(-11.7,-3.2,.15,3.6,1.05,0x6a4a2a,0,'planks'),B(-8.3,-3.2,.15,3.6,1.05,0x6a4a2a,0,'planks'),
   B(-9.2,-11,1.4,1.4,1.3,0x8d8a84,0,'stone'),B(-13.2,-1.8,1.2,1.8,1.2,0xcfb45a,0,'hay'),
   B(-4,-10,2.4,2.4,4.6,0x8d8a84,0,'stone'),B(4,-10,2.4,2.4,4.6,0x8d8a84,0,'stone'),B(0,-10,5.6,2.4,1.4,0x8d8a84,3.2,'stone'),B(0,-11.25,1.4,.06,1.5,0xa32020,2.9,'cloth'),
   B(-3,-5.2,1.3,1.3,.95,0xcfb45a,0,'hay'),B(2.6,-3.2,1.3,1.3,.95,0xcfb45a,0,'hay'),B(2.6,-3.2,1.3,1.3,.9,0xcfb45a,.95,'hay'),B(4.1,-6.6,1.4,2.6,1.1,0x7a5636,0,'planks'),
   B(9,-12.5,.9,.9,4,0x8d8a84,0,'stone'),B(9,-5,.9,.9,4,0x8d8a84,0,'stone'),B(13.2,-8.6,.9,.9,4,0x8d8a84,0,'stone'),
   B(14.6,-14.6,2.8,.3,1.8,0x7a5636,0,'planks'),B(14.6,-11.6,2.8,.3,1.8,0x7a5636,0,'planks'),B(14.6,-13.1,1.2,1.2,.9,0xcfb45a,0,'hay'),
   B(11.2,-9,1,3,1.0,0x7a5636,0,'planks'),B(11.6,-2.6,2.6,1.4,1.1,0x7a5636,0,'planks'),
   B(11.1,-15,9.6,.4,.4,0x5a3d26,4.2,'planks'),B(11.1,-11,9.6,.4,.4,0x5a3d26,4.2,'planks'),B(11.1,-7,9.6,.4,.4,0x5a3d26,4.2,'planks'),B(11.1,-3,9.6,.4,.4,0x5a3d26,4.2,'planks'),
   B(-15.93,-8,.06,1.1,2.2,0xa32020,1.7,'cloth'),B(-15.93,-3,.06,1.1,2.2,0x2a4aa8,1.7,'cloth'),B(15.93,-6,.06,1.1,2.2,0xa32020,1.7,'cloth'),B(5.86,-14,.06,1,2,0x2a4aa8,1.7,'cloth'),B(-5.86,-14,.06,1,2,0xa32020,1.7,'cloth')],
  center:[B(0,0,2,2,1,0x8d8a84,0,'stone'),B(-.85,0,.18,.18,2.5,0x6a4a2a,0,'planks'),B(.85,0,.18,.18,2.5,0x6a4a2a,0,'planks'),B(0,0,2.6,2.6,.2,0x5a3d26,2.5,'planks')],
  torches:[[-15.75,-6,2.7],[-15.75,-13,2.7],[15.75,-10,2.7],[5.75,-8,2.6],[-5.75,-2,2.6]],
  spawnCover:SPAWN_KIT(0x7f7b74),tex:{floor:'cobble',wall:'stone',prop:'planks',cover:'stone'}},
];"""
rep("""  center:[B(0,0,6,2,.5,0x6c7883),B(0,0,2,2,1,0x6c7883)],spawnCover:SPAWN_KIT(0x5d6873),tex:{floor:'snow',wall:'brick',prop:'crate',cover:'metal'},night:1},
];""","""  center:[B(0,0,6,2,.5,0x6c7883),B(0,0,2,2,1,0x6c7883)],spawnCover:SPAWN_KIT(0x5d6873),tex:{floor:'snow',wall:'brick',prop:'crate',cover:'metal'},night:1},"""+CASTLE)
LANES = r"""
// lane names per map (left flank / mid / right flank as seen from the blue spawn looking north)
const LANE_NAMES=[['Container row','Loading dock','Crate stacks'],['Stair-hut side','Helipad','AC-unit side'],['Hut side','Split wall','Sandbag side'],['West beds','Fountain walk','East benches'],['Freight car lane','Ramp yard','Signal hut lane']];
function prepMaps(){MAPS.forEach((m,mi)=>{if(m._prep)return;m._prep=1;m.lanes=m.lanes||LANE_NAMES[mi]||['Left flank','Mid','Right flank'];
 // generated lane dividers (base coords, half-map z<0; mirrored with the rest): x=+-6.2, each with one cross-path gap in this half
 const dv=Object.assign({h:3,gR:-8.5,gL:-5,col:shadeC(m.wall,.95),tex:m.tex.cover},m.div||{});m.div=dv;
 for(const [sx,g] of [[1,dv.gR],[-1,dv.gL]]){for(const [a,c] of [[-18,g-1.2],[g+1.2,0]]){const b=B(sx*6.2,(a+c)/2,.6,c-a,dv.h,dv.col,0,dv.tex);b.div=1;m.half.push(b)}}
 const sc=b=>{b[0]*=MS;b[2]*=MS;b[3]*=MS;b[5]*=MS};for(const k of ['half','center','spawnCover'])for(const b of m[k])sc(b);
 m.flag=[m.flag[0]*MS,m.flag[1],m.flag[2]*MS];if(m.torches)m.torches=m.torches.map(t=>[t[0]*MS,t[2],t[1]*MS]);m.X=MX;m.Z=MZ});}
function shadeC(c,f){const r=Math.min(255,((c>>16)&255)*f)|0,g=Math.min(255,((c>>8)&255)*f)|0,b=Math.min(255,(c&255)*f)|0;return (r<<16)|(g<<8)|b}
prepMaps();
function mirr(m,b){return m.mirror==='z'?[b[0],b[1],-b[2],b[3],b[4],b[5],b[6],b[7]]:[-b[0],b[1],-b[2],b[3],b[4],b[5],b[6],b[7]]}
function buildBoxes(m){
 const raw=[...m.center];for(const b of m.half){raw.push(b);const q=mirr(m,b);q.div=b.div;raw.push(q)}
 const cov=[];for(const b of (m.spawnCover||[])){cov.push(b);cov.push(mirr(m,b))}
 const mk=b=>({min:[b[0]-b[3]/2,b[1],b[2]-b[5]/2],max:[b[0]+b[3]/2,b[1]+b[4],b[2]+b[5]/2],col:b[6],tex:b[7],div:b.div});
 const boxes=raw.map(mk);for(const b of cov){const x=mk(b);x.cover=1;x.wall=1;boxes.push(x)}
 const X=MX,Z=MZ,T=1;
 const walls=[{min:[-X-T,0,-Z-T],max:[X+T,12,-Z]},{min:[-X-T,0,Z],max:[X+T,12,Z+T]},{min:[-X-T,0,-Z],max:[-X,12,Z]},{min:[X,0,-Z],max:[X+T,12,Z]}];
 for(const w of walls){w.wall=1;boxes.push(w)}
 return boxes;
}
const SPAWNS=[[-3*MS,-21.5*MS],[3*MS,-21.5*MS],[3*MS,21.5*MS],[-3*MS,21.5*MS]];
const SPAWN_ZONE={x:[-5*MS,5*MS],z:[-23.5*MS,-19.5*MS]};// team 0 zone (team 1 zone is mirrored)
const MAP_MIN={w:38,d:58};
function validateMaps(){const errs=[];
 MAPS.forEach((m,mi)=>{
  if(!m.spawnCover||!m.spawnCover.length){errs.push(m.n+': no spawnCover declared');return}
  if(!m.lanes||m.lanes.length!==3)errs.push(m.n+': must declare exactly 3 lanes');
  if(2*m.X<MAP_MIN.w||2*m.Z<MAP_MIN.d)errs.push(m.n+': too small ('+(2*m.X).toFixed(1)+'x'+(2*m.Z).toFixed(1)+'m, min '+MAP_MIN.w+'x'+MAP_MIN.d+')');
  const boxes=buildBoxes(m);const rw=(o,d,L)=>{let best=L;for(const b of boxes){const t=rayBox(o,d,b.min,b.max,best);if(t>=0&&t<best)best=t}return best};
  // 1) zero line of sight between sampled points of the two spawn zones (prone-ish, crouched, standing and mid-jump eye heights)
  const pts=[];for(let x=SPAWN_ZONE.x[0];x<=SPAWN_ZONE.x[1]+1e-6;x+=1)for(let z=SPAWN_ZONE.z[0];z<=SPAWN_ZONE.z[1]+1e-6;z+=1)for(const y of [.3,1.05,1.65,2.9])pts.push([x,y,z]);
  let leaks=0;for(const a of pts)for(const q of pts){const b=[q[0],q[1],-q[2]];const d=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],L=Math.hypot(...d);if(rw(a,[d[0]/L,d[1]/L,d[2]/L],L)>=L-.05)leaks++}
  if(leaks)errs.push(m.n+': '+leaks+' spawn-to-spawn sight lines');
  // 2) walkable grid + flood fill from spawn
  const S=.5,NX=Math.ceil(2*m.X/S),NZ=Math.ceil(2*m.Z/S),blk=new Uint8Array(NX*NZ);const cx=i=>-m.X+(i+.5)*S,cz=j=>-m.Z+(j+.5)*S,ci=x=>Math.floor((x+m.X)/S),cj=z=>Math.floor((z+m.Z)/S);
  for(let i=0;i<NX;i++)for(let j=0;j<NZ;j++){const x=cx(i),z=cz(j);for(const b of boxes){if(b.min[1]<1.6&&b.max[1]>.55&&x+.3>b.min[0]&&x-.3<b.max[0]&&z+.3>b.min[2]&&z-.3<b.max[2]){blk[i*NZ+j]=1;break}}}
  const flood=(si,sj,ok)=>{const seen=new Uint8Array(NX*NZ);if(blk[si*NZ+sj])return seen;const st=[[si,sj]];seen[si*NZ+sj]=1;while(st.length){const [i,j]=st.pop();for(const [a,c] of [[1,0],[-1,0],[0,1],[0,-1]]){const u=i+a,v=j+c;if(u<0||v<0||u>=NX||v>=NZ)continue;const k=u*NZ+v;if(seen[k]||blk[k]||ok&&!ok(u,v))continue;seen[k]=1;st.push([u,v])}}return seen};
  const seen=flood(ci(SPAWNS[0][0]),cj(SPAWNS[0][1]));
  const row=cj(-18*MS);let runs=0,inRun=false;for(let i=0;i<NX;i++){const ok=seen[i*NZ+row];if(ok&&!inRun)runs++;inRun=ok}
  if(runs<2||runs>3)errs.push(m.n+': '+runs+' spawn exit(s) (need 2-3)');
  if(!seen[ci(SPAWNS[2][0])*NZ+cj(SPAWNS[2][1])])errs.push(m.n+': no path from spawn to the enemy spawn');
  // 3) three lanes: each band must connect from just outside our spawn wall to just outside theirs, staying inside the band
  const bands=[[-m.X,-LANE_D],[-LANE_D,LANE_D],[LANE_D,m.X]];const z0=-18*MS+1.2,z1=18*MS-1.2;m.laneOk=[];
  bands.forEach((bd,li)=>{const inB=(u)=>{const x=cx(u);return x>bd[0]+.35&&x<bd[1]-.35};let ok=false;const j0=cj(z0),j1=cj(z1);
   for(let i=0;i<NX&&!ok;i++){if(!inB(i)||blk[i*NZ+j0]||!seen[i*NZ+j0])continue;const f=flood(i,j0,(u)=>inB(u));for(let k=0;k<NX;k++)if(f[k*NZ+j1]){ok=true;break}}
   m.laneOk.push(ok);if(!ok)errs.push(m.n+': lane "'+m.lanes[li]+'" does not run spawn to spawn')});
  // 4) cross-paths: walkable openings through the lane dividers
  let cross=0;for(const x of [-LANE_D,LANE_D]){const i=ci(x);let r=false;for(let j=cj(-18*MS)+2;j<cj(18*MS)-2;j++){const o=seen[i*NZ+j];if(o&&!r)cross++;r=o}}
  if(cross<2)errs.push(m.n+': only '+cross+' cross-path(s) between lanes');
  m.exits=runs;m.leaks=leaks;m.cross=cross;m.size=(2*m.X).toFixed(1)+'x'+(2*m.Z).toFixed(1)+'m'});
 if(errs.length)console.error('MAP VALIDATION FAILED:\n'+errs.join('\n'));window.__mapErrors=errs;return errs}
"""
a=s.index("function buildBoxes(m){");b=s.index("\n// ===================== UTIL")
s=s[:a]+LANES.lstrip('\n')+s[b:]
# shadeC uses nothing else; shade() defined later is fine.

# ---------- textures ----------
rep(" wood:(x,S)=>{"," stone:(x,S)=>{x.fillStyle='#6f6c66';x.fillRect(0,0,S,S);const rows=4,h=S/rows;for(let r=0;r<rows;r++){let c=r%2?-rr(10,30):0;while(c<S){const w=rr(26,52),v=rr(150,200)|0;x.fillStyle=`rgb(${v},${v-3},${v-8})`;x.fillRect(c+2,r*h+2,w-4,h-4);x.fillStyle='rgba(0,0,0,.12)';x.fillRect(c+2,r*h+h-6,w-4,4);c+=w}}const id=x.getImageData(0,0,S,S),d=id.data;for(let i=0;i<d.length;i+=4){const q=(Math.random()-.5)*28;d[i]+=q;d[i+1]+=q;d[i+2]+=q}x.putImageData(id,0,0);blot(x,S,10,'rgba(60,80,40,.12)',3,8)},\n cobble:(x,S)=>{x.fillStyle='#5d5a55';x.fillRect(0,0,S,S);for(let i=0;i<60;i++){const v=rr(130,185)|0;x.fillStyle=`rgb(${v},${v-2},${v-6})`;x.beginPath();x.ellipse(rr(0,S),rr(0,S),rr(6,12),rr(5,10),rr(0,3),0,7);x.fill()}const id=x.getImageData(0,0,S,S),d=id.data;for(let i=0;i<d.length;i+=4){const q=(Math.random()-.5)*20;d[i]+=q;d[i+1]+=q;d[i+2]+=q}x.putImageData(id,0,0)},\n planks:(x,S)=>{const n=5,h=S/n;for(let r=0;r<n;r++){const v=rr(170,210)|0;x.fillStyle=`rgb(${v},${v*.72|0},${v*.48|0})`;x.fillRect(0,r*h,S,h);x.strokeStyle='rgba(70,40,15,.25)';for(let k=0;k<4;k++){x.beginPath();const y=r*h+rr(3,h-3);x.moveTo(0,y);for(let q=0;q<=S;q+=8)x.lineTo(q,y+Math.sin(q*.06+k+r)*1.5);x.stroke()}x.fillStyle='rgba(40,20,5,.55)';x.fillRect(0,r*h,S,2);const j=rr(20,S-20);x.fillRect(j,r*h,2,h);x.fillStyle='#2a2a2a';x.fillRect(j-6,r*h+4,3,3);x.fillRect(j+5,r*h+h-7,3,3)}},\n hay:(x,S)=>{grain(x,S,'#e6cf7a',30);x.lineWidth=1;for(let i=0;i<220;i++){x.strokeStyle=`rgba(${rr(120,200)|0},${rr(90,150)|0},30,.5)`;x.beginPath();const a=rr(0,S),b=rr(0,S);x.moveTo(a,b);x.lineTo(a+rr(-10,10),b+rr(-3,3));x.stroke()}x.fillStyle='rgba(90,60,20,.6)';x.fillRect(0,S*.3,S,3);x.fillRect(0,S*.7,S,3)},\n cloth:(x,S)=>{grain(x,S,'#d8d8d8',12);x.globalAlpha=.1;x.fillStyle='#000';for(let i=0;i<S;i+=2){x.fillRect(i,0,1,S)}x.globalAlpha=1;x.fillStyle='rgba(255,230,120,.85)';x.beginPath();x.moveTo(S/2,S*.25);x.lineTo(S*.68,S*.5);x.lineTo(S/2,S*.75);x.lineTo(S*.32,S*.5);x.fill();x.strokeStyle='rgba(255,230,120,.85)';x.lineWidth=5;x.strokeRect(8,8,S-16,S-16)},\n wood:(x,S)=>{")

# ---------- buildMap: sizes, per-box tex, castle extras ----------
rep("const fg=new THREE.PlaneGeometry(32,48);const fu=fg.attributes.uv;for(let i=0;i<fu.count;i++)fu.setXY(i,fu.getX(i)*32/3,fu.getY(i)*48/3);","const fg=new THREE.PlaneGeometry(2*MX,2*MZ);const fu=fg.attributes.uv;for(let i=0;i<fu.count;i++)fu.setXY(i,fu.getX(i)*2*MX/3,fu.getY(i)*2*MZ/3);")
rep("for(const z of [-21.5,21.5]){const s=new THREE.Mesh(new THREE.PlaneGeometry(10,4)","for(const z of [SPAWNS[0][1],SPAWNS[2][1]]){const s=new THREE.Mesh(new THREE.PlaneGeometry(10*MS,4*MS)")
rep("else if(b.cover)t=m.tex.cover;else t=propTex(col,m);","else if(b.tex)t=b.tex;else if(b.cover)t=m.tex.cover;else t=propTex(col,m);")
rep("for(let x=-12;x<=12;x+=8){const l=new THREE.Mesh(new THREE.BoxGeometry(1.5,.1,30)","for(let x=-12*MS;x<=12.1*MS;x+=8*MS){const l=new THREE.Mesh(new THREE.BoxGeometry(1.5,.1,40)")
rep("for(const [x,z] of [[-14,-10],[14,10],[-14,10],[14,-10]]){","for(const [x,z] of [[-14*MS,-10*MS],[14*MS,10*MS],[-14*MS,10*MS],[14*MS,-10*MS],[0,-14*MS],[0,14*MS]]){")
rep("const roof=new THREE.Mesh(new THREE.PlaneGeometry(32,48),","const roof=new THREE.Mesh(new THREE.PlaneGeometry(2*MX,2*MZ),")
rep(" flagMesh=new THREE.Group();const pole="," if(m.castle)buildCastleDecor(m);\n flagMesh=new THREE.Group();const pole=")
rep("function gmat(c){","""function buildCastleDecor(m){
 // crenellations (merlons) along the outer walls and on top of the lane walls, torches with flickering lights, distant hills
 const sm=matT(0x8d8a84,'stone');const mg=new THREE.BoxGeometry(.8,.7,.8);
 const merl=(x,y,z)=>{const o=new THREE.Mesh(mg,sm);o.position.set(x,y+.35,z);mapGroup.add(o)};
 for(let x=-MX+.4;x<MX;x+=1.6){merl(x,m.wallH,-MZ-.4);merl(x,m.wallH,MZ+.4)}for(let z=-MZ+.4;z<MZ;z+=1.6){merl(-MX-.4,m.wallH,z);merl(MX+.4,m.wallH,z)}
 const walk=new THREE.Mesh(boxGeo(2*MX+2,.3,1.6,2.5),matT(0x7a756e,'stone'));for(const z of [-MZ-.2,MZ+.2]){const w=walk.clone();w.position.set(0,m.wallH-.15,z);mapGroup.add(w)}
 for(const b of G.boxes){if(!b.div)continue;const h=b.max[1];for(let z=b.min[2]+.4;z<b.max[2]-.3;z+=1.4){const o=new THREE.Mesh(new THREE.BoxGeometry(.6,.55,.7),sm);o.position.set((b.min[0]+b.max[0])/2,h+.27,z);mapGroup.add(o)}}
 const T=[];for(const t of m.torches||[]){T.push(t);T.push(m.mirror==='z'?[t[0],t[1],-t[2]]:[-t[0],t[1],-t[2]])}
 G.torchLights=[];
 for(const t of T){const br=new THREE.Mesh(new THREE.CylinderGeometry(.05,.03,.5,6),matT(0x4a3020,'wood'));br.position.set(t[0],t[1]-.25,t[2]);mapGroup.add(br);
  const fl=new THREE.Mesh(new THREE.ConeGeometry(.12,.35,7),new THREE.MeshBasicMaterial({color:0xffa030}));fl.position.set(t[0],t[1]+.12,t[2]);mapGroup.add(fl);
  if(G.torchLights.length<8){const pl=new THREE.PointLight(0xff9a40,1.1,16,1.6);pl.position.set(t[0]+(t[0]>0?-.4:t[0]<0?.4:0),t[1]+.3,t[2]);mapGroup.add(pl);G.torchLights.push({l:pl,f:fl,ph:Math.random()*9})}}
 for(let i=0;i<16;i++){const a=i/16*Math.PI*2,r=rnd(70,100);const h=new THREE.Mesh(new THREE.SphereGeometry(rnd(14,26),8,6),matT(0x3a4a34,'snow'));h.scale.y=.3;h.position.set(Math.cos(a)*r,-2,Math.sin(a)*r);mapGroup.add(h)}
 const moon=new THREE.Mesh(new THREE.SphereGeometry(4,12,10),new THREE.MeshBasicMaterial({color:0xffe6c0}));moon.position.set(-60,45,-80);mapGroup.add(moon)}
function gmat(c){""")
rep("mapGroup.add(new THREE.HemisphereLight(m.night?0xb8c8ff:0xffffff,0x444444,m.night?.55:.75));","mapGroup.add(new THREE.HemisphereLight(m.night?0xb8c8ff:m.dusk?0xffd8c0:0xffffff,0x444444,m.night?.55:m.dusk?.5:.75));G.torchLights=[];")

# ---------- free cam / spectate defaults ----------
rep("if(!SPEC.fc){SPEC.fc=[me.pos[0],me.pos[1]+3,me.pos[2]];SPEC.fy=me.yaw;SPEC.fp=-.4}","if(!SPEC.fc){const sg=me.pos[2]<0?-1:1;SPEC.fc=[me.pos[0]*.6,9,me.pos[2]+sg*4];SPEC.fy=sg<0?Math.PI:0;SPEC.fp=-.55}")
rep("SPEC.fc[0]=Math.max(-15.5,Math.min(15.5,SPEC.fc[0]));SPEC.fc[2]=Math.max(-23.5,Math.min(23.5,SPEC.fc[2]));","SPEC.fc[0]=Math.max(-MX+.5,Math.min(MX-.5,SPEC.fc[0]));SPEC.fc[2]=Math.max(-MZ+.5,Math.min(MZ-.5,SPEC.fc[2]));")
a=s.index("function specTarget(){");b=s.index("\n",a)
s=s[:a]+"""function specTarget(){const me=G.P[ME];if(SPEC.free)return null;const alive=G.P.filter(p=>p.alive&&p.id!==ME);if(!alive.length)return null;
 // default: living teammate first, then the player who killed you, then whoever is nearest to where you died
 const k=LIFE.killer?G.P[LIFE.killer.k]:null;const mates=alive.filter(p=>p.team===me.team).sort((a,b)=>dist3(a.pos,me.pos)-dist3(b.pos,me.pos));
 const rest=alive.filter(p=>p.team!==me.team).sort((a,b)=>((b===k)-(a===k))||dist3(a.pos,me.pos)-dist3(b.pos,me.pos));const list=mates.concat(rest);const n=list.length;return list[((SPEC.i%n)+n)%n]}"""+s[b:]
rep("if(deadView()&&e.code==='Space'&&!e.repeat){specCycle(1);return}","if(deadView()&&e.code==='Space'&&!e.repeat){specCycle(1);return}\n if(deadView()&&e.code==='KeyF'&&!e.repeat){SPEC.free=!SPEC.free;SPEC.fc=null;return}")
rep("sp2.innerHTML=G.free?'FREE CAMERA <span style=\"color:#9ab;font-size:14px\">- your team is down &middot; WASD to fly, mouse to look</span>':`Spectating <b>${G.specName||''}</b> <div style=\"color:#9ab;font-size:13px\">Left/Right click or Space to cycle</div>`",
    "sp2.innerHTML=G.free?'FREE CAMERA <span style=\"color:#9ab;font-size:14px\">WASD fly &middot; mouse look &middot; F follow players</span>':`Spectating <b>${G.specName||''}</b>${LIFE.killer&&G.P[LIFE.killer.k]&&G.P[LIFE.killer.k].name===G.specName&&G.P[LIFE.killer.k].team!==me.team?' <span style=\"color:#f88\">(your killer)</span>':''} <div style=\"color:#9ab;font-size:13px\">Left/Right click or Space to cycle &middot; F free camera</div>`")
rep("camera.position.set(0,34,26);camera.lookAt(0,0,2);camera.fov=60","camera.position.set(0,58,30);camera.lookAt(0,0,2);camera.fov=62")

# ---------- crosshair HUD ----------
rep("const xh=$('#xh').children;","")
a=s.index(" [[0,-1],[0,1],[-1,0],[1,0]].forEach(([x,y],i)=>{const d=xh[i].style;");b=s.index("\n",a)
s=s[:a]+" {const xc=$('#xh');xc.style.display=hideX?'none':'block';if(!hideX){const c=xhCfg(),spr=Math.round(sp*6);const key=JSON.stringify(c)+spr;if(xc._k!==key){xc._k=key;drawXH(xc,c,spr)}}}"+s[b:]
rep("function render(dt){","""const XH_DEF={style:'cross',color:'#3dff6a',size:8,thick:2,gap:4,outline:true,opacity:1,dynamic:true};
const XH_PRESETS=['#3dff6a','#ff3b3b','#3de0ff','#ffe03d','#ffffff','#ff4dff'];
function xhCfg(){return Object.assign({},XH_DEF,settings.xh||{})}
function drawXH(cv,c,spread){const x=cv.getContext('2d'),cx=cv.width/2,cy=cv.height/2;x.clearRect(0,0,cv.width,cv.height);x.globalAlpha=c.opacity;
 const g=c.gap+(c.dynamic?spread:0),t=c.thick,s=c.size,sh=[];
 if(c.style==='cross'||c.style==='crossdot')sh.push(['r',cx-t/2,cy-g-s,t,s],['r',cx-t/2,cy+g,t,s],['r',cx-g-s,cy-t/2,s,t],['r',cx+g,cy-t/2,s,t]);
 if(c.style==='dot'||c.style==='crossdot'){const d=Math.max(2,t*1.5);sh.push(['r',cx-d/2,cy-d/2,d,d])}
 if(c.style==='circle'){sh.push(['c',cx,cy,g+s/2,t]);sh.push(['r',cx-1,cy-1,2,2])}
 for(const pass of c.outline?[0,1]:[1]){x.fillStyle=x.strokeStyle=pass?c.color:'#000';const o=pass?0:1;for(const q of sh){if(q[0]==='r')x.fillRect(Math.round(q[1])-o,Math.round(q[2])-o,q[3]+2*o,q[4]+2*o);else{x.lineWidth=q[4]+2*o;x.beginPath();x.arc(q[1],q[2],q[3],0,7);x.stroke()}}}x.globalAlpha=1}
function render(dt){""")

# torch flicker in render
rep("function render(dt){\n","function render(dt){\n if(G&&G.torchLights)for(const t of G.torchLights){t.ph+=dt*9;const f=.85+Math.sin(t.ph)*.08+Math.sin(t.ph*2.7)*.06;t.l.intensity=1.1*f;t.f.scale.set(1,f,1)}\n")

# ---------- vote card icons ----------
a=s.index("function voteCard(lo,i){");b=s.index("\n",a)
s=s[:a]+"""function voteCard(lo,i){const a=W[lo[0]],b=W[lo[1]],u=UT[lo[2]];makeIcons();const im=id=>ICON[id]?`<img class="simg" src="${ICON[id]}">`:'';return `<button class="vc" data-i="${i}"><div class="vk">[${i+1}]</div><div class="vp">${a.n}</div>${ICON[lo[0]]?`<img class="vimg" src="${ICON[lo[0]]}">`:''}<div class="vs">${a.cls} &middot; ${a.rpm} RPM &middot; ${a.mag} rds &middot; ${a.sight}</div><div class="vs">Head / Body / Limb: <b>${a.dm.join(' / ')}</b></div><div class="vsec">${im(lo[1])}${b.n} <span>${b.cls} &middot; ${b.dm.join('/')}</span></div><div class="vsec">${im(lo[2])}${u.n} <span>${u.d}</span></div><div class="vcnt" id="vc${i}"></div></button>`}
// weapon/utility pictures: each gun's own 3D mesh (and a mesh per utility) rendered side-on once into a small offscreen canvas, cached as data URLs
const ICON={};
function buildUtil(id){const g=new THREE.Group();const M=(c,t)=>matT(c,t||'gunmetal');const add=(geo,m,x,y,z,rz)=>{const o=new THREE.Mesh(geo,m);o.position.set(x||0,y||0,z||0);if(rz)o.rotation.z=rz;g.add(o);return o};
 switch(id){case 'frag':add(new THREE.SphereGeometry(.12,14,10),M(0x4a5a32));add(new THREE.CylinderGeometry(.04,.04,.06,10),M(0x888888),0,.14);add(new THREE.BoxGeometry(.03,.15,.02),M(0x999999),.07,.08);break;
 case 'smoke':add(new THREE.CylinderGeometry(.07,.07,.26,14),M(0x8a9098));add(new THREE.CylinderGeometry(.075,.075,.04,14),M(0xdddddd),0,.06);add(new THREE.CylinderGeometry(.03,.03,.04,8),M(0x666666),0,.15);break;
 case 'flash':add(new THREE.CylinderGeometry(.06,.06,.24,14),M(0x3a3e44));add(new THREE.CylinderGeometry(.062,.062,.05,14),M(0xe0d040),0,.04);add(new THREE.CylinderGeometry(.03,.03,.04,8),M(0x888888),0,.14);break;
 case 'sticky':add(new THREE.CylinderGeometry(.13,.13,.06,16),M(0x5a2a2a));add(new THREE.SphereGeometry(.035,8,6),new THREE.MeshBasicMaterial({color:0xff3030}),0,.04);break;
 case 'shield':add(new THREE.BoxGeometry(.04,.5,.36),M(0x8fc8ff,'metal'));add(new THREE.BoxGeometry(.06,.06,.4),M(0x444444),0,-.27);break;
 case 'pulse':add(new THREE.CylinderGeometry(.08,.1,.18,12),M(0x3a3e44));add(new THREE.SphereGeometry(.06,12,8),new THREE.MeshBasicMaterial({color:0xff6060}),0,.12);add(new THREE.TorusGeometry(.1,.01,6,20),M(0xff9090),0,.05);break;
 case 'stim':add(new THREE.CylinderGeometry(.03,.03,.22,10),M(0xbfe8c8,'glass'),0,0,0,Math.PI/2);add(new THREE.CylinderGeometry(.006,.006,.1,6),M(0xcccccc),.16,0,0,Math.PI/2);add(new THREE.BoxGeometry(.03,.07,.07),M(0x2a7a3a),-.12);break;
 case 'knife':add(new THREE.BoxGeometry(.26,.05,.01),M(0xcfd6dc,'metal'),.12);add(new THREE.BoxGeometry(.13,.04,.026),M(0x3a2a1a,'wood'),-.08);break;
 default:add(new THREE.SphereGeometry(.12,12,10),M(0x777777))}return g}
function makeIcons(){if(makeIcons.done)return;makeIcons.done=1;const t0=performance.now();let r;try{r=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true})}catch(e){console.warn('icons off',e);return}
 r.setPixelRatio(1);const sc=new THREE.Scene();sc.add(new THREE.HemisphereLight(0xffffff,0x556070,1));const dl=new THREE.DirectionalLight(0xffffff,.7);dl.position.set(4,5,1);sc.add(dl);
 const snap=(obj,w,h,dir)=>{r.setSize(w,h);sc.add(obj);const bb=new THREE.Box3().setFromObject(obj),c=bb.getCenter(new THREE.Vector3()),sz=bb.getSize(new THREE.Vector3());const asp=w/h;const span=Math.max(dir?Math.hypot(sz.x,sz.z)*.75:sz.z,.05);const half=Math.max(sz.y/2,span/2/asp)*1.12;
  const cam=new THREE.OrthographicCamera(-half*asp,half*asp,half,-half,.01,50);const d=dir||[1,0,0];cam.position.set(c.x+d[0]*5,c.y+d[1]*5,c.z+d[2]*5);cam.lookAt(c);r.render(sc,cam);const url=r.domElement.toDataURL('image/png');sc.remove(obj);return url};
 for(const id of WIDS){try{ICON[id]=snap(buildGun(id,1),240,96)}catch(e){}}
 for(const id of UTS){try{ICON[id]=snap(buildUtil(id),120,56,[.7,.45,.55])}catch(e){}}
 r.dispose();try{r.forceContextLoss()}catch(e){}window.__iconMs=Math.round(performance.now()-t0);window.__icons=Object.keys(ICON).length}"""+s[b:]

# ---------- crosshair menu + difficulty wiring ----------
rep("validateMaps();\"\"\"","validateMaps();\"\"\"") if False else None
rep("""document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('button')){ac();SND.ui()}});""","""document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('button')){ac();SND.ui()}});
if(!settings.botDiff)settings.botDiff='normal';$('#diffSel').value=settings.botDiff;$('#diffSel').onchange=e=>{settings.botDiff=e.target.value;saveSettings()};
let xhFrom='menu',xhAnim=0;
function xhSync(){const c=xhCfg();$('#xhStyle').value=c.style;$('#xhHex').value=c.color;for(const [id,k,f] of [['xhSize','size',v=>v+'px'],['xhThick','thick',v=>v+'px'],['xhGap','gap',v=>v+'px'],['xhOp','opacity',v=>Math.round(v*100)+'%']]){$('#'+id).value=c[k];$('#'+id+'V').textContent=f(c[k])}$('#xhOutline').checked=c.outline;$('#xhDyn').checked=c.dynamic;
 document.querySelectorAll('.xhp').forEach(b=>b.style.borderColor=b.dataset.c.toLowerCase()===c.color.toLowerCase()?'#fff':'#fff3')}
function xhSet(k,v){settings.xh=Object.assign(xhCfg(),{[k]:v});saveSettings();xhSync()}
$('#xhPresets').innerHTML=XH_PRESETS.map(c=>`<button class="xhp" data-c="${c}" style="background:${c}"></button>`).join('');
document.querySelectorAll('.xhp').forEach(b=>b.onclick=()=>xhSet('color',b.dataset.c));
$('#xhHex').oninput=e=>{const v=e.target.value.trim();if(/^#[0-9a-fA-F]{6}$/.test(v)){settings.xh=Object.assign(xhCfg(),{color:v});saveSettings();document.querySelectorAll('.xhp').forEach(b=>b.style.borderColor=b.dataset.c.toLowerCase()===v.toLowerCase()?'#fff':'#fff3')}};
$('#xhStyle').onchange=e=>xhSet('style',e.target.value);
for(const [id,k] of [['xhSize','size'],['xhThick','thick'],['xhGap','gap'],['xhOp','opacity']])$('#'+id).oninput=e=>xhSet(k,+e.target.value);
$('#xhOutline').onchange=e=>xhSet('outline',e.target.checked);$('#xhDyn').onchange=e=>xhSet('dynamic',e.target.checked);
$('#xhReset').onclick=()=>{delete settings.xh;saveSettings();xhSync()};
function xhOpen(from){xhFrom=from;$('#'+from).classList.add('hide');$('#xhMenu').classList.remove('hide');xhSync();const loop=t=>{if($('#xhMenu').classList.contains('hide'))return;const c=xhCfg();drawXH($('#xhPrev'),c,c.dynamic?Math.round((Math.sin(t/260)+1)*5):0);xhAnim=requestAnimationFrame(loop)};requestAnimationFrame(loop)}
$('#bXh').onclick=()=>xhOpen('menu');$('#bXh2').onclick=()=>xhOpen('pause');
$('#xhBack').onclick=()=>{$('#xhMenu').classList.add('hide');$('#'+xhFrom).classList.remove('hide')};
setTimeout(makeIcons,200);""")

# shot hearing
rep("if(m.t==='shot'){const w=W[m.w];","if(m.t==='shot'){const w=W[m.w];p._shotT=performance.now()/1000;")

# __api
rep("hostAction,practice,damage,equip,roundStart,","hostAction,practice,damage,equip,roundStart,navPath,buildNav,makeIcons,ICON,xhCfg,drawXH,")
open('index.html','w').write(s);print('p5 ok')
