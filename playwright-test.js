const { chromium } = require('playwright');

async function testCloneButton() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // Slow down to see what's happening
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('🚀 Starting Playwright test for clone button...');
    
    // 1. Navigate to login page
    console.log('📝 1. Going to login page...');
    await page.goto('http://localhost:3005/admin/login');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of login page
    await page.screenshot({ path: 'step1-login-page.png' });
    console.log('📸 Screenshot saved: step1-login-page.png');
    
    // 2. Login with admin credentials
    console.log('🔐 2. Logging in...');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot after login
    await page.screenshot({ path: 'step2-after-login.png' });
    console.log('📸 Screenshot saved: step2-after-login.png');
    
    // 3. Navigate to customization groups
    console.log('🔄 3. Going to customization groups page...');
    await page.goto('http://localhost:3005/admin/menu-manager/customization-groups');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more for any dynamic content
    await page.waitForTimeout(2000);
    
    // Take screenshot of groups page
    await page.screenshot({ path: 'step3-groups-page.png', fullPage: true });
    console.log('📸 Screenshot saved: step3-groups-page.png');
    
    // 4. Analyze the page content
    console.log('🔍 4. Analyzing page content...');
    
    const pageTitle = await page.textContent('h1');
    console.log('Page title:', pageTitle);
    
    // Look for clone buttons
    const cloneButtons = await page.locator('button:has-text("Clone")').count();
    console.log(`Found ${cloneButtons} clone buttons`);
    
    // Look for customization group cards
    const groupCards = await page.locator('[class*="bg-white"][class*="p-6"]').count();
    console.log(`Found ${groupCards} group cards`);
    
    // Check for any error messages
    const errorText = await page.textContent('body');
    if (errorText.includes('error') || errorText.includes('Error')) {
      console.log('⚠️ Page contains error text');
    }
    
    // Look for specific text patterns
    const hasGroupsText = errorText.includes('Customization Groups');
    const hasNoGroupsText = errorText.includes('No customization groups found');
    console.log('Has "Customization Groups" text:', hasGroupsText);
    console.log('Has "No groups found" text:', hasNoGroupsText);
    
    // If we found clone buttons, try to click one
    if (cloneButtons > 0) {
      console.log('✅ Found clone buttons! Testing click...');
      await page.locator('button:has-text("Clone")').first().click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'step4-after-clone-click.png' });
      console.log('📸 Screenshot saved: step4-after-clone-click.png');
    } else {
      console.log('❌ No clone buttons found!');
      
      // Let's check what buttons ARE on the page
      const allButtons = await page.locator('button').count();
      console.log(`Total buttons on page: ${allButtons}`);
      
      // Get text of all buttons
      const buttonTexts = await page.locator('button').allTextContents();
      console.log('Button texts:', buttonTexts);
    }
    
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
    await page.screenshot({ path: 'error-screenshot.png' });
    console.log('📸 Error screenshot saved: error-screenshot.png');
  } finally {
    await browser.close();
  }
}

testCloneButton();
