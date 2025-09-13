// Analyze which categories have menu items vs empty categories

const https = require('https');

function fetchCategories() {
  return new Promise((resolve, reject) => {
    const url = 'http://91.99.58.154:3000/api/menu/categories';
    const req = require('http').get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on('error', reject);
  });
}

async function analyzeCategories() {
  try {
    console.log('🔍 Analyzing menu categories...\n');

    const response = await fetchCategories();
    const categories = response.data;

    const withItems = [];
    const withoutItems = [];
    const withSubcategoryItems = [];

    categories.forEach(cat => {
      const mainItemCount = cat._count?.menuItems || 0;
      const subcategoryItemCount = (cat.subcategories || [])
        .reduce((sum, sub) => sum + (sub._count?.menuItems || 0), 0);

      if (mainItemCount > 0) {
        withItems.push({
          name: cat.name,
          slug: cat.slug,
          count: mainItemCount
        });
      } else if (subcategoryItemCount > 0) {
        withSubcategoryItems.push({
          name: cat.name,
          slug: cat.slug,
          subcategoryCount: subcategoryItemCount,
          subcategories: cat.subcategories.filter(sub => (sub._count?.menuItems || 0) > 0)
        });
      } else {
        withoutItems.push({
          name: cat.name,
          slug: cat.slug
        });
      }
    });

    console.log(`📊 CATEGORY ANALYSIS:`);
    console.log(`Total categories: ${categories.length}`);
    console.log(`Categories with direct menu items: ${withItems.length}`);
    console.log(`Categories with subcategory items: ${withSubcategoryItems.length}`);
    console.log(`Empty categories: ${withoutItems.length}`);
    console.log('');

    console.log('✅ CATEGORIES WITH MENU ITEMS:');
    withItems.forEach(cat => {
      console.log(`   • ${cat.name} (${cat.count} items)`);
    });

    console.log('\n📂 CATEGORIES WITH SUBCATEGORY ITEMS:');
    withSubcategoryItems.forEach(cat => {
      console.log(`   • ${cat.name} (${cat.subcategoryCount} items in subcategories)`);
      cat.subcategories.forEach(sub => {
        console.log(`     - ${sub.name}: ${sub._count.menuItems} items`);
      });
    });

    console.log('\n❌ EMPTY CATEGORIES (0 items):');
    withoutItems.forEach(cat => {
      console.log(`   • ${cat.name} (${cat.slug})`);
    });

    console.log('\n🎯 LIKELY VISIBLE TO USER:');
    console.log(`Categories that should show up: ${withItems.length + withSubcategoryItems.length}`);

    const visibleCategories = [...withItems, ...withSubcategoryItems];
    visibleCategories.forEach(cat => {
      console.log(`   ✓ ${cat.name}`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

analyzeCategories();