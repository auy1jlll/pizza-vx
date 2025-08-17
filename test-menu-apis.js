const BASE_URL = 'http://localhost:3000/api';

async function testMenuAPIs() {
  console.log('🧪 Testing Menu Management APIs\n');

  try {
    // Test 1: Get Menu Categories
    console.log('1. Testing GET /api/admin/menu/categories');
    const categoriesResponse = await fetch(`${BASE_URL}/admin/menu/categories`);
    const categories = await categoriesResponse.json();
    console.log(`✅ Found ${categories.length} categories`);
    console.log(`   Categories: ${categories.map(c => c.name).join(', ')}\n`);

    // Test 2: Get Menu Stats
    console.log('2. Testing GET /api/admin/menu/stats');
    const statsResponse = await fetch(`${BASE_URL}/admin/menu/stats`);
    const stats = await statsResponse.json();
    console.log('✅ Menu Stats:', {
      categories: stats.totalCategories,
      items: stats.totalMenuItems,
      groups: stats.totalCustomizationGroups,
      options: stats.totalCustomizationOptions
    });
    console.log();

    // Test 3: Get Menu Items
    console.log('3. Testing GET /api/admin/menu/items');
    const itemsResponse = await fetch(`${BASE_URL}/admin/menu/items?limit=5`);
    const itemsData = await itemsResponse.json();
    console.log(`✅ Found ${itemsData.pagination.total} total menu items`);
    console.log(`   Sample items: ${itemsData.items.map(item => `${item.name} ($${item.basePrice})`).join(', ')}\n`);

    // Test 4: Get Customization Groups
    console.log('4. Testing GET /api/admin/menu/customization-groups');
    const groupsResponse = await fetch(`${BASE_URL}/admin/menu/customization-groups`);
    const groups = await groupsResponse.json();
    console.log(`✅ Found ${groups.length} customization groups`);
    console.log(`   Groups: ${groups.map(g => `${g.name} (${g.type})`).join(', ')}\n`);

    // Test 5: Get a specific menu item with details
    if (itemsData.items.length > 0) {
      const firstItem = itemsData.items[0];
      console.log(`5. Testing GET /api/admin/menu/items/${firstItem.id}`);
      const itemDetailResponse = await fetch(`${BASE_URL}/admin/menu/items/${firstItem.id}`);
      const itemDetail = await itemDetailResponse.json();
      console.log(`✅ Item: ${itemDetail.name}`);
      console.log(`   Category: ${itemDetail.category.name}`);
      console.log(`   Customization Groups: ${itemDetail.customizationGroups.length}`);
      console.log();
    }

    console.log('🎉 All API tests completed successfully!');

  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

// Run the tests
testMenuAPIs();
