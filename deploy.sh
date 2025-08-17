#!/bin/bash
# Production deployment script for remote server

echo "🚀 Starting Pizza Builder App Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    if [ -f .env.example ]; then
        cp .env.example .env
        print_warning "Please edit .env with your production values before continuing."
        exit 1
    else
        print_error ".env.example not found. Cannot create .env file."
        exit 1
    fi
fi

print_status "Checking environment variables..."
source .env

# Validate required environment variables
required_vars=("DATABASE_URL" "NEXTAUTH_SECRET" "NEXTAUTH_URL")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_error "Required environment variable $var is not set in .env"
        exit 1
    fi
done

print_status "Environment variables validated ✓"

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down

# Pull latest images
print_status "Pulling latest images..."
docker-compose pull

# Build and start containers
print_status "Building and starting containers..."
docker-compose up -d --build

# Wait for database to be ready
print_status "Waiting for database to be ready..."
timeout=60
while [ $timeout -gt 0 ]; do
    if docker-compose exec -T db pg_isready -U pizzabuilder -d pizzadb &> /dev/null; then
        print_status "Database is ready ✓"
        break
    fi
    sleep 2
    timeout=$((timeout - 2))
done

if [ $timeout -le 0 ]; then
    print_error "Database failed to start within 60 seconds"
    docker-compose logs db
    exit 1
fi

# Run database migrations
print_status "Running database migrations..."
if docker-compose exec -T app npx prisma migrate deploy; then
    print_status "Database migrations completed ✓"
else
    print_error "Database migrations failed"
    docker-compose logs app
    exit 1
fi

# Seed database (optional)
print_status "Seeding database..."
if docker-compose exec -T app npx prisma db seed; then
    print_status "Database seeding completed ✓"
else
    print_warning "Database seeding failed (this might be normal if data already exists)"
fi

# Check health endpoint
print_status "Checking application health..."
sleep 10
if curl -f http://localhost:3000/api/health &> /dev/null; then
    print_status "Application is healthy ✓"
else
    print_warning "Health check failed, checking logs..."
    docker-compose logs app | tail -20
fi

print_status "Deployment complete! 🎉"
print_status "Application should be available at: http://localhost:3000"
print_status "Admin login: http://localhost:3000/admin/login"
print_status ""
print_status "Useful commands:"
print_status "  View logs: docker-compose logs -f"
print_status "  Stop app: docker-compose down"
print_status "  Restart: docker-compose restart"
print_status "  Health check: curl http://localhost:3000/api/health"
