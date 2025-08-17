// Simple test to verify auth endpoints are working
async function testAuthEndpoints() {
  console.log('🧪 Testing authentication endpoints...');
  
  try {
    // Test 1: Register a new user
    console.log('\n1️⃣ Testing customer registration...');
    const registerResponse = await fetch('http://localhost:3005/api/auth/customer/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User'
      })
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Registration successful:', registerData.message);
    } else {
      const error = await registerResponse.text();
      console.log('❌ Registration failed:', error);
    }

    // Test 2: Login with test customer
    console.log('\n2️⃣ Testing customer login...');
    const loginResponse = await fetch('http://localhost:3005/api/auth/customer/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'customer@test.com',
        password: 'password123'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful:', loginData.message);
      
      // Extract cookies
      const cookies = loginResponse.headers.get('set-cookie');
      console.log('🍪 Cookies set:', !!cookies);

    } else {
      const error = await loginResponse.text();
      console.log('❌ Login failed:', error);
    }

    // Test 3: Check auth endpoint
    console.log('\n3️⃣ Testing auth/me endpoint...');
    const authResponse = await fetch('http://localhost:3005/api/auth/me', {
      method: 'GET'
    });

    const authData = await authResponse.json();
    console.log('Auth status:', authResponse.status, authData);

  } catch (error) {
    console.error('❌ Connection error:', error.message);
    console.log('\n🔧 This suggests the server connection issue is still present.');
    console.log('💡 Try accessing http://localhost:3005 directly in your browser.');
  }
}

testAuthEndpoints();
