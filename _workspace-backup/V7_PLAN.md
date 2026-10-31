# TWOFOLD v7 plan (from Tyler, 2026-10-29). Base = v6 live (commit 0c21d49), local index.html == index.v6.bak.html.
Standing rules: all original (no franchise names/real gun names), procedural art/sound, map rules (walled spawns w/ exits, no spawn LOS, 3 lanes may intertwine, distinct layout + era, 3 flag spawns: 1 center nudged + 2 others, move points not props), screenshots per batch into progress/v7-*.png, final zip twofold-v7.zip, single-file index.html, don't push (Jeff pushes).

## Earlier queued v7 items
- Matchmaking: Quick Play (Supabase queue table + Realtime, bot-fill after ~20s, host election, then PeerJS room code behind the scenes) alongside room codes.
- Rainbow animated "DEV" tag: admin-only profiles column (players can't set via RLS); shows on scoreboard, killfeed, chat, nametags, leaderboard. DEV accounts can get admin-granted money (Tyler edits in Supabase). DEV usernames: "twentyfivcent" and "weebier" (case-insensitive). Provide an idempotent v7 SQL migration that adds the column and sets dev=true for those two usernames (no data loss), No fixed money grant: Tyler adds money manually in Supabase Table Editor (profiles.money) when needed; keep that column directly editable by the dashboard and do not add triggers that would block or reset admin edits.
- DEV accounts (case-insensitive): twentyfivcent, weebier, Purplejay83. Stored in the admin-only table public.dev_names (RLS on, no client grants). A trigger on profile insert or username change sets dev=true, so accounts created after the migration are covered. Add more in SQL with: insert into public.dev_names values ('name') on conflict do nothing;
- Signed in: account username IS the player name (full 16 chars, no separate name box; guests still type a name).
- Omnidirectional sliding AND omnidirectional sprinting.
- Melee stuck on screen first time pulled out (still in v6) - fix for real + test first draw in all states.

## New list
Guns/combat:
- Cinder Spool: gatling spin-up ramp (fire rate ramps up, spin-down).
- Damage falloff (if not present).
- Normal guns hitscan; keep projectiles for grenade launchers, crossbow, etc.
- Semi-auto snipers no headshot one-shot; only bolt-action one-shot headshots.
- Corvid Arc: railgun - slower charge, one-shots body and head.
- Wallbangs: penetration by caliber; crossbow/launchers none; show penetration value next to damage in UI/loadout.
- Damage numbers rounded, no repeating decimals.
- Shotgun spread tighter.
- Crossbow projectile ~30% faster.
- Throwing knives: heavier arc, more speed, spawn at crosshair (not above).
- Springpad bounces higher.
- Haze Veil: not fully invisible, slightly more visible.
- Bulwark panel: proper texture, not plain blue.
- Textures on grenades/utilities to match guns.
- Gemini Pair model: dual wield in two hands (currently both in one hand).
- Sights: some disconnected from gun - attach all properly.
Bots:
- Bots can't shoot Corvid Arc - fix.
- Bots stuck on walls and can't escape - robust unstuck.
Netcode:
- Stability: players lose connection when game starts with lobby codes - fix (keep connections through start, heartbeats/reconnect, TURN fallback).
- Switch team button when the other team has an empty spot.
- Lobby chat never saved; fresh chat per new lobby.
Visuals/audio:
- Better player models that fit the rounded polished gun style.
- Ragdoll physics on death.
- Overbright white objects glow - tone down (material/tonemapping).
- Shadows visible through walls - fix; enemy footsteps only audible when close (distance falloff/occlusion).
- Own footsteps very loud - lower.
- Hoshikawa background mountain clips into map - fix.
- Rome (Marbleway): fruits shootable/destructible; pillar hitboxes bad - fix collision to match visuals.
- Water: walkable water on maps with water, water physics + splash particles, slower movement.
Movement:
- Bhopping.
- Grapple to ledge auto-mantles.
UI/menus:
- Fullscreen option.
- Minimap: teammates always; enemies appear when they shoot.
- Back to lobby button during next-map vote.
- Loadout voting UI more sophisticated.
- Main menu background: camera pan through all available maps.
- Crate icons for each crate; clicking a skin opens a separate inspect/viewer menu.
Content/economy:
- Character models unlockable through cases.
- More unique skins per crate.
- Emote crate with >= 6 emotes, emote wheel + keybind (synced in MP).
- True RNG loadouts: no two identical combinations in a match.
- Sudden death at 5-5: a smaller enclosed sudden-death variant for each map with the same era/atmosphere.
- New beach map, modern era, same map rules.
- Emotes cancel instantly on any movement/jump/crouch/fire/ADS/reload/swap/scroll/melee/utility input or on taking damage; camera eases back to first person; cancel syncs in MP.
- Post-match MVP podium (runs together with the next-map vote: 12s default, ends early once every human has voted but never before 8s; Back to Lobby still works). The separate vote screen is gone.
  - Stage at an open spot near the map's flag point, facing the most open direction. Slow cinematic camera push-in.
  - The MVP stands in front on the tallest block. The winning team stands on gold-plaqued blocks doing their Victory emote (a new Loadout slot; Cheer by default). Plaques: procedural gold, beveled, engraved name + "DEV" + K/D; the MVP plaque is larger and reads MVP.
  - The losing team stands in the back row with slumped idles (head down, kicking dirt, shrugging) and menu-style glass nameplates (name, "DEV", K/D/Dmg, team accent) projected to the screen without overlapping.
  - Uses each player's equipped character and gun skin. The host sends the lineup. Screenshot v7-podium.png.

## Release gate (Tyler, required before going live)
- Player data must survive the update: seed a test DB (PGlite/Postgres) with v6 schema + realistic accounts (money, owned skins, keys, equipped skin, settings, match_history, gun_stats), then run the v7 SQL migration TWICE; verify every row/value is unchanged, no tables dropped/truncated, and those accounts can sign in, report a match, buy/open crates and equip on the v7 client (acctest against migrated DB). Migration must be additive/idempotent only (no DROP TABLE, no TRUNCATE, no destructive ALTER).

## Batch 4 status
- Done: podium set, smooth soldier models, Coral Point (beach) map, shallow water, sudden-death arenas (validator ALL OK on 24 maps), V7 menu header, clock-driven menu pan fades.
- Next batch: release gate.
