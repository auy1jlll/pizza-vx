const fetch = require('node-fetch');

const testOrder = {
  items: [
    {
      id: "test-pizza-1",
      type: "custom",
      name: "Test Custom Pizza",
      price: 15.99,
      quantity: 1,
      sizeId: "size-medium",
      sizeName: "Medium",
      crustId: "crust-traditional",
      crustName: "Traditional",
      sauceId: "sauce-marinara",
      sauceName: "Marinara",
      sauceIntensity: "REGULAR",
      totalPrice: 15.99
    }
  ],
  customer: {
    name: "Debug Test Customer",
    email: "debug@test.com",
    phone: "123-456-7890",
    orderType: "PICKUP",
    address: "",
    city: "",
    zip: "",
    instructions: "Debug test order"
  },
  subtotal: 15.99,
  deliveryFee: 0,
  tax: 1.32,
  total: 17.31,
  notes: "Debug checkout test"
};

async function testCheckout() {
  try {
    console.log('🧪 Starting debug checkout test...');
    
    const response = await fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testOrder)
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', [...response.headers.entries()]);
    
    const text = await response.text();
    console.log('📄 Raw response text:', text);
    
    let result;
    try {
      result = JSON.parse(text);
      console.log('✅ Parsed JSON response:', JSON.stringify(result, null, 2));
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError.message);
      return;
    }

    if (result.success && result.data && result.data.orderNumber) {
      console.log('🎉 SUCCESS: Order created with orderNumber:', result.data.orderNumber);
    } else {
      console.log('❌ FAILED: No orderNumber found');
      console.log('Response structure:', Object.keys(result));
      if (result.data) {
        console.log('Data structure:', Object.keys(result.data));
      }
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
    console.error('❌ Error details:', error);
  }
}

// Wait 2 seconds for server to be ready, then test
setTimeout(testCheckout, 2000);
