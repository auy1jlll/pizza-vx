# Server Storage Monitoring Script
# Monitors disk usage and Docker storage consumption

Write-Host "📊 Production Server Storage Analysis" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Overall disk usage
Write-Host "`n💾 Server Disk Usage:" -ForegroundColor Yellow
ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "df -h /"

# Docker storage breakdown
Write-Host "`n🐋 Docker Storage Usage:" -ForegroundColor Yellow
ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "docker system df -v"

# Pizza app directory size
Write-Host "`n🍕 Pizza App Directory Size:" -ForegroundColor Yellow
ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "du -sh /opt/pizza-app"

# Docker images related to pizza app
Write-Host "`n📦 Pizza App Docker Images:" -ForegroundColor Yellow
ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "docker images | grep -E '(pizza|opt)'"

# Container status
Write-Host "`n🏃 Running Containers:" -ForegroundColor Yellow
ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Size}}'"

# Cleanup recommendations
Write-Host "`n💡 Storage Optimization Recommendations:" -ForegroundColor Cyan
$diskUsage = ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "df -h / | tail -1 | awk '{print \$5}' | sed 's/%//'"
$dockerSize = ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "docker system df | grep 'Local Volumes' | awk '{print \$3}'"

Write-Host "• Current disk usage: $diskUsage%" -ForegroundColor White
if ([int]$diskUsage -gt 70) {
    Write-Host "⚠️ HIGH DISK USAGE! Consider cleanup" -ForegroundColor Red
    Write-Host "  - Run: .\docker-cleanup-production.ps1" -ForegroundColor Yellow
    Write-Host "  - Use: .\deploy-optimized.ps1 -ForceCleanup" -ForegroundColor Yellow
} elseif ([int]$diskUsage -gt 50) {
    Write-Host "⚠️ Moderate disk usage - monitor closely" -ForegroundColor Yellow
    Write-Host "  - Run: .\docker-cleanup-production.ps1" -ForegroundColor Yellow
} else {
    Write-Host "✅ Disk usage is healthy" -ForegroundColor Green
}

Write-Host "`n🔧 Quick Cleanup Commands:" -ForegroundColor Cyan
Write-Host "• Light cleanup: .\docker-cleanup-production.ps1" -ForegroundColor White
Write-Host "• Heavy cleanup: .\deploy-optimized.ps1 -ForceCleanup" -ForegroundColor White
Write-Host "• Next deployment: .\deploy-optimized.ps1" -ForegroundColor White
