#!/usr/bin/env pwsh

# 🚀 LOCAL STAGING STARTUP SCRIPT
# Complete Docker staging environment with database

Write-Host "🚀 PIZZA APP - LOCAL STAGING ENVIRONMENT" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "🔍 Checking Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    Write-Host "   1. Open Docker Desktop" -ForegroundColor Yellow
    Write-Host "   2. Wait for Docker to start" -ForegroundColor Yellow
    Write-Host "   3. Run this script again" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🧹 Cleaning up any existing staging containers..." -ForegroundColor Yellow

# Stop and remove existing staging containers
docker-compose -f docker-compose.local-staging.yml down --remove-orphans 2>$null
docker container rm -f pizza-app-staging pizza-postgres-staging pizza-adminer-staging 2>$null
docker network rm pizza-staging-network 2>$null

Write-Host ""
Write-Host "🏗️ Building staging application..." -ForegroundColor Yellow

# Build the application with staging configuration
docker-compose -f docker-compose.local-staging.yml build --no-cache pizza-app-staging

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Check the output above." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Starting staging environment..." -ForegroundColor Yellow

# Start the staging environment
docker-compose -f docker-compose.local-staging.yml up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start staging environment!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check service health
Write-Host ""
Write-Host "🔍 Checking service status..." -ForegroundColor Yellow

$services = @(
    @{Name="Database"; Container="pizza-postgres-staging"; Port=5433}
    @{Name="Pizza App"; Container="pizza-app-staging"; Port=3001}
    @{Name="Adminer"; Container="pizza-adminer-staging"; Port=8080}
)

foreach ($service in $services) {
    $status = docker container inspect $service.Container --format '{{.State.Status}}' 2>$null
    if ($status -eq "running") {
        Write-Host "   ✅ $($service.Name): Running on port $($service.Port)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $($service.Name): Not running" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📊 Container Logs (last 10 lines):" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "📄 Database Logs:" -ForegroundColor Yellow
docker logs pizza-postgres-staging --tail 5 2>$null

Write-Host ""
Write-Host "📄 App Logs:" -ForegroundColor Yellow
docker logs pizza-app-staging --tail 10 2>$null

Write-Host ""
Write-Host "🎉 LOCAL STAGING ENVIRONMENT READY!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 STAGING ACCESS URLS:" -ForegroundColor Cyan
Write-Host "   🍕 Pizza App:      http://localhost:3001" -ForegroundColor White
Write-Host "   🗄️  Database Admin: http://localhost:8080" -ForegroundColor White
Write-Host "   📊 Database:       localhost:5433" -ForegroundColor White
Write-Host ""
Write-Host "🔧 STAGING CREDENTIALS:" -ForegroundColor Cyan
Write-Host "   Database: pizzauser / pizzapass123!" -ForegroundColor White
Write-Host "   DB Name:  pizzadb_staging" -ForegroundColor White
Write-Host ""
Write-Host "📋 USEFUL COMMANDS:" -ForegroundColor Cyan
Write-Host "   View logs:    docker-compose -f docker-compose.local-staging.yml logs -f" -ForegroundColor White
Write-Host "   Stop all:     docker-compose -f docker-compose.local-staging.yml down" -ForegroundColor White
Write-Host "   Restart:      docker-compose -f docker-compose.local-staging.yml restart" -ForegroundColor White
Write-Host ""
Write-Host "⚡ Ready to test your pizza app in staging!" -ForegroundColor Yellow

# Optional: Open browser
$openBrowser = Read-Host "Open staging app in browser? (y/n)"
if ($openBrowser -eq "y" -or $openBrowser -eq "Y") {
    Start-Process "http://localhost:3001"
}
