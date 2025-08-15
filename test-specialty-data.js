// Test script to verify specialty pizzas now use real database data
async function testSpecialtyPizzaData() {
  try {
    console.log('🧪 Testing specialty pizza database connectivity...');
    
    // Test 1: Check pizza-data API
    console.log('\n📊 1. Testing /api/pizza-data...');
    const pizzaDataResponse = await fetch('http://localhost:3000/api/pizza-data');
    
    if (pizzaDataResponse.ok) {
      const pizzaData = await pizzaDataResponse.json();
      console.log('✅ Pizza data loaded successfully');
      console.log(`   - Sizes: ${pizzaData.sizes?.length || 0}`);
      console.log(`   - Crusts: ${pizzaData.crusts?.length || 0}`);
      console.log(`   - Sauces: ${pizzaData.sauces?.length || 0}`);
      console.log(`   - Toppings: ${pizzaData.toppings?.length || 0}`);
      
      if (pizzaData.crusts?.length > 0) {
        console.log(`   - First crust: ${pizzaData.crusts[0].name} (ID: ${pizzaData.crusts[0].id})`);
      }
      if (pizzaData.sauces?.length > 0) {
        console.log(`   - First sauce: ${pizzaData.sauces[0].name} (ID: ${pizzaData.sauces[0].id})`);
      }
    } else {
      console.error('❌ Failed to load pizza data:', await pizzaDataResponse.text());
    }
    
    // Test 2: Check specialty pizzas API
    console.log('\n🍕 2. Testing /api/specialty-pizzas...');
    const specialtyResponse = await fetch('http://localhost:3000/api/specialty-pizzas');
    
    if (specialtyResponse.ok) {
      const specialtyPizzas = await specialtyResponse.json();
      console.log('✅ Specialty pizzas loaded successfully');
      console.log(`   - Count: ${specialtyPizzas.length}`);
      
      if (specialtyPizzas.length > 0) {
        const firstPizza = specialtyPizzas[0];
        console.log(`   - First pizza: ${firstPizza.name}`);
        console.log(`   - Has sizes: ${firstPizza.sizes?.length > 0 ? 'Yes' : 'No'}`);
        console.log(`   - Ingredients: ${firstPizza.ingredients}`);
        
        if (firstPizza.sizes?.length > 0) {
          console.log(`   - First size: ${firstPizza.sizes[0].pizzaSize.name} - $${firstPizza.sizes[0].price}`);
        }
      }
    } else {
      console.error('❌ Failed to load specialty pizzas:', await specialtyResponse.text());
    }
    
    console.log('\n🎉 Test completed! Specialty pizzas should now use real database data.');
    
  } catch (error) {
    console.error('❌ Network error:', error);
    console.log('🔧 Make sure the development server is running on localhost:3000');
  }
}

testSpecialtyPizzaData();
