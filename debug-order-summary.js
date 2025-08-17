// Debug function to check cart data and order summary calculation
function debugCartData() {
  console.log('=== CART DEBUG START ===');
  
  // Check all possible localStorage keys
  const menuCart = localStorage.getItem('menuCart');
  const cartItems = localStorage.getItem('cartItems');
  const cart = localStorage.getItem('cart');
  
  console.log('📦 LocalStorage Data:');
  console.log('menuCart:', menuCart ? JSON.parse(menuCart) : 'null');
  console.log('cartItems:', cartItems ? JSON.parse(cartItems) : 'null');
  console.log('cart:', cart ? JSON.parse(cart) : 'null');
  
  // Check React state if available
  if (typeof window !== 'undefined' && window.React) {
    console.log('⚛️ React state check needed - check your component state');
  }
  
  console.log('=== CART DEBUG END ===');
  
  return {
    menuCart: menuCart ? JSON.parse(menuCart) : null,
    cartItems: cartItems ? JSON.parse(cartItems) : null,
    cart: cart ? JSON.parse(cart) : null
  };
}

// Enhanced calculation function that handles multiple data structures
function calculateSummary(cartData) {
  console.log('🧮 Calculating summary for:', cartData);
  
  let subtotal = 0;
  let itemCount = 0;
  
  // Handle different cart data structures
  if (Array.isArray(cartData)) {
    // Direct array of items
    cartData.forEach(item => {
      const price = getItemPrice(item);
      const quantity = getItemQuantity(item);
      subtotal += price * quantity;
      itemCount += quantity;
      console.log(`Item: ${item.name || 'Unknown'}, Price: ${price}, Qty: ${quantity}, Total: ${price * quantity}`);
    });
  } else if (cartData && typeof cartData === 'object') {
    // Object with pizzaItems and menuItems
    if (cartData.pizzaItems) {
      cartData.pizzaItems.forEach(item => {
        const price = getItemPrice(item);
        const quantity = getItemQuantity(item);
        subtotal += price * quantity;
        itemCount += quantity;
        console.log(`Pizza: ${item.name || 'Unknown'}, Price: ${price}, Qty: ${quantity}`);
      });
    }
    
    if (cartData.menuItems) {
      cartData.menuItems.forEach(item => {
        const price = getItemPrice(item);
        const quantity = getItemQuantity(item);
        subtotal += price * quantity;
        itemCount += quantity;
        console.log(`Menu: ${item.name || 'Unknown'}, Price: ${price}, Qty: ${quantity}`);
      });
    }
  }
  
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;
  
  console.log('📊 Summary:');
  console.log(`Items: ${itemCount}`);
  console.log(`Subtotal: $${subtotal.toFixed(2)}`);
  console.log(`Tax: $${tax.toFixed(2)}`);
  console.log(`Total: $${total.toFixed(2)}`);
  
  return { subtotal, tax, total, itemCount };
}

// Helper to get price from item with multiple possible field names
function getItemPrice(item) {
  return parseFloat(item.totalPrice || item.price || item.unitPrice || item.basePrice || 0);
}

// Helper to get quantity from item with multiple possible field names
function getItemQuantity(item) {
  return parseInt(item.quantity || item.qty || item.count || 1);
}

// Force recalculation function
function forceRecalculateCart() {
  console.log('🔄 Force recalculating cart...');
  
  const allCartData = debugCartData();
  
  // Try each data source
  Object.keys(allCartData).forEach(key => {
    if (allCartData[key]) {
      console.log(`\n--- Calculating for ${key} ---`);
      calculateSummary(allCartData[key]);
    }
  });
}

// Quick test with sample data
function testCalculation() {
  const sampleData = [
    { name: 'Italian Sub', price: 12.99, quantity: 1 },
    { name: 'BBQ Ribs', totalPrice: 17.99, qty: 1 }
  ];
  
  console.log('🧪 Testing with sample data:');
  calculateSummary(sampleData);
}

console.log('🚀 Debug functions loaded! Run these in console:');
console.log('debugCartData() - Shows all cart data');
console.log('forceRecalculateCart() - Recalculates everything');
console.log('testCalculation() - Tests with sample data');

// Auto-run debug on load
debugCartData();
