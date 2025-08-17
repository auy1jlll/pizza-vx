const { chromium } = require('playwright');

async function debugCartPageLoad() {
    console.log('🔍 Debugging Cart Page Load Process');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Enable console logging from the page
    page.on('console', msg => {
        console.log(`🌐 [BROWSER] ${msg.text()}`);
    });
    
    try {
        // First, add some salad items to cart
        await page.goto('http://localhost:3005/menu/salads');
        await page.waitForLoadState('networkidle');
        
        // Clear cart first
        await page.evaluate(() => {
            localStorage.removeItem('cartItems');
            localStorage.removeItem('menuCart');
            localStorage.removeItem('pizzaCart');
        });
        
        // Add Caesar Salad
        const caesarAddButton = await page.locator('text=Caesar Salad').locator('..').locator('button:has-text("Add")').first();
        await caesarAddButton.click();
        await page.waitForTimeout(1000);
        await page.locator('button:has-text("Add to Cart")').first().click();
        await page.waitForTimeout(500);
        
        console.log('✅ Added Caesar Salad to cart');
        
        // Check localStorage state
        const cartData = await page.evaluate(() => {
            return {
                menuCart: localStorage.getItem('menuCart'),
                cartItems: localStorage.getItem('cartItems'),
                pizzaCart: localStorage.getItem('pizzaCart')
            };
        });
        
        console.log('📊 Cart data before navigation:', {
            menuCartLength: cartData.menuCart ? JSON.parse(cartData.menuCart).length : 0,
            cartItems: cartData.cartItems,
            pizzaCart: cartData.pizzaCart
        });
        
        // Now navigate to cart page and watch the loading process
        console.log('🚀 Navigating to cart page...');
        await page.goto('http://localhost:3005/cart');
        await page.waitForLoadState('networkidle');
        
        // Wait a bit more for React to load
        await page.waitForTimeout(5000);
        
        // Check final state
        const finalState = await page.evaluate(() => {
            // Check if menuItems are rendered
            const menuItemElements = document.querySelectorAll('[data-testid="menu-item"], .menu-item, [class*="menu-item"]');
            const cartItemElements = document.querySelectorAll('[data-testid="cart-item"], .cart-item, [class*="cart-item"]');
            
            // Check for specific content
            const bodyText = document.body.textContent || '';
            const hasMenuItemsHeader = bodyText.includes('Menu Items');
            const hasEmptyCart = bodyText.includes('Your cart is empty');
            
            // Check for price elements
            const priceElements = document.querySelectorAll('.price, [class*="price"], [data-testid*="price"]');
            const allPrices = Array.from(priceElements).map(el => el.textContent?.trim()).filter(Boolean);
            
            return {
                menuItemElements: menuItemElements.length,
                cartItemElements: cartItemElements.length,
                hasMenuItemsHeader,
                hasEmptyCart,
                allPrices,
                bodyText: bodyText.substring(0, 500) // First 500 chars for inspection
            };
        });
        
        console.log('\n📊 FINAL CART PAGE STATE:');
        console.log('==========================');
        console.log(`Menu item elements: ${finalState.menuItemElements}`);
        console.log(`Cart item elements: ${finalState.cartItemElements}`);
        console.log(`Has "Menu Items" header: ${finalState.hasMenuItemsHeader}`);
        console.log(`Has "empty cart" message: ${finalState.hasEmptyCart}`);
        console.log(`Price elements found: ${JSON.stringify(finalState.allPrices)}`);
        console.log(`Body text preview: ${finalState.bodyText}`);
        
        // Take final screenshot
        await page.screenshot({ path: 'debug-cart-final.png' });
        
        console.log('\n🎯 DIAGNOSIS:');
        console.log('=============');
        if (finalState.hasEmptyCart) {
            console.log('❌ Cart shows as empty - React state not loading localStorage data');
        } else if (finalState.menuItemElements === 0 && !finalState.hasMenuItemsHeader) {
            console.log('❌ No menu items rendered - possible rendering logic issue');
        } else if (finalState.menuItemElements > 0) {
            console.log('✅ Menu items are being rendered correctly');
        } else {
            console.log('🤔 Unclear state - needs further investigation');
        }
        
    } catch (error) {
        console.error('❌ Debug failed:', error);
    } finally {
        await browser.close();
    }
}

debugCartPageLoad().catch(console.error);
