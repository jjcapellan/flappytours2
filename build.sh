#!/bin/sh
cat ./src/prefabs/helpers.js \
./src/prefabs/scrollinglayer.js \
./src/scenes/loadscreen.js \
./src/scenes/menu.js \
./src/scenes/ingame.js \
./src/scenes/gameover.js \
./src/main.js > ./dist/flappy.js