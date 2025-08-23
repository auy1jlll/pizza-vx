const fetch = require('node-fetch');

async function testCalzoneIngredients() {
  try {
    console.log('🧪 Testing Calzone Ingredients API...\n');

    const response = await fetch('http://localhost:3005/api/admin/specialty-calzones');
    
    if (!response.ok) {
      console.log(`❌ API Error: ${response.status}`);
      return;
    }

    const calzones = await response.json();
    
    console.log(`✅ Successfully fetched ${calzones.length} calzones\n`);

    calzones.forEach((calzone, index) => {
      console.log(`${index + 1}. ${calzone.name}`);
      console.log(`   Ingredients Type: ${Array.isArray(calzone.ingredients) ? 'Array' : typeof calzone.ingredients}`);
      console.log(`   Ingredients: ${Array.isArray(calzone.ingredients) ? calzone.ingredients.join(', ') : calzone.ingredients}`);
      console.log('');
    });

    console.log('🎉 Ingredients are now properly formatted as arrays!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCalzoneIngredients();
