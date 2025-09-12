@echo off
echo 🚀 Starting production deployment...
echo.

REM Production server details
set SERVER=91.99.58.154
set KEY_PATH=C:\Users\auy1j\.ssh\new_hetzner_key
set LOCAL_PROJECT=C:\Users\auy1j\Desktop\final

echo 📦 Uploading critical fixed files to production...

REM Upload the key fixed files
scp -i "%KEY_PATH%" "%LOCAL_PROJECT%\src\services\order.ts" root@%SERVER%:/root/src/services/order.ts
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to upload order.ts
    pause
    exit /b 1
)

scp -i "%KEY_PATH%" "%LOCAL_PROJECT%\src\app\api\checkout\route.ts" root@%SERVER%:/root/src/app/api/checkout/route.ts
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to upload checkout route
    pause
    exit /b 1
)

scp -i "%KEY_PATH%" "%LOCAL_PROJECT%\src\lib\gmail-service.ts" root@%SERVER%:/root/src/lib/gmail-service.ts
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to upload gmail service
    pause
    exit /b 1
)

echo ✅ All files uploaded successfully!
echo.

echo 🔧 Rebuilding and restarting production services...

REM SSH and rebuild production
ssh -i "%KEY_PATH%" root@%SERVER% "cd /root && docker-compose down && docker-compose build --no-cache && docker-compose up -d && sleep 15 && docker exec typescript-app npx prisma db push && docker exec postgres-db psql -U postgres -d resto_app -c 'UPDATE app_settings SET value = \"true\" WHERE key = \"emailNotifications\";' && echo '✅ Production deployment completed!' && docker ps"

if %ERRORLEVEL% neq 0 (
    echo ❌ Deployment failed
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment completed successfully!
echo 🌐 Application available at: http://91.99.58.154:3000
echo.
pause
