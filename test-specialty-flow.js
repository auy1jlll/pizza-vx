const puppeteer = require('puppeteer');

async function testSpecialtyPizzaFlow() {
  console.log('Testing specialty pizza customization flow...');
  
  try {
    const browser = await puppeteer.launch({ 
      headless: false, 
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Navigate to specialty pizzas
    console.log('1. Going to specialty pizzas page...');
    await page.goto('http://localhost:3005/specialty-pizzas');
    await page.waitForSelector('[data-testid="specialty-pizza"]', { timeout: 10000 });
    
    // Take screenshot of specialty pizzas page
    await page.screenshot({ path: 'specialty-pizzas-page.png', fullPage: true });
    console.log('2. Specialty pizzas page loaded');
    
    // Click first customize button
    console.log('3. Clicking customize button...');
    const customizeButton = await page.$('button:has-text("Customize")') || 
                            await page.$('a:has-text("Customize")') ||
                            await page.$('[href*="pizza-builder"]');
    
    if (customizeButton) {
      await customizeButton.click();
      console.log('4. Customize button clicked');
      
      // Wait for pizza builder to load
      await page.waitForSelector('[data-testid="pizza-builder"]', { timeout: 10000 });
      console.log('5. Pizza builder loaded');
      
      // Take screenshot of initial pizza builder state
      await page.screenshot({ path: 'pizza-builder-initial.png', fullPage: true });
      
      // Check if specialty pizza data is loaded
      const sizeSelection = await page.$('[data-testid="selected-size"]');
      const toppingsSection = await page.$('[data-testid="toppings-list"]');
      
      if (sizeSelection) {
        const sizeText = await page.evaluate(el => el.textContent, sizeSelection);
        console.log('6. Size loaded:', sizeText);
      }
      
      // Click on different tabs to test data persistence
      console.log('7. Testing tab navigation...');
      
      // Click sauce tab
      const sauceTab = await page.$('button:has-text("SAUCE")');
      if (sauceTab) {
        await sauceTab.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'pizza-builder-sauce-tab.png', fullPage: true });
        console.log('8. Sauce tab clicked');
      }
      
      // Click toppings tab
      const toppingsTab = await page.$('button:has-text("TOPPINGS")');
      if (toppingsTab) {
        await toppingsTab.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'pizza-builder-toppings-tab.png', fullPage: true });
        console.log('9. Toppings tab clicked');
      }
      
      // Go back to size tab to check if data is still there
      const sizeTab = await page.$('button:has-text("SIZE")');
      if (sizeTab) {
        await sizeTab.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'pizza-builder-back-to-size.png', fullPage: true });
        console.log('10. Back to size tab');
        
        // Check if size is still selected
        const finalSizeSelection = await page.$('[data-testid="selected-size"]');
        if (finalSizeSelection) {
          const finalSizeText = await page.evaluate(el => el.textContent, finalSizeSelection);
          console.log('11. Final size check:', finalSizeText);
        } else {
          console.log('11. ERROR: Size selection lost!');
        }
      }
      
    } else {
      console.log('4. ERROR: Customize button not found');
    }
    
    await browser.close();
    console.log('Test completed!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testSpecialtyPizzaFlow();
