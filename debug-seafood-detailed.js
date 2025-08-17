// Enhanced debug script for NaN seafood issue
console.log('🔍 SEAFOOD NaN DEBUG - Enhanced Analysis');

// Check localStorage data
console.log('\n📦 RAW CART DATA:');
const pizzaCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
const menuCart = JSON.parse(localStorage.getItem('menuCart') || '[]');

console.log('Pizza cart items:', pizzaCart.length);
console.log('Menu cart items:', menuCart.length);

if (menuCart.length > 0) {
  console.log('\n🥪 MENU ITEMS DETAILED ANALYSIS:');
  menuCart.forEach((item, index) => {
    console.log(`\n${index + 1}. ${item.menuItemName || item.name || 'Unnamed Item'}`);
    console.log('   - ID:', item.id || 'NO ID');
    console.log('   - Menu Item ID:', item.menuItemId || 'NO MENU ITEM ID');
    console.log('   - Base Price:', item.basePrice);
    console.log('   - Total Price:', item.totalPrice);
    console.log('   - Price (for cart):', item.price);
    console.log('   - Total Price Type:', typeof item.totalPrice);
    console.log('   - Price Type:', typeof item.price);
    console.log('   - Quantity:', item.quantity);
    console.log('   - Category:', item.categorySlug || item.category);
    
    // Check for NaN or invalid numbers
    if (isNaN(item.totalPrice)) {
      console.log('   ❌ TOTAL PRICE IS NaN!');
    } else if (item.totalPrice === null || item.totalPrice === undefined) {
      console.log('   ⚠️ TOTAL PRICE IS NULL/UNDEFINED!');
    } else if (typeof item.totalPrice !== 'number') {
      console.log('   ⚠️ TOTAL PRICE IS NOT A NUMBER!', typeof item.totalPrice);
    } else if (item.totalPrice.toString().includes('e-') || item.totalPrice.toString().length > 10) {
      console.log('   ⚠️ TOTAL PRICE HAS PRECISION ISSUES:', item.totalPrice);
      console.log('   📊 Fixed Price:', Math.round(item.totalPrice * 100) / 100);
    }
    
    // Check the price field used by cart
    if (item.price !== undefined) {
      if (isNaN(item.price)) {
        console.log('   ❌ CART PRICE IS NaN!');
      } else if (item.price.toString().includes('e-') || item.price.toString().length > 10) {
        console.log('   ⚠️ CART PRICE HAS PRECISION ISSUES:', item.price);
        console.log('   📊 Fixed Cart Price:', Math.round(item.price * 100) / 100);
      }
    }
    
    if (isNaN(item.basePrice)) {
      console.log('   ❌ BASE PRICE IS NaN!');
    }
    
    // Check customizations
    if (item.customizations && item.customizations.length > 0) {
      console.log('   🔧 Customizations:', item.customizations.length);
      item.customizations.forEach((custom, i) => {
        console.log(`     ${i + 1}. ${custom.name || 'Unknown'} - $${custom.price || 0}`);
        if (isNaN(custom.price)) {
          console.log('       ❌ CUSTOMIZATION PRICE IS NaN!');
        }
      });
    }
  });
}

// Manual calculation test using the same logic as cart component
console.log('\n💰 MANUAL CALCULATION TEST:');
let menuSubtotal = 0;
let hasNaNIssues = false;

menuCart.forEach((item, index) => {
  // Use the price field that cart component uses
  const price = item.price || 0;
  const quantity = item.quantity || 1;
  
  // Apply the same precision fix as the updated cart component
  const validPrice = isNaN(price) ? 0 : Math.round(price * 100) / 100;
  const validQuantity = isNaN(quantity) ? 1 : quantity;
  const itemTotal = validPrice * validQuantity;
  
  console.log(`Item ${index + 1}: $${validPrice} x ${validQuantity} = $${itemTotal.toFixed(2)}`);
  
  if (isNaN(itemTotal)) {
    console.log(`  ❌ CALCULATION RESULTED IN NaN!`);
    hasNaNIssues = true;
  } else {
    menuSubtotal += itemTotal;
  }
});

console.log(`\nMenu subtotal: $${menuSubtotal.toFixed(2)}`);
if (hasNaNIssues) {
  console.log('❌ NaN ISSUES DETECTED IN CALCULATIONS!');
}

// Test what the cart component would calculate
console.log('\n🧮 SIMULATING CART COMPONENT CALCULATION:');
const calculateMenuSubtotal = () => {
  if (!menuCart || menuCart.length === 0) {
    return 0;
  }

  return menuCart.reduce((total, item) => {
    const price = item.price || 0;
    const quantity = item.quantity || 1;
    
    // Apply precision fix like the updated cart component
    const validPrice = isNaN(price) ? 0 : Math.round(price * 100) / 100;
    const validQuantity = isNaN(quantity) ? 1 : quantity;
    const itemTotal = validPrice * validQuantity;
    
    console.log(`  Processing: ${item.menuItemName} - $${validPrice} x ${validQuantity} = $${itemTotal.toFixed(2)}`);
    return total + itemTotal;
  }, 0);
};

const calculatedSubtotal = calculateMenuSubtotal();
console.log(`Cart component would calculate: $${calculatedSubtotal.toFixed(2)}`);

if (isNaN(calculatedSubtotal)) {
  console.log('❌ CART COMPONENT CALCULATION RESULTS IN NaN!');
  
  // Find the problematic item
  menuCart.forEach((item, index) => {
    const price = item.price || 0;
    const quantity = item.quantity || 1;
    if (isNaN(price) || isNaN(quantity) || isNaN(price * quantity)) {
      console.log(`  Problem item ${index + 1}: price=${price}, quantity=${quantity}`);
    }
  });
}

// Check tax calculation
const tax = calculatedSubtotal * 0.0875;
const deliveryFee = calculatedSubtotal > 0 ? 3.99 : 0;
const grandTotal = calculatedSubtotal + tax + deliveryFee;

console.log(`\n📊 FINAL TOTALS:`);
console.log(`Subtotal: $${calculatedSubtotal.toFixed(2)}`);
console.log(`Tax (8.75%): $${tax.toFixed(2)}`);
console.log(`Delivery: $${deliveryFee.toFixed(2)}`);
console.log(`Grand Total: $${grandTotal.toFixed(2)}`);

if (isNaN(grandTotal)) {
  console.log('❌ GRAND TOTAL IS NaN!');
}

// Check if localStorage structure matches what we expect
console.log('\n🔧 CART STRUCTURE ANALYSIS:');
if (menuCart.length > 0) {
  const firstItem = menuCart[0];
  console.log('First menu item structure:');
  console.log('- Has price field:', firstItem.hasOwnProperty('price'));
  console.log('- Has totalPrice field:', firstItem.hasOwnProperty('totalPrice'));
  console.log('- Has basePrice field:', firstItem.hasOwnProperty('basePrice'));
  console.log('- Price value:', firstItem.price);
  console.log('- TotalPrice value:', firstItem.totalPrice);
  console.log('- BasePrice value:', firstItem.basePrice);
}

console.log('\n✅ Debug complete! Check for precision issues and NaN values above.');
