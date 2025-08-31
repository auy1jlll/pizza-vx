const https = require('https');

const options = {
  hostname: 'localhost',
  port: 3005,
  path: '/api/specialty-calzones/cmez5ncaz000kvkawt4u0qleq',
  method: 'GET',
  headers: {
    'User-Agent': 'Node.js Test Script'
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('✅ SUCCESS: API is working!');
      console.log('📦 Calzone name:', data.name);
      console.log('📦 Base price:', data.basePrice);
    } catch (e) {
      console.log('❌ Error parsing response:', e.message);
      console.log('Raw response:', body);
    }
  });
});

req.on('error', (e) => {
  console.log('❌ Request error:', e.message);
});

req.end();
