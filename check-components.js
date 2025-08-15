// Check what pizza components exist in the database
console.log('Checking available pizza components...');

async function checkComponents() {
  try {
    console.log('🔍 Checking pizza sizes...');
    const sizesResponse = await fetch('http://localhost:3000/api/pizza-builder/sizes');
    if (sizesResponse.ok) {
      const sizes = await sizesResponse.json();
      console.log('📏 Available sizes:', JSON.stringify(sizes, null, 2));
    } else {
      console.log('❌ Failed to fetch sizes:', sizesResponse.status);
    }

    console.log('🔍 Checking pizza crusts...');
    const crustsResponse = await fetch('http://localhost:3000/api/pizza-builder/crusts');
    if (crustsResponse.ok) {
      const crusts = await crustsResponse.json();
      console.log('🍞 Available crusts:', JSON.stringify(crusts, null, 2));
    } else {
      console.log('❌ Failed to fetch crusts:', crustsResponse.status);
    }

    console.log('🔍 Checking pizza sauces...');
    const saucesResponse = await fetch('http://localhost:3000/api/pizza-builder/sauces');
    if (saucesResponse.ok) {
      const sauces = await saucesResponse.json();
      console.log('🍅 Available sauces:', JSON.stringify(sauces, null, 2));
    } else {
      console.log('❌ Failed to fetch sauces:', saucesResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Error checking components:', error.message);
  }
}

checkComponents();
