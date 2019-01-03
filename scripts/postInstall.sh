#!/bin/sh

mkdir public/img
mkdir public/img/flags
mkdir public/geo
cp node_modules/world-countries/data/*.svg public/img/flags
cp node_modules/world-countries/data/*.topo.json public/geo
cp CNAME public

rm -rf public/data

if ([ "data/countries.json" ] && git diff --quiet HEAD^1 dataSources); then
  echo "No change to dataSources => nothing to do"
else
  echo "Build data"
  rm -rf data
  mkdir data
  (node dataSources/index.js || exit 1)
fi

cp node_modules/world-atlas/world/110m.json data/worldTopo.json
cp -r data public/
