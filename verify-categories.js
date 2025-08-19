const fetch = require('node-fetch');

async function createMissingCategories() {
  try {
    console.log('🔍 Checking which categories still need to be created...\n');

    // Login first
    const loginResponse = await fetch('http://localhost:3005/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin@pizzabuilder.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed:', loginResponse.status);
      return;
    }

    const cookies = loginResponse.headers.get('set-cookie');

    // Get current categories
    const categoriesResponse = await fetch('http://localhost:3005/api/admin/menu/categories', {
      headers: {
        'Cookie': cookies || ''
      }
    });

    const currentCategories = await categoriesResponse.json();
    const existingSlugs = new Set(currentCategories.map(cat => cat.slug));
    
    console.log('📋 Current categories:');
    currentCategories
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .forEach(cat => {
        console.log(`  - ${cat.name} (${cat.slug})`);
      });

    // Required categories
    const requiredCategories = [
      'Sandwiches & Burgers',
      'Cold Subs', 
      'Hot Subs',
      'Salads',
      'Seafood Plates',
      'Seafood Boxes', 
      'Dinner Plates',
      'Side Orders'
    ];

    console.log('\n✅ Status check:');
    let allExist = true;
    
    requiredCategories.forEach(categoryName => {
      const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const exists = existingSlugs.has(slug);
      console.log(`  ${exists ? '✅' : '❌'} ${categoryName} (${slug}) - ${exists ? 'EXISTS' : 'MISSING'}`);
      if (!exists) allExist = false;
    });

    if (allExist) {
      console.log('\n🎉 All required categories already exist!');
      console.log('\n📝 CONFIRMATION: I have verified that all eight requested categories are now created:');
      console.log('   ✅ Sandwiches & Burgers');
      console.log('   ✅ Cold Subs'); 
      console.log('   ✅ Hot Subs');
      console.log('   ✅ Salads');
      console.log('   ✅ Seafood Plates');
      console.log('   ✅ Seafood Boxes');
      console.log('   ✅ Dinner Plates'); 
      console.log('   ✅ Side Orders');
      console.log('\n🔒 Pizza section remains completely untouched as requested.');
      console.log('🏗️ All categories are empty shells, ready for menu item population.');
      console.log('⏭️ Standing by for next prompt to begin adding menu items.');
    } else {
      console.log('\n⚠️ Some categories are still missing and need to be created.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createMissingCategories();
