#!/usr/bin/env pwsh

Write-Host "🚀 COMPLETE PRODUCTION DEPLOYMENT SCRIPT" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Configuration
$SERVER_IP = "91.99.194.255"
$SSH_KEY = "C:\Users\auy1j\.ssh\hetzner-pizza-key"
$REMOTE_PATH = "/opt/pizza-app"

# Step 1: Test SSH Connection
Write-Host "📡 Testing SSH connection..." -ForegroundColor Yellow
try {
    $sshTest = ssh -i $SSH_KEY -o ConnectTimeout=10 root@$SERVER_IP "echo 'SSH OK'"
    if ($sshTest -eq "SSH OK") {
        Write-Host "✅ SSH Connection successful" -ForegroundColor Green
    } else {
        throw "SSH connection failed"
    }
} catch {
    Write-Host "❌ SSH Connection failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "🔄 Trying to reconnect..." -ForegroundColor Yellow
    
    # Try multiple times
    for ($i = 1; $i -le 3; $i++) {
        Write-Host "Attempt $i of 3..." -ForegroundColor Yellow
        try {
            $result = ssh -i $SSH_KEY -o ConnectTimeout=15 root@$SERVER_IP "echo 'Connected'"
            if ($result -eq "Connected") {
                Write-Host "✅ SSH Connected on attempt $i" -ForegroundColor Green
                break
            }
        } catch {
            Write-Host "❌ Attempt $i failed" -ForegroundColor Red
            Start-Sleep -Seconds 5
        }
    }
}

# Step 2: Clean up local environment
Write-Host "🧹 Cleaning local environment..." -ForegroundColor Yellow
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue

# Step 3: Copy all files to production
Write-Host "📁 Copying files to production..." -ForegroundColor Yellow
$filesToCopy = @(
    "Dockerfile",
    "docker-compose.yml", 
    ".env.production",
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "tailwind.config.ts",
    "tsconfig.json",
    "src",
    "prisma",
    "public"
)

foreach ($file in $filesToCopy) {
    if (Test-Path $file) {
        Write-Host "Copying $file..." -ForegroundColor Gray
        scp -i $SSH_KEY -r $file root@${SERVER_IP}:${REMOTE_PATH}/
    } else {
        Write-Host "⚠️ File not found: $file" -ForegroundColor Yellow
    }
}

# Step 4: Setup production environment
Write-Host "⚙️ Setting up production environment..." -ForegroundColor Yellow

# Create the deployment commands
$commands = @"
cd $REMOTE_PATH
echo "📦 Current directory contents:"
ls -la

echo "🐳 Stopping existing containers..."
docker-compose down --remove-orphans

echo "🔧 Fixing docker-compose.yml..."
sed -i 's/Dockerfile.optimized/Dockerfile/g' docker-compose.yml

echo "🏗️ Building application..."
docker-compose build --no-cache app

echo "🚀 Starting application..."
docker-compose up -d

echo "⏰ Waiting for app to start..."
sleep 30

echo "🔍 Checking container status..."
docker-compose ps

echo "📊 Checking logs..."
docker-compose logs app --tail=20

echo "🌐 Testing API endpoint..."
curl -s http://localhost:3000/api/specialty-pizzas | head -100
"@

# Execute commands on production server
Write-Host "🎯 Executing deployment commands..." -ForegroundColor Yellow
ssh -i $SSH_KEY root@$SERVER_IP $commands

# Step 5: Test production deployment
Write-Host "🧪 Testing production deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

try {
    $response = Invoke-RestMethod -Uri "http://${SERVER_IP}:3000/api/specialty-pizzas" -Method GET -TimeoutSec 30
    if ($response.data) {
        Write-Host "✅ PRODUCTION IS LIVE! Found $($response.data.Count) specialty pizzas" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Production responding but no data" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Production test failed: $($_.Exception.Message)" -ForegroundColor Red
    
    # Get more debugging info
    Write-Host "🔍 Getting debug information..." -ForegroundColor Yellow
    ssh -i $SSH_KEY root@$SERVER_IP "cd $REMOTE_PATH && docker-compose logs app --tail=50"
}

# Step 6: Final status report
Write-Host "`n📋 DEPLOYMENT SUMMARY" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host "Local Dev Server: http://localhost:3000" -ForegroundColor Green
Write-Host "Production Server: http://${SERVER_IP}:3000" -ForegroundColor Green

try {
    $localTest = Invoke-RestMethod -Uri "http://localhost:3000/api/settings" -Method GET
    Write-Host "✅ Local: $($localTest.settings.app_name)" -ForegroundColor Green
} catch {
    Write-Host "❌ Local server not responding" -ForegroundColor Red
}

try {
    $prodTest = Invoke-RestMethod -Uri "http://${SERVER_IP}:3000/api/settings" -Method GET
    Write-Host "✅ Production: $($prodTest.settings.app_name)" -ForegroundColor Green
} catch {
    Write-Host "❌ Production server not responding" -ForegroundColor Red
}

Write-Host "`n🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Cyan
