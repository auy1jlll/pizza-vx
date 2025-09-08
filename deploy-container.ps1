#!/usr/bin/env pwsh

# 🚀 DOCKER CONTAINER DEPLOYMENT TO PRODUCTION
# Safe deployment with rollback capabilities

param(
    [string]$Version = "latest",
    [string]$ServerHost = "91.99.194.255",
    [string]$ServerUser = "root",
    [string]$SSHKey = "C:\Users\auy1j\.ssh\greenland1",
    [switch]$SkipBackup,
    [switch]$QuickDeploy
)

$CONTAINER_NAME = "pizza-app-production"
$IMAGE_NAME = "pizza-app"
$BACKUP_CONTAINER = "pizza-app-backup"

Write-Host "🚀 PRODUCTION CONTAINER DEPLOYMENT" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 Target: $ServerUser@$ServerHost" -ForegroundColor White
Write-Host "📦 Container: ${IMAGE_NAME}:${Version}" -ForegroundColor White
Write-Host ""

# Check if container exists locally
Write-Host "1️⃣ Checking local container..." -ForegroundColor Yellow
$localImage = docker images "${IMAGE_NAME}:${Version}" --format "{{.Repository}}:{{.Tag}}" | Where-Object { $_ -eq "${IMAGE_NAME}:${Version}" }

if (-not $localImage) {
    Write-Host "   ❌ Container ${IMAGE_NAME}:${Version} not found locally!" -ForegroundColor Red
    Write-Host "   💡 Run: .\build-container.ps1 -Version $Version" -ForegroundColor Yellow
    exit 1
}
Write-Host "   ✅ Container found locally" -ForegroundColor Green

# Save container to file
Write-Host ""
Write-Host "2️⃣ Exporting container..." -ForegroundColor Yellow
$containerFile = "pizza-app-${Version}.tar"
Write-Host "   📦 Saving to: $containerFile" -ForegroundColor White

docker save "${IMAGE_NAME}:${Version}" -o $containerFile

if ($LASTEXITCODE -eq 0) {
    $fileSize = [math]::Round((Get-Item $containerFile).Length / 1MB, 2)
    Write-Host "   ✅ Container exported ($fileSize MB)" -ForegroundColor Green
} else {
    Write-Host "   ❌ Failed to export container!" -ForegroundColor Red
    exit 1
}

# Upload to server
Write-Host ""
Write-Host "3️⃣ Uploading to server..." -ForegroundColor Yellow
Write-Host "   🌐 Uploading $fileSize MB to $ServerHost..." -ForegroundColor White

scp -i "$SSHKey" -o StrictHostKeyChecking=no "$containerFile" "${ServerUser}@${ServerHost}:/tmp/"

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Upload completed" -ForegroundColor Green
} else {
    Write-Host "   ❌ Upload failed!" -ForegroundColor Red
    exit 1
}

# Deploy on server
Write-Host ""
Write-Host "4️⃣ Deploying on server..." -ForegroundColor Yellow

$deployScript = @"
#!/bin/bash
echo "🚀 Starting deployment on server..."

# Load the new container image
echo "📦 Loading container image..."
docker load < /tmp/$containerFile

# Backup current container (unless skipped)
if [ "$SkipBackup" != "True" ]; then
    echo "💾 Creating backup of current container..."
    docker stop $BACKUP_CONTAINER 2>/dev/null || true
    docker rm $BACKUP_CONTAINER 2>/dev/null || true
    
    if docker ps -a --format '{{.Names}}' | grep -q '^$CONTAINER_NAME$'; then
        docker commit $CONTAINER_NAME $BACKUP_CONTAINER 2>/dev/null || echo "⚠️ Could not backup current container"
    fi
fi

# Stop current production container
echo "🛑 Stopping current production container..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Start new production container
echo "🚀 Starting new production container..."
docker run -d --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p 3000:3000 \
    -e NODE_ENV=production \
    -e DATABASE_URL="postgresql://auy1jll:_Zx-nake%406172@localhost:5432/pizzax?schema=public" \
    -e NEXTAUTH_SECRET="your-production-secret-key-2025" \
    -e NEXTAUTH_URL="http://91.99.194.255:3000" \
    -e GMAIL_USER="auy1jll33@gmail.com" \
    -e GMAIL_APP_PASSWORD="your-gmail-app-password" \
    ${IMAGE_NAME}:${Version}

# Check if container started successfully
echo "🔍 Checking container health..."
sleep 10

if docker ps --format '{{.Names}}' | grep -q '^$CONTAINER_NAME$'; then
    echo "✅ Container started successfully!"
    
    # Health check
    echo "🏥 Performing health check..."
    for i in {1..30}; do
        if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
            echo "✅ Health check passed! Deployment successful!"
            
            # Clean up
            rm -f /tmp/$containerFile
            echo "🧹 Cleaned up temporary files"
            
            echo ""
            echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
            echo "=================================="
            echo "🌐 Production URL: http://91.99.194.255:3000"
            echo "📊 Container: ${IMAGE_NAME}:${Version}"
            echo "⏰ Deployed: \$(date)"
            exit 0
        fi
        echo "⏳ Waiting for health check... (\$i/30)"
        sleep 2
    done
    
    echo "❌ Health check failed after 60 seconds!"
    echo "📄 Container logs:"
    docker logs $CONTAINER_NAME --tail 20
    exit 1
else
    echo "❌ Container failed to start!"
    echo "📄 Docker logs:"
    docker logs $CONTAINER_NAME --tail 20 2>/dev/null || echo "No logs available"
    exit 1
fi
"@

# Execute deployment on server
Write-Host "   📋 Executing deployment script on server..." -ForegroundColor White

# Create temp script file
$deployScript | Out-File -FilePath "deploy-temp.sh" -Encoding UTF8

# Upload and execute deployment script
scp -i "$SSHKey" -o StrictHostKeyChecking=no "deploy-temp.sh" "${ServerUser}@${ServerHost}:/tmp/"
ssh -i "$SSHKey" -o StrictHostKeyChecking=no "${ServerUser}@${ServerHost}" "chmod +x /tmp/deploy-temp.sh && SkipBackup=$SkipBackup /tmp/deploy-temp.sh"

$deployResult = $LASTEXITCODE

# Clean up
Remove-Item "deploy-temp.sh" -Force -ErrorAction SilentlyContinue
Remove-Item $containerFile -Force -ErrorAction SilentlyContinue

if ($deployResult -eq 0) {
    Write-Host ""
    Write-Host "🎉 PRODUCTION DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 PRODUCTION ACCESS:" -ForegroundColor Cyan
    Write-Host "   URL: http://91.99.194.255:3000" -ForegroundColor White
    Write-Host "   Container: ${IMAGE_NAME}:${Version}" -ForegroundColor White
    Write-Host "   Status: ✅ Running and healthy" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 MANAGEMENT:" -ForegroundColor Cyan
    Write-Host "   View logs: ssh -i $SSHKey $ServerUser@$ServerHost 'docker logs $CONTAINER_NAME -f'" -ForegroundColor White
    Write-Host "   Restart:   ssh -i $SSHKey $ServerUser@$ServerHost 'docker restart $CONTAINER_NAME'" -ForegroundColor White
    Write-Host "   Rollback:  .\rollback-container.ps1" -ForegroundColor White
    
    # Optional: Open production site
    $openProd = Read-Host "🌐 Open production site in browser? (y/n)"
    if ($openProd -eq "y" -or $openProd -eq "Y") {
        Start-Process "http://91.99.194.255:3000"
    }
} else {
    Write-Host ""
    Write-Host "❌ DEPLOYMENT FAILED!" -ForegroundColor Red
    Write-Host "===================" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 TROUBLESHOOTING:" -ForegroundColor Yellow
    Write-Host "   1. Check server logs: ssh -i $SSHKey $ServerUser@$ServerHost 'docker logs $CONTAINER_NAME'" -ForegroundColor White
    Write-Host "   2. Verify container: ssh -i $SSHKey $ServerUser@$ServerHost 'docker ps -a'" -ForegroundColor White
    Write-Host "   3. Check connectivity: ssh -i $SSHKey $ServerUser@$ServerHost 'curl -I http://localhost:3000'" -ForegroundColor White
    
    exit 1
}
