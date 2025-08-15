// Test Checkout API Validation
// This script tests the /api/checkout endpoint with the correct data structure

const http = require('http');

async function testCheckoutAPI() {
  const baseUrl = 'http://localhost:3000';
  
  // Test data that matches our fixed CheckoutModal structure
  const testOrderData = {
    orderType: "DELIVERY",
    customer: {
      name: "Test Customer",
      email: "test@example.com", 
      phone: "555-123-4567"
    },
    delivery: {
      address: "123 Test Street",
      city: "Boston",
      zip: "02101",
      instructions: "Ring doorbell"
    },
    items: [
      {
        id: "test-item-1",
        size: {
          id: "default-small",
          name: "Small",
          diameter: "12\"",
          basePrice: 12.99,
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
        toppings: [
          {
            id: "pepperoni",
            name: "Pepperoni",
            price: 1.50,
            quantity: 1,
            section: "WHOLE",
            intensity: "REGULAR"
          }
        ],
        quantity: 1,
        notes: "",
        basePrice: 12.99,
        totalPrice: 14.49
      }
    ],
    subtotal: 14.49,
    deliveryFee: 3.99,
    tax: 1.27,
    total: 19.75
  };

  try {
    console.log('🚀 Testing /api/checkout endpoint...');
    console.log('📦 Sending order data:', JSON.stringify(testOrderData, null, 2));
    
    const response = await fetch(`${baseUrl}/api/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrderData)
    });

    const result = await response.json();
    
    console.log('\n📊 Response Status:', response.status);
    console.log('📋 Response Data:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.success) {
      console.log('\n✅ SUCCESS: Order validation passed!');
      console.log('🎉 Order Number:', result.order?.orderNumber);
      console.log('💰 Total:', result.order?.total);
    } else {
      console.log('\n❌ FAILED: Order validation failed');
      console.log('🚨 Error:', result.error);
      
      if (result.validationErrors) {
        console.log('📝 Validation Errors:');
        result.validationErrors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error.message} (Path: ${error.path?.join('.')})`);
        });
      }
    }
    
  } catch (error) {
    console.error('\n💥 Network Error:', error.message);
  }
}

// Test PICKUP order type as well
async function testPickupOrder() {
  const baseUrl = 'http://localhost:3000';
  
  const pickupOrderData = {
    orderType: "PICKUP",
    customer: {
      name: "Pickup Customer",
      email: "pickup@example.com",
      phone: "555-987-6543"
    },
    items: [
      {
        id: "pickup-item-1",
        size: {
          id: "default-medium",
          name: "Medium",
          diameter: "14\"",
          basePrice: 15.99,
          isActive: true,
          sortOrder: 1
        },
        crust: {
          id: "default-thin",
          name: "Thin Crust",
          description: "",
          priceModifier: 0,
          isActive: true,
          sortOrder: 1
        },
        sauce: {
          id: "default-marinara",
          name: "Marinara",
          description: "",
          color: "",
          spiceLevel: 0,
          priceModifier: 0,
          isActive: true,
          sortOrder: 1
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
    tax: 1.40,
    total: 17.39
  };

  try {
    console.log('\n🚀 Testing PICKUP order...');
    
    const response = await fetch(`${baseUrl}/api/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pickupOrderData)
    });

    const result = await response.json();
    
    console.log('📊 PICKUP Response Status:', response.status);
    
    if (response.ok && result.success) {
      console.log('✅ PICKUP order validation passed!');
      console.log('🎉 Order Number:', result.order?.orderNumber);
    } else {
      console.log('❌ PICKUP order validation failed');
      console.log('🚨 Error:', result.error);
    }
    
  } catch (error) {
    console.error('💥 PICKUP Network Error:', error.message);
  }
}

// Run tests
console.log('🧪 Starting Checkout API Validation Tests...\n');

testCheckoutAPI().then(() => {
  return testPickupOrder();
}).then(() => {
  console.log('\n🏁 All tests completed!');
}).catch(error => {
  console.error('Test suite failed:', error);
});
