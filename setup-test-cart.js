console.log('🛒 Adding test items to localStorage for checkout testing...');

// Test data - exactly what the user reported
const testCart = {
  pizzaItems: [
    {
      id: 1,
      name: "Small Calzone Pizza",
      price: 21.50,
      size: "Small",
      quantity: 1,
      customizations: [],
      type: "pizza",
      totalPrice: 21.50
    },
    {
      id: 2,
      name: "Small Calzone Pizza", 
      price: 21.50,
      size: "Small",
      quantity: 1,
      customizations: [],
      type: "pizza", 
      totalPrice: 21.50
    }
  ],
  menuItems: []
};

console.log('📦 Cart items to add:', testCart);

// This would set localStorage in a browser environment
console.log('💾 To test in browser, run these commands in browser console:');
console.log(`localStorage.setItem('pizzaItems', '${JSON.stringify(testCart.pizzaItems)}');`);
console.log(`localStorage.setItem('menuItems', '${JSON.stringify(testCart.menuItems)}');`);
console.log('window.location.reload();');

console.log('\n🎯 Expected result after promotion:');
console.log('Original subtotal: $43.00');
console.log('Promotion discount: -$10.75 (50% off cheapest pizza)');
console.log('New subtotal: $32.25');
console.log('Tax (8.25%): ~$2.66');
console.log('Total: ~$34.91');
