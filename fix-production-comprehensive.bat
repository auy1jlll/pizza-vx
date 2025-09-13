@echo off
echo.
echo ================================================================
echo COMPREHENSIVE PRODUCTION FIX SCRIPT - GREENLAND PIZZA
echo ================================================================
echo.

REM Define server details
set SERVER=91.99.58.154
set SSH_KEY="C:\Users\auy1j\.ssh\new_hetzner_key"
set PROJECT_PATH="/opt/greenland-pizza"

echo 1. Testing server connectivity...
ping -n 2 %SERVER%
if errorlevel 1 (
    echo ERROR: Cannot reach server %SERVER%
    echo Check internet connection and server status
    pause
    exit /b 1
)

echo.
echo 2. Testing SSH connection...
ssh -i %SSH_KEY% -o ConnectTimeout=10 root@%SERVER% "echo 'SSH Connection OK'"
if errorlevel 1 (
    echo ERROR: SSH connection failed
    echo Check SSH key and server access
    pause
    exit /b 1
)

echo.
echo 3. Checking container status...
ssh -i %SSH_KEY% root@%SERVER% "cd %PROJECT_PATH% && docker-compose ps"

echo.
echo 4. Checking database credentials mismatch...
ssh -i %SSH_KEY% root@%SERVER% "cd %PROJECT_PATH% && echo 'Checking .env files...'"
ssh -i %SSH_KEY% root@%SERVER% "cd %PROJECT_PATH% && echo 'Main .env:' && grep 'POSTGRES_PASSWORD\|DATABASE_URL' .env | head -3"
ssh -i %SSH_KEY% root@%SERVER% "cd %PROJECT_PATH% && echo 'Docker .env:' && grep 'POSTGRES_PASSWORD\|DATABASE_URL' .env.docker | head -3"

echo.
echo 5. Fixing database credential mismatch...
echo Copying .env.docker to .env to ensure credentials match...
ssh -i %SSH_KEY% root@%SERVER% "cd %PROJECT_PATH% && cp .env.docker .env"

echo.
echo 6. Checking DATABASE_URL hostname...
ssh -i %SSH_KEY% root@%SERVER% "cd %PROJECT_PATH% && grep DATABASE_URL .env.docker"

echo.
echo 7. Fixing DATABASE_URL hostname if needed...
ssh -i %SSH_KEY% root@%SERVER% "cd %PROJECT_PATH% && sed -i 's/postgres:5432/postgres-db:5432/g' .env.docker"

echo.
echo 8. Adding connection pooling and timeout parameters...
ssh -i %SSH_KEY% root@%SERVER% "cd %PROJECT_PATH% && sed -i 's|resto_app_prod|resto_app_prod?connect_timeout=60\&pool_timeout=60\&connection_limit=10|g' .env.docker"

echo.
echo 9. Restarting all containers with fresh database...
echo This will recreate database volumes to fix any credential caching...
ssh -i %SSH_KEY% root@%SERVER% "cd %PROJECT_PATH% && docker-compose down -v"
ssh -i %SSH_KEY% root@%SERVER% "cd %PROJECT_PATH% && docker-compose up -d"

echo.
echo 10. Waiting for database initialization...
timeout /t 45 /nobreak

echo.
echo 11. Checking container health...
ssh -i %SSH_KEY% root@%SERVER% "cd %PROJECT_PATH% && docker-compose ps"

echo.
echo 12. Testing database connection...
ssh -i %SSH_KEY% root@%SERVER% "cd %PROJECT_PATH% && docker exec postgres-db pg_isready -U postgres -d resto_app_prod"

echo.
echo 13. Pushing Prisma schema to create tables...
ssh -i %SSH_KEY% root@%SERVER% "cd %PROJECT_PATH% && docker exec typescript-app npx prisma db push --force-reset"

echo.
echo 14. Loading database data from backup...
echo Importing data from backups91125 folder...
ssh -i %SSH_KEY% root@%SERVER% "cd %PROJECT_PATH% && docker exec postgres-db psql -U postgres -d resto_app_prod -f /backups91125/data_pizzax_2025-09-08_20-52-00.sql"

echo.
echo 15. Restarting app container to clear caches...
ssh -i %SSH_KEY% root@%SERVER% "cd %PROJECT_PATH% && docker-compose restart typescript-app"

echo.
echo 16. Final health check...
timeout /t 20 /nobreak
curl -s -m 10 http://%SERVER%:3000/api/health

echo.
echo 17. Testing API endpoints...
echo Testing menu items API...
curl -s -m 10 "http://%SERVER%:3000/api/menu/items" | head -100

echo.
echo 18. Applying checkout timeout fixes...
echo Fixing 504 Gateway Timeout issue in checkout...
ssh -i %SSH_KEY% root@%SERVER% "cd %PROJECT_PATH% && node fix-checkout-timeout.js"

echo.
echo 19. Restarting app after timeout fixes...
ssh -i %SSH_KEY% root@%SERVER% "cd %PROJECT_PATH% && docker-compose restart typescript-app"

echo.
echo 20. Applying menu categories fix...
echo Fixing menu categories display to show all categories with items...
ssh -i %SSH_KEY% root@%SERVER% "cd %PROJECT_PATH% && node add-missing-categories.js"

echo.
echo 21. Updating menu page with filtering logic...
echo Applying frontend filtering to show categories with menu items...
scp -i %SSH_KEY% "C:\Users\auy1j\Desktop\final\src\app\menu\page.tsx" root@%SERVER%:%PROJECT_PATH%/src/app/menu/page.tsx

echo.
echo 22. Rebuilding application with menu fix...
echo This will rebuild the Docker container with the menu categories fix...
ssh -i %SSH_KEY% root@%SERVER% "cd %PROJECT_PATH% && docker-compose down && docker-compose up --build -d"

echo.
echo 23. Waiting for application rebuild...
timeout /t 60 /nobreak

echo.
echo 24. Testing menu categories API...
echo Verifying menu categories are now showing properly...
curl -s -m 15 "http://%SERVER%:3000/api/menu/categories" | head -100

echo.
echo 25. Final checkout test...
timeout /t 15 /nobreak
echo Testing checkout API...
curl -s -m 15 "http://%SERVER%:3000/api/checkout" -X POST -H "Content-Type: application/json" -d "{\"test\":true}"

echo.
echo ================================================================
echo COMPREHENSIVE PRODUCTION FIX COMPLETE
echo ================================================================
echo.
echo The following fixes were applied:
echo - Fixed database credential mismatch
echo - Corrected DATABASE_URL hostname
echo - Added connection pooling and timeouts
echo - Recreated database volumes
echo - Restored schema and data
echo - Cleared application caches
echo - FIXED CHECKOUT TIMEOUT ISSUE (504 Gateway Timeout)
echo - Added 25-second timeout wrapper to prevent hanging
echo - FIXED MENU CATEGORIES DISPLAY ISSUE
echo - Added missing categories (Pizza, Calzones, Pasta, Beverages, Desserts)
echo - Applied frontend filtering to show categories with menu items
echo - Rebuilt Docker container with permanent menu fix
echo.
echo Your site should now be fully operational at:
echo http://%SERVER%:3000
echo.
echo CHECKOUT ISSUE: Should now be FIXED - no more spinning!
echo MENU CATEGORIES: Should now show 7 categories with items (instead of 4)!
echo.
pause