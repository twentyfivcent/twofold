import {PGlite} from '@electric-sql/pglite';import {pgcrypto} from '@electric-sql/pglite/contrib/pgcrypto';import fs from 'fs';
const all=fs.readFileSync('/workspace/arena-fps/supabase-setup.sql','utf8');const c7=all.indexOf('-- =====================================================================\n-- v7 MIGRATION'),c3=all.indexOf('-- =====================================================================\n-- v7 BATCH 3');
const v6=fs.readFileSync('/tmp/pgl/v6.sql','utf8'),v7=all.slice(c7,c3),b3=all.slice(c3);const db=new PGlite({extensions:{pgcrypto}});const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
await db.exec(`create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key, raw_user_meta_data jsonb default '{}');
create or replace function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid',true),'')::uuid $$;create publication supabase_realtime;`);
await db.exec(v6);const U=['11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','33333333-3333-3333-3333-333333333333'];const N=['TwentyFivCent','weebier','casualjoe'];
for(let i=0;i<3;i++){await db.query(`insert into auth.users(id,raw_user_meta_data) values($1,$2)`,[U[i],{username:N[i]}]);await db.query(`update profiles set money=5000 where id=$1`,[U[i]]);await db.query(`insert into inventory(user_id,item_type,item_id,qty) values($1,'skin','em_ash',1)`,[U[i]])}
await db.exec(v7);const cnt=async t=>(await db.query(`select count(*)::int c from ${t}`)).rows[0].c;const inv0=await cnt('inventory');
await db.exec(b3);await db.exec(b3);ok(await cnt('inventory')===inv0,'b3 migration twice: inventory untouched');await db.exec(all);ok(await cnt('inventory')===inv0,'whole file re-run ok');
ok((await db.query(`select count(*)::int c from skins where gun='_char'`)).rows[0].c===7&&(await db.query(`select count(*)::int c from skins where gun='_emote'`)).rows[0].c===7,'7 characters + 7 emotes seeded');
for(const c of ['ember','tide','circuit'])ok((await db.query(`select count(*)::int c from skins where crate_id=$1`,[c])).rows[0].c===12,c+' crate has 12 skins (7+5)');
const P=k=>'pk'+k.repeat(24).slice(0,24);
await db.exec(`set test.uid='${U[2]}'`);await db.exec('set role authenticated');
await db.query(`select buy_key('cast')`);const r=(await db.query(`select * from open_crate('cast')`)).rows[0];ok(r.gun==='_char','open_crate(cast) server-rolled a character: '+r.id);
await db.query(`select equip_skin('_char',$1)`,[r.id]);ok((await db.query(`select skin_id from equipped where gun='_char'`)).rows[0].skin_id===r.id,'equip_skin(_char) works for owned character');
let e='';try{await db.query(`select equip_skin('_char','ch_wisp')`)}catch(x){e=x.message}ok(r.id==='ch_wisp'||/do not own/.test(e),'cannot equip unowned character');
await db.query(`select buy_key('motion')`);const em=(await db.query(`select * from open_crate('motion')`)).rows[0];ok(em.gun==='_emote','open_crate(motion) -> emote '+em.id);
// viewer nonce V (e.g. a guest's). joe (U2) and weebier (U1) prove themselves to V; nobody can insert a row for another uid.
const V=P('a');await db.query(`select claim_presence($1)`,[V]);
await db.exec(`set test.uid='${U[1]}'`);await db.query(`select claim_presence($1)`,[V]);await db.query(`select claim_presence($1)`,[V]);
await db.exec('reset role');await db.exec(`set test.uid=''`);await db.exec('set role anon');
e='';try{await db.query(`select claim_presence($1)`,[V])}catch(x){e=x.message}ok(/permission|not signed/.test(e),'guest (anon) cannot claim: '+e);
const v=(await db.query(`select * from verify_presence($1)`,[[V]])).rows;console.log(v);
ok(v.length===2&&v.find(x=>x.username==='weebier').dev===true&&v.find(x=>x.username==='casualjoe').dev===false,'verify_presence(viewer nonce): weebier dev=true, joe false (duplicate claim = one row)');
ok((await db.query(`select * from verify_presence($1)`,[[P('z')]])).rows.length===0,'fresh nonce: nobody proven');
e='';try{await db.query('select * from presence')}catch(x){e=x.message}ok(/permission/.test(e),'presence table not readable directly');
await db.exec('reset role');
await db.query(`insert into auth.users(id,raw_user_meta_data) values($1,$2)`,['44444444-4444-4444-4444-444444444444',{username:'PurpleJay83'}]);
await db.query(`insert into auth.users(id,raw_user_meta_data) values($1,$2)`,['55555555-5555-5555-5555-555555555555',{username:'tmpname'}]);
let pj=(await db.query(`select dev from profiles where id='44444444-4444-4444-4444-444444444444'`)).rows[0];ok(pj&&pj.dev===true,'PurpleJay83 created AFTER migration gets dev=true');
await db.query(`update profiles set username='purplejay83x' where id='55555555-5555-5555-5555-555555555555'`);ok((await db.query(`select dev from profiles where id='55555555-5555-5555-5555-555555555555'`)).rows[0].dev===false,'non-dev rename stays false');
await db.exec(`set test.uid='${U[2]}'`);await db.exec('set role authenticated');
let blk=0;try{await db.query(`insert into dev_names values('casualjoe')`)}catch(e){blk++}try{await db.query(`select * from dev_names`)}catch(e){blk++}try{await db.query(`update profiles set dev=true where id=$1`,[U[2]])}catch(e){blk++}
ok(blk===3,'players cannot read/write dev_names or set dev');await db.exec('reset role');

const pp=(await db.query('select * from public_profiles limit 1')).rows[0];ok(Object.keys(pp).sort().join()==='dev,id,username','public_profiles exposes only id, username, dev');
