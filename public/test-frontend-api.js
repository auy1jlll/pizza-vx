// Test if the frontend can actually call the API
console.log('🧪 Testing frontend API call...');

async function testFrontendAPI() {
  try {
    const params = new URLSearchParams({
      limit: '50',
      includeInactive: 'false'
    });

    const url = `/api/admin/menu/customization-groups?${params}`;
    console.log('🔗 URL:', url);
    
    const response = await fetch(url);
    console.log('📊 Status:', response.status);
    console.log('📊 Content-Type:', response.headers.get('content-type'));
    
    if (response.ok) {
      const data = await response.json();
      console.log('📊 Data type:', typeof data);
      console.log('📊 Is array:', Array.isArray(data));
      console.log('📊 Length:', Array.isArray(data) ? data.length : 'N/A');
      
      // Test the same logic as component
      const groups = data.groups || data;
      console.log('📊 Final groups:', Array.isArray(groups) ? groups.length : 'Not array');
      
      if (Array.isArray(groups) && groups.length > 0) {
        console.log('✅ First group:', groups[0]);
      }
    } else {
      console.error('❌ Response not ok:', response.status);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testFrontendAPI();
