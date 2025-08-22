// Test checkout API with sample data
const testCheckout = async () => {
  try {
    console.log('Testing checkout API...');
    
    // Sample order data that should work
    const sampleOrder = {
      orderType: 'PICKUP',
      scheduleType: 'NOW',
      paymentMethod: 'CASH',
      customer: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '(555) 123-4567'
      },
      delivery: null,
      items: [
        {
          type: 'pizza',
          quantity: 1,
          basePrice: 15.99,
          totalPrice: 15.99,
          name: 'Large Pizza',
          sizeId: 'test-size-id',
          crustId: 'test-crust-id',
          sauceId: 'test-sauce-id',
          toppings: []
        }
      ],
      notes: 'Test order',
      subtotal: 15.99,
      deliveryFee: 0,
      tax: 1.28,
      total: 17.27
    };

    console.log('Sending test order:', JSON.stringify(sampleOrder, null, 2));

    const response = await fetch('http://localhost:3005/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleOrder),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success result:', result);
    } else {
      const error = await response.text();
      console.log('❌ Error response (text):', error);
      
      try {
        const errorJson = JSON.parse(error);
        console.log('❌ Error response (parsed):', errorJson);
      } catch (e) {
        console.log('❌ Could not parse error as JSON');
      }
    }

  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

testCheckout();
