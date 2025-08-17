const fetch = require('node-fetch');

async function testMenuItemCreation() {
  try {
    const categoryId = 'cmef4on4p000fvkpo1427c8e0'; // Sea Food Rolls category ID
    
    const requestData = {
      name: 'Test Sea Food Roll',
      description: 'A delicious sea food roll for testing',
      basePrice: 12.99,
      categoryId: categoryId,
      isActive: true,
      isAvailable: true,
      customizationGroups: [] // Empty for testing
    };
    
    console.log('Sending request to create menu item...');
    console.log('Request data:', JSON.stringify(requestData, null, 2));
    
    const response = await fetch('http://localhost:3005/api/admin/menu/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseData = await response.text();
    console.log('Response body:', responseData);
    
    try {
      const jsonData = JSON.parse(responseData);
      console.log('Parsed JSON:', JSON.stringify(jsonData, null, 2));
    } catch (e) {
      console.log('Could not parse response as JSON');
    }
    
  } catch (error) {
    console.error('Error testing menu item creation:', error);
  }
}

testMenuItemCreation();
