#!/bin/bash
cd /workspace/arena-fps; L=V81_PROGRESS.md; echo "## Final regression $(date +%H:%M) sha $(sha256sum index.html|cut -c1-12)" >> $L
cnt(){ p=$(grep -ac "^PASS" $1); f=$(grep -ac "^FAIL" $1); echo "pass=$p fail=$f $(grep -aE '[0-9]+ passed' $1|tail -1|cut -c1-60)"; }
for s in A E D K I J L M N C F G H B 2; do ONLY=$s timeout 2400 node v81.js > logs/f_v81_$s.log 2>&1; e=$?
 echo "- v81[$s] exit=$e $(cnt logs/f_v81_$s.log) sha=$(sha256sum index.html|cut -c1-8)" >> $L; bash tools/bk.sh; done
for s in v8d1 v8d1b v8d2 v8d3a v8d3b v7b2 v7b1 v7net mpv6 acctest v7dev fstest v7stuck b3emo b3play b3pod b5smoke v71 v71pod b4water b4beach b5online; do
 a=""; [ $s = v7net ] && a="12000 1"; timeout 900 node $s.js $a > logs/f_$s.log 2>&1; e=$?
 echo "- $s exit=$e $(cnt logs/f_$s.log) errs:$(grep -aio '^errs \[.*' logs/f_$s.log|tail -1|cut -c1-40) sha=$(sha256sum index.html|cut -c1-8)" >> $L; bash tools/bk.sh; done
echo "FINAL DONE" >> $L; bash tools/bk.sh
