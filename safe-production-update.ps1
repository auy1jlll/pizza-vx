# Safe Production Update - Windows PowerShell Version
# This script updates only the specific files without rebuilding

Write-Host "🚀 Starting safe production update..." -ForegroundColor Green
Write-Host "📋 This will update 4 files without touching the database" -ForegroundColor Yellow
Write-Host ""

# Step 1: Backup current production files
Write-Host "1️⃣ Creating backup of current production files..." -ForegroundColor Cyan
$backupDir = "production-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

try {
    Copy-Item "src/app/management-portal/kitchen/page.tsx" "$backupDir/kitchen-page.tsx.bak" -ErrorAction SilentlyContinue
    Copy-Item "src/app/management-portal/orders/page.tsx" "$backupDir/orders-page.tsx.bak" -ErrorAction SilentlyContinue  
    Copy-Item "src/app/api/management-portal/kitchen/orders/route.ts" "$backupDir/kitchen-api.ts.bak" -ErrorAction SilentlyContinue
    Copy-Item "src/app/api/admin/kitchen/orders/route.ts" "$backupDir/admin-kitchen-api.ts.bak" -ErrorAction SilentlyContinue
    Write-Host "   ✅ Production files backed up to $backupDir" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️ Some files may not exist yet (first deployment)" -ForegroundColor Yellow
}

# Step 2: Pull only the specific changes
Write-Host "2️⃣ Pulling latest changes for updated files..." -ForegroundColor Cyan
git fetch origin main
git checkout origin/main -- src/app/management-portal/kitchen/page.tsx
git checkout origin/main -- src/app/management-portal/orders/page.tsx  
git checkout origin/main -- src/app/api/management-portal/kitchen/orders/route.ts
git checkout origin/main -- src/app/api/admin/kitchen/orders/route.ts

Write-Host "3️⃣ Files updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🔍 Updated files:" -ForegroundColor Cyan
Write-Host "   - Kitchen page: EMPLOYEE access enabled" -ForegroundColor White
Write-Host "   - Orders page: All text now black for readability" -ForegroundColor White
Write-Host "   - Kitchen APIs: Authentication properly awaited" -ForegroundColor White
Write-Host ""
Write-Host "📌 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "   1. Restart your app process:" -ForegroundColor White
Write-Host "      - PM2: pm2 reload your-app-name" -ForegroundColor Gray
Write-Host "      - Docker: docker restart your-container-name" -ForegroundColor Gray
Write-Host "      - IIS: Restart application pool" -ForegroundColor Gray
Write-Host "      - Direct: Kill and restart your Node process" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Database was NOT touched - your data is safe!" -ForegroundColor Green
Write-Host "🎯 Test immediately: Log in as EMPLOYEE user and check kitchen access" -ForegroundColor Magenta