// Test minimal checkout endpoint
console.log('Testing minimal checkout endpoint...');

const testData = {
  orderType: "PICKUP",
  customer: {
    name: "Test Customer",
    email: "test@example.com",
    phone: "555-123-4567"
  },
  items: [],
  subtotal: 12.99,
  total: 14.06
};

async function testMinimalCheckout() {
  try {
    console.log('📦 Testing minimal checkout with data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/checkout-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📊 Response status:', response.status);
    
    const responseData = await response.json();
    console.log('📄 Response data:', JSON.stringify(responseData, null, 2));

    if (response.ok) {
      console.log('✅ Minimal checkout test succeeded!');
    } else {
      console.log('❌ Minimal checkout test failed');
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testMinimalCheckout();
