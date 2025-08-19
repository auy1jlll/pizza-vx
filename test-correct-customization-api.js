const fetch = require('node-fetch');

async function testCorrectCustomizationEndpoint() {
  try {
    console.log('🔍 Testing CORRECT customization endpoint...\n');

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

    // Test the CORRECT endpoint
    console.log('\n📡 Testing GET /api/admin/menu/customization-groups...');
    const getGroupsResponse = await fetch('http://localhost:3005/api/admin/menu/customization-groups', {
      headers: {
        'Cookie': cookies || ''
      }
    });

    console.log(`📊 GET groups status: ${getGroupsResponse.status}`);

    if (getGroupsResponse.ok) {
      const groups = await getGroupsResponse.json();
      console.log(`✅ Found ${groups.length} groups`);
      
      if (groups.length > 0) {
        const testGroupId = groups[0].id;
        console.log(`🎯 Testing operations on group ID: ${testGroupId} (${groups[0].name})`);

        // Test GET single group
        console.log('\n📡 Testing GET single group...');
        const getSingleResponse = await fetch(`http://localhost:3005/api/admin/menu/customization-groups/${testGroupId}`, {
          headers: {
            'Cookie': cookies || ''
          }
        });
        console.log(`📊 GET single group status: ${getSingleResponse.status}`);
        
        if (getSingleResponse.ok) {
          console.log('✅ Single group fetch successful');
        } else {
          console.log('❌ Single group fetch failed');
          const errorText = await getSingleResponse.text();
          console.log('Error:', errorText);
        }

        // Test PATCH group (update)
        console.log('\n📡 Testing PATCH group...');
        const patchResponse = await fetch(`http://localhost:3005/api/admin/menu/customization-groups/${testGroupId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': cookies || ''
          },
          body: JSON.stringify({
            name: groups[0].name, // Keep same name, just test the endpoint
            description: groups[0].description || ''
          })
        });
        console.log(`📊 PATCH group status: ${patchResponse.status}`);
        
        if (patchResponse.ok) {
          console.log('✅ Group update successful');
        } else {
          console.log('❌ Group update failed');
          const errorText = await patchResponse.text();
          console.log('Error:', errorText);
        }

        // Test customization options for this group
        console.log('\n📡 Testing GET customization options...');
        const getOptionsResponse = await fetch(`http://localhost:3005/api/admin/menu/customization-options?groupId=${testGroupId}`, {
          headers: {
            'Cookie': cookies || ''
          }
        });
        console.log(`📊 GET options status: ${getOptionsResponse.status}`);
        
        if (getOptionsResponse.ok) {
          const options = await getOptionsResponse.json();
          console.log(`✅ Found ${options.length} options for this group`);
        } else {
          console.log('❌ Get options failed');
          const errorText = await getOptionsResponse.text();
          console.log('Error:', errorText);
        }

      }
    } else {
      console.log('❌ Get groups failed');
      const errorText = await getGroupsResponse.text();
      console.log('Error:', errorText);
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testCorrectCustomizationEndpoint();
