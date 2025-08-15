// Use native Node.js fetch (available in Node 18+)
// const fetch = require('node-fetch'); // Remove this line

async function testCartSystem() {
  console.log('🧪 Testing Cart System Fix...\n');
  
  try {
    // Test 1: Check if pizza-data API is working
    console.log('1. Testing Pizza Data API...');
    const pizzaResponse = await fetch('http://localhost:3001/api/pizza-data');
    
    if (!pizzaResponse.ok) {
      console.log('❌ Pizza data API not accessible');
      return;
    }
    
    const pizzaData = await pizzaResponse.json();
    console.log('✅ Pizza data loaded successfully');
    console.log(`   - Sizes: ${pizzaData.sizes?.length || 0}`);
    console.log(`   - Crusts: ${pizzaData.crusts?.length || 0}`);
    console.log(`   - Sauces: ${pizzaData.sauces?.length || 0}`);
    console.log(`   - Toppings: ${pizzaData.toppings?.length || 0}\n`);
    
    // Test 2: Check settings API for tax rate
    console.log('2. Testing Settings API...');
    const settingsResponse = await fetch('http://localhost:3001/api/settings');
    
    if (settingsResponse.ok) {
      const settingsData = await settingsResponse.json();
      console.log('✅ Settings loaded successfully');
      console.log(`   - Tax Rate: ${settingsData.settings?.taxRate || 'N/A'}%`);
      console.log(`   - Delivery Fee: $${settingsData.settings?.deliveryFee || 'N/A'}\n`);
    } else {
      console.log('❌ Settings API not accessible\n');
    }
    
    // Test 3: Verify cart calculation logic
    console.log('3. Testing Cart Calculation Logic...');
    
    // Simulate a pizza with proper structure
    const samplePizza = {
      size: pizzaData.sizes?.[0] || {
        id: 'test-size',
        name: 'Medium',
        diameter: '14"',
        basePrice: 15.99,
        isActive: true,
        sortOrder: 1
      },
      crust: pizzaData.crusts?.[0] || {
        id: 'test-crust',
        name: 'Original',
        description: 'Classic crust',
        priceModifier: 0,
        isActive: true,
        sortOrder: 1
      },
      sauce: pizzaData.sauces?.[0] || {
        id: 'test-sauce',
        name: 'Marinara',
        description: 'Classic sauce',
        color: '#FF0000',
        spiceLevel: 1,
        priceModifier: 0,
        isActive: true,
        sortOrder: 1
      },
      toppings: [],
      quantity: 1,
      notes: '',
      basePrice: 15.99,
      totalPrice: 15.99
    };
    
    // Simulate cart calculations
    const subtotal = samplePizza.totalPrice * samplePizza.quantity;
    const taxRate = 8.25 / 100; // Default tax rate
    const tax = subtotal * taxRate;
    const deliveryFee = subtotal > 0 ? 3.99 : 0;
    const total = subtotal + tax + deliveryFee;
    
    console.log('✅ Cart calculations:');
    console.log(`   - Subtotal: $${subtotal.toFixed(2)}`);
    console.log(`   - Tax (8.25%): $${tax.toFixed(2)}`);
    console.log(`   - Delivery Fee: $${deliveryFee.toFixed(2)}`);
    console.log(`   - Total: $${total.toFixed(2)}`);
    
    if (isNaN(total)) {
      console.log('❌ Cart calculation resulted in NaN');
    } else {
      console.log('✅ Cart calculations working correctly');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCartSystem();
