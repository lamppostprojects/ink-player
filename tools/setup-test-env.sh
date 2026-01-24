#!/bin/sh

rm -rf test-env

./packages/create-ink-player/index.js test-env

cd test-env

# Replace ink-player with the workspace:* version
sed -i '' 's/@lamppost\/ink-player": ".*"/@lamppost\/ink-player": "workspace:*"/g' package.json

pnpm install
