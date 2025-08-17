const fetch = require('node-fetch');

async function simpleHealthCheck() {
  try {
    console.log('🔍 Testing server health...');
    
    const response = await fetch('http://localhost:3005/', {
      method: 'GET'
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`Server is responding: ${response.ok ? '✅' : '❌'}`);
    
    return response.ok;
  } catch (error) {
    console.error('❌ Server health check failed:', error.message);
    return false;
  }
}

async function testDatabaseConnection() {
  try {
    console.log('\n🔍 Testing database connection...');
    
    // Test a simple API endpoint that uses the database
    const response = await fetch('http://localhost:3005/api/admin/menu/categories', {
      method: 'GET'
    });
    
    console.log(`Database API status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.text();
      console.log('✅ Database connection working');
      console.log('Categories response length:', data.length);
    } else {
      console.log('❌ Database API failed');
    }
    
    return response.ok;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  }
}

async function testCartAPIWithMinimalData() {
  try {
    console.log('\n🔍 Testing cart API with minimal data...');
    
    const minimalCart = {
      pizzaItems: [],
      menuItems: []
    };
    
    console.log('Sending minimal cart data:', JSON.stringify(minimalCart));
    
    const response = await fetch('http://localhost:3005/api/cart/refresh-prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(minimalCart)
    });
    
    console.log(`Cart API status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.text();
      console.log('✅ Cart API working with minimal data');
      console.log('Response:', data);
    } else {
      const errorData = await response.text();
      console.log('❌ Cart API failed with minimal data');
      console.log('Error response:', errorData);
    }
    
    return response.ok;
  } catch (error) {
    console.error('❌ Cart API test failed:', error.message);
    return false;
  }
}

async function runDiagnostics() {
  console.log('🚀 Running cart refresh-prices diagnostics...\n');
  
  const healthOk = await simpleHealthCheck();
  if (!healthOk) {
    console.log('❌ Server is not responding - restart needed');
    return;
  }
  
  const dbOk = await testDatabaseConnection();
  if (!dbOk) {
    console.log('❌ Database connection issues detected');
    return;
  }
  
  const cartOk = await testCartAPIWithMinimalData();
  if (!cartOk) {
    console.log('❌ Cart API has issues even with minimal data');
    return;
  }
  
  console.log('\n✅ All basic tests passed - the issue might be with specific cart data');
}

runDiagnostics().catch(console.error);
