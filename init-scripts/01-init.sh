#!/bin/bash
set -e

echo "🔄 Initializing PostgreSQL database for Pizza App..."

# Wait for PostgreSQL to be ready
until pg_isready -h localhost -p 5432 -U "$POSTGRES_USER"
do
  echo "⏳ Waiting for PostgreSQL to be ready..."
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# The database is automatically created by the postgres image
# Prisma will handle schema migration and data restoration
echo "📋 Database '$POSTGRES_DB' initialized successfully"
