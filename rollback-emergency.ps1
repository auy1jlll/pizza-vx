# Emergency Rollback Script
# Quickly revert minor changes

param(
    [string]$Reason = "Emergency rollback"
)

$SERVER = "91.99.194.255"
$SSH_KEY = "C:\Users\auy1j\.ssh\hetzner-pizza-key"
$REMOTE_PATH = "/opt/pizza-app"

Write-Host "🚨 EMERGENCY ROLLBACK" -ForegroundColor Red
Write-Host "Reason: $Reason" -ForegroundColor Yellow
Write-Host "====================" -ForegroundColor Red

# Confirm rollback
$confirm = Read-Host "Are you sure you want to rollback? This will restart the application (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "❌ Rollback cancelled" -ForegroundColor Yellow
    exit 0
}

Write-Host "🔄 Performing rollback..." -ForegroundColor Yellow

# Option 1: Quick restart (for config changes)
Write-Host "Option 1: Quick restart (for config/text changes)" -ForegroundColor Cyan
ssh -i $SSH_KEY root@$SERVER "cd $REMOTE_PATH && docker-compose restart app"

# Option 2: Full rebuild (for code changes)
$fullRebuild = Read-Host "Do you need a full rebuild? (yes/no)"
if ($fullRebuild -eq "yes") {
    Write-Host "🔨 Performing full rebuild..." -ForegroundColor Yellow
    ssh -i $SSH_KEY root@$SERVER "cd $REMOTE_PATH && docker-compose down && docker-compose build --no-cache app && docker-compose up -d"
}

# Verify rollback
Write-Host "✅ Verifying rollback..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

try {
    $response = Invoke-WebRequest -Uri "http://$SERVER:3000/api/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Application is responding after rollback" -ForegroundColor Green
} catch {
    Write-Host "❌ Application not responding after rollback!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🎯 Rollback completed" -ForegroundColor Green
Write-Host "Monitor the application closely for the next few minutes" -ForegroundColor Yellow
