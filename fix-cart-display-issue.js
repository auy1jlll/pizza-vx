// Script to check and clean up cart data that's causing display issues
console.log('🔍 CART DATA INVESTIGATION');
console.log('========================');

// This script needs to be run in the browser console to access localStorage

const script = `
// Clear the cart to reset the issue
console.log('📋 Current menuCart data:');
const currentCart = localStorage.getItem('menuCart');
if (currentCart) {
  try {
    const cartData = JSON.parse(currentCart);
    console.log('Cart items:', cartData);
    console.log('Number of items:', cartData.length);
    
    cartData.forEach((item, index) => {
      console.log(\`Item \${index + 1}:\`);
      console.log('  ID:', item.id);
      console.log('  Name:', item.name);
      console.log('  MenuItemName:', item.menuItemName);
      console.log('  Type:', item.type);
      console.log('  MenuItemId:', item.menuItemId);
      console.log('  Category:', item.category);
      console.log('  CategorySlug:', item.categorySlug);
      console.log('  Customizations:', item.customizations);
    });
  } catch (e) {
    console.error('Error parsing cart data:', e);
  }
} else {
  console.log('No cart data found');
}

// Clear the cart to fix the issue
console.log('\\n🧹 Clearing cart data...');
localStorage.removeItem('menuCart');
console.log('✅ Cart cleared. Please reload the page and add items again.');
`;

console.log('🚨 TO FIX THE CART DISPLAY ISSUE:');
console.log('1. Open browser developer tools (F12)');
console.log('2. Go to the Console tab');
console.log('3. Copy and paste this script:');
console.log('');
console.log(script);
console.log('');
console.log('4. Press Enter to run it');
console.log('5. Reload the page');
console.log('6. Add items to cart again - they should display correctly now');

console.log('\n💡 This will clear the corrupted cart data and allow fresh, correctly formatted items to be added.');
