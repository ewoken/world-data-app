#!/bin/sh

curl "http://api.screenshotmachine.com/?key=$SNAPSHOT_API_KEY&url=http://worldenergydata.tk&device=desktop&dimension=1024x768" -o build/homeSnapshot.jpg
