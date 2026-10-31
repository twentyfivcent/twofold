// Graphics PREVIEW renders (before/after, same camera). Uses preview-gfx.html only. Local; testguard on.
process.env.TF_PAGE='preview-gfx.html';require('./testguard');const {launch,open,sleep}=require('./b3lib');const fs=require('fs');
const OUT='previews/gfx/';const save=(f,d)=>fs.writeFileSync(OUT+f,Buffer.from(d.split(',')[1],'base64'));
(async()=>{const br=await launch();const res={};
 for(const [mi,tag,cam] of [[6,'hoshikawa',null],[1,'sunspire',null]]){const errs=[];const h=await open(br,errs,'practice&map='+mi);await sleep(5000);
  const shot=async(mode)=>h.evaluate(async(mode)=>{if(mode==='after'){await GFX.init();GFX.apply()}else{settings.quality='high';applyQuality();G.tod='day';buildMap(G.mapDef)}G.tod='day';
   const hide=()=>{for(const m of pMeshes)if(m)m.visible=false;if(vm)vm.visible=false;if(flagMesh)flagMesh.visible=false};
   const sp=SPAWNS[0];const pose=()=>{hide();camera.position.set(sp[0]*.6,7.5,sp[1]*.82);camera.lookAt(0,0.5,sp[1]*-.15);camera.updateMatrixWorld()};
   for(let i=0;i<3;i++){pose();renderFrame();await new Promise(r=>setTimeout(r,50))}
   const gl=renderer.getContext();const px=new Uint8Array(4);const t0=performance.now();const N=12;for(let i=0;i<N;i++){pose();renderFrame();gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px)}const ms=(performance.now()-t0)/N;
   pose();renderFrame();return {img:renderer.domElement.toDataURL('image/png'),ms:+ms.toFixed(1),map:G.mapDef.n,tris:renderer.info.render.triangles,calls:renderer.info.render.calls}},mode);
  const b=await shot('before');save(tag+'-before.png',b.img);const a=await shot('after');save(tag+'-after.png',a.img);
  res[tag]={map:b.map,before:{ms:b.ms,tris:b.tris,calls:b.calls},after:{ms:a.ms,tris:a.tris,calls:a.calls},errs:errs.slice(0,3)};await h.close()}
 // character: studio turntable, same camera + lights
 {const errs=[];const h=await open(br,errs,'practice&map=6');await sleep(5000);
  const shot=async(mode)=>h.evaluate(async(mode)=>{if(mode==='after'){await GFX.init();GFX.apply()}else{settings.quality='high';applyQuality()}
   mapGroup.visible=false;for(const m of pMeshes)if(m)m.visible=false;if(vm)vm.visible=false;if(window.__stu)scene.remove(window.__stu);
   const st=new THREE.Scene();st.background=new THREE.Color(0x0b0e13);if(mode==='after')st.environment=scene.environment;const cam=new THREE.PerspectiveCamera(40,innerWidth/innerHeight,.05,50);scene.fog=null;scene.background=new THREE.Color(0x0b0e13).convertSRGBToLinear();
   const fl=new THREE.Mesh(new THREE.CircleGeometry(3,48),new THREE.MeshStandardMaterial({color:lin(0x2a2f36),roughness:.8}));fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;st.add(fl);
   st.add(new THREE.HemisphereLight(0xbfd4ff,0x302820,.5));const k=new THREE.DirectionalLight(0xfff0dc,2.2);k.position.set(-2.5,4,-3);k.castShadow=true;k.shadow.mapSize.set(2048,2048);k.shadow.radius=4;const c=k.shadow.camera;c.left=c.bottom=-2;c.right=c.top=2;c.near=.5;c.far=12;st.add(k);
   const rim=new THREE.DirectionalLight(0x8fb4ff,1.4);rim.position.set(2.5,2.5,3);st.add(rim);
   const ch=mode==='after'?GFX.buildCharHD('op',0):buildCharMesh({team:0,id:9},false,'op');ch.rotation.y=-.4;st.add(ch);ch.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
   if(camera.parent&&camera.parent!==scene){window.__cp=camera.parent;camera.parent.remove(camera)}camera.children.forEach(o=>o.visible=false);window.__noLoop=1;const pose=()=>{cam.position.set(0,1.1,-3.2);cam.lookAt(0,.9,0);cam.updateMatrixWorld()};
   for(let i=0;i<3;i++){pose();renderer.render(st,cam);await new Promise(r=>setTimeout(r,50))}pose();renderer.render(st,cam);let tr=0;ch.traverse(o=>{if(o.isMesh)tr+=(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3});
   return {img:renderer.domElement.toDataURL('image/png'),tris:Math.round(tr)}},mode);
  const b=await shot('before');save('char-before.png',b.img);const a=await shot('after');save('char-after.png',a.img);res.char={beforeTris:b.tris,afterTris:a.tris,errs:errs.slice(0,3)};await h.close()}
 console.log(JSON.stringify(res,null,1));await br.close()})().catch(e=>{console.error(e);process.exit(2)});
