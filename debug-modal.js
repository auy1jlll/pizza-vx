const { chromium } = require('playwright');

async function debugModal() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3005/menu/salads');
    await page.waitForLoadState('networkidle');
    
    console.log('1. Page loaded, taking initial screenshot...');
    await page.screenshot({ path: 'before-click.png', fullPage: true });
    
    console.log('2. Looking for Customize buttons...');
    const customizeButtons = await page.locator('button:has-text("Customize & Add")').count();
    console.log(`Found ${customizeButtons} customize buttons`);
    
    if (customizeButtons > 0) {
      console.log('3. Clicking first Customize & Add button...');
      await page.click('button:has-text("Customize & Add")');
      
      await page.waitForTimeout(1000);
      
      console.log('4. Taking screenshot after click...');
      await page.screenshot({ path: 'after-click.png', fullPage: true });
      
      console.log('5. Checking for modal elements...');
      const modal = await page.locator('.fixed.inset-0').count();
      const modalContent = await page.locator('.rounded-3xl.bg-white').count();
      const addToCartButton = await page.locator('button:has-text("Add to Cart")').count();
      
      console.log(`Modal backdrop: ${modal}`);
      console.log(`Modal content: ${modalContent}`);
      console.log(`Add to Cart button: ${addToCartButton}`);
      
      // Check if selectedItem state is set
      const hasSelectedItem = await page.evaluate(() => {
        return document.querySelector('.fixed.inset-0') !== null;
      });
      
      console.log(`Modal is in DOM: ${hasSelectedItem}`);
      
      if (hasSelectedItem) {
        console.log('6. Modal exists, checking visibility...');
        const modalVisible = await page.locator('.fixed.inset-0').isVisible();
        const contentVisible = await page.locator('.rounded-3xl').isVisible();
        console.log(`Modal visible: ${modalVisible}`);
        console.log(`Content visible: ${contentVisible}`);
      } else {
        console.log('6. ERROR: Modal not found in DOM!');
        
        // Check for JavaScript errors
        const errors = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            errors.push(msg.text());
          }
        });
        
        await page.waitForTimeout(1000);
        if (errors.length > 0) {
          console.log('JavaScript errors found:', errors);
        }
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

debugModal();
