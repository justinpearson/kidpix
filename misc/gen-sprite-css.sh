#!/bin/bash

# used in kidpix.css for entries like
# .sprite-pos-11-2 { object-position: -352px -64px; }


for col in `seq 0 14`; do
  for row in `seq 0 7`; do
    echo ".sprite-pos-$col-$row { object-position: $((-32 * col))px $((-32 * row))px; }"
  done
done
