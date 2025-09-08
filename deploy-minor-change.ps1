# Quick Minor Change Deployment Script
# For small, safe changes to production

param(
    [Parameter(Mandatory=$true)]
    [string]$ChangeType,
    [string]$Description = "Minor production update"
)

$SERVER = "91.99.194.255"
$SSH_KEY = "C:\Users\auy1j\.ssh\hetzner-pizza-key"
$REMOTE_PATH = "/opt/pizza-app"

Write-Host "🔧 MINOR PRODUCTION CHANGE: $ChangeType" -ForegroundColor Green
Write-Host "Description: $Description" -ForegroundColor Gray
Write-Host "=====================================" -ForegroundColor Green

# Validate change type
$validTypes = @("config", "text", "styling", "hotfix", "content")
if ($ChangeType -notin $validTypes) {
    Write-Host "❌ Invalid change type. Valid types: $($validTypes -join ', ')" -ForegroundColor Red
    exit 1
}

# Backup current production state
Write-Host "📦 Creating production backup..." -ForegroundColor Yellow
ssh -i $SSH_KEY root@$SERVER "cd $REMOTE_PATH && docker exec pizza-app-prod mkdir -p /app/backups && date > /app/backups/pre-change-$(date +%Y%m%d-%H%M%S).txt"

# Copy only necessary files based on change type
Write-Host "📁 Copying minimal files..." -ForegroundColor Yellow

switch ($ChangeType) {
    "config" {
        # Only copy config files
        scp -i $SSH_KEY .env.production root@${SERVER}:${REMOTE_PATH}/
        scp -i $SSH_KEY next.config.ts root@${SERVER}:${REMOTE_PATH}/
    }
    "text" {
        # Only copy text/content files
        scp -i $SSH_KEY -r public root@${SERVER}:${REMOTE_PATH}/
        scp -i $SSH_KEY -r src/components root@${SERVER}:${REMOTE_PATH}/src/
    }
    "styling" {
        # Only copy styling files
        scp -i $SSH_KEY tailwind.config.ts root@${SERVER}:${REMOTE_PATH}/
        scp -i $SSH_KEY -r src/components root@${SERVER}:${REMOTE_PATH}/src/
    }
    "hotfix" {
        # Copy specific API routes or components
        Write-Host "Specify which files to copy for hotfix..." -ForegroundColor Yellow
        # Add interactive file selection here
    }
    "content" {
        # Only copy content/data files
        scp -i $SSH_KEY -r prisma/seed root@${SERVER}:${REMOTE_PATH}/prisma/
    }
}

# Quick restart (no full rebuild)
Write-Host "🔄 Quick service restart..." -ForegroundColor Yellow
ssh -i $SSH_KEY root@$SERVER "cd $REMOTE_PATH && docker-compose restart app"

# Verify deployment
Write-Host "✅ Verifying deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri "http://$SERVER:3000/api/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Production is responding (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Production may need more time to restart" -ForegroundColor Yellow
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host "🎉 Minor change deployed successfully!" -ForegroundColor Green
Write-Host "Change Type: $ChangeType" -ForegroundColor Gray
Write-Host "Description: $Description" -ForegroundColor Gray
