Write-Host "🔍 DATABASE & DEPLOYMENT STATUS CHECK" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check Local Database
Write-Host "`n🏠 LOCAL DATABASE STATUS:" -ForegroundColor Green
try {
    $local = Invoke-RestMethod -Uri "http://localhost:3005/api/specialty-pizzas" -Method GET -TimeoutSec 10
    Write-Host "✅ Local server responding" -ForegroundColor Green
    Write-Host "   Specialty Pizzas: $($local.data.Count)" -ForegroundColor Gray
    
    $localSettings = Invoke-RestMethod -Uri "http://localhost:3005/api/settings" -Method GET -TimeoutSec 10
    Write-Host "   App Name: '$($localSettings.settings.app_name)'" -ForegroundColor Gray
    
    Write-Host "   Sample Local Pizzas:" -ForegroundColor Gray
    $local.data | Select-Object -First 5 id, name | Format-Table -AutoSize
    
} catch {
    Write-Host "❌ Local server error: $($_.Exception.Message)" -ForegroundColor Red
}

# Check Production Database
Write-Host "`n🌐 PRODUCTION DATABASE STATUS:" -ForegroundColor Blue
try {
    $prod = Invoke-RestMethod -Uri "http://91.99.194.255:3000/api/specialty-pizzas" -Method GET -TimeoutSec 20
    Write-Host "✅ Production server responding" -ForegroundColor Green
    Write-Host "   Specialty Pizzas: $($prod.data.Count)" -ForegroundColor Gray
    
    $prodSettings = Invoke-RestMethod -Uri "http://91.99.194.255:3000/api/settings" -Method GET -TimeoutSec 20
    Write-Host "   App Name: '$($prodSettings.settings.app_name)'" -ForegroundColor Gray
    
    Write-Host "   Sample Production Pizzas:" -ForegroundColor Gray
    $prod.data | Select-Object -First 5 id, name | Format-Table -AutoSize
    
    # Test gourmet pizzas specifically
    try {
        $gourmetTest = Invoke-WebRequest -Uri "http://91.99.194.255:3000/gourmet-pizzas" -Method GET -TimeoutSec 15
        if ($gourmetTest.StatusCode -eq 200) {
            Write-Host "✅ Gourmet pizzas page accessible" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️ Gourmet pizzas page issue: $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Production server error: $($_.Exception.Message)" -ForegroundColor Red
}

# Comparison
if ($local -and $prod) {
    Write-Host "`n📊 COMPARISON SUMMARY:" -ForegroundColor Cyan
    Write-Host "   Local Pizzas: $($local.data.Count)" -ForegroundColor Gray
    Write-Host "   Production Pizzas: $($prod.data.Count)" -ForegroundColor Gray
    
    if ($local.data.Count -eq $prod.data.Count) {
        Write-Host "✅ Pizza counts match perfectly!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Pizza counts differ:" -ForegroundColor Yellow
        Write-Host "   Difference: $([Math]::Abs($local.data.Count - $prod.data.Count)) pizzas" -ForegroundColor Yellow
    }
    
    # Check if gourmet pizza corruption is fixed
    $localGourmet = $local.data | Where-Object { $_.name -like "*gourmet*" -or $_.category -like "*gourmet*" }
    $prodGourmet = $prod.data | Where-Object { $_.name -like "*gourmet*" -or $_.category -like "*gourmet*" }
    
    Write-Host "`n🎯 GOURMET PIZZA STATUS:" -ForegroundColor Magenta
    Write-Host "   Local Gourmet Pizzas: $($localGourmet.Count)" -ForegroundColor Gray
    Write-Host "   Production Gourmet Pizzas: $($prodGourmet.Count)" -ForegroundColor Gray
    
    if ($prodGourmet.Count -gt 0) {
        Write-Host "✅ Gourmet pizza corruption appears to be FIXED!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ No gourmet pizzas found in production" -ForegroundColor Yellow
    }
}

Write-Host "`n🔗 QUICK ACCESS LINKS:" -ForegroundColor White
Write-Host "   Production Site: http://91.99.194.255:3000" -ForegroundColor Gray
Write-Host "   Gourmet Pizzas: http://91.99.194.255:3000/gourmet-pizzas" -ForegroundColor Gray
Write-Host "   Management Portal: http://91.99.194.255:3000/management-portal" -ForegroundColor Gray

Write-Host "`n✨ Status check complete!" -ForegroundColor Green
