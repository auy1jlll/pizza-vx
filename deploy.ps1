# Production deployment script for Windows
# Run with: .\deploy.ps1

Write-Host "🚀 Starting Pizza Builder App Deployment..." -ForegroundColor Green

function Write-Status {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if Docker is installed
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker is not installed. Please install Docker Desktop first."
    exit 1
}

if (!(Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
}

# Check if .env file exists
if (!(Test-Path .env)) {
    Write-Warning ".env file not found. Creating from template..."
    if (Test-Path .env.example) {
        Copy-Item .env.example .env
        Write-Warning "Please edit .env with your production values before continuing."
        exit 1
    } else {
        Write-Error ".env.example not found. Cannot create .env file."
        exit 1
    }
}

Write-Status "Checking environment variables..."

# Validate required environment variables
$envContent = Get-Content .env
$hasDatabase = $envContent | Where-Object { $_ -match "^DATABASE_URL=" -and $_ -notmatch "^DATABASE_URL=$" }
$hasSecret = $envContent | Where-Object { $_ -match "^NEXTAUTH_SECRET=" -and $_ -notmatch "^NEXTAUTH_SECRET=$" }
$hasUrl = $envContent | Where-Object { $_ -match "^NEXTAUTH_URL=" -and $_ -notmatch "^NEXTAUTH_URL=$" }

if (!$hasDatabase) {
    Write-Error "DATABASE_URL is not set in .env"
    exit 1
}
if (!$hasSecret) {
    Write-Error "NEXTAUTH_SECRET is not set in .env"
    exit 1
}
if (!$hasUrl) {
    Write-Error "NEXTAUTH_URL is not set in .env"
    exit 1
}

Write-Status "Environment variables validated ✓"

# Stop existing containers
Write-Status "Stopping existing containers..."
docker-compose down

# Pull latest images
Write-Status "Pulling latest images..."
docker-compose pull

# Build and start containers
Write-Status "Building and starting containers..."
docker-compose up -d --build

# Wait for database to be ready
Write-Status "Waiting for database to be ready..."
$timeout = 60
$ready = $false

while ($timeout -gt 0 -and !$ready) {
    try {
        $result = docker-compose exec -T db pg_isready -U pizzabuilder -d pizzadb 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Database is ready ✓"
            $ready = $true
            break
        }
    } catch {
        # Continue waiting
    }
    Start-Sleep 2
    $timeout -= 2
}

if (!$ready) {
    Write-Error "Database failed to start within 60 seconds"
    docker-compose logs db
    exit 1
}

# Run database migrations
Write-Status "Running database migrations..."
$migrationResult = docker-compose exec -T app npx prisma migrate deploy
if ($LASTEXITCODE -eq 0) {
    Write-Status "Database migrations completed ✓"
} else {
    Write-Error "Database migrations failed"
    docker-compose logs app
    exit 1
}

# Seed database (optional)
Write-Status "Seeding database..."
$seedResult = docker-compose exec -T app npx prisma db seed
if ($LASTEXITCODE -eq 0) {
    Write-Status "Database seeding completed ✓"
} else {
    Write-Warning "Database seeding failed (this might be normal if data already exists)"
}

# Check health endpoint
Write-Status "Checking application health..."
Start-Sleep 10
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Status "Application is healthy ✓"
    } else {
        Write-Warning "Health check returned status: $($response.StatusCode)"
    }
} catch {
    Write-Warning "Health check failed, checking logs..."
    docker-compose logs app | Select-Object -Last 20
}

Write-Status "Deployment complete! 🎉"
Write-Status "Application should be available at: http://localhost:3000"
Write-Status "Admin login: http://localhost:3000/admin/login"
Write-Status ""
Write-Status "Useful commands:"
Write-Status "  View logs: docker-compose logs -f"
Write-Status "  Stop app: docker-compose down"
Write-Status "  Restart: docker-compose restart"
Write-Status "  Health check: Invoke-WebRequest http://localhost:3000/api/health"
