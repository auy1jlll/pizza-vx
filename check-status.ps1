# 🚀 CHECK STAGING & PRODUCTION STATUS
# Monitor both environments

param(
    [string]$Server = "91.99.194.255",
    [string]$SSHKey = "C:\Users\auy1j\.ssh\hetzner-pizza-key"
)

Write-Host "📊 ENVIRONMENT STATUS CHECK" -ForegroundColor Green
Write-Host "Server: $Server" -ForegroundColor Gray
Write-Host "=====================================" -ForegroundColor Green

# ============================================
# PRODUCTION STATUS
# ============================================
Write-Host "🏭 PRODUCTION ENVIRONMENT" -ForegroundColor Yellow
Write-Host "------------------------" -ForegroundColor Yellow

# Check production containers
Write-Host "Docker containers:" -ForegroundColor Cyan
ssh -i $SSHKey root@$Server "cd /opt/pizza-app && docker-compose ps" 2>/dev/null || Write-Host "❌ Production not running" -ForegroundColor Red

# Check production health
try {
    $prodHealth = Invoke-WebRequest -Uri "http://$Server`:3000/api/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Production API: $($prodHealth.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Production API: $($_.Exception.Message)" -ForegroundColor Red
}

# Check production database
$prodDB = ssh -i $SSHKey root@$Server "docker-compose exec -T database psql -U postgres -l | grep pizzadb" 2>/dev/null
if ($prodDB) {
    Write-Host "✅ Production DB: Connected" -ForegroundColor Green
} else {
    Write-Host "❌ Production DB: Not accessible" -ForegroundColor Red
}

Write-Host ""

# ============================================
# STAGING STATUS
# ============================================
Write-Host "🧪 STAGING ENVIRONMENT" -ForegroundColor Yellow
Write-Host "----------------------" -ForegroundColor Yellow

# Check if staging directory exists
$stagingExists = ssh -i $SSHKey root@$Server "test -d /opt/pizza-staging && echo 'exists' || echo 'not found'"
if ($stagingExists -eq "exists") {
    Write-Host "✅ Staging directory: /opt/pizza-staging" -ForegroundColor Green

    # Check staging containers
    Write-Host "Docker containers:" -ForegroundColor Cyan
    ssh -i $SSHKey root@$Server "cd /opt/pizza-staging && docker-compose ps" 2>/dev/null || Write-Host "❌ Staging containers not running" -ForegroundColor Red

    # Check staging health
    try {
        $stagingHealth = Invoke-WebRequest -Uri "http://$Server`:3001/api/health" -Method GET -TimeoutSec 10
        Write-Host "✅ Staging API: $($stagingHealth.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Staging API: $($_.Exception.Message)" -ForegroundColor Red
    }

    # Check staging database
    $stagingDB = ssh -i $SSHKey root@$Server "docker-compose exec -T database psql -U postgres -l | grep pizzadb_staging" 2>/dev/null
    if ($stagingDB) {
        Write-Host "✅ Staging DB: pizzadb_staging" -ForegroundColor Green
    } else {
        Write-Host "❌ Staging DB: Not found" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Staging directory: Not found" -ForegroundColor Red
}

Write-Host ""

# ============================================
# SUMMARY
# ============================================
Write-Host "📋 SUMMARY" -ForegroundColor Magenta
Write-Host "---------" -ForegroundColor Magenta
Write-Host "🌐 Production: http://$Server`:3000" -ForegroundColor White
Write-Host "🧪 Staging: http://$Server`:3001" -ForegroundColor White
Write-Host ""
Write-Host "📝 Commands:" -ForegroundColor Yellow
Write-Host "Deploy staging: .\deploy-staging.ps1" -ForegroundColor White
Write-Host "Promote to prod: .\promote-to-production.ps1" -ForegroundColor White
Write-Host "Check status: .\check-status.ps1" -ForegroundColor White
