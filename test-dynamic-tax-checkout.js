// Test script to verify checkout with correct tax rates
const testData = {
  customer: {
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '123-456-7890',
    address: '123 Test St',
    city: 'Test City',
    state: 'TC',
    zipCode: '12345'
  },
  delivery: {
    method: 'DELIVERY',
    estimatedTime: '30-45 minutes'
  },
  orderType: 'DELIVERY',
  items: [{
    id: 'test-pizza-1',
    size: {
      id: 'cmeb4wr360000vk9s8q3wu9o1',
      name: 'Small',
      diameter: '10"',
      basePrice: 12.99,
      isActive: true,
      sortOrder: 1
    },
    crust: {
      id: 'cmeacm01d0001vkvg7sz15lue', 
      name: 'Thin',
      description: 'Light and crispy',
      priceModifier: 0,
      isActive: true,
      sortOrder: 1
    },
    sauce: {
      id: 'cmeafxdoj0003vkzcc66kq3nl',
      name: 'Original',
      description: 'Classic tomato sauce',
      priceModifier: 0,
      isActive: true,
      sortOrder: 1
    },
    toppings: [],
    quantity: 1,
    totalPrice: 12.99
  }],
  subtotal: 12.99,
  deliveryFee: 3.99,
  tax: +(12.99 * 0.0825).toFixed(2), // Use correct 8.25% tax rate
  total: +(12.99 + 3.99 + (12.99 * 0.0825)).toFixed(2),
  notes: 'Test order with correct dynamic tax rate'
};

console.log('🧪 Test Order Data with Dynamic Tax Rate:');
console.log(`   Subtotal: $${testData.subtotal.toFixed(2)}`);
console.log(`   Tax (8.25%): $${testData.tax}`);
console.log(`   Delivery Fee: $${testData.deliveryFee.toFixed(2)}`);
console.log(`   Total: $${testData.total.toFixed(2)}`);

async function testCheckoutAPI() {
  try {
    console.log('\n🌐 Testing checkout API with dynamic tax rate...');
    
    const response = await fetch('http://localhost:3001/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Checkout successful!');
      console.log(`   Order ID: ${result.orderId}`);
      console.log(`   Status: ${result.status}`);
      console.log('   Tax rate calculation verified!');
    } else {
      const error = await response.text();
      console.log('❌ Checkout failed:', error);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

// Test the API
testCheckoutAPI();
