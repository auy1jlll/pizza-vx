const fetch = require('node-fetch');

async function testCheckout() {
  console.log('🧪 Testing checkout API with browser-like headers...');
  
  const testData = {
    orderType: 'pickup',
    customer: {
      name: 'Test User',
      phone: '555-123-4567',
      email: 'test@example.com'
    },
    items: [{
      type: 'menu',
      menuItemId: 'italian-sub',
      name: 'Italian Sub',
      category: 'Sandwiches',
      quantity: 1,
      basePrice: 12.99,
      totalPrice: 12.99,
      customizations: []
    }],
    subtotal: 12.99,
    deliveryFee: 0,
    tax: 1.04,
    total: 14.03
  };

  console.log('📤 Sending data:', JSON.stringify(testData, null, 2));

  try {
    const response = await fetch('http://localhost:3005/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Origin': 'http://localhost:3005',
        'Referer': 'http://localhost:3005/checkout'
      },
      body: JSON.stringify(testData),
      timeout: 10000
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers));
    
    const responseText = await response.text();
    console.log('📥 Response text:', responseText);

    if (response.ok) {
      console.log('✅ Success!');
      try {
        const responseData = JSON.parse(responseText);
        console.log('📥 Response data:', JSON.stringify(responseData, null, 2));
      } catch (e) {
        console.log('⚠️ Response is not valid JSON');
      }
    } else {
      console.log('❌ Failed with status:', response.status);
    }

  } catch (error) {
    console.log('❌ Error occurred:', error.message);
    console.log('🔍 Error details:', error);
  }
}

testCheckout();
