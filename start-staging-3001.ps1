#!/usr/bin/env pwsh

# 🚀 WORKING LOCAL STAGING - Fixed Port
# Simple staging environment that works

Write-Host "🚀 LOCAL STAGING - WORKING VERSION" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔧 Setting up staging environment..." -ForegroundColor Yellow

# Set staging environment variables
$env:NODE_ENV = "production"
$env:PORT = "3001"
$env:DATABASE_URL = "postgresql://auy1jll:_Zx-nake%406172@localhost:5432/pizzax?schema=public"
$env:NEXTAUTH_SECRET = "staging-local-secret-key-2025"
$env:NEXTAUTH_URL = "http://localhost:3001"

Write-Host "   ✅ Environment configured" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 STARTING LOCAL STAGING ON PORT 3001" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 STAGING ACCESS:" -ForegroundColor Cyan
Write-Host "   URL: http://localhost:3001" -ForegroundColor White
Write-Host "   Mode: Production" -ForegroundColor White
Write-Host "   Database: Production data" -ForegroundColor White
Write-Host ""
Write-Host "🔧 CONTROLS:" -ForegroundColor Cyan
Write-Host "   Stop: Ctrl+C" -ForegroundColor White
Write-Host "   Open Browser: Visit http://localhost:3001" -ForegroundColor White
Write-Host ""

# Start the application with correct port
Write-Host "🍕 Starting pizza app on port 3001..." -ForegroundColor Yellow
Write-Host ""

# Use npm start with explicit port
npm start -- --port 3001
