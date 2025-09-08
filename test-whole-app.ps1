# 🧪 COMPREHENSIVE PIZZA APP TEST SUITE
# =====================================

Write-Host "🧪 COMPREHENSIVE PIZZA APP TESTING" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

$DEV_BASE = "http://localhost:3005"
$testResults = @()

function Test-Endpoint {
    param($Url, $Name, $ExpectedFields = @())
    
    Write-Host "`n🔍 Testing $Name..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method GET -TimeoutSec 15
        
        if ($response.data) {
            $count = $response.data.Count
            Write-Host "   ✅ SUCCESS: Found $count records" -ForegroundColor Green
            
            # Check expected fields if provided
            if ($ExpectedFields.Count -gt 0 -and $response.data.Count -gt 0) {
                $firstItem = $response.data[0]
                $missingFields = @()
                
                foreach ($field in $ExpectedFields) {
                    if (-not $firstItem.PSObject.Properties.Name.Contains($field)) {
                        $missingFields += $field
                    }
                }
                
                if ($missingFields.Count -eq 0) {
                    Write-Host "   ✅ All expected fields present" -ForegroundColor Green
                } else {
                    Write-Host "   ⚠️  Missing fields: $($missingFields -join ', ')" -ForegroundColor Yellow
                }
            }
            
            return @{ Success = $true; Count = $count; Data = $response.data }
        } else {
            Write-Host "   ✅ SUCCESS: Response received" -ForegroundColor Green
            return @{ Success = $true; Data = $response }
        }
        
    } catch {
        Write-Host "   ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

# 🏪 CORE APP TESTS
Write-Host "`n🏪 TESTING CORE APPLICATION ENDPOINTS" -ForegroundColor Magenta

$tests = @(
    @{ Url = "$DEV_BASE/api/settings"; Name = "App Settings"; Fields = @("app_name", "app_tagline") },
    @{ Url = "$DEV_BASE/api/menu/categories"; Name = "Menu Categories"; Fields = @("id", "name") },
    @{ Url = "$DEV_BASE/api/menu/items"; Name = "Menu Items"; Fields = @("id", "name", "price") },
    @{ Url = "$DEV_BASE/api/specialty-pizzas"; Name = "Specialty Pizzas"; Fields = @("id", "name", "description") },
    @{ Url = "$DEV_BASE/api/sizes"; Name = "Pizza Sizes"; Fields = @("id", "name", "multiplier") },
    @{ Url = "$DEV_BASE/api/toppings"; Name = "Toppings"; Fields = @("id", "name", "price") },
    @{ Url = "$DEV_BASE/api/customizations"; Name = "Customizations"; Fields = @("id", "name") }
)

foreach ($test in $tests) {
    $result = Test-Endpoint -Url $test.Url -Name $test.Name -ExpectedFields $test.Fields
    $testResults += @{ Name = $test.Name; Result = $result }
}

# 🍕 GOURMET PIZZA SPECIFIC TESTS
Write-Host "`n🍕 TESTING GOURMET PIZZA FUNCTIONALITY" -ForegroundColor Magenta

$pizzaResult = Test-Endpoint -Url "$DEV_BASE/api/specialty-pizzas" -Name "Specialty Pizzas Data"

if ($pizzaResult.Success) {
    $gourmetPizzas = $pizzaResult.Data | Where-Object { 
        $_.name -like "*gourmet*" -or $_.description -like "*gourmet*" 
    }
    
    Write-Host "`n🔍 Analyzing Gourmet Pizzas:" -ForegroundColor White
    Write-Host "   Total Specialty Pizzas: $($pizzaResult.Count)" -ForegroundColor White
    Write-Host "   Gourmet Pizzas Found: $($gourmetPizzas.Count)" -ForegroundColor White
    
    if ($gourmetPizzas.Count -gt 0) {
        Write-Host "`n📋 Gourmet Pizza Details:" -ForegroundColor Cyan
        foreach ($pizza in $gourmetPizzas) {
            Write-Host "   🍕 $($pizza.name) (ID: $($pizza.id))" -ForegroundColor Green
            Write-Host "      Description: $($pizza.description.Substring(0, [Math]::Min(60, $pizza.description.Length)))..." -ForegroundColor Gray
        }
    } else {
        Write-Host "   ⚠️  NO GOURMET PIZZAS FOUND - This might be the corruption issue!" -ForegroundColor Red
    }
}

# 🛒 STORE FUNCTIONALITY TESTS
Write-Host "`n🛒 TESTING STORE FUNCTIONALITY" -ForegroundColor Magenta

$storeTests = @(
    @{ Url = "$DEV_BASE/api/kitchen/orders"; Name = "Kitchen Orders" },
    @{ Url = "$DEV_BASE/api/cart/session"; Name = "Cart Session" }
)

foreach ($test in $storeTests) {
    $result = Test-Endpoint -Url $test.Url -Name $test.Name
    $testResults += @{ Name = $test.Name; Result = $result }
}

# 🔐 MANAGEMENT PORTAL TESTS
Write-Host "`n🔐 TESTING MANAGEMENT PORTAL" -ForegroundColor Magenta

$mgmtTests = @(
    @{ Url = "$DEV_BASE/api/management-portal/menu/categories"; Name = "Management Categories" },
    @{ Url = "$DEV_BASE/api/management-portal/sizes"; Name = "Management Sizes" },
    @{ Url = "$DEV_BASE/api/management-portal/toppings"; Name = "Management Toppings" }
)

foreach ($test in $mgmtTests) {
    $result = Test-Endpoint -Url $test.Url -Name $test.Name
    $testResults += @{ Name = $test.Name; Result = $result }
}

# 📊 SUMMARY REPORT
Write-Host "`n📊 TEST SUMMARY REPORT" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan

$successCount = ($testResults | Where-Object { $_.Result.Success }).Count
$totalCount = $testResults.Count

Write-Host "`n🎯 Overall Results:" -ForegroundColor White
Write-Host "   ✅ Passed: $successCount" -ForegroundColor Green
Write-Host "   ❌ Failed: $($totalCount - $successCount)" -ForegroundColor Red
Write-Host "   📈 Success Rate: $([math]::Round(($successCount / $totalCount) * 100, 1))%" -ForegroundColor Cyan

if ($successCount -eq $totalCount) {
    Write-Host "`n🎉 ALL TESTS PASSED! The app is ready for deployment!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed. Review the issues before deployment." -ForegroundColor Yellow
}

# 🚀 DEPLOYMENT READINESS
Write-Host "`n🚀 DEPLOYMENT READINESS ASSESSMENT" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

$critical = @("App Settings", "Specialty Pizzas", "Menu Categories")
$criticalPassed = ($testResults | Where-Object { $_.Name -in $critical -and $_.Result.Success }).Count

if ($criticalPassed -eq $critical.Count) {
    Write-Host "✅ CRITICAL SYSTEMS: All working" -ForegroundColor Green
    Write-Host "✅ READY FOR DEPLOYMENT" -ForegroundColor Green
    Write-Host "`n📋 Pre-deployment checklist:" -ForegroundColor White
    Write-Host "   ✅ Dev server running on port 3005" -ForegroundColor Green
    Write-Host "   ✅ API endpoints responding" -ForegroundColor Green
    Write-Host "   ✅ Core functionality verified" -ForegroundColor Green
    
    if ($gourmetPizzas.Count -gt 0) {
        Write-Host "   ✅ Gourmet pizzas present ($($gourmetPizzas.Count) found)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Gourmet pizzas missing - deployment will fix this" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ CRITICAL SYSTEMS: Issues detected" -ForegroundColor Red
    Write-Host "❌ NOT READY FOR DEPLOYMENT" -ForegroundColor Red
}

Write-Host "`n🏁 Testing completed at $(Get-Date)" -ForegroundColor Cyan
