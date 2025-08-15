/**
 * Test script to verify the frontend checkout system works with real database data
 * This will simulate what happens when a user builds a pizza and goes to checkout
 */

const API_BASE = 'http://localhost:3001';

async function testFrontendCheckout() {
  console.log('🔄 Testing frontend checkout system with real database data...\n');

  try {
    // Step 1: Load pizza data (what the CheckoutModal should do)
    console.log('1️⃣ Loading pizza component data...');
    const pizzaDataResponse = await fetch(`${API_BASE}/api/pizza-data`);
    
    if (!pizzaDataResponse.ok) {
      throw new Error(`Failed to load pizza data: ${pizzaDataResponse.status}`);
    }
    
    const pizzaData = await pizzaDataResponse.json();
    console.log('✅ Pizza data loaded:', {
      sizes: pizzaData.sizes?.length || 0,
      crusts: pizzaData.crusts?.length || 0,
      sauces: pizzaData.sauces?.length || 0,
      toppings: pizzaData.toppings?.length || 0
    });

    // Step 2: Simulate cart data (what comes from pizza builder)
    const simulatedCartItem = {
      id: 'test-pizza-1',
      name: 'Custom Pizza',
      size: 'Medium',
      sizeName: 'Medium',
      crust: 'Traditional',
      crustName: 'Traditional', 
      sauce: 'Tomato',
      sauceName: 'Tomato',
      detailedToppings: [
        {
          toppingId: 'pepperoni-id',
          toppingName: 'Pepperoni',
          price: 2.50,
          section: 'Meat',
          intensity: 'Regular'
        },
        {
          toppingId: 'mushrooms-id',
          toppingName: 'Mushrooms',
          price: 1.50,
          section: 'Vegetables',
          intensity: 'Light'
        }
      ],
      quantity: 1,
      totalPrice: 15.99,
      price: 15.99,
      notes: 'Extra crispy please'
    };

    console.log('\n2️⃣ Simulated cart item:', simulatedCartItem);

    // Step 3: Transform item using real database IDs (what CheckoutModal should do)
    console.log('\n3️⃣ Transforming cart item with real database IDs...');
    
    // Helper function to find component by name
    const findComponent = (collection, searchName) => {
      return collection.find(comp => 
        comp.name?.toLowerCase() === searchName?.toLowerCase()
      );
    };

    // Find components by name to get real IDs
    const size = findComponent(pizzaData.sizes, simulatedCartItem.sizeName);
    const crust = findComponent(pizzaData.crusts, simulatedCartItem.crustName);
    const sauce = findComponent(pizzaData.sauces, simulatedCartItem.sauceName);

    if (!size || !crust || !sauce) {
      console.error('❌ Missing required pizza components:', {
        size: !!size,
        crust: !!crust,
        sauce: !!sauce
      });
      throw new Error('Missing required pizza components');
    }

    console.log('✅ Found pizza components:', {
      size: { id: size.id, name: size.name },
      crust: { id: crust.id, name: crust.name },
      sauce: { id: sauce.id, name: sauce.name }
    });

    // Transform toppings to get real IDs
    const toppings = simulatedCartItem.detailedToppings?.map(topping => {
      const foundTopping = findComponent(pizzaData.toppings, topping.toppingName);
      if (!foundTopping) {
        console.warn(`❌ Topping not found: ${topping.toppingName}`);
        return null;
      }
      return {
        id: foundTopping.id,
        name: foundTopping.name,
        price: topping.price,
        quantity: 1,
        section: topping.section,
        intensity: topping.intensity,
      };
    }).filter(Boolean) || [];

    console.log('✅ Transformed toppings:', toppings);

    // Step 4: Create transformed item with real database structure
    const transformedItem = {
      id: simulatedCartItem.id,
      size: {
        id: size.id,
        name: size.name,
        diameter: size.diameter,
        basePrice: size.basePrice,
        isActive: size.isActive,
        sortOrder: size.sortOrder,
      },
      crust: {
        id: crust.id,
        name: crust.name,
        description: crust.description,
        priceModifier: crust.priceModifier,
        isActive: crust.isActive,
        sortOrder: crust.sortOrder,
      },
      sauce: {
        id: sauce.id,
        name: sauce.name,
        description: sauce.description,
        color: sauce.color,
        spiceLevel: sauce.spiceLevel,
        priceModifier: sauce.priceModifier,
        isActive: sauce.isActive,
        sortOrder: sauce.sortOrder,
      },
      toppings,
      quantity: simulatedCartItem.quantity,
      notes: simulatedCartItem.notes || '',
      basePrice: simulatedCartItem.totalPrice,
      totalPrice: simulatedCartItem.totalPrice,
    };

    console.log('\n4️⃣ Transformed item with real IDs ready for checkout');

    // Step 5: Create order data
    const orderData = {
      orderType: 'DELIVERY',
      customer: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '555-0123',
      },
      delivery: {
        address: '123 Test St',
        city: 'Test City',
        zip: '12345',
        instructions: 'Test delivery',
      },
      items: [transformedItem],
      subtotal: 15.99,
      deliveryFee: 3.99,
      tax: 1.31,
      total: 21.29,
    };

    console.log('\n5️⃣ Submitting order to checkout API...');

    // Step 6: Submit to checkout API
    const checkoutResponse = await fetch(`${API_BASE}/api/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!checkoutResponse.ok) {
      const errorData = await checkoutResponse.text();
      throw new Error(`Checkout failed (${checkoutResponse.status}): ${errorData}`);
    }

    const checkoutResult = await checkoutResponse.json();
    console.log('✅ CHECKOUT SUCCESS!', checkoutResult);

    console.log('\n🎉 Frontend checkout test PASSED! The updated CheckoutModal should work correctly.');
    
  } catch (error) {
    console.error('❌ Frontend checkout test FAILED:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testFrontendCheckout();
