// Simple test to check what's happening with the dinner plates page
const { test, expect } = require('@playwright/test');

test('Debug dinner plates page', async ({ page }) => {
  console.log('🔍 Navigating to dinner plates page...');
  
  // Listen for network requests
  const apiRequests = [];
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      apiRequests.push(request.url());
    }
  });
  
  const apiResponses = [];
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      apiResponses.push(`${response.status()} ${response.url()}`);
    }
  });
  
  // Navigate to the page
  await page.goto('/menu/dinner-plates');
  
  // Wait a moment for any loading
  await page.waitForTimeout(3000);
  
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
  
  // Look for specific text
  const allText = await page.locator('body').textContent();
  const hasAtlanticSalmon = allText?.includes('Atlantic Salmon');
  const hasShrimScampi = allText?.includes('Shrimp Scampi');
  const hasChickenChips = allText?.includes('Chicken and Chips');
  const hasFailedToLoad = allText?.includes('Failed to load');
  const hasNoItems = allText?.includes('No items');
  
  console.log('🐟 Page contains Atlantic Salmon:', hasAtlanticSalmon);
  console.log('🍤 Page contains Shrimp Scampi:', hasShrimScampi);
  console.log('🍗 Page contains Chicken and Chips:', hasChickenChips);
  console.log('❌ Page contains "Failed to load":', hasFailedToLoad);
  console.log('📭 Page contains "No items":', hasNoItems);
  
  console.log('🌐 API requests made:', apiRequests);
  console.log('📡 API responses:', apiResponses);
  
  // Take a screenshot for debugging
  await page.screenshot({ path: 'debug-dinner-plates.png', fullPage: true });
  console.log('📸 Screenshot saved as debug-dinner-plates.png');
});
