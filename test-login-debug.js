// Test Admin Login with Debug Info
const http = require('http');

async function testAdminLogin() {
  console.log('🔐 Testing Admin Login with Full Debug...\n');

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
      console.log(`📡 Response Status: ${res.statusCode}`);
      console.log(`📋 Response Headers:`, res.headers);
      
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          console.log(`📥 Response Body:`, response);
          
          // Check for cookies
          const cookies = res.headers['set-cookie'];
          if (cookies) {
            console.log(`🍪 Cookies Set:`);
            cookies.forEach(cookie => {
              console.log(`   ${cookie}`);
            });
          } else {
            console.log(`❌ No cookies set in response`);
          }
          
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: response,
            cookies: cookies
          });
        } catch (error) {
          console.error('❌ Failed to parse response:', error);
          console.log('Raw response:', responseData);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: responseData,
            error: 'Parse error'
          });
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request error:', error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function testAuthenticatedRequest(cookies) {
  console.log('\n🔒 Testing authenticated request...');

  if (!cookies) {
    console.log('❌ No cookies to test with');
    return;
  }

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/admin/sizes',
    method: 'GET',
    headers: {
      'Cookie': cookies.join('; ')
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      console.log(`📡 Auth Test Status: ${res.statusCode}`);
      
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          console.log(`📥 Auth Test Response:`, response);
          resolve({ status: res.statusCode, body: response });
        } catch (error) {
          console.log('Auth Test Raw response:', responseData);
          resolve({ status: res.statusCode, body: responseData });
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Auth test error:', error);
      reject(error);
    });

    req.end();
  });
}

async function runTest() {
  try {
    const loginResult = await testAdminLogin();
    
    if (loginResult.status === 200 && loginResult.cookies) {
      console.log('\n✅ Login successful! Testing authenticated request...');
      await testAuthenticatedRequest(loginResult.cookies);
    } else {
      console.log('\n❌ Login failed or no cookies received');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

runTest();
