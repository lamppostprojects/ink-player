#!/bin/sh

pnpm lint

cd packages/ink-player

pnpm tsc

pnpm build
