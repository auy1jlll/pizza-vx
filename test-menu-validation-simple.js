const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3005';

async function testMenuValidation() {
  console.log('🧪 Testing Menu Validation System...\n');

  // Test 1: Valid category creation
  console.log('1️⃣ Testing valid category creation...');
  try {
    const validCategory = {
      name: 'Test Category ' + Date.now(),
      slug: 'test-category-' + Date.now(),
      description: 'A test category for validation',
      isActive: true,
      sortOrder: 1
    };

    const response = await fetch(`${BASE_URL}/api/admin/menu/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validCategory)
    });

    if (response.ok) {
      console.log('✅ Valid category creation: PASSED');
    } else {
      const error = await response.text();
      console.log('❌ Valid category creation: FAILED -', error);
    }
  } catch (error) {
    console.log('❌ Valid category creation: ERROR -', error.message);
  }

  // Test 2: Invalid category creation (empty name)
  console.log('\n2️⃣ Testing invalid category creation (empty name)...');
  try {
    const invalidCategory = {
      name: '',
      slug: 'test-category-' + Date.now(),
      description: 'A test category',
      isActive: true,
      sortOrder: 1
    };

    const response = await fetch(`${BASE_URL}/api/admin/menu/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidCategory)
    });

    if (!response.ok) {
      console.log('✅ Invalid category validation: PASSED (correctly rejected)');
    } else {
      console.log('❌ Invalid category validation: FAILED (should have been rejected)');
    }
  } catch (error) {
    console.log('❌ Invalid category validation: ERROR -', error.message);
  }

  // Test 3: Valid menu item creation
  console.log('\n3️⃣ Testing valid menu item creation...');
  try {
    // First, get a category ID
    const categoriesResponse = await fetch(`${BASE_URL}/api/admin/menu/categories`);
    const categories = await categoriesResponse.json();
    
    if (categories && categories.length > 0) {
      const validItem = {
        name: 'Test Item ' + Date.now(),
        description: 'A test menu item',
        price: 12.99,
        categoryId: categories[0].id,
        isActive: true,
        sortOrder: 1
      };

      const response = await fetch(`${BASE_URL}/api/admin/menu/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validItem)
      });

      if (response.ok) {
        console.log('✅ Valid menu item creation: PASSED');
      } else {
        const error = await response.text();
        console.log('❌ Valid menu item creation: FAILED -', error);
      }
    } else {
      console.log('⚠️ No categories found for menu item test');
    }
  } catch (error) {
    console.log('❌ Valid menu item creation: ERROR -', error.message);
  }

  // Test 4: Invalid menu item creation (negative price)
  console.log('\n4️⃣ Testing invalid menu item creation (negative price)...');
  try {
    const categoriesResponse = await fetch(`${BASE_URL}/api/admin/menu/categories`);
    const categories = await categoriesResponse.json();
    
    if (categories && categories.length > 0) {
      const invalidItem = {
        name: 'Test Item ' + Date.now(),
        description: 'A test menu item',
        price: -5.99, // Invalid negative price
        categoryId: categories[0].id,
        isActive: true,
        sortOrder: 1
      };

      const response = await fetch(`${BASE_URL}/api/admin/menu/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidItem)
      });

      if (!response.ok) {
        console.log('✅ Invalid menu item validation: PASSED (correctly rejected)');
      } else {
        console.log('❌ Invalid menu item validation: FAILED (should have been rejected)');
      }
    } else {
      console.log('⚠️ No categories found for invalid menu item test');
    }
  } catch (error) {
    console.log('❌ Invalid menu item validation: ERROR -', error.message);
  }

  console.log('\n🏁 Menu validation tests completed!');
}

// Run the tests
testMenuValidation().catch(console.error);
