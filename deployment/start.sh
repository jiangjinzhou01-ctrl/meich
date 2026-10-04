#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
export NODE_ENV=production
export PORT="${PORT:-3000}"
export HOSTNAME="${MGC_BIND_ADDRESS:-0.0.0.0}"
exec node app/server.js
