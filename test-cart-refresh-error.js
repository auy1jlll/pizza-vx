const fetch = require('node-fetch');

async function testCartRefreshPrices() {
  try {
    console.log('🧪 Testing cart refresh-prices endpoint...\n');

    // Test with sample cart data
    const testCartData = {
      pizzaItems: [
        {
          id: 'pizza-1',
          size: { id: 'medium' },
          crust: { id: 'thin' },
          sauce: { id: 'marinara' },
          toppings: [
            { id: 'pepperoni', quantity: 1 },
            { id: 'mozzarella', quantity: 1 }
          ]
        }
      ],
      menuItems: [
        {
          id: 'menu-1',
          menuItemId: 'garlic-bread',
          name: 'Garlic Bread',
          price: 6.99,
          customizations: []
        }
      ]
    };

    console.log('📤 Sending request to /api/cart/refresh-prices...');
    console.log('Cart data:', JSON.stringify(testCartData, null, 2));

    const response = await fetch('http://localhost:3005/api/cart/refresh-prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCartData)
    });

    console.log(`\n📨 Response status: ${response.status}`);
    console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));

    const responseData = await response.text();
    console.log('📥 Response body:', responseData);

    if (!response.ok) {
      console.error('❌ Request failed with status:', response.status);
      return false;
    }

    try {
      const jsonData = JSON.parse(responseData);
      console.log('✅ Parsed response:', JSON.stringify(jsonData, null, 2));
      return true;
    } catch (parseError) {
      console.error('❌ Failed to parse JSON response:', parseError.message);
      return false;
    }

  } catch (error) {
    console.error('❌ Error testing cart refresh-prices:', error);
    return false;
  }
}

// Test with empty cart data
async function testEmptyCart() {
  try {
    console.log('\n🧪 Testing with empty cart...');
    
    const emptyCartData = {
      pizzaItems: [],
      menuItems: []
    };

    const response = await fetch('http://localhost:3005/api/cart/refresh-prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emptyCartData)
    });

    console.log(`📨 Empty cart response status: ${response.status}`);
    const responseData = await response.text();
    console.log('📥 Empty cart response:', responseData);

    return response.ok;
  } catch (error) {
    console.error('❌ Error testing empty cart:', error);
    return false;
  }
}

// Test with malformed data
async function testMalformedData() {
  try {
    console.log('\n🧪 Testing with malformed data...');
    
    const malformedData = {
      // Missing required structure
      invalidField: 'test'
    };

    const response = await fetch('http://localhost:3005/api/cart/refresh-prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(malformedData)
    });

    console.log(`📨 Malformed data response status: ${response.status}`);
    const responseData = await response.text();
    console.log('📥 Malformed data response:', responseData);

    return true; // This should handle errors gracefully
  } catch (error) {
    console.error('❌ Error testing malformed data:', error);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting cart refresh-prices error investigation...\n');
  
  const results = {
    normalCart: await testCartRefreshPrices(),
    emptyCart: await testEmptyCart(),
    malformedData: await testMalformedData()
  };

  console.log('\n📊 Test Results Summary:');
  console.log('Normal cart:', results.normalCart ? '✅ PASS' : '❌ FAIL');
  console.log('Empty cart:', results.emptyCart ? '✅ PASS' : '❌ FAIL');
  console.log('Malformed data:', results.malformedData ? '✅ PASS' : '❌ FAIL');

  if (!results.normalCart) {
    console.log('\n🔍 The normal cart test failed - this is likely the source of your 500 error!');
  }
}

runAllTests().catch(console.error);
