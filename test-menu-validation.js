/**
 * Test script for menu validation system
 * Tests all validation functions with various valid and invalid data
 */

// Since we can't import the validation module directly in Node.js without TS compilation,
// let's test it through the API endpoints

async function testMenuValidation() {
  const baseUrl = 'http://localhost:3005';
  
  console.log('🧪 Testing Menu Validation System');
  console.log('===================================\n');

  // Test 1: Category validation - valid data
  console.log('1. Testing Category Creation (Valid)');
  try {
    const validCategory = {
      name: 'Test Category',
      slug: 'test-category',
      description: 'A test category for validation',
      isActive: true,
      sortOrder: 1
    };

    const response = await fetch(`${baseUrl}/api/admin/menu/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validCategory)
    });

    const result = await response.json();
    console.log('✅ Valid category:', response.status === 200 ? 'PASSED' : 'FAILED');
    if (response.status !== 200) {
      console.log('   Error:', result);
    }
  } catch (error) {
    console.log('❌ Valid category test failed:', error.message);
  }

  // Test 2: Category validation - invalid data (empty name)
  console.log('\n2. Testing Category Creation (Invalid - Empty Name)');
  try {
    const invalidCategory = {
      name: '',  // Empty name should fail
      slug: 'empty-name-category',
      description: 'This should fail validation'
    };

    const response = await fetch(`${baseUrl}/api/admin/menu/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidCategory)
    });

    const result = await response.json();
    console.log('✅ Empty name validation:', response.status === 400 ? 'PASSED' : 'FAILED');
    if (response.status === 400) {
      console.log('   Validation error (expected):', result.details || result.error);
    }
  } catch (error) {
    console.log('❌ Empty name test failed:', error.message);
  }

  // Test 3: Category validation - invalid slug
  console.log('\n3. Testing Category Creation (Invalid - Bad Slug)');
  try {
    const invalidCategory = {
      name: 'Valid Name',
      slug: 'Invalid Slug With Spaces!',  // Invalid slug format
      description: 'This should fail slug validation'
    };

    const response = await fetch(`${baseUrl}/api/admin/menu/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidCategory)
    });

    const result = await response.json();
    console.log('✅ Invalid slug validation:', response.status === 400 ? 'PASSED' : 'FAILED');
    if (response.status === 400) {
      console.log('   Validation error (expected):', result.details || result.error);
    }
  } catch (error) {
    console.log('❌ Invalid slug test failed:', error.message);
  }

  // Test 4: Menu Item validation - valid data
  console.log('\n4. Testing Menu Item Creation (Valid)');
  try {
    // First get a valid category ID
    const categoriesResponse = await fetch(`${baseUrl}/api/admin/menu/categories`);
    const categoriesData = await categoriesResponse.json();
    
    if (categoriesData.length === 0) {
      console.log('⚠️  No categories found, skipping menu item tests');
      return;
    }

    const categoryId = categoriesData[0].id;

    const validMenuItem = {
      name: 'Test Menu Item',
      categoryId: categoryId,
      basePrice: 12.99,
      description: 'A delicious test item',
      isActive: true,
      isAvailable: true,
      sortOrder: 1
    };

    const response = await fetch(`${baseUrl}/api/admin/menu/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validMenuItem)
    });

    const result = await response.json();
    console.log('✅ Valid menu item:', response.status === 200 ? 'PASSED' : 'FAILED');
    if (response.status !== 200) {
      console.log('   Error:', result);
    }
  } catch (error) {
    console.log('❌ Valid menu item test failed:', error.message);
  }

  // Test 5: Menu Item validation - invalid data (empty name)
  console.log('\n5. Testing Menu Item Creation (Invalid - Empty Name)');
  try {
    const categoriesResponse = await fetch(`${baseUrl}/api/admin/menu/categories`);
    const categoriesData = await categoriesResponse.json();
    const categoryId = categoriesData[0]?.id;

    const invalidMenuItem = {
      name: '',  // Empty name should fail
      categoryId: categoryId,
      basePrice: 12.99,
      description: 'This should fail validation'
    };

    const response = await fetch(`${baseUrl}/api/admin/menu/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidMenuItem)
    });

    const result = await response.json();
    console.log('✅ Empty item name validation:', response.status === 400 ? 'PASSED' : 'FAILED');
    if (response.status === 400) {
      console.log('   Validation error (expected):', result.details || result.error);
    }
  } catch (error) {
    console.log('❌ Empty item name test failed:', error.message);
  }

  // Test 6: Menu Item validation - invalid price
  console.log('\n6. Testing Menu Item Creation (Invalid - Negative Price)');
  try {
    const categoriesResponse = await fetch(`${baseUrl}/api/admin/menu/categories`);
    const categoriesData = await categoriesResponse.json();
    const categoryId = categoriesData[0]?.id;

    const invalidMenuItem = {
      name: 'Valid Name',
      categoryId: categoryId,
      basePrice: -5.99,  // Negative price should fail
      description: 'This should fail price validation'
    };

    const response = await fetch(`${baseUrl}/api/admin/menu/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidMenuItem)
    });

    const result = await response.json();
    console.log('✅ Negative price validation:', response.status === 400 ? 'PASSED' : 'FAILED');
    if (response.status === 400) {
      console.log('   Validation error (expected):', result.details || result.error);
    }
  } catch (error) {
    console.log('❌ Negative price test failed:', error.message);
  }

  // Test 7: Customization Group validation - valid data
  console.log('\n7. Testing Customization Group Creation (Valid)');
  try {
    const validGroup = {
      name: 'Test Size Group',
      type: 'SINGLE_SELECT',
      description: 'A test size customization group',
      isRequired: true,
      minSelections: 1,
      maxSelections: 1,
      sortOrder: 1
    };

    const response = await fetch(`${baseUrl}/api/admin/menu/customization-groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validGroup)
    });

    const result = await response.json();
    console.log('✅ Valid customization group:', response.status === 200 ? 'PASSED' : 'FAILED');
    if (response.status !== 200) {
      console.log('   Error:', result);
    }
  } catch (error) {
    console.log('❌ Valid customization group test failed:', error.message);
  }

  // Test 8: Customization Group validation - invalid type
  console.log('\n8. Testing Customization Group Creation (Invalid - Bad Type)');
  try {
    const invalidGroup = {
      name: 'Test Group',
      type: 'INVALID_TYPE',  // Invalid type should fail
      description: 'This should fail type validation'
    };

    const response = await fetch(`${baseUrl}/api/admin/menu/customization-groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidGroup)
    });

    const result = await response.json();
    console.log('✅ Invalid type validation:', response.status === 400 ? 'PASSED' : 'FAILED');
    if (response.status === 400) {
      console.log('   Validation error (expected):', result.details || result.error);
    }
  } catch (error) {
    console.log('❌ Invalid type test failed:', error.message);
  }

  console.log('\n🎯 Menu Validation Testing Complete');
  console.log('=====================================');
}

// Run the tests if server is available
testMenuValidation().catch(error => {
  console.error('Failed to run validation tests:', error.message);
  console.log('\n💡 Make sure the server is running on http://localhost:3005');
});
