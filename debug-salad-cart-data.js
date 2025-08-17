const { chromium } = require('playwright');

async function debugSaladCartData() {
    console.log('🔍 Debugging Salad Cart Data Structure');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // Navigate to menu and add salads
        await page.goto('http://localhost:3005/menu');
        await page.waitForLoadState('networkidle');
        
        // Click on Salads category
        await page.click('text=Salads');
        await page.waitForLoadState('networkidle');
        
        // Clear existing cart data first
        await page.evaluate(() => {
            localStorage.removeItem('cartItems');
            localStorage.removeItem('menuCart');
            localStorage.removeItem('pizzaCart');
        });
        
        console.log('✅ Cleared existing cart data');
        
        // Add Caesar Salad
        console.log('🥗 Adding Caesar Salad...');
        const caesarButton = await page.locator('text=Caesar Salad').locator('..').locator('button:has-text("Add to Cart")').first();
        if (await caesarButton.isVisible()) {
            await caesarButton.click();
            await page.waitForTimeout(1000);
            
            // Check what was added
            const cartData1 = await page.evaluate(() => {
                return {
                    cartItems: localStorage.getItem('cartItems'),
                    menuCart: localStorage.getItem('menuCart'),
                    pizzaCart: localStorage.getItem('pizzaCart')
                };
            });
            
            console.log('After adding Caesar Salad:');
            console.log('cartItems:', cartData1.cartItems);
            console.log('menuCart:', cartData1.menuCart);
            console.log('pizzaCart:', cartData1.pizzaCart);
        }
        
        // Add Garden Salad (if available)
        console.log('🥗 Adding second salad...');
        const allAddButtons = await page.locator('button:has-text("Add to Cart")').all();
        if (allAddButtons.length > 1) {
            await allAddButtons[1].click();
            await page.waitForTimeout(1000);
        }
        
        // Final cart data check
        const finalCartData = await page.evaluate(() => {
            return {
                cartItems: localStorage.getItem('cartItems'),
                menuCart: localStorage.getItem('menuCart'),
                pizzaCart: localStorage.getItem('pizzaCart')
            };
        });
        
        console.log('\n📊 FINAL CART DATA:');
        console.log('===================');
        console.log('cartItems:', finalCartData.cartItems);
        console.log('menuCart:', finalCartData.menuCart);
        console.log('pizzaCart:', finalCartData.pizzaCart);
        
        // Parse and analyze menuCart data
        if (finalCartData.menuCart) {
            try {
                const menuCartParsed = JSON.parse(finalCartData.menuCart);
                console.log('\n🔍 PARSED MENU CART ANALYSIS:');
                console.log(`Number of items: ${menuCartParsed.length}`);
                
                menuCartParsed.forEach((item, index) => {
                    console.log(`\nItem ${index + 1}:`);
                    console.log(`  ID: ${item.id}`);
                    console.log(`  MenuItemId: ${item.menuItemId}`);
                    console.log(`  Name: ${item.name}`);
                    console.log(`  BasePrice: ${item.basePrice}`);
                    console.log(`  TotalPrice: ${item.totalPrice}`);
                    console.log(`  Quantity: ${item.quantity}`);
                    console.log(`  Price field: ${item.price || 'undefined'}`);
                });
            } catch (parseError) {
                console.error('❌ Error parsing menuCart:', parseError);
            }
        }
        
        // Now navigate to cart page and see what happens
        console.log('\n🛒 Navigating to cart page...');
        await page.goto('http://localhost:3005/cart');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000); // Wait for React to load cart data
        
        // Check what cart page sees
        const cartPageData = await page.evaluate(() => {
            // Access React state if possible
            const cartItems = document.querySelectorAll('[data-testid="cart-item"]');
            const menuItems = document.querySelectorAll('[data-testid="menu-item"]');
            const priceElements = document.querySelectorAll('.price, [class*="price"], [data-testid*="price"]');
            
            return {
                cartItemsCount: cartItems.length,
                menuItemsCount: menuItems.length,
                priceElements: Array.from(priceElements).map(el => el.textContent),
                totalText: document.querySelector('[data-testid="cart-total"], .total, [class*="total"]')?.textContent || 'Not found',
                allText: document.body.textContent
            };
        });
        
        console.log('\n🎯 CART PAGE ANALYSIS:');
        console.log('======================');
        console.log(`Cart items visible: ${cartPageData.cartItemsCount}`);
        console.log(`Menu items visible: ${cartPageData.menuItemsCount}`);
        console.log(`Price elements: ${JSON.stringify(cartPageData.priceElements)}`);
        console.log(`Total text: ${cartPageData.totalText}`);
        
        // Check for zero or $0.00 values
        const hasZeroValues = cartPageData.priceElements.some(price => 
            price && (price.includes('$0.00') || price.includes('$0') || price === '0')
        );
        
        const hasEmptyCart = cartPageData.allText.includes('Your cart is empty');
        
        console.log(`Has zero values: ${hasZeroValues}`);
        console.log(`Shows empty cart: ${hasEmptyCart}`);
        
        // Take final screenshot
        await page.screenshot({ path: 'debug-cart-state.png' });
        
        console.log('\n🏁 SUMMARY:');
        console.log('===========');
        if (finalCartData.menuCart && JSON.parse(finalCartData.menuCart).length > 0) {
            console.log('✅ Items successfully added to localStorage menuCart');
            
            if (hasEmptyCart) {
                console.log('❌ ISSUE CONFIRMED: Cart page shows empty despite items in localStorage');
                console.log('💡 Possible causes:');
                console.log('  - Cart page not reading from menuCart localStorage key');
                console.log('  - Data structure mismatch between stored and expected format');
                console.log('  - React state not loading localStorage data properly');
            } else if (hasZeroValues) {
                console.log('❌ ISSUE CONFIRMED: Cart shows items but with $0.00 values');
            } else {
                console.log('✅ Cart appears to be working correctly');
            }
        } else {
            console.log('❌ Items not being added to localStorage properly');
        }
        
    } catch (error) {
        console.error('❌ Debug test failed:', error);
    } finally {
        await browser.close();
    }
}

debugSaladCartData().catch(console.error);
