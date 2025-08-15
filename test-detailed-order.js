// Test order with detailed pizza customizations
const fetch = require('node-fetch');

async function testDetailedOrder() {
  console.log('🍕 Testing detailed pizza order...');

  const detailedOrderData = {
    items: [
      {
        size: {
          id: 'cmecgmn2p0019vk1ovkvxj5qy',
          name: 'Small'
        },
        crust: {
          id: 'cmecfsjub0000vkn8pe8wy5g3',
          name: 'THIN CRUST'
        },
        sauce: {
          id: 'cmecfsjz80003vkn8wuw8jf5j',
          name: 'ORIGINAL PIZZA'
        },
        sauceIntensity: 'LIGHT',
        crustCookingLevel: 'WELL_DONE',
        toppings: [
          {
            id: 'topping1',
            name: 'Pepperoni',
            section: 'LEFT',
            intensity: 'EXTRA',
            quantity: 1,
            price: 1.50
          },
          {
            id: 'topping2', 
            name: 'Mushrooms',
            section: 'RIGHT',
            intensity: 'LIGHT',
            quantity: 1,
            price: 1.00
          },
          {
            id: 'topping3',
            name: 'Cheese',
            section: 'WHOLE',
            intensity: 'REGULAR',
            quantity: 1,
            price: 0.50
          }
        ],
        quantity: 1,
        basePrice: 10.99,
        totalPrice: 13.99,
        specialtyPizzaName: 'Custom Supreme'
      }
    ],
    customer: {
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '555-0123'
    },
    orderType: 'PICKUP',
    subtotal: 13.99,
    deliveryFee: 0,
    tax: 1.12,
    total: 15.11,
    notes: 'Test order for detailed descriptions'
  };

  try {
    const response = await fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(detailedOrderData)
    });

    const result = await response.json();
    
    console.log('📨 Status:', response.status);
    console.log('📝 Response:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('✅ Detailed order created successfully!');
      console.log('🎯 Check the admin orders page to see the detailed descriptions');
    } else {
      console.log('❌ Order failed:', result);
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Wait a moment for server to be ready, then test
setTimeout(testDetailedOrder, 2000);
