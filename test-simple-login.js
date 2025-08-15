// Simple login test without fancy libraries
const https = require('https');
const http = require('http');

async function testLogin() {
  console.log('🧪 Testing Login API (Simple)...\n');
  
  const postData = JSON.stringify({
    username: 'admin@pizzabuilder.com',
    password: 'admin123'
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      console.log(`Status Code: ${res.statusCode}`);
      console.log(`Headers:`, res.headers);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Response Body:', data);
        
        if (res.statusCode === 200) {
          console.log('✅ Login successful!');
        } else {
          console.log('❌ Login failed');
        }
        
        resolve(data);
      });
    });

    req.on('error', (e) => {
      console.log('❌ Request error:', e.message);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

testLogin().catch(console.error);
