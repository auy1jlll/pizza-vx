# Production deployment script with database restoration
# Run this on your production server

echo "🚀 Starting Pizza Builder App Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if we're running as root or with sudo
if [[ $EUID -eq 0 ]]; then
   log_error "This script should not be run as root"
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

log_info "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

log_info "Removing old containers and images..."
docker system prune -f
docker image prune -f

log_info "Building new application image..."
docker-compose -f docker-compose.prod.yml build --no-cache

log_info "Starting database..."
docker-compose -f docker-compose.prod.yml up -d db

log_info "Waiting for database to be ready..."
sleep 30

# Check if database is ready
max_attempts=10
attempt=1
while [ $attempt -le $max_attempts ]; do
    log_info "Checking database connection (attempt $attempt/$max_attempts)..."
    if docker-compose -f docker-compose.prod.yml exec -T db pg_isready -U pizzabuilder -d pizzadb; then
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

log_info "Running database migrations..."
docker-compose -f docker-compose.prod.yml exec -T app npx prisma migrate deploy

log_info "Starting application..."
docker-compose -f docker-compose.prod.yml up -d app

log_info "Waiting for application to be ready..."
sleep 30

log_info "Checking application health..."
max_health_attempts=5
health_attempt=1
while [ $health_attempt -le $max_health_attempts ]; do
    log_info "Checking application health (attempt $health_attempt/$max_health_attempts)..."
    if curl -f http://localhost:8000/api/health; then
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

log_info "Deployment completed successfully!"
log_info "Application should be available at: https://greenlandfamous.net"
log_info "Admin panel: https://greenlandfamous.net/management-portal"

# Show container status
log_info "Container status:"
docker-compose -f docker-compose.prod.yml ps

log_info "To view logs, run: docker-compose -f docker-compose.prod.yml logs -f"
