// Test "Order Now" functionality
const testOrderNow = async () => {
  console.log('🧪 Testing "Order Now" functionality');
  
  try {
    // Test order with scheduleType = 'NOW' (no scheduled date/time)
    const orderData = {
      orderType: 'PICKUP',
      scheduleType: 'NOW',
      customer: {
        name: 'Test Customer Now',
        email: 'testnow@example.com',
        phone: '555-0123'
      },
      items: [
        {
          type: 'pizza',
          id: 'test-pizza-now',
          quantity: 1,
          size: { name: 'Medium', basePrice: 12.99 },
          crust: { name: 'Regular', priceModifier: 0 },
          sauce: { name: 'Marinara', priceModifier: 0 },
          toppings: []
        }
      ],
      subtotal: 12.99,
      deliveryFee: 0,
      tax: 1.04,
      total: 14.03,
      notes: 'Test immediate order'
    };

    console.log('📦 Sending "Order Now" request...');
    const response = await fetch('http://localhost:3005/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ "Order Now" works successfully!');
      console.log(`📦 Order Number: ${result.data?.orderNumber}`);
      console.log(`⏰ Schedule Type: ${result.data?.scheduleType}`);
      console.log(`📅 Scheduled Time: ${result.data?.scheduledTime || 'None (immediate order)'}`);
    } else {
      console.log('❌ "Order Now" failed:', result);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testOrderNow();
