// Test checkout API with menu item using axios
const axios = require('axios');

const testData = {
  orderType: "pickup",
  customer: {
    name: "Test User",
    phone: "555-123-4567",
    email: "test@example.com"
  },
  items: [
    {
      type: "menu",
      menuItemId: "italian-sub",
      name: "Italian Sub",
      category: "Sandwiches",
      quantity: 1,
      basePrice: 12.99,
      totalPrice: 12.99,
      customizations: []
    }
  ],
  subtotal: 12.99,
  deliveryFee: 0,
  tax: 1.04,
  total: 14.03
};

console.log('🧪 Testing checkout API with menu item...');
console.log('📤 Sending data:', JSON.stringify(testData, null, 2));

axios.post('http://localhost:3005/api/checkout', testData, {
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('✅ Success!');
  console.log('📥 Response:', response.data);
})
.catch(error => {
  console.log('❌ Error occurred');
  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Headers:', error.response.headers);
    console.log('Data:', error.response.data);
  } else if (error.request) {
    console.log('Request made but no response received');
    console.log('Request:', error.request);
  } else {
    console.log('Error setting up request:', error.message);
  }
  console.log('Full error:', error);
});
