import re
f='src/g0_net.txt';s=open(f).read()
def R(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(a[:60],s.count(a))
    s=s.replace(a,b)
# token for rejoin
R("function lobbyMsg(t)","const NETTOK=(()=>{try{let t=sessionStorage.getItem('tf_tok');if(!t){t=Math.random().toString(36).slice(2,12);sessionStorage.setItem('tf_tok',t)}return t}catch(e){return Math.random().toString(36).slice(2,12)}})();\nlet LOBBYSEQ=0,REJ=null,LAST_ICE=null;\nfunction lobbyMsg(t)")
R("cleanupNet();const code=genCode();LOBBY={code,host:true,slots:[{name:myName(),human:true,conn:null},null,null,null],me:0,map:+$('#mapSel').value,ff:false};",
  "cleanupNet();const code=genCode();LOBBY={code,host:true,slots:[{name:myName(),human:true,conn:null,tok:NETTOK},null,null,null],me:0,map:+$('#mapSel').value,ff:false,seq:++LOBBYSEQ};freshLobbyChat();")
R("peer.on('connection',c=>{","peer.on('disconnected',()=>{try{if(peer&&!peer.destroyed)peer.reconnect()}catch(e){}});\n peer.on('connection',c=>{c.lastHeard=performance.now();")
R("if(!d||typeof d!=='object')return;c.lastHeard=performance.now();","if(!d||typeof d!=='object')return;c.lastHeard=performance.now();\n if(d.t==='hb'){netSend(c,{t:'hb',r:1});return}")
R("LOBBY.slots[s]={name:String(d.name||'Friend').slice(0,16),human:true,conn:c,link:c.link||(FAKENET?'Test':'')};",
  "LOBBY.slots[s]={name:String(d.name||'Friend').slice(0,16),human:true,conn:c,link:c.link||(FAKENET?'Test':''),tok:typeof d.tok==='string'?d.tok.slice(0,16):''};")
# late join: rejoin same slot by token
R(" const cnt=t=>G.P.filter(p=>p.team===t&&p.bot&&!p.pendConn).length;",
  " if(typeof d.tok==='string'&&d.tok){const q=G.P.find(p=>p.tok===d.tok&&!p.off);if(q){const old=q.conn;if(old&&old!==c){old.dropped=true;try{old.close()}catch(e){}}\n  q.bot=false;q.off=false;q.conn=c;q.pendConn=null;q.bot_=null;q.name=q.name.replace(/ \\(bot\\)$/,'');c.slot=q.id;c.lastHeard=performance.now();\n  netSend(c,{t:'start',map:G.mapIdx,slots:G.P.map(p=>({name:p.name,bot:p.bot,off:p.off})),you:q.id,late:1,rejoin:1,ff:G.ff,tod:G.tod});emit({t:'joined',n:q.name+' (reconnected)'});return}}\n const cnt=t=>G.P.filter(p=>p.team===t&&p.bot&&!p.pendConn).length;")
R("const name=String(d.name||'Friend').slice(0,16);p.pendConn=c;p.pendName=name;c.slot=p.id;","const name=String(d.name||'Friend').slice(0,16);p.pendConn=c;p.pendName=name;p.pendTok=typeof d.tok==='string'?d.tok.slice(0,16):'';c.slot=p.id;")
R("p.name=p.pendName;p.bot_=null}","p.name=p.pendName;p.tok=p.pendTok||'';p.bot_=null}")
# client join
R("cleanupNet();LOBBY={code,host:false,slots:[null,null,null,null],me:-1};","cleanupNet();LOBBY={code,host:false,slots:[null,null,null,null],me:-1,seq:++LOBBYSEQ};freshLobbyChat();LAST_ICE=ice;")
R("hc.on('open',()=>{opened=true;clearTimeout(to1);netSend(hc,{t:'hello',name:myName()})});\n  hc.on('data',d=>clientMsg(d,to));\n  hc.on('close',()=>{if(hostConn===hc){hostConn=null;quitToMenu('The host left the match.')}})});",
  "hc.on('open',()=>{opened=true;clearTimeout(to1);lastHeard=performance.now();netSend(hc,{t:'hello',name:myName(),tok:NETTOK})});\n  hc.on('data',d=>{lastHeard=performance.now();clientMsg(d,to)});\n  hc.on('close',()=>{if(hostConn===hc){hostConn=null;if(started&&G)clientReconnect('closed');else quitToMenu('The host left the match.')}})});\n peer.on('disconnected',()=>{try{if(peer&&!peer.destroyed)peer.reconnect()}catch(e){}});")
R("else if(d.t==='start'){startGame({map:d.map,slots:d.slots,me:d.you,host:false,ff:d.ff,tod:d.tod})}",
  "else if(d.t==='hb'){}\n else if(d.t==='start'){if(d.rejoin&&G&&G.mapIdx===d.map){REJ=null;ME=d.you|0;lastHeard=performance.now();netNote('Reconnected.');return}REJ=null;startGame({map:d.map,slots:d.slots,me:d.you,host:false,ff:d.ff,tod:d.tod})}")
# start: refresh liveness for everyone so idle lobby time never counts
R(" const tod=rollTod(map);LOBBY.slots.forEach((s,i)=>{if(s&&s.conn)netSend(s.conn,{t:'start',map,slots:wire,you:i,ff,tod})});",
  " const tod=rollTod(map);const now=performance.now();LOBBY.slots.forEach((s,i)=>{if(s&&s.conn){s.conn.lastHeard=now;netSend(s.conn,{t:'start',map,slots:wire,you:i,ff,tod})}});")
R("startGame({map,slots,me:LOBBY.me,host:true,ff,tod});\n}","startGame({map,slots,me:LOBBY.me,host:true,ff,tod});\n if(G)LOBBY.slots.forEach((s,i)=>{if(s&&!s.off&&G.P[i])G.P[i].tok=s.tok||''});\n}")
# lobby: fresh chat + switch-team visibility
R("function showLobby(){","function freshLobbyChat(){const lc=$('#lchat');if(lc)lc.innerHTML='';CHATLOG.length=0;window.__lobbySeq=LOBBYSEQ}\nfunction showLobby(){")
R("$('#bStart').disabled=H&&(tc(0)<1||tc(1)<1);",
  "{const me=LOBBY.me,ot=me<2?1:0,free=me>=0&&(ot?[2,3]:[0,1]).some(i=>!LOBBY.slots[i]||LOBBY.slots[i].off),b=$('#bSwitch');if(b){b.style.display=free?'':'none';b.textContent='Switch to '+(ot?'ORANGE':'BLUE')}}\n $('#bStart').disabled=H&&(tc(0)<1||tc(1)<1);")
R("function cleanupNet(){","function cleanupNet(){if(NETHB.rt){clearTimeout(NETHB.rt);NETHB.rt=0}")
# heartbeat + reconnect helpers
s+=r"""
// ---- v7 netcode: timer-driven heartbeats (work in background tabs, during map load and in the lobby) + client auto-rejoin
const NETHB={rt:0,timeout:15000};
function netNote(m){try{if(typeof bannerShow==='function')bannerShow(m);else lobbyMsg(m)}catch(e){}window.__netNote=m}
setInterval(()=>{const now=performance.now();
 if(LOBBY&&LOBBY.host){const cs=new Set();LOBBY.slots.forEach(s=>{if(s&&s.conn)cs.add(s.conn)});if(G)for(const p of G.P){if(p.conn)cs.add(p.conn);if(p.pendConn)cs.add(p.pendConn)}for(const c of cs)netSend(c,{t:'hb'})}
 else if(hostConn)netSend(hostConn,{t:'hb'});
 if(LOBBY&&!LOBBY.host&&!started&&hostConn&&lastHeard&&now-lastHeard>NETHB.timeout)quitToMenu('Lost connection to the host.');
},1000);
function clientReconnect(why){if(!LOBBY||LOBBY.host||!G)return;if(REJ&&REJ.busy)return;
 REJ=REJ||{n:0,code:LOBBY.code,t0:performance.now()};REJ.busy=true;REJ.n++;window.__rejoins=(window.__rejoins||0)+1;
 if(REJ.n>6){REJ=null;quitToMenu('Lost connection to the host (could not reconnect).');return}
 netNote('Connection lost - reconnecting ('+REJ.n+'/6)...');
 const old=hostConn;hostConn=null;try{if(old)old.close()}catch(e){}
 const go=()=>{if(!G||!LOBBY)return;const hc=peer.connect(PFX+REJ.code,{reliable:true,serialization:'json'});hostConn=hc;let ok=false;
  hc.on('open',()=>{ok=true;lastHeard=performance.now();netSend(hc,{t:'hello',name:myName(),tok:NETTOK,rejoin:1})});
  hc.on('data',d=>{lastHeard=performance.now();if(REJ)REJ.busy=false;clientMsg(d,0)});
  hc.on('close',()=>{if(hostConn===hc){hostConn=null;if(REJ)REJ.busy=false;if(G)clientReconnect('closed')}});
  NETHB.rt=setTimeout(()=>{if(REJ&&REJ.busy&&hostConn===hc&&!ok){REJ.busy=false;clientReconnect('timeout')}else if(REJ)REJ.busy=false},6000)};
 lastHeard=performance.now();
 if(!peer||peer.destroyed){peer=mkPeer(null,LAST_ICE||ICE);peer.on('open',go);peer.on('error',()=>{if(REJ){REJ.busy=false}})}
 else if(peer.disconnected){try{peer.reconnect()}catch(e){}setTimeout(go,800)}else setTimeout(go,300);
}
"""
open(f,'w').write(s)
# heartbeat in loop: longer timeout, client reconnects instead of quitting
f='src/f0_loop.txt';t=open(f).read()
a=" if(HOST){for(const p of G.P){if(!p.bot&&p.conn&&p.conn.lastHeard&&now-p.conn.lastHeard>8000)hostDrop(p.conn)}}\n else if(hostConn&&lastHeard&&now-lastHeard>8000){quitToMenu('Lost connection to the host.')}"
b=" if(HOST){for(const p of G.P){if(!p.bot&&p.conn&&p.conn.lastHeard&&now-p.conn.lastHeard>NETHB.timeout)hostDrop(p.conn)}}\n else if(!REJ&&lastHeard&&now-lastHeard>NETHB.timeout){clientReconnect('timeout')}"
assert a in t;t=t.replace(a,b);open(f,'w').write(t)
