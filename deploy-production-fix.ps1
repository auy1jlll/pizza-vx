#!/usr/bin/env pwsh

Write-Host "🍕 Production Server Deployment & Fix Script" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan

$SERVER = "91.99.194.255"
$SSH_KEY = "C:\Users\auy1j\.ssh\hetzner-pizza-key"
$APP_PATH = "/opt/pizza-app"

# Function to run SSH commands with timeout
function Invoke-SSHCommand {
    param(
        [string]$Command,
        [int]$Timeout = 30
    )
    
    try {
        $result = ssh -i $SSH_KEY -o ConnectTimeout=$Timeout root@$SERVER $Command
        return $result
    }
    catch {
        Write-Host "❌ SSH Command failed: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Test connectivity
Write-Host "🔍 Testing server connectivity..." -ForegroundColor Yellow
try {
    $ping = Test-NetConnection -ComputerName $SERVER -Port 22 -WarningAction SilentlyContinue
    if ($ping.TcpTestSucceeded) {
        Write-Host "✅ Server is reachable on SSH port 22" -ForegroundColor Green
    } else {
        Write-Host "❌ Cannot reach server on SSH port 22" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Network connectivity test failed" -ForegroundColor Red
    exit 1
}

# Test SSH connection
Write-Host "🔐 Testing SSH connection..." -ForegroundColor Yellow
$sshTest = Invoke-SSHCommand "echo 'SSH connection successful'" 5
if ($sshTest) {
    Write-Host "✅ SSH connection working" -ForegroundColor Green
} else {
    Write-Host "❌ SSH connection failed" -ForegroundColor Red
    exit 1
}

# Check Docker status
Write-Host "🐳 Checking Docker status..." -ForegroundColor Yellow
$dockerStatus = Invoke-SSHCommand "systemctl is-active docker" 10
if ($dockerStatus -eq "active") {
    Write-Host "✅ Docker is running" -ForegroundColor Green
} else {
    Write-Host "⚠️ Docker not active, starting..." -ForegroundColor Yellow
    Invoke-SSHCommand "systemctl start docker && sleep 3"
}

# Check current container status
Write-Host "📦 Checking container status..." -ForegroundColor Yellow
$containerStatus = Invoke-SSHCommand "cd $APP_PATH && docker-compose ps" 15
Write-Host "Container status:" -ForegroundColor Cyan
Write-Host $containerStatus

# Stop containers if running
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
Invoke-SSHCommand "cd $APP_PATH && docker-compose down --remove-orphans" 20

# Create a simple, working Dockerfile
Write-Host "📝 Creating optimized Dockerfile..." -ForegroundColor Yellow
$dockerfileContent = @"
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci --only=production --frozen-lockfile && npm cache clean --force
RUN npx prisma generate

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
RUN apk add --no-cache curl dumb-init && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy with correct ownership from the start
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Create required directories with correct permissions
RUN mkdir -p /app/public/images /app/public/uploads && \
    chown -R nextjs:nodejs /app/public && \
    chmod -R 755 /app/public

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
"@

# Deploy the new Dockerfile
Write-Host "📤 Deploying new Dockerfile..." -ForegroundColor Yellow
$dockerfileContent | ssh -i $SSH_KEY root@$SERVER "cat > $APP_PATH/Dockerfile"

# Deploy source files
Write-Host "📤 Deploying application files..." -ForegroundColor Yellow
scp -i $SSH_KEY -r src prisma package.json package-lock.json next.config.ts tailwind.config.ts tsconfig.json .env.production root@${SERVER}:${APP_PATH}/

# Build and start containers
Write-Host "🔨 Building and starting containers..." -ForegroundColor Yellow
Invoke-SSHCommand "cd $APP_PATH && docker-compose build --no-cache app" 180
Invoke-SSHCommand "cd $APP_PATH && docker-compose up -d" 60

# Wait for containers to start
Write-Host "⏳ Waiting for containers to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check final status
Write-Host "🏁 Checking final status..." -ForegroundColor Yellow
$finalStatus = Invoke-SSHCommand "cd $APP_PATH && docker-compose ps" 15
Write-Host "Final container status:" -ForegroundColor Cyan
Write-Host $finalStatus

# Test the API
Write-Host "🧪 Testing production API..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

try {
    $response = Invoke-RestMethod -Uri "http://$SERVER:3000/api/health" -Method GET -TimeoutSec 15
    Write-Host "✅ Production API is responding!" -ForegroundColor Green
    Write-Host "Health check response: $response" -ForegroundColor Green
} catch {
    Write-Host "❌ Production API test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test specialty pizzas endpoint
try {
    $pizzaResponse = Invoke-RestMethod -Uri "http://$SERVER:3000/api/specialty-pizzas" -Method GET -TimeoutSec 15
    if ($pizzaResponse.data) {
        Write-Host "✅ Specialty pizzas API working! Found $($pizzaResponse.data.Count) pizzas" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ Specialty pizzas API test failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "🎉 Production deployment script completed!" -ForegroundColor Green
Write-Host "🌐 Production URL: http://$SERVER:3000" -ForegroundColor Cyan
