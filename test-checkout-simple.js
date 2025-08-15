// Simple checkout test using Node.js built-in fetch (Node 18+)
const testData = {
  orderType: "PICKUP",
  customer: {
    name: "Debug Test Customer",
    email: "debug@test.com", 
    phone: "555-123-4567"
  },
  items: [
    {
      id: "test-pizza-1",
      type: "custom",
      quantity: 1,
      basePrice: 15.99, // Medium pizza base price
      totalPrice: 15.99,
      size: {
        id: "cmeb4wr4t0001vk9s2y76icn1", // Medium from database
        name: "Medium",
        diameter: "12\"",
        basePrice: 15.99,
        isActive: true,
        sortOrder: 2
      },
      crust: {
        id: "cmeafxdl90001vkzcht5yoqkk", // REGULAR CRUST from database
        name: "REGULAR CRUST",
        priceModifier: 1,
        isActive: true,
        sortOrder: 0
      },
      sauce: {
        id: "cmeafxdoj0003vkzcc66kq3nl", // ORIGINAL PIZZA sauce from database
        name: "ORIGINAL PIZZA",
        basePrice: 0,
        spiceLevel: 1,
        priceModifier: 0,
        isActive: true,
        sortOrder: 0
      },
      toppings: [],
      notes: "Test pizza"
    }
  ],
  subtotal: 15.99,
  deliveryFee: 0,
  tax: 1.32, // 8.25% of 15.99
  total: 17.31
};

async function testCheckout() {
  console.log('🧪 Testing checkout API...');
  console.log('📦 Test data:', JSON.stringify(testData, null, 2));
  
  try {
    const response = await fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseData = await response.text();
    console.log('📡 Raw response:', responseData);
    
    try {
      const jsonData = JSON.parse(responseData);
      console.log('✅ Parsed response:', JSON.stringify(jsonData, null, 2));
    } catch (parseError) {
      console.log('❌ Failed to parse response as JSON:', parseError.message);
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
    console.error('❌ Full error:', error);
  }
}

// Wait a moment for server to be ready
setTimeout(testCheckout, 2000);
