/**
 * Client-side validation checker for cart items
 * Run this in browser console to validate existing cart data
 */

(function() {
  console.log('🔍 Cart Data Validation Checker');
  console.log('================================');

  // Get cart data from localStorage
  const cartData = localStorage.getItem('menuCart');
  const cartItems = localStorage.getItem('cartItems');

  if (!cartData && !cartItems) {
    console.log('✅ No cart data found - nothing to validate');
    return;
  }

  let cart = null;
  let items = null;

  // Parse cart data
  try {
    if (cartData) {
      cart = JSON.parse(cartData);
      console.log('📦 Found menuCart data');
    }
    if (cartItems) {
      items = JSON.parse(cartItems);
      console.log('📦 Found cartItems data');
    }
  } catch (error) {
    console.error('❌ Failed to parse cart data:', error);
    return;
  }

  // Validation functions
  function validateName(name, context) {
    const issues = [];
    
    if (!name || name === null || name === undefined) {
      issues.push(`Missing name in ${context}`);
    } else if (typeof name !== 'string') {
      issues.push(`Name is not a string in ${context}: ${typeof name}`);
    } else if (name.trim().length === 0) {
      issues.push(`Empty name in ${context}`);
    } else if (name.trim().length < 2) {
      issues.push(`Very short name in ${context}: "${name}"`);
    }
    
    return issues;
  }

  function validatePrice(price, context) {
    const issues = [];
    
    if (price === null || price === undefined) {
      issues.push(`Missing price in ${context}`);
    } else if (typeof price !== 'number' || isNaN(price)) {
      issues.push(`Invalid price type in ${context}: ${typeof price} - ${price}`);
    } else if (price < 0) {
      issues.push(`Negative price in ${context}: ${price}`);
    }
    
    return issues;
  }

  function validateCartItem(item, index, source) {
    const issues = [];
    const context = `${source}[${index}]`;
    
    // Check name
    issues.push(...validateName(item.name, context));
    
    // Check prices
    if (item.price !== undefined) {
      issues.push(...validatePrice(item.price, context + '.price'));
    }
    if (item.totalPrice !== undefined) {
      issues.push(...validatePrice(item.totalPrice, context + '.totalPrice'));
    }
    if (item.finalPrice !== undefined) {
      issues.push(...validatePrice(item.finalPrice, context + '.finalPrice'));
    }
    if (item.basePrice !== undefined) {
      issues.push(...validatePrice(item.basePrice, context + '.basePrice'));
    }
    
    // Check if at least one price field exists
    const hasPriceField = item.price !== undefined || 
                          item.totalPrice !== undefined || 
                          item.finalPrice !== undefined || 
                          item.basePrice !== undefined;
    
    if (!hasPriceField) {
      issues.push(`No price fields found in ${context}`);
    }
    
    // Check quantity
    if (item.quantity === undefined || item.quantity === null) {
      issues.push(`Missing quantity in ${context}`);
    } else if (typeof item.quantity !== 'number' || isNaN(item.quantity) || item.quantity <= 0) {
      issues.push(`Invalid quantity in ${context}: ${item.quantity}`);
    }
    
    return issues;
  }

  // Validate cart data
  const allIssues = [];

  if (cart && cart.items && Array.isArray(cart.items)) {
    console.log(`🔍 Validating ${cart.items.length} items in menuCart`);
    cart.items.forEach((item, index) => {
      const issues = validateCartItem(item, index, 'menuCart.items');
      allIssues.push(...issues);
    });
  }

  if (items && Array.isArray(items)) {
    console.log(`🔍 Validating ${items.length} items in cartItems`);
    items.forEach((item, index) => {
      const issues = validateCartItem(item, index, 'cartItems');
      allIssues.push(...issues);
    });
  }

  // Report results
  console.log('\n📊 Validation Results:');
  console.log('======================');

  if (allIssues.length === 0) {
    console.log('✅ All cart items passed validation!');
  } else {
    console.log(`❌ Found ${allIssues.length} validation issues:`);
    allIssues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
    
    console.log('\n🔧 Suggested Actions:');
    console.log('- Clear invalid cart data: localStorage.removeItem("menuCart"); localStorage.removeItem("cartItems");');
    console.log('- Or run the fix script to repair data automatically');
  }

  // Show summary of current cart structure
  console.log('\n📋 Cart Data Summary:');
  if (cart) {
    console.log('menuCart structure:', {
      itemCount: cart.items?.length || 0,
      hasSubtotal: 'subtotal' in cart,
      hasTotal: 'total' in cart,
      keys: Object.keys(cart)
    });
  }
  
  if (items) {
    console.log('cartItems structure:', {
      itemCount: items.length,
      sampleKeys: items[0] ? Object.keys(items[0]) : []
    });
  }
})();

console.log('\n💡 To fix validation issues automatically, run the fix-empty-name-items.js script');
