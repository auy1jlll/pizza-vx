#!/usr/bin/env node

/**
 * Debug Checkout Pricing Issues
 * This script checks what's in localStorage and calculates totals
 */

console.log('🔍 Debugging Checkout Pricing Issues\n');

// Since we can't access localStorage from Node.js, let's create a test script
// that can be run in the browser console

const browserDebugScript = `
console.log('🔍 Cart Debug Information');
console.log('========================');

// Check pizza cart
const pizzaCart = JSON.parse(localStorage.getItem('cart') || '[]');
console.log('🍕 Pizza Cart Items:', pizzaCart.length);
pizzaCart.forEach((item, index) => {
  console.log(\`Pizza \${index + 1}:\`, {
    id: item.id,
    quantity: item.quantity,
    basePrice: item.basePrice,
    totalPrice: item.totalPrice,
    size: item.size?.name,
    toppings: item.toppings?.length || 0
  });
});

// Check menu cart
const menuCart = JSON.parse(localStorage.getItem('menuCart') || '[]');
console.log('\\n🍽️ Menu Cart Items:', menuCart.length);
menuCart.forEach((item, index) => {
  console.log(\`Menu \${index + 1}:\`, {
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    finalPrice: item.finalPrice,
    basePrice: item.basePrice,
    customizations: item.customizations?.length || 0
  });
});

// Calculate totals
const pizzaSubtotal = pizzaCart.reduce((total, item) => {
  const itemTotal = item.totalPrice * item.quantity;
  console.log(\`Pizza item total: \${item.totalPrice} x \${item.quantity} = \${itemTotal}\`);
  return total + itemTotal;
}, 0);

const menuSubtotal = menuCart.reduce((total, item) => {
  const price = item.finalPrice || item.price || 0;
  const itemTotal = price * item.quantity;
  console.log(\`Menu item total: \${price} x \${item.quantity} = \${itemTotal}\`);
  return total + itemTotal;
}, 0);

console.log('\\n💰 Totals:');
console.log('Pizza Subtotal:', pizzaSubtotal);
console.log('Menu Subtotal:', menuSubtotal);
console.log('Combined Subtotal:', pizzaSubtotal + menuSubtotal);

// Check for NaN values
if (isNaN(pizzaSubtotal)) console.error('❌ Pizza subtotal is NaN!');
if (isNaN(menuSubtotal)) console.error('❌ Menu subtotal is NaN!');
if (isNaN(pizzaSubtotal + menuSubtotal)) console.error('❌ Combined subtotal is NaN!');

// Check individual item prices
menuCart.forEach((item, index) => {
  if (isNaN(item.price)) console.error(\`❌ Menu item \${index} price is NaN:\`, item);
  if (isNaN(item.finalPrice)) console.error(\`❌ Menu item \${index} finalPrice is NaN:\`, item);
});

pizzaCart.forEach((item, index) => {
  if (isNaN(item.totalPrice)) console.error(\`❌ Pizza item \${index} totalPrice is NaN:\`, item);
  if (isNaN(item.basePrice)) console.error(\`❌ Pizza item \${index} basePrice is NaN:\`, item);
});
`;

console.log('🌐 Browser Debug Script:');
console.log('Copy and paste this into your browser console on the cart/checkout page:\n');
console.log(browserDebugScript);
console.log('\n📝 Instructions:');
console.log('1. Open http://localhost:3000/cart in your browser');
console.log('2. Open Developer Tools (F12)');
console.log('3. Go to Console tab');
console.log('4. Paste the script above and press Enter');
console.log('5. Check the output for NaN values and data issues');
