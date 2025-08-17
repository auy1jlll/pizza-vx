// Script to debug and fix the duplicate cart system issue
console.log('🔍 Investigating duplicate cart systems...\n');

// Check what's in both localStorage cart systems
console.log('1️⃣ Checking CartContext system (cartItems):');
try {
  const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
  console.log('   Items found:', cartItems.length);
  if (cartItems.length > 0) {
    console.log('   Sample item:', cartItems[0]);
  }
} catch (e) {
  console.log('   No valid cartItems data');
}

console.log('\n2️⃣ Checking Menu cart system (menuCart):');
try {
  const menuCart = JSON.parse(localStorage.getItem('menuCart') || '[]');
  console.log('   Items found:', menuCart.length);
  if (menuCart.length > 0) {
    console.log('   Sample item:', menuCart[0]);
  }
} catch (e) {
  console.log('   No valid menuCart data');
}

console.log('\n3️⃣ Other cart-related localStorage keys:');
const cartKeys = Object.keys(localStorage).filter(key => 
  key.toLowerCase().includes('cart')
);
cartKeys.forEach(key => {
  console.log(`   ${key}:`, localStorage.getItem(key)?.length || 0, 'characters');
});

console.log('\n🧹 Clearing all cart data to reset state...');
localStorage.removeItem('cartItems');
localStorage.removeItem('menuCart'); 
localStorage.removeItem('cart');

console.log('✅ All cart data cleared. Refresh the page to see clean state.');
