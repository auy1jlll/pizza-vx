// Test script to verify the fixed cart refresh-prices API
const fetch = require('node-fetch');

async function testFixedCartAPI() {
  console.log('🧪 Testing Fixed Cart Refresh-Prices API...');
  
  const testData = {
    pizzaItems: [
      {
        id: 'test-pizza-1',
        size: { id: 'size-1', name: 'Large', basePrice: 12.99 },
        crust: { id: 'crust-1', name: 'Thin', priceModifier: 0 },
        sauce: { id: 'sauce-1', name: 'Tomato', priceModifier: 0 },
        toppings: [
          { 
            id: 'topping-1', 
            name: 'Pepperoni', 
            section: 'WHOLE', 
            intensity: 'REGULAR',
            price: 2.50 
          }
        ],
        quantity: 1,
        totalPrice: 15.49
      }
    ],
    menuItems: [
      {
        id: 'menu-1',
        name: 'Caesar Salad',
        price: 8.99,
        quantity: 1
      }
    ]
  };

  try {
    console.log('📤 Sending request with enhanced error handling...');
    const response = await fetch('http://localhost:3005/api/cart/refresh-prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    console.log('📥 Response status:', response.status);

    const responseText = await response.text();
    console.log('📥 Raw response length:', responseText.length);

    if (response.ok) {
      try {
        const result = JSON.parse(responseText);
        console.log('✅ SUCCESS! API is working with enhanced connection handling');
        console.log('📊 Response summary:', {
          success: result.success,
          pizzaItemsCount: result.data?.pizzaItems?.length || 0,
          menuItemsCount: result.data?.menuItems?.length || 0
        });
      } catch (parseError) {
        console.error('❌ Failed to parse success response:', parseError.message);
      }
    } else {
      console.error('❌ HTTP Error:', response.status);
      console.error('❌ Error details:', responseText);
    }

  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

// Run the test
testFixedCartAPI().catch(console.error);
