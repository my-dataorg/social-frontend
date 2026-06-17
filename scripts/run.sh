#!/usr/bin/env bash
# Start social-frontend (port 3020) — scaffold
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${PORT:-3020}"

if [[ ! -f package.json ]]; then
  echo "social-frontend is still a scaffold (no package.json yet)."
  echo "Planned port: ${PORT}"
  exit 1
fi

if [[ ! -f .env.local ]] && [[ -f .env.example ]]; then
  cp .env.example .env.local
fi

if [[ ! -d node_modules ]]; then
  npm install
fi

echo "Starting social-frontend on http://localhost:${PORT}"
exec npx next dev --port "$PORT"
