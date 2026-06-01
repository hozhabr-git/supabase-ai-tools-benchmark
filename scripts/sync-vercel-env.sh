#!/usr/bin/env bash
# Push NEXT_PUBLIC_* vars from .env.local to the linked Vercel project.
set -euo pipefail

cd "$(dirname "$0")/.."
VERCEL="npx --yes vercel@latest"

if [[ ! -f .env.local ]]; then
  echo "Missing .env.local"
  exit 1
fi

if ! $VERCEL whoami >/dev/null 2>&1; then
  echo "Run: $VERCEL login"
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env.local
set +a

for name in NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; do
  value="${!name:-}"
  if [[ -z "$value" ]]; then
    echo "Missing $name in .env.local"
    exit 1
  fi
  for env in production preview development; do
    echo "→ $name ($env)..."
    $VERCEL env add "$name" "$env" --value "$value" --yes --force
  done
done

echo ""
echo "Done. Redeploy so production picks up env:"
echo "  ./scripts/deploy-vercel.sh"
