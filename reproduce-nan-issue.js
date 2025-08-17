const { chromium } = require('playwright');

async function simulateCartWithNaN() {
  console.log('🧪 Simulating cart items that might cause $NaN...\n');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the home page first
    await page.goto('http://localhost:3005');
    await page.waitForLoadState('networkidle');
    
    // Add problematic cart items that could cause NaN
    await page.evaluate(() => {
      // Clear existing carts
      localStorage.removeItem('cartItems');
      localStorage.removeItem('menuCart');
      
      // Add menu items with potentially problematic data
      const problematicMenuItems = [
        {
          id: 'test-1',
          name: 'Test Item 1',
          price: undefined, // This will cause NaN
          quantity: 2,
          category: 'test'
        },
        {
          id: 'test-2', 
          name: 'Test Item 2',
          price: 'invalid', // This will cause NaN
          quantity: 1,
          category: 'test'
        },
        {
          id: 'test-3',
          name: 'Test Item 3',
          price: null, // This will cause NaN
          quantity: 1,
          category: 'test'
        },
        {
          id: 'test-4',
          name: 'Test Item 4 (Good)',
          price: 12.99, // This should work
          quantity: 1,
          category: 'test'
        }
      ];
      
      localStorage.setItem('menuCart', JSON.stringify(problematicMenuItems));
      
      // Also add a pizza item with potential issues
      const problematicPizzaItems = [
        {
          id: 'pizza-test-1',
          size: { name: 'Large', basePrice: 15.99 },
          crust: { name: 'Thin' },
          sauce: { name: 'Marinara' },
          toppings: [],
          quantity: 1,
          totalPrice: undefined, // This will cause NaN
          notes: 'Test pizza with NaN price'
        }
      ];
      
      localStorage.setItem('cartItems', JSON.stringify(problematicPizzaItems));
      
      console.log('Added problematic cart items');
      return true;
    });
    
    console.log('✅ Added problematic cart data');
    
    // Now navigate to cart page to see the NaN issue
    console.log('🔍 Navigating to cart page...');
    await page.goto('http://localhost:3005/cart');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit for React to render
    await page.waitForTimeout(2000);
    
    // Take screenshot to capture the NaN issue
    await page.screenshot({ 
      path: 'cart-nan-reproduction.png', 
      fullPage: true 
    });
    console.log('✅ Screenshot saved as cart-nan-reproduction.png');
    
    // Check for NaN values
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
      console.log('\n❓ No $NaN found - cart validation might be working');
    }
    
    // Check console errors
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.text().includes('NaN')) {
        consoleLogs.push(msg.text());
      }
    });
    
    console.log('\n📱 Page is now showing cart with problematic data');
    console.log('   Check the browser or screenshot to see $NaN values');
    
    // Keep browser open for 10 seconds so you can see it
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  await browser.close();
}

simulateCartWithNaN();
