// Test the admin customers API endpoint
const fetch = require('node-fetch');

async function testAdminAPI() {
  try {
    console.log('Testing admin API endpoints...\n');

    // Test without authentication (should fail)
    console.log('1. Testing /api/admin/customers without auth:');
    const response1 = await fetch('http://localhost:3005/api/admin/customers');
    console.log(`   Status: ${response1.status}`);
    const data1 = await response1.json();
    console.log(`   Response: ${JSON.stringify(data1)}\n`);

    // Test employees endpoint
    console.log('2. Testing /api/admin/employees without auth:');
    const response2 = await fetch('http://localhost:3005/api/admin/employees');
    console.log(`   Status: ${response2.status}`);
    const data2 = await response2.json();
    console.log(`   Response: ${JSON.stringify(data2)}\n`);

    console.log('ℹ️  Both endpoints should return 401 Unauthorized without admin token');
    console.log('   This means the APIs are working but require authentication');
    console.log('   The frontend needs to be logged in as admin to see the data');

  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testAdminAPI();
