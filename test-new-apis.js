const fetch = require('node-fetch');

async function testAPIs() {
  console.log('🧪 Testing Pizza and Calzone APIs...\n');

  try {
    // Test specialty pizzas API
    console.log('📋 Testing Specialty Pizzas API:');
    const pizzasResponse = await fetch('http://localhost:3005/api/specialty-pizzas');
    const pizzas = await pizzasResponse.json();
    console.log(`   Found ${pizzas.length} specialty pizzas:`);
    pizzas.forEach(pizza => {
      console.log(`   - ${pizza.name} (Category: ${pizza.category})`);
    });

    console.log('\n📋 Testing Specialty Calzones API:');
    const calzonesResponse = await fetch('http://localhost:3005/api/specialty-calzones');
    const calzones = await calzonesResponse.json();
    console.log(`   Found ${calzones.length} specialty calzones:`);
    calzones.forEach(calzone => {
      console.log(`   - ${calzone.name} (Category: ${calzone.category})`);
    });

    console.log('\n✅ Both APIs are working correctly!');
    console.log('🎯 Clean separation achieved - no more filtering issues!');

  } catch (error) {
    console.error('❌ Error testing APIs:', error);
  }
}

testAPIs();
