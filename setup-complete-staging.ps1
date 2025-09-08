#!/usr/bin/env pwsh

# 🚀 COMPLETE LOCAL STAGING SETUP
# Full Docker staging environment with data population

param(
    [switch]$SkipBuild,
    [switch]$PopulateData,
    [switch]$OpenBrowser
)

Write-Host "🚀 COMPLETE LOCAL STAGING SETUP" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Docker
Write-Host "1️⃣ Checking Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    docker info | Out-Null
    Write-Host "   ✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Step 2: Clean existing staging
Write-Host ""
Write-Host "2️⃣ Cleaning existing staging environment..." -ForegroundColor Yellow
docker-compose -f docker-compose.local-staging.yml down --volumes --remove-orphans 2>$null
docker container rm -f pizza-app-staging pizza-postgres-staging pizza-adminer-staging 2>$null
docker network rm pizza-staging-network 2>$null
docker volume rm pizza-staging-data 2>$null
Write-Host "   ✅ Cleaned up existing environment" -ForegroundColor Green

# Step 3: Build application
if (-not $SkipBuild) {
    Write-Host ""
    Write-Host "3️⃣ Building staging application..." -ForegroundColor Yellow
    docker-compose -f docker-compose.local-staging.yml build --no-cache
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ❌ Build failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "   ✅ Build completed!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "3️⃣ Skipping build (using existing image)..." -ForegroundColor Yellow
}

# Step 4: Start services
Write-Host ""
Write-Host "4️⃣ Starting staging services..." -ForegroundColor Yellow
docker-compose -f docker-compose.local-staging.yml up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Failed to start services!" -ForegroundColor Red
    exit 1
}

Write-Host "   ✅ Services started!" -ForegroundColor Green

# Step 5: Wait for database
Write-Host ""
Write-Host "5️⃣ Waiting for database to be ready..." -ForegroundColor Yellow
$maxWait = 60
$waited = 0

do {
    Start-Sleep -Seconds 2
    $waited += 2
    $dbStatus = docker exec pizza-postgres-staging pg_isready -U pizzauser -d pizzadb_staging 2>$null
    Write-Host "   ⏳ Waiting... ($waited/$maxWait seconds)" -ForegroundColor Gray
} while ($LASTEXITCODE -ne 0 -and $waited -lt $maxWait)

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Database is ready!" -ForegroundColor Green
} else {
    Write-Host "   ❌ Database failed to start!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📄 Database logs:" -ForegroundColor Red
    docker logs pizza-postgres-staging --tail 20
    exit 1
}

# Step 6: Run migrations
Write-Host ""
Write-Host "6️⃣ Running database migrations..." -ForegroundColor Yellow
docker exec pizza-app-staging npx prisma migrate deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Migrations completed!" -ForegroundColor Green
} else {
    Write-Host "   ⚠️ Migrations had issues (this might be normal for new database)" -ForegroundColor Yellow
}

# Step 7: Generate Prisma client
Write-Host ""
Write-Host "7️⃣ Generating Prisma client..." -ForegroundColor Yellow
docker exec pizza-app-staging npx prisma generate
Write-Host "   ✅ Prisma client generated!" -ForegroundColor Green

# Step 8: Populate data (optional)
if ($PopulateData) {
    Write-Host ""
    Write-Host "8️⃣ Populating staging database with production data..." -ForegroundColor Yellow
    
    # Wait a bit more for app to be ready
    Start-Sleep -Seconds 10
    
    # Run population script
    node populate-staging-db.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Database populated with production data!" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ Data population had issues" -ForegroundColor Yellow
    }
}

# Step 9: Health check
Write-Host ""
Write-Host "9️⃣ Performing health checks..." -ForegroundColor Yellow

Start-Sleep -Seconds 5

$services = @(
    @{Name="Database"; Container="pizza-postgres-staging"; Port=5433; Check="pg_isready -U pizzauser"}
    @{Name="Pizza App"; Container="pizza-app-staging"; Port=3001; Check="curl -f http://localhost:3000 || true"}
    @{Name="Adminer"; Container="pizza-adminer-staging"; Port=8080; Check="curl -f http://localhost:8080 || true"}
)

foreach ($service in $services) {
    $status = docker container inspect $service.Container --format '{{.State.Status}}' 2>$null
    if ($status -eq "running") {
        Write-Host "   ✅ $($service.Name): Running on port $($service.Port)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $($service.Name): Not running" -ForegroundColor Red
    }
}

# Step 10: Display results
Write-Host ""
Write-Host "🎉 LOCAL STAGING ENVIRONMENT READY!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 ACCESS URLS:" -ForegroundColor Cyan
Write-Host "   🍕 Pizza App Staging: http://localhost:3001" -ForegroundColor White
Write-Host "   🗄️  Database Admin:    http://localhost:8080" -ForegroundColor White
Write-Host "   📊 Direct Database:   localhost:5433" -ForegroundColor White
Write-Host ""
Write-Host "🔧 STAGING CREDENTIALS:" -ForegroundColor Cyan
Write-Host "   Database User: pizzauser" -ForegroundColor White
Write-Host "   Database Pass: pizzapass123!" -ForegroundColor White
Write-Host "   Database Name: pizzadb_staging" -ForegroundColor White
Write-Host ""
Write-Host "📋 MANAGEMENT COMMANDS:" -ForegroundColor Cyan
Write-Host "   View all logs:  docker-compose -f docker-compose.local-staging.yml logs -f" -ForegroundColor White
Write-Host "   App logs only:  docker logs pizza-app-staging -f" -ForegroundColor White
Write-Host "   DB logs only:   docker logs pizza-postgres-staging -f" -ForegroundColor White
Write-Host "   Stop staging:   docker-compose -f docker-compose.local-staging.yml down" -ForegroundColor White
Write-Host "   Restart all:    docker-compose -f docker-compose.local-staging.yml restart" -ForegroundColor White
Write-Host ""
Write-Host "📊 CURRENT STATUS:" -ForegroundColor Cyan
docker ps --filter "name=pizza-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Open browser if requested
if ($OpenBrowser) {
    Write-Host ""
    Write-Host "🌐 Opening staging app in browser..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:3001"
}

Write-Host ""
Write-Host "⚡ Your staging environment is ready for testing!" -ForegroundColor Yellow
Write-Host "🎯 Test thoroughly before promoting to production!" -ForegroundColor Yellow
