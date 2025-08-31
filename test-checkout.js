const fetch = require('node-fetch');

async function testCheckout() {
  try {
    const response = await fetch('http://localhost:3005/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [],
        customer: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '123-456-7890'
        },
        orderType: 'PICKUP',
        subtotal: 0,
        deliveryFee: 0,
        tax: 0,
        total: 0
      })
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    const text = await response.text();
    console.log('Response body:', text);

  } catch (error) {
    console.error('Error:', error);
  }
}

testCheckout();
