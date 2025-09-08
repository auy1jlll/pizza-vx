#!/usr/bin/env pwsh

# 🔄 CONTAINER ROLLBACK SYSTEM
# Quick rollback to previous container version

param(
    [string]$ServerHost = "91.99.194.255",
    [string]$ServerUser = "root",
    [string]$SSHKey = "C:\Users\auy1j\.ssh\greenland1"
)

$CONTAINER_NAME = "pizza-app-production"
$BACKUP_CONTAINER = "pizza-app-backup"

Write-Host "🔄 PRODUCTION ROLLBACK SYSTEM" -ForegroundColor Red
Write-Host "=============================" -ForegroundColor Red
Write-Host ""
Write-Host "⚠️  WARNING: This will rollback to the previous container version!" -ForegroundColor Yellow
Write-Host "🎯 Target: $ServerUser@$ServerHost" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Are you sure you want to rollback production? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "❌ Rollback cancelled" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🔄 Starting rollback process..." -ForegroundColor Yellow

$rollbackScript = @"
#!/bin/bash
echo "🔄 Starting rollback on server..."

# Check if backup exists
if ! docker images --format '{{.Repository}}:{{.Tag}}' | grep -q '^$BACKUP_CONTAINER:'; then
    if ! docker ps -a --format '{{.Names}}' | grep -q '^$BACKUP_CONTAINER$'; then
        echo "❌ No backup container found! Cannot rollback."
        exit 1
    fi
fi

# Stop current container
echo "🛑 Stopping current production container..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Start backup container
echo "🚀 Starting backup container as production..."
if docker ps -a --format '{{.Names}}' | grep -q '^$BACKUP_CONTAINER$'; then
    # Backup container exists, restart it
    docker start $BACKUP_CONTAINER
    docker rename $BACKUP_CONTAINER $CONTAINER_NAME
else
    # Create from backup image
    docker run -d --name $CONTAINER_NAME \
        --restart unless-stopped \
        -p 3000:3000 \
        -e NODE_ENV=production \
        -e DATABASE_URL="postgresql://auy1jll:_Zx-nake%406172@localhost:5432/pizzax?schema=public" \
        -e NEXTAUTH_SECRET="your-production-secret-key-2025" \
        -e NEXTAUTH_URL="http://91.99.194.255:3000" \
        -e GMAIL_USER="auy1jll33@gmail.com" \
        -e GMAIL_APP_PASSWORD="your-gmail-app-password" \
        $BACKUP_CONTAINER
fi

# Health check
echo "🏥 Performing health check..."
sleep 10

for i in {1..30}; do
    if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        echo "✅ Rollback successful! Production is running on backup version."
        echo ""
        echo "🎉 ROLLBACK COMPLETED!"
        echo "==================="
        echo "🌐 Production URL: http://91.99.194.255:3000"
        echo "📊 Status: Running on backup container"
        echo "⏰ Rolled back: \$(date)"
        exit 0
    fi
    echo "⏳ Waiting for health check... (\$i/30)"
    sleep 2
done

echo "❌ Rollback failed - health check timeout!"
docker logs $CONTAINER_NAME --tail 20
exit 1
"@

# Execute rollback on server
Write-Host "📋 Executing rollback on server..." -ForegroundColor White

# Create temp script file
$rollbackScript | Out-File -FilePath "rollback-temp.sh" -Encoding UTF8

# Upload and execute rollback script
scp -i "$SSHKey" -o StrictHostKeyChecking=no "rollback-temp.sh" "${ServerUser}@${ServerHost}:/tmp/"
ssh -i "$SSHKey" -o StrictHostKeyChecking=no "${ServerUser}@${ServerHost}" "chmod +x /tmp/rollback-temp.sh && /tmp/rollback-temp.sh"

$rollbackResult = $LASTEXITCODE

# Clean up
Remove-Item "rollback-temp.sh" -Force -ErrorAction SilentlyContinue

if ($rollbackResult -eq 0) {
    Write-Host ""
    Write-Host "✅ ROLLBACK SUCCESSFUL!" -ForegroundColor Green
    Write-Host "======================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Production is now running on the backup version" -ForegroundColor White
    Write-Host "🔧 You can deploy a new version when ready" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ ROLLBACK FAILED!" -ForegroundColor Red
    Write-Host "==================" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Manual intervention may be required on the server" -ForegroundColor Yellow
}
