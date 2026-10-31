#!/bin/bash
# v81 suite split per section (one browser per section avoids page.goto timeouts after ~60 pages in one Chrome)
cd /workspace/arena-fps; P=0; F=0
for s in A E D K I J L M N C F G H B 2; do o=$(ONLY=$s timeout 2400 node v81.js 2>&1); echo "$o" | grep -a "^PASS\|^FAIL\|^A2 \|^J " ; l=$(echo "$o" | grep -a "^v81:"); p=$(echo $l | grep -o "[0-9]* passed" | grep -o "[0-9]*"); f=$(echo $l | grep -o "[0-9]* failed" | grep -o "[0-9]*"); [ -z "$l" ] && f=$((f+1)) && echo "SECTION $s CRASHED"; P=$((P+${p:-0})); F=$((F+${f:-0})); done
echo "v81 total: $P passed, $F failed"; [ $F = 0 ]
