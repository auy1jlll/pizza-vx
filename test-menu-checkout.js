// Test the checkout API with menu item data to see validation errors
const axios = require('axios');

const menuItemCheckoutData = {
  orderType: 'pickup',
  customer: {
    name: 'John Doe',
    phone: '555-1234-5678',
    email: 'john@example.com'
  },
  items: [
    {
      type: 'menu',
      menuItemId: 'cmedtl3tg0034vkugdrg36ekk',
      name: 'Italian Sub',
      category: 'Sandwiches', 
      quantity: 1,
      basePrice: 8.99,
      totalPrice: 10.99,
      customizations: [
        {
          optionId: 'opt1',
          name: 'Extra Mayo',
          quantity: 1,
          priceModifier: 0
        }
      ]
    }
  ],
  subtotal: 10.99,
  deliveryFee: 0,
  tax: 0.88,
  total: 11.87
};

async function testMenuCheckout() {
  console.log('🧪 Testing Menu Item Checkout...\n');
  
  try {
    const response = await axios.post('http://localhost:3005/api/checkout', menuItemCheckoutData, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Success!', response.data);
    
  } catch (error) {
    console.log('❌ Failed');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

testMenuCheckout();
