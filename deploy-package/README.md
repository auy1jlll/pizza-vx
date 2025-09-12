# Production Deployment Guide

## Quick Start
1. Update .env.production with your actual values
2. Upload this folder to your server
3. Run: chmod +x deploy.sh && ./deploy.sh

## What Gets Deployed
- ✅ Complete database with 91+ menu items
- ✅ 7 Specialty pizzas with correct pricing
- ✅ 7 Specialty calzones with correct pricing
- ✅ 18 Menu categories vs current 4
- ✅ 32 Pizza toppings vs basic set
- ✅ Gmail email configuration
- ✅ Admin portal access

## Critical Configuration
Before deployment, update in .env.production:
- DATABASE_URL: Your production PostgreSQL connection
- SMTP_PASS: Your real Gmail App Password
- NEXTAUTH_SECRET: Generate new secret for production

## Expected Results
After deployment, your site will have the same functionality as your local development environment.

## Rollback
Database backup is created automatically in /var/backups/pizzax/
