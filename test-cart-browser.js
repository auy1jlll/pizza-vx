// Test cart functionality by directly calling the cart functions
console.log('🧪 Testing cart functionality...');

// Wait for page to load completely
setTimeout(() => {
  console.log('=== TESTING CART SYSTEM ===');
  
  // Check if localStorage has any cart data
  const existingCart = localStorage.getItem('cartItems');
  console.log('Existing cart in localStorage:', existingCart);
  
  // Test adding a simple item to localStorage
  const testPizza = [{
    id: 'test-' + Date.now(),
    size: { id: '1', name: 'Medium', basePrice: 15.99 },
    crust: { id: '1', name: 'Thin' },
    sauce: { id: '1', name: 'Tomato' },
    toppings: [],
    quantity: 1,
    basePrice: 15.99,
    totalPrice: 15.99,
    notes: 'Test pizza'
  }];
  
  localStorage.setItem('cartItems', JSON.stringify(testPizza));
  console.log('✅ Test pizza added to localStorage');
  
  // Check cart button
  const cartButton = document.querySelector('button[class*="bottom-6"]');
  if (cartButton) {
    console.log('✅ Cart button found:', cartButton);
    console.log('Cart button text:', cartButton.textContent);
  } else {
    console.log('❌ Cart button not found');
  }
  
  // Refresh the page to see if cart persists
  console.log('💡 Refresh the page to test persistence');
  
}, 3000);
