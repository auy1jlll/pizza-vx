const { chromium } = require('playwright');

async function simpleTest() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3005/menu/salads');
    await page.waitForLoadState('networkidle');
    
    console.log('1. Clicking Customize & Add...');
    await page.click('button:has-text("Customize & Add")');
    
    await page.waitForTimeout(2000);
    
    console.log('2. Taking screenshot of modal...');
    await page.screenshot({ path: 'simple-test.png', fullPage: true });
    
    console.log('3. Checking Add to Cart button...');
    const button = page.locator('button:has-text("Add to Cart")');
    const visible = await button.isVisible();
    const enabled = await button.isEnabled();
    
    console.log(`Button visible: ${visible}, enabled: ${enabled}`);
    
    if (visible) {
      const styles = await button.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          background: computed.background,
          backgroundColor: computed.backgroundColor,
          opacity: computed.opacity,
          display: computed.display
        };
      });
      console.log('Button styles:', styles);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

simpleTest();
