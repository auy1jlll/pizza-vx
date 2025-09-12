# Production Deployment Guide

## Quick Fixes Applied

### 1. OrderService Foreign Key Constraint Fix
- **Issue**: Prisma orderItem.create() foreign key constraint violations
- **Fix**: Added explicit itemType fields and enhanced validation
- **Files**: src/services/order.ts, src/app/api/checkout/route.ts

### 2. Gmail Email Notifications
- **Issue**: Order confirmation emails not sending
- **Fix**: Enabled emailNotifications setting in database
- **Command**: UPDATE app_settings SET value = 'true' WHERE key = 'emailNotifications';

### 3. Menu Categories Display  
- **Issue**: Only 4 categories showing instead of 20+
- **Fix**: Enhanced fallback categories and added cache-busting
- **Files**: src/app/menu/page.tsx

## How to Restore Working State

### Option 1: Use the Deployment Script
Run the batch file to automatically restore all fixes:
```
deploy-production.bat
```

### Option 2: Manual Deployment
1. Upload fixed files:
```bash
scp -i "C:\Users\auy1j\.ssh\new_hetzner_key" "src/services/order.ts" root@91.99.58.154:/root/src/services/order.ts
scp -i "C:\Users\auy1j\.ssh\new_hetzner_key" "src/app/api/checkout/route.ts" root@91.99.58.154:/root/src/app/api/checkout/route.ts
scp -i "C:\Users\auy1j\.ssh\new_hetzner_key" "src/app/menu/page.tsx" root@91.99.58.154:/root/src/app/menu/page.tsx
```

2. Restart production:
```bash
ssh -i "C:\Users\auy1j\.ssh\new_hetzner_key" root@91.99.58.154 "cd /root && docker-compose down && docker-compose up -d"
```

3. Enable email notifications:
```bash
ssh -i "C:\Users\auy1j\.ssh\new_hetzner_key" root@91.99.58.154 "docker exec postgres-db psql -U postgres -d resto_app -c 'UPDATE app_settings SET value = \"true\" WHERE key = \"emailNotifications\";'"
```

## Backup Information
- Production backup created: backup-working-20250911-221531.tar.gz
- Location: /root/ on production server 91.99.58.154
- Contains: src/, prisma/, package.json, compose.yaml, Dockerfile, .env.docker

## Key Features Working
✅ Order creation with proper foreign key validation  
✅ Gmail email notifications on order completion
✅ 12+ menu categories displaying properly
✅ Production deployment scripts for persistence

## Application URLs
- Production: http://91.99.58.154:3000
- Public: https://greenlandfamous.net
- API Test: https://greenlandfamous.net/api/menu/categories
