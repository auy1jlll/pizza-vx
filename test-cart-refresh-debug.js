// Test script to debug cart refresh-prices API
const fetch = require('node-fetch');

async function testCartRefreshAPI() {
  console.log('🧪 Testing Cart Refresh-Prices API...');
  
  const testData = {
    pizzaItems: [
      {
        id: 'test-pizza-1',
        size: { id: 'size-1', name: 'Large' },
        crust: { id: 'crust-1', name: 'Thin' },
        sauce: { id: 'sauce-1', name: 'Tomato' },
        toppings: [
          { id: 'topping-1', name: 'Pepperoni', section: 'WHOLE', intensity: 'REGULAR' }
        ],
        quantity: 1,
        totalPrice: 15.99
      }
    ],
    menuItems: [
      {
        id: 'menu-1',
        name: 'Caesar Salad',
        category: 'Salads',
        price: 8.99,
        quantity: 1
      }
    ]
  };

  try {
    console.log('📤 Sending request to localhost:3005...');
    const response = await fetch('http://localhost:3005/api/cart/refresh-prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📥 Raw response:', responseText);

    if (response.ok) {
      try {
        const result = JSON.parse(responseText);
        console.log('✅ Success! Parsed response:', JSON.stringify(result, null, 2));
      } catch (parseError) {
        console.error('❌ Failed to parse success response as JSON:', parseError.message);
      }
    } else {
      console.error('❌ HTTP Error:', response.status);
      try {
        const errorResult = JSON.parse(responseText);
        console.error('❌ Error details:', JSON.stringify(errorResult, null, 2));
      } catch (parseError) {
        console.error('❌ Raw error response:', responseText);
      }
    }

  } catch (error) {
    console.error('❌ Request failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure the dev server is running on port 3005');
    }
  }
}

// Run the test
testCartRefreshAPI().catch(console.error);
