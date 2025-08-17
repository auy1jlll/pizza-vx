const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testSaladCartIssue() {
    console.log('🥗 Starting MCP Visual Test: Salad Cart Issue');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000  // Slow down for better visibility
    });
    
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });
    
    const page = await context.newPage();
    
    try {
        // Step 1: Navigate to the menu page
        console.log('📍 Step 1: Navigate to menu page');
        await page.goto('http://localhost:3005/menu');
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: 'screenshots/01-menu-page.png' });
        
        // Step 2: Navigate to salads category
        console.log('📍 Step 2: Navigate to salads category');
        await page.click('text=Salads');
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: 'screenshots/02-salads-category.png' });
        
        // Step 3: Check initial cart count
        console.log('📍 Step 3: Check initial cart count');
        const initialCartCount = await page.textContent('[data-testid="cart-count"]').catch(() => '0');
        console.log(`Initial cart count: ${initialCartCount}`);
        
        // Step 4: Add first salad item (Caesar Salad)
        console.log('📍 Step 4: Add first salad item (Caesar Salad)');
        const caesarAddButton = await page.locator('text=Caesar Salad').locator('..').locator('button:has-text("Add to Cart")').first();
        if (await caesarAddButton.isVisible()) {
            await caesarAddButton.click();
            await page.waitForTimeout(1000);
            await page.screenshot({ path: 'screenshots/03-after-first-salad.png' });
            
            // Check cart count after first item
            const cartCountAfterFirst = await page.textContent('[data-testid="cart-count"]').catch(() => '0');
            console.log(`Cart count after first salad: ${cartCountAfterFirst}`);
        } else {
            console.log('❌ Caesar Salad Add to Cart button not found');
        }
        
        // Step 5: Add second salad item (Garden Salad if available)
        console.log('📍 Step 5: Add second salad item');
        const secondSaladButton = await page.locator('button:has-text("Add to Cart")').nth(1);
        if (await secondSaladButton.isVisible()) {
            await secondSaladButton.click();
            await page.waitForTimeout(1000);
            await page.screenshot({ path: 'screenshots/04-after-second-salad.png' });
            
            // Check cart count after second item
            const cartCountAfterSecond = await page.textContent('[data-testid="cart-count"]').catch(() => '0');
            console.log(`Cart count after second salad: ${cartCountAfterSecond}`);
        } else {
            console.log('❌ Second salad Add to Cart button not found');
        }
        
        // Step 6: Navigate to cart page
        console.log('📍 Step 6: Navigate to cart page');
        await page.goto('http://localhost:3005/cart');
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: 'screenshots/05-cart-page.png' });
        
        // Step 7: Check cart contents
        console.log('📍 Step 7: Analyze cart contents');
        const cartItems = await page.locator('[data-testid="cart-item"]').count();
        console.log(`Number of items in cart: ${cartItems}`);
        
        // Check for $0.00 or zero values
        const prices = await page.locator('.price, [class*="price"], [data-testid*="price"]').allTextContents();
        console.log('All price elements found:', prices);
        
        const zeroValues = prices.filter(price => 
            price.includes('$0.00') || 
            price.includes('$0') || 
            price === '0' ||
            price.includes('NaN')
        );
        
        if (zeroValues.length > 0) {
            console.log('🚨 ZERO VALUES DETECTED:', zeroValues);
        }
        
        // Check cart total
        const cartTotal = await page.textContent('[data-testid="cart-total"], .total, [class*="total"]').catch(() => 'Not found');
        console.log(`Cart total: ${cartTotal}`);
        
        // Step 8: Proceed to checkout to see order summary
        console.log('📍 Step 8: Proceed to checkout');
        const checkoutButton = await page.locator('button:has-text("Checkout"), button:has-text("Proceed")').first();
        if (await checkoutButton.isVisible()) {
            await checkoutButton.click();
            await page.waitForLoadState('networkidle');
            await page.screenshot({ path: 'screenshots/06-checkout-order-summary.png' });
            
            // Check order summary
            const orderTotal = await page.textContent('[data-testid="order-total"], .order-total, [class*="total"]').catch(() => 'Not found');
            console.log(`Order summary total: ${orderTotal}`);
        } else {
            console.log('❌ Checkout button not found');
        }
        
        // Step 9: Check localStorage for cart data
        console.log('📍 Step 9: Check localStorage cart data');
        const cartData = await page.evaluate(() => {
            return {
                cartItems: localStorage.getItem('cartItems'),
                menuCart: localStorage.getItem('menuCart'),
                pizzaCart: localStorage.getItem('pizzaCart')
            };
        });
        
        console.log('LocalStorage cart data:');
        console.log('cartItems:', cartData.cartItems);
        console.log('menuCart:', cartData.menuCart);
        console.log('pizzaCart:', cartData.pizzaCart);
        
        // Final analysis
        console.log('\n🔍 ISSUE ANALYSIS:');
        console.log('===================');
        
        if (zeroValues.length > 0) {
            console.log('✅ ISSUE REPRODUCED: Zero values found in cart');
            console.log('Zero values detected:', zeroValues);
        } else {
            console.log('❌ Issue not reproduced - no zero values found');
        }
        
        console.log('\n📊 TEST SUMMARY:');
        console.log(`Initial cart count: ${initialCartCount}`);
        console.log(`Items in cart page: ${cartItems}`);
        console.log(`Cart total: ${cartTotal}`);
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        await page.screenshot({ path: 'screenshots/error-state.png' });
    } finally {
        await browser.close();
        console.log('🏁 Test completed. Check screenshots/ folder for visual evidence.');
    }
}

// Create screenshots directory
if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
}

testSaladCartIssue().catch(console.error);
