#!/usr/bin/env pwsh

# Final Production Deployment Script
# Deploy the application to the production server

param(
    [switch]$RestoreData,
    [switch]$Help
)

if ($Help) {
    Write-Host @"
Final Production Deployment Script

Usage: .\deploy-final.ps1 [options]

Options:
  -RestoreData   Restore database from backup after deployment
  -Help          Show this help message

This script will:
1. Upload the deployment package to the server
2. Install and configure the application
3. Set up the database with proper credentials
4. Optionally restore existing data
5. Start the application
"@
    exit 0
}

$ErrorActionPreference = "Stop"

$SERVER = "91.99.194.255"
$USER = "root"
$SSH_KEY = "production_server_key"
$APP_DIR = "/opt/pizzaapp"

Write-Host "🚀 Starting final production deployment..." -ForegroundColor Cyan

# Create deployment script on server
$deployScript = @'
#!/bin/bash
set -e

echo "🔧 Setting up production environment..."

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Install PostgreSQL if not present
if ! command -v psql &> /dev/null; then
    echo "🗄️ Installing PostgreSQL..."
    apt-get update
    apt-get install -y postgresql postgresql-contrib
    systemctl start postgresql
    systemctl enable postgresql
fi

# Create application directory
mkdir -p /opt/pizzaapp
cd /opt/pizzaapp

# Copy deployment files
echo "📁 Copying application files..."
cp -r /tmp/deployment-package-2025-08-29-01-47-09/* .

# Set up database
echo "🗄️ Setting up database..."
sudo -u postgres psql -c "CREATE DATABASE pizzadb;" || echo "Database already exists"
sudo -u postgres psql -c "CREATE USER pizzauser WITH PASSWORD 'SecurePizzaPass2024!';" || echo "User already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE pizzadb TO pizzauser;"
sudo -u postgres psql -c "ALTER USER pizzauser CREATEDB;"

# Update environment file with correct database URL
cat > .env <<EOF
NODE_ENV=production
DATABASE_URL=postgresql://pizzauser:SecurePizzaPass2024!@localhost:5432/pizzadb

# Gmail Configuration (working credentials)
GMAIL_USER=auy1jlll@gmail.com
GMAIL_APP_PASSWORD=zguprmufgfkrerzc

# NextAuth Configuration
NEXTAUTH_SECRET=super-secret-nextauth-production-key-min-32-chars-long
NEXTAUTH_URL=https://greenlandfamous.net

# JWT Secret
JWT_SECRET=jwt-secret-for-production-token-signing-secure

# Application Settings
NEXT_PUBLIC_APP_URL=https://greenlandfamous.net
PORT=3000
EOF

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --omit=dev

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Build application (if needed)
if [ ! -d ".next" ]; then
    echo "🔨 Building application..."
    npm run build
fi

echo "✅ Application setup complete!"
'@

# Upload deployment script
Write-Host "📝 Creating deployment script on server..." -ForegroundColor Yellow
$deployScript | ssh -i $SSH_KEY $USER@$SERVER "cat > /tmp/deploy-app.sh && chmod +x /tmp/deploy-app.sh"

# Run deployment
Write-Host "🚀 Running deployment on server..." -ForegroundColor Yellow
ssh -i $SSH_KEY $USER@$SERVER "/tmp/deploy-app.sh"

# Restore data if requested
if ($RestoreData) {
    Write-Host "📥 Restoring database from backup..." -ForegroundColor Yellow
    
    $restoreScript = @'
#!/bin/bash
cd /opt/pizzaapp
echo "🔄 Restoring database from backup..."
node restore-database.js
echo "✅ Database restoration complete!"
'@
    
    $restoreScript | ssh -i $SSH_KEY $USER@$SERVER "cat > /tmp/restore-data.sh && chmod +x /tmp/restore-data.sh"
    ssh -i $SSH_KEY $USER@$SERVER "/tmp/restore-data.sh"
}

# Create systemd service
Write-Host "🔧 Setting up systemd service..." -ForegroundColor Yellow

$serviceScript = @'
#!/bin/bash
cat > /etc/systemd/system/pizzaapp.service <<EOF
[Unit]
Description=Pizza App Node.js Application
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/pizzaapp
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable pizzaapp
systemctl start pizzaapp

echo "✅ Service configured and started!"
'@

$serviceScript | ssh -i $SSH_KEY $USER@$SERVER "cat > /tmp/setup-service.sh && chmod +x /tmp/setup-service.sh"
ssh -i $SSH_KEY $USER@$SERVER "/tmp/setup-service.sh"

# Setup nginx reverse proxy
Write-Host "🌐 Setting up Nginx reverse proxy..." -ForegroundColor Yellow

$nginxScript = @'
#!/bin/bash
# Install nginx if not present
if ! command -v nginx &> /dev/null; then
    apt-get update
    apt-get install -y nginx
fi

# Create nginx configuration
cat > /etc/nginx/sites-available/pizzaapp <<EOF
server {
    listen 80;
    server_name greenlandfamous.net www.greenlandfamous.net;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/pizzaapp /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
nginx -t && systemctl reload nginx
systemctl enable nginx

echo "✅ Nginx configured!"
'@

$nginxScript | ssh -i $SSH_KEY $USER@$SERVER "cat > /tmp/setup-nginx.sh && chmod +x /tmp/setup-nginx.sh"
ssh -i $SSH_KEY $USER@$SERVER "/tmp/setup-nginx.sh"

# Check application status
Write-Host "📊 Checking application status..." -ForegroundColor Yellow
ssh -i $SSH_KEY $USER@$SERVER "systemctl status pizzaapp --no-pager -l"

Write-Host ""
Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Your application should be available at: http://greenlandfamous.net" -ForegroundColor Cyan
Write-Host "🗄️  Database is set up with your existing data structure" -ForegroundColor Cyan

Write-Host ""
Write-Host "📋 Useful commands:" -ForegroundColor Yellow
Write-Host "  Check status: ssh -i $SSH_KEY $USER@$SERVER 'systemctl status pizzaapp'" -ForegroundColor Gray
Write-Host "  View logs:    ssh -i $SSH_KEY $USER@$SERVER 'journalctl -u pizzaapp -f'" -ForegroundColor Gray
Write-Host "  Restart app:  ssh -i $SSH_KEY $USER@$SERVER 'systemctl restart pizzaapp'" -ForegroundColor Gray
