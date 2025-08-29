#!/bin/bash
# Resend.com Setup Script for Hetzner Server

echo "🚀 Resend.com Email Setup for Boston Pizza"
echo "=========================================="

# Check if we're on the server
if [ ! -d "/opt/restoapp" ]; then
    echo "❌ Not on production server. Run this on your Hetzner server."
    echo "📝 Copy this script to your server and run it there."
    exit 1
fi

echo "📍 Current directory: $(pwd)"
echo "🖥️  Server: $(hostname)"

# Navigate to app directory
cd /opt/restoapp

echo ""
echo "📧 Setting up Resend.com email service..."

# Backup current .env
if [ -f ".env" ]; then
    cp .env .env.backup.$(date +%Y%m%d-%H%M%S)
    echo "✅ Backed up current .env file"
fi

echo ""
echo "🔧 Please enter your Resend.com API key:"
echo "   (Get it from: https://resend.com/api-keys)"
read -p "API Key (starts with re_): " resend_api_key

echo ""
echo "🏷️  Please enter your domain for from email:"
echo "   Examples: bostonpizza.com, yourdomain.com"
read -p "Domain: " domain

# Update .env file
echo ""
echo "📝 Updating .env configuration..."

# Remove existing SMTP configuration
sed -i '/^SMTP_/d' .env

# Add Resend configuration
cat >> .env << EOF

# Resend.com Email Configuration
SMTP_HOST="smtp.resend.com"
SMTP_PORT="587"
SMTP_USER="resend"
SMTP_PASS="$resend_api_key"
SMTP_FROM_EMAIL="noreply@$domain"
SMTP_FROM_NAME="Boston Pizza"
EOF

echo "✅ Email configuration updated"

echo ""
echo "🔄 Restarting application..."

# Restart the application
if command -v pm2 >/dev/null 2>&1; then
    pm2 restart all
    echo "✅ PM2 processes restarted"
elif [ -f "docker-compose.yml" ] || [ -f "docker-compose.prod.yml" ]; then
    if [ -f "docker-compose.prod.yml" ]; then
        docker-compose -f docker-compose.prod.yml restart
    else
        docker-compose restart
    fi
    echo "✅ Docker containers restarted"
else
    echo "⚠️  Please manually restart your application"
fi

echo ""
echo "🧪 Testing email configuration..."

# Test the email service
test_email="test@$domain"
echo "📤 Testing with email: $test_email"

# Wait a moment for app to start
sleep 3

# Test the forgot password endpoint
test_response=$(curl -s -X POST "http://localhost:3000/api/auth/customer/forgot-password" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$test_email\"}" \
  --connect-timeout 10)

if echo "$test_response" | grep -q "password reset link"; then
    echo "✅ Email service test successful!"
    echo "📧 Check Resend dashboard for email delivery"
else
    echo "⚠️  Test response: $test_response"
    echo "🔍 Check application logs for details"
fi

echo ""
echo "🎉 Resend.com setup complete!"
echo ""
echo "📊 Next steps:"
echo "   1. Check Resend dashboard: https://resend.com/emails"
echo "   2. Test forgot password on your website"
echo "   3. Consider adding domain authentication for better deliverability"
echo ""
echo "🔗 Useful links:"
echo "   - Resend Dashboard: https://resend.com/dashboard"
echo "   - Domain Setup: https://resend.com/domains"
echo "   - API Keys: https://resend.com/api-keys"
echo ""
echo "✅ Your email service is now powered by Resend.com!"
