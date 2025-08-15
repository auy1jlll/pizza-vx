// Simple test to verify the API endpoints are working
// Run this after the server is running on localhost:3001

async function quickAPITest() {
  const baseURL = 'http://localhost:3001';
  
  console.log('🔄 Testing API endpoints...\n');

  try {
    // Test pizza data endpoint
    console.log('1️⃣ Testing /api/pizza-data...');
    const response = await fetch(`${baseURL}/api/pizza-data`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Pizza data API works:', {
        sizes: data.sizes?.length || 0,
        crusts: data.crusts?.length || 0,
        sauces: data.sauces?.length || 0,
        toppings: data.toppings?.length || 0
      });
      
      // Show first few items to verify real IDs
      if (data.sizes?.length > 0) {
        console.log('📋 Sample size data:', {
          id: data.sizes[0].id,
          name: data.sizes[0].name,
          diameter: data.sizes[0].diameter
        });
      }
      
      console.log('\n✅ SERVER IS WORKING! The checkout should now work properly.');
      console.log('👉 Go to http://localhost:3001/pizza-builder to test manually');
      
    } else {
      console.error('❌ Pizza data API failed:', response.status);
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('🔍 Make sure the server is running on port 3001');
  }
}

// Run immediately
quickAPITest();
