// Simple test to check what's happening with the dinner plates page
const { test, expect } = require('@playwright/test');

test('Debug dinner plates page', async ({ page }) => {
  console.log('🔍 Navigating to dinner plates page...');
  
  // Navigate to the page
  await page.goto('/menu/dinner-plates');
  
  // Wait a moment for any loading
  await page.waitForTimeout(2000);
  
  // Check the page title
  const title = await page.title();
  console.log('📄 Page title:', title);
  
  // Check for any error messages
  const errorMessages = await page.locator('[role="alert"], .error, .error-message').allTextContents();
  if (errorMessages.length > 0) {
    console.log('❌ Error messages found:', errorMessages);
  }
  
  // Check for loading indicators
  const loadingIndicators = await page.locator('.loading, .spinner, [data-loading]').count();
  console.log('⏳ Loading indicators:', loadingIndicators);
  
  // Check for menu items
  const menuItems = await page.locator('[data-testid="menu-item"], .menu-item, .item').count();
  console.log('🍽️ Menu items found:', menuItems);
  
  // Get all text content to see what's actually on the page
  const bodyText = await page.locator('body').textContent();
  const hasAtlanticSalmon = bodyText?.includes('Atlantic Salmon');
  const hasShrimScampi = bodyText?.includes('Shrimp Scampi');
  const hasChickenChips = bodyText?.includes('Chicken and Chips');
  
  console.log('🐟 Page contains Atlantic Salmon:', hasAtlanticSalmon);
  console.log('🍤 Page contains Shrimp Scampi:', hasShrimScampi);
  console.log('🍗 Page contains Chicken and Chips:', hasChickenChips);
  
  // Check network tab for any failed requests
  const failedRequests = [];
  page.on('response', response => {
    if (!response.ok()) {
      failedRequests.push(`${response.status()} ${response.url()}`);
    }
  });
  
  // Wait a bit more and check again
  await page.waitForTimeout(3000);
  
  if (failedRequests.length > 0) {
    console.log('🚫 Failed requests:', failedRequests);
  }
  
  // Take a screenshot for debugging
  await page.screenshot({ path: 'debug-dinner-plates.png', fullPage: true });
  console.log('📸 Screenshot saved as debug-dinner-plates.png');
});
