#!/usr/bin/env pwsh
# Clear Cache Script for Next.js Development

Write-Host "🧹 Clearing all Next.js caches..." -ForegroundColor Yellow

# Kill any running Node processes
Write-Host "🔄 Stopping Node processes..." -ForegroundColor Blue
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Clear Next.js build cache
Write-Host "🗑️  Clearing .next directory..." -ForegroundColor Blue
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue

# Clear Node modules cache
Write-Host "🗑️  Clearing node_modules cache..." -ForegroundColor Blue
Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue

# Clear npm cache (if using npm)
Write-Host "🗑️  Clearing npm cache..." -ForegroundColor Blue
npm cache clean --force 2>$null

# Clear TypeScript build info
Write-Host "🗑️  Clearing TypeScript build info..." -ForegroundColor Blue
Remove-Item -Path "tsconfig.tsbuildinfo" -Force -ErrorAction SilentlyContinue

# Clear any temporary files
Write-Host "🗑️  Clearing temporary files..." -ForegroundColor Blue
Remove-Item -Path "*.log" -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".eslintcache" -Force -ErrorAction SilentlyContinue

Write-Host "✅ Cache clearing complete!" -ForegroundColor Green
Write-Host "🚀 You can now run 'npm run dev' for a fresh start" -ForegroundColor Cyan
