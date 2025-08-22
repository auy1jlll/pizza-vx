const { chromium } = require('playwright');

async function testSaladCustomizationFlow() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('=== TESTING SALAD CUSTOMIZATION FLOW ===');
    
    // Step 1: Navigate to salads menu
    console.log('1. Navigating to salads menu...');
    await page.goto('http://localhost:3005/menu/salads');
    await page.waitForLoadState('networkidle');
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Browser Console Error:', msg.text());
      }
    });
    
    // Step 2: Find and click "Customize & Add" button
    console.log('2. Looking for "Customize & Add" buttons...');
    const customizeButtons = await page.locator('button:has-text("Customize & Add")').count();
    console.log(`Found ${customizeButtons} "Customize & Add" buttons`);
    
    if (customizeButtons === 0) {
      console.log('ERROR: No Customize & Add buttons found!');
      return;
    }
    
    console.log('3. Clicking first "Customize & Add" button...');
    await page.locator('button:has-text("Customize & Add")').first().click();
    
    // Step 3: Wait for modal to open
    console.log('4. Waiting for customization modal to open...');
    await page.waitForSelector('.fixed.inset-0', { timeout: 10000 });
    await page.waitForTimeout(1000);
    
    // Take initial screenshot
    await page.screenshot({ path: 'step1-modal-opened.png', fullPage: true });
    console.log('Screenshot: Modal opened');
    
    // Step 4: Check Add to Cart button initial state
    console.log('5. Checking Add to Cart button initial state...');
    const addToCartButton = page.locator('button:has-text("Add to Cart")');
    const initialVisible = await addToCartButton.isVisible();
    const initialEnabled = await addToCartButton.isEnabled();
    
    const initialStyles = await addToCartButton.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        background: styles.background,
        opacity: styles.opacity,
        visibility: styles.visibility
      };
    });
    
    console.log(`Initial state - Visible: ${initialVisible}, Enabled: ${initialEnabled}`);
    console.log('Initial styles:', initialStyles);
    
    // Step 5: Look for dressing options
    console.log('6. Looking for dressing options...');
    const dressingOptions = await page.locator('.grid button').count();
    console.log(`Found ${dressingOptions} dressing options`);
    
    if (dressingOptions > 0) {
      // Step 6: Select a dressing
      console.log('7. Selecting first dressing option...');
      
      // Try to click the first dressing option
      try {
        await page.locator('.grid button').first().click({ timeout: 5000 });
        console.log('Successfully selected dressing option');
      } catch (error) {
        console.log('Failed to select dressing:', error.message);
        // Try with force
        await page.locator('.grid button').first().click({ force: true });
        console.log('Selected dressing with force');
      }
      
      await page.waitForTimeout(1000);
      
      // Take screenshot after selection
      await page.screenshot({ path: 'step2-dressing-selected.png', fullPage: true });
      console.log('Screenshot: After dressing selection');
      
      // Step 7: Check Add to Cart button after selection
      console.log('8. Checking Add to Cart button after dressing selection...');
      const afterVisible = await addToCartButton.isVisible();
      const afterEnabled = await addToCartButton.isEnabled();
      
      const afterStyles = await addToCartButton.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          background: styles.background,
          opacity: styles.opacity,
          visibility: styles.visibility
        };
      });
      
      console.log(`After selection - Visible: ${afterVisible}, Enabled: ${afterEnabled}`);
      console.log('After styles:', afterStyles);
      
      // Step 8: Try to click Add to Cart
      console.log('9. Attempting to click Add to Cart button...');
      try {
        await addToCartButton.click({ timeout: 5000 });
        console.log('SUCCESS: Add to Cart button clicked successfully!');
      } catch (error) {
        console.log('FAILED: Could not click Add to Cart button:', error.message);
        
        // Try pressing Tab to see if it helps
        console.log('10. Trying Tab key...');
        await page.keyboard.press('Tab');
        await page.waitForTimeout(500);
        
        await page.screenshot({ path: 'step3-after-tab.png', fullPage: true });
        console.log('Screenshot: After Tab press');
        
        const tabVisible = await addToCartButton.isVisible();
        const tabEnabled = await addToCartButton.isEnabled();
        
        const tabStyles = await addToCartButton.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            background: styles.background,
            opacity: styles.opacity,
            visibility: styles.visibility
          };
        });
        
        console.log(`After Tab - Visible: ${tabVisible}, Enabled: ${tabEnabled}`);
        console.log('Tab styles:', tabStyles);
        
        // Try clicking again after Tab
        try {
          await addToCartButton.click({ timeout: 5000 });
          console.log('SUCCESS: Add to Cart button clicked after Tab!');
        } catch (finalError) {
          console.log('STILL FAILED: Cannot click Add to Cart even after Tab:', finalError.message);
        }
      }
      
      // Step 9: Check Cancel button too
      console.log('11. Testing Cancel button...');
      const cancelButton = page.locator('button:has-text("Cancel")');
      try {
        const cancelVisible = await cancelButton.isVisible();
        const cancelEnabled = await cancelButton.isEnabled();
        console.log(`Cancel button - Visible: ${cancelVisible}, Enabled: ${cancelEnabled}`);
        
        if (cancelVisible && cancelEnabled) {
          await cancelButton.click();
          console.log('Cancel button works fine');
        }
      } catch (error) {
        console.log('Cancel button also has issues:', error.message);
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testSaladCustomizationFlow();
