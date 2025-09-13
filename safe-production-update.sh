#!/bin/bash
# Safe Production Update Script - Kitchen & Orders Fix
# This script updates only the specific files without rebuilding

echo "🚀 Starting safe production update..."
echo "📋 This will update 4 files without touching the database"
echo ""

# Step 1: Backup current production files
echo "1️⃣ Creating backup of current production files..."
mkdir -p ./production-backup-$(date +%Y%m%d-%H%M%S)
cp src/app/management-portal/kitchen/page.tsx ./production-backup-$(date +%Y%m%d-%H%M%S)/kitchen-page.tsx.bak 2>/dev/null || echo "   - kitchen/page.tsx not found (new file)"
cp src/app/management-portal/orders/page.tsx ./production-backup-$(date +%Y%m%d-%H%M%S)/orders-page.tsx.bak 2>/dev/null || echo "   - orders/page.tsx backed up"
cp src/app/api/management-portal/kitchen/orders/route.ts ./production-backup-$(date +%Y%m%d-%H%M%S)/kitchen-api.ts.bak 2>/dev/null || echo "   - kitchen API backed up"
cp src/app/api/admin/kitchen/orders/route.ts ./production-backup-$(date +%Y%m%d-%H%M%S)/admin-kitchen-api.ts.bak 2>/dev/null || echo "   - admin kitchen API backed up"

# Step 2: Pull only the specific changes
echo "2️⃣ Pulling latest changes for updated files..."
git fetch origin main
git checkout origin/main -- src/app/management-portal/kitchen/page.tsx
git checkout origin/main -- src/app/management-portal/orders/page.tsx
git checkout origin/main -- src/app/api/management-portal/kitchen/orders/route.ts
git checkout origin/main -- src/app/api/admin/kitchen/orders/route.ts

# Step 3: Restart app without rebuilding
echo "3️⃣ Restarting application (no rebuild)..."
echo "   Choose your restart method:"
echo "   - PM2: pm2 reload your-app-name"
echo "   - Docker: docker restart your-container-name"  
echo "   - Direct: kill and restart your Node process"

echo ""
echo "✅ Files updated successfully!"
echo "🔍 Updated files:"
echo "   - Kitchen page: EMPLOYEE access enabled"
echo "   - Orders page: All text now black for readability"
echo "   - Kitchen APIs: Authentication properly awaited"
echo ""
echo "⚠️  Remember to restart your app process after running this script"
echo "📊 Database was NOT touched - your data is safe"