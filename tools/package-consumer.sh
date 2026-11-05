#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
mkdir -p artifacts
npm run build
npm pack --pack-destination artifacts >/dev/null
npm run test -- --run
cd examples/react-consumer
# This consumer intentionally installs the freshly packed local artifact. Its
# same-version contents change during development, so a cached lock integrity
# would otherwise keep installing the previous tarball.
rm -rf node_modules package-lock.json
npm install --force
npm run typecheck
npm run build
