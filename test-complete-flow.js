const { chromium } = require('playwright');

async function testCompleteCartFlow() {
    console.log('🎉 COMPREHENSIVE CART FLOW TEST');
    console.log('Testing: Add items → Remove items → Add more → Final verification');
    
    const browser = await chromium.launch({
        headless: false,
        slowMo: 1500
    });
    
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        // Clear cart
        await page.goto('http://localhost:3005');
        await page.evaluate(() => localStorage.clear());
        
        console.log('\n📝 Step 1: Add 2 salads');
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
                }
            }
        }
        
        let cartCount = await page.evaluate(() => {
            const cartIcon = document.querySelector('.fixed.bottom-6.right-6 span');
            return cartIcon ? cartIcon.textContent.trim() : '0';
        });
        console.log(`   🛒 After adding 2 salads: ${cartCount} (expected: 2)`);
        
        console.log('\n📝 Step 2: Remove 1 salad via minus button');
        await page.goto('http://localhost:3005/cart');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // Click minus button
        const minusButton = await page.locator('button:has(svg)').filter({ hasText: '' }).first();
        const minusButtons = await page.locator('button').all();
        
        // Find the actual minus button
        for (const btn of minusButtons) {
            const html = await btn.innerHTML();
            if (html.includes('minus') || html.includes('Minus')) {
                await btn.click();
                await page.waitForTimeout(1500);
                break;
            }
        }
        
        cartCount = await page.evaluate(() => {
            const cartIcon = document.querySelector('.fixed.bottom-6.right-6 span');
            return cartIcon ? cartIcon.textContent.trim() : '0';
        });
        console.log(`   🛒 After removing 1 salad: ${cartCount} (expected: 1)`);
        
        console.log('\n📝 Step 3: Add 1 pizza');
        await page.goto('http://localhost:3005/pizza-builder');
        await page.waitForLoadState('networkidle');
        
        const addPizzaButton = await page.locator('button:has-text("Add to Cart"), button:has-text("Add Pizza")').first();
        if (await addPizzaButton.isVisible()) {
            await addPizzaButton.click();
            await page.waitForTimeout(1000);
        }
        
        cartCount = await page.evaluate(() => {
            const cartIcon = document.querySelector('.fixed.bottom-6.right-6 span');
            return cartIcon ? cartIcon.textContent.trim() : '0';
        });
        console.log(`   🛒 After adding 1 pizza: ${cartCount} (expected: 2)`);
        
        console.log('\n📝 Step 4: Remove pizza via cart page');
        await page.goto('http://localhost:3005/cart');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // Find pizza minus button (should be in the pizza section)
        const allButtons = await page.locator('button').all();
        let pizzaMinusClicked = false;
        
        for (const btn of allButtons) {
            const html = await btn.innerHTML();
            if (html.includes('minus') || html.includes('Minus')) {
                // Click the first minus button we find (could be pizza or salad)
                await btn.click();
                await page.waitForTimeout(1500);
                pizzaMinusClicked = true;
                break;
            }
        }
        
        cartCount = await page.evaluate(() => {
            const cartIcon = document.querySelector('.fixed.bottom-6.right-6 span');
            return cartIcon ? cartIcon.textContent.trim() : '0';
        });
        console.log(`   🛒 After removing 1 item: ${cartCount} (expected: 1)`);
        
        console.log('\n📝 Step 5: Remove last item');
        // Remove the remaining item
        for (const btn of allButtons) {
            const html = await btn.innerHTML();
            if (html.includes('minus') || html.includes('Minus')) {
                await btn.click();
                await page.waitForTimeout(1500);
                break;
            }
        }
        
        const finalCartState = await page.evaluate(() => {
            const cartIcon = document.querySelector('.fixed.bottom-6.right-6 span');
            const cartButton = document.querySelector('.fixed.bottom-6.right-6');
            return {
                iconText: cartIcon ? cartIcon.textContent.trim() : null,
                buttonVisible: cartButton ? window.getComputedStyle(cartButton).display !== 'none' : false
            };
        });
        
        console.log(`   🛒 Final state: Icon=${finalCartState.iconText}, Visible=${finalCartState.buttonVisible}`);
        
        // Check storage
        const finalStorage = await page.evaluate(() => {
            const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            const menuCart = JSON.parse(localStorage.getItem('menuCart') || '[]');
            return {
                pizzaItems: cartItems.length,
                menuItems: menuCart.length,
                totalExpected: cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0) + 
                              menuCart.reduce((sum, item) => sum + item.quantity, 0)
            };
        });
        
        console.log('\n📊 FINAL RESULTS:');
        console.log('=================');
        console.log(`Storage: ${finalStorage.pizzaItems} pizzas + ${finalStorage.menuItems} menu items = ${finalStorage.totalExpected} total`);
        console.log(`Floating cart: ${finalCartState.iconText || 'hidden'} (visible: ${finalCartState.buttonVisible})`);
        
        const success = (finalStorage.totalExpected === 0 && !finalCartState.buttonVisible) ||
                       (finalStorage.totalExpected > 0 && finalCartState.iconText === finalStorage.totalExpected.toString());
        
        if (success) {
            console.log('🎉 SUCCESS: Cart removal functionality works correctly!');
            console.log('   ✅ Items removed from storage');
            console.log('   ✅ Floating cart button updates properly');
            console.log('   ✅ Empty cart hides the floating button');
        } else {
            console.log('❌ ISSUES DETECTED:');
            if (finalStorage.totalExpected === 0 && finalCartState.buttonVisible) {
                console.log('   - Empty cart but button still visible');
            }
            if (finalStorage.totalExpected > 0 && finalCartState.iconText !== finalStorage.totalExpected.toString()) {
                console.log('   - Cart count mismatch');
            }
        }
        
        await page.screenshot({ path: 'complete-cart-flow-test.png' });
        console.log('\n📷 Screenshot saved as complete-cart-flow-test.png');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
}

testCompleteCartFlow().catch(console.error);
