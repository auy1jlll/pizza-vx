// Test checkout with exact frontend cart format
const testExactFrontendData = async () => {
  try {
    console.log('Testing with exact frontend cart format...');
    
    // Get actual pizza data like the frontend would
    const pizzaResponse = await fetch('http://localhost:3005/api/pizza-data');
    const pizzaData = await pizzaResponse.json();
    
    if (!pizzaData.sizes || !pizzaData.crusts || !pizzaData.sauces) {
      console.error('Failed to get pizza data');
      return;
    }
    
    const size = pizzaData.sizes[0];
    const crust = pizzaData.crusts[0];
    const sauce = pizzaData.sauces[0];
    
    // Create cart item exactly like frontend CartContext would
    const cartItem = {
      id: 'pizza-test-' + Date.now(),
      size: {
        id: size.id,
        name: size.name,
        diameter: size.diameter,
        basePrice: size.basePrice,
        isActive: size.isActive,
        sortOrder: size.sortOrder
      },
      crust: {
        id: crust.id,
        name: crust.name,
        description: crust.description,
        priceModifier: crust.priceModifier,
        isActive: crust.isActive,
        sortOrder: crust.sortOrder
      },
      sauce: {
        id: sauce.id,
        name: sauce.name,
        description: sauce.description,
        color: sauce.color,
        spiceLevel: sauce.spiceLevel,
        priceModifier: sauce.priceModifier,
        isActive: sauce.isActive,
        sortOrder: sauce.sortOrder
      },
      toppings: [],
      quantity: 1,
      notes: '',
      basePrice: size.basePrice,
      totalPrice: size.basePrice
    };
    
    // Transform cart item like checkout page would
    const formattedItem = {
      type: 'pizza',
      id: cartItem.id,
      quantity: cartItem.quantity || 1,
      basePrice: cartItem.basePrice || 0,
      totalPrice: cartItem.totalPrice || 0,
      size: cartItem.size,
      crust: cartItem.crust,
      sauce: cartItem.sauce,
      toppings: cartItem.toppings || [],
      notes: cartItem.notes
    };
    
    // Create order data exactly like checkout page would
    const orderData = {
      orderType: 'PICKUP',
      scheduleType: 'NOW',
      customer: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '(555) 123-4567',
        address: '',
        city: '',
        zip: ''
      },
      delivery: null,
      items: [formattedItem],
      subtotal: cartItem.totalPrice,
      deliveryFee: 0,
      tax: Math.round(cartItem.totalPrice * 0.08 * 100) / 100,
      total: cartItem.totalPrice + Math.round(cartItem.totalPrice * 0.08 * 100) / 100
    };
    
    console.log('=== TESTING EXACT FRONTEND FORMAT ===');
    console.log('Cart item:', JSON.stringify(cartItem, null, 2));
    console.log('Formatted item:', JSON.stringify(formattedItem, null, 2));
    console.log('Order data:', JSON.stringify(orderData, null, 2));
    
    const response = await fetch('http://localhost:3005/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

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
    console.error('❌ Test error:', error);
  }
};

testExactFrontendData();
