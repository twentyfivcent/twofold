// Test guard: every puppeteer page gets mock-supabase.js instead of the real supabase-js, and any request to *.supabase.co is aborted,
// so no test can ever touch the LIVE database (heartbeats, accounts, queue). Loaded by every test script (require('./testguard')).
const fs=require('fs'),path=require('path');const MOCK=fs.readFileSync(path.join(__dirname,'mock-supabase.js'),'utf8');
let P;try{P=require(path.join(__dirname,'node_modules','puppeteer-core'))}catch(e){}
if(P&&!P.__guarded){P.__guarded=1;const _l=P.launch.bind(P);P.launch=async function(){const br=await _l(...arguments);const _np=br.newPage.bind(br);
 const guard=async p=>{await p.setRequestInterception(true);p.on('request',r=>{const u=r.url();if(r.isInterceptResolutionHandled&&r.isInterceptResolutionHandled())return;
   if(/supabase-js/.test(u))return r.respond({status:200,contentType:'application/javascript',body:MOCK});if(/supabase\.co/i.test(u))return r.abort();r.continue()});
  p.setRequestInterception=async()=>{};const _on=p.on.bind(p);p.on=function(ev,fn){if(ev==='request')return p;return _on(ev,fn)};return p};
 br.newPage=async function(){return guard(await _np(...arguments))};
 const _ctx=br.createIncognitoBrowserContext&&br.createIncognitoBrowserContext.bind(br);if(_ctx)br.createIncognitoBrowserContext=async function(){const c=await _ctx(...arguments);const np=c.newPage.bind(c);c.newPage=async()=>guard(await np());return c};
 const _bc=br.createBrowserContext&&br.createBrowserContext.bind(br);if(_bc)br.createBrowserContext=async function(){const c=await _bc(...arguments);const np=c.newPage.bind(c);c.newPage=async()=>guard(await np());return c};
 return br}}
module.exports={};
