// Test checkout API with real database IDs
const testRealCheckout = async () => {
  try {
    console.log('Testing checkout API with real database data...');
    
    // First get real size, crust, and sauce IDs from the database
    const pizzaDataResponse = await fetch('http://localhost:3005/api/pizza-data');
    const pizzaData = await pizzaDataResponse.json();
    
    if (pizzaData && pizzaData.sizes && pizzaData.crusts && pizzaData.sauces) {
      console.log('Got real pizza data:');
      console.log('- Sizes:', pizzaData.sizes.length);
      console.log('- Crusts:', pizzaData.crusts.length);
      console.log('- Sauces:', pizzaData.sauces.length);
      
      const size = pizzaData.sizes[0]; // Use first size
      const crust = pizzaData.crusts[0]; // Use first crust  
      const sauce = pizzaData.sauces[0]; // Use first sauce
      
      console.log('Using:', {
        size: { id: size.id, name: size.name },
        crust: { id: crust.id, name: crust.name },
        sauce: { id: sauce.id, name: sauce.name }
      });
      
      // Test Case: Real Pizza order
      const realPizzaOrder = {
        orderType: 'PICKUP',
        scheduleType: 'NOW',
        paymentMethod: 'CASH',
        customer: {
          name: 'Test Customer',
          email: 'test@example.com',
          phone: '(555) 123-4567',
          address: '',
          city: '',
          zip: ''
        },
        delivery: null,
        items: [
          {
            type: 'pizza',
            id: 'pizza-1',
            quantity: 1,
            basePrice: size.basePrice,
            totalPrice: size.basePrice,
            size: {
              id: size.id,
              name: size.name,
              basePrice: size.basePrice
            },
            crust: {
              id: crust.id,
              name: crust.name,
              priceModifier: crust.priceModifier
            },
            sauce: {
              id: sauce.id,
              name: sauce.name,
              priceModifier: sauce.priceModifier
            },
            toppings: [],
            notes: ''
          }
        ],
        notes: 'Test pizza order with real IDs',
        subtotal: size.basePrice,
        deliveryFee: 0,
        tax: Math.round(size.basePrice * 0.08 * 100) / 100,
        total: size.basePrice + Math.round(size.basePrice * 0.08 * 100) / 100
      };

      console.log('\n=== TESTING REAL PIZZA ORDER ===');
      await testOrder(realPizzaOrder);
      
    } else {
      console.error('Failed to get pizza data from API');
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

const testOrder = async (orderData) => {
  try {
    console.log('Sending order with real IDs...');

    const response = await fetch('http://localhost:3005/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    console.log('Response status:', response.status);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success result:', result);
    } else {
      const errorText = await response.text();
      console.log('❌ Error response (text):', errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        console.log('❌ Error response (parsed):', errorJson);
      } catch (e) {
        console.log('❌ Could not parse error as JSON');
      }
    }

  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

testRealCheckout();
