# TWOFOLD v7 — Batch 1 progress (not pushed)

Tests: `node v7net.js 12000 1` (4-page fakenet MP, idle lobby + drop/rejoin), `node v7b1.js` (practice checks), `node mpv6.js` (v6 regression, errors []), `node v7shot.js` (switch-team screenshot). Build: `python3 build.py` → syntax ok.

## Netcode
- [x] Root cause: host heartbeat compared against lobby-time `conn.lastHeard`; clients idle >8s in lobby got dropped on frame 1 → "Lost connection". Fixed: lastHeard reset at start, 1s `hb` both ways, timeout 8s→15s. Verified: 12s idle lobby → hhhh on all 4 pages (was hhhb + menu error).
- [x] Reconnect/rejoin: session token (NETTOK), peer.reconnect on signalling drop, clientReconnect (6×6s, banner), host restores slot by token. Verified: simDrop → Cli1 back in own slot on all pages, errs [].
- [x] TURN still honored (LAST_ICE reused on reconnect). Real cross-NAT/TURN untestable here.
- [x] Fresh lobby chat per lobby (freshLobbyChat). [x] Switch-team button (progress/v7-switch-team.png).
## Melee
- [x] Root cause: setViewmodel left old vm knife orphaned on camera. Verified 8 states → 0 visible knives after swing.
## Guns
- [x] Hitscan/falloff (already present, verified Kestrel 31/24/22 @10/35/60m).
- [x] Wallbangs: PEN by class, one wall, shown on HUD ("DMG · PEN"), vote cards, damage floats ▦. Kestrel 0.3m→15, 0.8m blocked; Longreach 0.8m→40; Sparrow blocked at 0.3m. Screenshot progress/v7-wallbang.png.
- [x] Damage rounded to integers everywhere.
- [x] Shotgun spread ×0.72. [x] Cinder spin-up .65s/down .9s (progress/v7-cinder-spin.png).
- [x] Only bolt snipers one-shot heads (stilt/osprey/lancet head capped 92).
- [x] Corvid railgun; full charge body kill, pen 1.5m. [x] Bots use Corvid (8 shots/12s, hold till charge ≥.97).
- [x] Crossbow 80→104. Knives 30→44 speed, gravity 6→13, spawn on crosshair ray (0° off).
- [x] Springpad 12.5→16.5 (apex 6.67m). Haze Veil opacity .07→.16.
## Movement
- [x] Omni sprint (side 6.18, back 5.43), omni slide, bhop (6.18→7.22, cap 11.2), grapple auto-mantle (verified onto 2m ledge).
## Audio
- [x] Own steps .35→.15; enemy steps radius crouch 5/walk 13/run 22m, ×.4 + lowpass through walls.

## Batch 2 (2026-10-29)
- **Bot unstick**: Bots stuck for more than 0.8s jump and detour to a visible free nav cell. Past 1.1s they slide hard to a cell centre. Test was 40s per map on all 11 maps: worst stuck time 1.33s first run, 1.4s on the re-run, 0 errors.
- **Quick Play + Supabase v7 migration, account name = player name**: Done. Uses polling, not Realtime.
- **DEV tag** for twentyfivcent and weebier: the literal text `"DEV"`, bold, with no box. The whole tag is one solid colour that cycles through the rainbow on a 3s loop, with a dark text shadow. It shows on the leaderboard, account panel, lobby list, lobby and in-game chat, Tab scoreboard and killfeed. There are no 3D nametags in the game, so it can't show there. Screenshots: v7-dev-leaderboard, -scoreboard, -chat, -chat-lobby, -badge-ingame.
- **Minimap**: Centred on the player and rotating, with a circular 30m radius. Teammates are clamped to the rim and enemy fire blips fade over 2s. Pixel test: red 48 while firing, 0 after the fade.
- **UI**: Fullscreen and minimap settings, back-to-lobby (needs the host or every human to agree), vote v2 (3 cards, 15 bars), crate icons (3), and a skin viewer with drag and zoom (21 cards).
- **RNG loadouts**: 120 of 120 are distinct.
- **Visuals**:
  - Gemini holds a pistol in each hand (grip gap 0.04m).
  - No floating sight or attachment parts on any gun.
  - Exposure .86 (mean luminance about 121–127, 0% clipped).
  - Shadow fixes: 185/186 casters are DoubleSide, normalBias .02.
  - Column collision is now a cylinder.
  - Hoshikawa mountains are at least 10m from the map.
  - 18 pieces of shootable stall fruit.
  - Textured thrown utilities and a textured bulwark.
- **Regression**: v7b2, v7b1, v7net, mpv6, acctest and v7dev all show errs []. The acctest 'spd' errors were a test bug (no equipped gun meant the weapon was set to undefined) and are now guarded.
- **Can't test here**: Fullscreen API, real Supabase, PeerJS/TURN across machines.
- **Known gaps**:
  - The DEV check in P2P happens on the client only.
  - Players who join late don't get the fruit state.
- **Left for later**: Player models, ragdolls, water/beach, emotes, sudden death, menu pan, unlockable characters, more skins, and the release-gate acctest against the migrated DB. Not pushed.

## Batch 3 (DEV verify, models, ragdolls, crates, emotes, podium)
Done + verified (puppeteer `?fakenet` + mock-supabase, PGlite for SQL; errors [] in every run):
- DEV verification: per-viewer nonce, claim_presence/verify_presence bound to auth.uid(). Tested a spoofing guest ("weebier_" plus a replayed nonce): no tag. Guests are never DEV. DEV list is the admin-only table dev_names (twentyfivcent, weebier, purplejay83) with a trigger, and was verified for accounts created after the migration. Players can't read or write it.
- Late joiners get the shot-fruit state. New rounded player models hold their guns, with team silhouettes. Low LOD is about 9k triangles vs 16k.
- Verlet ragdolls: collide with the world, despawn, sync in MP. Character crate "cast" (7) and emote crate "motion" (7), plus 15 new skins. Server-side rolls. The SQL is additive and idempotent (tools/b3mig.mjs, all PASS).
- Emote wheel on B (rebindable), third-person camera while emoting. Emotes cancel on every input and on damage, and the cancel syncs.
- Menu background: cinematic camera pan through the maps. Post-match podium plus the vote (12s, can end early but not before 8s) with gold plaques, loser nameplates and the Victory emote slot. Screenshots: v7-podium*.png.
- Regressions passed: v7b2, v7b1, v7net, mpv6, acctest, v7dev, fstest, v7stuck, b3emo, b3play, b3pod.
Untestable here: real Supabase/PeerJS/itch; feel/visual tuning of hand grips.
Left: on some maps, level geometry near the camera can partly cover a side plaque during the podium.

## Batch 4 (2026-10-29)
- **Podium:** a dedicated era-themed set above or outside the map, with a backdrop, skyline and key/rim/fill lights. The HUD is hidden except the vote panel and the '+$ earned' line (15s). The losers' row sits behind and lower. Shots: progress/v7-podium-*.png.
- **Models:** smooth materials (smat). Every character has headgear and a visor, armour plates, gloves, team armbands, and holds the gun in both hands. Shots: v7-models-lineup.png and v7-models-silhouettes.png.
- **Checks:** the primary-weapon key cancels emotes (b3emo, 16/16). The minimap radius is MINI_R=20 (v7-minimap.png).
- **New map, Coral Point (12th map, Modern):**
  - Lanes: boardwalk, lifeguard tower and surf line.
  - Beach backdrop with ocean, islands, sailboats, a cargo ship, palms and resort towers. The skyscraper ring is not used here.
  - Shots: v7-map-coral-point*.png.
- **Water:**
  - Walk-through shallow water (`wade`, defined in src/g9z_b4.txt) on Coral Point, Dockyard 9, Tlaloc Steps and Cloudgate.
  - Speed is 0.9-0.26×depth, with a floor of 0.7. Measured: 0.85× at 0.2m and 0.79× at 0.42m.
  - Splash particles, ripple rings and wading sounds replace footsteps in water. Deep water still blocks movement.
  - Shots: v7-water-*.png.
- **Sudden death:**
  - SDMAPS gives each map an enclosed arena of about 32×62m, built from that map's era, palette, textures, sky and backdrop.
  - At 5-5 the host loads it with setSD in roundStart, and clients follow through the snapshot `sd`.
  - Shots: v7-suddendeath-*.png.
- **Validator:** ALL OK on 24 maps (12 maps plus 12 sudden-death variants).
- **Menu:**
  - The header now reads "2V2 ROUND ARENA · V7".
  - The background pan uses an eased 1.2s fade out and 1.2s fade in, driven by performance.now with no timers. Measured: opacity 0.32→0.86→1, map switch, then 0.95→0.05→0.
- **Regressions:** v7b2, v7b1, v7net, mpv6, acctest, v7dev, fstest, v7stuck, b3emo, b3play and b3pod all pass.
  - v7b1's knife step needed a test fix: the round had already ended by that point, so the test now forces the round live before that step. This was a test timing issue, not a game bug.
- **Known issue:** in v7-models-lineup.png the guns show clearly only on the leftmost characters. The showroom pose or camera hides the others' guns.

## Batch 5 (2026-10-29), done
- **Podium:** a true 2v2 layout that adapts to team size. The MVP stands front-centre on the tallest block, with the teammate beside them. Both losers stand behind with menu-style nameplates (name, DEV tag, K/D/DMG). Plaques are bigger, and the MVP's is biggest. If the MVP is on the losing team, they stand in the back row with a "★ MVP" plate, and the best winner takes the top block. Checked in 2v2, MVP-lose, 1v1 and 2v1. Shots: progress/v7-podium-{dockyard-9,tlaloc-steps,coral-point,mvplose-dockyard-9,1v1-dockyard-9,2v1-dockyard-9}.png
- **Models lineup:** every character holds their gun two-handed, with rotated figures in staggered rows. Shots: progress/v7-models-lineup.png and v7-models-silhouettes.png
- **Coral Point:** added a seawall, a container, a hut and crates for beach cover. Resort towers now have windows, balconies and floors. Added wet-sand bands and beach decor. Kept the 3 lanes, and the validator reports ALL OK on 24 maps (12 MAPS + 12 SDMAPS).
- **Water (all maps):** soft alpha-edged, segmented, gently moving wave planes, a soft wet underlay and moving foam. Shots: progress/v7-water-*.png and v7-map-coral-point*.png
- **v7b1 early round end:** not a game bug. Four isolated reruns never called endRound. It only happened while other tests ran at the same time and starved the CPU, so it is a test-timing artefact. The test guard is kept.
- **Online count:** shows "● N online" under the header. It uses an additive table, `online_presence`, and the SECURITY DEFINER RPCs `heartbeat(uuid)` and `online_count()`, with RLS on and no direct anon access. The count hides when Supabase is offline, errors or isn't set up. Shot: progress/v7-online-count.png
- **Regression:** all 15 suites exit 0 with no errors when run one after another. b5smoke.js passes on all 12 maps and all 12 sudden-death arenas (spawns OK, bots move, in bounds, 0 errors).
- **Release gate** (tools/v7gate.mjs, PGlite): **31 passed, 0 failed**. tools/v7migtest.mjs: 0 failed, after its snapshot was changed to leave out the skins and crates tables, which v7 legitimately adds rows to.
- **Packaging:** twofold-v7.zip (index.html + supabase-setup.sql) and index.v7.bak.html. Nothing pushed.
- **Podium fix (09:20):** in 2v2 the winning teammate now stands in the front row on their own side block (1.5 wide, left of the MVP, away from the vote panel), with a readable gold plaque (name + K/D). Losers stand further out and behind (gaps -4.5 / +2.75), so no one hides anyone. Re-shot on Dockyard 9, Tlaloc Steps and Coral Point, plus the mvplose, 1v1 and 2v1 variants. The smoke test's sudden-death bounds check now uses MX/MZ instead of a hard-coded 16.9; the arena is 20.8 wide, so the old limit gave a false failure.
