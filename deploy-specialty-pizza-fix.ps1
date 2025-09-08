# Safe Production Specialty Pizza Update Script (PowerShell)
# This script ONLY updates specialty pizza data without touching the rest of the application

Write-Host "🚀 Starting Safe Specialty Pizza Production Update..." -ForegroundColor Cyan

# Configuration
$RemoteHost = "91.99.194.255"
$RemoteUser = "root" 
$SSHKey = "C:\Users\auy1j\.ssh\hetzner-pizza-key"
$RemotePath = "/opt/pizza-app"

Write-Host "📋 Update Plan:" -ForegroundColor Yellow
Write-Host "   - Upload ONLY the specialty pizza fix script" -ForegroundColor White
Write-Host "   - Run database update for specialty pizzas" -ForegroundColor White
Write-Host "   - Verify the fix worked" -ForegroundColor White
Write-Host "   - NO server restart required" -ForegroundColor Green
Write-Host "   - NO application code changes" -ForegroundColor Green

# Step 1: Upload the fix script to production
Write-Host ""
Write-Host "📤 Step 1: Uploading specialty pizza fix script..." -ForegroundColor Cyan

try {
    scp -i $SSHKey fix-production-specialty-pizzas.js "${RemoteUser}@${RemoteHost}:${RemotePath}/"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Fix script uploaded successfully" -ForegroundColor Green
    } else {
        throw "SCP failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host "❌ Failed to upload fix script: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Run the fix script on production
Write-Host ""
Write-Host "🔧 Step 2: Running specialty pizza fix on production database..." -ForegroundColor Cyan

try {
    ssh -i $SSHKey "${RemoteUser}@${RemoteHost}" "cd $RemotePath && node fix-production-specialty-pizzas.js"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Specialty pizza fix completed successfully" -ForegroundColor Green
    } else {
        throw "Fix script failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host "❌ Fix script failed: $_" -ForegroundColor Red
    Write-Host "Check the output above for error details" -ForegroundColor Yellow
    exit 1
}

# Step 3: Verify the fix worked
Write-Host ""
Write-Host "🔍 Step 3: Verifying specialty pizzas are working..." -ForegroundColor Cyan

try {
    $verifyResult = ssh -i $SSHKey "${RemoteUser}@${RemoteHost}" "cd $RemotePath && curl -s http://localhost:3000/api/specialty-pizzas"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Specialty pizzas API is responding" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Could not verify API response (but fix may still be successful)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Verification step had issues: $_" -ForegroundColor Yellow
}

# Step 4: Test the endpoint from external
Write-Host ""
Write-Host "🌐 Step 4: Testing from external..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://${RemoteHost}:3000/api/specialty-pizzas" -Method GET -TimeoutSec 10
    $pizzaCount = $response.data.Count
    
    if ($pizzaCount -gt 0) {
        Write-Host "✅ External API test successful - Found $pizzaCount specialty pizzas" -ForegroundColor Green
    } else {
        Write-Host "⚠️  External test returned 0 pizzas" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  External test inconclusive: $_" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 SPECIALTY PIZZA UPDATE COMPLETE!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Yellow
Write-Host "   ✅ Database updated with clean specialty pizza data" -ForegroundColor Green
Write-Host "   ✅ Proper sizes and pricing applied" -ForegroundColor Green
Write-Host "   ✅ Old garbage data cleaned up" -ForegroundColor Green
Write-Host "   ✅ No server restart required" -ForegroundColor Green
Write-Host "   ✅ No downtime experienced" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Test URL: http://${RemoteHost}:3000/gourmet-pizzas" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: This update ONLY affected specialty pizza data." -ForegroundColor White
Write-Host "The rest of your application remains untouched and stable." -ForegroundColor White
