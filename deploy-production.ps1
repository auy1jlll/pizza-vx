#!/usr/bin/env pwsh

# Simple Production Deployment Script
# Builds the application for production and prepares deployment package

param(
    [switch]$BuildOnly,
    [switch]$Help
)

if ($Help) {
    Write-Host @"
Simple Production Deployment Script

Usage: .\deploy-production.ps1 [options]

Options:
  -BuildOnly     Only build the application, don't create deployment package
  -Help          Show this help message

This script will:
1. Create a backup of current data
2. Build the production application
3. Create a deployment package ready for server
"@
    exit 0
}

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting production build process..." -ForegroundColor Cyan

# Create backup
Write-Host "💾 Creating data backup..." -ForegroundColor Yellow
try {
    node create-full-backup.js
    Write-Host "✅ Backup created successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backup failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Install dependencies
Write-Host "📦 Installing production dependencies..." -ForegroundColor Yellow
npm ci --only=production

# Generate Prisma client
Write-Host "🔄 Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Build the application
Write-Host "🔨 Building production application..." -ForegroundColor Yellow
npm run build

if ($BuildOnly) {
    Write-Host "✅ Production build completed!" -ForegroundColor Green
    exit 0
}

# Create deployment package
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow

$deploymentDir = "deployment-package-$(Get-Date -Format 'yyyy-MM-dd-HH-mm-ss')"
New-Item -ItemType Directory -Path $deploymentDir -Force | Out-Null

# Copy essential files
Write-Host "   Copying application files..." -ForegroundColor Gray
Copy-Item -Path ".next" -Destination "$deploymentDir\.next" -Recurse -Force
Copy-Item -Path "public" -Destination "$deploymentDir\public" -Recurse -Force
Copy-Item -Path "src" -Destination "$deploymentDir\src" -Recurse -Force
Copy-Item -Path "prisma" -Destination "$deploymentDir\prisma" -Recurse -Force
Copy-Item -Path "package.json" -Destination "$deploymentDir\package.json" -Force
Copy-Item -Path "package-lock.json" -Destination "$deploymentDir\package-lock.json" -Force
Copy-Item -Path "next.config.ts" -Destination "$deploymentDir\next.config.ts" -Force
Copy-Item -Path "postcss.config.mjs" -Destination "$deploymentDir\postcss.config.mjs" -Force
Copy-Item -Path "tailwind.config.ts" -Destination "$deploymentDir\tailwind.config.ts" -Force

# Copy backup files
Write-Host "   Copying backup files..." -ForegroundColor Gray
Get-ChildItem -Name "complete-backup-*.json" | ForEach-Object {
    Copy-Item -Path $_ -Destination "$deploymentDir\$_" -Force
}
Copy-Item -Path "restore-database.js" -Destination "$deploymentDir\restore-database.js" -Force

# Copy deployment scripts
Write-Host "   Copying deployment scripts..." -ForegroundColor Gray
Copy-Item -Path "deploy.ps1" -Destination "$deploymentDir\deploy.ps1" -Force -ErrorAction SilentlyContinue
Copy-Item -Path "deploy.sh" -Destination "$deploymentDir\deploy.sh" -Force -ErrorAction SilentlyContinue
Copy-Item -Path "deploy-simple.ps1" -Destination "$deploymentDir\deploy-simple.ps1" -Force -ErrorAction SilentlyContinue

# Create environment template
Write-Host "   Creating environment template..." -ForegroundColor Gray
@"
# Production Environment Variables
NODE_ENV=production
DATABASE_URL=postgresql://username:password@localhost:5432/pizzadb

# Gmail Configuration (working from development)
GMAIL_USER=auy1jlll@gmail.com
GMAIL_APP_PASSWORD=zguprmufgfkrerzc

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-nextauth-key-min-32-chars-long
NEXTAUTH_URL=https://greenlandfamous.net

# JWT Secret
JWT_SECRET=your-jwt-secret-for-token-signing

# Application Settings
NEXT_PUBLIC_APP_URL=https://greenlandfamous.net
"@ | Out-File -FilePath "$deploymentDir\.env.production" -Encoding UTF8

# Create deployment README
Write-Host "   Creating deployment instructions..." -ForegroundColor Gray
@"
# Production Deployment Package

This package contains everything needed to deploy the Pizza App to production.

## Files Included:
- Built Next.js application (.next directory)
- Source code and assets
- Database schema (prisma directory)
- Data backup files (complete-backup-*.json)
- Database restoration script (restore-database.js)
- Deployment scripts

## Deployment Steps:

1. Upload this entire directory to your production server
2. Edit .env.production with your production database credentials
3. Install Node.js 18+ and PostgreSQL on the server
4. Run the deployment script:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

## Manual Deployment:

1. Install dependencies:
   ```bash
   npm ci --only=production
   ```

2. Set up database:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

3. Restore data (optional):
   ```bash
   node restore-database.js
   ```

4. Start the application:
   ```bash
   npm start
   ```

## Environment Variables:
Make sure to configure these in .env.production:
- DATABASE_URL: Your PostgreSQL connection string
- NEXTAUTH_SECRET: A secure random string (min 32 characters)
- NEXTAUTH_URL: Your production domain
- GMAIL_USER: Email for notifications (already configured)
- GMAIL_APP_PASSWORD: Gmail app password (already configured)

## Database:
- The backup files contain all your existing data
- Use restore-database.js to populate a fresh database
- Current backup contains: users, orders, menu items, settings

Generated on: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
"@ | Out-File -FilePath "$deploymentDir\README.md" -Encoding UTF8

# Create compressed archive
Write-Host "📦 Creating compressed archive..." -ForegroundColor Yellow
$archiveName = "$deploymentDir.zip"
Compress-Archive -Path $deploymentDir -DestinationPath $archiveName -Force

Write-Host ""
Write-Host "🎉 Deployment package created successfully!" -ForegroundColor Green
Write-Host "📁 Package directory: $deploymentDir" -ForegroundColor Cyan
Write-Host "📦 Archive file: $archiveName" -ForegroundColor Cyan

Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Upload $archiveName to your production server" -ForegroundColor Gray
Write-Host "2. Extract the archive" -ForegroundColor Gray
Write-Host "3. Edit .env.production with your database credentials" -ForegroundColor Gray
Write-Host "4. Run the deployment script on the server" -ForegroundColor Gray

Write-Host ""
Write-Host "🗂️  Package contains:" -ForegroundColor Yellow
Get-ChildItem $deploymentDir | ForEach-Object {
    Write-Host "   $($_.Name)" -ForegroundColor Gray
}
