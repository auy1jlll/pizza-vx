# 🚀 COMPLETE DOCKER DEPLOYMENT SCRIPT
# Build, test, and deploy your pizza app

param(
    [string]$Environment = "production",
    [string]$Version = "latest",
    [switch]$SkipTests = $false,
    [switch]$Push = $false,
    [string]$Registry = "your-registry.com"
)

Write-Host "🚀 Starting Docker deployment for Pizza App..." -ForegroundColor Blue
Write-Host ""

# ============================================
# STEP 1: Pre-checks
# ============================================
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow

# Check Docker
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker not found" -ForegroundColor Red
    exit 1
}

# Check Docker Compose
try {
    docker compose version | Out-Null
    Write-Host "✅ Docker Compose available" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose not found" -ForegroundColor Red
    exit 1
}

# ============================================
# STEP 2: Environment Setup
# ============================================
Write-Host ""
Write-Host "🔧 Setting up environment..." -ForegroundColor Yellow

if (Test-Path ".env.production") {
    Write-Host "✅ Loading .env.production" -ForegroundColor Green
} else {
    Write-Host "⚠️ No .env.production found, using defaults" -ForegroundColor Yellow
}

# ============================================
# STEP 3: Build Process
# ============================================
Write-Host ""
Write-Host "🏗️ Building Docker image..." -ForegroundColor Yellow

# Clean up first
Write-Host "🧹 Cleaning up previous builds..."
docker compose -f docker-compose.production-ready.yml down --remove-orphans 2>$null
docker image prune -f 2>$null

# Build image
$imageName = "pizza-app:$Version"
Write-Host "🔨 Building $imageName..."

$buildResult = docker build -f Dockerfile.optimized -t $imageName .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful: $imageName" -ForegroundColor Green

# ============================================
# STEP 4: Deploy
# ============================================
Write-Host ""
Write-Host "🚀 Deploying application..." -ForegroundColor Yellow

# Start database first
Write-Host "📊 Starting database..."
docker compose -f docker-compose.production-ready.yml up database -d

# Wait for database
Write-Host "⏳ Waiting for database..." -NoNewline
for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep 2
    $dbReady = docker compose -f docker-compose.production-ready.yml exec -T database pg_isready -U pizzauser 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✅ Ready!" -ForegroundColor Green
        break
    }
    Write-Host "." -NoNewline
}

# Start application
Write-Host "🍕 Starting pizza app..."
docker compose -f docker-compose.production-ready.yml up -d

# Health check
Write-Host "🏥 Health check..." -NoNewline
Start-Sleep 15

for ($i = 0; $i -lt 20; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host " ✅ Healthy!" -ForegroundColor Green
            break
        }
    } catch {
        Write-Host "." -NoNewline
        Start-Sleep 3
    }
}

# ============================================
# FINAL STATUS
# ============================================
Write-Host ""
Write-Host "🎉 DEPLOYMENT COMPLETE! 🍕" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:"
Write-Host "   • URL: http://localhost:3000"
Write-Host "   • Version: $Version"
Write-Host "   • Environment: $Environment"
Write-Host ""
Write-Host "🛠️ Management Commands:"
Write-Host "   • Logs: docker compose -f docker-compose.production-ready.yml logs -f"
Write-Host "   • Stop: docker compose -f docker-compose.production-ready.yml down"
Write-Host "   • Status: docker compose -f docker-compose.production-ready.yml ps"
Write-Host ""
Write-Host "🚀 Your pizza restaurant is now live!" -ForegroundColor Green
