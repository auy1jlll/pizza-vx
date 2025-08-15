// Test the checkout API directly to debug the 401 error
const API_BASE = 'http://localhost:3000';

async function testCheckoutAPI() {
  console.log('🧪 Testing checkout API directly...\n');

  // Simple test order data matching our working test script
  const testOrder = {
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
    items: [
      {
        id: 'test-item-1',
        size: {
          id: 'cmeb4wr4t0001vk9s2y76icn1', // Real Medium size ID
          name: 'Medium',
          diameter: '12"',
          basePrice: 12.99,
          isActive: true,
          sortOrder: 2,
        },
        crust: {
          id: 'cmeb4wr4t0003vk9s2y76icn3', // Real Traditional crust ID
          name: 'Traditional',
          description: 'Classic hand-tossed crust',
          priceModifier: 0,
          isActive: true,
          sortOrder: 1,
        },
        sauce: {
          id: 'cmeb4wr4t0005vk9s2y76icn5', // Real Tomato sauce ID
          name: 'Tomato',
          description: 'Classic tomato sauce',
          color: '#FF6B6B',
          spiceLevel: 1,
          priceModifier: 0,
          isActive: true,
          sortOrder: 1,
        },
        toppings: [],
        quantity: 1,
        notes: '',
        basePrice: 12.99,
        totalPrice: 12.99,
      }
    ],
    subtotal: 12.99,
    deliveryFee: 3.99,
    tax: 1.04,
    total: 18.02,
  };

  try {
    console.log('1️⃣ Sending checkout request...');
    console.log('📦 Order data:', JSON.stringify(testOrder, null, 2));

    const response = await fetch(`${API_BASE}/api/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(testOrder),
    });

    console.log('\n2️⃣ Response received:');
    console.log('📡 Status:', response.status);
    console.log('📡 Status Text:', response.statusText);
    console.log('📡 Headers:', [...response.headers.entries()]);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ SUCCESS! Order created:', result);
    } else {
      const errorText = await response.text();
      console.log('❌ FAILED! Response:', errorText);
    }

  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Run the test
testCheckoutAPI();
