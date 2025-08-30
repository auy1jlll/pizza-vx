#!/usr/bin/env pwsh

# Docker Deployment Script for Pizza App
# This script will deploy your application with Docker while preserving all data

param(
    [string]$Environment = "production",
    [switch]$SkipBackup,
    [switch]$RestoreData,
    [switch]$Help
)

if ($Help) {
    Write-Host @"
Docker Deployment Script for Pizza App

Usage: .\deploy-docker.ps1 [options]

Options:
  -Environment   Target environment (production/staging) [default: production]
  -SkipBackup    Skip creating a new backup before deployment
  -RestoreData   Restore data from backup after database is ready
  -Help          Show this help message

Examples:
  .\deploy-docker.ps1                    # Standard production deployment
  .\deploy-docker.ps1 -RestoreData       # Deploy and restore data
  .\deploy-docker.ps1 -SkipBackup        # Deploy without creating new backup
"@
    exit 0
}

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Docker deployment for Pizza App..." -ForegroundColor Cyan
Write-Host "📋 Environment: $Environment" -ForegroundColor Yellow

# Check if Docker is running
try {
    docker version | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check if docker-compose is available
try {
    docker compose version | Out-Null
    Write-Host "✅ Docker Compose is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not available. Please install Docker Compose." -ForegroundColor Red
    exit 1
}

# Create backup unless skipped
if (-not $SkipBackup) {
    Write-Host "💾 Creating backup before deployment..." -ForegroundColor Yellow
    try {
        node create-full-backup.js
        Write-Host "✅ Backup created successfully" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Backup failed, but continuing with deployment..." -ForegroundColor Yellow
    }
}

# Check if .env.docker exists
if (-not (Test-Path ".env.docker")) {
    Write-Host "📝 Creating .env.docker from example..." -ForegroundColor Yellow
    Copy-Item ".env.docker.example" ".env.docker"
    Write-Host "⚠️  Please edit .env.docker with your actual values before proceeding!" -ForegroundColor Red
    Write-Host "   Required values: POSTGRES_PASSWORD, NEXTAUTH_SECRET" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

# Stop existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker compose -f docker-compose.production.yml --env-file .env.docker down --remove-orphans

# Pull latest images
Write-Host "📥 Pulling latest images..." -ForegroundColor Yellow
docker compose -f docker-compose.production.yml --env-file .env.docker pull

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor Yellow
docker compose -f docker-compose.production.yml --env-file .env.docker build app

# Start the services
Write-Host "🚀 Starting services..." -ForegroundColor Yellow
docker compose -f docker-compose.production.yml --env-file .env.docker up -d

# Wait for database to be ready
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0

do {
    $attempt++
    Start-Sleep 2
    $dbReady = docker compose -f docker-compose.production.yml --env-file .env.docker exec -T db pg_isready -U pizzauser 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database is ready!" -ForegroundColor Green
        break
    }
    Write-Host "   Attempt $attempt/$maxAttempts..." -ForegroundColor Gray
} while ($attempt -lt $maxAttempts)

if ($attempt -eq $maxAttempts) {
    Write-Host "❌ Database failed to start within timeout" -ForegroundColor Red
    exit 1
}

# Run Prisma migrations
Write-Host "🔄 Running database migrations..." -ForegroundColor Yellow
docker compose -f docker-compose.production.yml --env-file .env.docker exec app npx prisma migrate deploy

# Generate Prisma client
Write-Host "🔄 Generating Prisma client..." -ForegroundColor Yellow
docker compose -f docker-compose.production.yml --env-file .env.docker exec app npx prisma generate

# Restore data if requested
if ($RestoreData) {
    Write-Host "📥 Restoring database from backup..." -ForegroundColor Yellow
    
    # Copy backup files to container
    $backupFiles = Get-ChildItem -Name "complete-backup-*.json" | Sort-Object -Descending | Select-Object -First 1
    if ($backupFiles) {
        docker compose -f docker-compose.production.yml --env-file .env.docker exec app mkdir -p /tmp/backup
        docker cp $backupFiles "$(docker compose -f docker-compose.production.yml --env-file .env.docker ps -q app):/tmp/backup/"
        docker cp "restore-database.js" "$(docker compose -f docker-compose.production.yml --env-file .env.docker ps -q app):/tmp/backup/"
        
        # Run restoration
        docker compose -f docker-compose.production.yml --env-file .env.docker exec -w /tmp/backup app node restore-database.js
        Write-Host "✅ Data restoration completed!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  No backup files found for restoration" -ForegroundColor Yellow
    }
}

# Wait for application to be ready
Write-Host "⏳ Waiting for application to be ready..." -ForegroundColor Yellow
$maxAttempts = 20
$attempt = 0

do {
    $attempt++
    Start-Sleep 3
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Application is ready!" -ForegroundColor Green
            break
        }
    } catch {
        # Continue trying
    }
    Write-Host "   Attempt $attempt/$maxAttempts..." -ForegroundColor Gray
} while ($attempt -lt $maxAttempts)

# Show deployment status
Write-Host "📊 Deployment Status:" -ForegroundColor Cyan
docker compose -f docker-compose.production.yml --env-file .env.docker ps

Write-Host ""
Write-Host "🎉 Docker deployment completed!" -ForegroundColor Green
Write-Host "🌐 Application URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🗄️  Database: PostgreSQL running in container" -ForegroundColor Cyan

Write-Host ""
Write-Host "📝 Useful commands:" -ForegroundColor Yellow
Write-Host "  View logs:     docker compose -f docker-compose.production.yml --env-file .env.docker logs -f" -ForegroundColor Gray
Write-Host "  Stop services: docker compose -f docker-compose.production.yml --env-file .env.docker down" -ForegroundColor Gray
Write-Host "  Restart:       docker compose -f docker-compose.production.yml --env-file .env.docker restart" -ForegroundColor Gray
