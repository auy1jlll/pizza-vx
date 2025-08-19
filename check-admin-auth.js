const fetch = require('node-fetch');

async function checkAdminAuth() {
  try {
    console.log('🔍 Checking admin authentication...\n');

    // Test the auth endpoint used by AdminLayout
    const authResponse = await fetch('http://localhost:3005/api/admin/sizes');
    console.log(`📊 Auth check status: ${authResponse.status}`);
    
    if (authResponse.status === 401) {
      console.log('❌ Not authenticated - need to login as admin');
      
      // Let's try to login as admin
      console.log('\n🔐 Attempting admin login...');
      
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
      
      console.log(`📊 Login status: ${loginResponse.status}`);
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Login successful');
        console.log('📊 User role:', loginData.user?.role);
        
        // Get cookies from login response
        const cookies = loginResponse.headers.get('set-cookie');
        console.log('🍪 Cookies:', cookies ? 'Received' : 'None');
        
        // Test auth again with cookies
        const retestResponse = await fetch('http://localhost:3005/api/admin/sizes', {
          headers: {
            'Cookie': cookies || ''
          }
        });
        console.log(`📊 Retest auth status: ${retestResponse.status}`);
        
      } else {
        const errorData = await loginResponse.text();
        console.log('❌ Login failed:', errorData);
        console.log('❌ Status:', loginResponse.status);
        console.log('❌ Headers:', loginResponse.headers.get('content-type'));
      }
      
    } else if (authResponse.status === 200) {
      console.log('✅ Already authenticated as admin');
      
      // Test the customization groups endpoint
      console.log('\n🧪 Testing customization groups API...');
      const groupsResponse = await fetch('http://localhost:3005/api/admin/menu/customization-groups');
      console.log(`📊 Groups API status: ${groupsResponse.status}`);
      
      if (groupsResponse.ok) {
        const groupsData = await groupsResponse.json();
        console.log(`✅ Groups API success - ${Array.isArray(groupsData) ? groupsData.length : 'invalid'} groups`);
      } else {
        console.log('❌ Groups API failed');
      }
      
    } else {
      console.log(`❓ Unexpected auth status: ${authResponse.status}`);
    }

  } catch (error) {
    console.error('❌ Error checking auth:', error);
  }
}

checkAdminAuth();
