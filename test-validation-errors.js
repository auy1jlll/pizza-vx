const fetch = require('node-fetch');

async function testCustomizationValidationError() {
  try {
    console.log('🔍 Testing customization option validation...\n');

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

    // Test various validation scenarios
    console.log('\n📡 Testing validation scenarios...\n');

    // Test 1: Invalid data
    console.log('🧪 Test 1: Invalid data (no name)');
    const invalidResponse = await fetch('http://localhost:3005/api/admin/menu/customization-options', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies || ''
      },
      body: JSON.stringify({
        groupId: 'invalid-id',
        // name missing
        priceModifier: 'invalid-number'
      })
    });

    console.log(`📊 Invalid data status: ${invalidResponse.status}`);
    if (!invalidResponse.ok) {
      const errorResult = await invalidResponse.json();
      console.log('❌ Expected validation error:', errorResult.error);
    }

    // Test 2: Non-existent group
    console.log('\n🧪 Test 2: Non-existent group');
    const nonExistentGroupResponse = await fetch('http://localhost:3005/api/admin/menu/customization-options', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies || ''
      },
      body: JSON.stringify({
        groupId: 'non-existent-group-id',
        name: 'Test Option',
        priceModifier: 1
      })
    });

    console.log(`📊 Non-existent group status: ${nonExistentGroupResponse.status}`);
    if (!nonExistentGroupResponse.ok) {
      const errorResult = await nonExistentGroupResponse.json();
      console.log('❌ Expected error:', errorResult.error);
    }

    // Test 3: Valid data but edge case
    console.log('\n🧪 Test 3: Valid data with edge values');
    const edgeCaseResponse = await fetch('http://localhost:3005/api/admin/menu/customization-options', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies || ''
      },
      body: JSON.stringify({
        groupId: 'cmeiqzf4j0001vkbky36l5ogk', // Use the actual Deli Subs group ID
        name: 'A', // Very short name
        description: '',
        priceModifier: -10, // Negative price
        priceType: 'FLAT',
        isDefault: false,
        isActive: true,
        sortOrder: 999
      })
    });

    console.log(`📊 Edge case status: ${edgeCaseResponse.status}`);
    if (edgeCaseResponse.ok) {
      console.log('✅ Edge case accepted');
    } else {
      const errorResult = await edgeCaseResponse.json();
      console.log('❌ Edge case rejected:', errorResult.error);
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testCustomizationValidationError();
