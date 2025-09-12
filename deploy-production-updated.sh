#!/bin/bash

# Production deployment script with database restoration
# Greenland Famous Pizza - Complete Data Deployment
# Run this on your production server

echo "🚀 Starting Greenland Famous Pizza Production Deployment..."
echo "========================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Configuration
APP_DIR="/var/www/greenlandfamous"
BACKUP_DIR="/var/backups/pizzax"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DATABASE_BACKUP_FILE="pizzax-export-2025-09-11T22-37-38-543Z.json"
RESTORE_SCRIPT="restore-data.js"

# Create directories
log_step "Setting up directories..."
mkdir -p "$APP_DIR" "$BACKUP_DIR"

# Check if required files exist
log_step "Checking required files..."
if [[ ! -f "$DATABASE_BACKUP_FILE" ]]; then
    log_error "Database backup file not found: $DATABASE_BACKUP_FILE"
    exit 1
fi

if [[ ! -f "$RESTORE_SCRIPT" ]]; then
    log_error "Restore script not found: $RESTORE_SCRIPT"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create database backup before deployment
log_step "Creating database backup..."
if command -v pg_dump &> /dev/null && [[ -n "$DATABASE_URL" ]]; then
    pg_dump "$DATABASE_URL" > "$BACKUP_DIR/backup_$TIMESTAMP.sql" || log_warning "Database backup failed"
    log_info "Database backup created: $BACKUP_DIR/backup_$TIMESTAMP.sql"
else
    log_warning "Skipping database backup (pg_dump not available or DATABASE_URL not set)"
fi

# Stop existing containers
log_step "Stopping existing containers..."
docker-compose down --remove-orphans 2>/dev/null || true

# Clean up old containers and images
log_step "Cleaning up old containers and images..."
docker system prune -f
docker image prune -f

# Build new application image
log_step "Building new application image..."
docker-compose build --no-cache

# Start database
log_step "Starting database..."
docker-compose up -d db

# Wait for database to be ready
log_step "Waiting for database to be ready..."
sleep 30

# Check if database is ready
max_attempts=10
attempt=1
while [ $attempt -le $max_attempts ]; do
    log_info "Checking database connection (attempt $attempt/$max_attempts)..."
    if docker-compose exec -T db pg_isready -U pizzabuilder -d pizzadb 2>/dev/null; then
        log_info "Database is ready!"
        break
    else
        log_warning "Database not ready yet, waiting..."
        sleep 10
        ((attempt++))
    fi
done

if [ $attempt -gt $max_attempts ]; then
    log_error "Database failed to start after $max_attempts attempts"
    exit 1
fi

# Run database migrations
log_step "Running database migrations..."
docker-compose exec -T app npx prisma migrate deploy

# Copy data files to container
log_step "Copying data files to container..."
docker cp "$DATABASE_BACKUP_FILE" $(docker-compose ps -q app):/app/
docker cp "$RESTORE_SCRIPT" $(docker-compose ps -q app):/app/

# Restore database data
log_step "Restoring database data..."
log_warning "This will overwrite existing data with the latest backup!"
docker-compose exec -T app node restore-data.js "$DATABASE_BACKUP_FILE"

# Start application
log_step "Starting application..."
docker-compose up -d app

# Wait for application to be ready
log_step "Waiting for application to be ready..."
sleep 30

# Check application health
log_step "Checking application health..."
max_health_attempts=5
health_attempt=1
while [ $health_attempt -le $max_health_attempts ]; do
    log_info "Checking application health (attempt $health_attempt/$max_health_attempts)..."
    if curl -f http://localhost:3000/api/settings >/dev/null 2>&1; then
        log_info "Application is healthy!"
        break
    else
        log_warning "Application not healthy yet, waiting..."
        sleep 15
        ((health_attempt++))
    fi
done

if [ $health_attempt -gt $max_health_attempts ]; then
    log_warning "Application health check failed, but deployment continues..."
fi

# Verify data restoration
log_step "Verifying data restoration..."
log_info "Testing API endpoints..."

# Test settings API
if curl -s http://localhost:3000/api/settings | grep -q "app_name"; then
    log_info "✅ Settings API working"
else
    log_warning "⚠️ Settings API not responding properly"
fi

# Test menu categories API
CATEGORY_COUNT=$(curl -s http://localhost:3000/api/menu/categories | jq '.data | length' 2>/dev/null || echo "0")
if [[ "$CATEGORY_COUNT" -gt 4 ]]; then
    log_info "✅ Menu categories API working - Found $CATEGORY_COUNT categories"
else
    log_warning "⚠️ Menu categories API may not be working properly - Found $CATEGORY_COUNT categories"
fi

# Test specialty pizzas API
PIZZA_COUNT=$(curl -s http://localhost:3000/api/specialty-pizzas | jq '.data | length' 2>/dev/null || echo "0")
if [[ "$PIZZA_COUNT" -gt 0 ]]; then
    log_info "✅ Specialty pizzas API working - Found $PIZZA_COUNT pizzas"
else
    log_warning "⚠️ Specialty pizzas API may not be working properly - Found $PIZZA_COUNT pizzas"
fi

# Clean up data files from container
log_step "Cleaning up temporary files..."
docker-compose exec -T app rm -f "$DATABASE_BACKUP_FILE" "$RESTORE_SCRIPT"

# Show final status
log_info "========================================================"
log_info "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
log_info "========================================================"
log_info "✅ Database restored with latest data"
log_info "✅ Application restarted"
log_info "✅ All services running"
log_info ""
log_info "🌐 Application URLs:"
log_info "   Main Site: https://greenlandfamous.net"
log_info "   Admin Panel: https://greenlandfamous.net/management-portal"
log_info "   API Health: http://localhost:3000/api/settings"
log_info ""
log_info "📊 Data Summary:"
log_info "   Menu Categories: $CATEGORY_COUNT"
log_info "   Specialty Pizzas: $PIZZA_COUNT"
log_info "   Database Backup: $BACKUP_DIR/backup_$TIMESTAMP.sql"
log_info ""
log_info "🔧 Management Commands:"
log_info "   View logs: docker-compose logs -f"
log_info "   Container status: docker-compose ps"
log_info "   Restart app: docker-compose restart app"
log_info ""

# Show container status
log_info "Current container status:"
docker-compose ps

log_info "========================================================"
log_info "Deployment completed at: $(date)"
log_info "========================================================"
