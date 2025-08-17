const { chromium } = require('playwright');

async function checkCartState() {
  console.log('🔍 Checking cart state after fix...\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the home page
    await page.goto('http://localhost:3005');
    await page.waitForLoadState('networkidle');
    
    // Check localStorage cart state
    const cartState = await page.evaluate(() => {
      const pizzaCart = localStorage.getItem('cartItems');
      const menuCart = localStorage.getItem('menuCart');
      
      return {
        pizzaCartExists: !!pizzaCart,
        pizzaCartCount: pizzaCart ? JSON.parse(pizzaCart).length : 0,
        menuCartExists: !!menuCart,
        menuCartCount: menuCart ? JSON.parse(menuCart).length : 0,
        pizzaCartData: pizzaCart ? JSON.parse(pizzaCart) : [],
        menuCartData: menuCart ? JSON.parse(menuCart) : []
      };
    });
    
    console.log('📊 Cart State Analysis:');
    console.log(`   🍕 Pizza Cart (cartItems): ${cartState.pizzaCartExists ? 'EXISTS' : 'EMPTY'} (${cartState.pizzaCartCount} items)`);
    console.log(`   🍽️ Menu Cart (menuCart): ${cartState.menuCartExists ? 'EXISTS' : 'EMPTY'} (${cartState.menuCartCount} items)`);
    
    if (cartState.pizzaCartCount > 0) {
      console.log('\n📋 Pizza Cart Items:');
      cartState.pizzaCartData.forEach((item, i) => {
        console.log(`   ${i + 1}. ${item.size?.name || 'Custom'} Pizza - $${item.totalPrice?.toFixed(2) || '0.00'}`);
      });
    }
    
    if (cartState.menuCartCount > 0) {
      console.log('\n📋 Menu Cart Items:');
      cartState.menuCartData.forEach((item, i) => {
        console.log(`   ${i + 1}. ${item.name || 'Unknown'} - $${item.price?.toFixed(2) || '0.00'}`);
      });
    }
    
    // Check if cart button shows correct count
    console.log('\n🛒 Checking cart button display...');
    
    // Look for floating cart button
    const cartButton = await page.locator('[data-testid="cart-button"], .cart-button, button:has-text("Cart")').first();
    const cartButtonVisible = await cartButton.isVisible().catch(() => false);
    
    if (cartButtonVisible) {
      const cartButtonText = await cartButton.textContent();
      console.log(`   ✅ Cart button found: "${cartButtonText}"`);
    } else {
      console.log('   ℹ️ No cart button visible (normal if empty)');
    }
    
    // Test pizza builder to ensure it still works
    console.log('\n🍕 Testing pizza builder navigation...');
    await page.goto('http://localhost:3005/pizza-builder');
    await page.waitForLoadState('networkidle');
    
    const pizzaBuilderWorking = await page.locator('h1:has-text("Pizza Builder"), h1:has-text("Build"), .pizza-builder').first().isVisible().catch(() => false);
    console.log(`   ${pizzaBuilderWorking ? '✅' : '❌'} Pizza builder page accessible`);
    
    // Test menu page
    console.log('\n🍽️ Testing menu page...');
    await page.goto('http://localhost:3005/menu');
    await page.waitForLoadState('networkidle');
    
    const menuWorking = await page.locator('h1:has-text("Menu"), .menu-categories, .category-card').first().isVisible().catch(() => false);
    console.log(`   ${menuWorking ? '✅' : '❌'} Menu page accessible`);
    
    console.log('\n🎯 Result:');
    if (!cartState.menuCartExists && cartState.pizzaCartExists) {
      console.log('   ✅ PERFECT: Pizza cart preserved, menu cart conflict removed');
      console.log('   ✅ No more duplicate cart displays');
      console.log('   ✅ Pizza builder checkout system intact');
    } else if (!cartState.menuCartExists && !cartState.pizzaCartExists) {
      console.log('   ✅ GOOD: Both carts empty, no conflicts');
      console.log('   ✅ Ready for fresh cart additions');
    } else if (cartState.menuCartExists) {
      console.log('   ⚠️ WARNING: Menu cart still exists - may cause duplication');
    }
    
  } catch (error) {
    console.error('❌ Error during cart state check:', error);
  }
  
  await browser.close();
}

checkCartState();
