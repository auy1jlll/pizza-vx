const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 3005,
  path: '/api/specialty-calzones/cmez5ncaz000kvkawt4u0qleq',
  method: 'GET'
}, (res) => {
  console.log('Status:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Response:', data);
    console.log('--- End ---');
  });
});

req.on('error', (e) => {
  console.log('Error:', e.message);
});

req.end();
