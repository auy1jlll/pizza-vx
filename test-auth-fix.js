const fetch = require('node-fetch');

async function testAuthenticatedAPI() {
  try {
    console.log('🔍 Testing authenticated customization groups API...\n');

    // First, login to get authentication
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

    // Now test the customization groups API with authentication
    console.log('\n📡 Testing customization groups API with auth...');
    const groupsResponse = await fetch('http://localhost:3005/api/admin/menu/customization-groups', {
      headers: {
        'Cookie': cookies || ''
      }
    });

    console.log(`📊 Groups API status: ${groupsResponse.status}`);

    if (groupsResponse.ok) {
      const data = await groupsResponse.json();
      console.log(`✅ Success! Found ${Array.isArray(data) ? data.length : 'invalid'} customization groups`);
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('\n📋 First few groups:');
        data.slice(0, 3).forEach((group, index) => {
          console.log(`${index + 1}. ${group.name} (${group.type}) - Active: ${group.isActive}`);
        });
      }
    } else {
      const errorData = await groupsResponse.text();
      console.log('❌ Groups API failed:', errorData);
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testAuthenticatedAPI();
