#!/bin/sh

mkdir public/img
mkdir public/img/flags
mkdir public/geo
cp node_modules/world-countries/data/*.svg public/img/flags
cp node_modules/world-countries/data/*.topo.json public/geo
cp CNAME public

rm -rf public/data
mkdir data
node dataSources/index.js || exit 1
cp -r data public/
