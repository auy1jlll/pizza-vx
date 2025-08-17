// Debug cart state in browser console
// This script checks the relationship between localStorage, React state, and calculations

console.log('🔍 CART STATE DEBUG');
console.log('='.repeat(50));

// Check localStorage
const cartItems = localStorage.getItem('cartItems');
const menuCart = localStorage.getItem('menuCart');
const cartItemsParsed = cartItems ? JSON.parse(cartItems) : [];
const menuCartParsed = menuCart ? JSON.parse(menuCart) : [];

console.log('📦 localStorage Data:');
console.log('cartItems (pizza):', cartItemsParsed.length, 'items');
cartItemsParsed.forEach((item, i) => {
  console.log(`  ${i + 1}. ${item.name || 'Unnamed Pizza'} - Price: ${item.totalPrice || 0}, Qty: ${item.quantity || 1}`);
});

console.log('menuCart (menu items):', menuCartParsed.length, 'items');
menuCartParsed.forEach((item, i) => {
  console.log(`  ${i + 1}. ${item.name} - Price: ${item.price}, Qty: ${item.quantity}`);
});

// Check if page has React state
console.log('\n🎯 React Component State Check:');
console.log('Looking for React fiber on cart page...');

// Find the cart page component in React DevTools
const checkReactState = () => {
  // Try to find React component via DOM
  const cartContainer = document.querySelector('[class*="cart"]') || document.querySelector('main') || document.body;
  
  if (cartContainer && cartContainer._reactInternalFiber) {
    console.log('Found React fiber - checking state...');
    // This would require React DevTools API
  } else if (cartContainer && cartContainer._reactInternals) {
    console.log('Found React internals - checking state...');
    // Modern React versions
  } else {
    console.log('❌ Cannot access React state directly from console');
    console.log('💡 Open React DevTools to inspect component state');
  }
};

checkReactState();

// Manual calculation verification
console.log('\n🧮 Manual Calculations:');
const pizzaSubtotal = cartItemsParsed.reduce((total, item) => {
  return total + ((item.totalPrice || 0) * (item.quantity || 1));
}, 0);

const menuSubtotal = menuCartParsed.reduce((total, item) => {
  return total + (item.price * item.quantity);
}, 0);

const combinedSubtotal = pizzaSubtotal + menuSubtotal;
const tax = combinedSubtotal * 0.0875;
const deliveryFee = combinedSubtotal > 0 ? 3.99 : 0;
const grandTotal = combinedSubtotal + tax + deliveryFee;

console.log(`Pizza subtotal: $${pizzaSubtotal.toFixed(2)}`);
console.log(`Menu subtotal: $${menuSubtotal.toFixed(2)}`);
console.log(`Combined subtotal: $${combinedSubtotal.toFixed(2)}`);
console.log(`Tax (8.75%): $${tax.toFixed(2)}`);
console.log(`Delivery fee: $${deliveryFee.toFixed(2)}`);
console.log(`Grand total: $${grandTotal.toFixed(2)}`);

// Check what's displayed on page
console.log('\n👀 Page Display Check:');
const orderSummary = document.querySelector('h2')?.textContent?.includes('Order Summary') ? 
  document.querySelector('h2').parentElement : null;

if (orderSummary) {
  const priceElements = orderSummary.querySelectorAll('span');
  console.log('Found order summary with', priceElements.length, 'price elements');
  priceElements.forEach((el, i) => {
    if (el.textContent.includes('$')) {
      console.log(`  Price ${i + 1}: ${el.textContent}`);
    }
  });
} else {
  console.log('❌ Order summary not found on page');
}

console.log('\n✅ Debug complete! Compare manual calculations with page display.');
