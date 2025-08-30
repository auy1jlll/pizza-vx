#!/usr/bin/env pwsh

# Simple One-Connection Deployment Script
# Deploys the app with a single SSH connection to avoid repeated passphrase prompts

$ErrorActionPreference = "Stop"

Write-Host "🚀 Deploying to production server..." -ForegroundColor Cyan
Write-Host "📝 This will require your SSH passphrase only ONCE" -ForegroundColor Yellow

# Create a comprehensive deployment script that runs everything in one SSH session
$deploymentCommands = @'
#!/bin/bash
set -e

echo "🔧 Starting complete deployment process..."

# Update system
echo "📦 Updating system packages..."
apt-get update -y

# Install Node.js if needed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
else
    echo "✅ Node.js already installed: $(node --version)"
fi

# Install PostgreSQL if needed
if ! command -v psql &> /dev/null; then
    echo "🗄️ Installing PostgreSQL..."
    apt-get install -y postgresql postgresql-contrib
    systemctl start postgresql
    systemctl enable postgresql
else
    echo "✅ PostgreSQL already installed"
fi

# Create application directory
echo "📁 Setting up application directory..."
mkdir -p /opt/pizzaapp
cd /opt/pizzaapp

# Remove old files and copy new ones
rm -rf .next src public prisma package*.json *.md *.js *.ts || true
cp -r /tmp/deployment-package-2025-08-29-01-47-09/* .

# Set up database
echo "🗄️ Configuring database..."
sudo -u postgres psql -c "DROP DATABASE IF EXISTS pizzadb;"
sudo -u postgres psql -c "CREATE DATABASE pizzadb;"
sudo -u postgres psql -c "DROP USER IF EXISTS pizzauser;"
sudo -u postgres psql -c "CREATE USER pizzauser WITH PASSWORD 'SecurePizzaPass2024!';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE pizzadb TO pizzauser;"
sudo -u postgres psql -c "ALTER USER pizzauser CREATEDB;"

# Create production environment file
echo "🔧 Creating production environment..."
cat > .env <<EOF
NODE_ENV=production
DATABASE_URL=postgresql://pizzauser:SecurePizzaPass2024!@localhost:5432/pizzadb

# Gmail Configuration (working credentials)
GMAIL_USER=auy1jlll@gmail.com
GMAIL_APP_PASSWORD=zguprmufgfkrerzc

# NextAuth Configuration
NEXTAUTH_SECRET=super-secret-nextauth-production-key-min-32-chars-long-secure
NEXTAUTH_URL=https://greenlandfamous.net

# JWT Secret
JWT_SECRET=jwt-secret-for-production-token-signing-very-secure-key

# Application Settings
NEXT_PUBLIC_APP_URL=https://greenlandfamous.net
PORT=3000
EOF

# Install dependencies
echo "📦 Installing production dependencies..."
npm ci --omit=dev

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Restore data from backup
echo "📥 Restoring database from backup..."
node restore-database.js

# Stop any existing service
systemctl stop pizzaapp || true

# Create systemd service
echo "🔧 Setting up systemd service..."
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
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Install and configure nginx
echo "🌐 Setting up Nginx..."
apt-get install -y nginx

cat > /etc/nginx/sites-available/pizzaapp <<EOF
server {
    listen 80;
    server_name greenlandfamous.net www.greenlandfamous.net _;

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
        
        # Increase timeouts
        proxy_connect_timeout       60s;
        proxy_send_timeout          60s;
        proxy_read_timeout          60s;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/pizzaapp /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx config
nginx -t

# Start services
echo "🚀 Starting services..."
systemctl daemon-reload
systemctl enable pizzaapp
systemctl start pizzaapp
systemctl enable nginx
systemctl restart nginx

# Wait a moment for startup
sleep 5

# Check service status
echo "📊 Service Status:"
systemctl is-active pizzaapp && echo "✅ Pizza App: Running" || echo "❌ Pizza App: Failed"
systemctl is-active nginx && echo "✅ Nginx: Running" || echo "❌ Nginx: Failed"
systemctl is-active postgresql && echo "✅ PostgreSQL: Running" || echo "❌ PostgreSQL: Failed"

# Test the application
echo "🧪 Testing application..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Application health check passed"
else
    echo "⚠️ Application health check failed - checking logs..."
    journalctl -u pizzaapp --no-pager -n 10
fi

echo ""
echo "🎉 Deployment completed!"
echo "🌐 Your application should be available at: http://greenlandfamous.net"
echo ""
echo "📋 Useful commands:"
echo "  Check logs: journalctl -u pizzaapp -f"
echo "  Restart:    systemctl restart pizzaapp"
echo "  Status:     systemctl status pizzaapp"
'@

Write-Host "📤 Uploading and executing deployment script..." -ForegroundColor Yellow
Write-Host "⚠️  You'll be prompted for your SSH key passphrase once" -ForegroundColor Cyan

# Upload and execute the script in one SSH connection
$deploymentCommands | ssh -i production_server_key root@91.99.194.255 "cat > /tmp/complete-deploy.sh && chmod +x /tmp/complete-deploy.sh && /tmp/complete-deploy.sh"

Write-Host ""
Write-Host "🎉 Deployment completed!" -ForegroundColor Green
Write-Host "🌐 Your application is now available at: http://greenlandfamous.net" -ForegroundColor Cyan
Write-Host "📊 All services should be running with your data restored" -ForegroundColor Cyan
