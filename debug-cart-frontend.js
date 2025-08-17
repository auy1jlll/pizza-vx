// Debug script to test cart functionality in the browser
console.log('🔍 Cart Debug Script - Testing cart functionality...');

// Test function to check cart state in browser console
window.debugCart = function() {
  console.log('=== CART DEBUG INFO ===');
  
  // Check if React DevTools can access cart context
  const cartElements = document.querySelectorAll('[data-testid*="cart"], .cart, #cart');
  console.log('Cart-related elements found:', cartElements.length);
  
  // Check cart button
  const cartButton = document.querySelector('button[class*="cart"], button[class*="Cart"]');
  if (cartButton) {
    console.log('Cart button found:', cartButton);
    console.log('Cart button classes:', cartButton.className);
  } else {
    console.log('❌ No cart button found');
  }
  
  // Check for React components
  if (window.React) {
    console.log('✅ React is loaded');
  } else {
    console.log('❌ React not found in window');
  }
  
  // Check localStorage for cart data
  const cartData = localStorage.getItem('cartItems');
  if (cartData) {
    try {
      const parsed = JSON.parse(cartData);
      console.log('Cart data in localStorage:', parsed);
      console.log('Cart items count:', parsed.length);
    } catch (e) {
      console.log('❌ Error parsing cart data:', e);
    }
  } else {
    console.log('❌ No cart data in localStorage');
  }
  
  // Check for any errors in console
  console.log('=== Check browser console for any React errors ===');
};

// Auto-run debug
setTimeout(() => {
  window.debugCart();
}, 2000);

console.log('💡 Run window.debugCart() in browser console to get cart info');
console.log('💡 Also check: localStorage.getItem("cartItems")');
