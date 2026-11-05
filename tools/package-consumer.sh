#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
mkdir -p artifacts
npm run build
npm pack --pack-destination artifacts >/dev/null
npm run test -- --run
cd examples/react-consumer
npm install --package-lock-only --ignore-scripts --force
rm -rf node_modules/@self/ui-style
npm install --force
npm run typecheck
npm run build
