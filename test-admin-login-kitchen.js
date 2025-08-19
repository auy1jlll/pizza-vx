const fetch = require('node-fetch');

async function loginAsAdmin() {
  console.log('🔐 Attempting to login as admin...');
  
  try {
    const response = await fetch('http://localhost:3005/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });
    
    console.log(`📡 Login Response Status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    console.log('📄 Login Response:');
    console.log(responseText);
    
    // Extract the token from response
    if (response.status === 200) {
      try {
        const responseData = JSON.parse(responseText);
        const token = responseData.token;
        
        if (token) {
          console.log('✅ Login successful! Token received.');
          
          // Test the kitchen orders API with the token
          console.log('\n🧪 Testing kitchen orders API with token...');
          
          const kitchenResponse = await fetch('http://localhost:3005/api/admin/kitchen/orders', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Cookie': `access-token=${token}`
            }
          });
          
          console.log(`📡 Kitchen API Response Status: ${kitchenResponse.status} ${kitchenResponse.statusText}`);
          
          const kitchenText = await kitchenResponse.text();
          console.log('📄 Kitchen API Response:');
          console.log(kitchenText.slice(0, 500) + '...');
          
        } else {
          console.log('❌ No token received in response');
        }
      } catch (e) {
        console.log('❌ Failed to parse login response:', e.message);
      }
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    console.error('❌ Login test failed:', error.message);
  }
}

loginAsAdmin();
