s=open('index.html').read()
def rep(a,b):
    global s
    assert a in s,a[:70]; s=s.replace(a,b,1)
rep(""" <div class="msg" id="menuMsg"></div>""",""" <button class="sm" id="bRelay">Relay server (for friends far away)...</button>
 <div id="relayBox" class="hide" style="background:#111a26;border:1px solid #345;border-radius:8px;padding:10px 14px;max-width:560px;font-size:14px">
  <div style="color:#9ab;margin-bottom:6px">If a friend can't connect (strict NAT/firewall), set up a free TURN relay. Host AND the struggling friend should both paste the same settings.</div>
  <div class="row"><span>Mode</span><select id="rMode"><option value="off">Off (direct only)</option><option value="metered">Metered.ca free (app name + API key)</option><option value="manual">Manual TURN server</option></select></div>
  <div id="rMet"><div class="row"><span>App name</span><input id="rApp" placeholder="yourapp (from yourapp.metered.live)" style="width:280px"></div><div class="row"><span>API key</span><input id="rKey" style="width:280px"></div></div>
  <div id="rMan"><div class="row"><span>TURN URL(s)</span><input id="rUrl" placeholder="turns:host:443?transport=tcp, turn:host:3478" style="width:300px"></div><div class="row"><span>Username</span><input id="rUser" style="width:200px"></div><div class="row"><span>Credential</span><input id="rCred" style="width:200px"></div></div>
  <div class="row"><button class="sm" id="rSave">Save</button><button class="sm" id="rTest">Test relay</button><span id="rStat" style="color:#fb6"></span></div>
 </div>
 <div class="msg" id="menuMsg"></div>""")
rep("function saveSettings(){","""let relayCache=null;
async function getIce(){const r=settings.relay||{};const ice={iceServers:ICE.iceServers.slice()};
 if(r.mode==='metered'&&r.app&&r.key){if(!relayCache||Date.now()-relayCache.t>3e5){const app=String(r.app).trim().replace(/^https?:\\/\\//,'').replace(/\\.metered\\.live.*$/,'');
   const res=await fetch('https://'+encodeURIComponent(app)+'.metered.live/api/v1/turn/credentials?apiKey='+encodeURIComponent(r.key.trim()));if(!res.ok)throw new Error('Metered returned HTTP '+res.status+' (check app name / API key)');
   const arr=await res.json();if(!Array.isArray(arr))throw new Error('Unexpected reply from Metered');relayCache={t:Date.now(),s:arr}}
  ice.iceServers.push(...relayCache.s.filter(x=>String(x.urls).indexOf('turn')>=0))}
 else if(r.mode==='manual'&&r.url){const urls=String(r.url).split(/[\\s,]+/).filter(Boolean);ice.iceServers.push({urls,username:r.user||'',credential:r.cred||''})}
 return ice}
function relayOn(){const r=settings.relay||{};return !!((r.mode==='metered'&&r.app&&r.key)||(r.mode==='manual'&&r.url))}
async function linkType(pc){try{if(!pc)return '?';const st=await pc.getStats();let pair=null;const m={};st.forEach(x=>{m[x.id]=x;if(x.type==='transport'&&x.selectedCandidatePairId)pair=x.selectedCandidatePairId});
 if(pair)pair=m[pair];if(!pair)st.forEach(x=>{if(x.type==='candidate-pair'&&x.state==='succeeded'&&(x.nominated||x.selected)&&!pair)pair=x});
 if(!pair)return '?';const l=m[pair.localCandidateId],rm=m[pair.remoteCandidateId];return (l&&l.candidateType==='relay')||(rm&&rm.candidateType==='relay')?'Relay':'Direct'}catch(e){return '?'}}
function saveSettings(){""")
rep("function mkPeer(id){if(FAKENET)return new FakePeer(id);return id?new Peer(id,{config:ICE,debug:0}):new Peer({config:ICE,debug:0})}",
"function mkPeer(id,ice){if(FAKENET)return new FakePeer(id);ice=ice||ICE;return id?new Peer(id,{config:ice,debug:0}):new Peer({config:ice,debug:0})}")
rep("""function hostOnline(){
 cleanupNet();""","""async function hostOnline(){
 let ice=ICE,iceErr='';try{ice=await getIce()}catch(e){iceErr=' (Relay setup failed: '+e.message+' - direct only)'}
 cleanupNet();""")
rep("peer=mkPeer(PFX+code);\n peer.on('open',()=>{lobbyMsg('Share the code with friends, then press Start.')});",
"peer=mkPeer(PFX+code,ice);\n peer.on('open',()=>{lobbyMsg('Share the code with friends, then press Start.'+(relayOn()&&!iceErr?' Relay fallback: ON.':'')+iceErr)});")
rep("c.on('data',d=>hostMsg(c,d));","c.on('data',d=>hostMsg(c,d));c.on('open',()=>probeLink(c));")
rep("function freeSlot(team){","""function probeLink(c,n=0){if(FAKENET)return;setTimeout(async()=>{const t=await linkType(c.peerConnection);c.link=t;if(t==='?'&&n<5)return probeLink(c,n+1);if(LOBBY&&LOBBY.host&&!started&&c.slot!==undefined&&LOBBY.slots[c.slot]&&LOBBY.slots[c.slot].conn===c){LOBBY.slots[c.slot].link=t;broadcastLobby()}},1000+n*1000)}
function freeSlot(team){""")
rep("LOBBY.slots[s]={name:String(d.name||'Friend').slice(0,12),human:true,conn:c};","LOBBY.slots[s]={name:String(d.name||'Friend').slice(0,12),human:true,conn:c,link:c.link||(FAKENET?'Test':'')};")
rep("slots:LOBBY.slots.map(x=>x?{name:x.name}:null)","slots:LOBBY.slots.map(x=>x?{name:x.name,link:x.link||''}:null)")
rep("""function joinOnline(code){
 code=String(code||'').toUpperCase().trim();if(!/^[A-HJ-NP-Z]{5}$/.test(code)){$('#menuMsg').textContent='Enter the 5-letter room code';return}
 cleanupNet();LOBBY={code,host:false,slots:[null,null,null,null],me:-1};$('#menuMsg').textContent='Connecting...';
 peer=mkPeer();const to=setTimeout(()=>{if(LOBBY&&LOBBY.me<0&&!started){$('#menuMsg').textContent='Could not reach that room. Check the code and try again.';cleanupNet()}},15000);
 peer.on('open',()=>{const hc=peer.connect(PFX+code,{reliable:true,serialization:'json'});hostConn=hc;
  hc.on('open',()=>netSend(hc,{t:'hello',name:settings.name}));""","""async function joinOnline(code){
 code=String(code||'').toUpperCase().trim();if(!/^[A-HJ-NP-Z]{5}$/.test(code)){$('#menuMsg').textContent='Enter the 5-letter room code';return}
 const M=t=>$('#menuMsg').textContent=t;let ice=ICE,iceErr='';M('Connecting...');try{ice=await getIce()}catch(e){iceErr='Relay setup failed: '+e.message+'. '}
 cleanupNet();LOBBY={code,host:false,slots:[null,null,null,null],me:-1};M(iceErr+'Connecting...');let opened=false;const R=relayOn()&&!iceErr;
 const to1=setTimeout(()=>{if(LOBBY&&LOBBY.me<0&&!started&&!opened)M(iceErr+(R?"Couldn't reach host directly, trying relay...":"Couldn't reach host directly. Still trying... (no relay server set up)"))},10000);
 const to=setTimeout(()=>{clearTimeout(to1);if(LOBBY&&LOBBY.me<0&&!started){M(opened?'Connected but the host did not answer. Ask them to re-host.':R?'Could not connect even through the relay. Check that the host and you both saved the same relay settings, and that the code is right.':'Could not connect. A strict NAT/firewall is likely blocking a direct link - set up a free Relay server (button below) on both your and the host\\'s game, then try again.');cleanupNet()}},R?30000:20000);
 peer=mkPeer(null,ice);
 peer.on('open',()=>{const hc=peer.connect(PFX+code,{reliable:true,serialization:'json'});hostConn=hc;
  hc.on('open',()=>{opened=true;clearTimeout(to1);netSend(hc,{t:'hello',name:settings.name})});""")
rep("peer.on('error',e=>{$('#menuMsg').textContent=e.type==='peer-unavailable'?'No room with that code.':'Network error: '+e.type;clearTimeout(to)});",
"peer.on('error',e=>{$('#menuMsg').textContent=e.type==='peer-unavailable'?'No room with that code.':'Network error: '+e.type;clearTimeout(to);clearTimeout(to1)});")
rep("""s?s.name+(i===LOBBY.me?' (you)':''):""","""s?s.name+(i===LOBBY.me?' (you)':'')+(s.link?` <span style="font-size:12px;color:${s.link==='Relay'?'#fb6':'#7d7'}">${s.link}</span>`:''):""")
rep("</script></body></html>","""(function(){const r=settings.relay=settings.relay||{mode:'off'};const ids={rMode:'mode',rApp:'app',rKey:'key',rUrl:'url',rUser:'user',rCred:'cred'};
 for(const k in ids)$('#'+k).value=r[ids[k]]||(k==='rMode'?'off':'');
 const vis=()=>{const m=$('#rMode').value;$('#rMet').style.display=m==='metered'?'':'none';$('#rMan').style.display=m==='manual'?'':'none'};vis();$('#rMode').onchange=vis;
 $('#bRelay').onclick=()=>$('#relayBox').classList.toggle('hide');
 $('#rSave').onclick=()=>{for(const k in ids)r[ids[k]]=$('#'+k).value.trim();relayCache=null;saveSettings();$('#rStat').textContent=relayOn()?'Saved - relay ON':'Saved - relay off'};
 $('#rTest').onclick=async()=>{$('#rSave').onclick();if(!relayOn())return;$('#rStat').textContent='Testing...';try{const ice=await getIce();const pc=new RTCPeerConnection({iceServers:ice.iceServers,iceTransportPolicy:'relay'});pc.createDataChannel('t');let ok=false;
  pc.onicecandidate=e=>{if(e.candidate&&/ typ relay/.test(e.candidate.candidate)&&!ok){ok=true;$('#rStat').textContent='Relay works (got a relay candidate)';pc.close()}};
  await pc.setLocalDescription(await pc.createOffer());setTimeout(()=>{if(!ok){$('#rStat').textContent='No relay candidate - check credentials';pc.close()}},8000)}catch(e){$('#rStat').textContent='Failed: '+e.message}};
})();
</script></body></html>""")
open('index.html','w').write(s)
print('patched')
