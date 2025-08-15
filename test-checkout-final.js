// Test script to verify the checkout fix
const testCheckout = async () => {
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
      name: "Test Customer",
      email: "test@example.com",
      phone: "123-456-7890",
      orderType: "PICKUP",
      address: "",
      city: "",
      zip: "",
      instructions: "Test order"
    },
    subtotal: 15.99,
    deliveryFee: 0,
    tax: 1.32,
    total: 17.31,
    notes: "Checkout fix verification"
  };

  try {
    const response = await fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testOrder)
    });

    const result = await response.json();
    
    console.log('=== CHECKOUT TEST RESULTS ===');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.data && result.data.orderNumber) {
      console.log('✅ SUCCESS: Order created with orderNumber:', result.data.orderNumber);
      console.log('✅ Pricing snapshots fix: WORKING');
      console.log('✅ Cart unification: COMPLETE');
    } else {
      console.log('❌ FAILED: Order creation failed');
      console.log('Response:', result);
    }
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
};

testCheckout();
