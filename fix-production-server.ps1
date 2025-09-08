#!/usr/bin/env pwsh

Write-Host "🔧 PRODUCTION SERVER RECOVERY SCRIPT" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Kill any hanging SSH processes
Write-Host "1. Cleaning up SSH processes..." -ForegroundColor Yellow
Get-Process -Name "ssh" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Test basic connectivity
Write-Host "2. Testing basic connectivity..." -ForegroundColor Yellow
$pingResult = Test-NetConnection -ComputerName 91.99.194.255 -InformationLevel Quiet -ErrorAction SilentlyContinue
if ($pingResult) {
    Write-Host "   ✅ Server is reachable" -ForegroundColor Green
} else {
    Write-Host "   ❌ Server is not reachable" -ForegroundColor Red
    exit 1
}

# Test SSH port
Write-Host "3. Testing SSH port..." -ForegroundColor Yellow
$sshTest = Test-NetConnection -ComputerName 91.99.194.255 -Port 22 -InformationLevel Quiet -ErrorAction SilentlyContinue
if ($sshTest) {
    Write-Host "   ✅ SSH port is open" -ForegroundColor Green
} else {
    Write-Host "   ❌ SSH port is not accessible" -ForegroundColor Red
    exit 1
}

# Test SSH connection
Write-Host "4. Testing SSH authentication..." -ForegroundColor Yellow
try {
    $sshTestResult = ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" -o ConnectTimeout=10 -o BatchMode=yes root@91.99.194.255 "echo 'SSH OK'"
    if ($sshTestResult -eq "SSH OK") {
        Write-Host "   ✅ SSH authentication successful" -ForegroundColor Green
    } else {
        Write-Host "   ❌ SSH authentication failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ SSH connection error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Check Docker containers status
Write-Host "5. Checking Docker containers..." -ForegroundColor Yellow
try {
    $containerStatus = ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" -o ConnectTimeout=10 root@91.99.194.255 "cd /opt/pizza-app && docker-compose ps --format table"
    Write-Host "Container Status:" -ForegroundColor Cyan
    Write-Host $containerStatus
} catch {
    Write-Host "   ❌ Failed to check containers: $($_.Exception.Message)" -ForegroundColor Red
}

# Test production API
Write-Host "6. Testing production API..." -ForegroundColor Yellow
try {
    $apiTest = Invoke-RestMethod -Uri "http://91.99.194.255:3000/api/health" -Method GET -TimeoutSec 10 -ErrorAction Stop
    Write-Host "   ✅ Production API is responding" -ForegroundColor Green
    Write-Host "   Response: $apiTest" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Production API not responding: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try to restart containers
    Write-Host "7. Attempting to restart containers..." -ForegroundColor Yellow
    try {
        ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" -o ConnectTimeout=10 root@91.99.194.255 "cd /opt/pizza-app && docker-compose down && docker-compose up -d"
        Write-Host "   ✅ Containers restart initiated" -ForegroundColor Green
        
        # Wait and test again
        Write-Host "   Waiting 30 seconds for startup..." -ForegroundColor Yellow
        Start-Sleep -Seconds 30
        
        try {
            $apiTest2 = Invoke-RestMethod -Uri "http://91.99.194.255:3000/api/health" -Method GET -TimeoutSec 10
            Write-Host "   ✅ Production API now responding after restart" -ForegroundColor Green
        } catch {
            Write-Host "   ❌ Production API still not responding after restart" -ForegroundColor Red
        }
    } catch {
        Write-Host "   ❌ Failed to restart containers: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "=====================================" -ForegroundColor Green
Write-Host "🏁 PRODUCTION SERVER CHECK COMPLETE" -ForegroundColor Green
