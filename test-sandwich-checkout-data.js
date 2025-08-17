// Test checkout data structure for sandwich order
const testCheckoutData = {
  orderType: 'PICKUP',
  customer: {
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '555-0123'
  },
  items: [
    {
      id: 'sandwich-test-123',
      type: 'menu',
      menuItemId: 'cmedtl3tg0034vkugdrg36ekk',
      name: 'Italian Sub',
      basePrice: 8.99,
      price: 10.99,
      quantity: 1,
      category: 'Sandwiches',
      customizations: [
        {
          groupName: 'Size',
          optionName: '12"',
          priceModifier: 4.00
        },
        {
          groupName: 'Cheese',
          optionName: 'Provolone',
          priceModifier: 1.25
        }
      ]
    }
  ],
  subtotal: 10.99,
  deliveryFee: 0,
  tax: 0.88,
  total: 11.87
};

console.log('Sample checkout data structure for sandwich:', JSON.stringify(testCheckoutData, null, 2));
