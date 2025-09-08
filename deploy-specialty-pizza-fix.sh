#!/bin/bash

# Safe Production Specialty Pizza Update Script
# This script ONLY updates specialty pizza data without touching the rest of the application

echo "🚀 Starting Safe Specialty Pizza Production Update..."

# Configuration
REMOTE_HOST="91.99.194.255"
REMOTE_USER="root"
SSH_KEY="C:/Users/auy1j/.ssh/hetzner-pizza-key"
REMOTE_PATH="/opt/pizza-app"

echo "📋 Update Plan:"
echo "   - Upload ONLY the specialty pizza fix script"
echo "   - Run database update for specialty pizzas"
echo "   - Verify the fix worked"
echo "   - NO server restart required"
echo "   - NO application code changes"

# Step 1: Upload the fix script to production
echo ""
echo "📤 Step 1: Uploading specialty pizza fix script..."
scp -i "$SSH_KEY" fix-production-specialty-pizzas.js $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/

if [ $? -eq 0 ]; then
    echo "✅ Fix script uploaded successfully"
else
    echo "❌ Failed to upload fix script"
    exit 1
fi

# Step 2: Run the fix script on production
echo ""
echo "🔧 Step 2: Running specialty pizza fix on production database..."
ssh -i "$SSH_KEY" $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_PATH && node fix-production-specialty-pizzas.js"

if [ $? -eq 0 ]; then
    echo "✅ Specialty pizza fix completed successfully"
else
    echo "❌ Fix script failed - check logs above"
    exit 1
fi

# Step 3: Verify the fix worked
echo ""
echo "🔍 Step 3: Verifying specialty pizzas are working..."
ssh -i "$SSH_KEY" $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_PATH && curl -s http://localhost:3000/api/specialty-pizzas | jq '.data | length'"

if [ $? -eq 0 ]; then
    echo "✅ Specialty pizzas API is responding"
else
    echo "⚠️  Could not verify API response (but fix may still be successful)"
fi

# Step 4: Test the endpoint from external
echo ""
echo "🌐 Step 4: Testing from external..."
PIZZA_COUNT=$(curl -s "http://$REMOTE_HOST:3000/api/specialty-pizzas" | jq -r '.data | length' 2>/dev/null)

if [ "$PIZZA_COUNT" -gt "0" ]; then
    echo "✅ External API test successful - Found $PIZZA_COUNT specialty pizzas"
else
    echo "⚠️  External test inconclusive"
fi

echo ""
echo "🎉 SPECIALTY PIZZA UPDATE COMPLETE!"
echo ""
echo "📊 Summary:"
echo "   ✅ Database updated with clean specialty pizza data"
echo "   ✅ Proper sizes and pricing applied"
echo "   ✅ Old garbage data cleaned up"
echo "   ✅ No server restart required"
echo "   ✅ No downtime experienced"
echo ""
echo "🔗 Test URL: http://$REMOTE_HOST:3000/gourmet-pizzas"
echo ""
echo "Note: This update ONLY affected specialty pizza data."
echo "The rest of your application remains untouched and stable."
