#!/bin/bash

echo "🚀 EMERGENCY PRODUCTION DEPLOYMENT"
echo "=================================="

# Clean up old containers and images
echo "🧹 Cleaning up Docker..."
docker stop $(docker ps -aq) 2>/dev/null || true
docker rm $(docker ps -aq) 2>/dev/null || true
docker system prune -af

# Remove old application
echo "🗑️ Removing old application..."
rm -rf /opt/restoapp/*

echo "✅ Server cleaned up successfully!"
echo "Ready for fresh deployment..."
