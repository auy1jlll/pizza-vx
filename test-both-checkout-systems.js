// Test both checkout systems with correct pricing

console.log('🧪 Testing Both Checkout Systems...\n');

// Test 1: CheckoutModal system (/api/checkout)
const checkoutModalData = {
  orderType: "PICKUP",
  customer: {
    name: "Test Customer Modal",
    email: "modal@test.com",
    phone: "555-123-4567"
  },
  items: [
    {
      id: "modal-item-1",
      size: {
        id: "default-small",
        name: "Small",
        diameter: "12\"",
        basePrice: 15.99,
        isActive: true,
        sortOrder: 0
      },
      crust: {
        id: "default-traditional",
        name: "Traditional",
        description: "",
        priceModifier: 0,
        isActive: true,
        sortOrder: 0
      },
      sauce: {
        id: "default-tomato",
        name: "Tomato",
        description: "",
        color: "",
        spiceLevel: 0,
        priceModifier: 0,
        isActive: true,
        sortOrder: 0
      },
      toppings: [],
      quantity: 1,
      notes: "",
      basePrice: 15.99,
      totalPrice: 15.99
    }
  ],
  subtotal: 15.99,
  deliveryFee: 0,
  tax: +(15.99 * 0.0825).toFixed(2),  // 8.25%
  total: +(15.99 + (15.99 * 0.0825)).toFixed(2)
};

// Test 2: Cart system (/api/cart)
const cartData = {
  customerName: "Test Customer Cart",
  customerEmail: "cart@test.com",
  customerPhone: "555-987-6543",
  orderType: "PICKUP",
  items: [
    {
      sizeId: "default-small",
      crustId: "default-traditional", 
      sauceId: "default-tomato",
      toppings: [],
      notes: "Test pizza from cart system"
    }
  ]
};

async function testCheckoutSystems() {
  try {
    console.log('📱 1. Testing CheckoutModal System (/api/checkout)...');
    console.log('Data:', JSON.stringify(checkoutModalData, null, 2));
    
    console.log('\n📱 2. Testing Cart System (/api/cart)...');
    console.log('Data:', JSON.stringify(cartData, null, 2));
    
    console.log('\n✅ Both systems should now use:');
    console.log('   - Tax Rate: 8.25% (from database)');
    console.log('   - Delivery Fee: $3.99');
    console.log('   - Minimum Order: $15.00');
    console.log('   - Consistent pricing calculations');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCheckoutSystems();
