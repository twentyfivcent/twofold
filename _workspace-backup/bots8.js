require('./testguard');const puppeteer=require('puppeteer-core');
(async()=>{const L=()=>puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--window-size=960,540']});
const out=[];
for(let m=+(process.argv[2]||0);m<8;m++){let tries=0;for(;;){const b=await L();try{const pg=await b.newPage();await pg.setViewport({width:960,height:540});const errs=[];
 pg.on('console',x=>{if(x.type()==='error'&&!/404/.test(x.text()))errs.push(x.text())});pg.on('pageerror',e=>errs.push('PAGE '+e.message));
 await pg.goto(`http://localhost:8765/index.html?q=low&speed=4&autoplay&practice&map=${m}`);
 console.error('loaded',m);
 await new Promise(r=>setTimeout(r,50000));console.error('waited',m);
 const st=await pg.evaluate(()=>{const G=window.__G;return {map:G.mapDef.n,rn:G.rn,sc:G.sc,rs:G.rs,stuck:window.__botStuckMax,nstuck:window.__botStuck.length,bad:(window.__spawnAsserts||[]).filter(a=>!a.ok).length,asserts:(window.__spawnAsserts||[]).length,kills:G.P.map(p=>p.k)}});
 st.errs=errs.slice(0,5);out.push(st);console.log(JSON.stringify(st));await b.close();break}catch(e){console.log('retry',m,e.message.slice(0,60));try{await b.close()}catch(_){}if(++tries>2)break}}}
})();
