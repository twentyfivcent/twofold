# V8 DROP 2 progress (resume log)
Base: index.v8d1.bak.html sha b73c7ae5... (verified = index.html at start)
Steps: 1 SQL+gate | 2 mock | 3 crates | 4 lb hover | 5 missions | 6 mantle prompt | 7 pings+voice | 8 lethal/tactical | 9 party | 10 label | 11 tests | 12 outputs
- [x] 1 SQL v8 section (+260 lines) + tools/v8gate.mjs: 44/44 PASS (run from /tmp/pgl). v7gate still passes. missions source tools/missions.mjs (55)
- [x] 2 mock: open_crate2/refund/crates_opened, missions RPCs, mm_party+party poll, leaderboard_v8
- [x] 3 crates (g9z_c1.txt): open_crate2 refund note, rarityCue, auto-roll+stop-epic; LB uses leaderboard_v8 + crates col; [x] 4 hover card #lbCard
- [x] 5-9 code: g9z_c2.txt (utility icons HUD, mantle prompt, pings+voice+team filter, mission counters/tab, party); 60_weapon lethal/tactical slots; 50_move auto-mantle bots only; g7_account p_mode uses G.practice; label V8 DROP 2 (v71.js/v8d1.js updated). NEXT: v8d2.js tests + regression
- [x] 10 fixes: p.tac collided with tac-sprint -> renamed tactical slot to p.tcu; utilHas accepts active p.util (v7b1 knife fix, rerun pass); party swap when mate team full; lbCard hidden on tab/game; mantle tip test hook __mantleTipProbe
- [x] 11 v8d2.js 43/43 (several runs; one earlier run flaked on a test-stub page error, fixed). Screenshots previews/v8d2-missions.png, previews/v8d2-hud-pings.png. First regression pass (mixed builds): all exit 0 except v7b1 (fixed, rerun 0). NEXT: final full regression on final build -> outputs
- [~] 12 final regression (build 614799, sha 3ba73fec…): v8d2 exit=0 v8d1 exit=0 v8d1b exit=0 v7b2 exit=0 v7b1 exit=0 v7net exit=0 mpv6 exit=1 acctest exit=0 v7dev exit=0 fstest exit=0 v7stuck exit=0 b3emo exit=0 b3play exit=0 b3pod exit=0 b5smoke exit=0 v71 exit=0 v71pod exit=0  — mpv6 = navigation timeout (server), rerun pending
- [x] 12a regression rest: b4water/b4beach/b5online exit 0
- [x] 12b mpv6 rerun exit=0
- [x] 13 outputs: index.v8d2.bak.html, twofold-v8-drop2.zip, shas logged in report. DROP 2 DONE
