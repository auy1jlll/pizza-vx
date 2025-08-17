const { chromium } = require('playwright');

async function debugCartCounting() {
    console.log('🔍 Debugging Cart Counting Logic');
    
    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000
    });
    
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        // Clear localStorage and start fresh
        await page.goto('http://localhost:3005');
        await page.evaluate(() => localStorage.clear());
        
        console.log('\n🍕 Adding 2 pizzas...');
        await page.goto('http://localhost:3005/pizza-builder');
        await page.waitForLoadState('networkidle');
        
        // Add first pizza
        const addFirstPizzaButton = await page.locator('button:has-text("Add to Cart"), button:has-text("Add Pizza")').first();
        if (await addFirstPizzaButton.isVisible()) {
            await addFirstPizzaButton.click();
            await page.waitForTimeout(1000);
        }
        
        // Check state after first pizza
        let cartState = await page.evaluate(() => {
            const cartItems = localStorage.getItem('cartItems');
            const menuCart = localStorage.getItem('menuCart');
            return {
                cartItems: cartItems ? JSON.parse(cartItems) : [],
                menuCart: menuCart ? JSON.parse(menuCart) : []
            };
        });
        
        console.log('After first pizza:');
        console.log('  Pizza items:', cartState.cartItems.length, '| Details:', cartState.cartItems);
        console.log('  Menu items:', cartState.menuCart.length, '| Details:', cartState.menuCart);
        
        // Add second pizza
        await page.reload();
        await page.waitForLoadState('networkidle');
        const addSecondPizzaButton = await page.locator('button:has-text("Add to Cart"), button:has-text("Add Pizza")').first();
        if (await addSecondPizzaButton.isVisible()) {
            await addSecondPizzaButton.click();
            await page.waitForTimeout(1000);
        }
        
        // Check state after second pizza
        cartState = await page.evaluate(() => {
            const cartItems = localStorage.getItem('cartItems');
            const menuCart = localStorage.getItem('menuCart');
            return {
                cartItems: cartItems ? JSON.parse(cartItems) : [],
                menuCart: menuCart ? JSON.parse(menuCart) : []
            };
        });
        
        console.log('\nAfter second pizza:');
        console.log('  Pizza items:', cartState.cartItems.length, '| Details:', cartState.cartItems);
        console.log('  Menu items:', cartState.menuCart.length, '| Details:', cartState.menuCart);
        
        console.log('\n🥗 Adding salad...');
        await page.goto('http://localhost:3005/menu/salads');
        await page.waitForLoadState('networkidle');
        
        const addSaladButton = await page.locator('button:has-text("Add")').first();
        if (await addSaladButton.isVisible()) {
            await addSaladButton.click();
            await page.waitForTimeout(500);
            
            const addToCartButton = await page.locator('button:has-text("Add to Cart")').first();
            if (await addToCartButton.isVisible()) {
                await addToCartButton.click();
                await page.waitForTimeout(1500);
            }
        }
        
        // Check final state
        cartState = await page.evaluate(() => {
            const cartItems = localStorage.getItem('cartItems');
            const menuCart = localStorage.getItem('menuCart');
            return {
                cartItems: cartItems ? JSON.parse(cartItems) : [],
                menuCart: menuCart ? JSON.parse(menuCart) : []
            };
        });
        
        console.log('\nAfter adding salad:');
        console.log('  Pizza items:', cartState.cartItems.length, '| Details:', cartState.cartItems);
        console.log('  Menu items:', cartState.menuCart.length, '| Details:', cartState.menuCart);
        
        // Calculate totals manually
        const pizzaQuantityTotal = cartState.cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
        const menuQuantityTotal = cartState.menuCart.reduce((total, item) => total + item.quantity, 0);
        const expectedTotal = pizzaQuantityTotal + menuQuantityTotal;
        
        console.log('\n📊 Manual calculation:');
        console.log('  Pizza quantity total:', pizzaQuantityTotal);
        console.log('  Menu quantity total:', menuQuantityTotal);
        console.log('  Expected cart total:', expectedTotal);
        
        // Check what the cart icon is actually showing
        const displayedCount = await page.evaluate(() => {
            const cartIcon = document.querySelector('.fixed.bottom-6.right-6 span');
            return cartIcon ? cartIcon.textContent.trim() : 'not found';
        });
        
        console.log('  Cart icon shows:', displayedCount);
        
        if (displayedCount === expectedTotal.toString()) {
            console.log('✅ Cart count is CORRECT');
        } else {
            console.log('❌ Cart count is WRONG');
            
            // Let's check what the FloatingCartButton component is actually calculating
            const componentState = await page.evaluate(() => {
                // Simulate the component's calculation logic
                const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
                const menuCart = JSON.parse(localStorage.getItem('menuCart') || '[]');
                
                const pizzaCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
                const menuCount = menuCart.reduce((total, item) => total + item.quantity, 0);
                const totalCount = pizzaCount + menuCount;
                
                return {
                    pizzaCount,
                    menuCount,
                    totalCount,
                    cartItemsRaw: cartItems,
                    menuCartRaw: menuCart
                };
            });
            
            console.log('\n🔍 Component logic simulation:');
            console.log('  Component pizzaCount:', componentState.pizzaCount);
            console.log('  Component menuCount:', componentState.menuCount);
            console.log('  Component totalCount:', componentState.totalCount);
            console.log('  Raw cartItems:', JSON.stringify(componentState.cartItemsRaw, null, 2));
            console.log('  Raw menuCart:', JSON.stringify(componentState.menuCartRaw, null, 2));
        }
        
        await page.screenshot({ path: 'cart-counting-debug.png' });
        console.log('\n📷 Screenshot saved as cart-counting-debug.png');
        
    } catch (error) {
        console.error('❌ Debug failed:', error);
    } finally {
        await browser.close();
    }
}

debugCartCounting().catch(console.error);
