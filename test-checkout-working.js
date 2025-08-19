const fetch = require('node-fetch');

async function testCheckout() {
  console.log('🧪 Testing Checkout - Pizza Order');
  
  const orderData = {
    "items": [
      {
        "type": "pizza",
        "quantity": 1,
        "basePrice": 15.99,
        "totalPrice": 17.99,
        "size": {
          "id": "2", 
          "name": "Medium", 
          "diameter": "12\"",
          "basePrice": 15.99,
          "isActive": true,
          "sortOrder": 2
        },
        "crust": {
          "id": "1", 
          "name": "Thin Crust", 
          "priceModifier": 0,
          "isActive": true,
          "sortOrder": 1
        },
        "sauce": {
          "id": "1", 
          "name": "Marinara", 
          "spiceLevel": 1,
          "priceModifier": 0,
          "isActive": true,
          "sortOrder": 1
        },
        "toppings": [
          {"id": "1", "name": "Pepperoni", "price": 2.00, "quantity": 1, "section": "WHOLE", "intensity": "REGULAR"}
        ]
      }
    ],
    "customer": {
      "name": "Test Customer",
      "email": "test@example.com", 
      "phone": "(555) 123-4567"
    },
    "orderType": "PICKUP",
    "paymentMethod": "CASH",
    "subtotal": 17.99,
    "deliveryFee": 0,
    "tax": 1.44,
    "total": 19.43,
    "notes": "Test order"
  };

  try {
    const response = await fetch('http://localhost:3005/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();
    
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      console.log('✅ Checkout Success!');
      console.log('Order Number:', result.data?.orderNumber);
      console.log('Estimated Time:', result.data?.estimatedTime);
      console.log('Message:', result.data?.message);
    } else {
      console.log('❌ Checkout Error:', result);
    }
    
  } catch (error) {
    console.error('❌ Request Error:', error.message);
  }
}

testCheckout();
