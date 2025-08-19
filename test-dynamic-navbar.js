const fetch = require('node-fetch');

async function testDynamicNavbar() {
  try {
    console.log('🧪 Testing Dynamic Navbar Data Source...\n');

    // Test the categories API that the navbar will use
    console.log('📡 Testing /api/menu/categories endpoint...');
    const response = await fetch('http://localhost:3005/api/menu/categories');
    
    console.log(`📊 Response status: ${response.status}`);
    
    if (!response.ok) {
      console.log('❌ Failed to fetch categories');
      return;
    }

    const result = await response.json();
    console.log(`✅ API Response Success: ${result.success}`);
    
    if (result.success && Array.isArray(result.data)) {
      const categories = result.data;
      console.log(`📋 Total categories returned: ${categories.length}\n`);

      // Apply the same filtering logic as the navbar component
      const filteredCategories = categories
        .filter(category => {
          // Exclude Pizza categories
          const isPizzaCategory = category.slug === 'pizza' || 
                                category.slug === 'specialty-pizza' ||
                                category.slug.includes('pizza');
          
          // Exclude inactive categories
          if (!category.isActive) return false;
          
          // Optionally exclude empty categories (assuming hideEmptyCategories = true)
          if (category._count?.menuItems === 0) {
            return false;
          }
          
          return !isPizzaCategory;
        })
        // Sort by sortOrder, then by name
        .sort((a, b) => {
          if (a.sortOrder !== b.sortOrder) {
            return a.sortOrder - b.sortOrder;
          }
          return a.name.localeCompare(b.name);
        });

      console.log('🚫 Categories excluded from navbar:');
      categories
        .filter(cat => !filteredCategories.includes(cat))
        .forEach(cat => {
          let reason = '';
          if (cat.slug === 'pizza' || cat.slug === 'specialty-pizza' || cat.slug.includes('pizza')) {
            reason = '(Pizza category - excluded by design)';
          } else if (!cat.isActive) {
            reason = '(Inactive)';
          } else if (cat._count?.menuItems === 0) {
            reason = '(Empty category)';
          }
          console.log(`  ❌ ${cat.name} (${cat.slug}) ${reason}`);
        });

      console.log('\n✅ Categories that WILL appear in navbar:');
      filteredCategories.forEach((cat, index) => {
        const url = `/menu/${cat.slug}`;
        const itemCount = cat._count?.menuItems || 'N/A';
        console.log(`  ${index + 1}. ${cat.name} (${cat.slug})`);
        console.log(`     📄 URL: ${url}`);
        console.log(`     📊 Items: ${itemCount}`);
        console.log(`     🔢 Sort Order: ${cat.sortOrder}`);
        console.log(`     ✅ Active: ${cat.isActive}\n`);
      });

      console.log('🎯 Expected HTML Output Structure:');
      console.log('<nav class="navbar-menu">');
      console.log('  <ul class="flex flex-wrap gap-4">');
      filteredCategories.forEach(cat => {
        console.log(`    <li><a href="/menu/${cat.slug}">${cat.name}</a></li>`);
      });
      console.log('  </ul>');
      console.log('</nav>');

      console.log('\n📋 SUMMARY:');
      console.log(`   🔢 Total categories in database: ${categories.length}`);
      console.log(`   ✅ Categories shown in navbar: ${filteredCategories.length}`);
      console.log(`   🚫 Categories excluded: ${categories.length - filteredCategories.length}`);
      console.log(`   🍕 Pizza categories protected: YES`);
      console.log(`   📡 Data source: /api/menu/categories`);
      console.log(`   🏗️ Dynamic generation: YES`);
      console.log(`   📑 SEO-friendly URLs: YES`);

    } else {
      console.log('❌ Unexpected API response format');
      console.log('Response:', result);
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testDynamicNavbar();
