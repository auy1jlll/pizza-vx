#!/usr/bin/env node

/**
 * Debug script to identify cart items with empty names
 * This helps identify data inconsistencies in cart storage
 */

console.log('🔍 Debugging Cart Items with Empty Names\n');

const browserDebugScript = `
console.log('🔍 CART EMPTY NAME DEBUG');
console.log('========================');

// Check menu cart for items with empty names
const menuCart = JSON.parse(localStorage.getItem('menuCart') || '[]');
console.log('\\n🍽️ Menu Cart Items:', menuCart.length);

const emptyNameItems = [];
const validItems = [];

menuCart.forEach((item, index) => {
  console.log(\`\\nItem \${index + 1}:\`, {
    id: item.id,
    name: item.name,
    nameType: typeof item.name,
    nameLength: item.name ? item.name.length : 0,
    category: item.category,
    price: item.price,
    totalPrice: item.totalPrice,
    quantity: item.quantity
  });
  
  // Check if name is empty, null, undefined, or just whitespace
  if (!item.name || item.name.trim() === '') {
    console.log(\`  ❌ ITEM \${index + 1} HAS EMPTY NAME!\`);
    emptyNameItems.push({
      index: index + 1,
      item: item
    });
  } else {
    validItems.push(item);
  }
});

console.log(\`\\n📊 SUMMARY:\`);
console.log(\`Valid items: \${validItems.length}\`);
console.log(\`Empty name items: \${emptyNameItems.length}\`);

if (emptyNameItems.length > 0) {
  console.log(\`\\n❌ ITEMS WITH EMPTY NAMES:\`);
  emptyNameItems.forEach(({ index, item }) => {
    console.log(\`  Item \${index}:\`, {
      id: item.id,
      price: item.price,
      category: item.category,
      customizations: item.customizations
    });
  });
  
  console.log(\`\\n🔧 FIX OPTIONS:\`);
  console.log('1. Remove empty name items:');
  console.log('   localStorage.setItem("menuCart", JSON.stringify(validItems));');
  
  console.log('2. Fix empty name items with placeholder:');
  console.log(\`   const fixedItems = menuCart.map(item => ({
     ...item,
     name: item.name || 'Unnamed Item'
   }));
   localStorage.setItem("menuCart", JSON.stringify(fixedItems));\`);
}

// Also check pizza cart
const pizzaCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
console.log(\`\\n🍕 Pizza Cart Items: \${pizzaCart.length}\`);
pizzaCart.forEach((item, index) => {
  if (!item.name && !item.size) {
    console.log(\`  ❌ Pizza item \${index + 1} has no identifiable name or size\`);
  }
});
`;

console.log('📋 INSTRUCTIONS:');
console.log('1. Open your browser and go to the cart page');
console.log('2. Open Developer Tools (F12) -> Console');
console.log('3. Paste the script below and press Enter');
console.log('4. This will identify items with empty names and provide fix options\n');

console.log('🌐 Browser Debug Script:');
console.log('Copy and paste this into your browser console:\n');
console.log(browserDebugScript);

console.log('\n💡 COMMON CAUSES:');
console.log('- Item added to cart before name was properly set');
console.log('- Menu item data corruption during customization');
console.log('- Race condition during cart item creation');
console.log('- Legacy cart data from old app version');

console.log('\n🔧 PREVENTION:');
console.log('- Always validate item.name before adding to cart');
console.log('- Use fallback names during cart item creation');
console.log('- Add validation in cart save functions');
