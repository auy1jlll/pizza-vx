#!/bin/bash
# Permanent deployment script for menu categories fix

echo "🚀 Deploying permanent menu categories fix..."

# Upload the fixed menu page
scp -i "C:\Users\auy1j\.ssh\new_hetzner_key" "C:\Users\auy1j\Desktop\final\src\app\menu\page.tsx" root@91.99.58.154:/opt/greenland-pizza/src/app/menu/

# Restart the application
ssh -i "C:\Users\auy1j\.ssh\new_hetzner_key" root@91.99.58.154 "cd /opt/greenland-pizza && docker-compose restart typescript-app"

echo "✅ Menu categories fix deployed permanently"
echo "📋 Users should now see all categories that have menu items"
echo "🔄 Changes will persist across container restarts"
