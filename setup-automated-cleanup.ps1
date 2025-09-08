# AUTOMATED DOCKER CLEANUP SCHEDULE
# Prevents storage bloat by cleaning up regularly

Write-Host "📅 Setting up automated Docker cleanup schedule" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Create cleanup script on server
$cleanupScript = @"
#!/bin/bash
# Automated Docker cleanup script
echo "[\$(date)] Starting Docker cleanup..."

# Clean up unused Docker resources
docker system prune -f

# Remove old pizza-app images (keep only latest 2)
docker images pizza-app_app --format '{{.ID}} {{.CreatedAt}}' | sort -k2 -r | tail -n +3 | awk '{print \$1}' | xargs -r docker rmi -f

# Log current usage
echo "[\$(date)] Docker usage after cleanup:"
docker system df

echo "[\$(date)] Cleanup completed"
"@

# Transfer cleanup script to server
Write-Host "`n📄 Creating cleanup script on server..." -ForegroundColor Cyan
$cleanupScript | ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "cat > /opt/docker-cleanup.sh && chmod +x /opt/docker-cleanup.sh"

# Add to crontab (run daily at 2 AM)
Write-Host "`n⏰ Setting up daily cleanup schedule..." -ForegroundColor Cyan
ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 '(crontab -l 2>/dev/null | grep -v docker-cleanup; echo "0 2 * * * /opt/docker-cleanup.sh >> /var/log/docker-cleanup.log 2>&1") | crontab -'

# Test the cleanup script
Write-Host "`n🧪 Testing cleanup script..." -ForegroundColor Yellow
ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "/opt/docker-cleanup.sh"

Write-Host "`n✅ Automated cleanup is now configured!" -ForegroundColor Green
Write-Host "• Runs daily at 2 AM server time" -ForegroundColor White
Write-Host "• Keeps only 2 latest pizza-app images" -ForegroundColor White
Write-Host "• Logs to /var/log/docker-cleanup.log" -ForegroundColor White

Write-Host "`n📊 Current server status:" -ForegroundColor Cyan
ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "df -h / && echo && docker system df"
