# v6 progress (Oct 29 2026, ~2:45 AM PT)
DONE: index.v5.bak.html, supabase-setup.sql, rounded/bevelled cached gun geometry (rbox) + per-part size jitter (anti z-fight),
 gun detail pass (muzzle crown, vents, grip panels), pistol/iron sight stems, muzzle anchor userData.muz (+muz2 dual),
 buildGun(id,s,skin) hook -> applySkin (not yet written), HUD inactive icons .5, stronger blood, decoy isDecoy tag + __assertNoDecoyPlayers.
 Build ok (260851), smoke practice high map0: 0 errors.
TODO: everything else in the v6 list + 3 vertical maps (needs layered walkGrid/nav: per-cell list of surfaces, links step<=.55, jump<=1, drop<=4, ladder boxes).

## Batch 2 — DONE (2026-10-29)
- Stamina / sprint / tactical sprint (double-tap) / slide / mantle (≤1.6 m) / takeover (E, once per round) / inspect (I, per-class anims) verified by b2test.js: slide fires (stam −15), tac drains, mantle lands on 1.2 m crate top, inspect cancels on fire, melee state clears, takeover swaps ME→bot mate, a second takeover is refused, 0 errors.
- FIXED ROOT CAUSE of "players render as decoy": `G.P.map(buildPlayerMesh)` passed the array index as the `holo` arg → players 1–3 were built with holo materials. Now `buildPlayerMesh(p,false)`. The __assertNoDecoyPlayers check now flags holo-tagged materials.
- Fixed NaN slideCd after roundStart (per-field init).
- Smoke (bots): 0 errors, no stuck bots.
- Screenshots: v6-slide.png, v6-hud-stamina.png, v6-mantle.png, v6-inspect.png
- Next: Batch 3 (skins/crates/account/menu/music/stats).
- Casing sound: SND.casing output gain .18 -> .108 (60%), covers eject + landing ticks for all guns incl. shotgun shells (single shared function).
- QUEUED for batch 4: 3 flag spawn points/map (one at center nudged to nearest clear spot, props NOT moved), random per round no back-to-back repeat, validator checks clearance r1.5/headroom/reachability both teams/fair distance, MP sync + HUD marker at round start.
- QUEUED for batch 4: moderate era-appropriate verticality on all 8 existing maps (catwalks/pads/balconies/mezzanine/docks/ramparts/decks/colonnade), keep identity+3 lanes, 3D spawn LOS recheck, bot nav ramps/stairs, v6-map-<name>.png for all.
- QUEUED for batch 4: era-fitting out-of-bounds backdrops for all maps (Sunspire quality bar), cheap layers, reduced on Low, non-collidable, outside bounds.
- QUEUED for batch 4: random time of day per match (host-rolled, synced): sky/sun/ambient/fog/backdrop tint, night lamps, min ambient + rim light; Frostline calm sky; v6-tod-day/dusk/night.png.

## Batch 3 — DONE (2026-10-29)
- SQL: match_history + gun_stats, report_match(p_guns jsonb) with caps (k/d≤40, h≤k, dmg≤k*250+2000, ≤12 guns, hits≤shots≤3000), my_gun_stats view. Idempotent; verified twice in PGlite (RLS, anon denied, rate limit, trims 50).
- Economy: win 150/loss 60 + min(10k,200) + min(5h,100); start $250; keys ember 300 / tide 350 / circuit 400.
- Crates: Ember, Tidewater, Circuit; 21 procedural skins; odds C 59.6 / U 29.8 / R 7.2 / E 2.7 / L 0.7 % shown on cards. Server-side rolls; 5.2 s reel.
- Skins on viewmodel, 3rd-person, HUD icons, menu showcase; synced in MP via 'st' sk + snapshot field 21 (code path; 4-page MP test in batch 5).
- Account: signup/signin/username/guest, settings sync, report_match per gun, buy/open/equip, leaderboard, nosetup/offline fallback. Mock test acctest.js passes all flows, 0 console errors.
- Menu: tabs Play / Loadout & Skins / Crates / Stats & Leaderboard / Settings, 3D bg, account panel.
- Music: "Night Shift" procedural loop, round + win/lose stings, Music volume/mute.
- Fix: signup form lost username on re-render (inputs now preserved).
- Screenshots: progress/v6-mainmenu, v6-crates, v6-crate-open, v6-skins, v6-account, v6-stats, skin-ingame.
- Setup: run supabase-setup.sql in SQL Editor; optionally turn off Auth > Email "Confirm email".

## Batch 4 — DONE (2026-10-29, PT)
- **3 new vertical maps**: Tlaloc Steps (Mexica 1480), Meridian Grand (Art Deco 1929), Cloudgate Monastery (Ming 1520). 3 intertwining lanes, walled spawns, multi-level layouts.
- **Layered nav** (src/21_nav.txt) is shared by bots and the validator: up to 4 surfaces per cell, with walk/jump/drop links. Bots path in 3D.
- **Verticality on all 8 existing maps** (the VERT dict in 20_maps). Each map keeps its identity, its 3 lanes and its spawn rules.
- **Fixes**: Meridian and Cloudgate stairs were rebuilt with rises of 0.43 and 0.48 m, because the old 0.6+ rises broke nav cells.
- **Validator (tools/vmaps.js)**: ALL OK on 11/11 maps.
  - 0 spawn-to-spawn LOS leaks, including elevated sightlines.
  - 3 exits and 4 cross-paths on every map.
  - 3 flag spots per map: centre nudged to the nearest clear spot plus 2 lane spots. Each has 2.4 m head clearance and a 1.5 m clear radius, is fair (A/B path within 15%), and is at least 6 m from the others.
- **Flag rotation**: the host picks a spot each round with no back-to-back repeat (`pickFlag`/`flagPos`). The spot syncs through the snapshot `fl` field. At round start the HUD shows "FLAG SPAWN THIS ROUND: <name>".
- **Era backdrops** (`buildBackdrop`):
  - Tlaloc: volcanoes, a lake and pyramids.
  - Meridian: setback towers, searchlights and an elevated rail.
  - Cloudgate: karst peaks, a sea of clouds and pagodas.
  - All backdrops are meshes only, so nothing collides. On Low, every map keeps about 40% of the pieces and the near layers are dropped.
- **Time of day** (src/a1_tod.txt): the host rolls dawn, day, dusk or night and sends it in the 'start' and late-join messages and in snapshot `td`.
  - Night readability: ambient at least .22, hemisphere light at least .5, a blue rim light, and perimeter lamps.
  - Frostline rolls only its native night or a soft dusk, so its calm sky stays.
  - `?tod=` overrides the roll for tests.
- **Gun wall-tuck**: `gunTuck()` casts rays to 0.85 m. Above 0.55 it blocks fire and ADS; the viewmodel rotates up and back. Verified tuck 0.73 against a wall (v6-gun-tuck.png).
- **Already in place, rechecked**: casing sound at 0.108 gain, weapon panel at 1.15 scale, mic icon hidden through walls.
- **Stale skin message**: `menuMsg` no longer writes ACC.msg, and changing tabs clears ownership/equip messages.
- **Bot smoke test** (b4test.js, 40 s per map, speed 4) across 11 maps:
  - 0 page errors.
  - 3–4 rounds played per map.
  - Flags rotated without repeats.
  - Bots reached upper levels (max y 1.4–3.5).
  - Brief stuck episodes peaked at 1.03 s (Frostline 1.55 s) and recovered.
- **Screenshots**: progress/v6-map-*.png (11 maps), v6-tod-day/dusk/night.png and v6-gun-tuck.png.
- **Known issue**: the "day" roll on maps that are natively dusk (Sunspire, Greywater) keeps their native lighting.

## Queued for next batch
- Economy/MVP change (steer 3:25 AM PT).
- Username-only accounts (steer 3:43 AM PT).

## Batch 5 (final)
- **Economy and MVP**: a win pays 80 and a loss pays 30. Kills pay $5 each (max 75), headshots $3 each (max 30), and MVP adds $150. The server caps the total at $315 per match. The host computes MVP as k*100 + dmg*.5 + assists*40 + flag caps*150 + flag hold seconds*10. A bot MVP gets no bonus. The MVP badge shows in the end banner, on the scoreboard (★), in the history column, and in the recap. `report_match(..., p_mvp boolean)` stores the value in `match_history.mvp`.
- **Accounts are username-only**: each account gets a hidden synthetic email, `<name>@players.twofold.invalid`. Usernames are unique regardless of case (`profiles_username_ci` index plus `username_available()`). Recovery email is optional and set in Settings (updateUser). Forgot password uses resetPasswordForEmail and only works if a recovery email was added. **Supabase setup: Confirm email must stay OFF**, then re-run supabase-setup.sql.
- **Fixes**:
  - A 'day' roll now renders as real day on Sunspire, Greywater, and Meridian.
  - Cloudgate fog is lighter.
  - Bots get unstuck faster with an early sidestep.
  - ADS: the corvid and maul viewmodels sit further forward while aiming.
  - The tuck shot was retaken against a lit wall.
- **Tests**:
  - Map validator: ALL OK on 11 maps.
  - SQL ran twice OK.
  - acctest: errs [].
  - mpv6, 4 pages: errors []. Covers skins, melee/slot sync, tracers from the muzzle, flag and TOD sync, late join, and next map.
  - ADS centre coverage, excluding the sight aperture: ≤3% on all guns.
  - Pose/clip sheets v6pose-*.
