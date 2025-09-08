# 🚀 HETZNER DEPLOYMENT SCRIPT
# Automated deployment to Hetzner Cloud Server

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$true)]
    [string]$Domain,
    
    [Parameter(Mandatory=$false)]
    [string]$SSHKey = "~/.ssh/id_rsa",
    
    [Parameter(Mandatory=$false)]
    [string]$SSHUser = "root",
    
    [Parameter(Mandatory=$false)]
    [string]$Email = "admin@$Domain",
    
    [Parameter(Mandatory=$false)]
    [string]$AppName = "Pizza Restaurant"
)

Write-Host "🚀 HETZNER PIZZA APP DEPLOYMENT" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# ============================================
# DEPLOYMENT CONFIGURATION
# ============================================
$deployConfig = @{
    ServerIP = $ServerIP
    Domain = $Domain
    SSHKey = $SSHKey
    SSHUser = $SSHUser
    Email = $Email
    AppName = $AppName
    DeployPath = "/opt/pizza-app"
    DBName = "pizza_production"
    DBUser = "pizza_user"
}

Write-Host "📋 Deployment Configuration:" -ForegroundColor Blue
Write-Host "   🖥️  Server: $($deployConfig.ServerIP)" -ForegroundColor Gray
Write-Host "   🌐 Domain: $($deployConfig.Domain)" -ForegroundColor Gray
Write-Host "   👤 SSH User: $($deployConfig.SSHUser)" -ForegroundColor Gray
Write-Host "   📧 Email: $($deployConfig.Email)" -ForegroundColor Gray
Write-Host "   🍕 App: $($deployConfig.AppName)" -ForegroundColor Gray
Write-Host ""

# ============================================
# PRE-DEPLOYMENT CHECKS
# ============================================
Write-Host "🔍 Pre-deployment Checks..." -ForegroundColor Yellow

# Check SSH key exists
if (-not (Test-Path $SSHKey)) {
    Write-Host "   ❌ SSH key not found: $SSHKey" -ForegroundColor Red
    Write-Host "   Please provide a valid SSH key path" -ForegroundColor Gray
    exit 1
}
Write-Host "   ✅ SSH key found" -ForegroundColor Green

# Check Docker files exist
$requiredFiles = @("Dockerfile", "docker-compose.yml", ".env.production.template")
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ Found: $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Missing: $file" -ForegroundColor Red
        exit 1
    }
}

# Test SSH connection
Write-Host "   🔑 Testing SSH connection..." -ForegroundColor Gray
try {
    $sshTest = ssh -i $SSHKey -o ConnectTimeout=10 -o StrictHostKeyChecking=no $SSHUser@$ServerIP "echo 'SSH_OK'"
    if ($sshTest -eq "SSH_OK") {
        Write-Host "   ✅ SSH connection successful" -ForegroundColor Green
    } else {
        throw "SSH test failed"
    }
} catch {
    Write-Host "   ❌ SSH connection failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Please check: Server IP, SSH key, and network connectivity" -ForegroundColor Gray
    exit 1
}

Write-Host ""

# ============================================
# STEP 1: SERVER PREPARATION
# ============================================
Write-Host "🏗️  Step 1: Server Preparation" -ForegroundColor Blue

$serverSetupScript = @"
#!/bin/bash
set -e

echo "🔧 Setting up Hetzner server for pizza app..."

# Update system
echo "📦 Updating system packages..."
apt-get update -y
apt-get upgrade -y

# Install essential packages
echo "🛠️  Installing essential packages..."
apt-get install -y curl wget git ufw fail2ban nginx certbot python3-certbot-nginx htop unzip

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl enable docker
systemctl start docker

# Install Docker Compose
echo "🔧 Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Configure firewall
echo "🔥 Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Configure fail2ban
echo "🛡️  Configuring fail2ban..."
systemctl enable fail2ban
systemctl start fail2ban

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /opt/pizza-app
mkdir -p /opt/pizza-app/data
mkdir -p /opt/pizza-app/logs
mkdir -p /opt/pizza-app/backups

echo "✅ Server preparation complete!"
"@

Write-Host "   🔧 Running server setup script..." -ForegroundColor Gray
Write-Output $serverSetupScript | ssh -i $SSHKey $SSHUser@$ServerIP 'cat > /tmp/server-setup.sh && chmod +x /tmp/server-setup.sh && /tmp/server-setup.sh'

Write-Host "   ✅ Server preparation complete" -ForegroundColor Green
Write-Host ""

# ============================================
# STEP 2: APPLICATION DEPLOYMENT
# ============================================
Write-Host "🚀 Step 2: Application Deployment" -ForegroundColor Blue

# Create deployment package
Write-Host "   📦 Creating deployment package..." -ForegroundColor Gray
$deploymentFiles = @(
    "Dockerfile",
    "docker-compose.yml", 
    ".env.production.template",
    "package.json",
    "next.config.ts",
    "tailwind.config.ts",
    "postcss.config.mjs",
    "tsconfig.json"
)

# Create deployment archive
$archiveName = "pizza-app-deploy.tar.gz"
if (Test-Path $archiveName) { Remove-Item $archiveName }

# Use tar if available, otherwise use PowerShell compression
if (Get-Command tar -ErrorAction SilentlyContinue) {
    $fileList = $deploymentFiles + @("src", "public", "prisma")
    tar -czf $archiveName $fileList
} else {
    # Fallback: create zip file
    $archiveName = "pizza-app-deploy.zip"
    Compress-Archive -Path $deploymentFiles, "src", "public", "prisma" -DestinationPath $archiveName -Force
}

# Upload deployment package
Write-Host "   ⬆️  Uploading application files..." -ForegroundColor Gray
scp -i $SSHKey $archiveName "$SSHUser@${ServerIP}:/opt/pizza-app/"

# Extract and setup on server
$deployScript = @"
#!/bin/bash
set -e

cd /opt/pizza-app

echo "📦 Extracting application files..."
if [ -f pizza-app-deploy.tar.gz ]; then
    tar -xzf pizza-app-deploy.tar.gz
elif [ -f pizza-app-deploy.zip ]; then
    unzip -o pizza-app-deploy.zip
fi

# Generate random passwords
DB_PASSWORD=\$(openssl rand -base64 32)
NEXTAUTH_SECRET=\$(openssl rand -base64 32)

# Create production environment file
echo "🔧 Creating production environment..."
cat > .env.production << EOF
# Database Configuration
DATABASE_URL="postgresql://pizza_user:\$DB_PASSWORD@database:5432/pizza_production"

# Application Configuration
NEXTAUTH_URL="https://$Domain"
NEXTAUTH_SECRET="\$NEXTAUTH_SECRET"
NODE_ENV="production"

# Business Configuration
BUSINESS_NAME="$AppName"
BUSINESS_EMAIL="$Email"
BUSINESS_PHONE="(555) 123-PIZZA"

# App Configuration
APP_NAME="$AppName"
APP_URL="https://$Domain"

# Email Configuration (Update with your SMTP settings)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="$Email"
SMTP_PASS="your-email-password"

# Security
ALLOWED_ORIGINS="https://$Domain,https://www.$Domain"
EOF

# Update docker-compose for production
cat > docker-compose.override.yml << EOF
services:
  pizza-app:
    environment:
      - NEXTAUTH_URL=https://$Domain
      - APP_URL=https://$Domain
    restart: unless-stopped
    
  database:
    environment:
      - POSTGRES_PASSWORD=\$DB_PASSWORD
    restart: unless-stopped
    volumes:
      - /opt/pizza-app/data/postgres:/var/lib/postgresql/data
      - /opt/pizza-app/backups:/backups
EOF

echo "✅ Application setup complete!"
"@

Write-Output $deployScript | ssh -i $SSHKey $SSHUser@$ServerIP 'cat > /tmp/deploy-app.sh && chmod +x /tmp/deploy-app.sh && /tmp/deploy-app.sh'

Write-Host "   ✅ Application deployed" -ForegroundColor Green
Write-Host ""

# ============================================
# STEP 3: SSL & NGINX CONFIGURATION
# ============================================
Write-Host "🔒 Step 3: SSL & Nginx Configuration" -ForegroundColor Blue

$nginxConfig = @"
server {
    listen 80;
    server_name $Domain www.$Domain;
    
    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $Domain www.$Domain;
    
    # SSL Configuration (will be updated by certbot)
    ssl_certificate /etc/letsencrypt/live/$Domain/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$Domain/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Proxy to application
    location / {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3005/api/health;
        access_log off;
    }
    
    # Static files caching
    location /_next/static/ {
        proxy_pass http://localhost:3005;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
"@

$sslSetupScript = @"
#!/bin/bash
set -e

echo "🔒 Setting up SSL and Nginx..."

# Create nginx configuration
cat > /etc/nginx/sites-available/$Domain << 'EOF'
$nginxConfig
EOF

# Enable site
ln -sf /etc/nginx/sites-available/$Domain /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
nginx -t

# Get SSL certificate
echo "📜 Obtaining SSL certificate..."
certbot --nginx -d $Domain -d www.$Domain --non-interactive --agree-tos --email $Email --redirect

# Setup auto-renewal
echo "🔄 Setting up SSL auto-renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Restart services
systemctl reload nginx
systemctl enable nginx

echo "✅ SSL and Nginx configuration complete!"
"@

Write-Host "   🔒 Setting up SSL certificate..." -ForegroundColor Gray
Write-Output $sslSetupScript | ssh -i $SSHKey $SSHUser@$ServerIP 'cat > /tmp/ssl-setup.sh && chmod +x /tmp/ssl-setup.sh && /tmp/ssl-setup.sh'

Write-Host "   ✅ SSL and Nginx configured" -ForegroundColor Green
Write-Host ""

# ============================================
# STEP 4: START APPLICATION
# ============================================
Write-Host "🚀 Step 4: Starting Application" -ForegroundColor Blue

$startScript = @"
#!/bin/bash
set -e

cd /opt/pizza-app

echo "🚀 Starting pizza application..."

# Build and start containers
docker-compose up -d --build

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 10

# Run database migrations
echo "🗄️  Running database setup..."
docker-compose exec -T pizza-app npx prisma generate
docker-compose exec -T pizza-app npx prisma db push

# Check application health
echo "🔍 Checking application health..."
sleep 5

# Check if app is responding
if curl -f http://localhost:3005/api/health > /dev/null 2>&1; then
    echo "✅ Application is healthy!"
else
    echo "⚠️  Application health check failed - checking logs..."
    docker-compose logs pizza-app
fi

echo "🎉 Pizza application is running!"
echo "🌐 Visit: https://$Domain"
"@

Write-Host "   🚀 Starting application containers..." -ForegroundColor Gray
Write-Output $startScript | ssh -i $SSHKey $SSHUser@$ServerIP 'cat > /tmp/start-app.sh && chmod +x /tmp/start-app.sh && /tmp/start-app.sh'

Write-Host "   ✅ Application started" -ForegroundColor Green
Write-Host ""

# ============================================
# STEP 5: SETUP MONITORING & BACKUPS
# ============================================
Write-Host "📊 Step 5: Monitoring & Backups" -ForegroundColor Blue

$monitoringScript = @"
#!/bin/bash
set -e

echo "📊 Setting up monitoring and backups..."

# Create backup script
cat > /opt/pizza-app/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/pizza-app/backups"
DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="\$BACKUP_DIR/pizza_db_\$DATE.sql"

# Create backup
docker-compose exec -T database pg_dump -U pizza_user pizza_production > \$BACKUP_FILE

# Compress backup
gzip \$BACKUP_FILE

# Keep only last 7 days of backups
find \$BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "✅ Database backup completed: \$BACKUP_FILE.gz"
EOF

chmod +x /opt/pizza-app/backup-db.sh

# Setup cron jobs
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/pizza-app/backup-db.sh") | crontab -
(crontab -l 2>/dev/null; echo "0 */6 * * * cd /opt/pizza-app && docker-compose exec -T pizza-app curl -f http://localhost:3005/api/health || docker-compose restart pizza-app") | crontab -

# Create monitoring script
cat > /opt/pizza-app/monitor.sh << 'EOF'
#!/bin/bash
echo "🍕 Pizza App Status Report"
echo "=========================="
echo "📅 Date: \$(date)"
echo ""
echo "🐳 Docker Containers:"
cd /opt/pizza-app && docker-compose ps
echo ""
echo "💾 Disk Usage:"
df -h /opt/pizza-app
echo ""
echo "🔗 Application Health:"
curl -s http://localhost:3005/api/health || echo "❌ Health check failed"
echo ""
echo "🗄️  Database Status:"
docker-compose exec -T database pg_isready -U pizza_user || echo "❌ Database not ready"
EOF

chmod +x /opt/pizza-app/monitor.sh

echo "✅ Monitoring and backups configured!"
"@

Write-Output $monitoringScript | ssh -i $SSHKey $SSHUser@$ServerIP 'cat > /tmp/monitoring-setup.sh && chmod +x /tmp/monitoring-setup.sh && /tmp/monitoring-setup.sh'

Write-Host "   ✅ Monitoring and backups configured" -ForegroundColor Green
Write-Host ""

# ============================================
# DEPLOYMENT COMPLETE
# ============================================
Write-Host "🎉 DEPLOYMENT COMPLETE! 🚀" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host ""

Write-Host "🌐 Your Pizza Restaurant is now live at:" -ForegroundColor Blue
Write-Host "   Primary: https://$Domain" -ForegroundColor Cyan
Write-Host "   Alternative: https://www.$Domain" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔐 Server Details:" -ForegroundColor Blue
Write-Host "   IP: $ServerIP" -ForegroundColor Gray
Write-Host "   SSH: ssh -i $SSHKey $SSHUser@$ServerIP" -ForegroundColor Gray
Write-Host "   App Directory: /opt/pizza-app" -ForegroundColor Gray
Write-Host ""

Write-Host "📊 Management Commands:" -ForegroundColor Blue
Write-Host "   Monitor Status: ssh -i $SSHKey $SSHUser@$ServerIP '/opt/pizza-app/monitor.sh'" -ForegroundColor Gray
Write-Host "   View Logs: ssh -i $SSHKey $SSHUser@$ServerIP 'cd /opt/pizza-app && docker-compose logs'" -ForegroundColor Gray
Write-Host "   Backup Database: ssh -i $SSHKey $SSHUser@$ServerIP '/opt/pizza-app/backup-db.sh'" -ForegroundColor Gray
Write-Host ""

Write-Host "🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Test your website: https://$Domain" -ForegroundColor Cyan
Write-Host "   2. Configure your email settings in the admin panel" -ForegroundColor Cyan
Write-Host "   3. Add your menu items and customize settings" -ForegroundColor Cyan
Write-Host "   4. Update SMTP credentials for order notifications" -ForegroundColor Cyan
Write-Host ""

Write-Host "🍕 Ready to serve customers! 🚀" -ForegroundColor Green

# Clean up local files
Remove-Item $archiveName -ErrorAction SilentlyContinue
