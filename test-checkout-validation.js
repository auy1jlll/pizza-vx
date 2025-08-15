// Test the checkout API with enhanced payment fields
const testCheckoutAPI = async () => {
  try {
    console.log('🧪 Testing Checkout API with Enhanced Fields...\n');

    // Test order data with null values that were causing the error
    const testOrder = {
      orderType: 'PICKUP',
      paymentMethod: 'CREDIT_CARD',
      customer: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '555-0123'
      },
      delivery: null, // This was causing the error
      items: [
        {
          id: 'test-item-1',
          size: { id: 'test-size', name: 'LARGE' },
          crust: { id: 'test-crust', name: 'THIN' },
          sauce: { id: 'test-sauce', name: 'MARINARA' },
          toppings: [],
          quantity: 1,
          basePrice: 18.99,
          totalPrice: 18.99,
          notes: 'Test pizza'
        }
      ],
      subtotal: 18.99,
      deliveryFee: 0,
      tipAmount: 3.42,
      tipPercentage: 18,
      customTipAmount: null, // This was causing the error
      tax: 1.52,
      total: 23.93,
      notes: 'Test order with enhanced fields'
    };

    const response = await fetch('http://localhost:3001/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder)
    });

    const result = await response.text();
    
    if (response.ok) {
      console.log('✅ Checkout API Success!');
      console.log('Response:', JSON.parse(result));
    } else {
      console.log('❌ Checkout API Failed:');
      console.log(`Status: ${response.status}`);
      console.log('Response:', result);
      
      // Try to parse as JSON to get better error details
      try {
        const errorData = JSON.parse(result);
        if (errorData.error) {
          console.log('Error Details:', errorData.error);
        }
      } catch (e) {
        console.log('Raw Response:', result);
      }
    }

    // Test with delivery order
    console.log('\n🚚 Testing Delivery Order...');
    const deliveryOrder = {
      ...testOrder,
      orderType: 'DELIVERY',
      paymentMethod: 'PAY_ON_DELIVERY',
      delivery: {
        address: '123 Test St',
        city: 'Test City',
        zip: '12345',
        instructions: 'Ring doorbell'
      },
      deliveryFee: 3.99,
      total: 27.92
    };

    const deliveryResponse = await fetch('http://localhost:3001/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deliveryOrder)
    });

    const deliveryResult = await deliveryResponse.text();
    
    if (deliveryResponse.ok) {
      console.log('✅ Delivery Order Success!');
      console.log('Response:', JSON.parse(deliveryResult));
    } else {
      console.log('❌ Delivery Order Failed:');
      console.log(`Status: ${deliveryResponse.status}`);
      console.log('Response:', deliveryResult);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testCheckoutAPI();
