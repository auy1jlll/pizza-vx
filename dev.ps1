# PowerShell version for Windows
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("dev", "dev-build", "prod", "stop", "db-only")]
    [string]$Command
)

switch ($Command) {
    "dev" {
        Write-Host "🔥 Starting development mode with hot reload..." -ForegroundColor Green
        docker-compose -f docker-compose.dev.yml up
    }
    "dev-build" {
        Write-Host "🔄 Rebuilding development containers..." -ForegroundColor Yellow
        docker-compose -f docker-compose.dev.yml up --build
    }
    "prod" {
        Write-Host "🚀 Starting production mode..." -ForegroundColor Blue
        docker-compose up --build
    }
    "stop" {
        Write-Host "⏹️ Stopping all containers..." -ForegroundColor Red
        docker-compose down
        docker-compose -f docker-compose.dev.yml down
    }
    "db-only" {
        Write-Host "💾 Starting database only..." -ForegroundColor Cyan
        docker-compose up db -d
    }
}

Write-Host ""
Write-Host "Available commands:" -ForegroundColor White
Write-Host "  dev       - Start with hot reload" -ForegroundColor Gray
Write-Host "  dev-build - Rebuild and start with hot reload" -ForegroundColor Gray  
Write-Host "  prod      - Start production mode" -ForegroundColor Gray
Write-Host "  stop      - Stop all containers" -ForegroundColor Gray
Write-Host "  db-only   - Start only database" -ForegroundColor Gray
