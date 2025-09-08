# Optimized Deployment Script
# Cleans up before deploying to prevent storage bloat

param(
    [switch]$SkipCleanup,
    [switch]$ForceCleanup
)

Write-Host "🚀 Optimized Production Deployment" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Step 1: Cleanup old Docker images if not skipped
if (-not $SkipCleanup) {
    Write-Host "`n🧹 Pre-deployment cleanup..." -ForegroundColor Yellow
    
    if ($ForceCleanup) {
        Write-Host "⚠️ Force cleanup mode - removing ALL unused Docker resources" -ForegroundColor Red
        ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "docker system prune -a -f --volumes"
    } else {
        Write-Host "🗑️ Standard cleanup - removing unused resources" -ForegroundColor Cyan
        ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "docker system prune -f"
        ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "docker image prune -f"
        # Remove old pizza-app images (keep only latest)
        ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "docker images pizza-app_app --format '{{.ID}} {{.CreatedAt}}' | sort -k2 -r | tail -n +2 | awk '{print \$1}' | xargs -r docker rmi -f"
    }
}

# Step 2: Transfer only essential files
Write-Host "`n📁 Deploying essential files only..." -ForegroundColor Cyan
$essentialFiles = @(
    "Dockerfile",
    "docker-compose.yml", 
    ".env.production",
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "tailwind.config.ts",
    "tsconfig.json"
)

$essentialDirs = @("src", "prisma", "public")

# Transfer config files
foreach ($file in $essentialFiles) {
    if (Test-Path $file) {
        Write-Host "📄 Transferring $file"
        scp -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" $file root@91.99.194.255:/opt/pizza-app/
    }
}

# Transfer directories
foreach ($dir in $essentialDirs) {
    if (Test-Path $dir) {
        Write-Host "📂 Transferring $dir/"
        scp -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" -r $dir root@91.99.194.255:/opt/pizza-app/
    }
}

# Step 3: Build and deploy
Write-Host "`n🔨 Building and deploying..." -ForegroundColor Green
ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "cd /opt/pizza-app && docker-compose down"
ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "cd /opt/pizza-app && docker-compose build --no-cache app"
ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "cd /opt/pizza-app && docker-compose up -d"

# Step 4: Post-deployment cleanup
Write-Host "`n🧹 Post-deployment cleanup..." -ForegroundColor Yellow
ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "docker image prune -f"

# Step 5: Show final status
Write-Host "`n📊 Final Docker usage:" -ForegroundColor Green
ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "docker system df"

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Check: http://91.99.194.255:3000" -ForegroundColor Cyan
