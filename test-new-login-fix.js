// Test the new login error handling
async function testLoginErrorHandling() {
  console.log('Testing login error handling...');
  
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
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log('✅ API returns proper error response:');
      console.log('Error data:', errorData);
      console.log('Error message:', errorData.error);
    } else {
      console.log('❌ Unexpected success!');
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
}

testLoginErrorHandling();
