# V8 DROP 3b progress
Base: index.v8d3a.bak.html a37fbe42…
Steps: 1 knife off-hand | 2 gfx integrate + Low/Med/High | 3 casino props | 4 tests+outputs
- [x] 1 knife: vm arms hidden while knife held (f0_loop), relaxed left off-hand added to vm (offHand, shown only when held); shot /tmp/knife-ch_atlas.png inspected OK
- [x] 2 gfx: src/g9z_e3.txt (settings.gfx low/med/high default med, ?gfx=, synced, .gfxSel UI, grades for 13 maps, bevel/env/AO/soft shadows, HD rig detail). probe fps swiftshader casino: low 4.5 med 3.17 high 2.67, no errors
- [x] 3 casino: 20_maps cz_* boxes (poker, bj, craps, roulette, stools, cage ends, rope, 2 pillars; old felt/podium/piano boxes retextured same dims) + src/g9z_e4.txt dressing (wheels spin, chips/cards, bottles, chandeliers, sconces, art, carpet). validateMaps [] spawnClear []
- [x] 4a v8d3b.js 23/23; labels -> V8 DROP 3b, old suites accept 3[ab]
- fps(swiftshader rel) Velvet low4.0 med3.0 high2.5; Dockyard low5 med3.5 high2.5. regression started
- resumed 11:32; regression running (v8d2 exit=1 investigating)
- 12:22 resumed; suites through b3pod exit 0 except v8d2
- regression: all 22 suites exit 0 (v8d2 ping-timing flake passed on rerun 43/43)
- [x] outputs built + shots v8d3b-casino-high/knife-hands/hoshikawa-high inspected
