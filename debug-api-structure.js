const fetch = require('node-fetch');

async function debugAPIResponse() {
  try {
    console.log('🔍 Debugging API response structure...\n');
    
    const response = await fetch('http://localhost:3005/api/menu/categories');
    const result = await response.json();
    
    if (result.success && Array.isArray(result.data)) {
      console.log('📊 DETAILED CATEGORY ANALYSIS:\n');
      
      // Find categories that might be subcategories
      let parentCategories = [];
      let subcategories = [];
      
      result.data.forEach(category => {
        console.log(`\n🔍 ${category.name}:`);
        console.log(`   ID: ${category.id}`);
        console.log(`   Slug: ${category.slug}`);
        console.log(`   Items: ${category._count?.menuItems || 0}`);
        console.log(`   Has subcategories field: ${'subcategories' in category}`);
        console.log(`   Subcategories count: ${category.subcategories?.length || 0}`);
        
        // Check if it has parentCategoryId (would indicate it's a subcategory)
        if ('parentCategoryId' in category) {
          console.log(`   ParentCategoryId: ${category.parentCategoryId}`);
          if (category.parentCategoryId) {
            subcategories.push(category);
            console.log(`   🔸 SUBCATEGORY`);
          } else {
            parentCategories.push(category);
            console.log(`   🔹 PARENT CATEGORY (null parentCategoryId)`);
          }
        } else {
          // If no parentCategoryId field, determine based on subcategories
          if (category.subcategories && category.subcategories.length > 0) {
            parentCategories.push(category);
            console.log(`   🔹 PARENT CATEGORY (has subcategories)`);
          } else {
            // Could be either a standalone category or a subcategory
            // Check if we can find it as a subcategory of another category
            const isFoundAsSubcategory = result.data.some(otherCat => 
              otherCat.subcategories && otherCat.subcategories.some(sub => sub.id === category.id)
            );
            
            if (isFoundAsSubcategory) {
              subcategories.push(category);
              console.log(`   🔸 SUBCATEGORY (found in another category's subcategories)`);
            } else {
              parentCategories.push(category);
              console.log(`   🔹 STANDALONE CATEGORY`);
            }
          }
        }
      });
      
      console.log(`\n📊 SUMMARY:`);
      console.log(`Total categories returned: ${result.data.length}`);
      console.log(`Parent categories: ${parentCategories.length}`);
      console.log(`Subcategories: ${subcategories.length}`);
      
      console.log(`\n🔹 PARENT CATEGORIES:`);
      parentCategories.forEach(cat => {
        console.log(`   • ${cat.name} (${cat.subcategories?.length || 0} subcategories, ${cat._count?.menuItems || 0} items)`);
      });
      
      console.log(`\n🔸 SUBCATEGORIES:`);
      subcategories.forEach(cat => {
        console.log(`   • ${cat.name} (${cat._count?.menuItems || 0} items)`);
      });
      
      // Check specifically for Chickenz
      const chickenz = result.data.find(cat => cat.name === 'Chickenz');
      if (chickenz) {
        console.log(`\n🐔 CHICKENZ DETAILS:`);
        console.log(JSON.stringify(chickenz, null, 2));
      }
      
    } else {
      console.log('❌ API returned invalid data');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugAPIResponse();
