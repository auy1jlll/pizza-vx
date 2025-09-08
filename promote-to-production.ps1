# 🚀 PROMOTE STAGING TO PRODUCTION
# Move tested staging code to production

param(
    [string]$Server = "91.99.194.255",
    [string]$StagingDir = "/opt/pizza-staging",
    [string]$ProdDir = "/opt/pizza-app",
    [string]$SSHKey = "C:\Users\auy1j\.ssh\greenland1"
)

Write-Host "🚀 PROMOTING STAGING TO PRODUCTION" -ForegroundColor Green
Write-Host "From: $StagingDir" -ForegroundColor Gray
Write-Host "To: $ProdDir" -ForegroundColor Gray
Write-Host "=====================================" -ForegroundColor Green

# ============================================
# STEP 1: Backup Production
# ============================================
Write-Host "📦 Creating production backup..." -ForegroundColor Yellow
ssh -i $SSHKey root@$Server "cd $ProdDir && docker-compose exec -T database pg_dump -U postgres pizzadb > /backups/pre-promotion-\$(date +\%Y\%m\%d-\%H\%M\%S).sql"

# ============================================
# STEP 2: Stop Production
# ============================================
Write-Host "🛑 Stopping production services..." -ForegroundColor Yellow
ssh -i $SSHKey root@$Server "cd $ProdDir && docker-compose down"

# ============================================
# STEP 3: Copy Staging to Production
# ============================================
Write-Host "📋 Promoting staging to production..." -ForegroundColor Yellow

# Copy all files from staging to production
ssh -i $SSHKey root@$Server "cp -r $StagingDir/* $ProdDir/"

# Ensure production environment file
ssh -i $SSHKey root@$Server "cd $ProdDir && cp .env.production.backup .env.production 2>/dev/null || echo 'Using existing .env.production'"

# ============================================
# STEP 4: Update Production Database
# ============================================
Write-Host "🗄️ Updating production database..." -ForegroundColor Yellow

# Copy staging database to production
ssh -i $SSHKey root@$Server "docker-compose exec -T database psql -U postgres -c `"DROP DATABASE IF EXISTS pizzadb_old;`""
ssh -i $SSHKey root@$Server "docker-compose exec -T database psql -U postgres -c `"ALTER DATABASE pizzadb RENAME TO pizzadb_old;`""
ssh -i $SSHKey root@$Server "docker-compose exec -T database psql -U postgres -c `"ALTER DATABASE pizzadb_staging RENAME TO pizzadb;`""


# ============================================
# STEP 5: Start Production
# ============================================
Write-Host "🚀 Starting production services..." -ForegroundColor Yellow
ssh -i $SSHKey root@$Server "cd $ProdDir && docker-compose up -d"

# ============================================
# STEP 6: Verify Production
# ============================================
Write-Host "✅ Verifying production deployment..." -ForegroundColor Yellow

# Wait for services to start
Start-Sleep -Seconds 15

# Test production health
try {
    $prodHealth = Invoke-WebRequest -Uri "http://$Server`:3000/api/health" -Method GET -TimeoutSec 15
    Write-Host "✅ Production health check: $($prodHealth.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Production health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# ============================================
# STEP 7: Cleanup Staging
# ============================================
Write-Host "🧹 Cleaning up staging environment..." -ForegroundColor Yellow
ssh -i $SSHKey root@$Server "cd $StagingDir && docker-compose down --remove-orphans"
ssh -i $SSHKey root@$Server "rm -rf $StagingDir"

# ============================================
# STEP 8: Deployment Summary
# ============================================
Write-Host "🎉 PROMOTION COMPLETE!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host "🌐 Production URL: http://$Server`:3000" -ForegroundColor Cyan
Write-Host "📦 Backup Location: /backups/pre-promotion-*.sql" -ForegroundColor Gray
Write-Host "🗄️ Old Database: pizzadb_old (kept as backup)" -ForegroundColor Gray
Write-Host "" -ForegroundColor Gray
Write-Host "📋 Rollback (if needed):" -ForegroundColor Yellow
Write-Host "ssh root@$Server 'cd $ProdDir && docker-compose down && docker-compose exec -T database psql -U postgres -c `"ALTER DATABASE pizzadb RENAME TO pizzadb_staging; ALTER DATABASE pizzadb_old RENAME TO pizzadb;`" && docker-compose up -d'" -ForegroundColor White
