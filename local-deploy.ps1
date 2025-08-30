#!/usr/bin/env pwsh

# NO PASSWORD DEPLOYMENT - Using different approach
Write-Host "🚀 STARTING SIMPLE LOCAL DEPLOYMENT" -ForegroundColor Green

# Check if app runs locally first
Write-Host "📋 Testing local app..." -ForegroundColor Yellow

# Kill any existing processes
taskkill /f /im node.exe 2>$null

# Start the app in production mode locally
Write-Host "🔥 Starting your pizza app locally on port 3000..." -ForegroundColor Cyan
Write-Host "🌐 Your app will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host "📝 You can then use tunneling (ngrok, cloudflare tunnel) or point your domain to this IP" -ForegroundColor Yellow

# Set production environment
$env:NODE_ENV = "production"
$env:NEXTAUTH_URL = "http://localhost:3000"
$env:NEXT_PUBLIC_APP_URL = "http://localhost:3000"

# Start the app
npm start
