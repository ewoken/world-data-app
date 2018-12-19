#!/bin/sh

mkdir public/img
mkdir public/img/flags
mkdir public/geo
cp node_modules/world-countries/data/*.svg public/img/flags
cp node_modules/world-countries/data/*.topo.json public/geo
cp CNAME public

rm -rf public/data

if ([ -d "data" ] && git diff --quiet HEAD^1 dataSources); then
  echo "No change to dataSources => nothing to do"
else
  echo "Build data"
  rm -rf data
  mkdir data

  if [ ! -f data/2018_bpData.csv ]; then
    curl https://www.bp.com/content/dam/bp/business-sites/en/global/corporate/xlsx/energy-economics/statistical-review/bp-stats-review-2018-consolidated-dataset-narrow-format.csv -o data/2018_bpData.csv
  fi

  (node dataSources/index.js || exit 1)
fi

cp -r data public/
