// Fix existing cart items that have menuItemName instead of name

console.log('🔧 Fixing cart items with incorrect field names...');

// This script can be run in browser console to fix existing cart data
function fixCartItemNames() {
  try {
    const menuCart = localStorage.getItem('menuCart');
    if (!menuCart) {
      console.log('📝 No menu cart found in localStorage');
      return;
    }

    const cartItems = JSON.parse(menuCart);
    let fixedCount = 0;

    const fixedItems = cartItems.map(item => {
      if (item.menuItemName && !item.name) {
        console.log(`🔧 Fixing item: ${item.menuItemName} -> name field`);
        fixedCount++;
        return {
          ...item,
          name: item.menuItemName // Copy menuItemName to name
          // Keep menuItemName for backward compatibility if needed
        };
      }
      return item;
    });

    if (fixedCount > 0) {
      localStorage.setItem('menuCart', JSON.stringify(fixedItems));
      console.log(`✅ Fixed ${fixedCount} cart items`);
      
      // Trigger cart update event
      window.dispatchEvent(new Event('menuCartUpdated'));
      
      console.log('🔄 Cart updated, please refresh the page to see changes');
    } else {
      console.log('✅ All cart items already have correct field names');
    }

    // Show current cart state
    console.log('📊 Current cart items:');
    fixedItems.forEach(item => {
      console.log(`  - ${item.name || 'UNNAMED'} ($${item.price || item.totalPrice || 0})`);
    });

  } catch (error) {
    console.error('❌ Error fixing cart items:', error);
  }
}

// Run the fix
fixCartItemNames();

console.log('\n💡 To run this fix manually in browser console:');
console.log('1. Open browser console (F12)');
console.log('2. Paste and run this function:');
console.log(`
function fixCartItemNames() {
  const menuCart = localStorage.getItem('menuCart');
  if (!menuCart) return;
  const cartItems = JSON.parse(menuCart);
  const fixedItems = cartItems.map(item => {
    if (item.menuItemName && !item.name) {
      return { ...item, name: item.menuItemName };
    }
    return item;
  });
  localStorage.setItem('menuCart', JSON.stringify(fixedItems));
  window.dispatchEvent(new Event('menuCartUpdated'));
  location.reload();
}
fixCartItemNames();
`);
