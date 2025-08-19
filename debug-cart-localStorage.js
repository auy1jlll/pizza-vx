#!/usr/bin/env node

// Debug script to inspect what's happening with cart localStorage
// This script should be run in browser console to access localStorage

const debugScript = `
// Run this in your browser console to debug cart issues
console.log('=== CART DEBUG INFO ===');

// Check menuCart localStorage
const menuCart = localStorage.getItem('menuCart');
console.log('Raw menuCart localStorage:', menuCart);

if (menuCart) {
  try {
    const parsed = JSON.parse(menuCart);
    console.log('Parsed menuCart items:');
    parsed.forEach((item, index) => {
      console.log(\`Item \${index + 1}:\`, {
        id: item.id,
        name: item.name,
        menuItemName: item.menuItemName,
        type: item.type,
        category: item.category,
        categorySlug: item.categorySlug,
        price: item.price,
        totalPrice: item.totalPrice,
        quantity: item.quantity,
        customizations: item.customizations
      });
    });
  } catch (e) {
    console.error('Error parsing menuCart:', e);
  }
}

// Check pizza cart
const cartItems = localStorage.getItem('cartItems');
console.log('\\nRaw cartItems (pizza) localStorage:', cartItems);

if (cartItems) {
  try {
    const parsed = JSON.parse(cartItems);
    console.log('Parsed pizza cart items:');
    parsed.forEach((item, index) => {
      console.log(\`Pizza \${index + 1}:\`, {
        id: item.id,
        size: item.size?.name,
        crust: item.crust?.name,
        sauce: item.sauce?.name,
        toppings: item.toppings?.map(t => t.name),
        totalPrice: item.totalPrice,
        quantity: item.quantity
      });
    });
  } catch (e) {
    console.error('Error parsing cartItems:', e);
  }
}

console.log('=== END CART DEBUG ===');
`;

console.log('Copy and paste this script into your browser console while on the cart page:');
console.log('');
console.log(debugScript);
