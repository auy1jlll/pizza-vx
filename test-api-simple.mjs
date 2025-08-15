// API Test Script
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3000';

async function testLoginAPI() {
  console.log('🌐 Testing Login API Endpoint');
  console.log('=' .repeat(40));
  
  try {
    console.log('\n1. Testing login endpoint...');
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin@pizzabuilder.com',
        password: 'admin123'
      })
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`Headers:`, response.headers.raw());
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful');
      console.log('Response:', data);
      
      // Check for cookies
      const cookies = response.headers.get('set-cookie');
      if (cookies) {
        console.log('🍪 Cookies:', cookies);
        if (cookies.includes('access-token') && cookies.includes('refresh-token')) {
          console.log('✅ Both access and refresh tokens set');
          return true;
        } else {
          console.log('❌ Missing expected tokens');
          return false;
        }
      } else {
        console.log('❌ No cookies set');
        return false;
      }
    } else {
      const errorData = await response.text();
      console.log('❌ Login failed');
      console.log('Error:', errorData);
      return false;
    }
  } catch (error) {
    console.log('❌ API test error:', error.message);
    return false;
  }
}

// Wait for server to be ready and test
setTimeout(async () => {
  const success = await testLoginAPI();
  process.exit(success ? 0 : 1);
}, 2000);
