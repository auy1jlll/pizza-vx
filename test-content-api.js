const fetch = require('node-fetch');

async function testContentAPI() {
  try {
    console.log('Testing content API...');
    
    const response = await fetch('http://localhost:3005/api/admin/content');
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Content API is working!');
      console.log(`Found ${data.data.files.length} content files`);
    } else {
      console.log('❌ Content API error:', data.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testContentAPI();
