// ===== TWOFOLD graphics upgrade PREVIEW (experimental, NOT in the main build) =====
// Route A: soft 4K PCF shadows, screen-space ambient occlusion (depth-reconstructed SSAO), bloom, per-map color grading.
// Route B: 1024px textures with stronger multi-octave normal/roughness detail, image-based lighting (env map) so materials react to light, bevelled box edges.
// Character: higher-detail humanoid (anatomy, face, fingers, gear).
(function(){
const EX='https://unpkg.com/three@0.128.0/examples/js/';
function load(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=EX+src;s.onload=res;s.onerror=rej;document.head.appendChild(s)})}
const GRADE={'Hoshikawa Temple':{sh:[.03,.0,.045],hi:[1.06,.98,.92],sat:1.12,con:1.08},'Sunspire Roof':{sh:[-.01,.02,.04],hi:[1.08,1.0,.9],sat:1.1,con:1.1},_:{sh:[.0,.01,.02],hi:[1.04,1,.96],sat:1.06,con:1.05}};
const AO_SHADER={uniforms:{tDiffuse:{value:null},tDepth:{value:null},proj:{value:new THREE.Matrix4()},iproj:{value:new THREE.Matrix4()},near:{value:.03},far:{value:320},res:{value:new THREE.Vector2(1,1)},R:{value:.55},str:{value:.85}},
 vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:`uniform sampler2D tDiffuse,tDepth;uniform mat4 proj,iproj;uniform float near,far,R,str;uniform vec2 res;varying vec2 vUv;
 vec3 vpos(vec2 uv){float d=texture2D(tDepth,uv).x;vec4 c=vec4(uv*2.-1.,d*2.-1.,1.);vec4 v=iproj*c;return v.xyz/v.w;}
 float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
 void main(){vec4 col=texture2D(tDiffuse,vUv);float d=texture2D(tDepth,vUv).x;if(d>=.9999){gl_FragColor=col;return;}
  vec3 P=vpos(vUv);vec3 px=vpos(vUv+vec2(1./res.x,0.)),py=vpos(vUv+vec2(0.,1./res.y));vec3 N=normalize(cross(px-P,py-P));
  float a=hash(vUv*res)*6.2831;vec3 rv=vec3(cos(a),sin(a),0.);vec3 T=normalize(rv-N*dot(rv,N));vec3 B=cross(N,T);mat3 tbn=mat3(T,B,N);
  float occ=0.;for(int i=0;i<16;i++){float fi=float(i);float r=fract(sin(fi*91.3)*4375.5);float ph=fi*2.39996;float z=.15+.85*fract(fi*.618);vec3 k=vec3(cos(ph)*sqrt(1.-z*z),sin(ph)*sqrt(1.-z*z),z);float sc=mix(.1,1.,(fi/16.)*(fi/16.));
   vec3 S=P+tbn*k*R*sc;vec4 o=proj*vec4(S,1.);vec2 suv=o.xy/o.w*.5+.5;if(suv.x<0.||suv.x>1.||suv.y<0.||suv.y>1.)continue;float sz=vpos(suv).z;float rc=smoothstep(0.,1.,R/abs(P.z-sz));occ+=(sz>=S.z+.02?1.:0.)*rc;}
  occ=1.-occ/16.;gl_FragColor=vec4(col.rgb*mix(1.,occ,str),col.a);}`};
const GRADE_SHADER={uniforms:{tDiffuse:{value:null},sh:{value:new THREE.Vector3()},hi:{value:new THREE.Vector3(1,1,1)},sat:{value:1},con:{value:1}},
 vertexShader:AO_SHADER.vertexShader,
 fragmentShader:`uniform sampler2D tDiffuse;uniform vec3 sh,hi;uniform float sat,con;varying vec2 vUv;
 void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;float l=dot(c,vec3(.2126,.7152,.0722));float w=smoothstep(0.,.6,l);c=c*mix(vec3(1.),hi,w)+sh*(1.-w)*.35*l*4.;
  l=dot(c,vec3(.2126,.7152,.0722));c=mix(vec3(l),c,sat);c=max(vec3(0.),(c-.18)*con+.18);gl_FragColor=vec4(c,1.);}`};
function bevelGeo(sx,sy,sz,tile){const r=Math.min(.045,Math.min(sx,sy,sz)*.18);if(r<.006||!THREE.RoundedBoxGeometry)return GFX._box(sx,sy,sz,tile);const g=new THREE.RoundedBoxGeometry(sx,sy,sz,2,r);
 const p=g.attributes.position,n=g.attributes.normal,uv=g.attributes.uv;for(let i=0;i<p.count;i++){const ax=Math.abs(n.getX(i)),ay=Math.abs(n.getY(i)),az=Math.abs(n.getZ(i));const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
  if(ax>=ay&&ax>=az)uv.setXY(i,(z+sz/2)/tile,(y+sy/2)/tile);else if(ay>=az)uv.setXY(i,(x+sx/2)/tile,(z+sz/2)/tile);else uv.setXY(i,(x+sx/2)/tile,(y+sy/2)/tile)}uv.needsUpdate=true;return g}
const GFX=window.GFX={on:false,_box:null,
 async init(){await load('geometries/RoundedBoxGeometry.js');await load('environments/RoomEnvironment.js');this._box=boxGeo},
 apply(){this.on=true;settings.quality='high';
  // route B: bigger textures + stronger detail normal maps, bevelled edges, env lighting
  texSize=()=>1024;for(const k in NRMC)delete NRMC[k];for(const k in MATT)delete MATT[k];if(typeof TEXC!=='undefined')for(const k in TEXC)delete TEXC[k];
  const _d=derived;derived=n=>{const r=_d(n);for(const t of [r.n,r.r]){t.anisotropy=16}return r};
  const _m=matT;matT=function(c,t,o){const m=_m(c,t,o);if(!m.__gfx){m.__gfx=1;if(m.normalScale)m.normalScale.set(1.6,1.6);m.envMapIntensity=.32;const pb=TPBR[t]||[.8,0,1];m.roughness=Math.max(.18,pb[0]*1.02);if(m.map)m.map.anisotropy=16}return m};
  boxGeo=bevelGeo;
  const pm=new THREE.PMREMGenerator(renderer);scene.environment=pm.fromScene(new THREE.RoomEnvironment(),.04).texture;
  const _ss=setupShadow;setupShadow=function(dl){_ss(dl);dl.shadow.mapSize.set(4096,4096);dl.shadow.radius=4;dl.shadow.bias=-.0004;dl.shadow.normalBias=.015;if(dl.shadow.map){dl.shadow.map.dispose();dl.shadow.map=null}};
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  this.composer();if(G&&G.mapDef){buildMap(G.mapDef)}},
 composer(){const pr=Math.min(2,devicePixelRatio),w=innerWidth*pr,h=innerHeight*pr;renderer.setPixelRatio(pr);
  const mk=()=>{const rt=new THREE.WebGLRenderTarget(w,h,{type:THREE.HalfFloatType,format:THREE.RGBAFormat,minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter});rt.depthTexture=new THREE.DepthTexture(w,h);rt.depthTexture.type=THREE.UnsignedIntType;return rt};
  composer=new THREE.EffectComposer(renderer,mk());composer.renderTarget2.dispose();composer.renderTarget2=mk();composer.writeBuffer=composer.renderTarget2;
  composer.addPass(new THREE.RenderPass(scene,camera));
  const ao=new THREE.ShaderPass(AO_SHADER);const _r=ao.render.bind(ao);ao.render=function(rn,wb,rb){const u=ao.uniforms;u.tDepth.value=rb.depthTexture;u.proj.value.copy(camera.projectionMatrix);u.iproj.value.copy(camera.projectionMatrixInverse);u.near.value=camera.near;u.far.value=camera.far;u.res.value.set(w,h);_r(rn,wb,rb)};composer.addPass(ao);GFX.ao=ao;
  bloomPass=new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.42,.55,.9);composer.addPass(bloomPass);
  const gr=new THREE.ShaderPass(GRADE_SHADER);const _g=gr.render.bind(gr);gr.render=function(a,b,c){const m=G&&G.mapDef&&GRADE[G.mapDef.n]||GRADE._;const u=gr.uniforms;u.sh.value.set(...m.sh);u.hi.value.set(...m.hi);u.sat.value=m.sat;u.con.value=m.con;_g(a,b,c)};composer.addPass(gr);
  finalPass=new THREE.ShaderPass(FINAL_SHADER);composer.addPass(finalPass)}};
// ---- higher-detail humanoid (preview of the "more realistic" character)
GFX.buildCharHD=function(cid,team){const C=CHAR[cid]||CHAR.op;team=team|0;const g=new THREE.Group();
 const S=(c,r,m)=>{const x=new THREE.MeshStandardMaterial({color:lin(c),roughness:r,metalness:m||0,envMapIntensity:.35});return x};
 const fab=(c,r)=>{const x=matT(c,'cloth');const y=x.clone();y.color=lin(c);y.roughness=r||.85;y.normalScale=new THREE.Vector2(.7,.7);return y};
 const suit=fab(C.suit,.9),pants=fab(shadeC(C.suit,.8),.9),armor=S(C.armor,.42,.25),trim=S(C.trim,.3,.7),skinM=S(0xb98468,.55),glove=S(0x23252a,.7),boot=S(0x1d1b19,.6),strap=S(0x2a2a26,.8),tm=S(TEAMC[team],.4,.15),lens=S(0x0b1018,.05,.9);
 const add=(geo,m,x,y,z,par,rx,ry,rz)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);if(rx!==undefined)o.rotation.set(rx,ry||0,rz||0);o.castShadow=o.receiveShadow=true;(par||g).add(o);return o};
 const lathe=(pts,seg)=>new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),seg||28);
 const limb=(r1,r2,l)=>{const gg=new THREE.CylinderGeometry(r2,r1,l,20,4);gg.translate(0,-l/2,0);return gg};
 const rb=(w,h,d,r)=>THREE.RoundedBoxGeometry?new THREE.RoundedBoxGeometry(w,h,d,3,r||Math.min(w,h,d)*.25):new THREE.BoxGeometry(w,h,d);
 const sph=(r,sx,sy,sz)=>{const s=new THREE.SphereGeometry(r,28,20);s.scale(sx||1,sy||1,sz||1);return s};
 // torso: lathe profile (hips -> waist -> chest -> shoulders)
 const tor=lathe([[0,.86],[.17,.87],[.165,.95],[.15,1.05],[.165,1.17],[.19,1.28],[.2,1.36],[.17,1.43],[.08,1.47],[0,1.48]]);tor.scale(1,1,.68);add(tor,suit,0,0,0);
 // plate carrier, pouches, team patch
 add(rb(.36,.36,.07,.025),armor,0,1.21,-.125);add(rb(.36,.36,.07,.025),armor,0,1.21,.125);for(const x of [-.11,0,.11])add(rb(.095,.11,.06,.015),armor,x,1.08,-.175);add(rb(.12,.06,.012,.004),tm,0,1.31,-.162);
 for(const sd of [-1,1])add(rb(.05,.06,.3,.01),strap,sd*.12,1.405,0);add(new THREE.TorusGeometry(.17,.022,8,32),strap,0,.92,0,null,Math.PI/2,0,0).scale.set(1,.7,1);add(rb(.08,.07,.05,.01),trim,0,.92,-.12);
 // backpack
 add(rb(.28,.34,.12,.03),armor,0,1.16,.21);
 // neck + head (skull, jaw, nose, ears, brow), helmet, goggles
 add(limb(.055,.06,.1),skinM,0,1.54,0);const hd=new THREE.Group();hd.position.set(0,1.64,0);g.add(hd);
 add(sph(.105,1,1.12,1.06),skinM,0,0,0,hd);add(sph(.08,1,.7,1),skinM,0,-.065,-.025,hd);add(new THREE.ConeGeometry(.018,.05,8),skinM,0,-.005,-.112,hd,-Math.PI/2.3,0,0);
 for(const sd of [-1,1]){add(sph(.022,.5,1,.8),skinM,sd*.103,-.005,.005,hd);add(sph(.014),S(0xe8e4dc,.3),sd*.037,.018,-.094,hd);add(sph(.0075),S(0x1a1410,.2),sd*.037,.018,-.103,hd);add(rb(.04,.008,.012,.003),S(0x2a1d14,.9),sd*.037,.04,-.098,hd)}
 add(rb(.035,.006,.01,.002),S(0x7a4a40,.6),0,-.075,-.093,hd);
 const hel=new THREE.SphereGeometry(.128,32,20,0,Math.PI*2,0,Math.PI*.55);add(hel,armor,0,.03,.005,hd);add(new THREE.TorusGeometry(.126,.01,8,40),trim,0,.0,0.005,hd,Math.PI/2,0,0);
 add(rb(.17,.045,.04,.012),strap,0,.085,-.105,hd);for(const sd of [-1,1])add(new THREE.CylinderGeometry(.026,.026,.03,16),lens,sd*.042,.085,-.128,hd,Math.PI/2,0,0);
 // arms: deltoid, upper arm, elbow, forearm, gloved hand with fingers
 for(const sd of [-1,1]){const sh=new THREE.Group();sh.position.set(sd*.22,1.4,0);sh.rotation.z=sd*.13;g.add(sh);add(sph(.075,1,.9,1),armor,0,0,0,sh);
  add(limb(.06,.052,.29),suit,0,-.03,0,sh);const el=new THREE.Group();el.position.y=-.32;el.rotation.x=-.25;sh.add(el);add(sph(.05),suit,0,0,0,el);add(rb(.075,.08,.05,.015),armor,0,-.01,.035,el);
  add(limb(.05,.04,.26),suit,0,0,0,el);const hn=new THREE.Group();hn.position.y=-.28;el.add(hn);add(rb(.075,.09,.035,.012),glove,0,-.03,0,hn);
  for(let f=0;f<4;f++)add(limb(.009,.008,.06),glove,(f-1.5)*.018,-.09,-.004,hn,0,0,0);add(limb(.011,.009,.05),glove,sd*-.04,-.04,-.012,hn,0,0,sd*.6)}
 // legs: thigh, knee pad, shin, boot with sole
 for(const sd of [-1,1]){const th=new THREE.Group();th.position.set(sd*.1,.9,0);g.add(th);add(limb(.085,.06,.42),pants,0,0,0,th);add(rb(.08,.12,.07,.02),pants,sd*.08,-.18,0,th);
  const kn=new THREE.Group();kn.position.y=-.43;th.add(kn);add(rb(.1,.11,.05,.02),armor,0,0,-.06,kn);add(limb(.06,.045,.38),pants,0,0,0,kn);
  add(rb(.11,.11,.24,.03),boot,0,-.4,-.04,kn);add(rb(.12,.025,.26,.008),S(0x0e0d0c,.9),0,-.465,-.04,kn)}
 return g};
})();
