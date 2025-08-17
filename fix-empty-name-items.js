#!/usr/bin/env node

/**
 * Fix script to clean up cart items with empty names
 * Can be run in browser console to fix the immediate issue
 */

console.log('🔧 Cart Empty Name Fix Script\n');

const browserFixScript = `
console.log('🔧 FIXING CART ITEMS WITH EMPTY NAMES');
console.log('=====================================');

// Get current cart data
const menuCart = JSON.parse(localStorage.getItem('menuCart') || '[]');
const originalCount = menuCart.length;

console.log(\`Original cart items: \${originalCount}\`);

// Fix items with empty names
const fixedCart = menuCart.map((item, index) => {
  if (!item.name || item.name.trim() === '') {
    console.log(\`  Fixing item \${index + 1}: adding placeholder name\`);
    return {
      ...item,
      name: item.category ? \`\${item.category} Item\` : 'Unnamed Item'
    };
  }
  return item;
});

// Save fixed cart
localStorage.setItem('menuCart', JSON.stringify(fixedCart));

// Trigger cart update event
window.dispatchEvent(new Event('menuCartUpdated'));

console.log(\`✅ Cart fixed! \${fixedCart.length} items processed\`);
console.log('The page should automatically refresh the cart display');

// Show fixed items
const fixedItems = fixedCart.filter((item, index) => {
  const original = menuCart[index];
  return original && (!original.name || original.name.trim() === '') && item.name;
});

if (fixedItems.length > 0) {
  console.log(\`\\n📝 Fixed items:\`);
  fixedItems.forEach(item => {
    console.log(\`  - \${item.name} (\${item.category || 'no category'})\`);
  });
} else {
  console.log('\\n✅ No items needed fixing');
}
`;

console.log('🚀 QUICK FIX:');
console.log('Copy and paste this into your browser console to fix empty names:\n');
console.log(browserFixScript);

console.log('\n📋 WHAT THIS DOES:');
console.log('1. Scans all menu cart items for empty names');
console.log('2. Replaces empty names with category-based names or "Unnamed Item"');
console.log('3. Saves the fixed cart back to localStorage');
console.log('4. Triggers cart update event to refresh the display');

console.log('\n⚠️  NOTE:');
console.log('This is a temporary fix. The root cause should be identified');
console.log('to prevent future empty name items from being created.');
