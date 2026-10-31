# V8 DROP 3 part 1 progress
Base: index.v8d2.bak.html sha 3ba73fec…
Steps: A gfx previews (separate build) | B Velvet Ace casino map + 6 slots | C melee model + character hands | tests | outputs

## STEP A — DONE (preview only; src/ untouched)
- previews/gfx/hoshikawa-before-after.png, sunspire-before-after.png, character-before-after.png
- FPS (swiftshader, ms/frame avg of 3 runs, relative only): Hoshikawa 351→555 (+58%, ~-37% FPS); Sunspire 252→456 (+81%, ~-45% FPS)
- Character tris 13.1k → 34.9k (2.7x). Note: harness tris/calls counter reads 1 (composer final quad) — not meaningful.
- Fixes: CapsuleGeometry (not in r128) -> limb(); char shot now uses an isolated studio scene+camera.
## STEP B — DONE
- Velvet Ace (Mobster era, 1931) is MAPS[12]. It has 3 lanes (Card room & balcony / Roulette pit & catwalk / Slot hall & bar), the walled SPAWN_KIT, a balcony plus a 2.35m catwalk, 3 auto-validated flags, random time of day (rollTod), and it appears in the vote, lobby and menu pan. Its Sudden Death variant is generated automatically.
- 6 slot machines (3 mirrored). On E (the takeover key) a slot spins its reels. A win gets WINNER! and a gold flash; a loss gets BUST and a red flash. Each has its own audio, with no money. Code: src/g9z_d3.txt.
## STEP C — DONE
- meleeModel(): extruded clip-point knife with fuller, brass guard, ribbed grip and pommel, used both first-person and in the world (knifeMesh).
- buildArm is now character-aware (HANDSTY covers all 8 chars). f0_loop sets window.__vpChar=charOf(vp), and the viewmodel rebuilds when the character changes.
- Label set to V8 DROP 3a. Version checks in v71, v8d1 and v8d2 were updated.
- New suite v8d3a.js: 27/27. Screenshots in shots/ (d3shots.js).
- regress batch1: 17/20 ok; b3pod (screenshot timeout) + b4water (goto timeout) flaky; v71 hardcoded 12-map counts -> updated to 13 maps (MAPS_N 12, setup options 14)
- rerun b3pod/v71/b4water: all exit=0 -> 21/21 suites pass
- OUTPUTS: index.v8d3a.bak.html a37fbe42…, twofold-v8-drop3a.zip f38e11f360c1…, 2 shots in shots/. DROP 3a COMPLETE.
