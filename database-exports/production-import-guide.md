# Production Database Import Guide

## 📊 Export Summary
Your local database has been exported with:
- **91 Menu Items** (vs 4-5 on production)
- **7 Specialty Pizzas** (vs missing on production)  
- **7 Specialty Calzones** (vs missing on production)
- **132 App Settings** (including Gmail configuration)
- **18 Menu Categories** (vs 4 on production)
- **32 Pizza Toppings** (vs basic set on production)
- **5 Users** with proper admin accounts
- **1 Promotion** (Buy One Get One 50% Off)

## 🚀 Production Deployment Steps

### Step 1: Upload Files to Production Server
Upload these files to your `greenlandfamous.net` server:
```
pizzax-export-2025-09-11T22-37-38-543Z.json
import-pizzax-export-2025-09-11T22-37-38-543Z.js
```

### Step 2: Set Production Environment Variables
Ensure your production `.env` file contains:
```bash
# Production Database (replace with your actual production DB URL)
DATABASE_URL=postgresql://username:password@host:port/database_name

# Gmail Configuration (use your actual Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=auy1jll33@gmail.com
SMTP_PASS=your-actual-gmail-app-password
SMTP_FROM_EMAIL=auy1jll33@gmail.com
SMTP_FROM_NAME=Greenland Famous Pizza

# Site Configuration
NEXTAUTH_URL=https://greenlandfamous.net
NEXT_PUBLIC_SITE_URL=https://greenlandfamous.net
```

### Step 3: Backup Current Production Database (IMPORTANT!)
Before importing, backup your current production data:
```bash
# If using PostgreSQL
pg_dump $DATABASE_URL > production-backup-$(date +%Y%m%d).sql

# Or use your hosting provider's backup tools
```

### Step 4: Run the Import
```bash
# Navigate to your app directory
cd /path/to/your/app

# Install dependencies if needed
npm install

# Run the import script
node import-pizzax-export-2025-09-11T22-37-38-543Z.js

# Update Prisma client
npx prisma generate

# Push schema changes if needed
npx prisma db push
```

### Step 5: Restart Application
```bash
# If using PM2
pm2 restart your-app-name

# If using systemd
sudo systemctl restart your-app-service

# If using Docker
docker-compose restart
```

## ⚠️ Important Notes

### Gmail Configuration
The export includes your Gmail settings, but you'll need to:
1. Generate a new Gmail App Password for production
2. Update the `SMTP_PASS` environment variable
3. Test email functionality after import

### Admin Access
The import includes admin accounts. Default login:
- **Email**: admin@pizzabuilder.com
- **Password**: Check your local admin password

### Data Validation
After import, verify:
- ✅ All 91 menu items are visible
- ✅ All 18 menu categories are showing
- ✅ Specialty pizzas page has 7 items
- ✅ Specialty calzones page has 7 items
- ✅ Pricing is correct throughout the app
- ✅ Admin portal login works
- ✅ Email notifications work

## 🎯 Expected Results

After successful import, your production site should have:

### Menu System
- **Full Menu**: Appetizers, Wings, Seafood, Dinner Plates, etc.
- **Complete Pizza Builder**: All 32 toppings, 5 crusts, 9 sauces
- **Specialty Items**: Both pizzas and calzones with proper pricing

### Admin Features
- **Management Portal**: Full access to menu management
- **Order Management**: Complete order tracking system
- **Settings Management**: All app configuration options

### User Experience
- **Proper Pricing**: Specialty items maintain their correct prices
- **Email Notifications**: Order confirmations and password resets
- **Full Functionality**: Everything working as in development

## 🔧 Troubleshooting

### If Import Fails
```bash
# Check database connection
npx prisma db pull

# Check for schema differences
npx prisma db push --accept-data-loss

# Re-run import
node import-pizzax-export-2025-09-11T22-37-38-543Z.js
```

### If Some Data Is Missing
The script includes dependency management and should import all data. If something is missing:
1. Check the import script logs for errors
2. Verify all foreign key relationships
3. Re-run the import script (it clears existing data first)

### If Emails Don't Work
1. Verify Gmail App Password is correct
2. Check SMTP environment variables
3. Test with `/api/test-email` endpoint

## 📞 Support
If you encounter issues:
1. Check the application logs for specific errors
2. Verify environment variables are set correctly
3. Ensure database connection is working
4. Test step-by-step after each import phase

Your local development environment will serve as the reference for how everything should work in production.