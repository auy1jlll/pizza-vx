#!/usr/bin/env pwsh

# Remove Resend from Production - Gmail Only Deployment
Write-Host "🚀 Deploying Gmail-Only Email Service to Production" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Production server details
$SERVER = "91.99.194.255"
$APP_PATH = "/opt/pizzaapp"

Write-Host "📧 Removing resend dependencies from production..." -ForegroundColor Yellow

# Create cleanup script for production
$cleanupScript = @"
#!/bin/bash
cd $APP_PATH

echo "🧹 Removing resend files from production..."

# Remove resend-related files if they exist
rm -f src/lib/email-service-resend.ts
rm -f src/lib/resend-email-service.ts
rm -f src/lib/configurable-email-service.ts
rm -f src/lib/simple-email-service.ts
rm -f setup-resend.sh
rm -f deploy-resend-production.ps1
rm -f test-resend-direct.js
rm -f manual-resend-setup.txt

echo "📦 Removing resend from package.json if present..."
# Remove resend dependency if it exists
sed -i '/\"resend\":/d' package.json

echo "🔧 Updating environment variables for Gmail..."
# Backup current .env
cp .env .env.backup.resend-removal

# Remove resend API key if present
sed -i '/RESEND_API_KEY/d' .env

# Ensure Gmail configuration is present
if ! grep -q "GMAIL_USER" .env; then
    echo "GMAIL_USER=auy1jll@gmail.com" >> .env
fi

if ! grep -q "GMAIL_APP_PASSWORD" .env; then
    echo "GMAIL_APP_PASSWORD=\${GMAIL_APP_PASSWORD}" >> .env
fi

# Ensure SMTP settings for nodemailer
grep -q "SMTP_HOST" .env || echo "SMTP_HOST=smtp.gmail.com" >> .env
grep -q "SMTP_PORT" .env || echo "SMTP_PORT=587" >> .env
grep -q "SMTP_USER" .env || echo "SMTP_USER=auy1jll@gmail.com" >> .env

echo "🔄 Installing dependencies..."
npm install --production

echo "🏗️ Building application..."
npm run build

echo "🔄 Restarting services..."
systemctl restart pizzaapp
systemctl restart nginx

echo "✅ Gmail-only deployment complete!"
echo ""
echo "📧 Email service now uses:"
echo "   - Gmail SMTP (smtp.gmail.com:587)"
echo "   - Gmail service for password resets"
echo "   - Nodemailer for order confirmations"
echo ""
echo "🧪 Testing email service..."
curl -s http://localhost:3000/api/test-email || echo "App not ready yet, test manually"

echo "🎉 Production deployment complete!"
"@

Write-Host "📤 Uploading Gmail deployment script..." -ForegroundColor Yellow

# Upload the cleanup script and run it
$cleanupScript | ssh -i production_server_key root@$SERVER "cat > /tmp/gmail-deploy.sh && chmod +x /tmp/gmail-deploy.sh && bash /tmp/gmail-deploy.sh"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ GMAIL DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "🌐 Your production site is now using Gmail exclusively" -ForegroundColor Cyan
    Write-Host "📧 Resend has been completely removed" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔧 Production email configuration:" -ForegroundColor Yellow
    Write-Host "   - Gmail SMTP: smtp.gmail.com:587" -ForegroundColor Gray
    Write-Host "   - From: auy1jll@gmail.com" -ForegroundColor Gray
    Write-Host "   - Service: Greenland Famous Pizza" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🧪 Test the email service:" -ForegroundColor Yellow
    Write-Host "   http://greenlandfamous.net/api/test-email" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "❌ DEPLOYMENT FAILED!" -ForegroundColor Red
    Write-Host "🔧 Check the server logs for details" -ForegroundColor Yellow
}
