# 🔍 DOCKER SETUP VERIFICATION
# Final check before deployment

Write-Host "🚀 PRODUCTION DOCKER SETUP VERIFICATION" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

# ============================================
# DOCKER ENVIRONMENT CHECK
# ============================================
Write-Host "🐳 Docker Environment:" -ForegroundColor Blue
try {
    $dockerVersion = docker --version
    Write-Host "   ✅ $dockerVersion" -ForegroundColor Green
    
    $composeVersion = docker-compose --version
    Write-Host "   ✅ $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Docker not available!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ============================================
# PRODUCTION FILES CHECK
# ============================================
Write-Host "📁 Production Files:" -ForegroundColor Blue

$productionFiles = @{
    "Dockerfile" = "Production-ready multi-stage build"
    "docker-compose.yml" = "Complete production stack with PostgreSQL"
    ".dockerignore" = "Optimized ignore patterns"
    "docker-deploy.ps1" = "Local deployment script"
    "deploy-to-server.ps1" = "Server deployment script"
    ".env.production.template" = "Environment template"
    "DOCKER_DEPLOYMENT_GUIDE.md" = "Deployment documentation"
}

$allFilesPresent = $true
foreach ($file in $productionFiles.Keys) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file - $($productionFiles[$file])" -ForegroundColor Green
    } else {
        Write-Host "   ❌ MISSING: $file" -ForegroundColor Red
        $allFilesPresent = $false
    }
}

Write-Host ""

# ============================================
# DOCKER FILE VALIDATION
# ============================================
Write-Host "🔧 Dockerfile Validation:" -ForegroundColor Blue

try {
    $dockerfileContent = Get-Content "Dockerfile" -Raw
    
    # Check for multi-stage build
    if ($dockerfileContent -match "FROM.*AS.*builder") {
        Write-Host "   ✅ Multi-stage build detected" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  No multi-stage build pattern found" -ForegroundColor Yellow
    }
    
    # Check for production optimizations
    if ($dockerfileContent -match "NODE_ENV=production") {
        Write-Host "   ✅ Production environment configured" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  No production environment setting found" -ForegroundColor Yellow
    }
    
    # Check for health check
    if ($dockerfileContent -match "HEALTHCHECK") {
        Write-Host "   ✅ Health check configured" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  No health check found" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "   ❌ Error reading Dockerfile" -ForegroundColor Red
}

Write-Host ""

# ============================================
# COMPOSE FILE VALIDATION
# ============================================
Write-Host "🔧 Docker Compose Validation:" -ForegroundColor Blue

try {
    # Validate compose file syntax
    docker-compose -f docker-compose.yml config | Out-Null
    Write-Host "   ✅ Compose file syntax valid" -ForegroundColor Green
    
    # Check for required services
    $composeContent = Get-Content "docker-compose.yml" -Raw
    
    if ($composeContent -match "pizza-app:") {
        Write-Host "   ✅ Pizza app service configured" -ForegroundColor Green
    }
    
    if ($composeContent -match "postgres:") {
        Write-Host "   ✅ PostgreSQL database service configured" -ForegroundColor Green
    }
    
    if ($composeContent -match "healthcheck:") {
        Write-Host "   ✅ Health checks configured" -ForegroundColor Green
    }
    
    if ($composeContent -match "restart:.*unless-stopped") {
        Write-Host "   ✅ Restart policy configured" -ForegroundColor Green
    }
    
} catch {
    Write-Host "   ❌ Compose file validation failed" -ForegroundColor Red
}

Write-Host ""

# ============================================
# ENVIRONMENT CHECK
# ============================================
Write-Host "🌍 Environment Configuration:" -ForegroundColor Blue

if (Test-Path ".env.production.template") {
    $envTemplate = Get-Content ".env.production.template" -Raw
    
    # Check for required variables
    $requiredVars = @("DATABASE_URL", "NEXTAUTH_URL", "NEXTAUTH_SECRET")
    
    foreach ($var in $requiredVars) {
        if ($envTemplate -match $var) {
            Write-Host "   ✅ $var template found" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  $var template missing" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "   ⚠️  Environment template not found" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# OLD FILES CHECK (SHOULD BE GONE)
# ============================================
Write-Host "🧹 Legacy Files Check:" -ForegroundColor Blue

$legacyFiles = @(
    "Dockerfile.dev",
    "Dockerfile.production", 
    "Dockerfile.optimized",
    "docker-compose.dev.yml",
    "docker-compose.production.yml",
    "docker-compose.prod.yml"
)

$legacyFound = $false
foreach ($file in $legacyFiles) {
    if (Test-Path $file) {
        Write-Host "   ⚠️  Legacy file still present: $file" -ForegroundColor Yellow
        $legacyFound = $true
    }
}

if (-not $legacyFound) {
    Write-Host "   ✅ All legacy files cleaned up" -ForegroundColor Green
}

Write-Host ""

# ============================================
# FINAL VERDICT
# ============================================
if ($allFilesPresent -and -not $legacyFound) {
    Write-Host "🎉 DOCKER SETUP IS PRODUCTION READY! 🚀" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Local test: .\docker-deploy.ps1" -ForegroundColor Cyan
    Write-Host "   2. Server deploy: .\deploy-to-server.ps1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📖 Full guide: DOCKER_DEPLOYMENT_GUIDE.md" -ForegroundColor Gray
    
} else {
    Write-Host "⚠️  SETUP NEEDS ATTENTION" -ForegroundColor Yellow
    Write-Host "Please review the issues above before deployment." -ForegroundColor Gray
}

Write-Host ""
Write-Host "🏁 Verification Complete" -ForegroundColor Blue
