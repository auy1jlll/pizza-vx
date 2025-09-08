# Comprehensive TestPilot functionality check for Pizza App
Write-Host "🧪 TESTPILOT: GOURMET PIZZA FUNCTIONALITY TEST" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

$DEV_URL = "http://localhost:3005"
$PROD_URL = "http://91.99.194.255:3000"

function Test-Environment {
    param($BaseUrl, $Label)
    
    Write-Host "`n🔍 Testing $Label ($BaseUrl):" -ForegroundColor Yellow
    
    try {
        # Test 1: Basic connectivity
        Write-Host "  1. Testing basic connectivity..." -ForegroundColor White
        $settings = Invoke-RestMethod -Uri "$BaseUrl/api/settings" -Method GET -TimeoutSec 10
        Write-Host "     ✅ API Connected - App: '$($settings.settings.app_name)'" -ForegroundColor Green
        
        # Test 2: Specialty pizzas
        Write-Host "  2. Testing specialty pizzas..." -ForegroundColor White
        $pizzas = Invoke-RestMethod -Uri "$BaseUrl/api/specialty-pizzas" -Method GET -TimeoutSec 10
        Write-Host "     ✅ Found $($pizzas.data.Count) specialty pizzas" -ForegroundColor Green
        
        # Test 3: Search for gourmet pizzas
        Write-Host "  3. Searching for gourmet pizzas..." -ForegroundColor White
        $gourmetPizzas = $pizzas.data | Where-Object { 
            $_.name -like "*gourmet*" -or $_.description -like "*gourmet*" 
        }
        
        if ($gourmetPizzas) {
            Write-Host "     🍕 Found $($gourmetPizzas.Count) gourmet pizzas:" -ForegroundColor Green
            foreach ($pizza in $gourmetPizzas) {
                Write-Host "       - ID: $($pizza.id), Name: '$($pizza.name)'" -ForegroundColor Cyan
            }
        } else {
            Write-Host "     ⚠️  No gourmet pizzas found" -ForegroundColor Yellow
        }
        
        # Test 4: Categories
        Write-Host "  4. Testing categories..." -ForegroundColor White
        $categories = Invoke-RestMethod -Uri "$BaseUrl/api/menu/categories" -Method GET -TimeoutSec 10
        Write-Host "     ✅ Found $($categories.data.Count) categories" -ForegroundColor Green
        
        return @{
            Success = $true
            TotalPizzas = $pizzas.data.Count
            GourmetPizzas = $gourmetPizzas.Count
            Categories = $categories.data.Count
            AppName = $settings.settings.app_name
        }
        
    } catch {
        Write-Host "     ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Test both environments
Write-Host "Starting comprehensive functionality tests...`n" -ForegroundColor White

$devResults = Test-Environment -BaseUrl $DEV_URL -Label "DEVELOPMENT"
$prodResults = Test-Environment -BaseUrl $PROD_URL -Label "PRODUCTION"

# Compare Results
Write-Host "`n📊 COMPARISON RESULTS:" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

if ($devResults.Success -and $prodResults.Success) {
    Write-Host "✅ Both environments are responding" -ForegroundColor Green
    
    Write-Host "`n🔍 Data Comparison:" -ForegroundColor White
    Write-Host "  Specialty Pizzas - Dev: $($devResults.TotalPizzas), Prod: $($prodResults.TotalPizzas)"
    Write-Host "  Gourmet Pizzas   - Dev: $($devResults.GourmetPizzas), Prod: $($prodResults.GourmetPizzas)"
    Write-Host "  Categories       - Dev: $($devResults.Categories), Prod: $($prodResults.Categories)"
    
    if ($devResults.GourmetPizzas -ne $prodResults.GourmetPizzas) {
        Write-Host "`n⚠️  GOURMET PIZZA MISMATCH DETECTED!" -ForegroundColor Red
        Write-Host "    This confirms the corruption issue." -ForegroundColor Red
    } else {
        Write-Host "`n✅ Gourmet pizza counts match between environments" -ForegroundColor Green
    }
    
} else {
    Write-Host "❌ One or both environments have issues:" -ForegroundColor Red
    if (-not $devResults.Success) {
        Write-Host "   Dev Error: $($devResults.Error)" -ForegroundColor Red
    }
    if (-not $prodResults.Success) {
        Write-Host "   Prod Error: $($prodResults.Error)" -ForegroundColor Red
    }
}

# Deployment Recommendation
Write-Host "`n🚀 DEPLOYMENT RECOMMENDATION:" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

if ($devResults.Success -and $devResults.GourmetPizzas -gt 0) {
    Write-Host "✅ DEV ENVIRONMENT IS GOOD FOR DEPLOYMENT" -ForegroundColor Green
    Write-Host "   - API is responding correctly" -ForegroundColor Green
    Write-Host "   - Found $($devResults.GourmetPizzas) gourmet pizzas" -ForegroundColor Green
    Write-Host "   - $($devResults.TotalPizzas) total specialty pizzas" -ForegroundColor Green
    Write-Host "   - Ready to redeploy to fix production corruption" -ForegroundColor Green
} else {
    Write-Host "❌ DEV ENVIRONMENT HAS ISSUES" -ForegroundColor Red
    Write-Host "   - Do not deploy until issues are resolved" -ForegroundColor Red
}

Write-Host "`n🏁 Test completed!" -ForegroundColor Cyan
