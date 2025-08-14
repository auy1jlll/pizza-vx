// Test script to verify login error handling
const fetch = require('node-fetch');

async function testLogin() {
  console.log('Testing login with invalid credentials...');
  
  try {
    const response = await fetch('http://localhost:3003/api/auth/customer/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'wrong@email.com',
        password: 'wrongpassword'
      })
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log('Error response:', errorData);
      console.log('Error message:', errorData.error);
    } else {
      console.log('Unexpected success!');
    }
  } catch (error) {
    console.error('Network error:', error.message);
  }
}

testLogin();
