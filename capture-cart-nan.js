const { chromium } = require('playwright');

async function captureCartPage() {
  console.log('📸 Capturing cart page to see $NaN issue...\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the cart page
    console.log('🔍 Loading cart page...');
    await page.goto('http://localhost:3005/cart');
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot
    await page.screenshot({ 
      path: 'cart-nan-issue.png', 
      fullPage: true 
    });
    console.log('✅ Screenshot saved as cart-nan-issue.png');
    
    // Check for NaN values in the page
    const nanElements = await page.evaluate(() => {
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
          elements.push({
            text: node.textContent.trim(),
            parentTag: node.parentElement?.tagName,
            parentClass: node.parentElement?.className
          });
        }
      }
      return elements;
    });
    
    if (nanElements.length > 0) {
      console.log('\n🚨 Found $NaN values:');
      nanElements.forEach((element, i) => {
        console.log(`   ${i + 1}. "${element.text}" in <${element.parentTag}> class="${element.parentClass}"`);
      });
    } else {
      console.log('\n✅ No $NaN values found in visible text');
    }
    
    // Check localStorage for cart data that might contain NaN
    const cartData = await page.evaluate(() => {
      const pizzaCart = localStorage.getItem('cartItems');
      const menuCart = localStorage.getItem('menuCart');
      
      return {
        pizzaCart: pizzaCart ? JSON.parse(pizzaCart) : null,
        menuCart: menuCart ? JSON.parse(menuCart) : null
      };
    });
    
    console.log('\n🛒 Current cart data:');
    console.log('Pizza cart:', JSON.stringify(cartData.pizzaCart, null, 2));
    console.log('Menu cart:', JSON.stringify(cartData.menuCart, null, 2));
    
  } catch (error) {
    console.error('❌ Error capturing cart page:', error);
  }
  
  await browser.close();
}

captureCartPage();
