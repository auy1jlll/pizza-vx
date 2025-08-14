const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login API...');
    
    const response = await axios.post('http://localhost:3002/api/auth/customer/login', {
      email: 'test@example.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ Login successful!');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Login failed');
    console.log('Status:', error.response?.status || 'No response');
    console.log('Error:', error.response?.data || 'No error data');
    console.log('Error message:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('Connection refused - is the server running?');
    }
  }
}

testLogin();
