#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

VERCEL="npx --yes vercel@latest"

if [[ ! -f .env.local ]]; then
  echo "Missing .env.local — copy .env.example and add your Supabase keys first."
  exit 1
fi

echo "→ Checking Vercel login..."
if ! $VERCEL whoami >/dev/null 2>&1; then
  echo ""
  echo "Not logged in to Vercel (or token expired)."
  echo "Run this first and finish login in the browser:"
  echo ""
  echo "  $VERCEL login"
  echo ""
  echo "Then verify:"
  echo ""
  echo "  $VERCEL whoami"
  echo ""
  exit 1
fi

echo "  Logged in as: $($VERCEL whoami)"

echo "→ Production build check..."
npm run build

if ! $VERCEL env ls production 2>/dev/null | grep -q NEXT_PUBLIC_SUPABASE_URL; then
  echo ""
  echo "⚠ Supabase env vars missing on Vercel. Run once:"
  echo "  ./scripts/sync-vercel-env.sh"
  echo ""
fi

echo "→ Deploying to Vercel (production)..."
$VERCEL --prod "$@"

echo ""
echo "Done. If tools are empty, sync env and redeploy:"
echo "  ./scripts/sync-vercel-env.sh && ./scripts/deploy-vercel.sh"
