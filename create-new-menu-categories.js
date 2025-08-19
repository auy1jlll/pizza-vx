const fetch = require('node-fetch');

async function createNewMenuCategories() {
  try {
    console.log('🍽️ Creating new menu categories...\n');

    // Login first
    console.log('🔐 Logging in as admin...');
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

    console.log('✅ Login successful');
    const cookies = loginResponse.headers.get('set-cookie');

    // Get current categories first
    console.log('\n📋 Fetching current categories...');
    const categoriesResponse = await fetch('http://localhost:3005/api/admin/menu/categories', {
      headers: {
        'Cookie': cookies || ''
      }
    });

    if (!categoriesResponse.ok) {
      console.log('❌ Failed to fetch categories:', categoriesResponse.status);
      return;
    }

    const currentCategories = await categoriesResponse.json();
    console.log(`📊 Found ${currentCategories.length} existing categories`);
    
    // Show current categories (especially Pizza to confirm it's untouched)
    console.log('Current categories:');
    currentCategories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug}) - Sort: ${cat.sortOrder}`);
    });

    // Find the highest sort order to continue from there
    const maxSortOrder = Math.max(...currentCategories.map(cat => cat.sortOrder), 0);
    console.log(`\n🔢 Highest sort order: ${maxSortOrder}`);

    // Define the new categories to create
    const newCategories = [
      {
        name: 'Sandwiches & Burgers',
        slug: 'sandwiches-burgers',
        description: 'Delicious sandwiches and burgers made fresh to order',
        sortOrder: maxSortOrder + 1
      },
      {
        name: 'Cold Subs',
        slug: 'cold-subs',
        description: 'Fresh cold submarine sandwiches with premium ingredients',
        sortOrder: maxSortOrder + 2
      },
      {
        name: 'Hot Subs',
        slug: 'hot-subs',
        description: 'Hot submarine sandwiches served fresh and warm',
        sortOrder: maxSortOrder + 3
      },
      {
        name: 'Salads',
        slug: 'salads',
        description: 'Fresh crisp salads with quality ingredients and dressings',
        sortOrder: maxSortOrder + 4
      },
      {
        name: 'Seafood Plates',
        slug: 'seafood-plates',
        description: 'Fresh seafood platters and entrees',
        sortOrder: maxSortOrder + 5
      },
      {
        name: 'Seafood Boxes',
        slug: 'seafood-boxes',
        description: 'Seafood combination boxes and value meals',
        sortOrder: maxSortOrder + 6
      },
      {
        name: 'Dinner Plates',
        slug: 'dinner-plates',
        description: 'Complete dinner platters and entrees',
        sortOrder: maxSortOrder + 7
      },
      {
        name: 'Side Orders',
        slug: 'side-orders',
        description: 'Sides, appetizers, and extras to complement your meal',
        sortOrder: maxSortOrder + 8
      }
    ];

    console.log('\n🆕 Creating new categories...\n');

    // Create each category
    let successCount = 0;
    for (const category of newCategories) {
      console.log(`📝 Creating: ${category.name}...`);
      
      const createResponse = await fetch('http://localhost:3005/api/admin/menu/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies || ''
        },
        body: JSON.stringify({
          ...category,
          isActive: true
        })
      });

      if (createResponse.ok) {
        const result = await createResponse.json();
        console.log(`✅ Created: ${result.data.name} (ID: ${result.data.id})`);
        successCount++;
      } else {
        const error = await createResponse.json();
        console.log(`❌ Failed to create ${category.name}:`, error.error);
      }
    }

    console.log(`\n🎉 Successfully created ${successCount} out of ${newCategories.length} categories!`);

    // Verify by fetching categories again
    console.log('\n🔍 Verifying new categories...');
    const verifyResponse = await fetch('http://localhost:3005/api/admin/menu/categories', {
      headers: {
        'Cookie': cookies || ''
      }
    });

    if (verifyResponse.ok) {
      const allCategories = await verifyResponse.json();
      console.log(`\n📋 Total categories now: ${allCategories.length}`);
      console.log('All categories:');
      allCategories
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .forEach(cat => {
          const isNew = newCategories.some(newCat => newCat.slug === cat.slug);
          console.log(`  ${isNew ? '🆕' : '📁'} ${cat.name} (${cat.slug}) - Active: ${cat.isActive}`);
        });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createNewMenuCategories();
