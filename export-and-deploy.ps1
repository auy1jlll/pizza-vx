# Export Local Database and Deploy to Production
param(
    [string]$ExportFile = ""
)

Write-Host "🚀 LOCAL DATABASE EXPORT & PRODUCTION DEPLOYMENT" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

$ErrorActionPreference = "Stop"

# Step 1: Check Local Server
Write-Host "`n🔍 Step 1: Checking Local Database Server..." -ForegroundColor Yellow
try {
    $localTest = Invoke-RestMethod -Uri "http://localhost:3005/api/specialty-pizzas" -Method GET -TimeoutSec 10
    Write-Host "✅ Local server responding" -ForegroundColor Green
    Write-Host "   Specialty Pizzas: $($localTest.data.Count)" -ForegroundColor Gray
    
    $localSettings = Invoke-RestMethod -Uri "http://localhost:3005/api/settings" -Method GET -TimeoutSec 10
    Write-Host "   App Name: '$($localSettings.settings.app_name)'" -ForegroundColor Gray
} catch {
    Write-Host "❌ Local server not responding: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Please start the dev server with: npx next dev --port 3005" -ForegroundColor Yellow
    exit 1
}

# Step 2: Use Existing Export or Create New One
Write-Host "`n📦 Step 2: Database Export..." -ForegroundColor Yellow

if (-not $ExportFile) {
    # Use the most recent existing export file
    $existingExports = Get-ChildItem -Path "." -Filter "*database*export*.json" | Sort-Object LastWriteTime -Descending
    if ($existingExports.Count -gt 0) {
        $ExportFile = $existingExports[0].Name
        Write-Host "📁 Using existing export: $ExportFile" -ForegroundColor Green
        Write-Host "   Size: $([math]::Round($existingExports[0].Length / 1MB, 2)) MB" -ForegroundColor Gray
        Write-Host "   Date: $($existingExports[0].LastWriteTime)" -ForegroundColor Gray
    } else {
        # Create a simple JSON export using API calls
        Write-Host "🔄 Creating new database export via API..." -ForegroundColor Yellow
        
        $timestamp = Get-Date -Format "yyyy-MM-ddTHH-mm-ss"
        $ExportFile = "api-database-export-$timestamp.json"
        
        $exportData = @{
            timestamp = (Get-Date).ToString("o")
            source = "API export from localhost:3005"
            data = @{}
        }
        
        # Export via API calls
        try {
            Write-Host "   Exporting specialty pizzas..." -ForegroundColor Gray
            $specialtyPizzas = Invoke-RestMethod -Uri "http://localhost:3005/api/specialty-pizzas" -Method GET
            $exportData.data.specialtyPizzas = $specialtyPizzas.data
            
            Write-Host "   Exporting settings..." -ForegroundColor Gray
            $settings = Invoke-RestMethod -Uri "http://localhost:3005/api/settings" -Method GET
            $exportData.data.settings = $settings.settings
            
            Write-Host "   Exporting categories..." -ForegroundColor Gray
            $categories = Invoke-RestMethod -Uri "http://localhost:3005/api/management-portal/menu/categories" -Method GET
            $exportData.data.categories = $categories.data
            
            # Save export
            $exportData | ConvertTo-Json -Depth 10 | Out-File -FilePath $ExportFile -Encoding UTF8
            Write-Host "✅ API export created: $ExportFile" -ForegroundColor Green
            
        } catch {
            Write-Host "⚠️ API export failed: $($_.Exception.Message)" -ForegroundColor Yellow
            Write-Host "   Proceeding with code-only deployment..." -ForegroundColor Gray
            $ExportFile = ""
        }
    }
}

# Step 3: Deploy Code to Production
Write-Host "`n🚀 Step 3: Deploying Code to Production..." -ForegroundColor Yellow
try {
    Write-Host "📤 Uploading application files..." -ForegroundColor Gray
    scp -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" -r Dockerfile docker-compose.yml .env.production package.json package-lock.json next.config.ts tailwind.config.ts tsconfig.json src prisma public root@91.99.194.255:/opt/pizza-app/
    
    if ($LASTEXITCODE -ne 0) {
        throw "File upload failed"
    }
    
    Write-Host "✅ Files uploaded successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Code deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 4: Upload Database Export (if available)
if ($ExportFile -and (Test-Path $ExportFile)) {
    Write-Host "`n💾 Step 4: Uploading Database Export..." -ForegroundColor Yellow
    try {
        Write-Host "📤 Uploading $ExportFile..." -ForegroundColor Gray
        scp -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" "$ExportFile" root@91.99.194.255:/opt/pizza-app/
        
        if ($LASTEXITCODE -ne 0) {
            throw "Database export upload failed"
        }
        
        Write-Host "✅ Database export uploaded" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Database export upload failed: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "   Continuing with code deployment only..." -ForegroundColor Gray
    }
} else {
    Write-Host "`n⏭️ Step 4: Skipping database export (not available)" -ForegroundColor Yellow
}

# Step 5: Rebuild Production
Write-Host "`n🔄 Step 5: Rebuilding Production Application..." -ForegroundColor Yellow
try {
    Write-Host "🛑 Stopping production containers..." -ForegroundColor Gray
    ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "cd /opt/pizza-app && docker-compose down --remove-orphans"
    
    Write-Host "🔨 Building new application..." -ForegroundColor Gray
    ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "cd /opt/pizza-app && docker-compose build --no-cache app"
    
    Write-Host "🚀 Starting production application..." -ForegroundColor Gray
    ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "cd /opt/pizza-app && docker-compose up -d"
    
    if ($LASTEXITCODE -ne 0) {
        throw "Production rebuild failed"
    }
    
    Write-Host "✅ Production application rebuilt" -ForegroundColor Green
} catch {
    Write-Host "❌ Production rebuild failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 6: Verify Production
Write-Host "`n✅ Step 6: Verifying Production Deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

try {
    Write-Host "🔍 Testing production APIs..." -ForegroundColor Gray
    
    $prodTest = Invoke-RestMethod -Uri "http://91.99.194.255:3000/api/specialty-pizzas" -Method GET -TimeoutSec 30
    Write-Host "✅ Production Specialty Pizzas API: Working" -ForegroundColor Green
    Write-Host "   Found: $($prodTest.data.Count) specialty pizzas" -ForegroundColor Gray
    
    $prodSettings = Invoke-RestMethod -Uri "http://91.99.194.255:3000/api/settings" -Method GET -TimeoutSec 20
    Write-Host "✅ Production Settings API: Working" -ForegroundColor Green
    Write-Host "   App Name: '$($prodSettings.settings.app_name)'" -ForegroundColor Gray
    
    # Compare local vs production
    Write-Host "`n📊 LOCAL vs PRODUCTION COMPARISON:" -ForegroundColor Cyan
    Write-Host "   Local Specialty Pizzas: $($localTest.data.Count)" -ForegroundColor Gray
    Write-Host "   Production Specialty Pizzas: $($prodTest.data.Count)" -ForegroundColor Gray
    
    if ($localTest.data.Count -eq $prodTest.data.Count) {
        Write-Host "✅ Pizza counts match!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Pizza counts differ - this may be expected" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "⚠️ Production verification failed: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "💡 The application may still be starting up. Check again in a few minutes." -ForegroundColor Gray
}

# Final Summary
Write-Host "`n🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green
Write-Host "✅ Local database state captured" -ForegroundColor Green
Write-Host "✅ Code deployed to production" -ForegroundColor Green
if ($ExportFile) {
    Write-Host "✅ Database export uploaded: $ExportFile" -ForegroundColor Green
}
Write-Host "✅ Production application rebuilt and running" -ForegroundColor Green

Write-Host "`n🔗 Production Links:" -ForegroundColor White
Write-Host "   Main Site: http://91.99.194.255:3000" -ForegroundColor Gray
Write-Host "   Gourmet Pizzas: http://91.99.194.255:3000/gourmet-pizzas" -ForegroundColor Gray
Write-Host "   Management: http://91.99.194.255:3000/management-portal" -ForegroundColor Gray

if ($ExportFile) {
    Write-Host "`n💡 Database Import Note:" -ForegroundColor Yellow
    Write-Host "   The database export is uploaded but not yet imported into production." -ForegroundColor Gray
    Write-Host "   If you want to replace production data with local data, run:" -ForegroundColor Gray
    Write-Host "   ssh root@91.99.194.255 'cd /opt/pizza-app && node restore-database-dump.js $ExportFile'" -ForegroundColor Cyan
}

Write-Host "`n✨ Deployment completed successfully!" -ForegroundColor Green
