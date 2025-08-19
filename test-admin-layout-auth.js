const fetch = require('node-fetch');

async function testAdminSizesAuth() {
  try {
    console.log('🔍 Testing AdminLayout authentication check...\n');

    // Login first
    console.log('🔐 Logging in as admin...');
    const loginResponse = await fetch('http://localhost:3005/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin@pizzabuilder.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed:', loginResponse.status);
      return;
    }

    console.log('✅ Login successful');
    const cookies = loginResponse.headers.get('set-cookie');

    // Test the endpoint AdminLayout uses for auth check
    console.log('\n📡 Testing /api/admin/sizes endpoint (AdminLayout auth check)...');
    const sizesResponse = await fetch('http://localhost:3005/api/admin/sizes', {
      method: 'GET',
      headers: {
        'Cookie': cookies || ''
      }
    });

    console.log(`📊 AdminLayout auth check status: ${sizesResponse.status}`);

    if (sizesResponse.ok) {
      console.log('✅ AdminLayout auth check passed');
    } else {
      console.log('❌ AdminLayout auth check failed');
    }

    // Compare with /api/auth/me
    console.log('\n📡 Comparing with /api/auth/me...');
    const meResponse = await fetch('http://localhost:3005/api/auth/me', {
      headers: {
        'Cookie': cookies || ''
      }
    });

    console.log(`📊 /api/auth/me status: ${meResponse.status}`);

    if (meResponse.ok) {
      console.log('✅ /api/auth/me passed');
    } else {
      console.log('❌ /api/auth/me failed');
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testAdminSizesAuth();
