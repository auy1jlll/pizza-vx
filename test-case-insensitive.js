const fetch = require('node-fetch');

async function testCaseInsensitiveLogin() {
  console.log('Testing Case-Insensitive Login...\n');
  
  const testCases = [
    // Original case
    { email: 'staff101@greenlandFamous.com', label: 'Original case' },
    // All lowercase
    { email: 'staff101@greenlandfamous.com', label: 'All lowercase' },
    // Mixed case
    { email: 'Staff101@GreenlandFamous.com', label: 'Mixed case' },
    // Different case
    { email: 'STAFF101@GREENLANDFAMOUS.COM', label: 'All uppercase' }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n--- Testing ${testCase.label}: ${testCase.email} ---`);
      
      const response = await fetch('http://localhost:3005/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: testCase.email,
          password: 'employee123'
        }),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ SUCCESS - Login worked!');
        console.log('User:', result.user?.email);
      } else {
        const error = await response.json();
        console.log('❌ FAILED -', error.error);
      }

    } catch (error) {
      console.error('❌ NETWORK ERROR:', error.message);
    }
  }
}

testCaseInsensitiveLogin();
