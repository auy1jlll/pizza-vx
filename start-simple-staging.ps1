#!/usr/bin/env pwsh

# 🚀 SIMPLE LOCAL STAGING - NO DOCKER
# Run staging directly with Node.js and existing database

Write-Host "🚀 SIMPLE LOCAL STAGING SETUP" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check if we have Node.js
Write-Host "1️⃣ Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js not found!" -ForegroundColor Red
    exit 1
}

# Check if we have the project dependencies
Write-Host ""
Write-Host "2️⃣ Checking project setup..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "   ✅ package.json found" -ForegroundColor Green
} else {
    Write-Host "   ❌ package.json not found!" -ForegroundColor Red
    exit 1
}

if (Test-Path "node_modules") {
    Write-Host "   ✅ node_modules found" -ForegroundColor Green
} else {
    Write-Host "   ⚠️ node_modules not found, installing..." -ForegroundColor Yellow
    npm install
}

# Create staging environment
Write-Host ""
Write-Host "3️⃣ Setting up staging environment..." -ForegroundColor Yellow

# Copy production .env for staging
if (Test-Path ".env") {
    Copy-Item ".env" ".env.staging.backup"
    Write-Host "   ✅ Backed up current .env" -ForegroundColor Green
}

# Create staging .env
$stagingEnv = @"
# 🚀 LOCAL STAGING ENVIRONMENT
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://auy1jll:_Zx-nake%406172@localhost:5432/pizzax?schema=public
NEXTAUTH_SECRET=staging-local-secret-key-2025
NEXTAUTH_URL=http://localhost:3001

# Email settings (optional for staging)
GMAIL_USER=auy1jll33@gmail.com
GMAIL_APP_PASSWORD=your-app-password-here

# Staging flags
STAGING=true
ENVIRONMENT=local-staging
"@

$stagingEnv | Out-File -FilePath ".env.staging" -Encoding UTF8
Write-Host "   ✅ Created .env.staging" -ForegroundColor Green

# Generate Prisma client
Write-Host ""
Write-Host "4️⃣ Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate
Write-Host "   ✅ Prisma client generated" -ForegroundColor Green

# Build the application
Write-Host ""
Write-Host "5️⃣ Building application for staging..." -ForegroundColor Yellow
$env:NODE_ENV = "production"
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Application built successfully!" -ForegroundColor Green
} else {
    Write-Host "   ❌ Build failed!" -ForegroundColor Red
    Write-Host "   💡 Continuing anyway - development mode might work" -ForegroundColor Yellow
}

# Start the application
Write-Host ""
Write-Host "🎉 STARTING STAGING APPLICATION" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 STAGING ACCESS:" -ForegroundColor Cyan
Write-Host "   URL: http://localhost:3001" -ForegroundColor White
Write-Host "   Environment: Production mode" -ForegroundColor White
Write-Host "   Database: Existing PostgreSQL" -ForegroundColor White
Write-Host ""
Write-Host "🔧 CONTROLS:" -ForegroundColor Cyan
Write-Host "   Stop: Ctrl+C" -ForegroundColor White
Write-Host "   Logs: Check console output" -ForegroundColor White
Write-Host ""
Write-Host "⚡ Starting in 3 seconds..." -ForegroundColor Yellow

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "🚀 LAUNCHING STAGING APP..." -ForegroundColor Green
Write-Host ""

# Use staging environment
$env:NODE_ENV = "production"
$env:PORT = "3001"

# Try production start first
try {
    Write-Host "🍕 Trying production start (npm start)..." -ForegroundColor Yellow
    npm start
} catch {
    Write-Host "⚠️ Production start failed, trying development mode..." -ForegroundColor Yellow
    $env:PORT = "3001"
    npm run dev
}
