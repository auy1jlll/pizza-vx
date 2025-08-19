// Clear cart localStorage to test with fresh data
console.log('🧹 CLEARING CART DATA');
console.log('====================');

console.log('\n🗑️ This script will clear all cart data from localStorage');
console.log('After clearing, you can add fresh items to test the fixes');

console.log('\n🔧 Manual steps to clear cart:');
console.log('1. Open browser DevTools (F12)');
console.log('2. Go to Console tab');
console.log('3. Run: localStorage.removeItem("menuCart")');
console.log('4. Run: localStorage.removeItem("cart")');
console.log('5. Run: window.location.reload()');

console.log('\n✅ After clearing:');
console.log('1. Go to /menu/dinner-plates');
console.log('2. Add BBQ Ribs to cart with customizations');
console.log('3. Check cart page - should show correct name and customizations');
console.log('4. Go to checkout - should show proper display');

console.log('\n🎯 Expected result:');
console.log('- Item name: "BBQ Ribs" (not "Custom Pizza")');
console.log('- Customizations: "Side Choice: Fries", "Size: Regular" (not undefined)');

console.log('\n🚨 If issue persists after clearing:');
console.log('- Check browser console for errors');
console.log('- Verify customization data structure in cart');
console.log('- Check that format-cart API returns proper structure');

console.log('\n📋 CART CLEARING READY');
