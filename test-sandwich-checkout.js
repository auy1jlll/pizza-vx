// Test sandwich checkout API directly
const testSandwichCheckout = async () => {
  const sandwichOrderData = {
    orderType: 'PICKUP',
    customer: {
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '555-0123'
    },
    items: [
      {
        id: 'sandwich-test-123',
        type: 'menu',
        menuItemId: 'cmedtl3tg0034vkugdrg36ekk', // Italian Sub ID from database
        name: 'Italian Sub',
        basePrice: 8.99,
        price: 10.99,
        quantity: 1,
        category: 'Sandwiches',
        customizations: [
          {
            groupName: 'Size',
            optionName: '12"',
            priceModifier: 4.00
          },
          {
            groupName: 'Cheese',
            optionName: 'Provolone',
            priceModifier: 1.25
          }
        ]
      }
    ],
    subtotal: 14.24,
    deliveryFee: 0,
    tax: 1.14,
    total: 15.38
  };

  try {
    console.log('Testing sandwich checkout with data:', JSON.stringify(sandwichOrderData, null, 2));
    
    const response = await fetch('http://localhost:3005/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sandwichOrderData),
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Sandwich checkout SUCCESS:', result);
    } else {
      const error = await response.json();
      console.error('❌ Sandwich checkout FAILED:', error);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

testSandwichCheckout();
