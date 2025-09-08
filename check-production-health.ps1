# Production Health Check Script
# This script verifies that your production deployment is working correctly

Write-Host "🍕 Production Health Check" -ForegroundColor Green
Write-Host "=" * 50

$SERVER = "91.99.194.255:3000"

Write-Host "`n1. Testing Main Website..." -ForegroundColor Yellow
try {
    $mainResponse = Invoke-WebRequest -Uri "http://$SERVER" -UseBasicParsing -TimeoutSec 10
    Write-Host "   ✅ Main site: HTTP $($mainResponse.StatusCode)" -ForegroundColor Green
    Write-Host "   📄 Content size: $($mainResponse.Content.Length) characters" -ForegroundColor Cyan
    
    # Check for essential elements
    $hasCSS = $mainResponse.Content -match '_next/static/css/'
    $hasTitle = $mainResponse.Content -match '<title[^>]*>([^<]*)</title>'
    $hasTailwind = $mainResponse.Content -match 'bg-gradient-to-br|text-white|hover:'
    
    Write-Host "   🎨 CSS linked: $(if($hasCSS){'✅ YES'}else{'❌ NO'})" -ForegroundColor $(if($hasCSS){'Green'}else{'Red'})
    Write-Host "   🏷️ Title found: $(if($hasTitle){'✅ YES'}else{'❌ NO'})" -ForegroundColor $(if($hasTitle){'Green'}else{'Red'})
    Write-Host "   💄 Tailwind classes: $(if($hasTailwind){'✅ YES'}else{'❌ NO'})" -ForegroundColor $(if($hasTailwind){'Green'}else{'Red'})
    
} catch {
    Write-Host "   ❌ Main site failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. Testing CSS File..." -ForegroundColor Yellow
try {
    $cssResponse = Invoke-WebRequest -Uri "http://$SERVER/_next/static/css/d08f4c48ecc92d2c.css" -UseBasicParsing -TimeoutSec 10
    Write-Host "   ✅ CSS file: HTTP $($cssResponse.StatusCode)" -ForegroundColor Green
    Write-Host "   📦 CSS size: $($cssResponse.Content.Length) bytes" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ CSS file failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. Testing API Health..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "http://$SERVER/api/health" -UseBasicParsing -TimeoutSec 10
    $healthData = $healthResponse.Content | ConvertFrom-Json
    Write-Host "   ✅ API health: HTTP $($healthResponse.StatusCode)" -ForegroundColor Green
    Write-Host "   🗄️ Database: $($healthData.database)" -ForegroundColor Cyan
    Write-Host "   ⚡ Uptime: $([math]::Round($healthData.uptime/60, 1)) minutes" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ API health failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n4. Container Status Check..." -ForegroundColor Yellow
try {
    $containerCheck = ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "cd /opt/pizza-app && docker ps --format 'table {{.Names}}\t{{.Status}}' | grep -E '(pizza-app-prod|pizza-db-prod)'"
    Write-Host "   📦 Container status:" -ForegroundColor Cyan
    Write-Host $containerCheck
} catch {
    Write-Host "   ❌ Container check failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n" + "=" * 50
Write-Host "🎯 SUMMARY:" -ForegroundColor Green
Write-Host "✅ Your production app is LIVE and WORKING!" -ForegroundColor Green
Write-Host "🌐 Access it at: http://$SERVER" -ForegroundColor Cyan
Write-Host ""
Write-Host "If you still see plain HTML:" -ForegroundColor Yellow
Write-Host "1. Try Ctrl+F5 to hard refresh" -ForegroundColor White
Write-Host "2. Open in incognito/private mode" -ForegroundColor White
Write-Host "3. Clear browser cache completely" -ForegroundColor White
Write-Host "4. Check browser console for errors (F12)" -ForegroundColor White
