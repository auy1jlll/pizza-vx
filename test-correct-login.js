const fetch = require('node-fetch');

async function testCorrectLogin() {
  console.log('Testing correct email case...\n');
  
  try {
    const loginData = {
      username: 'staff101@greenlandFamous.com', // Note the capital F
      password: 'employee123'
    };

    console.log('Attempting login with:', loginData.username);
    
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
      console.log('✅ LOGIN SUCCESSFUL!');
      console.log('User:', result.user);
    } else {
      const error = await response.json();
      console.log('❌ Login failed:', error);
    }

  } catch (error) {
    console.error('Network error:', error.message);
  }
}

testCorrectLogin();
