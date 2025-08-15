// Simple Performance Test - API Testing Only
const API_BASE_URL = 'http://localhost:3000';

async function testAPIs() {
  console.log('🚀 Testing Pizza Builder API Performance');
  console.log('=' .repeat(50));

  let testsPassed = 0;
  let testsTotal = 0;

  // Test 1: Pizza Data API
  console.log('\n1. Testing Pizza Data API...');
  testsTotal++;
  try {
    const startTime = Date.now();
    const response = await fetch(`${API_BASE_URL}/api/pizza-data`);
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Pizza Data API working (${responseTime}ms)`);
      console.log(`   Response includes: ${Object.keys(data).join(', ')}`);
      testsPassed++;
    } else {
      console.log(`❌ Pizza Data API failed: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Pizza Data API error: ${error.message}`);
  }

  // Test 2: HTTP Headers Check
  console.log('\n2. Testing HTTP Cache Headers...');
  testsTotal++;
  try {
    const response = await fetch(`${API_BASE_URL}/api/pizza-data`);
    const cacheControl = response.headers.get('cache-control');
    const etag = response.headers.get('etag');
    
    console.log(`   Cache-Control: ${cacheControl || 'Not set'}`);
    console.log(`   ETag: ${etag ? etag.substring(0, 20) + '...' : 'Not set'}`);
    
    if (cacheControl || etag) {
      console.log('✅ HTTP cache headers present');
      testsPassed++;
    } else {
      console.log('❌ HTTP cache headers missing');
    }
  } catch (error) {
    console.log(`❌ HTTP headers test error: ${error.message}`);
  }

  // Test 3: Response Time Comparison
  console.log('\n3. Testing Response Times...');
  testsTotal++;
  try {
    const times = [];
    
    for (let i = 0; i < 3; i++) {
      const start = Date.now();
      const response = await fetch(`${API_BASE_URL}/api/pizza-data`);
      const time = Date.now() - start;
      times.push(time);
      await response.json();
    }
    
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(`   Response times: ${times.join('ms, ')}ms`);
    console.log(`   Average: ${Math.round(avgTime)}ms`);
    
    if (avgTime < 500) {
      console.log('✅ Good response times');
      testsPassed++;
    } else {
      console.log('❌ Slow response times');
    }
  } catch (error) {
    console.log(`❌ Response time test error: ${error.message}`);
  }

  // Test 4: Conditional Request
  console.log('\n4. Testing Conditional Requests...');
  testsTotal++;
  try {
    // First request
    const response1 = await fetch(`${API_BASE_URL}/api/pizza-data`);
    const etag = response1.headers.get('etag');
    
    if (etag) {
      // Conditional request
      const response2 = await fetch(`${API_BASE_URL}/api/pizza-data`, {
        headers: { 'If-None-Match': etag }
      });
      
      console.log(`   First request: ${response1.status}`);
      console.log(`   Conditional request: ${response2.status}`);
      
      if (response2.status === 304) {
        console.log('✅ Conditional requests working (304 Not Modified)');
        testsPassed++;
      } else {
        console.log('❌ Conditional requests not working properly');
      }
    } else {
      console.log('❌ No ETag for conditional request test');
    }
  } catch (error) {
    console.log(`❌ Conditional request test error: ${error.message}`);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${testsPassed}/${testsTotal} passed`);
  console.log(`✅ Success Rate: ${Math.round((testsPassed / testsTotal) * 100)}%`);
  
  if (testsPassed === testsTotal) {
    console.log('\n🎉 All API performance tests passed!');
    console.log('\n🚀 Performance features working:');
    console.log('   • Fast API response times');
    console.log('   • HTTP cache headers implemented');
    console.log('   • Conditional requests working');
    console.log('   • Ready for production optimization');
  } else {
    console.log('\n⚠️  Some tests failed - check implementation');
  }
}

// Import fetch for Node.js
const fetch = (await import('node-fetch')).default;

// Run tests
testAPIs().catch(console.error);
