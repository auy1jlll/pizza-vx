const http = require('http');

const testOrder = {
  customerEmail: "test@example.com",
  customerName: "Test User",
  items: [
    {
      id: 1,
      name: "Test Item",
      price: 10.99,
      quantity: 1
    }
  ],
  total: 10.99,
  paymentMethod: "cash"
};

const postData = JSON.stringify(testOrder);

const options = {
  hostname: '91.99.58.154',
  port: 3000,
  path: '/api/checkout',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing checkout functionality...');
console.log('Order data:', testOrder);

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('✅ Checkout test successful!');
    } else {
      console.log('❌ Checkout test failed!');
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Problem with request: ${e.message}`);
});

req.write(postData);
req.end();