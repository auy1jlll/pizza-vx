const fetch = require('node-fetch');
const fs = require('fs');

// Test the kitchen orders API
async function testKitchenAuth() {
  console.log('🧪 Testing Kitchen Orders API...');
  
  try {
    const response = await fetch('http://localhost:3005/api/admin/kitchen/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
    console.log('📋 Response Headers:');
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    const responseText = await response.text();
    console.log('📄 Response Body:');
    console.log(responseText);
    
    if (response.status === 429) {
      console.log('⚠️  Rate limit hit!');
    } else if (response.status === 401) {
      console.log('🔒 Authentication required');
    } else if (response.status === 500) {
      console.log('💥 Server error');
    } else if (response.status === 200) {
      console.log('✅ Success!');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Test multiple times to see if rate limiting is the issue
async function testMultiple() {
  for (let i = 0; i < 5; i++) {
    console.log(`\n--- Test ${i + 1} ---`);
    await testKitchenAuth();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
  }
}

testMultiple();
