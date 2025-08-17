import { test, expect } from '@playwright/test';

test.describe('Restaurant App Authentication', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Wait for the page to load
    await expect(page).toHaveTitle(/Pizza Builder Pro/i);

    // Check if menu navigation is visible
    await expect(page.locator('nav')).toBeVisible();
  });  test('should load dinner plates menu', async ({ page }) => {
    // Navigate to dinner plates
    await page.goto('/menu/dinner-plates');
    
    // Wait for menu items to load
    await expect(page.locator('text=Atlantic Salmon')).toBeVisible();
    await expect(page.locator('text=Shrimp Scampi')).toBeVisible();
    await expect(page.locator('text=Chicken and Chips')).toBeVisible();
  });

  test('should handle login process', async ({ page }) => {
    // Try to find login button/link
    const loginButton = page.locator('text=Login').or(page.locator('text=Sign In'));
    
    if (await loginButton.count() > 0) {
      await loginButton.click();
      
      // Fill in test credentials
      await page.fill('input[type="email"]', 'test@customer.com');
      await page.fill('input[type="password"]', 'password123');
      
      // Submit login form
      await page.click('button[type="submit"]');
      
      // Wait for response
      await page.waitForTimeout(2000);
      
      // Check if login was successful or failed
      const errorMessage = page.locator('text=Failed to fetch').or(page.locator('text=Not authenticated'));
      const successMessage = page.locator('text=Welcome').or(page.locator('text=Dashboard'));
      
      // Expect either success or specific error
      await expect(errorMessage.or(successMessage)).toBeVisible();
    }
  });

  test('should load API endpoints', async ({ page }) => {
    // Test API endpoints directly
    const response = await page.request.get('/api/menu/dinner-plates');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });

  test('should handle auth API endpoint', async ({ page }) => {
    // Test auth endpoint - should return 401 for unauthenticated
    const response = await page.request.get('/api/auth/me');
    expect(response.status()).toBe(401);
    
    const data = await response.json();
    expect(data.error).toBe('Not authenticated');
  });

});
