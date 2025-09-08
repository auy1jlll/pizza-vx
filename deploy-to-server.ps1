# 🚀 SERVER DEPLOYMENT SCRIPT
# Deploy your Docker containers to a remote server

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$true)]
    [string]$ServerUser,
    
    [Parameter(Mandatory=$false)]
    [string]$SSHKey = "",
    
    [Parameter(Mandatory=$false)]
    [string]$DeployPath = "/opt/pizza-app",
    
    [Parameter(Mandatory=$false)]
    [string]$Version = "latest"
)

Write-Host "🚀 Deploying Pizza App to Server: $ServerIP" -ForegroundColor Blue
Write-Host ""

# ============================================
# STEP 1: Build and Export Docker Image
# ============================================
Write-Host "📦 Building and exporting Docker image..." -ForegroundColor Yellow

# Build the image locally
$imageName = "pizza-app:$Version"
docker build -f Dockerfile.optimized -t $imageName .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build Docker image" -ForegroundColor Red
    exit 1
}

# Export image to tar file
$imageFile = "pizza-app-$Version.tar"
Write-Host "💾 Exporting image to $imageFile..."
docker save $imageName -o $imageFile

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to export Docker image" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Image exported successfully" -ForegroundColor Green

# ============================================
# STEP 2: Prepare Deployment Files
# ============================================
Write-Host ""
Write-Host "📋 Preparing deployment files..." -ForegroundColor Yellow

# Create deployment package
$deployDir = "deploy-package"
$deployTar = "pizza-app-deploy.tar.gz"

if (Test-Path $deployDir) {
    Remove-Item $deployDir -Recurse -Force
}

New-Item -ItemType Directory -Path $deployDir | Out-Null

# Copy necessary files
Copy-Item "docker-compose.production-ready.yml" "$deployDir/"
Copy-Item ".env.production.template" "$deployDir/"
Copy-Item "docker-deploy.ps1" "$deployDir/"
Copy-Item $imageFile "$deployDir/"

# Create deployment tar
tar -czf $deployTar -C $deployDir .

Write-Host "✅ Deployment package created: $deployTar" -ForegroundColor Green

# ============================================
# STEP 3: Upload to Server
# ============================================
Write-Host ""
Write-Host "📤 Uploading to server..." -ForegroundColor Yellow

# Prepare SSH command
$sshCmd = if ($SSHKey) { "ssh -i `"$SSHKey`" $ServerUser@$ServerIP" } else { "ssh $ServerUser@$ServerIP" }
$scpCmd = if ($SSHKey) { "scp -i `"$SSHKey`"" } else { "scp" }

# Create deployment directory on server
Write-Host "📁 Creating deployment directory on server..."
& $sshCmd "sudo mkdir -p $DeployPath && sudo chown $ServerUser $DeployPath"

# Upload deployment package
Write-Host "📤 Uploading deployment package..."
& $scpCmd $deployTar "$ServerUser@${ServerIP}:$DeployPath/"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to upload deployment package" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Upload completed" -ForegroundColor Green

# ============================================
# STEP 4: Deploy on Server
# ============================================
Write-Host ""
Write-Host "🚀 Deploying on server..." -ForegroundColor Yellow

$remoteDeployScript = @"
cd $DeployPath
echo "📦 Extracting deployment package..."
tar -xzf pizza-app-deploy.tar.gz
echo "🐳 Loading Docker image..."
docker load -i pizza-app-$Version.tar
echo "📋 Setting up environment..."
if [ ! -f .env.production ]; then
    cp .env.production.template .env.production
    echo "⚠️  Please edit .env.production with your settings"
fi
echo "🛑 Stopping existing containers..."
docker compose -f docker-compose.production-ready.yml down 2>/dev/null || true
echo "🚀 Starting new deployment..."
docker compose -f docker-compose.production-ready.yml up -d
echo "⏳ Waiting for health check..."
sleep 20
if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
    echo "✅ Deployment successful!"
    echo "🍕 Pizza app is now live at http://$(hostname -I | awk '{print $1}'):3000"
else
    echo "❌ Health check failed"
    docker compose -f docker-compose.production-ready.yml logs app --tail=20
    exit 1
fi
"@

# Execute remote deployment
& $sshCmd $remoteDeployScript

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 DEPLOYMENT SUCCESSFUL! 🍕" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Server Information:"
    Write-Host "   • Server: $ServerIP"
    Write-Host "   • Path: $DeployPath"
    Write-Host "   • URL: http://$ServerIP:3000"
    Write-Host ""
    Write-Host "🛠️ Server Management:"
    Write-Host "   • SSH: ssh $ServerUser@$ServerIP"
    Write-Host "   • Logs: cd $DeployPath && docker compose logs -f"
    Write-Host "   • Stop: cd $DeployPath && docker compose down"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ DEPLOYMENT FAILED" -ForegroundColor Red
    Write-Host "Check the server logs for more details"
}

# ============================================
# CLEANUP
# ============================================
Write-Host "🧹 Cleaning up local files..." -ForegroundColor Yellow
Remove-Item $imageFile -Force -ErrorAction SilentlyContinue
Remove-Item $deployTar -Force -ErrorAction SilentlyContinue
Remove-Item $deployDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "✅ Cleanup completed" -ForegroundColor Green
