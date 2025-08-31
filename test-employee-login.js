const fetch = require('node-fetch');

async function testEmployeeLogin() {
  console.log('Testing employee login...\n');
  
  try {
    const loginData = {
      username: 'staff101@greenlandFamous.com',
      password: 'employee123'
    };

    console.log('Attempting login for:', loginData.username);
    
    const response = await fetch('http://localhost:3005/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✓ Login successful!');
      console.log('User info:', {
        email: result.user?.email,
        role: result.user?.role,
        name: result.user?.name
      });
      console.log('Token received:', !!result.token);
    } else {
      const error = await response.json();
      console.log('✗ Login failed:', error);
    }

  } catch (error) {
    console.error('Network error:', error.message);
  }
}

testEmployeeLogin();
