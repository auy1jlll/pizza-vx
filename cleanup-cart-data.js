const { chromium } = require('playwright');

async function cleanupCartData() {
  console.log('🧹 Cleaning up problematic cart data...\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3005');
    await page.waitForLoadState('networkidle');
    
    const cleanupResult = await page.evaluate(() => {
      const cleanCartItems = (items, type) => {
        if (!items || !Array.isArray(items)) return [];
        
        return items.filter(item => {
          if (type === 'pizza') {
            // Validate pizza items
            const hasValidPrice = item.totalPrice && !isNaN(Number(item.totalPrice));
            const hasValidQuantity = item.quantity && !isNaN(Number(item.quantity)) && item.quantity > 0;
            return hasValidPrice && hasValidQuantity;
          } else {
            // Validate menu items
            const hasValidPrice = item.price && !isNaN(Number(item.price));
            const hasValidQuantity = item.quantity && !isNaN(Number(item.quantity)) && item.quantity > 0;
            return hasValidPrice && hasValidQuantity;
          }
        });
      };
      
      // Clean pizza cart
      const pizzaCartData = localStorage.getItem('cartItems');
      let pizzaItems = [];
      let pizzaCleaned = 0;
      
      if (pizzaCartData) {
        const originalPizzaItems = JSON.parse(pizzaCartData);
        pizzaItems = cleanCartItems(originalPizzaItems, 'pizza');
        pizzaCleaned = originalPizzaItems.length - pizzaItems.length;
        localStorage.setItem('cartItems', JSON.stringify(pizzaItems));
      }
      
      // Clean menu cart
      const menuCartData = localStorage.getItem('menuCart');
      let menuItems = [];
      let menuCleaned = 0;
      
      if (menuCartData) {
        const originalMenuItems = JSON.parse(menuCartData);
        menuItems = cleanCartItems(originalMenuItems, 'menu');
        menuCleaned = originalMenuItems.length - menuItems.length;
        localStorage.setItem('menuCart', JSON.stringify(menuItems));
      }
      
      return {
        pizzaItemsRemaining: pizzaItems.length,
        menuItemsRemaining: menuItems.length,
        pizzaItemsCleaned: pizzaCleaned,
        menuItemsCleaned: menuCleaned
      };
    });
    
    console.log('✅ Cart cleanup completed:');
    console.log(`   🍕 Pizza items: ${cleanupResult.pizzaItemsRemaining} remaining, ${cleanupResult.pizzaItemsCleaned} removed`);
    console.log(`   🍽️ Menu items: ${cleanupResult.menuItemsRemaining} remaining, ${cleanupResult.menuItemsCleaned} removed`);
    
    // Navigate to cart to verify
    await page.goto('http://localhost:3005/cart');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Check for any remaining NaN values
    const nanCheck = await page.evaluate(() => {
      const elements = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      let node;
      while (node = walker.nextNode()) {
        if (node.textContent.includes('NaN') || node.textContent.includes('$NaN')) {
          elements.push(node.textContent.trim());
        }
      }
      return elements;
    });
    
    if (nanCheck.length === 0) {
      console.log('\n✅ Cart is now clean - no $NaN values found');
    } else {
      console.log('\n⚠️ Still found NaN values:', nanCheck);
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
  
  await browser.close();
}

cleanupCartData();
