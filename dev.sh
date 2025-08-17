#!/bin/bash

# Development helper script

case "$1" in
  "dev")
    echo "🔥 Starting development mode with hot reload..."
    docker-compose -f docker-compose.dev.yml up
    ;;
  "dev-build")
    echo "🔄 Rebuilding development containers..."
    docker-compose -f docker-compose.dev.yml up --build
    ;;
  "prod")
    echo "🚀 Starting production mode..."
    docker-compose up --build
    ;;
  "stop")
    echo "⏹️ Stopping all containers..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    ;;
  "db-only")
    echo "💾 Starting database only..."
    docker-compose up db -d
    ;;
  *)
    echo "Usage: $0 {dev|dev-build|prod|stop|db-only}"
    echo ""
    echo "  dev       - Start with hot reload"
    echo "  dev-build - Rebuild and start with hot reload"
    echo "  prod      - Start production mode"
    echo "  stop      - Stop all containers"
    echo "  db-only   - Start only database"
    ;;
esac
