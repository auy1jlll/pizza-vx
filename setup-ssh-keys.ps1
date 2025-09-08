# 🔑 SSH KEY SETUP FOR HETZNER DEPLOYMENT
# Generate OpenSSH keys for secure server access

param(
    [Parameter(Mandatory=$false)]
    [string]$KeyName = "hetzner-pizza-key",
    
    [Parameter(Mandatory=$false)]
    [string]$KeyPath = "$env:USERPROFILE\.ssh",
    
    [Parameter(Mandatory=$false)]
    [string]$Email = ""
)

Write-Host "🔑 SSH KEY SETUP FOR HETZNER" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host ""

# ============================================
# CHECK OPENSSH AVAILABILITY
# ============================================
Write-Host "🔍 Checking OpenSSH availability..." -ForegroundColor Blue

try {
    $sshVersion = ssh -V 2>&1
    Write-Host "   ✅ OpenSSH found: $sshVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ OpenSSH not found!" -ForegroundColor Red
    Write-Host "   Installing OpenSSH..." -ForegroundColor Yellow
    
    # Install OpenSSH on Windows
    try {
        Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
        Write-Host "   ✅ OpenSSH Client installed" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  Please install OpenSSH manually:" -ForegroundColor Yellow
        Write-Host "      Settings > Apps > Optional Features > Add a feature > OpenSSH Client" -ForegroundColor Gray
        exit 1
    }
}

try {
    $sshKeygenVersion = ssh-keygen -h 2>&1
    Write-Host "   ✅ ssh-keygen available" -ForegroundColor Green
} catch {
    Write-Host "   ❌ ssh-keygen not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ============================================
# CREATE SSH DIRECTORY
# ============================================
Write-Host "📁 Setting up SSH directory..." -ForegroundColor Blue

if (-not (Test-Path $KeyPath)) {
    New-Item -ItemType Directory -Path $KeyPath -Force | Out-Null
    Write-Host "   ✅ Created SSH directory: $KeyPath" -ForegroundColor Green
} else {
    Write-Host "   ✅ SSH directory exists: $KeyPath" -ForegroundColor Green
}

# Set proper permissions on SSH directory (Windows)
try {
    icacls $KeyPath /inheritance:d /grant:r "$env:USERNAME:(OI)(CI)F" /remove "NT AUTHORITY\Authenticated Users" /remove "BUILTIN\Users" | Out-Null
    Write-Host "   ✅ SSH directory permissions set" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Could not set directory permissions (non-critical)" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# GENERATE SSH KEY PAIR
# ============================================
$privateKeyPath = Join-Path $KeyPath $KeyName
$publicKeyPath = "$privateKeyPath.pub"

Write-Host "🔐 Generating SSH key pair..." -ForegroundColor Blue
Write-Host "   Private key: $privateKeyPath" -ForegroundColor Gray
Write-Host "   Public key: $publicKeyPath" -ForegroundColor Gray

# Check if keys already exist
if ((Test-Path $privateKeyPath) -or (Test-Path $publicKeyPath)) {
    Write-Host ""
    Write-Host "   ⚠️  SSH keys already exist!" -ForegroundColor Yellow
    
    $overwrite = Read-Host "   Do you want to overwrite existing keys? (y/N)"
    if ($overwrite -ne 'y' -and $overwrite -ne 'Y') {
        Write-Host "   ✅ Using existing SSH keys" -ForegroundColor Green
        $keysGenerated = $false
    } else {
        Remove-Item $privateKeyPath -ErrorAction SilentlyContinue
        Remove-Item $publicKeyPath -ErrorAction SilentlyContinue
        $keysGenerated = $true
    }
} else {
    $keysGenerated = $true
}

if ($keysGenerated) {
    # Get email for key comment
    if (-not $Email) {
        $Email = Read-Host "   Enter your email for the SSH key comment (optional)"
        if (-not $Email) {
            $Email = "$env:USERNAME@pizza-deployment"
        }
    }

    # Generate the SSH key pair
    Write-Host "   🔄 Generating RSA 4096-bit key..." -ForegroundColor Gray
    
    try {
        # Use ssh-keygen to generate the key pair
        ssh-keygen -t rsa -b 4096 -C $Email -f $privateKeyPath -N '""'
        
        if ((Test-Path $privateKeyPath) -and (Test-Path $publicKeyPath)) {
            Write-Host "   ✅ SSH key pair generated successfully!" -ForegroundColor Green
        } else {
            throw "Key generation failed"
        }
    } catch {
        Write-Host "   ❌ Failed to generate SSH keys: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }

    # Set proper permissions on private key (Windows)
    try {
        icacls $privateKeyPath /inheritance:d /grant:r "$env:USERNAME:F" /remove "NT AUTHORITY\Authenticated Users" /remove "BUILTIN\Users" | Out-Null
        Write-Host "   ✅ Private key permissions set (user only)" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  Could not set private key permissions" -ForegroundColor Yellow
    }
}

Write-Host ""

# ============================================
# DISPLAY PUBLIC KEY
# ============================================
Write-Host "📋 Your SSH Public Key:" -ForegroundColor Blue
Write-Host "========================" -ForegroundColor Blue

if (Test-Path $publicKeyPath) {
    $publicKey = Get-Content $publicKeyPath -Raw
    Write-Host $publicKey -ForegroundColor Cyan
    
    # Copy to clipboard if possible
    try {
        $publicKey | Set-Clipboard
        Write-Host "✅ Public key copied to clipboard!" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not copy to clipboard" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Public key file not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ============================================
# HETZNER SETUP INSTRUCTIONS
# ============================================
Write-Host "🚀 HETZNER SETUP INSTRUCTIONS" -ForegroundColor Blue
Write-Host "==============================" -ForegroundColor Blue
Write-Host ""

Write-Host "📋 Steps to add this key to Hetzner:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to: https://console.hetzner.cloud/" -ForegroundColor Cyan
Write-Host "2. Navigate to: Security > SSH Keys" -ForegroundColor Cyan
Write-Host "3. Click: 'Add SSH Key'" -ForegroundColor Cyan
Write-Host "4. Paste the public key shown above" -ForegroundColor Cyan
Write-Host "5. Name it: 'Pizza-Deployment-Key'" -ForegroundColor Cyan
Write-Host "6. Click: 'Add SSH Key'" -ForegroundColor Cyan
Write-Host ""

Write-Host "🖥️  When creating your Hetzner server:" -ForegroundColor Yellow
Write-Host "   • Select this SSH key during server creation" -ForegroundColor Gray
Write-Host "   • This will allow secure password-less access" -ForegroundColor Gray
Write-Host ""

# ============================================
# DEPLOYMENT READY SUMMARY
# ============================================
Write-Host "📊 DEPLOYMENT CONFIGURATION" -ForegroundColor Blue
Write-Host "============================" -ForegroundColor Blue
Write-Host ""

Write-Host "✅ SSH Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Key Files:" -ForegroundColor Yellow
Write-Host "   Private Key: $privateKeyPath" -ForegroundColor Gray
Write-Host "   Public Key:  $publicKeyPath" -ForegroundColor Gray
Write-Host ""

Write-Host "🚀 Ready for Deployment!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Add the public key to Hetzner (instructions above)" -ForegroundColor Cyan
Write-Host "2. Create your Hetzner server" -ForegroundColor Cyan
Write-Host "3. Provide me these details:" -ForegroundColor Cyan
Write-Host ""

# ============================================
# SAMPLE DEPLOYMENT COMMAND
# ============================================
Write-Host "📋 Sample Deployment Command:" -ForegroundColor Blue
Write-Host "==============================" -ForegroundColor Blue
Write-Host ""

$sampleCommand = @"
.\deploy-hetzner.ps1 ``
    -ServerIP "YOUR_SERVER_IP" ``
    -Domain "yourdomain.com" ``
    -SSHKey "$privateKeyPath" ``
    -Email "your@email.com"
"@

Write-Host $sampleCommand -ForegroundColor Cyan
Write-Host ""

Write-Host "🔐 Security Notes:" -ForegroundColor Yellow
Write-Host "   • Keep your private key secure and never share it" -ForegroundColor Gray
Write-Host "   • Only share the public key (.pub file)" -ForegroundColor Gray
Write-Host "   • The private key is needed for server deployment" -ForegroundColor Gray
Write-Host ""

# ============================================
# TEST SSH CONNECTION (if server provided)
# ============================================
Write-Host "🧪 Want to test the SSH connection?" -ForegroundColor Blue
$testConnection = Read-Host "Enter server IP to test SSH connection (or press Enter to skip)"

if ($testConnection) {
    Write-Host ""
    Write-Host "🔍 Testing SSH connection to $testConnection..." -ForegroundColor Yellow
    
    try {
        $testResult = ssh -i $privateKeyPath -o ConnectTimeout=10 -o StrictHostKeyChecking=no root@$testConnection "echo 'SSH_CONNECTION_OK'"
        
        if ($testResult -eq "SSH_CONNECTION_OK") {
            Write-Host "✅ SSH connection successful!" -ForegroundColor Green
            Write-Host "🚀 Ready to deploy with:" -ForegroundColor Blue
            Write-Host "   .\deploy-hetzner.ps1 -ServerIP '$testConnection' -Domain 'yourdomain.com' -SSHKey '$privateKeyPath'" -ForegroundColor Cyan
        } else {
            Write-Host "❌ SSH connection failed" -ForegroundColor Red
            Write-Host "   Please check: Server IP, SSH key setup in Hetzner" -ForegroundColor Gray
        }
    } catch {
        Write-Host "❌ SSH connection error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   Make sure to add the public key to your Hetzner server first" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "🎉 SSH Key Setup Complete! Ready for Hetzner deployment! 🚀" -ForegroundColor Green
