console.log('Testing order fetching directly...');

// Test getting the latest order ID and testing the order page
const testOrderFetch = async () => {
  try {
    console.log('1. Testing orders API...');
    
    // Try both endpoints
    const endpoints = [
      'http://localhost:3005/api/orders',
      'http://localhost:3005/api/admin/orders'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Testing ${endpoint}...`);
        const response = await fetch(endpoint);
        const data = await response.json();
        
        if (data.success && data.data && data.data.length > 0) {
          const latestOrder = data.data[0];
          console.log(`✅ Latest order ID: ${latestOrder.id}`);
          console.log(`   Order Number: ${latestOrder.orderNumber || 'N/A'}`);
          console.log(`   Status: ${latestOrder.status}`);
          console.log(`   Total: $${latestOrder.total}`);
          
          // Now test the order page endpoint
          console.log('\n2. Testing order page API...');
          const orderPageUrl = `http://localhost:3005/api/orders/${latestOrder.id}`;
          console.log(`   Testing: ${orderPageUrl}`);
          
          const orderResponse = await fetch(orderPageUrl);
          const orderData = await orderResponse.json();
          
          if (orderResponse.ok) {
            console.log('✅ Order page API works!');
            console.log(`   Order has ${orderData.data.items?.length || 0} items`);
          } else {
            console.log('❌ Order page API failed:', orderData);
          }
          
          // Test the order page URL directly
          console.log('\n3. Order confirmation page URL:');
          console.log(`   http://localhost:3005/order/${latestOrder.id}`);
          
          return latestOrder.id;
        }
      } catch (e) {
        console.log(`❌ ${endpoint} failed:`, e.message);
      }
    }
    
    console.log('❌ No orders found in any endpoint');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Add fetch polyfill for Node.js
if (typeof fetch === 'undefined') {
  const fetch = require('node-fetch');
  global.fetch = fetch;
}

testOrderFetch();
