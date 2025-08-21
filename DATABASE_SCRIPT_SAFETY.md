# ⚠️ CRITICAL: Database Script Safety Warning

## 🚨 IMPORTANT: DO NOT RUN DATABASE SCRIPTS DIRECTLY WHEN DEV SERVER IS RUNNING!

Many scripts in this workspace contain `prisma.$disconnect()` calls that **WILL CRASH** your development server.

### ✅ Safe Usage:

**Option 1: Use the Safe Runner (Recommended)**
```bash
node safe-db-runner.js create-calzones.js
```

**Option 2: Shut Down Dev Server First**
```bash
# Stop dev server (Ctrl+C)
node create-calzones.js
# Restart dev server
npm run dev
```

### ❌ Dangerous Scripts (Known to crash dev server):
- create-calzones.js
- create-hot-subs.js  
- create-admin.js
- seed-settings.js
- And 120+ other scripts with `prisma.$disconnect()`

### 🔧 Root Cause:
Scripts calling `prisma.$disconnect()` close the database connection pool, causing the Next.js dev server to lose database connectivity and crash.

### 📋 Recently Fixed:
- ✅ create-calzones.js - `prisma.$disconnect()` commented out
- ✅ safe-db-runner.js - Created to run scripts safely

### 🛠️ For Developers:
When creating new database scripts:
1. Either don't call `prisma.$disconnect()` in dev environment
2. Or use the safe-db-runner utility
3. Or clearly document the script will crash dev server

**Last Updated:** August 21, 2025
**Issue Discovered:** During calzone creation causing unexpected server shutdown
