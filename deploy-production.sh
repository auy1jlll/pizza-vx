#!/bin/bash
# Production Deployment Script - Restore Working State
# This script ensures all fixes persist and can be redeployed

set -e  # Exit on any error

echo '🚀 Starting production deployment...'

# Production server details
SERVER='91.99.58.154'
KEY_PATH='C:\Users\auy1j\.ssh\new_hetzner_key'
LOCAL_PROJECT='C:\Users\auy1j\Desktop\final'

echo '📦 Uploading source files to production...'

# Upload critical fixed files
scp -i "$KEY_PATH" "$LOCAL_PROJECT/src/services/order.ts" root@$SERVER:/root/src/services/order.ts
scp -i "$KEY_PATH" "$LOCAL_PROJECT/src/app/api/checkout/route.ts" root@$SERVER:/root/src/app/api/checkout/route.ts
scp -i "$KEY_PATH" "$LOCAL_PROJECT/src/lib/gmail-service.ts" root@$SERVER:/root/src/lib/gmail-service.ts
scp -i "$KEY_PATH" "$LOCAL_PROJECT/prisma/schema.prisma" root@$SERVER:/root/prisma/schema.prisma

echo '🔧 Rebuilding and restarting production services...'

ssh -i "$KEY_PATH" root@$SERVER << 'EOF'
cd /root

# Stop existing containers
docker-compose down

# Rebuild with no cache to ensure fresh build
docker-compose build --no-cache

# Start services
docker-compose up -d

# Wait for database to be ready
sleep 15

# Push database schema
docker exec typescript-app npx prisma db push

# Ensure email notifications are enabled
docker exec postgres-db psql -U postgres -d resto_app -c "UPDATE app_settings SET value = 'true' WHERE key = 'emailNotifications';"

echo '✅ Production deployment completed successfully!'
echo '🌐 Application available at: http://91.99.58.154:3000'

# Show running containers
docker ps
EOF

echo '🎉 Deployment script completed!'
