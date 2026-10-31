import {PGlite} from '@electric-sql/pglite';import {pgcrypto} from '@electric-sql/pglite/contrib/pgcrypto';import fs from 'fs';
const all=fs.readFileSync('/workspace/arena-fps/supabase-setup.sql','utf8');const cut=all.indexOf('-- =====================================================================\n-- v7 MIGRATION');
const v6=fs.readFileSync('/tmp/pgl/v6.sql','utf8'),v7=all.slice(cut);const db=new PGlite({extensions:{pgcrypto}});const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key, raw_user_meta_data jsonb default '{}');
create or replace function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid',true),'')::uuid $$;
create publication supabase_realtime;`);
await db.exec(v6);
// seed realistic v6 accounts
const U=['11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333'];const N=['TwentyFivCent','weebier','casualjoe'];
for(let i=0;i<3;i++){await db.query(`insert into auth.users(id,raw_user_meta_data) values($1,$2)`,[U[i],{username:N[i]}]);
 await db.query(`update profiles set money=$2,xp=$3,level=$4,kills=$5,wins=$6,settings=$7 where id=$1`,[U[i],1000+i*777,5000+i,7+i,120+i,30+i,{sens:1.5+i,fov:90}]);
 await db.query(`insert into inventory(user_id,item_type,item_id,qty) values($1,'key','ember',2),($1,'skin','em_ash',1)`,[U[i]]);
 await db.query(`insert into equipped(user_id,gun,skin_id) values($1,'wasp','em_ash')`,[U[i]]);
 await db.query(`insert into match_history(user_id,map,result,kills) values($1,'Dockyard 9','win',12)`,[U[i]]);
 await db.query(`insert into gun_stats(user_id,gun,kills,shots_fired,shots_hit) values($1,'wasp',40,900,300)`,[U[i]]);}
const snap=async()=>{const o={};for(const t of ['profiles','inventory','equipped','match_history','gun_stats'])o[t]=(await db.query(`select * from ${t} order by 1,2`)).rows.map(r=>{const c={...r};delete c.dev;return JSON.stringify(c)});return o};
const before=await snap();
await db.exec(v7);await db.exec(v7);   // migration twice
ok(JSON.stringify(await snap())===JSON.stringify(before),'all v6 rows/values unchanged after running v7 migration twice');
await db.exec(all);ok(JSON.stringify(await snap())===JSON.stringify(before),'whole setup file re-run: rows unchanged');
const dev=(await db.query(`select username,dev from profiles order by username`)).rows;console.log(dev);
ok(dev.find(r=>r.username==='TwentyFivCent').dev&&dev.find(r=>r.username==='weebier').dev&&!dev.find(r=>r.username==='casualjoe').dev,'dev=true only for twentyfivcent/weebier (case-insensitive)');
// player cannot set dev
await db.exec(`set test.uid='${U[2]}'`);await db.exec('set role authenticated');
let e1='';try{await db.query(`update profiles set dev=true where id=$1`,[U[2]])}catch(e){e1=e.message}ok(/permission/.test(e1),'authenticated cannot update dev: '+e1);
let e2='';try{await db.query(`select set_username('weebier')`)}catch(e){e2=e.message}ok(/taken/.test(e2),'cannot rename to a DEV name: '+e2);
await db.query(`select set_username('joe_renamed')`);await db.query(`select save_settings('{"a":1}')`);await db.query(`select buy_key('ember')`);await db.query(`select open_crate('ember')`);
await db.query(`select equip_skin('wasp','em_ash')`);
const lb=(await db.query(`select * from leaderboard`)).rows;ok(lb.length===3&&'dev' in lb[0],'leaderboard view has dev column');
const dn=(await db.query(`select * from dev_usernames()`)).rows.map(r=>r.dev_usernames);ok(dn.length===2,'dev_usernames(): '+dn);
await db.exec('reset role');const j=(await db.query(`select dev,money from profiles where id=$1`,[U[2]])).rows[0];ok(j.dev===false,'joe still not dev after own RPCs');
// money dashboard-editable (postgres role)
await db.query(`update profiles set money=money+5000 where lower(username)='weebier'`);ok((await db.query(`select money from profiles where username='weebier'`)).rows[0].money===1777+5000,'dashboard money edit works');
// matchmaking
await db.exec('set role anon');const T=i=>'ticket-'+String(i).padStart(12,'0');
for(let i=0;i<3;i++)await db.query(`select mm_join($1,$2)`,[T(i),'P'+i]);
let r=(await db.query(`select * from mm_poll($1)`,[T(0)])).rows[0];ok(r.status==='waiting','3 waiting, <20s: no match yet');
ok((await db.query(`select mm_count() c`)).rows[0].c===3,'mm_count=3');
await db.query(`select mm_cancel($1)`,[T(2)]);ok((await db.query(`select mm_count() c`)).rows[0].c===2,'cancel removes ticket');
await db.query(`select mm_join($1,'P3')`,[T(3)]);await db.query(`select mm_join($1,'P4')`,[T(4)]);await db.query(`select mm_join($1,'P5')`,[T(5)]);
r=(await db.query(`select * from mm_poll($1)`,[T(3)])).rows[0];ok(r.status==='matched','4 waiting -> instant match');
await db.exec('reset role');const m=(await db.query(`select ticket,is_host,room_code,team_slot from mm_queue where status='matched' order by team_slot`)).rows;console.log(m);
ok(m.length===4&&m[0].ticket===T(0)&&m[0].is_host&&m.filter(x=>x.is_host).length===1&&new Set(m.map(x=>x.room_code)).size===1&&/^[A-HJ-NP-Z]{5}$/.test(m[0].room_code),'host = longest waiter, one shared room code');
// bot fill after 20s with lone waiter, leaver purge
await db.query(`update mm_queue set created_at=now()-interval '21 seconds' where ticket=$1`,[T(5)]);
await db.query(`select mm_join($1,'Ghost')`,[T(9)]);await db.query(`update mm_queue set heartbeat=now()-interval '30 seconds' where ticket=$1`,[T(9)]);
await db.exec('set role anon');r=(await db.query(`select * from mm_poll($1)`,[T(5)])).rows[0];ok(r.status==='matched'&&r.is_host,'lone waiter matched after 20s as host (bot fill)');
await db.exec('reset role');ok((await db.query(`select count(*)::int c from mm_queue where ticket=$1`,[T(9)])).rows[0].c===0,'stale leaver purged from queue');
await db.exec('set role anon');let e3='';try{await db.query('select * from mm_queue')}catch(e){e3=e.message}ok(/permission/.test(e3),'anon cannot read queue table directly');
