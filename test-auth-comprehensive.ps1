#!/usr/bin/env pwsh

# Comprehensive Authentication Test for Production
Write-Host "🔐 COMPREHENSIVE PRODUCTION AUTHENTICATION TEST" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Yellow

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [string]$Body = "",
        [Microsoft.PowerShell.Commands.WebRequestSession]$Session = $null,
        [switch]$ExpectAuth
    )
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            UseBasicParsing = $true
        }
        
        if ($Headers.Count -gt 0) {
            $params.Headers = $Headers
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }
        
        if ($Session) {
            $params.WebSession = $Session
        }
        
        $response = Invoke-WebRequest @params
        Write-Host "✅ $Name : $($response.StatusCode)" -ForegroundColor Green
        return $response
    }
    catch {
        if ($ExpectAuth -and $_.Exception.Response.StatusCode -eq 401) {
            Write-Host "✅ $Name : 401 (Expected - requires auth)" -ForegroundColor Yellow
        } else {
            Write-Host "❌ $Name : $($_.Exception.Message)" -ForegroundColor Red
        }
        return $null
    }
}

# Test 1: Basic API Health
Write-Host "`n1. BASIC CONNECTIVITY TESTS" -ForegroundColor Yellow
Write-Host "-" * 30
Test-Endpoint "Health Check" "http://91.99.194.255:3000/api/health"
Test-Endpoint "Settings API" "http://91.99.194.255:3000/api/settings"

# Test 2: Unauthenticated Protected Routes (should return 401)
Write-Host "`n2. PROTECTED ROUTES (NO AUTH - SHOULD FAIL)" -ForegroundColor Yellow  
Write-Host "-" * 45
Test-Endpoint "Auth Me (no auth)" "http://91.99.194.255:3000/api/auth/me" -ExpectAuth
Test-Endpoint "Dashboard (no auth)" "http://91.99.194.255:3000/api/management-portal/dashboard" -ExpectAuth
Test-Endpoint "Admin Crusts (no auth)" "http://91.99.194.255:3000/api/admin/crusts" -ExpectAuth

# Test 3: Admin Login and Authentication Flow
Write-Host "`n3. ADMIN AUTHENTICATION FLOW" -ForegroundColor Yellow
Write-Host "-" * 32

$loginData = @{
    username = "auy1jll33@gmail.com"
    password = "admin123"
} | ConvertTo-Json

Write-Host "Attempting admin login..." -ForegroundColor Cyan
$loginResponse = Test-Endpoint "Admin Login" "http://91.99.194.255:3000/api/auth/login" -Method POST -Body $loginData

if ($loginResponse) {
    # Check Set-Cookie header
    $setCookieHeader = $loginResponse.Headers['Set-Cookie']
    if ($setCookieHeader -like "*admin-token*") {
        Write-Host "🍪 Cookie Set: admin-token found" -ForegroundColor Cyan
        if ($setCookieHeader -like "*Secure*") {
            Write-Host "⚠️  WARNING: Cookie still has Secure flag!" -ForegroundColor Red
        } else {
            Write-Host "✅ Cookie Security: No Secure flag (HTTP compatible)" -ForegroundColor Green
        }
    }
    
    # Create session for subsequent requests
    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    
    # Extract and manually set cookie if needed
    if ($setCookieHeader) {
        $cookieValue = ($setCookieHeader -split ';')[0] -replace 'admin-token=', ''
        $cookie = New-Object System.Net.Cookie("admin-token", $cookieValue, "/", "91.99.194.255")
        $session.Cookies.Add($cookie)
    }
    
    Write-Host "`n4. AUTHENTICATED REQUESTS" -ForegroundColor Yellow
    Write-Host "-" * 26
    
    # Test authenticated endpoints
    Test-Endpoint "Auth Me (with session)" "http://91.99.194.255:3000/api/auth/me" -Session $session
    Test-Endpoint "Dashboard (with session)" "http://91.99.194.255:3000/api/management-portal/dashboard" -Session $session
    Test-Endpoint "Admin Crusts (with session)" "http://91.99.194.255:3000/api/admin/crusts" -Session $session
    Test-Endpoint "Menu Categories (with session)" "http://91.99.194.255:3000/api/management-portal/menu/categories" -Session $session
}

# Test 4: Customer Authentication
Write-Host "`n5. CUSTOMER AUTHENTICATION TEST" -ForegroundColor Yellow
Write-Host "-" * 33

$customerData = @{
    email = "test@customer.com"
    password = "password123"
} | ConvertTo-Json

Test-Endpoint "Customer Login" "http://91.99.194.255:3000/api/auth/customer/login" -Method POST -Body $customerData

Write-Host "`n6. SUMMARY" -ForegroundColor Yellow
Write-Host "-" * 10
Write-Host "Test completed. Check results above for any failures." -ForegroundColor Cyan
Write-Host "Key things to verify:" -ForegroundColor Yellow
Write-Host "  - All health checks pass" -ForegroundColor White
Write-Host "  - Admin login works (200)" -ForegroundColor White  
Write-Host "  - Cookies don't have Secure flag" -ForegroundColor White
Write-Host "  - Authenticated requests work after login" -ForegroundColor White
Write-Host "  - Unauthenticated requests properly return 401" -ForegroundColor White
