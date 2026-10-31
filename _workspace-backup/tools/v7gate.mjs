// v7 RELEASE GATE: seeded v6 DB (PGlite) -> v7 migration x2 -> whole file x2. Additive, idempotent, data preserved, dev_names, RLS, online count.
import {PGlite} from '@electric-sql/pglite';import {pgcrypto} from '@electric-sql/pglite/contrib/pgcrypto';import fs from 'fs';
const all=fs.readFileSync('/workspace/arena-fps/supabase-setup.sql','utf8');const c7=all.indexOf('-- =====================================================================\n-- v7 MIGRATION');
const v6=fs.readFileSync('/tmp/pgl/v6.sql','utf8'),v7=all.slice(c7);const db=new PGlite({extensions:{pgcrypto}});let pass=0,fail=0;
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);c?pass++:(fail++,process.exitCode=1)};const q=async(s,a)=>(await db.query(s,a)).rows;
const err=async(s,a)=>{try{await db.query(s,a);return ''}catch(e){return e.message}};
await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key, raw_user_meta_data jsonb default '{}');
create or replace function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid',true),'')::uuid $$;create publication supabase_realtime;`);
await db.exec(v6);
// ---- seed v6 data: 5 accounts (incl. the 3 future DEVs with mixed case), money, keys, owned skins, equips, stats, match history
const U=[1,2,3,4,5].map(i=>String(i).repeat(8)+'-'+String(i).repeat(4)+'-'+String(i).repeat(4)+'-'+String(i).repeat(4)+'-'+String(i).repeat(12));
const N=['TwentyFivCent','weebier','PurpleJay83','casualjoe','Sniper_Sue'];
const skins=(await q(`select id,gun from skins order by id`));ok(skins.length>5,'v6 skin catalogue seeded: '+skins.length);
for(let i=0;i<5;i++){await q(`insert into auth.users(id,raw_user_meta_data) values($1,$2)`,[U[i],{username:N[i]}]);
 await q(`update profiles set money=$2,xp=$3,level=$4,kills=$5,wins=$6,settings=$7 where id=$1`,[U[i],1234+i*777,5000+i*311,7+i,120+i*9,30+i,{sens:1.5+i,fov:90+i}]);
 for(let k=0;k<3;k++){const s=skins[(i*3+k)%skins.length];await q(`insert into inventory(user_id,item_type,item_id,qty) values($1,'skin',$2,1) on conflict do nothing`,[U[i],s.id]);
  if(k===0)await q(`insert into equipped(user_id,gun,skin_id) values($1,$2,$3) on conflict do nothing`,[U[i],s.gun,s.id])}
 await q(`insert into inventory(user_id,item_type,item_id,qty) values($1,'key','ember',$2) on conflict do nothing`,[U[i],i+1]);
 for(let m=0;m<4;m++)await q(`insert into match_history(user_id,map,result,kills) values($1,$2,$3,$4)`,[U[i],['Dockyard 9','Sunspire Roof','Greywater Keep','Tlaloc Steps'][m],m%2?'loss':'win',5+m+i]);
 await q(`insert into gun_stats(user_id,gun,kills,shots_fired,shots_hit) values($1,'wasp',$2,900,300),($1,'kestrel',$3,500,120) on conflict do nothing`,[U[i],40+i,10+i])}
const TABLES=['profiles','inventory','equipped','match_history','gun_stats','crates','skins'];
const snap=async()=>{const o={};for(const t of TABLES)o[t]=(await q(`select * from ${t}`)).map(r=>{const c={...r};delete c.dev;delete c.crates_opened;delete c.missions_reported_at;return JSON.stringify(c,Object.keys(c).sort())}).sort();return o};
const schema=async()=>(await q(`select table_name,column_name,data_type,coalesce(column_default,'') d from information_schema.columns where table_schema='public' order by 1,2`)).map(r=>r.table_name+'.'+r.column_name+':'+r.data_type);
const counts=async()=>{const o={};for(const t of TABLES)o[t]=(await q(`select count(*)::int c from ${t}`))[0].c;return o};
const before=await snap(),sch0=await schema(),cnt0=await counts();console.log('seeded counts',JSON.stringify(cnt0));
const money0=await q(`select username,money,xp,kills,wins from profiles order by username`);
// ---- migrate: v7 section twice, then the whole file twice
await db.exec(v7);const afterOnce=await snap(),sch1=await schema();await db.exec(v7);const afterTwice=await snap(),sch2=await schema();
await db.exec(all);await db.exec(all);const afterAll=await snap(),sch3=await schema();
ok(sch0.every(c=>sch1.includes(c)),'additive: every v6 column still exists with the same type ('+sch0.length+' cols; v7 total '+sch1.length+')');
ok(JSON.stringify(sch1)===JSON.stringify(sch2)&&JSON.stringify(sch2)===JSON.stringify(sch3),'idempotent schema: 2nd v7 run and 2x whole file change nothing');
for(const t of ['profiles','inventory','equipped','match_history','gun_stats'])ok(JSON.stringify(afterTwice[t])===JSON.stringify(before[t])&&JSON.stringify(afterAll[t])===JSON.stringify(before[t]),`${t}: all ${before[t].length} v6 rows byte-identical after v7 x2 + full file x2`);
const v6sk=new Set(before.skins);ok(before.skins.every(r=>afterAll.skins.includes(r)),'skins: all v6 catalogue rows preserved (v7 only adds: '+(afterAll.skins.length-before.skins.length)+' new)');
ok(before.crates.every(r=>afterAll.crates.includes(r)),'crates: all v6 crates preserved');
ok(JSON.stringify(await q(`select username,money,xp,kills,wins from profiles order by username`))===JSON.stringify(money0),'money/xp/kills/wins identical: '+money0.map(r=>r.username+'=$'+r.money).join(', '));
// ---- dev list
const dn=(await q(`select name from dev_names order by name`)).map(r=>r.name);ok(JSON.stringify(dn)===JSON.stringify(['purplejay83','twentyfivcent','weebier']),'dev_names = '+dn.join(', '));
const dv=await q(`select username,dev from profiles order by username`);ok(dv.filter(r=>r.dev).map(r=>r.username).sort().join()==='PurpleJay83,TwentyFivCent,weebier','dev=true exactly for the 3 DEV accounts (case-insensitive), others false');
await q(`insert into auth.users(id,raw_user_meta_data) values('66666666-6666-6666-6666-666666666666','{"username":"newbie"}')`);ok((await q(`select dev from profiles where username='newbie'`))[0].dev===false,'new non-dev account: dev=false');
// ---- RLS
const rls=await q(`select c.relname,c.relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' order by 1`);
ok(rls.every(r=>r.relrowsecurity),'RLS enabled on every public table: '+rls.map(r=>r.relname).join(','));
await db.exec(`set test.uid='${U[3]}'`);await db.exec('set role authenticated');
ok((await q(`select id from profiles`)).length<=1&&(await q(`select * from inventory`)).every(r=>r.user_id===U[3]),'authenticated sees only own profile/inventory rows');
ok((await q(`select * from match_history`)).every(r=>r.user_id===U[3])&&(await q(`select * from gun_stats`)).every(r=>r.user_id===U[3]),'own match history / gun stats only');
ok(/permission|denied|policy/i.test(await err(`update profiles set money=999999 where id=$1`,[U[3]]))||(await q(`select money from profiles where id=$1`,[U[3]]))[0].money!==999999,'cannot edit own money');
ok(/permission|denied/i.test(await err(`update profiles set dev=true where id=$1`,[U[3]])),'cannot set own dev flag');
ok(/permission|denied|policy/i.test(await err(`insert into inventory(user_id,item_type,item_id,qty) values($1,'skin','x',1)`,[U[3]])),'cannot grant self items directly');
ok(/permission|denied/i.test(await err(`insert into dev_names values('casualjoe')`)),'cannot write dev_names');
await db.exec('reset role');await db.exec(`set test.uid=''`);await db.exec('set role anon');
{const rd=async t=>{try{return (await q(`select * from ${t}`)).length}catch(e){return /permission/.test(e.message)?0:-1}};ok((await rd('profiles'))===0&&(await rd('inventory'))===0&&(await rd('match_history'))===0&&(await rd('gun_stats'))===0,'anon reads no private rows (denied or empty)')}
ok(/permission|denied/i.test(await err(`update profiles set money=0`)),'anon cannot update profiles');
// ---- online count (batch 5)
ok(/permission|denied/i.test(await err(`select * from online_presence`)),'anon cannot read online_presence directly');
ok(/permission|denied/i.test(await err(`insert into online_presence values(gen_random_uuid(),now())`)),'anon cannot write online_presence directly');
const C=['aaaaaaaa-0000-4000-8000-000000000001','aaaaaaaa-0000-4000-8000-000000000002','aaaaaaaa-0000-4000-8000-000000000003'];
for(const c of C)await q(`select heartbeat($1)`,[c]);await q(`select heartbeat($1)`,[C[0]]);
ok((await q(`select online_count() n`))[0].n===3,'guests: 3 distinct heartbeats -> online_count()=3 (repeat heartbeat counted once)');
await db.exec('reset role');await q(`update online_presence set last_seen=now()-interval '5 seconds' where client_id=$1`,[C[0]]);const t1=(await q(`select last_seen from online_presence where client_id=$1`,[C[0]]))[0].last_seen;
await db.exec('set role anon');await q(`select heartbeat($1)`,[C[0]]);await db.exec('reset role');ok(+(await q(`select last_seen from online_presence where client_id=$1`,[C[0]]))[0].last_seen===+t1,'rate limit: heartbeat within 20s does not write');
await q(`update online_presence set last_seen=now()-interval '2 minutes' where client_id=$1`,[C[1]]);await q(`update online_presence set last_seen=now()-interval '1 hour' where client_id=$1`,[C[2]]);
await db.exec('set role anon');ok((await q(`select online_count() n`))[0].n===1,'only clients seen within 90s counted');await db.exec('reset role');
ok((await q(`select count(*)::int c from online_presence`))[0].c===2,'online_count() prunes rows older than 10 min');
await db.exec(`set test.uid='${U[0]}'`);await db.exec('set role authenticated');await q(`select heartbeat($1)`,['bbbbbbbb-0000-4000-8000-000000000001']);ok((await q(`select online_count() n`))[0].n===2,'signed-in clients counted too');await db.exec('reset role');
await db.exec(all);
ok((await q(`select count(*)::int c from online_presence`))[0].c>=1,'re-running setup keeps presence rows (no drop)');
console.log(`\nRELEASE GATE: ${pass} passed, ${fail} failed`);
