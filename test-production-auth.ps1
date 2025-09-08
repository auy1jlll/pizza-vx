#!/usr/bin/env pwsh

Write-Host "🔐 Testing Production Authentication Fix..." -ForegroundColor Yellow

# Wait for production to be ready
Write-Host "⏳ Waiting for production deployment..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

# Test login
Write-Host "🔑 Testing login..." -ForegroundColor Cyan
try {
    $loginData = @{ 
        username = "auy1jll33@gmail.com"
        password = "admin123" 
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://91.99.194.255:3000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json" -SessionVariable session
    Write-Host "✅ Login successful: $($loginResponse.user.email) - Role: $($loginResponse.user.role)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test auth/me endpoint
Write-Host "👤 Testing auth/me endpoint..." -ForegroundColor Cyan
try {
    $authResponse = Invoke-RestMethod -Uri "http://91.99.194.255:3000/api/auth/me" -Method GET -WebSession $session
    Write-Host "✅ Auth/me working: User $($authResponse.user.email) - Role: $($authResponse.user.role)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Auth/me failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test management portal endpoints
Write-Host "🏪 Testing management portal endpoints..." -ForegroundColor Cyan
try {
    $dashboardResponse = Invoke-RestMethod -Uri "http://91.99.194.255:3000/api/management-portal/dashboard" -Method GET -WebSession $session
    Write-Host "✅ Dashboard API working" -ForegroundColor Green
}
catch {
    Write-Host "❌ Dashboard API failed: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $crustsResponse = Invoke-RestMethod -Uri "http://91.99.194.255:3000/api/admin/crusts" -Method GET -WebSession $session
    Write-Host "✅ Crusts API working: Found $($crustsResponse.data.Count) crusts" -ForegroundColor Green
}
catch {
    Write-Host "❌ Crusts API failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🎉 Authentication tests completed!" -ForegroundColor Magenta
Write-Host "Production URL: http://91.99.194.255:3000" -ForegroundColor White
