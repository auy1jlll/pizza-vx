#!/usr/bin/env node

// Direct localStorage examination for cart debugging
console.log(`
=== CART LOCALSTORAGE DEBUG ===

Copy and paste this into your browser console (F12) while on any page of the app:

console.log('=== MENU CART DEBUG ===');
const menuCart = localStorage.getItem('menuCart');
console.log('Raw menuCart:', menuCart);

if (menuCart) {
  try {
    const parsed = JSON.parse(menuCart);
    console.log('Parsed menuCart items:');
    parsed.forEach((item, i) => {
      console.log(\`Item \${i + 1}:\`, {
        id: item.id,
        name: item.name,
        menuItemName: item.menuItemName,
        type: item.type,
        menuItemId: item.menuItemId,
        category: item.category,
        categorySlug: item.categorySlug,
        price: item.price,
        totalPrice: item.totalPrice,
        quantity: item.quantity,
        customizations: item.customizations,
        addedAt: item.addedAt
      });
    });
  } catch (e) {
    console.error('Error parsing menuCart:', e);
  }
}

console.log('\\n=== PIZZA CART DEBUG ===');
const pizzaCart = localStorage.getItem('cartItems');
console.log('Raw pizzaCart:', pizzaCart);

if (pizzaCart) {
  try {
    const parsed = JSON.parse(pizzaCart);
    console.log('Parsed pizza cart items:');
    parsed.forEach((item, i) => {
      console.log(\`Pizza \${i + 1}:\`, {
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
    console.error('Error parsing pizzaCart:', e);
  }
}

// Quick fix to clear corrupted data:
// localStorage.removeItem('menuCart');
// localStorage.removeItem('cartItems');
// window.location.reload();

`);
