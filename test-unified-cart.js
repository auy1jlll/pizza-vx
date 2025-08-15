// Test script to verify the new unified cart system works
const orderData = {
  orderType: 'DELIVERY',
  customer: {
    name: 'Test Customer',
    email: 'test@example.com', 
    phone: '1234567890',
    address: '123 Test St',
    city: 'Boston',
    zip: '02101'
  },
  delivery: {
    address: '123 Test St',
    city: 'Boston', 
    zip: '02101',
    instructions: ''
  },
  items: [{
    id: '1755233123456-test',
    size: {
      id: 'cmeb4wr360000vk9s8q3wu9o1', // Real Small size ID
      name: 'Small',
      diameter: '12"',
      basePrice: 12.99,
      isActive: true,
      sortOrder: 1
    },
    crust: {
      id: 'cmeacm01d0001vkvg7sz15lue', // Real Thin crust ID  
      name: 'Thin',
      description: 'Thin crust',
      priceModifier: 0,
      isActive: true,
      sortOrder: 1
    },
    sauce: {
      id: 'cmeafxdoj0003vkzcc66kq3nl', // Real Original sauce ID
      name: 'Original', 
      description: 'Original sauce',
      color: '#FF0000',
      spiceLevel: 1,
      priceModifier: 0,
      isActive: true,
      sortOrder: 1
    },
    toppings: [],
    quantity: 1,
    notes: 'Test pizza from unified cart system',
    basePrice: 12.99,
    totalPrice: 12.99
  }],
  subtotal: 12.99,
  deliveryFee: 3.99,
  tax: 1.04,
  total: 18.02
};

async function testUnifiedCartCheckout() {
  try {
    console.log('🧪 Testing unified cart system checkout...');
    console.log('📦 Order data:', JSON.stringify(orderData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    console.log(`📊 Response status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ SUCCESS! Order placed:', result);
      console.log(`🎉 Order Number: ${result.orderNumber}`);
      console.log('🚀 Unified cart system is working correctly!');
    } else {
      const error = await response.json();
      console.error('❌ FAILED! Checkout error:', error);
      console.log('🔧 The checkout API is having issues, but cart UI should still work');
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    console.log('🔧 Make sure the development server is running on localhost:3000');
  }
}

testUnifiedCartCheckout();
