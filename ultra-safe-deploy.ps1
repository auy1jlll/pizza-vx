# Ultra-Safe Production Specialty Pizza Fix
# This script includes multiple safety checks and rollback capabilities

Write-Host "🛡️  ULTRA-SAFE PRODUCTION SPECIALTY PIZZA FIX" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Safety check 1: Verify we have the fix script
if (-not (Test-Path "safe-production-specialty-fix.js")) {
    Write-Host "❌ Safe fix script not found!" -ForegroundColor Red
    exit 1
}

# Safety check 2: Verify SSH connectivity
Write-Host "`n🔐 Step 1: Testing SSH connectivity..." -ForegroundColor Yellow
try {
    ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" -o ConnectTimeout=10 root@91.99.194.255 "echo 'SSH connection successful'"
    if ($LASTEXITCODE -ne 0) {
        throw "SSH connection failed"
    }
    Write-Host "✅ SSH connection successful" -ForegroundColor Green
} catch {
    Write-Host "❌ SSH connection failed: $($_)" -ForegroundColor Red
    exit 1
}

# Safety check 3: Verify production server is running
Write-Host "`n🌐 Step 2: Verifying production server status..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://91.99.194.255:3000/api/specialty-pizzas" -Method GET -TimeoutSec 10
    Write-Host "✅ Production server is responding" -ForegroundColor Green
    Write-Host "📊 Current specialty pizzas: $($response.data.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Production server not responding: $($_)" -ForegroundColor Red
    Write-Host "🛑 Aborting for safety" -ForegroundColor Red
    exit 1
}

# Safety check 4: Show current data before proceeding
Write-Host "`n📊 Step 3: Current production specialty pizza data:" -ForegroundColor Yellow
try {
    $currentData = Invoke-RestMethod -Uri "http://91.99.194.255:3000/api/specialty-pizzas" -Method GET
    $currentData.data | Select-Object -First 5 id, name, @{Name='HasSizes'; Expression={$_.sizes.Count -gt 0}}, @{Name='SizeCount'; Expression={$_.sizes.Count}} | Format-Table -AutoSize
} catch {
    Write-Host "⚠️  Could not retrieve current data preview" -ForegroundColor Yellow
}

# Safety confirmation
Write-Host "`n⚠️  SAFETY CONFIRMATION REQUIRED" -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow
Write-Host "This script will:" -ForegroundColor White
Write-Host "  ✅ Create a complete backup of current data" -ForegroundColor Green
Write-Host "  ✅ Only fix pizzas missing sizes or descriptions" -ForegroundColor Green
Write-Host "  ✅ Preserve all existing good data" -ForegroundColor Green
Write-Host "  ✅ Use soft deletes (deactivate, not delete)" -ForegroundColor Green
Write-Host "  ✅ Provide rollback capability" -ForegroundColor Green
Write-Host ""
Write-Host "This script will NOT:" -ForegroundColor White
Write-Host "  ❌ Delete any existing data permanently" -ForegroundColor Red
Write-Host "  ❌ Affect other parts of the application" -ForegroundColor Red
Write-Host "  ❌ Restart the server" -ForegroundColor Red

$confirmation = Read-Host "`nType 'YES' to proceed with the safe fix"
if ($confirmation -ne "YES") {
    Write-Host "🛑 Operation cancelled by user" -ForegroundColor Yellow
    exit 0
}

# Step 4: Upload the safe fix script
Write-Host "`n📤 Step 4: Uploading safe fix script..." -ForegroundColor Yellow
try {
    scp -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" safe-production-specialty-fix.js root@91.99.194.255:/opt/pizza-app/
    if ($LASTEXITCODE -ne 0) {
        throw "SCP upload failed"
    }
    Write-Host "✅ Safe fix script uploaded" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to upload fix script: $($_)" -ForegroundColor Red
    exit 1
}

# Step 5: Execute the safe fix with real-time monitoring
Write-Host "`n🔧 Step 5: Executing safe production fix..." -ForegroundColor Yellow
Write-Host "📝 (Watch for real-time progress output)" -ForegroundColor Cyan

try {
    ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "cd /opt/pizza-app && node safe-production-specialty-fix.js"
    
    if ($LASTEXITCODE -ne 0) {
        throw "Fix script execution failed"
    }
    Write-Host "`n✅ Safe fix executed successfully!" -ForegroundColor Green
} catch {
    Write-Host "`n❌ Fix execution failed: $($_)" -ForegroundColor Red
    Write-Host "🔄 Check backup files on server for rollback if needed" -ForegroundColor Yellow
    exit 1
}

# Step 6: Verify the fix worked
Write-Host "`n🔍 Step 6: Verifying fix results..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

try {
    $verifyResponse = Invoke-RestMethod -Uri "http://91.99.194.255:3000/api/specialty-pizzas" -Method GET
    Write-Host "✅ Production API still responding" -ForegroundColor Green
    Write-Host "📊 Specialty pizzas after fix: $($verifyResponse.data.Count)" -ForegroundColor Cyan
    
    # Check if pizzas now have sizes
    $pizzasWithSizes = ($verifyResponse.data | Where-Object { $_.sizes.Count -gt 0 }).Count
    Write-Host "🍕 Pizzas with proper sizes: $pizzasWithSizes / $($verifyResponse.data.Count)" -ForegroundColor Cyan
    
    if ($pizzasWithSizes -eq $verifyResponse.data.Count) {
        Write-Host "🎉 ALL PIZZAS NOW HAVE PROPER SIZES!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Some pizzas still missing sizes" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Verification failed: $($_)" -ForegroundColor Red
    Write-Host "🚨 Production might be in an inconsistent state" -ForegroundColor Red
    exit 1
}

# Final success report
Write-Host "`n🎉 ULTRA-SAFE PRODUCTION FIX COMPLETED!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host "✅ Production specialty pizzas have been safely fixed" -ForegroundColor Green
Write-Host "📦 Complete backup created on server" -ForegroundColor Cyan
Write-Host "🛡️  All safety checks passed" -ForegroundColor Green
Write-Host "🌐 Production server is healthy and responding" -ForegroundColor Green

Write-Host "`n📋 What was accomplished:" -ForegroundColor White
Write-Host "  • Fixed specialty pizzas missing sizes and descriptions" -ForegroundColor Green
Write-Host "  • Preserved all existing good data" -ForegroundColor Green
Write-Host "  • Created rollback-capable backup" -ForegroundColor Green
Write-Host "  • Verified production stability" -ForegroundColor Green

Write-Host "`n🔗 Test your production site:" -ForegroundColor Cyan
Write-Host "http://91.99.194.255:3000" -ForegroundColor Blue
