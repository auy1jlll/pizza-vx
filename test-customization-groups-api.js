const fetch = require('node-fetch');

async function testCustomizationGroupsAPI() {
  try {
    console.log('🔍 Testing Customization Groups API...\n');

    const baseUrl = 'http://localhost:3005';
    
    // Test the API endpoint directly
    console.log('📡 Testing API endpoint: /api/admin/menu/customization-groups');
    
    try {
      const response = await fetch(`${baseUrl}/api/admin/menu/customization-groups`);
      const data = await response.json();
      
      console.log(`Status: ${response.status}`);
      console.log(`Response type: ${typeof data}`);
      console.log(`Is array: ${Array.isArray(data)}`);
      
      if (Array.isArray(data)) {
        console.log(`✅ Found ${data.length} customization groups`);
        
        if (data.length > 0) {
          console.log('\n📋 First 5 groups:');
          data.slice(0, 5).forEach((group, index) => {
            console.log(`${index + 1}. ${group.name} (ID: ${group.id})`);
            console.log(`   Type: ${group.type}, Active: ${group.isActive}`);
            console.log(`   Category: ${group.category?.name || 'No category'}`);
            console.log(`   Options count: ${group._count?.options || 0}`);
          });
        } else {
          console.log('❌ No groups returned from API');
        }
      } else {
        console.log('❌ API did not return an array');
        console.log('Response data:', JSON.stringify(data, null, 2));
      }
      
    } catch (apiError) {
      console.log('❌ API request failed:', apiError.message);
    }

    // Test with different parameters
    console.log('\n📡 Testing with includeOptions=true');
    try {
      const response2 = await fetch(`${baseUrl}/api/admin/menu/customization-groups?includeOptions=true`);
      const data2 = await response2.json();
      
      console.log(`Status: ${response2.status}`);
      console.log(`Groups count: ${Array.isArray(data2) ? data2.length : 'Not an array'}`);
      
      if (Array.isArray(data2) && data2.length > 0) {
        const groupWithOptions = data2.find(g => g.options && g.options.length > 0);
        if (groupWithOptions) {
          console.log(`✅ Found group with options: ${groupWithOptions.name}`);
          console.log(`   Options: ${groupWithOptions.options.length}`);
        }
      }
      
    } catch (apiError2) {
      console.log('❌ API request with parameters failed:', apiError2.message);
    }

    // Test with a specific category
    console.log('\n📡 Testing with categoryId filter');
    try {
      // Get a category first
      const categoriesResponse = await fetch(`${baseUrl}/api/menu/categories`);
      const categories = await categoriesResponse.json();
      
      if (categories.success && categories.data && categories.data.length > 0) {
        const firstCategory = categories.data[0];
        console.log(`Using category: ${firstCategory.name} (ID: ${firstCategory.id})`);
        
        const response3 = await fetch(`${baseUrl}/api/admin/menu/customization-groups?categoryId=${firstCategory.id}`);
        const data3 = await response3.json();
        
        console.log(`Status: ${response3.status}`);
        console.log(`Groups for category: ${Array.isArray(data3) ? data3.length : 'Not an array'}`);
      }
      
    } catch (apiError3) {
      console.log('❌ Category-filtered API request failed:', apiError3.message);
    }

    // Check if server is running
    console.log('\n🌐 Testing server connectivity...');
    try {
      const healthResponse = await fetch(`${baseUrl}/api/test`);
      console.log(`Server status: ${healthResponse.status}`);
    } catch (serverError) {
      console.log('❌ Server connectivity issue:', serverError.message);
      console.log('💡 Make sure your development server is running on port 3005');
    }

  } catch (error) {
    console.error('❌ Test script error:', error);
  }
}

testCustomizationGroupsAPI();
