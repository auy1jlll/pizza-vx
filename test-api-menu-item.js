const fetch = require('node-fetch');

async function testMenuItemAPI() {
  try {
    console.log('Testing menu item creation API with blank preparation time...');

    // Test data with null preparation time
    const testData = {
      name: "Test Item with Blank Prep Time",
      description: "Testing validation fix",
      basePrice: 12.99,
      categoryId: "cmeg8pqgs0005vkwwmxz4aazp", // Use a known category ID
      isActive: true,
      isAvailable: true,
      sortOrder: 0,
      preparationTime: null, // This should now be allowed
      allergens: null,
      nutritionInfo: null,
      customizationGroups: []
    };

    console.log('Sending request with data:', JSON.stringify(testData, null, 2));

    const response = await fetch('http://localhost:3005/api/admin/menu/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('✅ Menu item created successfully!');
      
      // Clean up - delete the test item
      if (result.id) {
        const deleteResponse = await fetch(`http://localhost:3005/api/admin/menu/items/${result.id}`, {
          method: 'DELETE'
        });
        console.log('✅ Test item cleaned up');
      }
    } else {
      console.log('❌ API request failed');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testMenuItemAPI();
