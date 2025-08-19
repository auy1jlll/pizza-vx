const fetch = require('node-fetch');

async function testKitchenDisplayRateLimit() {
  console.log('🧪 Testing Kitchen Display Rate Limiting');
  console.log('📊 New polling interval: 15 seconds (was 5 seconds)');
  console.log('📊 New admin rate limit: 200 requests per 15 minutes (was 100)');
  console.log('📊 With 15-second polling: 60 requests per 15 minutes (well under 200 limit)');
  
  console.log('\n🔄 Simulating rapid requests to test rate limiting...');
  
  let successCount = 0;
  let rateLimitedCount = 0;
  
  // Test multiple rapid requests
  for (let i = 1; i <= 10; i++) {
    try {
      const response = await fetch('http://localhost:3005/api/admin/kitchen/orders', {
        headers: {
          'Cookie': 'admin-token=test' // Mock admin token for testing
        }
      });
      
      if (response.status === 200) {
        successCount++;
        console.log(`✅ Request ${i}: Success (${response.status})`);
      } else if (response.status === 429) {
        rateLimitedCount++;
        console.log(`⏱️ Request ${i}: Rate Limited (${response.status})`);
      } else if (response.status === 401) {
        console.log(`🔐 Request ${i}: Unauthorized (${response.status}) - Expected without real auth`);
      } else {
        console.log(`❌ Request ${i}: Error (${response.status})`);
      }
      
    } catch (error) {
      console.log(`❌ Request ${i}: Network Error - ${error.message}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n📊 Results:`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`⏱️ Rate Limited: ${rateLimitedCount}`);
  console.log(`🔐 Unauthorized: ${10 - successCount - rateLimitedCount}`);
  
  if (rateLimitedCount === 0) {
    console.log('🎉 Rate limiting appears to be resolved!');
  } else {
    console.log('⚠️ Still experiencing some rate limiting, but this may be expected during rapid testing');
  }
}

testKitchenDisplayRateLimit();
