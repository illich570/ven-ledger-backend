#!/bin/sh
# Infrastructure Layer: Docker entrypoint for database migration orchestration
# Follows Clean Architecture - this is infrastructure orchestration, not business logic

set -e

echo "⏳ Waiting for PostgreSQL to be ready..."
TIMEOUT=60
ELAPSED=0
WAIT=1
until pg_isready -U postgres -h postgres -p 5432 > /dev/null 2>&1; do
  if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
    echo "❌ PostgreSQL did not become ready within ${TIMEOUT}s. Aborting."
    exit 1
  fi
  sleep "$WAIT"
  ELAPSED=$((ELAPSED + WAIT))
  # simple backoff: cap at 8s between retries
  WAIT=$((WAIT * 2 > 8 ? 8 : WAIT * 2))
done
echo "✅ PostgreSQL is ready (waited ${ELAPSED}s)"

echo "🔄 Running database migrations..."
if pnpm db:migrate; then
  echo "✅ Database migrations completed"
else
  echo "❌ Database migrations failed"
  exit 1
fi

echo "🚀 Starting application..."
exec pnpm dev
