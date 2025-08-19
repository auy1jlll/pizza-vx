const fetch = require('node-fetch');

async function testAuthMeEndpoint() {
  try {
    console.log('🔍 Testing complete authentication flow...\n');

    // Step 1: Login as admin
    console.log('Step 1: 🔐 Logging in as admin...');
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
    console.log('🍪 Cookies received:', cookies ? 'Yes' : 'No');

    // Step 2: Test /api/auth/me with the cookies
    console.log('\nStep 2: 📡 Testing /api/auth/me endpoint...');
    const meResponse = await fetch('http://localhost:3005/api/auth/me', {
      headers: {
        'Cookie': cookies || ''
      }
    });

    console.log(`📊 /api/auth/me status: ${meResponse.status}`);

    if (meResponse.ok) {
      const userData = await meResponse.json();
      console.log('✅ Success! User data:', {
        id: userData.user?.id,
        email: userData.user?.email,
        name: userData.user?.name,
        role: userData.user?.role
      });
    } else {
      const errorData = await meResponse.text();
      console.log('❌ /api/auth/me failed:', errorData);
    }

    // Step 3: Test customization groups endpoint
    console.log('\nStep 3: 📡 Testing customization groups API...');
    const groupsResponse = await fetch('http://localhost:3005/api/admin/menu/customization-groups', {
      headers: {
        'Cookie': cookies || ''
      }
    });

    console.log(`📊 Groups API status: ${groupsResponse.status}`);

    if (groupsResponse.ok) {
      const groupsData = await groupsResponse.json();
      console.log(`✅ Groups API success - ${Array.isArray(groupsData) ? groupsData.length : 'invalid'} groups`);
    } else {
      const errorData = await groupsResponse.text();
      console.log('❌ Groups API failed:', errorData);
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testAuthMeEndpoint();
