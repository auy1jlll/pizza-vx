const fetch = require('node-fetch');

async function testMenuAPI() {
  console.log('🔍 Testing Menu API for dinner-plates category...\n');
  
  try {
    console.log('1. Testing categories API...');
    const categoriesResponse = await fetch('http://localhost:3005/api/menu/categories');
    const categoriesResult = await categoriesResponse.json();
    
    console.log('Categories Response Status:', categoriesResponse.status);
    console.log('Categories Result:', JSON.stringify(categoriesResult, null, 2));
    
    if (categoriesResult.success && categoriesResult.data) {
      const dinnerCategory = categoriesResult.data.find(cat => cat.slug === 'dinner-plates');
      console.log('\n2. Found dinner-plates category:', dinnerCategory ? 'YES' : 'NO');
      if (dinnerCategory) {
        console.log('Dinner category details:', JSON.stringify(dinnerCategory, null, 2));
      }
    }
    
    console.log('\n3. Testing dinner-plates menu API...');
    const menuResponse = await fetch('http://localhost:3005/api/menu/dinner-plates');
    const menuResult = await menuResponse.json();
    
    console.log('Menu Response Status:', menuResponse.status);
    console.log('Menu Result:', JSON.stringify(menuResult, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing APIs:', error.message);
  }
}

testMenuAPI();
