const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🔍 Testing API endpoint...');
    
    const response = await fetch('http://localhost:3005/api/menu/dinner-plates');
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers));
    
    const data = await response.json();
    console.log('📋 Response data:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testAPI();
