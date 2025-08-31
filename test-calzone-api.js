const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3005,
  path: '/api/specialty-calzones/cmez5ncaz000kvkawt4u0qleq',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);

  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const data = JSON.parse(body);
        console.log('✅ SUCCESS: Specialty calzone API is working!');
        console.log('📦 Calzone name:', data.name);
        console.log('📦 Base price:', data.basePrice);
        console.log('📦 Description:', data.description);
        console.log('📦 Sizes available:', data.sizes?.length || 0);
      } catch (e) {
        console.log('❌ Error parsing JSON response:', e.message);
        console.log('Raw response:', body.substring(0, 200) + '...');
      }
    } else {
      console.log('❌ API returned error status:', res.statusCode);
      console.log('Response:', body);
    }
  });
});

req.on('error', (e) => {
  console.log('❌ Request failed:', e.message);
  console.log('Error code:', e.code);
});

req.setTimeout(5000, () => {
  console.log('❌ Request timed out');
  req.destroy();
});

req.end();
