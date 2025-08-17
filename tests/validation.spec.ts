import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3005';

test.describe('Menu Validation System', () => {
  test.beforeEach(async ({ page }) => {
    // Any setup needed before each test
  });

  test.describe('Category Validation', () => {
    test('should create valid category successfully', async ({ request }) => {
      const validCategory = {
        name: 'Test Category ' + Date.now(),
        slug: 'test-category-' + Date.now(),
        description: 'A test category for validation',
        isActive: true,
        sortOrder: 1
      };

      const response = await request.post(`${BASE_URL}/api/admin/menu/categories`, {
        data: validCategory,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(response.status()).toBe(200);
      const responseData = await response.json();
      expect(responseData.success).toBe(true);
      expect(responseData.data.name).toBe(validCategory.name);
    });

    test('should reject category with empty name', async ({ request }) => {
      const invalidCategory = {
        name: '',
        slug: 'empty-name-test-' + Date.now(),
        description: 'This should fail validation'
      };

      const response = await request.post(`${BASE_URL}/api/admin/menu/categories`, {
        data: invalidCategory,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(response.status()).toBe(400);
      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.error).toContain('validation failed');
      expect(responseData.details).toContain('Category name is required');
    });

    test('should reject category with invalid slug format', async ({ request }) => {
      const invalidCategory = {
        name: 'Valid Name',
        slug: 'Invalid Slug With Spaces!',
        description: 'This should fail validation'
      };

      const response = await request.post(`${BASE_URL}/api/admin/menu/categories`, {
        data: invalidCategory,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      expect(response.status()).toBe(400);
      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.details).toContain('slug must contain only lowercase letters');
    });

    test('should reject category with duplicate slug', async ({ request }) => {
      const uniqueSlug = 'duplicate-test-' + Date.now();
      
      // Create first category
      const firstCategory = {
        name: 'First Category',
        slug: uniqueSlug,
        description: 'First category'
      };

      await request.post(`${BASE_URL}/api/admin/menu/categories`, {
        data: firstCategory,
        headers: { 'Content-Type': 'application/json' }
      });

      // Try to create second category with same slug
      const duplicateCategory = {
        name: 'Second Category',
        slug: uniqueSlug,
        description: 'Duplicate slug category'
      };

      const response = await request.post(`${BASE_URL}/api/admin/menu/categories`, {
        data: duplicateCategory,
        headers: { 'Content-Type': 'application/json' }
      });

      expect(response.status()).toBe(400);
      const responseData = await response.json();
      expect(responseData.error).toContain('slug already exists');
    });
  });

  test.describe('Menu Item Validation', () => {
    let categoryId: string;

    test.beforeEach(async ({ request }) => {
      // Create a test category first
      const testCategory = {
        name: 'Test Category for Items ' + Date.now(),
        slug: 'test-items-category-' + Date.now(),
        description: 'Category for testing menu items'
      };

      const categoryResponse = await request.post(`${BASE_URL}/api/admin/menu/categories`, {
        data: testCategory,
        headers: { 'Content-Type': 'application/json' }
      });

      const categoryData = await categoryResponse.json();
      categoryId = categoryData.data.id;
    });

    test('should create valid menu item successfully', async ({ request }) => {
      const validMenuItem = {
        name: 'Test Menu Item ' + Date.now(),
        categoryId: categoryId,
        basePrice: 12.99,
        description: 'A test menu item',
        isActive: true,
        isAvailable: true
      };

      const response = await request.post(`${BASE_URL}/api/admin/menu/items`, {
        data: validMenuItem,
        headers: { 'Content-Type': 'application/json' }
      });

      expect(response.status()).toBe(200);
      const responseData = await response.json();
      expect(responseData.success).toBe(true);
      expect(responseData.item.name).toBe(validMenuItem.name);
      expect(responseData.item.basePrice).toBe(validMenuItem.basePrice);
    });

    test('should reject menu item with empty name', async ({ request }) => {
      const invalidMenuItem = {
        name: '',
        categoryId: categoryId,
        basePrice: 12.99,
        description: 'Invalid item with empty name'
      };

      const response = await request.post(`${BASE_URL}/api/admin/menu/items`, {
        data: invalidMenuItem,
        headers: { 'Content-Type': 'application/json' }
      });

      expect(response.status()).toBe(400);
      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.details).toContain('Item name is required');
    });

    test('should reject menu item with negative price', async ({ request }) => {
      const invalidMenuItem = {
        name: 'Valid Name',
        categoryId: categoryId,
        basePrice: -5.99,
        description: 'Invalid item with negative price'
      };

      const response = await request.post(`${BASE_URL}/api/admin/menu/items`, {
        data: invalidMenuItem,
        headers: { 'Content-Type': 'application/json' }
      });

      expect(response.status()).toBe(400);
      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.details).toContain('Base price is required and must be a non-negative number');
    });

    test('should reject menu item without category ID', async ({ request }) => {
      const invalidMenuItem = {
        name: 'Valid Name',
        basePrice: 12.99,
        description: 'Invalid item without category'
      };

      const response = await request.post(`${BASE_URL}/api/admin/menu/items`, {
        data: invalidMenuItem,
        headers: { 'Content-Type': 'application/json' }
      });

      expect(response.status()).toBe(400);
      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.details).toContain('Category ID is required');
    });

    test('should reject menu item with invalid category ID', async ({ request }) => {
      const invalidMenuItem = {
        name: 'Valid Name',
        categoryId: 'non-existent-category-id',
        basePrice: 12.99,
        description: 'Invalid item with bad category ID'
      };

      const response = await request.post(`${BASE_URL}/api/admin/menu/items`, {
        data: invalidMenuItem,
        headers: { 'Content-Type': 'application/json' }
      });

      expect(response.status()).toBe(404);
      const responseData = await response.json();
      expect(responseData.error).toContain('Category not found');
    });
  });

  test.describe('Customization Group Validation', () => {
    test('should create valid customization group successfully', async ({ request }) => {
      const validGroup = {
        name: 'Test Group ' + Date.now(),
        type: 'SINGLE_SELECT',
        description: 'A test customization group',
        isRequired: false,
        minSelections: 0,
        maxSelections: 1
      };

      const response = await request.post(`${BASE_URL}/api/admin/menu/customization-groups`, {
        data: validGroup,
        headers: { 'Content-Type': 'application/json' }
      });

      expect(response.status()).toBe(200);
      const responseData = await response.json();
      expect(responseData.success).toBe(true);
      expect(responseData.group.name).toBe(validGroup.name);
      expect(responseData.group.type).toBe(validGroup.type);
    });

    test('should reject customization group with empty name', async ({ request }) => {
      const invalidGroup = {
        name: '',
        type: 'SINGLE_SELECT',
        description: 'Invalid group with empty name'
      };

      const response = await request.post(`${BASE_URL}/api/admin/menu/customization-groups`, {
        data: invalidGroup,
        headers: { 'Content-Type': 'application/json' }
      });

      expect(response.status()).toBe(400);
      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.details).toContain('Customization group name is required');
    });

    test('should reject customization group with invalid type', async ({ request }) => {
      const invalidGroup = {
        name: 'Test Group',
        type: 'INVALID_TYPE',
        description: 'Invalid group with bad type'
      };

      const response = await request.post(`${BASE_URL}/api/admin/menu/customization-groups`, {
        data: invalidGroup,
        headers: { 'Content-Type': 'application/json' }
      });

      expect(response.status()).toBe(400);
      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.details).toContain('Customization group type is required and must be one of');
    });

    test('should reject customization group with invalid selection constraints', async ({ request }) => {
      const invalidGroup = {
        name: 'Test Group',
        type: 'MULTI_SELECT',
        minSelections: 5,
        maxSelections: 2  // min > max should fail
      };

      const response = await request.post(`${BASE_URL}/api/admin/menu/customization-groups`, {
        data: invalidGroup,
        headers: { 'Content-Type': 'application/json' }
      });

      expect(response.status()).toBe(400);
      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.details).toContain('Minimum selections cannot be greater than maximum selections');
    });
  });

  test.describe('Customization Option Validation', () => {
    let groupId: string;

    test.beforeEach(async ({ request }) => {
      // Create a test group first
      const testGroup = {
        name: 'Test Group for Options ' + Date.now(),
        type: 'MULTI_SELECT',
        description: 'Group for testing options'
      };

      const groupResponse = await request.post(`${BASE_URL}/api/admin/menu/customization-groups`, {
        data: testGroup,
        headers: { 'Content-Type': 'application/json' }
      });

      const groupData = await groupResponse.json();
      groupId = groupData.group.id;
    });

    test('should create valid customization option successfully', async ({ request }) => {
      const validOption = {
        name: 'Test Option ' + Date.now(),
        groupId: groupId,
        description: 'A test customization option',
        priceModifier: 2.50,
        priceType: 'FLAT',
        isDefault: false,
        isActive: true
      };

      const response = await request.post(`${BASE_URL}/api/admin/menu/customization-options`, {
        data: validOption,
        headers: { 'Content-Type': 'application/json' }
      });

      expect(response.status()).toBe(200);
      const responseData = await response.json();
      expect(responseData.success).toBe(true);
      expect(responseData.data.name).toBe(validOption.name);
      expect(responseData.data.priceModifier).toBe(validOption.priceModifier);
    });

    test('should reject customization option with empty name', async ({ request }) => {
      const invalidOption = {
        name: '',
        groupId: groupId,
        description: 'Invalid option with empty name'
      };

      const response = await request.post(`${BASE_URL}/api/admin/menu/customization-options`, {
        data: invalidOption,
        headers: { 'Content-Type': 'application/json' }
      });

      expect(response.status()).toBe(400);
      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.details).toContain('Customization option name is required');
    });

    test('should reject customization option with invalid group ID', async ({ request }) => {
      const invalidOption = {
        name: 'Valid Name',
        groupId: 'non-existent-group-id',
        description: 'Invalid option with bad group ID'
      };

      const response = await request.post(`${BASE_URL}/api/admin/menu/customization-options`, {
        data: invalidOption,
        headers: { 'Content-Type': 'application/json' }
      });

      expect(response.status()).toBe(404);
      const responseData = await response.json();
      expect(responseData.error).toContain('Customization group not found');
    });

    test('should reject customization option with extreme price modifier', async ({ request }) => {
      const invalidOption = {
        name: 'Valid Name',
        groupId: groupId,
        priceModifier: 150.00  // Should trigger warning/validation
      };

      const response = await request.post(`${BASE_URL}/api/admin/menu/customization-options`, {
        data: invalidOption,
        headers: { 'Content-Type': 'application/json' }
      });

      expect(response.status()).toBe(400);
      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.details).toContain('Price modifier must be between -100 and 100');
    });
  });

  test.describe('Cart Data Validation', () => {
    test('should validate cart data integrity in browser', async ({ page }) => {
      await page.goto(`${BASE_URL}/cart`);
      
      // Inject our cart validation script
      const validationResult = await page.evaluate(() => {
        const cartData = localStorage.getItem('menuCart');
        const cartItems = localStorage.getItem('cartItems');
        
        if (!cartData && !cartItems) {
          return { isValid: true, message: 'No cart data found - nothing to validate' };
        }
        
        const issues: string[] = [];
        
        try {
          if (cartData) {
            const cart = JSON.parse(cartData);
            if (cart.items && Array.isArray(cart.items)) {
              cart.items.forEach((item: any, index: number) => {
                if (!item.name || item.name.trim().length === 0) {
                  issues.push(`Cart item ${index}: Missing or empty name`);
                }
                if (item.price === undefined && item.totalPrice === undefined && item.finalPrice === undefined) {
                  issues.push(`Cart item ${index}: No price fields found`);
                }
              });
            }
          }
          
          if (cartItems) {
            const items = JSON.parse(cartItems);
            if (Array.isArray(items)) {
              items.forEach((item: any, index: number) => {
                if (!item.name || item.name.trim().length === 0) {
                  issues.push(`CartItems[${index}]: Missing or empty name`);
                }
              });
            }
          }
          
          return {
            isValid: issues.length === 0,
            issues: issues,
            message: issues.length === 0 ? 'All cart data is valid' : `Found ${issues.length} validation issues`
          };
          
        } catch (error: any) {
          return {
            isValid: false,
            message: `Error parsing cart data: ${error.message}`
          };
        }
      });

      expect(validationResult.isValid).toBe(true);
      if (!validationResult.isValid) {
        console.log('Cart validation issues:', validationResult.issues);
      }
    });

    test('should handle empty cart gracefully', async ({ page }) => {
      await page.goto(`${BASE_URL}/cart`);
      
      // Clear cart data and verify it handles empty state
      await page.evaluate(() => {
        localStorage.removeItem('menuCart');
        localStorage.removeItem('cartItems');
      });
      
      await page.reload();
      
      // Should not throw errors and show empty cart message
      const cartContent = await page.textContent('[data-testid="cart-content"], .cart-content, main');
      expect(cartContent).toBeTruthy();
    });
  });
});
