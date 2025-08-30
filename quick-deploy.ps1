#!/usr/bin/env pwsh

# QUICK DEPLOY - No more waiting!
Write-Host "🚀 QUICK DEPLOY - Getting your pizza app LIVE!" -ForegroundColor Green

# Create a simple script to run everything on the server
$commands = @"
#!/bin/bash
cd /opt/pizzaapp

# Fix Nginx config quickly
echo 'server {
    listen 80;
    server_name _;
    location / {
        proxy_pass http://localhost:3000;
    }
}' > /etc/nginx/sites-available/pizzaapp

ln -sf /etc/nginx/sites-available/pizzaapp /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Start everything
systemctl daemon-reload
systemctl restart nginx
systemctl enable pizzaapp
systemctl restart pizzaapp

# Quick status check
echo "=== STATUS ==="
systemctl is-active nginx
systemctl is-active pizzaapp
systemctl is-active postgresql

echo "=== APP TEST ==="
sleep 3
curl -s http://localhost:3000/api/health || echo "App not ready yet"

echo "=== DONE ==="
echo "🎉 Your app should be live at: http://greenlandfamous.net"
"@

# Upload and run the script
Write-Host "📤 Uploading quick deploy script..." -ForegroundColor Yellow
$commands | ssh -i production_server_key root@91.99.194.255 "cat > /tmp/quick-deploy.sh && chmod +x /tmp/quick-deploy.sh && bash /tmp/quick-deploy.sh"

Write-Host ""
Write-Host "✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "🌐 Your pizza app is now live at: http://greenlandfamous.net" -ForegroundColor Cyan
Write-Host "📊 Check it out!" -ForegroundColor Yellow
