// Test checkout API with realistic frontend data
const testFrontendCheckout = async () => {
  try {
    console.log('Testing checkout API with realistic frontend data...');
    
    // Test Case 1: Pizza order (like what frontend sends)
    const pizzaOrder = {
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
          basePrice: 15.99,
          totalPrice: 15.99,
          size: {
            id: 'size-1',
            name: 'Large',
            basePrice: 15.99
          },
          crust: {
            id: 'crust-1',
            name: 'Regular',
            priceModifier: 0
          },
          sauce: {
            id: 'sauce-1',
            name: 'Marinara',
            priceModifier: 0
          },
          toppings: [],
          notes: ''
        }
      ],
      notes: 'Test pizza order',
      subtotal: 15.99,
      deliveryFee: 0,
      tax: 1.28,
      total: 17.27
    };

    console.log('\n=== TESTING PIZZA ORDER ===');
    await testOrder(pizzaOrder);

    // Test Case 2: Calzone order
    const calzoneOrder = {
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
          type: 'pizza', // Calzones use pizza type
          id: 'calzone-1',
          quantity: 1,
          basePrice: 21.50,
          totalPrice: 21.50,
          size: {
            id: 'calzone-size-1',
            name: 'Small Calzone',
            basePrice: 21.50
          },
          crust: {
            id: 'crust-1',
            name: 'Regular',
            priceModifier: 0
          },
          sauce: {
            id: 'sauce-1',
            name: 'Marinara',
            priceModifier: 0
          },
          toppings: [],
          notes: ''
        }
      ],
      notes: 'Test calzone order',
      subtotal: 21.50,
      deliveryFee: 0,
      tax: 1.72,
      total: 23.22
    };

    console.log('\n=== TESTING CALZONE ORDER ===');
    await testOrder(calzoneOrder);

    // Test Case 3: Menu item order
    const menuOrder = {
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
          type: 'menu',
          id: 'menu-1',
          menuItemId: 'sandwich-1',
          quantity: 1,
          basePrice: 12.99,
          totalPrice: 12.99,
          customizations: [],
          name: 'Italian Sub',
          category: 'sandwiches'
        }
      ],
      notes: 'Test menu order',
      subtotal: 12.99,
      deliveryFee: 0,
      tax: 1.04,
      total: 14.03
    };

    console.log('\n=== TESTING MENU ORDER ===');
    await testOrder(menuOrder);

  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

const testOrder = async (orderData) => {
  try {
    console.log('Sending order:', JSON.stringify(orderData, null, 2));

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

testFrontendCheckout();
