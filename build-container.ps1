#!/usr/bin/env pwsh

# 🐳 DOCKER CONTAINER BUILD & TEST SYSTEM
# Creates production-ready containers and tests them locally

param(
    [string]$Version = "latest",
    [switch]$SkipTest,
    [switch]$Push,
    [string]$Registry = "localhost:5000"
)

$IMAGE_NAME = "pizza-app"
$FULL_IMAGE_NAME = "$Registry/$IMAGE_NAME"

Write-Host "🐳 DOCKER CONTAINER BUILD SYSTEM" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker availability
Write-Host "1️⃣ Checking Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    docker info | Out-Null
    Write-Host "   ✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Docker not available! Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Clean previous builds
Write-Host ""
Write-Host "2️⃣ Cleaning previous builds..." -ForegroundColor Yellow
docker system prune -f 2>$null
docker rmi "${FULL_IMAGE_NAME}:${Version}" 2>$null
Write-Host "   ✅ Previous builds cleaned" -ForegroundColor Green

# Build production container
Write-Host ""
Write-Host "3️⃣ Building production container..." -ForegroundColor Yellow
Write-Host "   📦 Image: ${FULL_IMAGE_NAME}:${Version}" -ForegroundColor White
Write-Host "   🏗️ Dockerfile: Dockerfile.production" -ForegroundColor White

$buildStart = Get-Date
docker build -f Dockerfile.production -t "${FULL_IMAGE_NAME}:${Version}" .

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Build failed!" -ForegroundColor Red
    exit 1
}

$buildTime = (Get-Date) - $buildStart
Write-Host "   ✅ Build completed in $($buildTime.TotalSeconds.ToString('F1'))s" -ForegroundColor Green

# Get image information
$imageSize = docker images "${FULL_IMAGE_NAME}:${Version}" --format "table {{.Size}}" | Select-Object -Skip 1
Write-Host "   📊 Image size: $imageSize" -ForegroundColor White

# Test container locally (unless skipped)
if (-not $SkipTest) {
    Write-Host ""
    Write-Host "4️⃣ Testing container locally..." -ForegroundColor Yellow
    
    # Stop any existing test container
    docker stop pizza-app-test 2>$null
    docker rm pizza-app-test 2>$null
    
    # Start test container
    Write-Host "   🚀 Starting test container on port 3002..." -ForegroundColor White
    docker run -d --name pizza-app-test -p 3002:3000 `
        -e DATABASE_URL="postgresql://auy1jll:_Zx-nake%406172@host.docker.internal:5432/pizzax?schema=public" `
        -e NEXTAUTH_SECRET="test-secret-key" `
        -e NEXTAUTH_URL="http://localhost:3002" `
        "${FULL_IMAGE_NAME}:${Version}"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Test container started" -ForegroundColor Green
        
        # Wait for container to be ready
        Write-Host "   ⏳ Waiting for container to be ready..." -ForegroundColor White
        $maxWait = 60
        $waited = 0
        
        do {
            Start-Sleep -Seconds 2
            $waited += 2
            $healthCheck = curl -s -o /dev/null -w "%{http_code}" http://localhost:3002 2>$null
            Write-Host "      Checking health... ($waited/$maxWait seconds)" -ForegroundColor Gray
        } while ($healthCheck -ne "200" -and $waited -lt $maxWait)
        
        if ($healthCheck -eq "200") {
            Write-Host "   ✅ Container is healthy and responding!" -ForegroundColor Green
            Write-Host "   🌐 Test URL: http://localhost:3002" -ForegroundColor White
            
            # Optional: Open browser
            $openTest = Read-Host "   🌐 Open test container in browser? (y/n)"
            if ($openTest -eq "y" -or $openTest -eq "Y") {
                Start-Process "http://localhost:3002"
            }
            
            # Ask to keep container running
            $keepRunning = Read-Host "   🐳 Keep test container running? (y/n)"
            if ($keepRunning -ne "y" -and $keepRunning -ne "Y") {
                Write-Host "   🛑 Stopping test container..." -ForegroundColor Yellow
                docker stop pizza-app-test
                docker rm pizza-app-test
            }
        } else {
            Write-Host "   ❌ Container failed health check!" -ForegroundColor Red
            Write-Host "   📄 Container logs:" -ForegroundColor Red
            docker logs pizza-app-test --tail 20
        }
    } else {
        Write-Host "   ❌ Failed to start test container!" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "4️⃣ Skipping local test (--SkipTest flag used)" -ForegroundColor Yellow
}

# Tag for production
Write-Host ""
Write-Host "5️⃣ Tagging for production..." -ForegroundColor Yellow
docker tag "${FULL_IMAGE_NAME}:${Version}" "${FULL_IMAGE_NAME}:latest"
Write-Host "   ✅ Tagged as latest" -ForegroundColor Green

# Display build summary
Write-Host ""
Write-Host "🎉 CONTAINER BUILD COMPLETE!" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host ""
Write-Host "📦 CONTAINER INFO:" -ForegroundColor Cyan
Write-Host "   Name: $FULL_IMAGE_NAME" -ForegroundColor White
Write-Host "   Version: $Version" -ForegroundColor White
Write-Host "   Size: $imageSize" -ForegroundColor White
Write-Host "   Build time: $($buildTime.TotalSeconds.ToString('F1'))s" -ForegroundColor White
Write-Host ""
Write-Host "🚀 DEPLOYMENT COMMANDS:" -ForegroundColor Cyan
Write-Host "   Local test:   docker run -p 3002:3000 ${FULL_IMAGE_NAME}:${Version}" -ForegroundColor White
Write-Host "   Save image:   docker save ${FULL_IMAGE_NAME}:${Version} > pizza-app-${Version}.tar" -ForegroundColor White
Write-Host "   Load on server: docker load < pizza-app-${Version}.tar" -ForegroundColor White
Write-Host ""
Write-Host "📁 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "   1. Test container locally at http://localhost:3002" -ForegroundColor White
Write-Host "   2. Use deploy-container.ps1 to push to production" -ForegroundColor White
Write-Host "   3. Monitor deployment with health checks" -ForegroundColor White

# Push to registry (if requested)
if ($Push) {
    Write-Host ""
    Write-Host "6️⃣ Pushing to registry..." -ForegroundColor Yellow
    docker push "${FULL_IMAGE_NAME}:${Version}"
    docker push "${FULL_IMAGE_NAME}:latest"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Pushed to registry successfully!" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Push failed!" -ForegroundColor Red
    }
}
