-- =====================================================================
-- v8 MIGRATION (drop 2). Additive + idempotent: safe to run twice, and safe to re-run the whole file.
-- Adds: crates_opened count + 10% duplicate refund (paid inside open_crate), daily missions (3/day, reset 4 AM
-- America/Los_Angeles, paid only by claim_mission), Quick Play parties of 2 (mm_party), and leaderboard_v8 view.
-- Players still cannot write money/progress directly: all new tables have RLS on and no write grants.
-- =====================================================================
alter table public.profiles add column if not exists crates_opened int not null default 0;
alter table public.profiles add column if not exists missions_reported_at timestamptz;
alter table public.mm_queue add column if not exists party text;

-- open_crate2: same roll as open_crate, plus +1 crates_opened and a 10% key-price refund when the drop is a duplicate.
create or replace function public.open_crate2(p_crate_id text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare s public.skins; total int; roll int; acc int := 0; rec record; had int; refund int := 0; price int;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  update inventory set qty=qty-1 where user_id=auth.uid() and item_type='key' and item_id=p_crate_id and qty>0;
  if not found then raise exception 'no key for this crate'; end if;
  select sum(weight) into total from skins where crate_id=p_crate_id;
  if total is null then raise exception 'crate empty'; end if;
  roll := floor(random()*total)::int;
  for rec in select * from skins where crate_id=p_crate_id order by weight desc, id loop
    acc := acc + rec.weight;
    if roll < acc then s := rec; exit; end if;
  end loop;
  select coalesce(qty,0) into had from inventory where user_id=auth.uid() and item_type='skin' and item_id=s.id;
  insert into inventory(user_id,item_type,item_id,qty) values (auth.uid(),'skin',s.id,1)
    on conflict (user_id,item_type,item_id) do update set qty=inventory.qty+1;
  if coalesce(had,0) > 0 then
    select key_price into price from crates where id=p_crate_id;
    refund := greatest(1, round(coalesce(price,0)*0.10)::int);
  end if;
  update profiles set crates_opened = crates_opened + 1, money = money + refund where id=auth.uid();
  return to_jsonb(s) || jsonb_build_object('dup', coalesce(had,0) > 0, 'refund', refund);
end $$;
-- keep the old signature for old clients (same refund + count)
create or replace function public.open_crate(p_crate_id text) returns public.skins
language plpgsql security definer set search_path = public as $$
declare j jsonb;
begin
  j := public.open_crate2(p_crate_id);
  return jsonb_populate_record(null::public.skins, j);
end $$;

-- public leaderboard with crates + hover-card stats (new view so the old 5-column one stays untouched)
create or replace view public.leaderboard_v8 as
  select p.username, p.level, p.wins, p.kills, p.dev, p.crates_opened, p.deaths, p.headshots, p.losses, p.matches,
    (select e.skin_id from public.equipped e where e.user_id=p.id and e.gun='_char') as char_id
  from public.profiles p where p.username is not null order by p.wins desc, p.kills desc limit 100;
grant select on public.leaderboard_v8 to anon, authenticated;

-- ---------- daily missions ----------
create table if not exists public.missions (
  id text primary key, tier text not null check (tier in ('easy','medium','hard')), stat text not null,
  goal int not null check (goal > 0), reward int not null check (reward between 25 and 200), title text not null);
create table if not exists public.mission_caps (stat text primary key, cap int not null check (cap > 0));
create table if not exists public.mission_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null, slot int not null check (slot between 0 and 2), mission_id text not null references public.missions(id),
  progress int not null default 0, claimed boolean not null default false, claimed_at timestamptz,
  primary key (user_id, day, slot));
alter table public.missions enable row level security;
alter table public.mission_caps enable row level security;
alter table public.mission_progress enable row level security;
drop policy if exists missions_read on public.missions;
create policy missions_read on public.missions for select using (true);
drop policy if exists mission_progress_select_own on public.mission_progress;
create policy mission_progress_select_own on public.mission_progress for select using (auth.uid() = user_id);
revoke insert, update, delete on public.missions, public.mission_caps, public.mission_progress from anon, authenticated;
revoke all on public.mission_caps from anon, authenticated;
grant select on public.missions to anon, authenticated;
grant select on public.mission_progress to authenticated;
insert into public.missions(id,tier,stat,goal,reward,title) values
 ('e_kills','easy','kills',8,25,'Get 8 eliminations'),
 ('e_hs','easy','headshots',3,30,'Land 3 headshot kills'),
 ('e_play','easy','matches',1,25,'Finish 1 match'),
 ('e_dmg','easy','damage',1000,30,'Deal 1,000 damage'),
 ('e_assist','easy','assists',2,30,'Get 2 assists'),
 ('e_rounds','easy','rounds_won',3,30,'Win 3 rounds'),
 ('e_ping','easy','pings',5,25,'Ping 5 enemies or spots for your team'),
 ('e_mantle','easy','mantles',3,25,'Mantle over 3 ledges'),
 ('e_util','easy','util_used',4,30,'Use 4 lethals or tacticals'),
 ('e_pistol','easy','pistol_kills',2,35,'Get 2 sidearm eliminations'),
 ('e_smg','easy','smg_kills',3,35,'Get 3 SMG eliminations'),
 ('e_rifle','easy','rifle_kills',3,35,'Get 3 rifle eliminations'),
 ('e_shotgun','easy','shotgun_kills',2,35,'Get 2 shotgun eliminations'),
 ('e_close','easy','close_kills',3,40,'Get 3 eliminations within 5 m'),
 ('e_slide','easy','slide_kills',1,45,'Get 1 elimination while sliding'),
 ('e_lethal','easy','util_kills',1,45,'Eliminate an enemy with a lethal'),
 ('e_win','easy','wins',1,50,'Win 1 match'),
 ('e_lmg','easy','lmg_kills',2,35,'Get 2 LMG eliminations'),
 ('m_kills','medium','kills',20,70,'Get 20 eliminations'),
 ('m_hs','medium','headshots',8,80,'Land 8 headshot kills'),
 ('m_play','medium','matches',3,60,'Finish 3 matches'),
 ('m_dmg','medium','damage',4000,75,'Deal 4,000 damage'),
 ('m_assist','medium','assists',6,70,'Get 6 assists'),
 ('m_rounds','medium','rounds_won',8,70,'Win 8 rounds'),
 ('m_wins','medium','wins',2,90,'Win 2 matches'),
 ('m_double','medium','doubles',2,85,'Get 2 double eliminations'),
 ('m_long','medium','long_kills',3,80,'Get 3 eliminations from 30 m+'),
 ('m_sniper','medium','sniper_kills',4,85,'Get 4 sniper or marksman eliminations'),
 ('m_smg','medium','smg_kills',8,75,'Get 8 SMG eliminations'),
 ('m_rifle','medium','rifle_kills',8,75,'Get 8 rifle eliminations'),
 ('m_shotgun','medium','shotgun_kills',6,75,'Get 6 shotgun eliminations'),
 ('m_air','medium','air_kills',2,90,'Get 2 eliminations while airborne'),
 ('m_flawless','medium','flawless',3,85,'Win 3 rounds without dying'),
 ('m_melee','medium','melee_kills',1,90,'Get a melee elimination'),
 ('m_revenge','medium','revenge',2,70,'Take revenge on your killer twice'),
 ('m_first','medium','first_bloods',2,80,'Get the first elimination of a round twice'),
 ('h_kills','hard','kills',40,140,'Get 40 eliminations'),
 ('h_hs','hard','headshots',18,160,'Land 18 headshot kills'),
 ('h_wins','hard','wins',4,180,'Win 4 matches'),
 ('h_mvp','hard','mvp',1,150,'Be match MVP'),
 ('h_mvp2','hard','mvp',2,200,'Be match MVP twice'),
 ('h_dmg','hard','damage',10000,150,'Deal 10,000 damage'),
 ('h_double','hard','doubles',5,170,'Get 5 double eliminations'),
 ('h_long','hard','long_kills',8,160,'Get 8 eliminations from 30 m+'),
 ('h_flawless','hard','flawless',8,170,'Win 8 rounds without dying'),
 ('h_lethal','hard','util_kills',4,170,'Eliminate 4 enemies with lethals'),
 ('h_knife','hard','knife_kills',2,190,'Get 2 Talon Knife eliminations'),
 ('h_melee','hard','melee_kills',3,200,'Get 3 melee eliminations'),
 ('h_slide','hard','slide_kills',5,160,'Get 5 eliminations while sliding'),
 ('h_air','hard','air_kills',5,170,'Get 5 eliminations while airborne'),
 ('h_pistol','hard','pistol_kills',10,150,'Get 10 sidearm eliminations'),
 ('h_first','hard','first_bloods',5,160,'Get 5 first eliminations of a round'),
 ('h_assist','hard','assists',14,130,'Get 14 assists'),
 ('h_play','hard','matches',6,120,'Finish 6 matches'),
 ('h_sniper','hard','sniper_kills',10,180,'Get 10 sniper or marksman eliminations')
on conflict (id) do update set tier=excluded.tier, stat=excluded.stat, goal=excluded.goal, reward=excluded.reward, title=excluded.title;
insert into public.mission_caps(stat,cap) values ('kills',40),('headshots',40),('matches',1),('wins',1),('mvp',1),('damage',12000),('assists',30),('rounds_won',12),('flawless',12),('doubles',15),('long_kills',40),('close_kills',40),('air_kills',40),('slide_kills',40),('util_kills',20),('knife_kills',20),('melee_kills',20),('pistol_kills',40),('smg_kills',40),('rifle_kills',40),('shotgun_kills',40),('sniper_kills',40),('lmg_kills',40),('pings',60),('mantles',60),('util_used',40),('revenge',20),('first_bloods',12)
on conflict (stat) do update set cap=excluded.cap;
-- mission day: rolls over at 4 AM Los Angeles time (DST-safe: computed from local wall clock)
create or replace function public.mission_day() returns date
language sql stable set search_path = public as $$
  select ((now() at time zone 'America/Los_Angeles') - interval '4 hours')::date $$;
-- deterministic 3 missions (easy/medium/hard) per user per day; creates today's rows if missing
create or replace function public.ensure_missions() returns void
language plpgsql security definer set search_path = public as $$
declare d date := public.mission_day(); t text; i int := 0; n int; mid text;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  foreach t in array array['easy','medium','hard'] loop
    select count(*) into n from missions where tier=t;
    select id into mid from missions where tier=t order by id
      offset (abs(hashtext(auth.uid()::text || d::text || t)) % greatest(n,1)) limit 1;
    insert into mission_progress(user_id,day,slot,mission_id) values (auth.uid(), d, i, mid) on conflict do nothing;
    i := i + 1;
  end loop;
end $$;
create or replace function public.my_missions() returns table(slot int, id text, tier text, stat text, goal int, reward int, title text,
  progress int, claimed boolean, day date, resets_at timestamptz)
language plpgsql security definer set search_path = public as $$
begin
  perform public.ensure_missions();
  return query select mp.slot, m.id, m.tier, m.stat, m.goal, m.reward, m.title, mp.progress, mp.claimed, mp.day,
    ((mp.day + 1)::timestamp + interval '4 hours') at time zone 'America/Los_Angeles'
  from mission_progress mp join missions m on m.id=mp.mission_id
  where mp.user_id=auth.uid() and mp.day=public.mission_day() order by mp.slot;
end $$;
-- progress: once per reported match, only right after an ONLINE report_match (practice never counts), clamped by caps
create or replace function public.mission_report(p_counters jsonb) returns void
language plpgsql security definer set search_path = public as $$
declare pr public.profiles; lastmode text; r record; v int;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  select * into pr from profiles where id=auth.uid() for update;
  if pr.last_report is null or pr.last_report < now() - interval '2 minutes' then raise exception 'no recent match'; end if;
  if pr.missions_reported_at is not null and pr.missions_reported_at >= pr.last_report then raise exception 'already reported'; end if;
  select mode into lastmode from match_history where user_id=auth.uid() order by played_at desc, id desc limit 1;
  update profiles set missions_reported_at=now() where id=auth.uid();
  if coalesce(lastmode,'') <> 'online' then return; end if;
  perform public.ensure_missions();
  for r in select mp.slot, m.stat, m.goal, coalesce(c.cap,1) cap from mission_progress mp join missions m on m.id=mp.mission_id
      left join mission_caps c on c.stat=m.stat where mp.user_id=auth.uid() and mp.day=public.mission_day() and not mp.claimed loop
    v := 0;
    begin v := coalesce((p_counters->>r.stat)::int, 0); exception when others then v := 0; end;
    v := least(greatest(v,0), r.cap);
    update mission_progress set progress = least(r.goal, progress + v) where user_id=auth.uid() and day=public.mission_day() and slot=r.slot;
  end loop;
end $$;
create or replace function public.claim_mission(p_slot int) returns public.profiles
language plpgsql security definer set search_path = public as $$
declare mp public.mission_progress; m public.missions; pr public.profiles;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  select * into mp from mission_progress where user_id=auth.uid() and day=public.mission_day() and slot=p_slot for update;
  if mp.mission_id is null then raise exception 'no such mission today'; end if;
  if mp.claimed then raise exception 'already claimed'; end if;
  select * into m from missions where id=mp.mission_id;
  if mp.progress < m.goal then raise exception 'mission not complete'; end if;
  update mission_progress set claimed=true, claimed_at=now() where user_id=auth.uid() and day=mp.day and slot=p_slot;
  update profiles set money = money + m.reward where id=auth.uid() returning * into pr;
  return pr;
end $$;

-- ---------- Quick Play parties of 2 ----------
-- after mm_join, both party members call mm_party(ticket, shared code). mm_poll keeps a party in the same match and team.
create or replace function public.mm_party(p_ticket text, p_party text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_party is not null and p_party !~ '^[A-Z0-9]{4,12}$' then raise exception 'bad party code'; end if;
  if p_party is not null and (select count(*) from mm_queue where party=p_party and ticket<>p_ticket and status='waiting') >= 2 then raise exception 'party full'; end if;
  update mm_queue set party=p_party where ticket=p_ticket and status='waiting';
end $$;
create or replace function public.mm_poll(p_ticket text, p_fill_after int default 20) returns public.mm_queue
language plpgsql security definer set search_path = public as $$
declare r public.mm_queue; w record; grp text[] := '{}'; pty text[] := '{}'; code text; mid uuid; abc text := 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  i int; partner text; slots int[] := '{}'; tA int := 0; tB int := 0; oldest timestamptz;
begin
  perform pg_advisory_xact_lock(7707);
  delete from mm_queue where heartbeat < now() - interval '12 seconds';
  delete from mm_queue where status='matched' and created_at < now() - interval '10 minutes';
  update mm_queue set heartbeat = now() where ticket = p_ticket returning * into r;
  if r.ticket is null then raise exception 'not in queue'; end if;
  if r.status = 'matched' then return r; end if;
  -- build a group of up to 4: parties (2 tickets) go in together or not at all
  for w in select ticket, party, created_at from mm_queue where status='waiting' order by created_at loop
    exit when array_length(grp,1) >= 4;
    continue when w.ticket = any(grp);
    partner := null;
    if w.party is not null then
      select ticket into partner from mm_queue where status='waiting' and party=w.party and ticket<>w.ticket order by created_at limit 1;
    end if;
    if partner is not null then
      continue when coalesce(array_length(grp,1),0) + 2 > 4;
      grp := grp || w.ticket || partner; pty := pty || w.party || w.party;
    else
      grp := grp || w.ticket; pty := pty || coalesce(w.party,'');
    end if;
  end loop;
  select min(created_at) into oldest from mm_queue where status='waiting';
  if coalesce(array_length(grp,1),0) >= 4 or oldest <= now() - make_interval(secs => greatest(p_fill_after,5)) then
    if coalesce(array_length(grp,1),0) = 0 then return r; end if;
    code := ''; for i in 1..5 loop code := code || substr(abc, 1 + floor(random()*24)::int, 1); end loop;
    mid := gen_random_uuid();
    -- slots 0,1 = team A, 2,3 = team B; a party pair always gets a whole team (parties placed first, solos fill the rest)
    slots := array_fill(-1, array[array_length(grp,1)]);
    for i in 1..array_length(grp,1) loop
      if pty[i] <> '' and i < array_length(grp,1) and pty[i+1] = pty[i] and slots[i] = -1 then
        if tA = 0 then slots[i] := 0; slots[i+1] := 1; tA := 2; else slots[i] := 2; slots[i+1] := 3; tB := 2; end if;
      end if;
    end loop;
    for i in 1..array_length(grp,1) loop
      if slots[i] = -1 then
        if tA < 2 and tA <= tB then slots[i] := tA; tA := tA + 1; else slots[i] := 2 + tB; tB := tB + 1; end if;
      end if;
      update mm_queue set status='matched', match_id=mid, room_code=code, is_host=(i=1), team_slot=slots[i] where ticket=grp[i];
    end loop;
    select * into r from mm_queue where ticket = p_ticket;
  end if;
  return r;
end $$;

revoke all on function public.open_crate2(text), public.my_missions(), public.ensure_missions(), public.mission_report(jsonb),
  public.claim_mission(int), public.mm_party(text,text), public.mission_day() from public;
grant execute on function public.open_crate2(text), public.my_missions(), public.mission_report(jsonb), public.claim_mission(int) to authenticated;
grant execute on function public.mm_party(text,text), public.mission_day() to anon, authenticated;
grant execute on function public.mm_poll(text,int) to anon, authenticated;
-- end v8 migration
