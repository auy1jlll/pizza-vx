const { PrismaClient } = require('@prisma/client');

async function testKitchenAPI() {
  try {
    console.log('Testing Kitchen Orders API...\n');
    
    // Test the API endpoint
    const response = await fetch('http://localhost:3005/api/admin/kitchen/orders', {
      headers: {
        'Content-Type': 'application/json',
        // Add any authentication headers if needed
      }
    });
    
    console.log(`API Response Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`Number of orders returned: ${Array.isArray(data) ? data.length : 'Not an array'}`);
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('\nFirst order sample:');
        const firstOrder = data[0];
        console.log(`Order Number: ${firstOrder.orderNumber}`);
        console.log(`Customer: ${firstOrder.customerName}`);
        console.log(`Status: ${firstOrder.status}`);
        console.log(`Items: ${firstOrder.items ? firstOrder.items.length : 0}`);
        
        if (firstOrder.items && firstOrder.items.length > 0) {
          const firstItem = firstOrder.items[0];
          console.log('\nFirst item sample:');
          console.log(`Quantity: ${firstItem.quantity}`);
          console.log(`Total Price: $${firstItem.totalPrice}`);
          console.log(`Pizza Size: ${firstItem.pizzaSize ? firstItem.pizzaSize.name : 'NULL'}`);
          console.log(`Pizza Crust: ${firstItem.pizzaCrust ? firstItem.pizzaCrust.name : 'NULL'}`);
          console.log(`Pizza Sauce: ${firstItem.pizzaSauce ? firstItem.pizzaSauce.name : 'NULL'}`);
          console.log(`Notes: ${firstItem.notes ? firstItem.notes.substring(0, 100) + '...' : 'None'}`);
          console.log(`Toppings: ${firstItem.toppings ? firstItem.toppings.length : 0}`);
        }
      }
    } else {
      const errorText = await response.text();
      console.log(`API Error: ${errorText}`);
    }
    
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testKitchenAPI();
