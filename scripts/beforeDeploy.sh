#!/bin/sh

curl "http://api.screenshotmachine.com/?key=$SNAPSHOT_API_KEY&url=https://ewoken.github.io/world-data-app/&device=desktop&dimension=1024x768" -o build/homeSnapshot.jpg
