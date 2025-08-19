const axios = require('axios');

async function testAdminLogin() {
  try {
    console.log('🧪 Testing admin login API directly...\n');
    
    const loginData = {
      username: 'kitchen@pizzabuilder.com',
      password: 'kitchen123'
    };
    
    console.log(`Testing login with: ${loginData.username} / ${loginData.password}`);
    
    const response = await axios.post('http://localhost:3005/api/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: () => true // Don't throw on non-2xx status codes
    });
    
    console.log('\n📊 Response Status:', response.status);
    console.log('📊 Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.headers['set-cookie']) {
      console.log('🍪 Cookies Set:', response.headers['set-cookie']);
    }
    
    if (response.status === 200) {
      console.log('✅ Login successful!');
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing login:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testAdminLogin();
