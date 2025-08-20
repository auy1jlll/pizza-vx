const { chromium } = require('playwright');

async function testCloneButton() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Testing Clone Button Visibility...');
    
    // Navigate to the login page first
    console.log('📝 Logging in...');
    await page.goto('http://localhost:3005/admin/login');
    await page.waitForLoadState('networkidle');
    
    // Login (assuming standard admin credentials)
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Navigate to customization groups page
    console.log('🔄 Navigating to customization groups...');
    await page.goto('http://localhost:3005/admin/menu-manager/customization-groups');
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot of the full page
    console.log('📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'customization-groups-page.png', 
      fullPage: true 
    });
    
    // Check for clone buttons
    console.log('🔍 Looking for clone buttons...');
    const cloneButtons = await page.locator('button:has-text("Clone")').count();
    console.log(`Found ${cloneButtons} clone buttons on the page`);
    
    // Check for customization group cards
    const groupCards = await page.locator('[class*="bg-white"][class*="p-6"][class*="rounded-lg"]').count();
    console.log(`Found ${groupCards} customization group cards`);
    
    // Get all visible text containing "Clone"
    const cloneTexts = await page.locator('text=Clone').allTextContents();
    console.log('Clone text elements found:', cloneTexts);
    
    // Check if there are any buttons with FiCopy icon
    const copyIcons = await page.locator('svg').count();
    console.log(`Found ${copyIcons} SVG icons (including potential copy icons)`);
    
    // Check page title
    const pageTitle = await page.locator('h1').first().textContent();
    console.log('Page title:', pageTitle);
    
    // Check if any error messages
    const errorMessages = await page.locator('text=error').count();
    console.log(`Found ${errorMessages} error messages`);
    
    // Get the page HTML for debugging
    const pageContent = await page.content();
    console.log('Page loaded successfully, content length:', pageContent.length);
    
    console.log('✅ Test completed. Check customization-groups-page.png for visual verification.');
    
  } catch (error) {
    console.error('❌ Error during test:', error);
    await page.screenshot({ path: 'error-page.png' });
  } finally {
    await browser.close();
  }
}

testCloneButton();
