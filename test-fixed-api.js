const fetch = require('node-fetch');

async function testFixedAPI() {
  try {
    console.log('🔍 Testing fixed API endpoint...\n');
    
    // Wait a moment for server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const response = await fetch('http://localhost:3005/api/menu/dinner-plates');
    
    console.log('📡 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Success!');
      console.log('📋 Response structure:', {
        success: data.success,
        itemCount: data.data?.items?.length || 0,
        category: data.data?.category?.name
      });
      
      if (data.data?.items?.length > 0) {
        console.log('\n📋 First few items:');
        data.data.items.slice(0, 3).forEach((item, i) => {
          console.log(`   ${i+1}. ${item.name} ($${item.basePrice})`);
        });
      }
    } else {
      const errorData = await response.json();
      console.log('❌ API Error:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testFixedAPI();
