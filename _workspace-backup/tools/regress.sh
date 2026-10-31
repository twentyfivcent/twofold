#!/bin/bash
cd /workspace/arena-fps; : > logs/summary.txt
for s in ${SUITES:-v8d1 v8d1b v7b2 v7b1 v7net mpv6 acctest v7dev fstest v7stuck b3emo b3play b3pod b5smoke v71 v71pod b4water b4beach b5online}; do
 a=""; [ $s = v7net ] && a="12000 1"
 if [ $s = v81 ]; then bash tools/v81all.sh > logs/v81.log 2>&1; else timeout 900 node $s.js $a > logs/$s.log 2>&1; fi; echo "$s exit=$?" >> logs/summary.txt; done; echo DONE >> logs/summary.txt
