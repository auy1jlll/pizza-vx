const { z } = require('zod');

// Test data for menu item validation
const testMenuItemOrder = {
  orderType: 'pickup',
  customer: {
    name: 'John Doe',
    phone: '555-1234',
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
        },
        {
          optionId: 'opt2', 
          name: 'Extra Salami',
          quantity: 1,
          priceModifier: 2.00
        }
      ]
    }
  ],
  subtotal: 10.99,
  deliveryFee: 0,
  tax: 0.88,
  total: 11.87
};

// Test data for pizza item validation  
const testPizzaOrder = {
  orderType: 'pickup',
  customer: {
    name: 'Jane Doe',
    phone: '555-5678',
    email: 'jane@example.com'
  },
  items: [
    {
      type: 'pizza',
      sizeId: 'size1',
      crustId: 'crust1',
      sauceId: 'sauce1',
      quantity: 1,
      basePrice: 12.99,
      totalPrice: 16.49,
      size: {
        id: 'size1',
        name: 'Large',
        diameter: '16 inches',
        basePrice: 12.99,
        isActive: true,
        sortOrder: 3
      },
      crust: {
        id: 'crust1',
        name: 'Regular',
        priceModifier: 0,
        isActive: true,
        sortOrder: 1
      },
      sauce: {
        id: 'sauce1',
        name: 'Marinara',
        spiceLevel: 1,
        priceModifier: 0,
        isActive: true,
        sortOrder: 1
      },
      toppings: [
        {
          id: 'topping1',
          name: 'Pepperoni',
          price: 1.50,
          quantity: 1,
          section: 'WHOLE'
        }
      ]
    }
  ],
  subtotal: 16.49,
  deliveryFee: 0,
  tax: 1.32,
  total: 17.81
};

console.log('Testing validation schemas...\n');

// Import and test the schemas
try {
  const schemas = require('./src/lib/schemas.ts');
  console.log('❌ Cannot test TypeScript schemas directly with Node.js');
  console.log('Need to test through the API endpoint instead.');
} catch (error) {
  console.log('❌ Error loading schemas:', error.message);
  console.log('This is expected - we need to test through the API endpoint.');
}

console.log('\n✅ Test data structures prepared');
console.log('📝 Menu item test data:', JSON.stringify(testMenuItemOrder.items[0], null, 2));
console.log('📝 Pizza item test data:', JSON.stringify(testPizzaOrder.items[0], null, 2));
