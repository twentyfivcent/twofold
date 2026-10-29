-- TWOFOLD account server setup. Idempotent: safe to run more than once.
-- Paste into Supabase Dashboard > SQL Editor > New query > Run.

create extension if not exists pgcrypto;

-- ---------- tables ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique check (username ~ '^[A-Za-z0-9_]{3,16}$'),
  money integer not null default 250 check (money >= 0),
  xp integer not null default 0,
  level integer not null default 1,
  kills integer not null default 0, deaths integer not null default 0,
  wins integer not null default 0, losses integer not null default 0,
  headshots integer not null default 0, matches integer not null default 0,
  settings jsonb not null default '{}'::jsonb,
  last_report timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crates (
  id text primary key, name text not null, theme text not null,
  key_price integer not null check (key_price > 0)
);

create table if not exists public.skins (
  id text primary key,
  crate_id text not null references public.crates(id) on delete cascade,
  gun text not null, name text not null,
  rarity text not null check (rarity in ('common','uncommon','rare','epic','legendary')),
  weight integer not null check (weight > 0)
);

create table if not exists public.inventory (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('skin','key')),
  item_id text not null,
  qty integer not null default 1 check (qty >= 0),
  acquired_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

create table if not exists public.equipped (
  user_id uuid not null references auth.users(id) on delete cascade,
  gun text not null, skin_id text not null references public.skins(id),
  primary key (user_id, gun)
);

-- ---------- seed crates & skins (upsert) ----------
insert into public.crates(id,name,theme,key_price) values
 ('ember','Ember Crate','volcanic',300),
 ('tide','Tidewater Crate','ocean',350),
 ('circuit','Circuit Crate','neon-tech',400)
on conflict (id) do update set name=excluded.name, theme=excluded.theme, key_price=excluded.key_price;

insert into public.skins(id,crate_id,gun,name,rarity,weight) values
 ('em_ash','ember','wasp','Ashfall Camo','common',500),
 ('em_basalt','ember','sparrow','Basalt Weave','common',500),
 ('em_cinderwood','ember','drake','Cinderwood Inlay','uncommon',250),
 ('em_forge','ember','strix','Forge Damascus','uncommon',250),
 ('em_magma','ember','kestrel','Magma Veins','rare',120),
 ('em_obsidian','ember','magnate','Obsidian Gild','epic',45),
 ('em_caldera','ember','longreach','Caldera Heart','legendary',12),
 ('td_reef','tide','ferret','Reef Camo','common',500),
 ('td_kelp','tide','pip','Kelpwood Inlay','common',500),
 ('td_brine','tide','brute','Brine Carbon','uncommon',250),
 ('td_pearl','tide','warden','Pearl Filigree','uncommon',250),
 ('td_caustic','tide','hornet','Caustic Flow','rare',120),
 ('td_abyss','tide','needle','Abyssal Glow','epic',45),
 ('td_leviathan','tide','typhoon','Leviathan Shimmer','legendary',12),
 ('ci_grid','circuit','gust','Gridline Camo','common',500),
 ('ci_carbon','circuit','dart','Carbon Mesh','common',500),
 ('ci_trace','circuit','lathe','Tracewire','uncommon',250),
 ('ci_steel','circuit','maul','Coldsteel Damascus','uncommon',250),
 ('ci_pulse','circuit','corvid','Pulse Traces','rare',120),
 ('ci_holo','circuit','wren','Holofoil','epic',45),
 ('ci_overclock','circuit','pike','Overclock Prism','legendary',12)
on conflict (id) do update set crate_id=excluded.crate_id, gun=excluded.gun, name=excluded.name, rarity=excluded.rarity, weight=excluded.weight;

-- ---------- RLS ----------
alter table public.profiles enable row level security;
alter table public.inventory enable row level security;
alter table public.equipped enable row level security;
alter table public.crates enable row level security;
alter table public.skins enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select using (auth.uid() = id);
drop policy if exists inventory_select_own on public.inventory;
create policy inventory_select_own on public.inventory for select using (auth.uid() = user_id);
drop policy if exists equipped_select_own on public.equipped;
create policy equipped_select_own on public.equipped for select using (auth.uid() = user_id);
drop policy if exists crates_read on public.crates;
create policy crates_read on public.crates for select using (true);
drop policy if exists skins_read on public.skins;
create policy skins_read on public.skins for select using (true);
-- No insert/update/delete policies: all writes go through the SECURITY DEFINER functions below.
revoke insert, update, delete on public.profiles, public.inventory, public.equipped, public.crates, public.skins from anon, authenticated;

-- ---------- signup trigger ----------
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare uname text := nullif(new.raw_user_meta_data->>'username','');
begin
  if uname is not null and (uname !~ '^[A-Za-z0-9_]{3,16}$' or exists(select 1 from public.profiles where lower(username)=lower(uname))) then
    uname := null;
  end if;
  insert into public.profiles(id, username) values (new.id, uname) on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- RPCs ----------
-- v6: username-only accounts. Usernames are unique case-insensitively; signup pre-checks via username_available().
create unique index if not exists profiles_username_ci on public.profiles (lower(username));
create or replace function public.username_available(p_username text) returns boolean
language sql stable security definer set search_path = public as $$
  select p_username ~ '^[A-Za-z0-9_]{3,16}$' and not exists(select 1 from profiles where lower(username)=lower(p_username)) $$;
revoke all on function public.username_available(text) from public;
grant execute on function public.username_available(text) to anon, authenticated;

create or replace function public.set_username(p_username text) returns public.profiles
language plpgsql security definer set search_path = public as $$
declare r public.profiles;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if p_username !~ '^[A-Za-z0-9_]{3,16}$' then raise exception 'username must be 3-16 letters, numbers or _'; end if;
  if exists(select 1 from profiles where lower(username)=lower(p_username) and id<>auth.uid()) then raise exception 'username taken'; end if;
  insert into profiles(id) values (auth.uid()) on conflict (id) do nothing;
  update profiles set username=p_username, updated_at=now() where id=auth.uid() returning * into r;
  return r;
end $$;

-- v6: match history + per-gun stats, written only by report_match
create table if not exists public.match_history (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  played_at timestamptz not null default now(),
  map text not null, mode text not null default 'tdm',
  result text not null check (result in ('win','loss')),
  team_score int not null default 0, enemy_score int not null default 0,
  kills int not null default 0, deaths int not null default 0, headshots int not null default 0,
  damage int not null default 0, money_earned int not null default 0
);
create index if not exists match_history_user_time on public.match_history(user_id, played_at desc);

create table if not exists public.gun_stats (
  user_id uuid not null references auth.users(id) on delete cascade,
  gun text not null check (gun ~ '^[a-z0-9_]{1,24}$'),
  kills int not null default 0, headshots int not null default 0,
  shots_fired bigint not null default 0, shots_hit bigint not null default 0,
  damage bigint not null default 0,
  primary key (user_id, gun)
);
alter table public.match_history enable row level security;
alter table public.gun_stats enable row level security;
drop policy if exists match_history_select_own on public.match_history;
create policy match_history_select_own on public.match_history for select using (auth.uid() = user_id);
drop policy if exists gun_stats_select_own on public.gun_stats;
create policy gun_stats_select_own on public.gun_stats for select using (auth.uid() = user_id);
grant select on public.match_history, public.gun_stats to authenticated;

drop function if exists public.report_match(text,int,int,int);
drop function if exists public.report_match(text,int,int,int,text,text,int,int,int,jsonb,boolean);
alter table public.match_history add column if not exists mvp boolean not null default false;
create or replace function public.report_match(p_result text, p_kills int, p_deaths int, p_headshots int,
  p_map text default 'unknown', p_mode text default 'tdm', p_team_score int default 0, p_enemy_score int default 0,
  p_damage int default 0, p_guns jsonb default '[]'::jsonb, p_mvp boolean default false)
returns public.profiles language plpgsql security definer set search_path = public as $$
declare r public.profiles; k int; d int; h int; dmg int; earn int; gxp int; g jsonb; n int := 0;
  gk int; gh int; gf int; gs int; gd int; gid text; sk int := 0; sh int := 0;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if p_result not in ('win','loss') then raise exception 'bad result'; end if;
  select * into r from profiles where id=auth.uid() for update;
  if not found then raise exception 'no profile'; end if;
  if r.last_report is not null and r.last_report > now() - interval '60 seconds' then
    raise exception 'rate limited: one report per 60 seconds';
  end if;
  k := least(greatest(coalesce(p_kills,0),0),40);
  d := least(greatest(coalesce(p_deaths,0),0),40);
  h := least(greatest(coalesce(p_headshots,0),0),k);
  dmg := least(greatest(coalesce(p_damage,0),0),k*250+2000);
  -- v6 economy: win 80 / loss 30, +5/kill (cap 75), +3/headshot (cap 30), MVP +150; hard cap 315 per match
  earn := least(315, (case when p_result='win' then 80 else 30 end) + least(k*5,75) + least(h*3,30) + (case when coalesce(p_mvp,false) then 150 else 0 end));
  gxp  := (case when p_result='win' then 200 else 100 end) + k*15 + h*5;
  update profiles set money=money+earn, xp=xp+gxp, level=1+floor(sqrt((xp+gxp)/250.0))::int,
    kills=kills+k, deaths=deaths+d, headshots=headshots+h, matches=matches+1,
    wins=wins+(p_result='win')::int, losses=losses+(p_result='loss')::int,
    last_report=now(), updated_at=now()
  where id=auth.uid() returning * into r;
  insert into match_history(user_id,map,mode,result,team_score,enemy_score,kills,deaths,headshots,damage,money_earned,mvp)
  values (auth.uid(), left(coalesce(p_map,'unknown'),40), left(coalesce(p_mode,'tdm'),16), p_result,
    least(greatest(coalesce(p_team_score,0),0),99), least(greatest(coalesce(p_enemy_score,0),0),99), k, d, h, dmg, earn, coalesce(p_mvp,false));
  delete from match_history where user_id=auth.uid() and id not in
    (select id from match_history where user_id=auth.uid() order by played_at desc, id desc limit 50);
  -- per-gun: at most 12 entries; per-gun sums can never exceed the match totals
  if jsonb_typeof(p_guns)='array' then
    for g in select * from jsonb_array_elements(p_guns) loop
      n := n + 1; exit when n > 12;
      gid := g->>'gun';
      continue when gid is null or gid !~ '^[a-z0-9_]{1,24}$';
      gk := least(greatest(coalesce((g->>'kills')::int,0),0), k - sk);
      gh := least(greatest(coalesce((g->>'headshots')::int,0),0), gk, h - sh);
      gf := least(greatest(coalesce((g->>'shots')::int,0),0), 3000);
      gs := least(greatest(coalesce((g->>'hits')::int,0),0), gf);
      gd := least(greatest(coalesce((g->>'damage')::int,0),0), gs*200, dmg);
      sk := sk + gk; sh := sh + gh;
      insert into gun_stats(user_id,gun,kills,headshots,shots_fired,shots_hit,damage)
      values (auth.uid(),gid,gk,gh,gf,gs,gd)
      on conflict (user_id,gun) do update set kills=gun_stats.kills+excluded.kills,
        headshots=gun_stats.headshots+excluded.headshots, shots_fired=gun_stats.shots_fired+excluded.shots_fired,
        shots_hit=gun_stats.shots_hit+excluded.shots_hit, damage=gun_stats.damage+excluded.damage;
    end loop;
  end if;
  return r;
end $$;

create or replace function public.buy_key(p_crate_id text) returns public.profiles
language plpgsql security definer set search_path = public as $$
declare r public.profiles; price int;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  select key_price into price from crates where id=p_crate_id;
  if price is null then raise exception 'unknown crate'; end if;
  update profiles set money=money-price, updated_at=now() where id=auth.uid() and money>=price returning * into r;
  if not found then raise exception 'not enough money'; end if;
  insert into inventory(user_id,item_type,item_id,qty) values (auth.uid(),'key',p_crate_id,1)
    on conflict (user_id,item_type,item_id) do update set qty=inventory.qty+1;
  return r;
end $$;

create or replace function public.open_crate(p_crate_id text) returns public.skins
language plpgsql security definer set search_path = public as $$
declare s public.skins; total int; roll int; acc int := 0; rec record;
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
  insert into inventory(user_id,item_type,item_id,qty) values (auth.uid(),'skin',s.id,1)
    on conflict (user_id,item_type,item_id) do update set qty=inventory.qty+1;
  return s;
end $$;

create or replace function public.equip_skin(p_gun text, p_skin_id text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if p_skin_id is null or p_skin_id='' then delete from equipped where user_id=auth.uid() and gun=p_gun; return; end if;
  if not exists(select 1 from inventory i join skins k on k.id=i.item_id
      where i.user_id=auth.uid() and i.item_type='skin' and i.item_id=p_skin_id and i.qty>0 and k.gun=p_gun) then
    raise exception 'you do not own that skin for this gun';
  end if;
  insert into equipped(user_id,gun,skin_id) values (auth.uid(),p_gun,p_skin_id)
    on conflict (user_id,gun) do update set skin_id=excluded.skin_id;
end $$;

create or replace function public.save_settings(p_settings jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if pg_column_size(p_settings) > 16384 then raise exception 'settings too large'; end if;
  update profiles set settings=p_settings, updated_at=now() where id=auth.uid();
end $$;

revoke all on function public.set_username(text), public.report_match(text,int,int,int,text,text,int,int,int,jsonb,boolean), public.buy_key(text),
  public.open_crate(text), public.equip_skin(text,text), public.save_settings(jsonb) from public, anon;
grant execute on function public.set_username(text), public.report_match(text,int,int,int,text,text,int,int,int,jsonb,boolean), public.buy_key(text),
  public.open_crate(text), public.equip_skin(text,text), public.save_settings(jsonb) to authenticated;
grant select on public.profiles, public.inventory, public.equipped to authenticated;
grant select on public.crates, public.skins to anon, authenticated;

-- ---------- public leaderboard ----------
alter table public.profiles add column if not exists dev boolean not null default false; -- v7 (also in v7 block)
create or replace view public.leaderboard as
  select username, level, wins, kills, dev from public.profiles
  where username is not null order by wins desc, kills desc limit 100;
grant select on public.leaderboard to anon, authenticated;

-- per-gun view with derived accuracy (own rows only via RLS on gun_stats)
create or replace view public.my_gun_stats with (security_invoker = true) as
  select gun, kills, headshots, shots_fired, shots_hit, damage,
    case when shots_fired>0 then round(100.0*shots_hit/shots_fired,1) else 0 end as accuracy,
    case when kills>0 then round(100.0*headshots/kills,1) else 0 end as hs_pct
  from public.gun_stats where user_id = auth.uid();
grant select on public.my_gun_stats to authenticated;

-- =====================================================================
-- v7 MIGRATION (additive + idempotent: safe to run on a live v6 database, and safe to run twice).
-- Adds: profiles.dev (admin-only DEV tag), Quick Play matchmaking queue + RPCs. Drops/truncates nothing.
-- Money stays freely editable in Dashboard > Table Editor > profiles.money (dashboard edits bypass RLS).
-- =====================================================================
alter table public.profiles add column if not exists dev boolean not null default false;
-- DEV accounts (case-insensitive). Only ever turns dev ON; to remove a tag, edit profiles.dev in the dashboard.
-- reserved DEV usernames (lowercase). Admin-only table: RLS on and no client grants, so players can't read or write it.
-- Add a dev later with: insert into public.dev_names values ('name') on conflict do nothing;  (then the update below / trigger applies)
create table if not exists public.dev_names (name text primary key check (name = lower(name)));
alter table public.dev_names enable row level security;
revoke all on public.dev_names from anon, authenticated;
insert into public.dev_names(name) values ('twentyfivcent'),('weebier'),('purplejay83') on conflict do nothing;
create or replace function public.v7_dev_names() returns text[] language sql stable security definer set search_path = public as $$ select coalesce(array_agg(name), '{}') from public.dev_names $$;
revoke all on function public.v7_dev_names() from public, anon, authenticated;
update public.profiles set dev = true where lower(username) = any(public.v7_dev_names()) and dev = false;
create or replace function public.v7_dev_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- players can never change their own dev flag through the API: client roles are blocked from writing profiles,
  -- and set_username (the only RPC touching username) keeps the old value unless the name is a reserved DEV name.
  if new.username is not null and lower(new.username) = any(public.v7_dev_names()) then new.dev := true; end if;
  return new;
end $$;
drop trigger if exists profiles_dev_guard on public.profiles;
create trigger profiles_dev_guard before insert or update of username on public.profiles
  for each row execute function public.v7_dev_guard();
revoke update (dev) on public.profiles from anon, authenticated;
-- public list of DEV usernames so every client can draw the badge next to those names
create or replace function public.dev_usernames() returns setof text
language sql stable security definer set search_path = public as $$ select username from profiles where dev and username is not null $$;
revoke all on function public.dev_usernames() from public;
grant execute on function public.dev_usernames() to anon, authenticated;
-- leaderboard gains a dev column (appended last so create or replace view is legal)
create or replace view public.leaderboard as
  select username, level, wins, kills, dev from public.profiles
  where username is not null order by wins desc, kills desc limit 100;
grant select on public.leaderboard to anon, authenticated;

-- ---------- Quick Play matchmaking ----------
-- Clients (guests too) hold a random secret ticket. All access goes through the RPCs below (RLS on, no policies).
create table if not exists public.mm_queue (
  ticket text primary key check (length(ticket) between 16 and 64),
  name text not null default 'Player',
  created_at timestamptz not null default now(),
  heartbeat timestamptz not null default now(),
  status text not null default 'waiting' check (status in ('waiting','matched')),
  match_id uuid, room_code text, is_host boolean not null default false, team_slot int
);
create index if not exists mm_queue_wait on public.mm_queue (status, created_at);
alter table public.mm_queue enable row level security;
revoke all on public.mm_queue from anon, authenticated;

-- join (or re-join) the queue
create or replace function public.mm_join(p_ticket text, p_name text) returns public.mm_queue
language plpgsql security definer set search_path = public as $$
declare r public.mm_queue;
begin
  insert into mm_queue(ticket, name) values (p_ticket, left(coalesce(nullif(p_name,''),'Player'),16))
  on conflict (ticket) do update set status='waiting', match_id=null, room_code=null, is_host=false, team_slot=null,
    created_at=now(), heartbeat=now(), name=excluded.name
  returning * into r;
  return r;
end $$;

-- poll: heartbeat + match-making. Makes a match when 4 are waiting, or when the oldest has waited >= p_fill_after
-- seconds (host then fills the empty slots with bots). Host = the longest-waiting ticket (host election).
create or replace function public.mm_poll(p_ticket text, p_fill_after int default 20) returns public.mm_queue
language plpgsql security definer set search_path = public as $$
declare r public.mm_queue; grp text[]; code text; mid uuid; abc text := 'ABCDEFGHJKLMNPQRSTUVWXYZ'; i int;
begin
  perform pg_advisory_xact_lock(7707);
  delete from mm_queue where heartbeat < now() - interval '12 seconds';            -- leavers / closed tabs
  delete from mm_queue where status='matched' and created_at < now() - interval '10 minutes';
  update mm_queue set heartbeat = now() where ticket = p_ticket returning * into r;
  if r.ticket is null then raise exception 'not in queue'; end if;
  if r.status = 'matched' then return r; end if;
  select array_agg(ticket order by created_at) into grp from (
    select ticket, created_at from mm_queue where status='waiting' order by created_at limit 4) w;
  if coalesce(array_length(grp,1),0) >= 4 or
     (select min(created_at) from mm_queue where status='waiting') <= now() - make_interval(secs => greatest(p_fill_after,5)) then
    code := ''; for i in 1..5 loop code := code || substr(abc, 1 + floor(random()*24)::int, 1); end loop;
    mid := gen_random_uuid();
    for i in 1..array_length(grp,1) loop
      update mm_queue set status='matched', match_id=mid, room_code=code, is_host=(i=1), team_slot=i-1 where ticket=grp[i];
    end loop;
    select * into r from mm_queue where ticket = p_ticket;
  end if;
  return r;
end $$;

create or replace function public.mm_cancel(p_ticket text) returns void
language sql security definer set search_path = public as $$ delete from mm_queue where ticket = p_ticket $$;

-- queue size for the "N searching" label
create or replace function public.mm_count() returns int
language sql stable security definer set search_path = public as $$
  select count(*)::int from mm_queue where status='waiting' and heartbeat > now() - interval '12 seconds' $$;

revoke all on function public.mm_join(text,text), public.mm_poll(text,int), public.mm_cancel(text), public.mm_count() from public;
grant execute on function public.mm_join(text,text), public.mm_poll(text,int), public.mm_cancel(text), public.mm_count() to anon, authenticated;
-- end v7 migration

-- =====================================================================
-- v7 BATCH 3 MIGRATION (additive + idempotent: run after the v7 block; safe to run twice; drops/truncates nothing).
-- Adds: Character + Emote crates (items live in public.skins with gun='_char' / '_emote', so open_crate rolls them
-- server-side and equip_skin('_char', id) equips a character), +5 skins per gun crate, and verified-DEV presence keys.
-- =====================================================================
insert into public.crates(id,name,theme,key_price) values
 ('cast','Character Crate','original operators',450),
 ('motion','Emote Crate','moves and gestures',250)
on conflict (id) do update set name=excluded.name, theme=excluded.theme, key_price=excluded.key_price;
insert into public.skins(id,crate_id,gun,name,rarity,weight) values
 ('ch_vanguard','cast','_char','Vanguard','common',500),
 ('ch_nomad','cast','_char','Nomad','common',500),
 ('ch_ronin','cast','_char','Ronin','uncommon',250),
 ('ch_bastion','cast','_char','Bastion','uncommon',250),
 ('ch_specter','cast','_char','Specter','rare',120),
 ('ch_atlas','cast','_char','Atlas','epic',45),
 ('ch_wisp','cast','_char','Wisp','legendary',12),
 ('emo_salute','motion','_emote','Salute','common',500),
 ('emo_flex','motion','_emote','Flex','common',500),
 ('emo_groove','motion','_emote','Groove','uncommon',250),
 ('emo_cheer','motion','_emote','Victory Cheer','uncommon',250),
 ('emo_sit','motion','_emote','Take a Seat','rare',120),
 ('emo_spin','motion','_emote','Spin Move','epic',45),
 ('emo_laugh','motion','_emote','Belly Laugh','legendary',12),
 ('em_kiln','ember','anvil','Kiln Crackle','common',500),
 ('em_tempered','ember','lancet','Temper Bloom','uncommon',250),
 ('em_bark','ember','triad','Charred Bark','uncommon',250),
 ('em_runes','ember','osprey','Forge Runes','rare',120),
 ('em_storm','ember','mantis','Emberstorm','epic',45),
 ('td_crest','tide','rook','Crestwave','common',500),
 ('td_mosaic','tide','cinder','Tidepool Mosaic','uncommon',250),
 ('td_coral','tide','strix','Coral Bloom','uncommon',250),
 ('td_nacre','tide','gust','Nacre Swirl','rare',120),
 ('td_squall','tide','kestrel','Squall Line','legendary',12),
 ('ci_hazard','circuit','brute','Hazard Tape','common',500),
 ('ci_code','circuit','hornet','Rainfall Code','uncommon',250),
 ('ci_datablock','circuit','drake','Datablock','uncommon',250),
 ('ci_glitch','circuit','typhoon','Glitchwave','rare',120),
 ('ci_vapor','circuit','longreach','Vapor Horizon','epic',45)
on conflict (id) do update set crate_id=excluded.crate_id, gun=excluded.gun, name=excluded.name, rarity=excluded.rarity, weight=excluded.weight;

-- public profile row: only (id, username, dev). The view runs as its owner, so it can read every profile row but exposes nothing else.
create or replace view public.public_profiles as select id, username, dev from public.profiles;
grant select on public.public_profiles to anon, authenticated;

-- presence proofs: every peer shares a fresh random VERIFIER nonce per session. A signed-in player proves their account to a viewer by
-- claim_presence(viewer_nonce), which stores (nonce, auth.uid()). The viewer calls verify_presence([its own nonce]) and gets the public
-- profile (username, dev) of each account that proved itself. Nonces are the viewer's own, so replaying someone else's key proves nothing;
-- only the real account can insert a row for its uid, and guests (no auth.uid()) can never claim.
create table if not exists public.presence (
  key text not null check (key ~ '^pk[0-9a-f]{24}$'),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (key, user_id)
);
alter table public.presence enable row level security;
revoke all on public.presence from anon, authenticated;
create or replace function public.claim_presence(p_key text) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if random() < 0.02 then delete from presence where created_at < now() - interval '1 day'; end if;
  insert into presence(key, user_id) values (p_key, auth.uid()) on conflict do nothing;
  return true;
end $$;
create or replace function public.verify_presence(p_keys text[]) returns table(key text, user_id uuid, username text, dev boolean)
language sql stable security definer set search_path = public as $$
  select pr.key, pp.id, pp.username, pp.dev from presence pr join public_profiles pp on pp.id = pr.user_id
  where pr.key = any(p_keys[1:4]) and pr.created_at > now() - interval '1 day' limit 64 $$;
revoke all on function public.claim_presence(text), public.verify_presence(text[]) from public;
grant execute on function public.claim_presence(text) to authenticated;
grant execute on function public.verify_presence(text[]) to anon, authenticated;
-- end v7 batch 3 migration
-- ---------------------------------------------------------------------
-- v7 batch 5: online player count (guests included). Additive + idempotent.
-- (public.presence is already used for the batch-3 identity proof, so this lives in public.online_presence.)
-- Clients call heartbeat(random per-tab uuid) every ~30s and online_count() for the menu "● N online".
-- RLS is on with no policies and all table privileges revoked: anon/authenticated can only use the two RPCs.
create table if not exists public.online_presence (
  client_id uuid primary key,
  last_seen timestamptz not null default now()
);
create index if not exists online_presence_seen on public.online_presence(last_seen);
alter table public.online_presence enable row level security;
revoke all on public.online_presence from anon, authenticated;
create or replace function public.heartbeat(p_client_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_client_id is null then return; end if;
  -- global flood guard: refuse brand-new ids when >2000 new clients appeared in the last 10s
  if not exists (select 1 from online_presence where client_id = p_client_id)
     and (select count(*) from online_presence where last_seen > now() - interval '10 seconds') > 2000 then return; end if;
  -- per-client rate limit: at most one write per 20s per id (upsert)
  insert into online_presence(client_id, last_seen) values (p_client_id, now())
  on conflict (client_id) do update set last_seen = now()
  where online_presence.last_seen < now() - interval '20 seconds';
end $$;
create or replace function public.online_count() returns int
language plpgsql security definer set search_path = public as $$
begin
  delete from online_presence where last_seen < now() - interval '10 minutes';   -- prune old rows
  return (select count(*)::int from online_presence where last_seen > now() - interval '90 seconds');
end $$;
revoke all on function public.heartbeat(uuid), public.online_count() from public;
grant execute on function public.heartbeat(uuid), public.online_count() to anon, authenticated;
-- end v7 batch 5 migration
