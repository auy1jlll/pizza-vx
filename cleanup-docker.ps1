# 🧹 DOCKER CLEANUP SCRIPT
# Remove old/conflicting Docker files and organize production setup

Write-Host "🧹 Cleaning up old Docker files..." -ForegroundColor Yellow
Write-Host ""

# ============================================
# STEP 1: Backup old files (just in case)
# ============================================
$backupDir = "docker-backup-$(Get-Date -Format 'yyyy-MM-dd-HHmm')"
Write-Host "📦 Creating backup directory: $backupDir" -ForegroundColor Blue

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

# List of old/conflicting Docker files to backup and remove
$oldFiles = @(
    "Dockerfile",                          # Old basic Dockerfile
    "Dockerfile.dev",                      # Development Dockerfile  
    "Dockerfile.production",               # Old production Dockerfile
    "docker-compose.yml",                  # Basic compose file
    "docker-compose.dev.yml",              # Development compose
    "docker-compose.production.yml",       # Old production compose
    "docker-compose.prod.yml",             # Another production variant
    "deploy-docker.ps1"                    # Old deploy script
)

# ============================================
# STEP 2: Backup and remove old files
# ============================================
Write-Host "🔄 Processing old Docker files..." -ForegroundColor Yellow

foreach ($file in $oldFiles) {
    if (Test-Path $file) {
        Write-Host "   📋 Backing up: $file" -ForegroundColor Gray
        Copy-Item $file "$backupDir\" -ErrorAction SilentlyContinue
        
        Write-Host "   🗑️  Removing: $file" -ForegroundColor Red
        Remove-Item $file -Force -ErrorAction SilentlyContinue
        
        if (-not (Test-Path $file)) {
            Write-Host "   ✅ Removed: $file" -ForegroundColor Green
        }
    } else {
        Write-Host "   ⏭️  Not found: $file" -ForegroundColor Gray
    }
}

# ============================================
# STEP 3: Verify our clean production setup
# ============================================
Write-Host ""
Write-Host "🔍 Verifying clean Docker setup..." -ForegroundColor Yellow

$requiredFiles = @(
    "Dockerfile.optimized",                      # Our optimized production Dockerfile
    "docker-compose.production-ready.yml",      # Our production-ready compose
    "docker-deploy.ps1",                        # Our deployment script
    "deploy-to-server.ps1",                     # Server deployment script
    ".env.production.template",                 # Environment template
    ".dockerignore"                             # Docker ignore file
)

$allGood = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ Found: $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Missing: $file" -ForegroundColor Red
        $allGood = $false
    }
}

# ============================================
# STEP 4: Create/Update .dockerignore
# ============================================
Write-Host ""
Write-Host "📝 Updating .dockerignore..." -ForegroundColor Yellow

$dockerignoreContent = @"
# 🚀 PRODUCTION DOCKER IGNORE
# Optimized for pizza restaurant app

# Development files
.env.local
.env.development
.env.test
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Node modules and build cache
node_modules
.npm
.next
out
dist

# IDE and editor files
.vscode
.idea
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Git files
.git
.gitignore
.gitattributes

# Documentation and non-production files
README.md
*.md
docs/
CHANGELOG.md
LICENSE

# Test files
__tests__/
*.test.js
*.test.ts
*.spec.js
*.spec.ts
coverage/
.nyc_output
jest.config.js
playwright.config.ts

# Development Docker files (we only want production)
Dockerfile.dev
Dockerfile.production
docker-compose.yml
docker-compose.dev.yml
docker-compose.production.yml
docker-compose.prod.yml

# Backup and temporary files
docker-backup-*
*.tmp
*.temp
*.bak
*.orig

# Logs
logs
*.log

# Database dumps and backups (too large for Docker context)
*.sql
*.dump
backups/
data-backups/

# Environment files (use mounted secrets instead)
.env
.env.production
.env.staging

# Scripts and tools (not needed in container)
scripts/
dev-tools/
deployment/
.workspace-state.json

# Large media files
*.mp4
*.avi
*.mov
*.wmv
*.flv
*.webm
"@

Set-Content -Path ".dockerignore" -Value $dockerignoreContent -Encoding UTF8
Write-Host "   ✅ Updated .dockerignore" -ForegroundColor Green

# ============================================
# STEP 5: Final verification and summary
# ============================================
Write-Host ""
Write-Host "📊 CLEANUP SUMMARY" -ForegroundColor Blue
Write-Host "=================" -ForegroundColor Blue

# Count backed up files
$backedUpFiles = Get-ChildItem -Path $backupDir -ErrorAction SilentlyContinue | Measure-Object
Write-Host "   📦 Files backed up: $($backedUpFiles.Count)" -ForegroundColor Gray

# List remaining Docker files
Write-Host ""
Write-Host "   🐳 Current Docker files:" -ForegroundColor Green
Get-ChildItem -Path "." -Filter "*docker*" | ForEach-Object {
    Write-Host "      ✅ $($_.Name)" -ForegroundColor Green
}

Get-ChildItem -Path "." -Filter "Dockerfile*" | ForEach-Object {
    Write-Host "      ✅ $($_.Name)" -ForegroundColor Green
}

Write-Host ""
if ($allGood) {
    Write-Host "🎉 CLEANUP SUCCESSFUL! 🚀" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ Production Docker Setup:" -ForegroundColor Green
    Write-Host "   • Dockerfile.optimized (Production build)" -ForegroundColor Gray
    Write-Host "   • docker-compose.production-ready.yml (Production stack)" -ForegroundColor Gray
    Write-Host "   • docker-deploy.ps1 (Local deployment)" -ForegroundColor Gray
    Write-Host "   • deploy-to-server.ps1 (Server deployment)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🚀 Ready to deploy with:" -ForegroundColor Yellow
    Write-Host "   .\docker-deploy.ps1" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "⚠️  Some required files are missing!" -ForegroundColor Yellow
    Write-Host "Please ensure all production Docker files are present." -ForegroundColor Gray
}

Write-Host "📂 Backup location: $backupDir" -ForegroundColor Gray
Write-Host "   (You can delete this folder once you verify everything works)" -ForegroundColor Gray
