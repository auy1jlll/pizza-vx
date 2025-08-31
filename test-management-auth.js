// Test management portal authentication flow
const fetch = require('node-fetch');

async function testManagementPortalLogin() {
  console.log('🔐 Testing Management Portal Authentication Flow...\n');
  
  try {
    // Step 1: Login with employee credentials (case-insensitive)
    console.log('1️⃣ Attempting login with employee credentials...');
    const loginResponse = await fetch('http://localhost:3005/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'staff101@greenlandfamous.com', // lowercase version
        password: 'employee123'
      }),
    });

    console.log('Login response status:', loginResponse.status);
    
    if (!loginResponse.ok) {
      const error = await loginResponse.json();
      console.log('❌ Login failed:', error);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful!');
    console.log('User role:', loginData.user?.role);
    console.log('User email:', loginData.user?.email);

    // Extract the token from response cookies
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('Cookies received:', !!cookies);

    // Step 2: Test dashboard access (this should now work for EMPLOYEE role)
    console.log('\n2️⃣ Testing dashboard access...');
    
    const dashboardResponse = await fetch('http://localhost:3005/api/management-portal/dashboard', {
      headers: {
        'Cookie': cookies || ''
      }
    });

    console.log('Dashboard response status:', dashboardResponse.status);
    
    if (dashboardResponse.ok) {
      console.log('✅ Dashboard access successful! Employee can now access management portal.');
    } else {
      const dashboardError = await dashboardResponse.json();
      console.log('❌ Dashboard access failed:', dashboardError);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testManagementPortalLogin();
