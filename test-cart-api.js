// Test cart refresh-prices API
const testCartAPI = async () => {
  try {
    console.log('🧪 Testing cart refresh-prices API...');
    
    const testData = {
      pizzaItems: [],
      menuItems: []
    };
    
    const response = await fetch('http://localhost:3005/api/cart/refresh-prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log('Status:', response.status);
    
    if (!response.ok) {
      console.error('❌ API returned error status:', response.status);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }
    
    const result = await response.json();
    console.log('✅ API response:', result);
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
};

testCartAPI();
