const { chromium } = require('playwright');

async function testSaladButtonVisibility() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to salads menu...');
    await page.goto('http://localhost:3005/menu/salads');
    await page.waitForLoadState('networkidle');
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Browser Console Error:', msg.text());
      }
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
      console.log('Page Error:', error.message);
    });
    
    console.log('Looking for salad items...');
    const saladCards = await page.locator('[data-testid*="menu-item"], .group:has-text("SALAD")').count();
    console.log(`Found ${saladCards} salad cards`);
    
    // Click on the "Customize & Add" button (not just the card)
    console.log('Clicking on "Customize & Add" button...');
    await page.locator('button:has-text("Customize & Add")').first().click();
    
    // Wait for modal to open
    console.log('Waiting for customization modal...');
    await page.waitForSelector('.fixed.inset-0', { timeout: 10000 });
    await page.waitForTimeout(1000); // Give modal time to fully render
    
    // Check if Add to Cart button is visible
    console.log('Checking Add to Cart button visibility...');
    const addToCartButton = page.locator('button:has-text("Add to Cart")');
    const isVisible = await addToCartButton.isVisible();
    const isEnabled = await addToCartButton.isEnabled();
    
    // Check the actual CSS styles that might be hiding the button
    const buttonStyles = await addToCartButton.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        position: styles.position,
        zIndex: styles.zIndex,
        transform: styles.transform,
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        pointerEvents: styles.pointerEvents,
        width: styles.width,
        height: styles.height
      };
    });
    
    // Check the disabled state and classes
    const isDisabled = await addToCartButton.evaluate(el => el.disabled);
    const buttonClasses = await addToCartButton.evaluate(el => el.className);
    const addingToCartState = await page.evaluate(() => {
      // Try to access React state if possible
      return window.addingToCart || 'unknown';
    });
    
    console.log(`Button disabled state: ${isDisabled}`);
    console.log(`Button classes: ${buttonClasses}`);
    console.log(`AddingToCart state: ${addingToCartState}`);
    
    console.log(`Add to Cart button - Visible: ${isVisible}, Enabled: ${isEnabled}`);
    console.log('Button CSS styles:', buttonStyles);
    
    // Take a screenshot BEFORE selecting any dressing
    await page.screenshot({ path: 'salad-modal-before-selection.png', fullPage: true });
    console.log('Screenshot taken BEFORE dressing selection');
    
    // Check if button is actually clickable (visual test)
    const buttonBox = await addToCartButton.boundingBox();
    console.log('Button bounding box:', buttonBox);
    
    // The button appears to be visible according to Playwright
    // Let's check if it's covered by another element or has transparency issues
    
    // Try selecting a dressing option
    console.log('Looking for dressing options...');
    
    // Look for different possible selectors for dressing options
    const dressingSelectors = [
      'button:has-text("Ranch")',
      'button:has-text("Caesar")', 
      'button:has-text("Italian")',
      'button:has-text("Honey Mustard")',
      'button:has-text("Blue Cheese")',
      '[data-testid*="dressing"]',
      'button[class*="dressing"]',
      'button[class*="option"]',
      '.grid button', // Grid layout for options
      '[role="button"]'
    ];
    
    let dressingOptions = 0;
    let foundSelector = '';
    
    for (const selector of dressingSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        dressingOptions = count;
        foundSelector = selector;
        console.log(`Found ${count} options using selector: ${selector}`);
        break;
      }
    }
    
    console.log(`Total dressing options found: ${dressingOptions}`);
    
    // Check specific modal content instead of all fixed elements
    const modalContent = await page.locator('.fixed.inset-0 .bg-gradient-to-br').first();
    const hasModal = await modalContent.count();
    console.log(`Modal content found: ${hasModal > 0}`);
    
    if (dressingOptions > 0) {
      console.log('Trying to click on first dressing option...');
      
      // Check for modal overlays that might be blocking clicks
      const modalOverlays = await page.locator('.fixed.inset-0').count();
      console.log(`Found ${modalOverlays} modal overlays`);
      
      // Try clicking on the modal content area first to ensure it's focused
      const modalContent = await page.locator('.fixed.inset-0 .relative').first();
      if (await modalContent.count() > 0) {
        console.log('Clicking on modal content area first...');
        await modalContent.click();
        await page.waitForTimeout(500);
      }
      
      // Try force clicking the dressing option
      try {
        await page.locator(foundSelector).first().click({ force: true });
        console.log('Successfully clicked dressing option with force');
      } catch (error) {
        console.log('Failed to click dressing option even with force:', error.message);
        
        // Check if the button is actually clickable
        const buttonBounds = await page.locator(foundSelector).first().boundingBox();
        console.log('Button bounds:', buttonBounds);
        
        // Try clicking at the button coordinates directly
        if (buttonBounds) {
          await page.mouse.click(buttonBounds.x + buttonBounds.width/2, buttonBounds.y + buttonBounds.height/2);
          console.log('Tried direct mouse click');
        }
      }
      
      // Wait a moment and check button again
      await page.waitForTimeout(1000);
      
      // Take screenshot AFTER selecting dressing
      await page.screenshot({ path: 'salad-modal-after-selection.png', fullPage: true });
      console.log('Screenshot taken AFTER dressing selection');
      
      const isVisibleAfter = await addToCartButton.isVisible();
      const isEnabledAfter = await addToCartButton.isEnabled();
      
      // Check button styles after selection
      const buttonStylesAfter = await addToCartButton.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          transform: styles.transform
        };
      });
      
      console.log(`After attempting dressing selection - Visible: ${isVisibleAfter}, Enabled: ${isEnabledAfter}`);
      console.log('Button styles after selection:', buttonStylesAfter);
      
      // Check if any option is now selected/highlighted
      const selectedOptions = await page.locator('.grid button[class*="bg-green"], .grid button[class*="selected"]').count();
      console.log(`Selected dressing options: ${selectedOptions}`);
    } else {
      console.log('No dressing options found - checking SaladCustomizer component');
    }
    
    // Try pressing Tab to see if it becomes visible
    console.log('Pressing Tab key...');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    // Take screenshot AFTER Tab press
    await page.screenshot({ path: 'salad-modal-after-tab.png', fullPage: true });
    console.log('Screenshot taken AFTER Tab press');
    
    const isVisibleAfterTab = await addToCartButton.isVisible();
    const isEnabledAfterTab = await addToCartButton.isEnabled();
    
    // Check button styles after Tab
    const buttonStylesAfterTab = await addToCartButton.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        transform: styles.transform
      };
    });
    
    console.log(`After Tab press - Visible: ${isVisibleAfterTab}, Enabled: ${isEnabledAfterTab}`);
    console.log('Button styles after Tab:', buttonStylesAfterTab);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'salad-modal-debug.png', fullPage: true });
    console.log('Final debug screenshot saved');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testSaladButtonVisibility();
