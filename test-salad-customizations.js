const { chromium } = require('playwright');
const fs = require('fs');

async function testSaladCartWithCustomizations() {
    console.log('🥗 Testing Salad Cart with Customizations');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000
    });
    
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });
    
    const page = await context.newPage();
    
    try {
        // Step 1: Clear cart and navigate to salads
        console.log('📍 Step 1: Navigate to salads category');
        await page.goto('http://localhost:3005/menu/salads');
        await page.waitForLoadState('networkidle');
        
        // Clear existing cart data first
        await page.evaluate(() => {
            localStorage.removeItem('cartItems');
            localStorage.removeItem('menuCart');
            localStorage.removeItem('pizzaCart');
        });
        
        await page.screenshot({ path: 'screenshots/salads-01-category-page.png' });
        
        // Step 2: Click "Add" on Caesar Salad to expand customizations
        console.log('📍 Step 2: Click Add on Caesar Salad');
        const caesarAddButton = await page.locator('text=Caesar Salad').locator('..').locator('button:has-text("Add")').first();
        if (await caesarAddButton.isVisible()) {
            await caesarAddButton.click();
            await page.waitForTimeout(1500);
            await page.screenshot({ path: 'screenshots/salads-02-caesar-customizations.png' });
            
            // Step 3: Complete customizations and add to cart
            console.log('📍 Step 3: Complete Caesar Salad customizations');
            
            // Look for "Add to Cart" button (appears after clicking Add)
            const addToCartButton = await page.locator('button:has-text("Add to Cart")').first();
            if (await addToCartButton.isVisible()) {
                await addToCartButton.click();
                await page.waitForTimeout(1000);
                console.log('✅ Caesar Salad added to cart');
            } else {
                console.log('❌ Add to Cart button not found for Caesar Salad');
            }
        } else {
            console.log('❌ Caesar Salad Add button not found');
        }
        
        await page.screenshot({ path: 'screenshots/salads-03-after-caesar.png' });
        
        // Step 4: Add Garden Salad
        console.log('📍 Step 4: Add Garden Salad');
        const gardenAddButton = await page.locator('text=Garden Salad').locator('..').locator('button:has-text("Add")').first();
        if (await gardenAddButton.isVisible()) {
            await gardenAddButton.click();
            await page.waitForTimeout(1500);
            
            const gardenCartButton = await page.locator('button:has-text("Add to Cart")').nth(1);
            if (await gardenCartButton.isVisible()) {
                await gardenCartButton.click();
                await page.waitForTimeout(1000);
                console.log('✅ Garden Salad added to cart');
            } else {
                // Try the first "Add to Cart" button if there's only one visible
                const anyCartButton = await page.locator('button:has-text("Add to Cart")').first();
                if (await anyCartButton.isVisible()) {
                    await anyCartButton.click();
                    await page.waitForTimeout(1000);
                    console.log('✅ Garden Salad added to cart (fallback)');
                }
            }
        } else {
            console.log('❌ Garden Salad Add button not found');
        }
        
        await page.screenshot({ path: 'screenshots/salads-04-after-garden.png' });
        
        // Step 5: Check localStorage after both additions
        const cartData = await page.evaluate(() => {
            return {
                cartItems: localStorage.getItem('cartItems'),
                menuCart: localStorage.getItem('menuCart'),
                pizzaCart: localStorage.getItem('pizzaCart')
            };
        });
        
        console.log('\n📊 CART DATA AFTER ADDING SALADS:');
        console.log('cartItems:', cartData.cartItems);
        console.log('menuCart:', cartData.menuCart);
        
        if (cartData.menuCart) {
            const menuCartParsed = JSON.parse(cartData.menuCart);
            console.log(`Menu cart has ${menuCartParsed.length} items`);
            menuCartParsed.forEach((item, i) => {
                console.log(`  ${i+1}. ${item.name} - $${item.totalPrice} x ${item.quantity}`);
            });
        }
        
        // Step 6: Navigate to cart page
        console.log('📍 Step 6: Navigate to cart page');
        await page.goto('http://localhost:3005/cart');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000); // Extra wait for React to process
        
        await page.screenshot({ path: 'screenshots/salads-05-cart-page.png' });
        
        // Step 7: Analyze cart page display
        console.log('📍 Step 7: Analyze cart page');
        
        const cartPageAnalysis = await page.evaluate(() => {
            const cartItemElements = document.querySelectorAll('[data-testid="cart-item"], .cart-item, [class*="cart-item"]');
            const menuItemElements = document.querySelectorAll('[data-testid="menu-item"], .menu-item, [class*="menu-item"]');
            const priceElements = document.querySelectorAll('.price, [class*="price"], [data-testid*="price"]');
            const totalElements = document.querySelectorAll('.total, [class*="total"], [data-testid*="total"]');
            
            // Check for specific text patterns
            const bodyText = document.body.textContent || '';
            const hasEmptyCartMessage = bodyText.includes('Your cart is empty') || bodyText.includes('cart is empty');
            const hasZeroTotal = bodyText.includes('$0.00') || bodyText.includes('$0');
            
            // Get all text content for analysis
            const allPrices = Array.from(priceElements).map(el => el.textContent?.trim()).filter(Boolean);
            const allTotals = Array.from(totalElements).map(el => el.textContent?.trim()).filter(Boolean);
            
            return {
                cartItemsCount: cartItemElements.length,
                menuItemsCount: menuItemElements.length,
                priceElementsCount: priceElements.length,
                allPrices,
                allTotals,
                hasEmptyCartMessage,
                hasZeroTotal,
                pageTitle: document.title,
                bodyLength: bodyText.length
            };
        });
        
        console.log('\n🔍 CART PAGE ANALYSIS:');
        console.log('======================');
        console.log(`Cart items visible: ${cartPageAnalysis.cartItemsCount}`);
        console.log(`Menu items visible: ${cartPageAnalysis.menuItemsCount}`);
        console.log(`Price elements: ${cartPageAnalysis.priceElementsCount}`);
        console.log(`All prices found: ${JSON.stringify(cartPageAnalysis.allPrices)}`);
        console.log(`All totals found: ${JSON.stringify(cartPageAnalysis.allTotals)}`);
        console.log(`Shows empty cart: ${cartPageAnalysis.hasEmptyCartMessage}`);
        console.log(`Has zero values: ${cartPageAnalysis.hasZeroTotal}`);
        
        // Final analysis
        console.log('\n🎯 ISSUE REPRODUCTION RESULTS:');
        console.log('===============================');
        
        if (cartData.menuCart && JSON.parse(cartData.menuCart).length > 0) {
            console.log('✅ Items successfully stored in localStorage');
            
            if (cartPageAnalysis.hasEmptyCartMessage) {
                console.log('🚨 ISSUE CONFIRMED: Cart shows empty despite items in localStorage');
                console.log('🔧 This indicates the cart page is not properly reading menuCart localStorage');
            } else if (cartPageAnalysis.hasZeroTotal) {
                console.log('🚨 ISSUE CONFIRMED: Cart shows items but with zero/incorrect totals');
                console.log('🔧 This indicates price calculation or display issues');
            } else if (cartPageAnalysis.cartItemsCount === 0 && cartPageAnalysis.menuItemsCount === 0) {
                console.log('🚨 ISSUE CONFIRMED: No items visible in cart UI despite localStorage data');
                console.log('🔧 This indicates a rendering/data loading issue');
            } else {
                console.log('✅ Cart appears to be working correctly');
            }
        } else {
            console.log('❌ Items not properly stored in localStorage');
        }
        
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

testSaladCartWithCustomizations().catch(console.error);
