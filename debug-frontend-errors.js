const fetch = require('node-fetch');

async function debugFrontendErrors() {
  console.log('🔍 Debugging Frontend Data Loading Issues');
  console.log('==========================================');
  
  const baseUrl = 'http://localhost:3007';
  
  // Test all the endpoints the frontend is likely calling
  const endpoints = [
    '/api/settings',
    '/api/menu-categories', 
    '/api/menu-items',
    '/api/pizza-sizes',
    '/api/pizza-toppings', 
    '/api/specialty-pizzas',
    '/api/specialty-calzones',
    '/api/customization-groups',
    '/api/menu/categories', // Alternative endpoint
    '/api/pizza-data'
  ];
  
  console.log('\n📊 API Endpoint Status Check:');
  console.log('==============================');
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`);
      
      if (response.status === 200) {
        const data = await response.json();
        
        // Check data structure
        if (Array.isArray(data)) {
          console.log(`✅ ${endpoint} - ${data.length} items`);
          if (data.length === 0) {
            console.log(`   ⚠️  WARNING: Array is empty!`);
          }
        } else if (data && typeof data === 'object') {
          if (data.settings) {
            console.log(`✅ ${endpoint} - Settings object`);
            console.log(`   🏢 Business: ${data.settings.business_name || 'NOT SET'}`);
          } else if (data.categories) {
            console.log(`✅ ${endpoint} - ${data.categories.length} categories`);
          } else if (data.sizes || data.toppings) {
            console.log(`✅ ${endpoint} - Pizza data object`);
            if (data.sizes) console.log(`   🍕 Sizes: ${data.sizes.length}`);
            if (data.toppings) console.log(`   🧀 Toppings: ${data.toppings.length}`);
          } else {
            const keys = Object.keys(data).slice(0, 3);
            console.log(`✅ ${endpoint} - Object with keys: ${keys.join(', ')}`);
          }
        } else {
          console.log(`✅ ${endpoint} - ${typeof data}`);
        }
      } else {
        console.log(`❌ ${endpoint} - ${response.status} ${response.statusText}`);
      }
      
    } catch (error) {
      console.log(`💥 ${endpoint} - ERROR: ${error.message}`);
    }
  }
  
  console.log('\n🔍 Potential Frontend Issues:');
  console.log('=============================');
  
  // Check for data structure mismatches
  try {
    const settingsResponse = await fetch(`${baseUrl}/api/settings`);
    const settings = await settingsResponse.json();
    
    if (settings.settings && settings.settings.business_name === 'Restaurant') {
      console.log('❌ ISSUE: Still getting fallback "Restaurant" name instead of real data');
    } else if (settings.settings && settings.settings.business_name) {
      console.log(`✅ Business name correct: ${settings.settings.business_name}`);
    }
    
    // Check menu data
    const menuResponse = await fetch(`${baseUrl}/api/menu-categories`);
    const menuData = await menuResponse.json();
    
    if (Array.isArray(menuData) && menuData.length > 0) {
      console.log(`✅ Menu categories loading: ${menuData.length} categories`);
      
      // Check if categories have items
      const categoriesWithItems = menuData.filter(cat => cat._count && cat._count.menuItems > 0);
      console.log(`📊 Categories with items: ${categoriesWithItems.length}/${menuData.length}`);
      
      if (categoriesWithItems.length === 0) {
        console.log('⚠️  WARNING: No categories have menu items!');
      }
    } else {
      console.log('❌ ISSUE: Menu categories not loading properly');
    }
    
  } catch (error) {
    console.log(`💥 Error checking data: ${error.message}`);
  }
  
  console.log('\n💡 Frontend Debugging Steps:');
  console.log('============================');
  console.log('1. Open browser developer tools (F12)');
  console.log('2. Go to Console tab');
  console.log('3. Look for red error messages');
  console.log('4. Go to Network tab');
  console.log('5. Refresh page and check which API calls are failing');
  console.log('6. Check if data is being received but not displayed');
  console.log('');
  console.log('Common issues:');
  console.log('- JavaScript errors preventing data display');
  console.log('- Wrong data format expected by components');
  console.log('- Cached old JavaScript code');
  console.log('- Missing error handling in components');
  
}

// Run the debug
if (require.main === module) {
  debugFrontendErrors().catch(console.error);
}

module.exports = { debugFrontendErrors };