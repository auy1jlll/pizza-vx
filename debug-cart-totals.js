// Debug script to check cart data and totals
console.log('🔍 CART DEBUG - Checking cart data and totals');

// Check localStorage data
console.log('\n📦 RAW CART DATA:');
const pizzaCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
const menuCart = JSON.parse(localStorage.getItem('menuCart') || '[]');

console.log('Pizza cart items:', pizzaCart.length);
console.log('Menu cart items:', menuCart.length);

if (pizzaCart.length > 0) {
  console.log('\n🍕 PIZZA ITEMS:');
  pizzaCart.forEach((item, index) => {
    console.log(`${index + 1}. ${item.name || 'Unnamed Pizza'}`);
    console.log('   - Price:', item.price || item.totalPrice || 'NO PRICE');
    console.log('   - Quantity:', item.quantity || 'NO QUANTITY');
    console.log('   - ID:', item.id || 'NO ID');
  });
}

if (menuCart.length > 0) {
  console.log('\n🥪 MENU ITEMS:');
  menuCart.forEach((item, index) => {
    console.log(`${index + 1}. ${item.name || 'Unnamed Item'}`);
    console.log('   - Price:', item.price || item.totalPrice || item.basePrice || 'NO PRICE');
    console.log('   - Quantity:', item.quantity || 'NO QUANTITY');
    console.log('   - ID:', item.id || 'NO ID');
  });
}

// Calculate totals manually
console.log('\n💰 MANUAL TOTAL CALCULATION:');
let pizzaSubtotal = 0;
pizzaCart.forEach(item => {
  const price = item.price || item.totalPrice || 0;
  const quantity = item.quantity || 1;
  pizzaSubtotal += (price * quantity);
});

let menuSubtotal = 0;
menuCart.forEach(item => {
  const price = item.price || item.totalPrice || item.basePrice || 0;
  const quantity = item.quantity || 1;
  menuSubtotal += (price * quantity);
});

const totalSubtotal = pizzaSubtotal + menuSubtotal;
const tax = totalSubtotal * 0.08; // Assuming 8% tax
const total = totalSubtotal + tax;

console.log('Pizza subtotal: $' + pizzaSubtotal.toFixed(2));
console.log('Menu subtotal: $' + menuSubtotal.toFixed(2));
console.log('Total subtotal: $' + totalSubtotal.toFixed(2));
console.log('Tax (8%): $' + tax.toFixed(2));
console.log('Grand total: $' + total.toFixed(2));

console.log('\n🚨 ISSUES TO CHECK:');
if (totalSubtotal === 0 && (pizzaCart.length > 0 || menuCart.length > 0)) {
  console.log('❌ ITEMS EXIST BUT NO PRICES - Price calculation problem!');
}
if (pizzaCart.length === 0 && menuCart.length === 0) {
  console.log('❌ NO ITEMS IN CART - Cart is empty');
}
