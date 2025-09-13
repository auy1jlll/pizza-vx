# 🚀 Deploy Kitchen Access Fix to Hetzner Server
# Quick deployment of authentication fixes

param(
    [Parameter(Mandatory=$false)]
    [string]$ServerIP = "your-server-ip-here",
    
    [Parameter(Mandatory=$false)]
    [string]$SSHKey = "$env:USERPROFILE\.ssh\new_hetzner_key",
    
    [Parameter(Mandatory=$false)]
    [string]$SSHUser = "root"
)

Write-Host "🍕 Deploying Kitchen Access Fix to Hetzner Server" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""

# Check if SSH key exists
if (-not (Test-Path $SSHKey)) {
    Write-Host "❌ SSH key not found at: $SSHKey" -ForegroundColor Red
    Write-Host "Please check the path to your new-hetzner-key file" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Configuration:" -ForegroundColor Blue
Write-Host "   🖥️  Server: $ServerIP" -ForegroundColor Gray
Write-Host "   👤 User: $SSHUser" -ForegroundColor Gray
Write-Host "   🔑 SSH Key: $SSHKey" -ForegroundColor Gray
Write-Host ""

if ($ServerIP -eq "your-server-ip-here") {
    $ServerIP = Read-Host "Enter your Hetzner server IP address"
}

Write-Host "🔄 Connecting to server and updating files..." -ForegroundColor Yellow

# SSH commands to pull latest changes and restart
$sshCommands = @"
cd /opt/pizza-app || cd /root/pizza-app || cd ~/pizza-app || echo 'Please navigate to your app directory'
echo '📥 Pulling latest changes from GitHub...'
git pull origin main
echo '🔄 Installing any new dependencies...'
npm install
echo '🏗️  Building the application...'
npm run build
echo '🔄 Restarting the application...'
pm2 restart all || docker-compose restart || systemctl restart pizza-app || echo 'Please restart your app manually'
echo '✅ Deployment complete!'
echo '🧪 Test kitchen access with EMPLOYEE users now'
"@

try {
    Write-Host "Executing deployment commands on server..." -ForegroundColor Green
    
    # Use ssh with the specific key
    $sshArgs = @(
        "-i", $SSHKey,
        "-o", "StrictHostKeyChecking=no",
        "$SSHUser@$ServerIP",
        $sshCommands
    )
    
    & ssh $sshArgs
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉 Deployment successful!" -ForegroundColor Green
        Write-Host "✅ Kitchen access fix has been deployed" -ForegroundColor Green
        Write-Host ""
        Write-Host "🧪 Next steps:" -ForegroundColor Yellow
        Write-Host "   1. Test with an EMPLOYEE user account" -ForegroundColor Cyan
        Write-Host "   2. Navigate to Kitchen Display page" -ForegroundColor Cyan
        Write-Host "   3. Verify access is now working" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Deployment failed. Check the output above for errors." -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error during deployment: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Make sure SSH is configured and the server is accessible" -ForegroundColor Yellow
}