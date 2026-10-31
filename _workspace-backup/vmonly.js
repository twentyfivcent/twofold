require('./testguard');const puppeteer=require('puppeteer-core');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const br=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-angle=swiftshader']});const pg=await br.newPage();await pg.setViewport({width:800,height:450});pg.on('pageerror',e=>console.log('PE',e.message));
await pg.goto('http://localhost:8765/'+process.argv[2]+'?q=low&practice&map=1');await sleep(4000);
await pg.evaluate((id)=>{const G=__api.G;G.rs='live';G.rt=999;const me=G.P[__api.ME];__api.equip(me,[id,'sparrow','frag']);for(const p of G.P)if(p.id!==__api.ME){p.pos=[60,-60,60];p.hp=9999}mapGroup.visible=false;scene.background=new THREE.Color(0x445566)},process.argv[3]);await sleep(800);
await pg.screenshot({path:process.argv[4]});await br.close()})()
