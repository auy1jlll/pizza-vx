const { chromium } = require('playwright');

async function testCartRemoval() {
    console.log('🔍 Testing Cart Removal - Floating Button Update');
    console.log('Scenario: Add items → Remove items → Check if floating cart updates');
    
    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000
    });
    
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        // Clear cart and start fresh
        await page.goto('http://localhost:3005');
        await page.evaluate(() => localStorage.clear());
        
        console.log('\n📝 Step 1: Add items to cart');
        
        // Add 1 pizza
        await page.goto('http://localhost:3005/pizza-builder');
        await page.waitForLoadState('networkidle');
        const addPizzaButton = await page.locator('button:has-text("Add to Cart"), button:has-text("Add Pizza")').first();
        if (await addPizzaButton.isVisible()) {
            await addPizzaButton.click();
            await page.waitForTimeout(1000);
            console.log('   ✅ Added 1 pizza');
        }
        
        // Add 2 salads
        await page.goto('http://localhost:3005/menu/salads');
        await page.waitForLoadState('networkidle');
        
        for (let i = 1; i <= 2; i++) {
            const addSaladButton = await page.locator('button:has-text("Add")').first();
            if (await addSaladButton.isVisible()) {
                await addSaladButton.click();
                await page.waitForTimeout(500);
                
                const addToCartButton = await page.locator('button:has-text("Add to Cart")').first();
                if (await addToCartButton.isVisible()) {
                    await addToCartButton.click();
                    await page.waitForTimeout(1000);
                    console.log(`   ✅ Added salad ${i}`);
                }
            }
        }
        
        // Check initial cart count
        let cartCount = await page.evaluate(() => {
            const cartIcon = document.querySelector('.fixed.bottom-6.right-6 span');
            return cartIcon ? cartIcon.textContent.trim() : 'not found';
        });
        console.log(`\n🛒 Initial cart count: ${cartCount} (should be 3)`);
        
        console.log('\n📝 Step 2: Go to cart page and remove items');
        
        // Go to cart page
        await page.goto('http://localhost:3005/cart');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000); // Wait for prices to load
        
        console.log('\n🔍 Finding minus buttons...');
        
        // Find all minus buttons
        const minusButtons = await page.locator('button:has(svg)').all();
        console.log(`Found ${minusButtons.length} potential buttons`);
        
        // Look for minus buttons specifically
        const minusButtonElements = await page.evaluate(() => {
            // Look for buttons containing minus icons or minus text
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons
                .map((btn, index) => ({
                    index,
                    text: btn.textContent?.trim() || '',
                    innerHTML: btn.innerHTML.substring(0, 100),
                    hasMinusIcon: btn.innerHTML.includes('minus') || btn.innerHTML.includes('Minus') || btn.innerHTML.includes('-'),
                    isVisible: window.getComputedStyle(btn).display !== 'none'
                }))
                .filter(btn => btn.hasMinusIcon && btn.isVisible);
        });
        
        console.log(`Found ${minusButtonElements.length} minus buttons:`);
        minusButtonElements.forEach((btn, i) => {
            console.log(`   ${i + 1}. Button ${btn.index}: "${btn.text}" (${btn.hasMinusIcon ? 'has minus' : 'no minus'})`);
        });
        
        if (minusButtonElements.length > 0) {
            console.log('\n📝 Step 3: Click minus buttons to remove items');
            
            // Click the first minus button
            const firstMinusBtn = await page.locator('button').nth(minusButtonElements[0].index);
            await firstMinusBtn.click();
            await page.waitForTimeout(1000);
            console.log('   🖱️ Clicked first minus button');
            
            // Check cart count after first removal
            cartCount = await page.evaluate(() => {
                const cartIcon = document.querySelector('.fixed.bottom-6.right-6 span');
                return cartIcon ? cartIcon.textContent.trim() : 'not found';
            });
            console.log(`   🛒 Cart count after 1st removal: ${cartCount} (should be 2)`);
            
            // Click second minus button if available
            if (minusButtonElements.length > 1) {
                const secondMinusBtn = await page.locator('button').nth(minusButtonElements[1].index);
                await secondMinusBtn.click();
                await page.waitForTimeout(1000);
                console.log('   🖱️ Clicked second minus button');
                
                // Check cart count after second removal
                cartCount = await page.evaluate(() => {
                    const cartIcon = document.querySelector('.fixed.bottom-6.right-6 span');
                    return cartIcon ? cartIcon.textContent.trim() : 'not found';
                });
                console.log(`   🛒 Cart count after 2nd removal: ${cartCount} (should be 1)`);
            }
        } else {
            console.log('❌ No minus buttons found - checking cart page structure...');
            
            // Debug: show all buttons on the page
            const allButtons = await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                return buttons.map((btn, index) => ({
                    index,
                    text: btn.textContent?.trim() || '',
                    innerHTML: btn.innerHTML.substring(0, 200),
                    classes: btn.className
                }));
            });
            
            console.log('\nAll buttons found on cart page:');
            allButtons.forEach((btn, i) => {
                console.log(`   ${i + 1}. "${btn.text}" | Classes: ${btn.classes}`);
                console.log(`      HTML: ${btn.innerHTML}`);
            });
        }
        
        console.log('\n📝 Step 4: Final verification');
        
        // Check final storage state
        const finalState = await page.evaluate(() => {
            const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            const menuCart = JSON.parse(localStorage.getItem('menuCart') || '[]');
            
            return {
                pizzaCount: cartItems.length,
                menuCount: menuCart.length,
                expectedTotal: cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0) + 
                              menuCart.reduce((sum, item) => sum + item.quantity, 0)
            };
        });
        
        const finalCartCount = await page.evaluate(() => {
            const cartIcon = document.querySelector('.fixed.bottom-6.right-6 span');
            return cartIcon ? cartIcon.textContent.trim() : 'not found';
        });
        
        console.log('\n📊 Final Results:');
        console.log(`   Storage: ${finalState.pizzaCount} pizzas + ${finalState.menuCount} menu items = ${finalState.expectedTotal} total`);
        console.log(`   Cart icon shows: ${finalCartCount}`);
        
        if (finalCartCount === finalState.expectedTotal.toString()) {
            console.log('   ✅ SUCCESS: Cart icon matches expected count');
        } else {
            console.log('   ❌ FAIL: Cart icon does not match expected count');
        }
        
        await page.screenshot({ path: 'cart-removal-test.png' });
        console.log('\n📷 Screenshot saved as cart-removal-test.png');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
}

testCartRemoval().catch(console.error);
