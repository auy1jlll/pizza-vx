// Test cart API with real pizza data
const testCartAPIWithRealData = async () => {
  try {
    console.log('🍕 Testing cart refresh-prices API with real pizza data...');
    
    const testData = {
      pizzaItems: [{
        id: 'test-pizza-1',
        size: {
          id: 'cm4k0cj8z00008v0kgvdqfkj6',
          name: 'Large',
          basePrice: 14.99
        },
        crust: {
          id: 'cm4k0cj8z00028v0kg8g7hhkk',
          name: 'Thin Crust',
          priceModifier: 0
        },
        sauce: {
          id: 'cm4k0cj8z00048v0kseyq6kkl',
          name: 'Tomato Sauce',
          priceModifier: 0
        },
        toppings: [{
          id: 'cm4k0cj8z00068v0kd8m7llmn',
          name: 'Pepperoni',
          price: 2.50,
          section: 'WHOLE',
          intensity: 'REGULAR',
          quantity: 1
        }],
        quantity: 1,
        specialtyPizzaName: 'Test Specialty Pizza'
      }],
      menuItems: []
    };
    
    console.log('Sending data:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:3005/api/cart/refresh-prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.error('❌ API returned error status:', response.status);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      return;
    }
    
    const result = await response.json();
    console.log('✅ API response:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
    console.error('Error stack:', error.stack);
  }
};

testCartAPIWithRealData();
