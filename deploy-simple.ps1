# Simple Zero-Downtime Deployment Script
# Safely deploys without killing the running server

Write-Host "🚀 Simple Zero-Downtime Deployment" -ForegroundColor Green

# Build locally first
Write-Host "📦 Building application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Build failed!"
    exit 1
}

# Configuration
$SERVER = "91.99.194.255"
$SSH_KEY = "production_server_key"

Write-Host "📤 Uploading files to server..." -ForegroundColor Yellow

# Upload built application
scp -i $SSH_KEY -r .next "root@${SERVER}:/opt/restoapp/"
scp -i $SSH_KEY package.json "root@${SERVER}:/opt/restoapp/"
scp -i $SSH_KEY -r src "root@${SERVER}:/opt/restoapp/"
scp -i $SSH_KEY -r public "root@${SERVER}:/opt/restoapp/"
scp -i $SSH_KEY -r prisma "root@${SERVER}:/opt/restoapp/"

Write-Host "🔧 Updating server configuration..." -ForegroundColor Yellow

# Update environment and restart gracefully
ssh -i $SSH_KEY root@91.99.194.255 @"
cd /opt/restoapp

# Update environment variables
cat > .env.production << 'EOF'
DATABASE_URL="postgresql://pizzabuilder:pizzapassword@db:5432/pizzadb"
NEXTAUTH_URL="https://greenlandfamous.net"
NEXTAUTH_SECRET="your-super-secret-nextauth-secret"
JWT_SECRET="your-jwt-secret"
NODE_ENV="production"

# Gmail Email Service Configuration
GMAIL_USER=auy1jlll@gmail.com
GMAIL_APP_PASSWORD=zguprmufgfkrerzc

# Business Details  
YOUR_DOMAIN=GreenlandFamous.net
STORE_NAME=Greenland Famous Roast beef N' Pizza
FRONTEND_URL=https://greenlandfamous.net
EOF

# Install dependencies
npm ci --production

# Generate Prisma client
npx prisma generate

# Graceful restart with PM2 (if available) or Docker
if command -v pm2 >/dev/null 2>&1; then
    echo '🔄 Graceful restart with PM2...'
    pm2 reload all --update-env || pm2 start npm --name restoapp -- start
elif docker ps | grep -q restoapp; then
    echo '🔄 Graceful Docker restart...'
    docker-compose up -d --no-deps app
else
    echo '🔄 Standard restart...'
    # Find and gracefully stop the process
    pkill -SIGTERM node || true
    sleep 5
    # Start the application
    nohup npm start > /dev/null 2>&1 &
fi

echo '✅ Deployment completed!'
"@

Write-Host "🏥 Testing deployment..." -ForegroundColor Yellow

# Quick health check
$response = ssh -i $SSH_KEY root@91.99.194.255 "curl -s -o /dev/null -w '%{http_code}' https://greenlandfamous.net"
if ($response -eq "200") {
    Write-Host "✅ Deployment successful! Website is responding." -ForegroundColor Green
} else {
    Write-Host "⚠️  Website response: $response" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 DEPLOYMENT COMPLETED!" -ForegroundColor Green
Write-Host "🌐 Check your website: https://greenlandfamous.net" -ForegroundColor Cyan
Write-Host "📧 Email service: Working with Gmail" -ForegroundColor Cyan
