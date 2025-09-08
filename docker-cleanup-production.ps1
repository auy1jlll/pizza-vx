# Docker Cleanup Script for Production Server
# Prevents storage bloat from accumulating Docker layers

Write-Host "🧹 Docker Cleanup for Production Server" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Check current disk usage
Write-Host "`n📊 Current Docker disk usage:" -ForegroundColor Yellow
ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "docker system df"

Write-Host "`n📋 Current images:" -ForegroundColor Yellow
ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "docker images --format 'table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}'"

# Cleanup unused Docker resources
Write-Host "`n🗑️ Cleaning up unused Docker resources..." -ForegroundColor Cyan
ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "docker system prune -f"

# Remove dangling images
Write-Host "`n🖼️ Removing dangling images..." -ForegroundColor Cyan
ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "docker image prune -f"

# Remove old pizza-app images (keep only latest 2)
Write-Host "`n🍕 Cleaning old pizza-app images (keeping latest 2)..." -ForegroundColor Cyan
ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "docker images pizza-app_app --format '{{.ID}} {{.CreatedAt}}' | sort -k2 -r | tail -n +3 | awk '{print \$1}' | xargs -r docker rmi -f"

Write-Host "`n📊 Disk usage after cleanup:" -ForegroundColor Green
ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "docker system df"

Write-Host "`n✅ Cleanup complete!" -ForegroundColor Green
