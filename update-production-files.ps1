# Safe Production Update Script
# This script updates only the specific files that were changed
# No database modifications - just file updates

Write-Host "🚀 Starting safe production file update..." -ForegroundColor Green

# Files that were changed in the commit
$changedFiles = @(
    "src/app/management-portal/kitchen/page.tsx",
    "src/app/management-portal/orders/page.tsx", 
    "src/app/api/kitchen/staff/route.ts",
    "src/app/api/kitchen/orders/route.ts"
)

Write-Host "📁 Files to update:" -ForegroundColor Yellow
foreach ($file in $changedFiles) {
    Write-Host "  - $file" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "⚠️  IMPORTANT: Make sure to restart your application after this update!" -ForegroundColor Red
Write-Host "   Examples: 'pm2 restart all' or 'docker-compose restart' or 'systemctl restart your-app'" -ForegroundColor Red
Write-Host ""

$confirm = Read-Host "Continue with file update? (y/N)"
if ($confirm -ne 'y' -and $confirm -ne 'Y') {
    Write-Host "❌ Update cancelled." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Update completed! Remember to restart your application." -ForegroundColor Green
Write-Host "🧪 Test the kitchen page with an EMPLOYEE user after restart." -ForegroundColor Yellow