// Test checkout API with proper cart data
const fetch = require('node-fetch');

async function testCheckout() {
  console.log('🧪 Testing checkout with proper pizza data...');

  // Test data with actual database structure
  const checkoutData = {
    items: [
      {
        size: {
          id: 'cmecgmn2p0019vk1ovkvxj5qy', // Small from database
          name: 'Small',
          basePrice: 10.99
        },
        crust: {
          id: 'cmecfsjub0000vkn8pe8wy5g3', // THIN CRUST from database
          name: 'THIN CRUST'
        },
        sauce: {
          id: 'cmecfsjz80003vkn8wuw8jf5j', // ORIGINAL PIZZA from database
          name: 'ORIGINAL PIZZA'
        },
        quantity: 1,
        basePrice: 10.99,
        totalPrice: 10.99,
        notes: 'Small pizza - THIN CRUST crust with ORIGINAL PIZZA sauce'
      }
    ],
    customer: {
      name: 'Test Customer',
      email: 'test@test.com',
      phone: '555-0123'
    },
    orderType: 'PICKUP',
    paymentMethod: 'CREDIT_CARD',
    subtotal: 10.99,
    deliveryFee: 0,
    tax: 0.88,
    total: 11.87,
    notes: 'Test order'
  };

  try {
    console.log('📤 Sending checkout request...');
    const response = await fetch('http://localhost:3001/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData)
    });

    const result = await response.json();
    
    console.log('📨 Response status:', response.status);
    console.log('📝 Response body:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('✅ Checkout successful!');
    } else {
      console.log('❌ Checkout failed!');
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Start server and test
const { spawn } = require('child_process');

console.log('🚀 Starting development server...');
const server = spawn('npm', ['run', 'dev'], { 
  shell: true,
  stdio: 'pipe'
});

// Wait for server to start
setTimeout(() => {
  testCheckout();
}, 5000);

// Handle server output
server.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Ready')) {
    console.log('✅ Server ready!');
  }
});

server.stderr.on('data', (data) => {
  console.log('Server:', data.toString());
});
