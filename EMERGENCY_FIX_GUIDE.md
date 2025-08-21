# EMERGENCY SERVER CRASH FIX GUIDE

## 🚨 Critical Issue: Development Server Unstable

### Current Symptoms:
- Server crashes on any HTTP request
- Server crashes after ~1-2 minutes of idle time
- Database connection issues
- Repeated crash/restart cycle

### Root Causes Identified:
1. **Database Connection Pool Exhaustion** - Scripts calling `prisma.$disconnect()`
2. **Memory Leaks** - Possible memory management issues
3. **Port Conflicts** - Multiple node processes competing
4. **Hot Reload Issues** - Turbopack development issues

## 🛠️ IMMEDIATE FIXES TO APPLY:

### Step 1: Clean Environment Reset
```powershell
# Kill all node processes
taskkill /F /IM node.exe

# Clear Next.js cache
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Clear node modules cache
npm cache clean --force

# Reinstall dependencies (if needed)
# npm install
```

### Step 2: Disable Turbopack (Testing)
```powershell
# Run without Turbopack to test stability
npm run dev -- --no-turbo
```

### Step 3: Database Connection Reset
```powershell
# Reset PostgreSQL connections
psql -U pizzabuilder -d pizzadb -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'pizzadb' AND pid <> pg_backend_pid();"
```

### Step 4: Environment Variables Check
```bash
# Verify DATABASE_URL is correct
echo $env:DATABASE_URL
# Should be: postgresql://pizzabuilder:pizzapassword@localhost:5432/pizzadb
```

## 🔧 PERMANENT FIXES IMPLEMENTED:

1. **Enhanced Prisma Client** - `/src/lib/prisma.ts`
   - Connection pool limits
   - Graceful shutdown handling
   - Singleton pattern enforcement

2. **Safe Script Runner** - `/safe-db-runner.js`
   - Prevents `prisma.$disconnect()` in scripts
   - Isolated execution environment

3. **Health Monitoring** - `/server-health.js`
   - Real-time server diagnostics
   - Automatic restart capabilities

4. **Database Safety** - `/DATABASE_SCRIPT_SAFETY.md`
   - Documentation for safe script usage
   - List of dangerous scripts

## 🚀 RECOVERY PROCEDURE:

1. **Emergency Reset:**
   ```powershell
   node emergency-fix.js reset
   ```

2. **Start Clean Server:**
   ```powershell
   npm run dev:safe
   ```

3. **Monitor Health:**
   ```powershell
   node server-health.js monitor
   ```

## 📋 TESTING CHECKLIST:

- [ ] Server starts without crashes
- [ ] Health endpoint responds
- [ ] Database connections stable
- [ ] No memory leaks detected
- [ ] Scripts run safely

## ⚠️ SCRIPTS TO AVOID:
- create-calzones.js (unsafe)
- Any script with `prisma.$disconnect()`
- Use `safe-db-runner.js` instead

## 🆘 IF STILL CRASHING:
1. Check Windows Event Viewer for Node.js crashes
2. Run with `--inspect` for debugging
3. Consider downgrading Next.js version
4. Check antivirus interference
5. Try different port: `npm run dev -- --port 3006`

**Last Updated:** August 21, 2025
**Status:** CRITICAL - Multiple crash vectors identified
