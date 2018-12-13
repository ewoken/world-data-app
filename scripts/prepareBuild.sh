#!/bin/sh

mkdir public/img
mkdir public/img/flags
mkdir public/geo
cp node_modules/world-countries/data/*.svg public/img/flags
cp node_modules/world-countries/data/*.topo.json public/geo
cp CNAME public

./node_modules/.bin/babel src/api -d build_api || exit 1
rm -rf public/data
mkdir data
node build_api/generateData.js || exit 1
mv data public/
rm -rf build_api
