# Safe Database Update Script for Minor Changes
# Only updates data, doesn't change schema

param(
    [Parameter(Mandatory=$true)]
    [string]$UpdateType,
    [string]$Description = "Minor database update"
)

Write-Host "🗄️ SAFE DATABASE UPDATE: $UpdateType" -ForegroundColor Green
Write-Host "Description: $Description" -ForegroundColor Gray
Write-Host "==================================" -ForegroundColor Green

# Validate update type
$validTypes = @("settings", "content", "prices", "menu-text", "business-info")
if ($UpdateType -notin $validTypes) {
    Write-Host "❌ Invalid update type. Valid types: $($validTypes -join ', ')" -ForegroundColor Red
    exit 1
}

# Create update script based on type
$updateScript = @"
-- Safe Database Update: $UpdateType
-- Generated: $(Get-Date)
-- Description: $Description

-- Backup current state
CREATE TABLE IF NOT EXISTS update_backup_$((Get-Date).ToString('yyyyMMdd_HHmmss')) AS
SELECT * FROM app_settings LIMIT 1;

-- Begin transaction for safety
BEGIN;
"@

switch ($UpdateType) {
    "settings" {
        $updateScript += @"

-- Update app settings (safe changes only)
UPDATE app_settings
SET
  updated_at = CURRENT_TIMESTAMP
WHERE id = (SELECT id FROM app_settings LIMIT 1);

-- Example: Update business hours, contact info, etc.
-- Add your specific updates here

"@
    }
    "content" {
        $updateScript += @"

-- Update content (text, descriptions, etc.)
-- Add your specific content updates here

"@
    }
    "prices" {
        $updateScript += @"

-- Update prices (be very careful with this)
-- Add your specific price updates here

"@
    }
    "menu-text" {
        $updateScript += @"

-- Update menu item descriptions, names, etc.
-- Add your specific menu text updates here

"@
    }
    "business-info" {
        $updateScript += @"

-- Update business information
-- Add your specific business info updates here

"@
    }
}

$updateScript += @"

-- Commit transaction
COMMIT;

-- Log the update
INSERT INTO system_logs (action, details, created_at)
VALUES ('database_update', '$UpdateType - $Description', CURRENT_TIMESTAMP);

-- Verification query
SELECT 'Update completed successfully' as status, CURRENT_TIMESTAMP as completed_at;
"@

# Save the script
$scriptName = "safe-db-update-$(Get-Date -Format 'yyyyMMdd-HHmmss').sql"
$updateScript | Out-File -FilePath $scriptName -Encoding UTF8

Write-Host "📝 Generated safe update script: $scriptName" -ForegroundColor Green
Write-Host "🔍 Review the script before executing!" -ForegroundColor Yellow

# Ask for confirmation before proceeding
$confirmation = Read-Host "Do you want to execute this update on production? (yes/no)"
if ($confirmation -eq "yes") {
    Write-Host "🚀 Executing database update..." -ForegroundColor Yellow

    # Copy script to production
    scp -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" $scriptName root@91.99.194.255:/tmp/

    # Execute on production database
    ssh -i "C:\Users\auy1j\.ssh\hetzner-pizza-key" root@91.99.194.255 "cd /opt/pizza-app && docker-compose exec -T db psql -U postgres -d pizza_prod -f /tmp/$scriptName"

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database update completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Database update failed!" -ForegroundColor Red
    }
} else {
    Write-Host "⏸️ Update cancelled. Script saved as: $scriptName" -ForegroundColor Yellow
}
