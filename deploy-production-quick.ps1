# Quick Production Deployment Script
# This script deploys your latest changes to the Hetzner production server

param(
    [switch]$SkipBuild,
    [switch]$RestartOnly
)

$SERVER = "91.99.194.255"
$SSH_KEY = "C:\Users\auy1j\.ssh\hetzner-pizza-key"
$REMOTE_PATH = "/opt/pizza-app"

Write-Host "🚀 Starting Production Deployment..." -ForegroundColor Green

if (-not $RestartOnly) {
    Write-Host "📁 Copying files to production server..." -ForegroundColor Yellow
    
    # Copy essential files
    scp -i $SSH_KEY -r `
        Dockerfile `
        docker-compose.yml `
        .env.production `
        package.json `
        package-lock.json `
        next.config.ts `
        tailwind.config.ts `
        tsconfig.json `
        src `
        prisma `
        public `
        root@${SERVER}:${REMOTE_PATH}/
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ File copy failed!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "🔧 Restarting services on production server..." -ForegroundColor Yellow

# Restart the application
ssh -i $SSH_KEY root@$SERVER "cd $REMOTE_PATH && docker-compose down && docker-compose up -d"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Service restart failed!" -ForegroundColor Red
    exit 1
}

# Wait for services to start
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

# Check health
ssh -i $SSH_KEY root@$SERVER "cd $REMOTE_PATH && docker-compose ps"

# Test the application
Write-Host "🧪 Testing application..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://$SERVER:3000" -TimeoutSec 15
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Production deployment successful!" -ForegroundColor Green
        Write-Host "🌐 Application available at: http://$SERVER:3000" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️ Application started but returned status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Application test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "📊 Deployment Summary:" -ForegroundColor Magenta
ssh -i $SSH_KEY root@$SERVER "cd $REMOTE_PATH && echo 'Container Status:' && docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"
