#!/usr/bin/env bash
# Update MEMORY.md sync log and push to configured remotes.
# Usage: ./scripts/sync-memory.sh "short note about what changed"
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

NOTE="${1:-sync}"
WHEN="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
DAY="$(date -u +%Y-%m-%d)"

if [[ ! -f MEMORY.md ]]; then
  echo "MEMORY.md missing" >&2
  exit 1
fi

# Refresh last-update line in Current state table
sed -i "s/| Last memory update | .* |/| Last memory update | ${DAY} |/" MEMORY.md

# Append sync log row before "## How to unblock" or at end of Sync log section
ROW="| ${DAY} | ${NOTE} | local | recorded |"
if ! grep -qF "| ${DAY} | ${NOTE} |" MEMORY.md; then
  awk -v row="$ROW" '
    BEGIN { done=0 }
    /^## How to unblock/ && !done { print row; done=1 }
    { print }
    END { if (!done) print row }
  ' MEMORY.md > MEMORY.md.tmp && mv MEMORY.md.tmp MEMORY.md
fi

git add MEMORY.md
if git diff --cached --quiet; then
  echo "No memory changes to commit"
else
  git commit -m "chore: update agent memory — ${NOTE}"
fi

# Push to remotes that accept us
if git remote get-url edunor >/dev/null 2>&1; then
  if git push edunor HEAD:main 2>/dev/null; then
    echo "Pushed to edunor (main)"
  else
    echo "edunor push failed (check Cursor GitHub App repo access)" >&2
  fi
fi

if git remote get-url origin >/dev/null 2>&1; then
  BRANCH="$(git rev-parse --abbrev-ref HEAD)"
  git push -u origin "HEAD:${BRANCH}" || true
fi

echo "Memory sync done at ${WHEN}"
