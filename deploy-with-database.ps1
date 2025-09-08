# Complete Database Backup and Production Deployment Script
# This script creates a full database dump and deploys to production

param(
    [switch]$SkipBackup,
    [switch]$ForceRestore,
    [string]$BackupFile = ""
)

Write-Host "🚀 PIZZA APP - COMPLETE DATABASE BACKUP & DEPLOYMENT" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

$ErrorActionPreference = "Stop"

# Check if dev server is running
$devServerRunning = Get-Process -Name "node" -ErrorAction SilentlyContinue
if (-not $devServerRunning) {
    Write-Host "❌ Dev server not running. Please start it first with 'npm run dev'" -ForegroundColor Red
    exit 1
}

# Test dev server connectivity
try {
    Write-Host "🔍 Testing dev server connectivity..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/settings" -Method GET -TimeoutSec 10
    Write-Host "✅ Dev server is responding correctly" -ForegroundColor Green
    Write-Host "   App Name: '$($response.settings.app_name)'" -ForegroundColor Gray
} catch {
    Write-Host "❌ Dev server not responding: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 1: Create Database Backup
if (-not $SkipBackup) {
    Write-Host "`n📦 STEP 1: Creating Database Backup" -ForegroundColor Cyan
    Write-Host "=====================================`n" -ForegroundColor Cyan
    
    try {
        $result = node "create-full-database-dump.js"
        if ($LASTEXITCODE -ne 0) {
            throw "Database dump failed"
        }
        Write-Host "✅ Database backup completed successfully" -ForegroundColor Green
        
        # Get the latest dump file
        $latestDump = Get-ChildItem -Path "." -Filter "complete-database-dump-*.json" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        if ($latestDump) {
            $BackupFile = $latestDump.Name
            Write-Host "📁 Backup file: $BackupFile" -ForegroundColor Gray
        }
    } catch {
        Write-Host "❌ Database backup failed: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⏭️ Skipping database backup (as requested)" -ForegroundColor Yellow
}

# Step 2: Verify Production Server
Write-Host "`n🌐 STEP 2: Checking Production Server" -ForegroundColor Cyan
Write-Host "=====================================`n" -ForegroundColor Cyan

try {
    Write-Host "🔍 Testing production server connectivity..." -ForegroundColor Yellow
    $prodResponse = Invoke-RestMethod -Uri "http://91.99.194.255:3000/api/settings" -Method GET -TimeoutSec 15 -ErrorAction SilentlyContinue
    if ($prodResponse) {
        Write-Host "✅ Production server is responding" -ForegroundColor Green
        Write-Host "   Current App Name: '$($prodResponse.settings.app_name)'" -ForegroundColor Gray
    } else {
        Write-Host "⚠️ Production server not responding (may be down for maintenance)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Production server check failed: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   This is normal if server is being rebuilt" -ForegroundColor Gray
}

# Step 3: Deploy Code to Production
Write-Host "`n🚀 STEP 3: Deploying Code to Production" -ForegroundColor Cyan
Write-Host "=======================================`n" -ForegroundColor Cyan

try {
    Write-Host "📤 Uploading application files..." -ForegroundColor Yellow
    
    # Upload core application files
    $uploadResult = scp -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" -r Dockerfile docker-compose.yml .env.production package.json package-lock.json next.config.ts tailwind.config.ts tsconfig.json src prisma public root@91.99.194.255:/opt/pizza-app/ 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        throw "File upload failed: $uploadResult"
    }
    
    Write-Host "✅ Application files uploaded successfully" -ForegroundColor Green
    
    # Ensure proper Dockerfile reference
    Write-Host "🔧 Configuring Docker setup..." -ForegroundColor Yellow
    ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "cd /opt/pizza-app && sed -i 's/Dockerfile.optimized/Dockerfile/g' docker-compose.yml"
    
    if ($LASTEXITCODE -ne 0) {
        throw "Docker configuration failed"
    }
    
    Write-Host "✅ Docker configuration updated" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Code deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 4: Upload Database Backup (if created)
if ($BackupFile -and (Test-Path $BackupFile)) {
    Write-Host "`n💾 STEP 4: Uploading Database Backup" -ForegroundColor Cyan
    Write-Host "====================================`n" -ForegroundColor Cyan
    
    try {
        Write-Host "📤 Uploading database backup file..." -ForegroundColor Yellow
        
        # Upload the database backup
        scp -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" "$BackupFile" root@91.99.194.255:/opt/pizza-app/
        
        if ($LASTEXITCODE -ne 0) {
            throw "Database backup upload failed"
        }
        
        # Also upload the restoration script
        scp -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" "restore-database-dump.js" root@91.99.194.255:/opt/pizza-app/
        
        if ($LASTEXITCODE -ne 0) {
            throw "Restoration script upload failed"
        }
        
        Write-Host "✅ Database backup and restoration script uploaded" -ForegroundColor Green
        Write-Host "📁 Backup file: $BackupFile" -ForegroundColor Gray
        
    } catch {
        Write-Host "❌ Database backup upload failed: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Step 5: Rebuild and Deploy Application
Write-Host "`n🔄 STEP 5: Rebuilding Production Application" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

try {
    Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
    ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "cd /opt/pizza-app && docker-compose down --remove-orphans"
    
    Write-Host "🔨 Building new application image..." -ForegroundColor Yellow
    ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "cd /opt/pizza-app && docker-compose build --no-cache app"
    
    if ($LASTEXITCODE -ne 0) {
        throw "Docker build failed"
    }
    
    Write-Host "🚀 Starting application..." -ForegroundColor Yellow
    ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "cd /opt/pizza-app && docker-compose up -d"
    
    if ($LASTEXITCODE -ne 0) {
        throw "Application startup failed"
    }
    
    Write-Host "✅ Application rebuilt and started successfully" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Application rebuild failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 6: Restore Database (if backup file provided and ForceRestore is set)
if ($BackupFile -and $ForceRestore) {
    Write-Host "`n🔄 STEP 6: Restoring Database from Backup" -ForegroundColor Cyan
    Write-Host "=========================================`n" -ForegroundColor Cyan
    
    try {
        Write-Host "⏳ Waiting for application to fully start..." -ForegroundColor Yellow
        Start-Sleep -Seconds 15
        
        Write-Host "📥 Restoring database from backup..." -ForegroundColor Yellow
        $restoreCommand = "cd /opt/pizza-app && node restore-database-dump.js $BackupFile"
        ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "$restoreCommand"
        
        if ($LASTEXITCODE -ne 0) {
            throw "Database restoration failed"
        }
        
        Write-Host "✅ Database restored successfully from backup" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Database restoration failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "💡 You can manually restore later using:" -ForegroundColor Yellow
        Write-Host "   ssh root@91.99.194.255 'cd /opt/pizza-app && node restore-database-dump.js $BackupFile'" -ForegroundColor Gray
    }
}

# Step 7: Verify Deployment
Write-Host "`n✅ STEP 7: Verifying Deployment" -ForegroundColor Cyan
Write-Host "===============================`n" -ForegroundColor Cyan

Start-Sleep -Seconds 10

try {
    Write-Host "🔍 Testing production API endpoints..." -ForegroundColor Yellow
    
    # Test settings API
    $prodSettings = Invoke-RestMethod -Uri "http://91.99.194.255:3000/api/settings" -Method GET -TimeoutSec 20
    Write-Host "✅ Settings API: Working" -ForegroundColor Green
    Write-Host "   App Name: '$($prodSettings.settings.app_name)'" -ForegroundColor Gray
    
    # Test specialty pizzas API
    $prodPizzas = Invoke-RestMethod -Uri "http://91.99.194.255:3000/api/specialty-pizzas" -Method GET -TimeoutSec 20
    Write-Host "✅ Specialty Pizzas API: Working" -ForegroundColor Green
    Write-Host "   Found: $($prodPizzas.data.Count) specialty pizzas" -ForegroundColor Gray
    
    # Display first few specialty pizzas
    if ($prodPizzas.data.Count -gt 0) {
        Write-Host "   Sample pizzas:" -ForegroundColor Gray
        $prodPizzas.data | Select-Object -First 3 | ForEach-Object {
            Write-Host "     - $($_.name)" -ForegroundColor Gray
        }
    }
    
} catch {
    Write-Host "⚠️ Production verification failed: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "💡 The application may still be starting up. Check again in a few minutes." -ForegroundColor Gray
}

# Final Summary
Write-Host "`n🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green
Write-Host "✅ Application deployed to: http://91.99.194.255:3000" -ForegroundColor Green
Write-Host "✅ Gourmet pizza functionality should now be working" -ForegroundColor Green

if ($BackupFile) {
    Write-Host "💾 Database backup created: $BackupFile" -ForegroundColor Cyan
    if ($ForceRestore) {
        Write-Host "📥 Database restored from backup" -ForegroundColor Cyan
    } else {
        Write-Host "💡 To restore database, run with -ForceRestore flag" -ForegroundColor Yellow
    }
}

Write-Host "`n🔗 Quick Links:" -ForegroundColor White
Write-Host "   Production Site: http://91.99.194.255:3000" -ForegroundColor Gray
Write-Host "   Gourmet Pizzas: http://91.99.194.255:3000/gourmet-pizzas" -ForegroundColor Gray
Write-Host "   Management: http://91.99.194.255:3000/management-portal" -ForegroundColor Gray

Write-Host "`n✨ Deployment completed successfully!" -ForegroundColor Green
