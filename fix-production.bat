@echo off
echo.
echo ================================
echo PRODUCTION SERVER QUICK FIX
echo ================================
echo.

echo 1. Testing connectivity...
ping -n 2 91.99.58.154
if errorlevel 1 (
    echo ERROR: Cannot reach server
    pause
    exit /b 1
)

echo.
echo 2. Testing SSH connection...
ssh -i "C:\Users\auy1j\.ssh\new_hetzner_key" -o ConnectTimeout=10 root@91.99.58.154 "echo 'SSH OK'"
if errorlevel 1 (
    echo ERROR: SSH connection failed
    pause
    exit /b 1
)

echo.
echo 3. Checking and restarting containers...
ssh -i "C:\Users\auy1j\.ssh\new_hetzner_key" root@91.99.58.154 "cd /opt/pizza-app && docker-compose down && docker-compose up -d"

echo.
echo 4. Waiting for startup...
timeout /t 30 /nobreak

echo.
echo 5. Testing production API...
curl -s -m 10 http://91.99.58.154:3000/api/health
if errorlevel 1 (
    echo WARNING: API not responding yet
) else (
    echo SUCCESS: API is responding
)

echo.
echo ================================
echo PRODUCTION FIX COMPLETE
echo ================================
pause
