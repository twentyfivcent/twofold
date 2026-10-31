const fs=require('fs');const src=['20_maps','21_nav','30_util'].map(f=>fs.readFileSync('src/'+f+'.txt','utf8')).join('\n');
global.window={};global.console=console;
const code='var window={};'+src+'\nconst t0=Date.now();const e=validateMaps();console.log("time",Date.now()-t0);for(const m of MAPS.concat(SDMAPS))console.log(m.n.padEnd(20),"exits",m.exits,"leaks",m.leaks,"elev",m.elevLeaks,"up",m.elevNodes,m.elevMax,"cross",m.cross,"flags",JSON.stringify(m.flags),"cOff",m.flagCentreOff);console.log(e.length?"ERRORS:\\n"+e.join("\\n"):"ALL OK");';
fs.writeFileSync('/tmp/vm.js',code);
