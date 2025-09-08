#!/usr/bin/env pwsh

Write-Host "🍕 Checking Pizza Production App Status..." -ForegroundColor Yellow

# Test web application
try {
    Write-Host "Testing web application at http://91.99.194.255:3000..." -ForegroundColor Cyan
    $response = Invoke-WebRequest -Uri "http://91.99.194.255:3000" -Method GET -TimeoutSec 15
    Write-Host "✅ SUCCESS! Web App is LIVE!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Application is accessible at: http://91.99.194.255:3000" -ForegroundColor Green
}
catch {
    Write-Host "❌ Web app not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Check API endpoint
try {
    Write-Host "`nTesting API endpoint..." -ForegroundColor Cyan
    $apiResponse = Invoke-WebRequest -Uri "http://91.99.194.255:3000/api/specialty-pizzas" -TimeoutSec 10
    Write-Host "✅ API is working!" -ForegroundColor Green
    Write-Host "API Status: $($apiResponse.StatusCode)" -ForegroundColor Green
}
catch {
    Write-Host "❌ API not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🔍 Checking server containers..." -ForegroundColor Yellow
try {
    $sshCommand = "ssh -o StrictHostKeyChecking=no -i `"$env:USERPROFILE\Documents\Keys\hetzner.key`" root@91.99.194.255 `"docker ps -a`""
    $containerStatus = Invoke-Expression $sshCommand
    Write-Host "Container Status:" -ForegroundColor Cyan
    Write-Host $containerStatus
}
catch {
    Write-Host "❌ Could not check containers: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n📊 Final Status Report:" -ForegroundColor Magenta
Write-Host "If you see '✅ SUCCESS!' above, your complete pizza app with database is running!" -ForegroundColor Green
Write-Host "Access your app at: http://91.99.194.255:3000" -ForegroundColor White
