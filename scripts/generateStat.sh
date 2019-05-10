#!/bin/sh

node dataSources/index.js "$1" || exit 1
cp -r "data/$1" "public/data/"
