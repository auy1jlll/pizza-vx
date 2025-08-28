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
    console.log('API Response:');
    console.log(`Found ${data.length} calzones`);
    
    if (data.length > 0) {
      const firstCalzone = data[0];
      console.log('\nFirst calzone:');
      console.log('Name:', firstCalzone.name);
      console.log('Description:', firstCalzone.description);
      console.log('Base Price:', firstCalzone.basePrice);
      console.log('Sizes:');
      
      if (firstCalzone.sizes) {
        firstCalzone.sizes.forEach((size, index) => {
          console.log(`  [${index}] ${size.pizzaSize.name} (${size.pizzaSize.diameter}): $${size.price}`);
        });
      } else {
        console.log('  No sizes found');
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testCalzoneAPI();
