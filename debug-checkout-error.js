// Debug checkout error with menu items
console.log('🔍 DEBUGGING CHECKOUT ERROR WITH MENU ITEMS');

// Check cart contents
const pizzaCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
const menuCart = JSON.parse(localStorage.getItem('menuCart') || '[]');

console.log('\n📦 CART CONTENTS:');
console.log('Pizza items:', pizzaCart.length);
console.log('Menu items:', menuCart.length);

// Show detailed cart structure
if (menuCart.length > 0) {
  console.log('\n🥪 MENU CART STRUCTURE:');
  menuCart.forEach((item, index) => {
    console.log(`${index + 1}. ${item.menuItemName || item.name}`);
    console.log('   - ID:', item.id);
    console.log('   - Menu Item ID:', item.menuItemId);
    console.log('   - Type:', item.type);
    console.log('   - Price:', item.price);
    console.log('   - Total Price:', item.totalPrice);
    console.log('   - Quantity:', item.quantity);
    console.log('   - Customizations:', item.customizations?.length || 0);
    console.log('   - Category Slug:', item.categorySlug);
    
    // Check if all required fields are present
    const missingFields = [];
    if (!item.id) missingFields.push('id');
    if (!item.menuItemId) missingFields.push('menuItemId');
    if (!item.type) missingFields.push('type');
    if (!item.price && !item.totalPrice) missingFields.push('price/totalPrice');
    if (!item.quantity) missingFields.push('quantity');
    
    if (missingFields.length > 0) {
      console.log('   ❌ Missing fields:', missingFields.join(', '));
    }
  });
}

if (pizzaCart.length > 0) {
  console.log('\n🍕 PIZZA CART STRUCTURE:');
  pizzaCart.forEach((item, index) => {
    console.log(`${index + 1}. Pizza`);
    console.log('   - ID:', item.id);
    console.log('   - Total Price:', item.totalPrice);
    console.log('   - Quantity:', item.quantity);
    console.log('   - Size:', item.size?.name);
    console.log('   - Crust:', item.crust?.name);
    console.log('   - Sauce:', item.sauce?.name);
    console.log('   - Toppings:', item.toppings?.length || 0);
  });
}

// Test the checkout payload
console.log('\n🔄 TESTING CHECKOUT PAYLOAD CONSTRUCTION:');

// Simulate what checkout would send
const checkoutPayload = {
  customerInfo: {
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '555-1234',
  },
  orderType: 'PICKUP',
  items: [
    ...pizzaCart.map(item => ({
      type: 'pizza',
      id: item.id,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      size: item.size,
      crust: item.crust,
      sauce: item.sauce,
      toppings: item.toppings
    })),
    ...menuCart.map(item => ({
      type: 'menu',
      id: item.id,
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      totalPrice: item.totalPrice || item.price,
      customizations: item.customizations
    }))
  ]
};

console.log('Checkout payload would be:');
console.log(JSON.stringify(checkoutPayload, null, 2));

// Check for potential validation issues
console.log('\n🚨 POTENTIAL VALIDATION ISSUES:');
let hasIssues = false;

checkoutPayload.items.forEach((item, index) => {
  if (!item.id) {
    console.log(`Item ${index + 1}: Missing ID`);
    hasIssues = true;
  }
  if (!item.quantity || item.quantity <= 0) {
    console.log(`Item ${index + 1}: Invalid quantity (${item.quantity})`);
    hasIssues = true;
  }
  if (!item.totalPrice || item.totalPrice <= 0) {
    console.log(`Item ${index + 1}: Invalid total price (${item.totalPrice})`);
    hasIssues = true;
  }
  if (item.type === 'menu' && !item.menuItemId) {
    console.log(`Item ${index + 1}: Menu item missing menuItemId`);
    hasIssues = true;
  }
});

if (!hasIssues) {
  console.log('✅ No obvious validation issues found in cart data');
}

console.log('\n💡 NEXT STEPS:');
console.log('1. Try checkout with this cart data');
console.log('2. Check browser Network tab for API response details');
console.log('3. Check server logs for validation errors');
