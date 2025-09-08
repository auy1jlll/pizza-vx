# 🚀 STAGING DEPLOYMENT SCRIPT
# Deploy to staging environment for testing

param(
    [string]$Server = "91.99.58.154",
    [string]$StagingDir = "/opt/pizza-staging",
    [string]$SSHKey = "C:\Users\auy1j\.ssh\piz91025"
)

Write-Host "🚀 STAGING DEPLOYMENT: $Server" -ForegroundColor Green
Write-Host "Staging Directory: $StagingDir" -ForegroundColor Gray
Write-Host "=====================================" -ForegroundColor Green

# ============================================
# STEP 1: Create Staging Database Schema
# ============================================
Write-Host "📊 Creating staging database schema..." -ForegroundColor Yellow

# Execute database setup
Write-Host "Setting up staging database..." -ForegroundColor Cyan
ssh -i $SSHKey root@$Server "docker-compose exec -T database psql -U postgres -c `"CREATE DATABASE pizzadb_staging;`""
ssh -i $SSHKey root@$Server "docker-compose exec -T database psql -U postgres -c `"GRANT ALL PRIVILEGES ON DATABASE pizzadb_staging TO pizzauser;`""

# ============================================
# STEP 2: Create Staging Directory
# ============================================
Write-Host "📁 Creating staging directory..." -ForegroundColor Yellow
ssh -i $SSHKey root@$Server "mkdir -p $StagingDir"
ssh -i $SSHKey root@$Server "cd $StagingDir && mkdir -p prisma migrations src public"

# ============================================
# STEP 3: Copy Application Files
# ============================================
Write-Host "📋 Copying application files..." -ForegroundColor Yellow

# Copy core files
scp -i $SSHKey package.json root@${Server}:${StagingDir}/
scp -i $SSHKey package-lock.json root@${Server}:${StagingDir}/
scp -i $SSHKey next.config.ts root@${Server}:${StagingDir}/
scp -i $SSHKey tailwind.config.ts root@${Server}:${StagingDir}/
scp -i $SSHKey tsconfig.json root@${Server}:${StagingDir}/
scp -i $SSHKey Dockerfile.optimized root@${Server}:${StagingDir}/

# Copy environment file
scp -i $SSHKey .env.staging root@${Server}:${StagingDir}/.env.production

# Copy source code
Write-Host "Copying source code..." -ForegroundColor Cyan
scp -i $SSHKey -r src root@${Server}:${StagingDir}/
scp -i $SSHKey -r prisma root@${Server}:${StagingDir}/
scp -i $SSHKey -r public root@${Server}:${StagingDir}/

# ============================================
# STEP 4: Deploy Staging Environment
# ============================================
Write-Host "🚀 Deploying staging environment..." -ForegroundColor Yellow

# Copy staging docker-compose
scp -i $SSHKey docker-compose.staging.yml root@${Server}:${StagingDir}/docker-compose.yml

# Navigate to staging directory and deploy
ssh -i $SSHKey root@$Server "cd $StagingDir && docker-compose down --remove-orphans 2>/dev/null || true"
ssh -i $SSHKey root@$Server "cd $StagingDir && docker-compose build --no-cache app-staging"
ssh -i $SSHKey root@$Server "cd $StagingDir && docker-compose up -d"

# ============================================
# STEP 5: Setup Database Schema
# ============================================
Write-Host "🗄️ Setting up database schema..." -ForegroundColor Yellow

# Wait for staging app to be ready
Start-Sleep -Seconds 10

# Run database migrations/setup
ssh -i $SSHKey root@$Server "cd $StagingDir && docker-compose exec -T app-staging npx prisma generate"
ssh -i $SSHKey root@$Server "cd $StagingDir && docker-compose exec -T app-staging npx prisma db push"

# ============================================
# STEP 6: Verify Deployment
# ============================================
Write-Host "✅ Verifying staging deployment..." -ForegroundColor Yellow

# Test health endpoint
try {
    $stagingHealth = Invoke-WebRequest -Uri "http://$Server`:3001/api/health" -Method GET -TimeoutSec 15
    Write-Host "✅ Staging health check: $($stagingHealth.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Staging health check failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# ============================================
# STEP 7: Deployment Summary
# ============================================
Write-Host "🎉 STAGING DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host "🌐 Staging URL: http://$Server`:3001" -ForegroundColor Cyan
Write-Host "📁 Staging Directory: $StagingDir" -ForegroundColor Gray
Write-Host "🗄️ Database: pizzadb_staging" -ForegroundColor Gray
Write-Host "" -ForegroundColor Gray
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Test staging: http://$Server`:3001" -ForegroundColor White
Write-Host "2. Verify all features work" -ForegroundColor White
Write-Host "3. Run: .\promote-to-production.ps1" -ForegroundColor White
Write-Host "4. Or rollback: ssh root@$Server 'cd $StagingDir && docker-compose down'" -ForegroundColor White
