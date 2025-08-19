const fetch = require('node-fetch');

async function debugAPIResponse() {
  try {
    console.log('🔍 Debugging API Response Structure...\n');

    const response = await fetch('http://localhost:3005/api/admin/menu/customization-groups?limit=50&includeInactive=false');
    const data = await response.json();
    
    console.log('📋 Response Details:');
    console.log(`Status: ${response.status}`);
    console.log(`Content-Type: ${response.headers.get('content-type')}`);
    console.log(`Data type: ${typeof data}`);
    console.log(`Is array: ${Array.isArray(data)}`);
    
    if (data.groups) {
      console.log(`✅ Has 'groups' property: ${data.groups.length} items`);
    } else {
      console.log(`❌ No 'groups' property found`);
    }
    
    if (Array.isArray(data)) {
      console.log(`✅ Direct array: ${data.length} items`);
    }
    
    console.log('\n📋 Raw Response Structure:');
    console.log(JSON.stringify(data, null, 2).substring(0, 500) + '...');
    
    // Test the exact same call as the frontend
    console.log('\n🔍 Testing exact frontend call...');
    const params = new URLSearchParams({
      limit: '50',
      includeInactive: 'false'
    });
    
    const frontendResponse = await fetch(`http://localhost:3005/api/admin/menu/customization-groups?${params}`);
    const frontendData = await frontendResponse.json();
    
    console.log(`Frontend call status: ${frontendResponse.status}`);
    console.log(`Frontend data type: ${typeof frontendData}`);
    console.log(`Frontend is array: ${Array.isArray(frontendData)}`);
    console.log(`Frontend length: ${Array.isArray(frontendData) ? frontendData.length : 'N/A'}`);
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  }
}

debugAPIResponse();
