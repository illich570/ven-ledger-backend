#!/bin/sh
# Infrastructure Layer: Docker entrypoint for database migration orchestration
# Follows Clean Architecture - this is infrastructure orchestration, not business logic

set -e

echo "⏳ Waiting for PostgreSQL to be ready..."
until pg_isready -U postgres -h postgres -p 5432 > /dev/null 2>&1; do
  sleep 1
done
echo "✅ PostgreSQL is ready"

echo "🔄 Running database migrations..."
if pnpm db:migrate; then
  echo "✅ Database migrations completed"
else
  echo "❌ Database migrations failed"
  exit 1
fi

echo "🚀 Starting application..."
exec pnpm dev
