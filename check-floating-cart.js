const { chromium } = require('playwright');

async function checkFloatingCartButton() {
    console.log('🔍 Checking Floating Cart Button State');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // Navigate to home page
        await page.goto('http://localhost:3005');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000); // Wait for React to load
        
        // Check current localStorage state
        const cartData = await page.evaluate(() => {
            return {
                cartItems: localStorage.getItem('cartItems'),
                menuCart: localStorage.getItem('menuCart'),
                pizzaCart: localStorage.getItem('pizzaCart')
            };
        });
        
        console.log('📊 Current localStorage state:');
        console.log('cartItems:', cartData.cartItems);
        console.log('menuCart:', cartData.menuCart);
        console.log('pizzaCart:', cartData.pizzaCart);
        
        // Check if floating cart button is visible and what it shows
        const cartButtonState = await page.evaluate(() => {
            const cartButton = document.querySelector('a[href="/cart"]');
            const cartCount = document.querySelector('a[href="/cart"] span');
            
            return {
                buttonExists: !!cartButton,
                buttonVisible: cartButton ? window.getComputedStyle(cartButton).display !== 'none' : false,
                countText: cartCount ? cartCount.textContent : null,
                buttonText: cartButton ? cartButton.textContent : null
            };
        });
        
        console.log('\n🛒 Floating cart button state:');
        console.log('Button exists:', cartButtonState.buttonExists);
        console.log('Button visible:', cartButtonState.buttonVisible);
        console.log('Count text:', cartButtonState.countText);
        console.log('Full button text:', cartButtonState.buttonText);
        
        // If the button shows 2, let's investigate where those items are coming from
        if (cartButtonState.countText === '2') {
            console.log('\n🚨 FOUND "2" IN CART COUNTER!');
            
            // Parse the localStorage data to see what's really there
            let pizzaItems = [];
            let menuItems = [];
            
            try {
                if (cartData.cartItems) {
                    pizzaItems = JSON.parse(cartData.cartItems);
                }
                if (cartData.menuCart) {
                    menuItems = JSON.parse(cartData.menuCart);
                }
                
                console.log('\n📝 Detailed analysis:');
                console.log(`Pizza items: ${pizzaItems.length}`);
                pizzaItems.forEach((item, i) => {
                    console.log(`  ${i+1}. Pizza ${item.id} - Qty: ${item.quantity || 1}`);
                });
                
                console.log(`Menu items: ${menuItems.length}`);
                menuItems.forEach((item, i) => {
                    console.log(`  ${i+1}. ${item.name} - Qty: ${item.quantity || 1}`);
                });
                
                const pizzaCount = pizzaItems.reduce((total, item) => total + (item.quantity || 1), 0);
                const menuCount = menuItems.reduce((total, item) => total + (item.quantity || 1), 0);
                const totalCalculated = pizzaCount + menuCount;
                
                console.log(`\nCalculated totals:`);
                console.log(`Pizza count: ${pizzaCount}`);
                console.log(`Menu count: ${menuCount}`);
                console.log(`Total: ${totalCalculated}`);
                
                if (totalCalculated !== 2) {
                    console.log('🚨 MISMATCH: Display shows 2 but calculation shows ' + totalCalculated);
                } else {
                    console.log('✅ Display matches calculation');
                }
                
            } catch (e) {
                console.log('Error parsing cart data:', e);
            }
        }
        
        // Take screenshot
        await page.screenshot({ path: 'floating-cart-check.png' });
        
        // If we still don't see 2, let's add some items and see what happens
        if (cartButtonState.countText !== '2') {
            console.log('\n🧪 Testing by adding items to see counter behavior...');
            
            // Add a pizza item first
            await page.goto('http://localhost:3005/pizza-builder');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);
            
            // Try to add a pizza
            const addPizzaButton = await page.locator('button:has-text("Add to Cart"), button:has-text("Add Pizza")').first();
            if (await addPizzaButton.isVisible()) {
                await addPizzaButton.click();
                await page.waitForTimeout(1000);
                console.log('✅ Added pizza to cart');
            }
            
            // Go back to home and check counter
            await page.goto('http://localhost:3005');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);
            
            const afterPizza = await page.evaluate(() => {
                const cartCount = document.querySelector('a[href="/cart"] span');
                return cartCount ? cartCount.textContent : null;
            });
            
            console.log(`After adding pizza, counter shows: ${afterPizza}`);
            
            // Add a menu item
            await page.goto('http://localhost:3005/menu/salads');
            await page.waitForLoadState('networkidle');
            
            const addButton = await page.locator('text=Caesar Salad').locator('..').locator('button:has-text("Add")').first();
            if (await addButton.isVisible()) {
                await addButton.click();
                await page.waitForTimeout(1000);
                await page.locator('button:has-text("Add to Cart")').first().click();
                await page.waitForTimeout(1000);
                console.log('✅ Added salad to cart');
            }
            
            // Check final counter
            await page.goto('http://localhost:3005');
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(2000);
            
            const finalCount = await page.evaluate(() => {
                const cartCount = document.querySelector('a[href="/cart"] span');
                return cartCount ? cartCount.textContent : null;
            });
            
            console.log(`Final counter shows: ${finalCount}`);
            
            if (finalCount === '2') {
                console.log('✅ Successfully reproduced the "2 items" display');
            }
        }
        
    } catch (error) {
        console.error('❌ Check failed:', error);
    } finally {
        await browser.close();
    }
}

checkFloatingCartButton().catch(console.error);
