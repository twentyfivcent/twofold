s=open('index.html').read()
def rep(a,b,cnt=1):
    global s
    assert a in s,a[:80]; s=s.replace(a,b,cnt)
# ---- weapons: add new guns before closing of W
rep(""" thumper:{n:'Pomona Thumper'""",""" mako:{n:'Reed Mako',cls:'Compact SMG',d:'Stockless backup SMG: snappy, low damage, quick to swap.',sec:1,mode:'auto',dmg:19,dmin:11,r0:9,r1:20,rpm:820,mag:25,rel:1.7,sp:2.9,ads:1.4,rv:.6,rh:.55,zoom:64,spd:1.05,vm:{len:.3,col:0x3b3f2c,acc:0x8c6a3a,bar:.06,mag:'stick',stock:0,pistol:1}},
 dart:{n:'Nimble Dart',cls:'Burst Pistol',d:'Three-round burst sidearm: fast follow-ups, rewards tapping.',sec:1,mode:'burst',burst:3,brpm:1100,rpm:240,dmg:24,dmin:14,r0:10,r1:24,mag:18,rel:1.5,sp:2.1,ads:.7,rv:1.1,rh:.25,zoom:64,spd:1.06,vm:{len:.22,col:0xc8c2b4,acc:0x2b2b2b,bar:.05,mag:'none',stock:0,pistol:1}},
 flint:{n:'Flint Coachgun',cls:'Sawed-off',d:'Two shells of buckshot in a pocket-sized break-action. Brutal up close.',sec:1,mode:'semi',pellets:8,dmg:15,dmin:2,r0:4,r1:10,rpm:300,mag:2,rel:2.2,sp:7.5,ads:6,rv:4.5,rh:.8,zoom:66,spd:1.04,vm:{len:.3,col:0x2b2b2b,acc:0x6a4126,bar:.14,mag:'none',stock:0,pistol:1,bw:.03,dbl:1}},
 thumper:{n:'Pomona Thumper'""")
rep(""" sparrow:{n:'Brisk Sparrow'""",""" osprey:{n:'Coldwater Osprey',cls:'Marksman Rifle',d:'Fast semi-auto marksman with a 4x scope: 2 body + 1 limb or 1 head + 1 body.',mode:'semi',dmg:48,dmin:40,r0:30,r1:60,rpm:360,mag:15,rel:2.5,sp:3,ads:.15,rv:2.1,rh:.35,zoom:30,scopeOv:1,sway:.25,spd:.9,vm:{len:.74,col:0x5c6650,acc:0x2a2a2a,bar:.3,mag:'box',stock:1,scope:1}},
 mantis:{n:'Verin Mantis',cls:'Bullpup Burst',d:'Two-round burst bullpup: compact, steady and quick on target.',mode:'burst',burst:2,brpm:1100,rpm:260,dmg:36,dmin:27,r0:20,r1:44,mag:30,rel:2.2,sp:2.2,ads:.32,rv:.85,rh:.2,zoom:52,holo:1,spd:.94,vm:{len:.5,col:0x2f3a2f,acc:0xa0a0a0,bar:.18,mag:'rear',stock:0}},
 drake:{n:'Harrow Drake',cls:'Lever Rifle',d:'Lever-action: slow cycle, big hits, one headshot drops anyone at mid range.',mode:'pump',dmg:62,dmin:50,r0:25,r1:50,rpm:95,mag:8,rel:3,sp:3,ads:.2,rv:3,rh:.4,zoom:48,holo:1,spd:.93,vm:{len:.72,col:0x6b4426,acc:0x9a8f80,bar:.3,mag:'tube',stock:1,lever:1}},
 gust:{n:'Tamsin Gust',cls:'PDW',d:'50-round top-loaded PDW: long sprays, mild kick, weak per bullet.',mode:'auto',dmg:20,dmin:13,r0:11,r1:24,rpm:880,mag:50,rel:2.4,sp:2.6,ads:1,rv:.5,rh:.4,zoom:60,spd:1.04,vm:{len:.46,col:0x50555c,acc:0x1d1d1d,bar:.08,mag:'top',stock:1,optic:1}},
 rook:{n:'Olden Rook',cls:'Double-barrel',d:'Two barrels, nine pellets each: devastating double-tap, long reload.',mode:'semi',pellets:9,dmg:19,dmin:3,r0:6,r1:15,rpm:240,mag:2,rel:2.6,sp:5.5,ads:4.2,rv:4.5,rh:.6,zoom:64,spd:.97,vm:{len:.75,col:0x3a3a3a,acc:0x7a4a26,bar:.2,mag:'none',stock:1,bw:.032,dbl:1}},
 pike:{n:'Bastion Pike',cls:'Heavy Sniper',d:'Massive bolt-action: kills to the body, heavy scope sway - hold Shift to steady.',mode:'bolt',dmg:130,dmin:120,r0:60,r1:100,rpm:35,mag:4,rel:3.8,sp:9,ads:0,rv:6,rh:.6,zoom:12,scopeOv:1,sway:1.2,spd:.78,vm:{len:1.05,col:0x2a2d30,acc:0x50402a,bar:.5,mag:'box',stock:1,scope:2,brake:1}},
 cinder:{n:'Cinder Spool',cls:'Rotary LMG',d:'100-round high-rate LMG: very slow to move, melts anything in front of it.',mode:'auto',dmg:22,dmin:17,r0:16,r1:36,rpm:900,mag:100,rel:5.2,sp:3.8,ads:1.1,rv:.55,rh:.65,zoom:56,spd:.74,vm:{len:.78,col:0x45403a,acc:0x1c1c1c,bar:.3,mag:'drum',stock:1,bw:.03,rotary:1}},
 sparrow:{n:'Brisk Sparrow'""")
rep("const PRIMS=['kestrel','strix','wasp','ferret','brute','typhoon','anvil','lancet','longreach','triad','hornet'];\nconst SECS=['sparrow','magnate','buzz','thumper'];",
"const PRIMS=['kestrel','strix','wasp','ferret','brute','typhoon','anvil','lancet','longreach','triad','hornet','osprey','mantis','drake','gust','rook','pike','cinder'];\nconst SECS=['sparrow','magnate','buzz','thumper','mako','dart','flint'];")
rep("lancet:{n:'Sorrel Lancet',cls:'Marksman Rifle',d:'Semi-auto marksman rifle: 2 body shots, pinpoint when aimed.',mode:'semi',dmg:56,dmin:46,r0:35,r1:70,rpm:300,mag:12,rel:2.6,sp:3.2,ads:.12,rv:2.6,rh:.4,zoom:38,",
"lancet:{n:'Sorrel Lancet',cls:'Marksman Rifle',d:'Semi-auto marksman rifle: 2 body shots, pinpoint when aimed.',mode:'semi',dmg:56,dmin:46,r0:35,r1:70,rpm:300,mag:12,rel:2.6,sp:3.2,ads:.12,rv:2.6,rh:.4,zoom:34,scopeOv:1,sway:.3,")
rep("zoom:16,scopeOv:1,spd:.82","zoom:16,scopeOv:1,sway:.8,spd:.82")
rep("const UT={frag:{n:'Pinecone Frag',d:'Hold G to cook; bounces; splash damage (6m).',c:1},smoke:{n:'Fogger Smoke',d:'Thick cloud for ~14s that blocks sight.',c:1},flash:{n:'Blinder Flash',d:'Whites out anyone facing it, blinds bots.',c:2}};",
"""const UT={frag:{n:'Pinecone Frag',d:'Hold G to cook; bounces; splash damage (6m).',c:1},smoke:{n:'Fogger Smoke',d:'Thick cloud for ~14s that blocks sight.',c:1},flash:{n:'Blinder Flash',d:'Whites out anyone facing it, blinds bots.',c:2},
 sticky:{n:'Burr Charge',d:'Sticks to the first thing it touches, then blows 2.5s later (4.5m).',c:1},
 shield:{n:'Bulwark Panel',d:'Deploys a bullet-proof cover panel in front of you for 15s.',c:1,inst:1},
 pulse:{n:'Echo Pulse',d:'Reveals enemies within 20m to your team for 4s, even through walls.',c:2,inst:1},
 stim:{n:'Mend Stim',d:'Instantly heals 50 HP.',c:1,inst:1},
 knife:{n:'Talon Knife',d:'Thrown blade: 100 head / 75 body / 55 limb.',c:2,throwNow:1}};""")
rep("for(const k in W){const w=W[k];w.id=k;w.head=w.head||(w.mode==='bolt'?2:1.5);w.seed=k.length*1.3;if(w.res===undefined)w.res=w.mag*3}",
"""// per-part damage at close range [head, body, limb] (falls off with range by the gun's dmin/dmg ratio)
const DMG={kestrel:[40,28,22],strix:[50,35,28],wasp:[27,21,18],ferret:[33,25,20],brute:[22,17,14],typhoon:[17,13,11],anvil:[40,30,25],lancet:[90,56,45],longreach:[200,105,80],triad:[46,33,26],hornet:[40,29,23],
 osprey:[85,48,38],mantis:[52,36,28],drake:[110,62,48],gust:[26,20,17],rook:[24,19,15],pike:[250,130,95],cinder:[30,22,18],sparrow:[38,26,20],magnate:[102,68,52],buzz:[24,18,15],mako:[25,19,15],dart:[34,24,19],flint:[19,15,12],thumper:[150,150,150]};
for(const k in W){const w=W[k];w.id=k;w.dm=DMG[k]||[w.dmg*1.5,w.dmg,w.dmg*.8];w.seed=k.length*1.3+k.charCodeAt(0)*.07;if(w.res===undefined)w.res=w.mag*3;
 w.sight=w.scopeOv?'scope':w.vm.optic?'dot':w.holo?'holo':'iron';if(w.sight==='iron'&&!w.vm.pistol&&!w.pellets)w.zoom=Math.min(w.zoom,58);
 // learnable recoil pattern: mostly vertical, horizontal drift that snakes the same way every spray, tiny randomness added per shot
 w.pat=[];const dir=(k.charCodeAt(1)%2)?1:-1;for(let i=0;i<40;i++){w.pat.push([1.05-Math.min(.35,i*.025),dir*(i<4?.15:.55)*Math.sin(i*.42+w.seed)+(i>10?dir*.25:0)])}}""")
# ---- maps: spawn cover + new maps
rep("""const MAPS=[""","""// Every map must declare spawnCover boxes (same half-coordinates as 'half', auto-mirrored). The standard kit below gives a
// walled spawn with 3 exits: left lane, right lane, and a center door shielded by a baffle wall. validateMaps() raycasts both
// spawn zones against each other and flood-fills the exits, and complains loudly if a map breaks either rule.
const SPAWN_KIT=c=>[B(-5.75,-18,8.5,.6,4.2,c),B(5.75,-18,8.5,.6,4.2,c),B(0,-15.6,6,.6,4.2,c)];
const MAPS=[""")
rep("B(-4,-10,2,2,2,0x9b7a4a),B(-4,-10,1.4,1.4,1.1,0x8a6a3a,2),B(4.5,-15,3,1.2,1.1,0x9b7a4a),B(0,-18,6,1,1.1,0x7f8c99),",
"B(-4,-10,2,2,2,0x9b7a4a),B(-4,-10,1.4,1.4,1.1,0x8a6a3a,2),B(5,-13.5,3,1.2,1.1,0x9b7a4a),")
rep("  center:[B(0,0,6,3,1.4,0x7f8c99)]},","  center:[B(0,0,6,3,1.4,0x7f8c99)],spawnCover:SPAWN_KIT(0x6a5a48),tex:{floor:'concrete',wall:'metal',prop:'crate',cover:'container'}},")
rep("B(-12,-18,2,2,1.4,0xc3c8cd),B(4,-9,1,3,1.2,0xa0a6ad),B(0,-3.85,2,.7,.45,0xd6c25a),B(-12.4,-18,.8,.8,.5,0x888888,1.4)],",
"B(-13,-13,2,2,1.4,0xc3c8cd),B(4,-9,1,3,1.2,0xa0a6ad),B(0,-3.85,2,.7,.45,0xd6c25a),B(-13.4,-13,.8,.8,.5,0x888888,1.4)],")
rep("B(0,-19,4,1,1.2,0xa0a6ad),","B(8,-11,2,1,1.2,0xa0a6ad),")
rep("  center:[B(0,0,7,7,.9,0x575c63)]},","  center:[B(0,0,7,7,.9,0x575c63)],spawnCover:SPAWN_KIT(0xb0a89a),tex:{floor:'roof',wall:'concrete',prop:'metal',cover:'concrete'}},")
rep("B(0,-18.5,5,.8,1,0x9c8a5e),B(12,-15,2,2,1.2,0x8a6a3a),B(6,-18,1,1,1.3,0x7a3b2a)],\n  center:[]},",
"""B(12,-13,2,2,1.2,0x8a6a3a),B(6,-13,1,1,1.3,0x7a3b2a)],
  center:[],spawnCover:SPAWN_KIT(0xb08458),tex:{floor:'sand',wall:'adobe',prop:'crate',cover:'adobe'}},
 {n:'Glasshouse Atrium',d:'Overgrown botanical greenhouse: raised planters, potting benches, tiled walkways and a dry fountain in the middle.',floor:0x9aa39a,sky:0xbfe3d0,wall:0xa9c4b4,wallH:5,fog:[0xbfe3d0,30,95],flag:[0,.8,0],
  half:[B(-9,-12,4,1.4,1,0x6f8f4a),B(9,-12,4,1.4,1,0x6f8f4a),B(-3.5,-9,1.2,3,1.15,0x8a6a4a),B(3.5,-9,1.2,3,1.15,0x8a6a4a),B(-12.5,-5,2,4,1.3,0x5f7f3a),B(0,-6.5,4,.6,1.2,0xb7b2a6),B(7,-4,1,1,2.6,0xcfd6cf),B(-7,-4,1,1,2.6,0xcfd6cf),B(12.5,-8,2,2,1.1,0x8a6a4a),B(-6,-14.5,1.4,1.4,.9,0x6f8f4a)],
  center:[B(0,0,4,4,.8,0xb7b2a6),B(0,0,1.2,1.2,1.6,0xcfd6cf)],spawnCover:SPAWN_KIT(0x7d9a86),tex:{floor:'tiles',wall:'glass',prop:'planter',cover:'brick'}},
 {n:'Frostline Depot',d:'Snowed-in rail yard at night: two freight cars split the lanes, pallet stacks, a signal hut and a low loading ramp in the middle.',floor:0xe4ecf2,sky:0x1d2a3d,wall:0x55606c,wallH:4,fog:[0x1d2a3d,25,80],flag:[0,0,0],
  half:[B(-8.5,-8,2.6,7,2.7,0x8a2e2a),B(10,-12,2.2,2.2,1.2,0x9b7a4a),B(10,-12,1.4,1.4,1,0x8a6a3a,1.2),B(-12.5,-14,2,3,1.2,0x9b7a4a),B(3,-10,3,.8,1.1,0x6c7883),B(12,-4,2,3,2.4,0x4f6b8a),B(-3,-4,1,1,1.2,0x9b7a4a),B(0,-13,2,1,1.2,0x6c7883)],
  center:[B(0,0,6,2,.5,0x6c7883),B(0,0,2,2,1,0x6c7883)],spawnCover:SPAWN_KIT(0x5d6873),tex:{floor:'snow',wall:'brick',prop:'crate',cover:'metal'},night:1},""")
rep("""function buildBoxes(m){
 const raw=[...m.center];for(const b of m.half){raw.push(b);raw.push([-b[0],b[1],-b[2],b[3],b[4],b[5],b[6]])}
 const boxes=raw.map(b=>({min:[b[0]-b[3]/2,b[1],b[2]-b[5]/2],max:[b[0]+b[3]/2,b[1]+b[4],b[2]+b[5]/2],col:b[6]}));""",
"""function buildBoxes(m){
 const raw=[...m.center];for(const b of m.half){raw.push(b);raw.push([-b[0],b[1],-b[2],b[3],b[4],b[5],b[6]])}
 const cov=[];for(const b of (m.spawnCover||[])){cov.push(b);cov.push([-b[0],b[1],-b[2],b[3],b[4],b[5],b[6]])}
 const mk=b=>({min:[b[0]-b[3]/2,b[1],b[2]-b[5]/2],max:[b[0]+b[3]/2,b[1]+b[4],b[2]+b[5]/2],col:b[6]});
 const boxes=raw.map(mk);for(const b of cov){const x=mk(b);x.cover=1;x.wall=1;boxes.push(x)}""")
rep("const SPAWNS=[[-3,-21.5],[3,-21.5],[3,21.5],[-3,21.5]];","""const SPAWNS=[[-3,-21.5],[3,-21.5],[3,21.5],[-3,21.5]];
const SPAWN_ZONE={x:[-5,5],z:[-23.5,-19.5]};// team 0 zone (team 1 zone is mirrored)
function validateMaps(){const errs=[];
 MAPS.forEach((m,mi)=>{
  if(!m.spawnCover||!m.spawnCover.length){errs.push(m.n+': no spawnCover declared');return}
  const boxes=buildBoxes(m);const rw=(o,d,L)=>{let best=L;for(const b of boxes){const t=rayBox(o,d,b.min,b.max,best);if(t>=0&&t<best)best=t}return best};
  // 1) zero line of sight between any sampled points of the two spawn zones (standing, crouched and mid-jump eye heights)
  const pts=[];for(let x=SPAWN_ZONE.x[0];x<=SPAWN_ZONE.x[1];x+=1)for(let z=SPAWN_ZONE.z[0];z<=SPAWN_ZONE.z[1];z+=1)for(const y of [.3,1.05,1.65,2.9])pts.push([x,y,z]);
  let leaks=0;for(const a of pts)for(const q of pts){const b=[-q[0],q[1],-q[2]];const d=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],L=Math.hypot(...d);if(rw(a,[d[0]/L,d[1]/L,d[2]/L],L)>=L-.05)leaks++}
  if(leaks)errs.push(m.n+': '+leaks+' spawn-to-spawn sight lines');
  // 2) exits: walkable flood fill from spawn; need >=2 separate openings out of the spawn and a path to the middle/enemy side
  const S=.5,NX=64,NZ=96,blk=new Uint8Array(NX*NZ);
  for(let i=0;i<NX;i++)for(let j=0;j<NZ;j++){const x=-16+(i+.5)*S,z=-24+(j+.5)*S;for(const b of boxes){if(b.min[1]<1.6&&b.max[1]>.55&&x+.3>b.min[0]&&x-.3<b.max[0]&&z+.3>b.min[2]&&z-.3<b.max[2]){blk[i*NZ+j]=1;break}}}
  const seen=new Uint8Array(NX*NZ),st=[[Math.floor((-3+16)/S),Math.floor((-21.5+24)/S)]];seen[st[0][0]*NZ+st[0][1]]=1;
  while(st.length){const [i,j]=st.pop();for(const [a,c] of [[1,0],[-1,0],[0,1],[0,-1]]){const u=i+a,v=j+c;if(u<0||v<0||u>=NX||v>=NZ)continue;const k=u*NZ+v;if(seen[k]||blk[k])continue;seen[k]=1;st.push([u,v])}}
  const row=Math.floor((-18+24)/S);let runs=0,inRun=false;for(let i=0;i<NX;i++){const ok=seen[i*NZ+row];if(ok&&!inRun)runs++;inRun=ok}
  if(runs<2)errs.push(m.n+': only '+runs+' spawn exit(s)');
  if(!seen[Math.floor(16/S)*NZ+Math.floor((24+21.5)/S)])errs.push(m.n+': no path from spawn to the enemy side');
  m.exits=runs;m.leaks=leaks});
 if(errs.length)console.error('MAP VALIDATION FAILED:\\n'+errs.join('\\n'));window.__mapErrors=errs;return errs}""")
open('index.html','w').write(s);print('p1 ok')
