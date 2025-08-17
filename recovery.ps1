# Quick Recovery Script for Container Issues
# Run with: .\recovery.ps1

param(
    [switch]$Nuclear,      # Complete reset with data loss
    [switch]$Restart,      # Just restart containers
    [switch]$Rebuild,      # Rebuild and restart
    [switch]$CheckOnly     # Just check status
)

Write-Host "🚑 Pizza Builder App Recovery Tool" -ForegroundColor Cyan

function Write-Status {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Check-Health {
    Write-Status "Checking application health..."
    
    # Check containers
    $containers = docker-compose ps --services --filter "status=running"
    if ($containers) {
        Write-Status "Running containers: $($containers -join ', ')"
    } else {
        Write-Error "No containers are running"
        return $false
    }
    
    # Check health endpoint
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Status "Health endpoint: OK"
            return $true
        } else {
            Write-Error "Health endpoint returned: $($response.StatusCode)"
            return $false
        }
    } catch {
        Write-Error "Health endpoint unreachable: $($_.Exception.Message)"
        return $false
    }
}

function Fix-CommonIssues {
    Write-Status "Applying common fixes..."
    
    # Fix 1: Restart containers
    Write-Status "Restarting containers..."
    docker-compose restart
    Start-Sleep 10
    
    if (Check-Health) {
        Write-Status "✓ Simple restart fixed the issue!"
        return $true
    }
    
    # Fix 2: Restart database specifically
    Write-Status "Restarting database..."
    docker-compose restart db
    Start-Sleep 15
    
    if (Check-Health) {
        Write-Status "✓ Database restart fixed the issue!"
        return $true
    }
    
    # Fix 3: Full restart
    Write-Status "Performing full restart..."
    docker-compose down
    Start-Sleep 3
    docker-compose up -d
    Start-Sleep 20
    
    if (Check-Health) {
        Write-Status "✓ Full restart fixed the issue!"
        return $true
    }
    
    Write-Warning "Common fixes didn't work. Try -Rebuild or -Nuclear options."
    return $false
}

# Main execution logic
if ($CheckOnly) {
    if (Check-Health) {
        Write-Status "✅ Application is healthy!"
        exit 0
    } else {
        Write-Error "❌ Application has issues"
        exit 1
    }
}

if ($Nuclear) {
    Write-Warning "⚠️ NUCLEAR OPTION: This will delete ALL data!"
    $confirm = Read-Host "Type 'DELETE_ALL_DATA' to confirm"
    
    if ($confirm -eq "DELETE_ALL_DATA") {
        Write-Status "Performing nuclear reset..."
        docker-compose down -v
        docker system prune -f
        docker volume prune -f
        docker-compose up -d --build
        Start-Sleep 30
        
        # Recreate admin user
        docker-compose exec -T app npx prisma migrate deploy
        docker-compose exec -T app npx prisma db seed
        
        Write-Status "Nuclear reset complete. Default admin: admin@pizzabuilder.com / admin123"
    } else {
        Write-Status "Nuclear reset cancelled."
        exit 1
    }
} elseif ($Rebuild) {
    Write-Status "Rebuilding containers..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    Start-Sleep 20
} elseif ($Restart) {
    Write-Status "Restarting containers..."
    docker-compose restart
    Start-Sleep 10
} else {
    # Default: try common fixes
    if (!(Fix-CommonIssues)) {
        Write-Status "Suggestions:"
        Write-Status "  .\recovery.ps1 -Restart     # Simple restart"
        Write-Status "  .\recovery.ps1 -Rebuild     # Rebuild containers"
        Write-Status "  .\recovery.ps1 -Nuclear     # Nuclear option (loses data)"
        Write-Status "  .\recovery.ps1 -CheckOnly   # Just check status"
    }
}

# Final health check
Start-Sleep 5
if (Check-Health) {
    Write-Status "🎉 Recovery successful!"
    Write-Status "App available at: http://localhost:3000"
    Write-Status "Admin login: http://localhost:3000/admin/login"
} else {
    Write-Error "Recovery failed. Check logs: docker-compose logs"
}
