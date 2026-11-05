#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
mkdir -p artifacts
npm run build
npm pack --pack-destination artifacts >/dev/null
npm run test -- --run
cd examples/react-consumer
# 显式重装 tarball，刷新同版本本地快照的 integrity，避免命中旧 lockfile 缓存。
npm install --force ../../artifacts/self-ui-style-0.8.1.tgz
npm run typecheck
npm run build
