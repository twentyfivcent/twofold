# TWOFOLD v8 plan (from Tyler, 2026-10-30). Base = v7.1 live (commit 08d0b6d, index.html sha 7c13a9e4…).
Standing rules unchanged: original names/art/sound only, procedural assets, single-file index.html from src/*.txt via build.py, map rules (walled spawns with exits, no spawn LOS, 3 lanes that may intertwine, verticality, distinct era, 3 flag spawns: 1 center nudged + 2 others, no props in spawns), tests blocked from *.supabase.co (testguard.js), SQL additive + idempotent (`if not exists`, `create or replace`, `on conflict do nothing`), PGlite gate proves existing profiles survive, final zip twofold-v8.zip, only a couple of final screenshots.
Size: S = <2h, M = 2–6h, L = 6h+. "SQL" = needs supabase-setup.sql v8 migration.

## 1. Crates / economy  (g6_skins, g7_account, g7m_menu, g9z_b3 crate roll UI, b0_audio)
| # | Item | Change | Files | SQL | Size |
|---|---|---|---|---|---|
|1|Skip button|"Skip" button + [Space] during the reel jumps straight to the reveal; result already decided server-side by `open_crate`, so it's purely visual.|g9z_b3 (openCrate reel), g7m_menu|no|S|
|2|Duplicate refund|Default **10% of key price** back on a duplicate (rounded, min $1), shown as "+$X duplicate refund" on the reveal. Must be done inside `open_crate` RPC so money can't be spoofed.|g7_account, g9z_b3, supabase-setup.sql `open_crate`|**yes** (replace function)|S|
|3|Scroll wheel in crate tab|Crate grid/list container gets `overflow-y:auto`; the global `wheel` handler (00_head L264/317 weapon-switch wheel) currently eats wheel events — skip it when the menu is open / target is inside a scroll container.|00_head, g7m_menu, h0_menu|no|S|
|4|Rarity audio cues|Procedural WebAudio stingers per rarity: Common soft tick → Uncommon chime → Rare 2-note arp → Epic chord + shimmer → Legendary rising sweep, bass hit, sparkle tail, screen flash/confetti. Reel ticks slow down and pitch up near the end.|b0_audio, g9z_b3|no|M|
|5|Auto roll|"Auto open ×N / until out of keys" toggle when keys ≥2: opens sequentially (fast reel or skip), stops on Epic+ (option), summary list at end. Each roll is still a separate `open_crate` RPC call.|g9z_b3, g7m_menu|no|M|
|16|Cases-opened tracker|`profiles.crates_opened int default 0` incremented inside `open_crate`; backfill from existing inventory count where possible; new leaderboard column/tab "Cases opened".|supabase-setup.sql, g7_account (leaderboard), h0_menu|**yes** (add column + replace `open_crate` + leaderboard view/select)|M|
|27|Crate icons for emote & character crates|Procedural canvas icons (emote crate = dancing figure silhouette / music note; character crate = helmet/bust) matching the existing gun crate icon style.|g6_skins, g9z_b3|no|S|

## 2. Missions  (new src/g95_missions.txt, g7_account, h0_menu, c0_events hooks)
6. **Daily missions**: 3 per day per account, chosen deterministically from a 55-mission pool by hash(user id + UTC date) (reset 00:00 UTC = 5 PM PT; open question). Progress counts in **online matches (Quick Play / room codes) incl. vs bots fill; Practice vs Bots counts at 50% or not at all** (default: not at all, to stop farming). Progress tracked client-side from match events, reported with the existing `report_match`; **reward granted server-side** by new RPC `claim_mission(day, idx)` which re-derives the day's missions and checks stored progress, capped so a mission pays once. Menu panel "Daily Missions" with progress bars + reroll 1/day (optional).
- SQL: **yes** — `mission_progress(user_id, day, idx, progress, claimed)` table with RLS, `report_match` extended (add-only params with defaults) to add mission counters, `claim_mission` RPC. Size **L**.
- Anti-cheat caveat: like current match money, counters come from the client/host; the server caps per-match increments to sane maxima.

Pool (55) — reward in $ (current key price is the anchor; easy ~$50, medium ~$100, hard ~$150–200):
1 Get 20 headshots $100 · 2 Get 10 headshots $50 · 3 Get 30 kills $100 · 4 Get 15 kills $50 · 5 Win 3 matches $150 · 6 Win 1 match $50 · 7 Play 3 matches $50 · 8 Play 5 matches $100 · 9 Get 5 kills with a sniper-class gun $100 · 10 Get 10 kills with rifles $75 · 11 10 SMG kills $75 · 12 8 shotgun kills $75 · 13 5 pistol kills $75 · 14 3 melee kills $100 · 15 2 throwing-knife kills $100 · 16 3 kills with lethal utility $100 · 17 Blind 5 enemies with a flash $75 · 18 Throw 5 smokes $50 · 19 Capture/hold the flag for 60s total $75 · 20 Capture the flag 3 times $100 · 21 Win 5 rounds $75 · 22 Win 10 rounds $125 · 23 Get MVP once $100 · 24 Get MVP 3 times $200 · 25 Get a double kill $75 · 26 Get 3 double kills $150 · 27 Clutch a 1v2 round $200 · 28 Deal 2,000 damage $75 · 29 Deal 5,000 damage $150 · 30 Get 5 assists $50 · 31 Get 15 assists $100 · 32 Kill 3 enemies while sliding $100 · 33 Kill 3 enemies mid-air $125 · 34 Mantle 20 times $50 · 35 Slide 30 times $50 · 36 Get 5 kills while crouched $75 · 37 Get 3 longshots (>35m) $100 · 38 Get 5 point-blank kills (<3m) $75 · 39 Win a round without dying 3 times $125 · 40 Revenge kill 3 times $75 · 41 Take over a bot and get a kill $100 · 42 Heal 300 HP (stim/ring) $75 · 43 Ping 10 enemies that a teammate then damages $75 · 44 Kill 2 enemies through/inside smoke $100 · 45 Get 10 kills with Gemini Pair $100 · 46 Get 3 crossbow kills $100 · 47 Play a match on 3 different maps $75 · 48 Play Coral Point / featured map of the day $50 · 49 Win a match without your team losing a round $200 · 50 Get 25 headshots in one day using secondaries $150 · 51 Destroy 3 enemy deployables (shield/decoy/mine/pad) $75 · 52 Get a kill with every weapon slot in one match $125 · 53 Use the emote wheel 5 times $25 · 54 Open 1 crate $25 · 55 Spot (ping) 20 enemies $50.
(Daily draw guarantees 1 easy, 1 medium, 1 hard. Weapon-specific missions only drawn if that class exists in the rotating loadouts.)

## 3. UI  (g99_v7ui, f0_loop HUD, h0_menu, g7_account, g9_play)
|#|Item|Change|Files|SQL|Size|
|---|---|---|---|---|---|
|7|Skin name next to gun name|HUD weapon label becomes "Gun Name · *Skin Name*" (skin coloured by rarity) using existing `skinOf`/`equippedSkin`.|f0_loop/HUD, a0_render skinOf|no|S|
|11|"Knife picked up"|Small fading text under crosshair (≈0.9s, 12px, 70% opacity) on knife pickup in `syncItems`/pickup event; reused for other pickups.|f0_loop syncItems, c0_events|no|S|
|14|Gun image on hover in gun stats|Reuse the existing cached side-on gun renders (f0_loop L50 data URLs) in a hover tooltip.|h0_menu gun stats, f0_loop|no|S|
|21|Leaderboard hover = character + stats|Hover card with a small three.js preview of their equipped character + K/D, wins, HS%, cases opened. Needs equipped character in the leaderboard select (public, non-secret column).|g7_account, h0_menu, preview renderer (shared with #28)|**maybe** (expose `equipped_char` in leaderboard select; additive)|M|
|26|Fullscreen by default|Browsers forbid fullscreen without a user gesture, so: request fullscreen on the first click/keypress (e.g. "Click to play" / first menu click) unless Settings → "Start in fullscreen" is off (default on, saved in settings).|g99_v7ui (fullscreen code), settings|no|S|
|36|Utility icons near gun UI|Show the lethal + tactical icons (cached utility renders) with key hints [G]/[Q] and count/cooldown under the ammo counter.|f0_loop HUD|no|S|
|17|Full pause in Practice|Esc in Practice vs Bots freezes the sim (skip host tick, bots, timers, nades, physics; audio suspend) and shows pause menu (Resume/Settings/Quit). Online stays non-pausing.|f0_loop, 70_host, d0_input|no|S|

## 4. Movement / combat  (50_move, 60_weapon, 10_weapons, 15_v7guns, 70_host, d0_input)
- **8 Active mantle (M):** today `tryMantle` auto-fires when airborne+forward into a ledge (50_move L47–60). v8: run `mantleProbe` every frame (throttled); when a ledge ≤2.2m is in front, show a small "[Space] Mantle" prompt near the crosshair; pressing Jump (default; bindable "mantle") performs it from ground or air. Keep the auto-catch on a missed jump as an assist (setting, default on). Host validates via same deterministic probe. Files: 50_move, d0_input, 00_head keybinds, g9_play HUD.
- **13 Crossbow one-shots head & chest (S):** set crossbow bolt damage so chest ≥100 after armour/multipliers (70_host L80 bolt hit, 15_v7guns L4); limbs stay non-lethal. Applied *after* the global nerf.
- **29 Damage reduction (S):** default **−4% damage (Tyler) on all guns** (multiplier in one place in 10_weapons/15_v7guns), keeping one-shot thresholds that define a gun (snipers headshot, crossbow head/chest, throwing knife any hit). Re-check every gun's shots-to-kill table in tests so no gun jumps by more than one STK. If still too fast → bigger maps in a later update.
- **35 Tactical / lethal split (M):** two utility slots per loadout, lethal on **G** (unchanged), tactical on **Q** (new bind; check Q isn't already used — it is free in the keybind list). Default classification:
  - Lethal (G): Pinecone Frag, Burr Charge (sticky), Talon Knife, Snare Wire (mine).
  - Tactical (Q): Fogger Smoke, Blinder Flash, Echo Pulse, Bulwark Panel, Mend Stim, Mimic Decoy, Gullwing Grapple, Springbok Pad, Static Hush (EMP), Verdant Ring, Haze Veil.
  - Loadout vote (70_host L131 true-RNG loadouts) offers primary + secondary + 1 lethal + 1 tactical; no-repeat rule extends to the new combo. Net sync: `cook`/held state gains slot; bots (80_bots L128) use both slots. Size M–L.
- **24 Gemini Pair hands (M):** viewmodel/third-person rig attaches both arms' IK to `gunGrips` right side; dual gun needs `gp.l` = left gun grip and the second gun mirrored to the left. Files: 10_weapons (gemini L40–64), g9z_b3 ikArm/gunGrips, viewmodel builder.
- **31 Melee model update (M):** new procedural knife/blade (better silhouette, guard, wrapped grip, bevelled edge, skinnable) replacing `knifeMesh()`; used in viewmodel, third-person hand3, thrown knife, previews.
- **33 Hands per character (M):** viewmodel arm/glove material + sleeve colour/shape taken from the equipped character model (and character skin colours); falls back to default.

## 5. Pings / voice  (new src/g96_ping.txt, g0_net, b0_audio, a0_render)
9. **Ping system (M–L).** Middle-mouse / bind "ping" (default **Z** + mouse3; open question).
- Ray from crosshair: if it hits/near-aims (cone ~3°) at a visible enemy → **red enemy ping** attached to that enemy for 3s (then left as last-known position marker, 2s) + voice line; else → **blue location ping** at hit point for 6s, "Move here". Double-tap location = "Hold here / Watching here". Max 1 active ping per player, 1s cooldown, team-only via existing net channel; visible through walls as a screen-space marker with distance.
- **Voice lines approach (default):** browser **SpeechSynthesis** (no assets, zero download, works offline), slightly pitched per character with a radio filter is not possible on speechSynthesis output, so add a short procedural radio click before/after. Lines: enemy → "Enemy here", "Enemy spotted", "Contact!", "Enemy on me"; location → "Move here", "Go here", "Let's push here", "Watch here". Alternative if Tyler wants consistent quality: pre-recorded clips (needs a voice source; can't embed real voices of people/franchises).
- Also a ping counter for missions (#43/#55). Bots respond to blue pings (move toward) — nice-to-have.

## 6. Maps  (20_maps, 21_nav, 90_tex, a0_render, g9z_b4)
- **10 Sunspire Roof helipad (S):** `helipad` canvas texture (90_tex L36/60) redrawn as a classic helipad: circle + single large white "H"; no extra markings. Map def 20_maps L22/30.
- **19 Water physics (M):** water boxes are `liquid:1` (Hoshikawa Temple centre pools L90, plus L81, L110, L139: Hoshikawa/Greywater/Tlaloc/Cloudgate etc.). Root cause: rays/nav skip liquid, but player collision still treats the liquid box top as floor, so you stand on the surface. Fix: liquid boxes don't support standing; player sinks into a basin (surface lowered to ~0.9m deep, floor below), in-water state = 55% move speed, no sprint/slide, jump becomes a slow swim-up, splash particles + sound, muffled audio when head under, blue tint. Nav already avoids liquid. Bots keep avoiding water.
- **15 Casino map "Velvet Ace" (L):** era Prohibition/mobster, 1931. 
  - Layout: two walled spawns (N: back-alley speakeasy loading dock behind a bakery front, S: a garage with getaway cars) with 2–3 exits each, no LOS between spawns, no props inside spawns.
  - Lanes: Left = casino gaming floor (roulette/card tables as cover, low-wall slot banks); Middle = grand lobby with sunken bar, chandelier, mezzanine balconies (verticality: second floor ring with two staircases + a mantle-able bar counter); Right = back-office/vault corridor with counting room, tight angles and a stairwell to the mezzanine. Lanes intertwine through kitchen doors and the mezzanine.
  - Flag spawns: centre (lobby floor, nudged off the chandelier axis), mezzanine east balcony, vault corridor counting room.
  - Look: deep red carpet, brass, green felt, dark wood panels, art-deco wall patterns, warm low light, cigar haze fog.
  - **Slot machines:** ~6 cabinets (in lanes, never in spawns). Press **E** to pull: lever anim, 3 reels spin 1.5s, procedural symbols (cherry, bell, 7, bar, diamond). ~1 in 8 win: lights flash, bell jingle + coin cascade sound; loss: buzz + "thunk". No money, per-player cooldown 3s, local-only visual (sound audible nearby to others is optional).
  - Added to map rotation, Quick Play random pool, practice map picker, room-code lobby picker; nav mesh generated + spawn-safety asserts (g8_asserts).
- **18 Assets in spawns (S–M, bug):** root cause: map decor (trees/lanterns/stones e.g. Hoshikawa L85 `bark`/`stone` props) is placed by hand-coded coordinates without checking spawn rects; `spawnCover:SPAWN_KIT` boxes may overlap too. Fix: a build-time assert in g8_asserts that fails on any non-wall prop intersecting a spawn region, then move offenders; auto-cull decor inside spawn rects as a safety net.
- **32 Beach (Coral Point) floating flags (S, bug):** likely root cause: decorative flag/pennant poles (or flag-spawn markers) placed with a y offset over a removed/lowered platform, or the 3 flag-spawn positions' y taken from a height that isn't ground there (flagPos uses map `flag:[x,y,z]`). Fix: snap decor + flag points to ground via the nav height sampler and add an assert that every flag point is ≤0.1m above a support.

## 7. Bots  (80_bots, g5_social/name lists)
- **20 Less aimbot + smoke (M):** root causes: perception check (80_bots L24) does test smoke only when *acquiring*; once "already engaged" the bot keeps tracking through smoke and has near-instant reaction + tight aim error. Fix: re-check LOS (incl. smoke) every perception tick and drop to last-known-position after 0.4s; increase reaction time ~+120ms per difficulty, add aim error that grows with target speed and decays (no instant snap; turn-rate cap), first-shot accuracy penalty, no headshot bias on Easy/Normal, blinded/flashed longer. Keep Hard close to current but with smoke respected.
- **22 More bot names (S):** expand pool from current list to ~150 original gamer-style names (no real people), no duplicates in a match.

## 8. Bugs (combat/render)
- **12 Takeover at match end (M):** root cause (g9_play L13–20): `hostTakeover` swaps `name`, `bot`, `conn`, and ME to the bot slot but stats/MVP and `report_match` money are keyed by original slot/`acct` id which stays on the now-bot slot `a`; at match end the podium/MVP shows the bot slot and money goes to nobody. Fix: on takeover move account id (`acct`/uid) to the controlled slot for the round and on round end / match end **revert control** back to your original slot (round reset already respawns), merge the bot's kills during your control into your stats, and exclude "'s bot" from MVP. Report_match uses your real account regardless.
- **23 Double body (S–M):** root cause: on death both the live player mesh (pMeshes, death pose/sink) and the ragdoll (`ragSpawn`, g9z_b3 L153) are shown; when the ragdoll spawns on a peer whose `alive` flag flips after the mesh already started its death anim, or when ragSpawn exits early (no `arms`) and later spawns again, the original mesh isn't hidden. Fix: one owner — ragSpawn always hides pMesh for RAG_LIFE and de-dupes by player+death count; if a ragdoll can't spawn, fall back to the old death pose only.
- **25 Enemies flicker weapons / twitch (M):** root cause (a0_render L319 `heldOf`): for remote players on the host it mixes `heldC` (client-reported) and `cur`, while on clients `held` comes from snapshots; when snapshots alternate between sources (or `meleeT`/`cook` flicker), `thirdHeld` toggles gun/knife/nade visibility each frame and IK re-targets (twitch). Fix: single authoritative `held` field in snapshots, hysteresis (only switch after 2 consistent snapshots / 100ms), and interpolate remote yaw/pitch with shortest-angle lerp.
- **34 Screen flicks when tracking (M):** likely root cause: aim assist/`resetAim` or recoil/viewkick applied while host reconciliation corrects yaw (onBecome/resetAim), or angle wrap (±π) in yaw smoothing causing a 360° flick; also pointer-lock raw-input spikes on some browsers. Fix: never let server corrections touch view angles, wrap-safe deltas, clamp single-frame mouse delta spikes (ignore >~300px outliers—known Chrome bug), test with high-DPI mice.
- **28 3D previews broken in menu (M):** root cause: the v7.1 character/emote menus create previews but the preview render loop only runs when `G` (in-match) exists / the canvas is sized 0 when the tab is hidden at creation. Fix: dedicated preview renderer with its own rAF while the menu is open, resize on tab show, play the selected emote's animation looped on inspect, drag-to-rotate.
- **24/31/33** above are visual fixes in Combat section.

## 9. Party / matchmaking  (g1_mm, g0_net, g5_social, supabase-setup.sql)
30. **Party of 2 (L):** "Create party" → 4-char party code (or invite from friends list if g5_social has one). Leader queues; `mm_join` gets optional `party_id` (+ size 2) and the matcher places party members on the same team and fills the other team with 2 solos or a party, bots after ~20s as today. Party members see each other in the menu and party chat; leaving cancels queue. Over PeerJS the leader's peer stays connected to the member in menu (lightweight room).
- SQL: **yes** — `mm_queue.party_id uuid null` (add column), replace `mm_join`/`mm_poll` with party-aware versions (defaults keep old clients working), optional `parties` table with RLS. Size L.

## 10. Graphics  (a0_render, a1_tod, 90_tex) — see routes below. Size M–L depending on route.

## Graphics upgrade routes
**A. Lighting & post-processing pass (recommended).** Adds: better shadows (soft PCF, cascaded-ish for the sun), hemisphere+bounce fill, SSAO-lite / baked AO on boxes, bloom on emissives/muzzle flashes, ACES tone mapping tuning, subtle colour grading per map, vignette. Perf: ~10–20% GPU; "Graphics: Low/Med/High" setting turns it off on weak machines. Effort: M (~1 day incl. testing).
**B. Texture & material upgrade.** Higher-res procedural canvas textures (512→1024), normal/roughness maps generated from the same canvases, PBR-ish materials (metal/wood/stone respond to light), bevelled box edges, more detail decals (grime, trim). Perf: mostly VRAM + one-time generation cost (~+1–2s load), small frame cost. Effort: M–L (~1–1.5 days; touches every map).
**C. Stylized "clean toon" look.** Cel/toon shading with outlines, flat bright palettes per map, simple gradient skies — very readable, cohesive, cheap. Perf: neutral to slightly cheaper (outline pass ~5%). Effort: M, but it's a big look change and may clash with existing skins.
Default if Tyler doesn't pick: A, plus the cheap parts of B (normal maps on floors/walls).

## SQL summary (one idempotent v8 migration appended to supabase-setup.sql)
- `alter table profiles add column if not exists crates_opened int not null default 0;` (+ one-time backfill guarded)
- `create or replace function open_crate` (dup refund 10%, increments crates_opened)
- `create table if not exists mission_progress` + RLS + `claim_mission` RPC + extended `report_match` (default params)
- `alter table mm_queue add column if not exists party_id uuid;` + party-aware `mm_join`/`mm_poll`
- leaderboard select/view exposes crates_opened (+ equipped char)
- PGlite gate: run v7 schema + seed players → apply v8 twice → verify all money/skins/stats intact, RLS still blocks direct money writes, dev flags untouched.

## DECISIONS (Tyler, 2026-10-30) — supersede defaults above
- Daily missions reset at **4:00 AM America/Los_Angeles** (computed with the LA tz so DST is handled; server derives "mission day" = (now at time zone 'America/Los_Angeles' - 4h)::date).
- **Practice vs Bots does NOT count** for missions; only room-code lobbies and matchmaking.
- Graphics: **route A + route B** (Low/Med/High setting), **plus more realistic character models**.
- Pings: browser SpeechSynthesis voice lines we generate.
- Damage: **-4%** (not -8%), one-shot exceptions kept, crossbow head/chest one-shot. May tweak later.
- Confirmed defaults: 10% duplicate refund, lethal G (Frag, Burr Charge, Talon Knife, Snare Wire) / tactical Q (rest), Velvet Ace casino, party of 2.
- Drops: **Drop 1** bugs + small UI (no SQL) · **Drop 2** economy/missions/pings/mantling/utilities/party (+SQL) · **Drop 3** casino map + graphics A+B + realistic characters + melee/hand models.

- **Added to Drop 1 (parent/Tyler):** Talon Knife is cookable: hold G to wind up (short windup), release to throw; throw speed/arc scales with hold time up to a cap. Covered by tests.
- **Graphics approval gate (Drop 3):** do NOT fully build routes A+B or the realistic characters until Tyler and his devs approve preview images. First step of Drop 3: before/after mockup renders of 2 maps + 1 character model, sent for approval; build only after the OK.

- **Ping voice-line approval gate (Drop 2):** before pings ship, record every ping voice line (enemy here, enemy spotted, contact, enemy on me, move here, go here, push here, watch here…) incl. the radio click/filter as mp3s in /workspace/arena-fps/previews/voicelines/ and send to Tyler for approval. Browser speech voices differ per browser/OS, so the clips represent one voice; preferred: generate the approved lines once and embed them as small compressed audio clips in index.html so every player hears the same voice (SpeechSynthesis only as fallback).

## Open questions for Tyler (answered — see DECISIONS)
1. Duplicate refund: OK with 10% (vs 5%)?
2. Daily reset time: midnight UTC (5 PM PT) or midnight PT?
3. Should Practice vs Bots count toward missions? (default: no)
4. Ping key: Z + middle mouse OK? Voice lines via built-in browser speech OK, or do you want recorded clips?
5. Damage −4% (decided) as the start point?
6. Graphics route: A, B, C, or A + bits of B?
7. Tactical/lethal split above OK (notably Talon Knife & Snare Wire as lethal; Grapple/Pad/Stim as tactical)?
8. Party size: just 2 (you + 1 friend) for v8?
9. Casino name "Velvet Ace" ok?
(For #32/#34 a short clip/map spot helps if the fix doesn't reproduce.)

## Build order & ETA
1. Bugs (12, 23, 25, 28, 34, 18, 32) + small UI (7, 11, 14, 26, 36, 17) + bots (20, 22) — ~1 day
2. Crates/economy (1–5, 16, 27) + SQL part 1 — ~0.5 day
3. Combat (13, 29, 35, 8, 24, 31, 33) — ~1 day
4. Water physics + helipad + casino map (10, 19, 15) — ~1 day
5. Missions + ping/voice (6, 9) — ~1 day
6. Party matchmaking (30) + SQL part 2 — ~0.5–1 day
7. Graphics route — ~1 day
8. Full regression (all puppeteer suites, PGlite gate, multi-peer net tests, perf check), fixes, zip — ~1 day
**Overall ETA: ~6–8 working days of build + test** (≈1.5 weeks wall-clock), delivered in 2–3 testable drops (bugs+UI first). Push to live only after Tyler OKs and the SQL migration is applied.
