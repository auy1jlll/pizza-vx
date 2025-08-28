const fetch = require('node-fetch');

async function testCalzoneAPI() {
  try {
    console.log('Testing /api/specialty-calzones endpoint...');
    const response = await fetch('http://localhost:3005/api/specialty-calzones');
    
    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    console.log(`Found ${data.length} calzones`);
    
    if (data.length > 0) {
      const firstCalzone = data[0];
      console.log('\n=== FIRST CALZONE DETAILS ===');
      console.log('Name:', firstCalzone.name);
      console.log('Description:', firstCalzone.description);
      console.log('Base Price:', firstCalzone.basePrice);
      
      if (firstCalzone.sizes && firstCalzone.sizes.length > 0) {
        console.log('\n=== SIZE DETAILS ===');
        firstCalzone.sizes.forEach((size, index) => {
          console.log(`Size ${index + 1}:`);
          console.log(`  ID: ${size.id}`);
          console.log(`  Price: $${size.price}`);
          console.log(`  Pizza Size Name: "${size.pizzaSize.name}"`);
          console.log(`  Pizza Size Diameter: "${size.pizzaSize.diameter}"`);
          console.log('  ---');
        });
      } else {
        console.log('No sizes found');
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testCalzoneAPI();
