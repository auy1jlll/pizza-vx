// Test script to add a known Side Orders item to cart and check the name display

console.log('🧪 Testing cart functionality with Side Orders items...');

const testItems = [
  {
    id: `menu-${Date.now()}-test1`,
    type: 'menu',
    menuItemId: 'test-id-1',
    name: 'BBQ Chicken Fingers', // Using correct field name
    basePrice: 11.99,
    price: 11.99,
    totalPrice: 11.99,
    quantity: 1,
    customizations: [],
    categorySlug: 'side-orders',
    addedAt: new Date()
  },
  {
    id: `menu-${Date.now()}-test2`,
    type: 'menu',
    menuItemId: 'test-id-2',
    menuItemName: 'French Fries - Large', // Using old field name to test backward compatibility
    basePrice: 7.00,
    price: 7.00,
    totalPrice: 7.00,
    quantity: 1,
    customizations: [],
    categorySlug: 'side-orders',
    addedAt: new Date()
  }
];

console.log('📝 Test items created:');
testItems.forEach((item, index) => {
  console.log(`${index + 1}. Name field: ${item.name || 'undefined'}`);
  console.log(`   MenuItemName field: ${item.menuItemName || 'undefined'}`);
  console.log(`   Price: $${item.price}`);
  console.log('');
});

console.log('💡 To test in browser:');
console.log('1. Open browser console (F12)');
console.log('2. Run this code:');
console.log(`
// Clear existing cart
localStorage.removeItem('menuCart');

// Add test items
const testItems = ${JSON.stringify(testItems, null, 2)};
localStorage.setItem('menuCart', JSON.stringify(testItems));

// Trigger cart update
window.dispatchEvent(new Event('menuCartUpdated'));

console.log('✅ Test items added to cart');
console.log('Navigate to /cart to see the results');
`);

console.log('3. Navigate to /cart to verify names display correctly');
console.log('4. Expected results:');
console.log('   - BBQ Chicken Fingers should show the name correctly');
console.log('   - French Fries - Large should show the name (from menuItemName fallback)');
