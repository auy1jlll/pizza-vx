// Test API with Schema Validation
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3003';

async function testCheckoutAPI() {
  console.log('🔴 Testing Checkout API with Schema Validation...\n');

  // Test invalid data to ensure validation works
  const invalidData = {
    items: [],
    customer: { name: "", email: "invalid", phone: "123" },
    orderType: "WRONG_TYPE"
  };

  try {
    const response = await fetch(`${API_BASE}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidData)
    });

    const result = await response.json();
    
    if (response.status === 400 && !result.success) {
      console.log('✅ Schema validation working correctly!');
      console.log('   ✓ API rejected invalid data');
      console.log('   ✓ Status:', response.status);
      console.log('   ✓ Error message:', result.error.substring(0, 100) + '...');
    } else {
      console.log('❌ Schema validation failed');
      console.log('   Response:', result);
    }
  } catch (error) {
    console.log('⚠️  API test failed (server might not be running):', error.message);
  }
}

testCheckoutAPI();
