#!/usr/bin/env pwsh

# 🎯 COMPLETE CONTAINER DEPLOYMENT WORKFLOW
# End-to-end containerized deployment system

param(
    [string]$Version,
    [switch]$SkipBuild,
    [switch]$SkipTest,
    [switch]$AutoDeploy
)

if (-not $Version) {
    $Version = "v$(Get-Date -Format 'yyyy.MM.dd.HHmm')"
}

Write-Host "🎯 COMPLETE CONTAINER DEPLOYMENT WORKFLOW" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📦 Version: $Version" -ForegroundColor White
Write-Host "🏗️ Build: $(-not $SkipBuild)" -ForegroundColor White
Write-Host "🧪 Test: $(-not $SkipTest)" -ForegroundColor White
Write-Host "🚀 Auto Deploy: $AutoDeploy" -ForegroundColor White
Write-Host ""

# Phase 1: Build Container
if (-not $SkipBuild) {
    Write-Host "=" * 50 -ForegroundColor Cyan
    Write-Host "PHASE 1: BUILDING CONTAINER" -ForegroundColor Cyan
    Write-Host "=" * 50 -ForegroundColor Cyan
    
    $testFlag = if ($SkipTest) { "-SkipTest" } else { "" }
    
    Write-Host "🏗️ Running: .\build-container.ps1 -Version $Version $testFlag" -ForegroundColor Yellow
    
    & .\build-container.ps1 -Version $Version $(if ($SkipTest) { "-SkipTest" })
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Container build failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Container build completed successfully!" -ForegroundColor Green
} else {
    Write-Host "⏭️ Skipping build phase" -ForegroundColor Yellow
}

# Phase 2: Deploy to Production
if ($AutoDeploy) {
    Write-Host ""
    Write-Host "=" * 50 -ForegroundColor Cyan
    Write-Host "PHASE 2: DEPLOYING TO PRODUCTION" -ForegroundColor Cyan
    Write-Host "=" * 50 -ForegroundColor Cyan
    
    Write-Host "🚀 Running: .\deploy-container.ps1 -Version $Version" -ForegroundColor Yellow
    
    & .\deploy-container.ps1 -Version $Version
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Production deployment successful!" -ForegroundColor Green
    } else {
        Write-Host "❌ Production deployment failed!" -ForegroundColor Red
        
        $rollback = Read-Host "🔄 Would you like to rollback? (y/n)"
        if ($rollback -eq "y" -or $rollback -eq "Y") {
            & .\rollback-container.ps1
        }
        exit 1
    }
} else {
    Write-Host ""
    Write-Host "⏭️ Skipping auto-deploy. Run manually:" -ForegroundColor Yellow
    Write-Host "   .\deploy-container.ps1 -Version $Version" -ForegroundColor White
}

# Phase 3: Summary
Write-Host ""
Write-Host "🎉 DEPLOYMENT WORKFLOW COMPLETE!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 SUMMARY:" -ForegroundColor Cyan
Write-Host "   Version: $Version" -ForegroundColor White
Write-Host "   Build: $(if (-not $SkipBuild) { "✅ Completed" } else { "⏭️ Skipped" })" -ForegroundColor White
Write-Host "   Test: $(if (-not $SkipTest) { "✅ Completed" } else { "⏭️ Skipped" })" -ForegroundColor White
Write-Host "   Deploy: $(if ($AutoDeploy) { "✅ Completed" } else { "⏭️ Manual" })" -ForegroundColor White
Write-Host ""

if ($AutoDeploy) {
    Write-Host "🌐 PRODUCTION ACCESS:" -ForegroundColor Cyan
    Write-Host "   URL: http://91.99.194.255:3000" -ForegroundColor White
    Write-Host "   Container: pizza-app:$Version" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 MANAGEMENT COMMANDS:" -ForegroundColor Cyan
    Write-Host "   Rollback: .\rollback-container.ps1" -ForegroundColor White
    Write-Host "   Logs: ssh root@91.99.194.255 'docker logs pizza-app-production -f'" -ForegroundColor White
}

Write-Host ""
Write-Host "🚀 Ready for production!" -ForegroundColor Yellow
