const { chromium } = require('playwright');

async function screenshotPage() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    console.log('🔍 Taking screenshot of customization groups page...');
    
    // Go directly to the page (assuming you're already logged in via browser)
    await page.goto('http://localhost:3005/admin/menu-manager/customization-groups', { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    // Take screenshot
    await page.screenshot({ 
      path: 'customization-groups-page.png', 
      fullPage: true 
    });
    
    // Get page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Count buttons containing "Clone"
    const cloneButtons = await page.locator('button:has-text("Clone")').count();
    console.log(`Found ${cloneButtons} clone buttons`);
    
    // Get all text content to see what's on the page
    const pageText = await page.textContent('body');
    const hasCloneText = pageText.includes('Clone');
    console.log('Page contains "Clone" text:', hasCloneText);
    
    // Look for customization groups
    const groupCards = await page.locator('[class*="bg-white"]').count();
    console.log(`Found ${groupCards} white background elements (potential group cards)`);
    
    console.log('✅ Screenshot saved as customization-groups-page.png');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

screenshotPage();
