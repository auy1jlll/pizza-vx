const { chromium } = require('playwright');

async function testExactScenario() {
    console.log('🔍 Testing Exact User Scenario: 2 Pizzas → 1 Salad');
    console.log('Expected: Cart should show 3 items total with ONE cart icon');
    
    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000, // Slow motion to see what's happening
        args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
    });
    
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        // Clear localStorage to start fresh
        await page.goto('http://localhost:3005');
        await page.evaluate(() => {
            localStorage.clear();
        });
        
        console.log('\n🏠 Step 1: Navigate to home page and check initial state');
        await page.goto('http://localhost:3005');
        await page.waitForLoadState('networkidle');
        
        // Check initial cart icons
        const initialCartCount = await page.evaluate(() => {
            const cartElements = document.querySelectorAll('a[href="/cart"], [class*="fixed"][class*="bottom"], [class*="cart"]');
            return cartElements.length;
        });
        console.log(`   Initial cart icons visible: ${initialCartCount}`);
        
        console.log('\n🍕 Step 2: Add FIRST pizza');
        await page.goto('http://localhost:3005/pizza-builder');
        await page.waitForLoadState('networkidle');
        
        // Add first pizza
        const addFirstPizzaButton = await page.locator('button:has-text("Add to Cart"), button:has-text("Add Pizza")').first();
        if (await addFirstPizzaButton.isVisible()) {
            await addFirstPizzaButton.click();
            console.log('   ✅ Added first pizza to cart');
            await page.waitForTimeout(1000);
        } else {
            console.log('   ❌ First pizza Add button not found');
        }
        
        // Check cart state after first pizza
        const afterFirstPizza = await page.evaluate(() => {
            const cartElements = document.querySelectorAll('[class*="fixed"][class*="bottom"]');
            return Array.from(cartElements).map(el => ({
                text: el.textContent,
                classes: el.className,
                visible: window.getComputedStyle(el).display !== 'none'
            }));
        });
        console.log('   Cart state after first pizza:', afterFirstPizza);
        
        console.log('\n🍕 Step 3: Add SECOND pizza');
        // Add second pizza (refresh the builder to get a new pizza)
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        const addSecondPizzaButton = await page.locator('button:has-text("Add to Cart"), button:has-text("Add Pizza")').first();
        if (await addSecondPizzaButton.isVisible()) {
            await addSecondPizzaButton.click();
            console.log('   ✅ Added second pizza to cart');
            await page.waitForTimeout(1000);
        } else {
            console.log('   ❌ Second pizza Add button not found');
        }
        
        // Check cart state after second pizza
        const afterSecondPizza = await page.evaluate(() => {
            const cartElements = document.querySelectorAll('[class*="fixed"][class*="bottom"]');
            return Array.from(cartElements).map(el => ({
                text: el.textContent,
                classes: el.className,
                visible: window.getComputedStyle(el).display !== 'none'
            }));
        });
        console.log('   Cart state after second pizza:', afterSecondPizza);
        
        console.log('\n🥗 Step 4: Navigate to salads and add one salad');
        await page.goto('http://localhost:3005/menu/salads');
        await page.waitForLoadState('networkidle');
        
        // Find and click Add button for first salad
        const addSaladButton = await page.locator('button:has-text("Add")').first();
        if (await addSaladButton.isVisible()) {
            await addSaladButton.click();
            console.log('   ✅ Clicked Add for first salad');
            await page.waitForTimeout(500);
            
            // Look for "Add to Cart" button (appears after clicking Add)
            const addToCartButton = await page.locator('button:has-text("Add to Cart")').first();
            if (await addToCartButton.isVisible()) {
                await addToCartButton.click();
                console.log('   ✅ Added salad to cart');
                await page.waitForTimeout(1500); // Wait longer to see any new cart icons appear
            } else {
                console.log('   ❌ Add to Cart button not found for salad');
            }
        } else {
            console.log('   ❌ Salad Add button not found');
        }
        
        console.log('\n🔍 Step 5: CRITICAL CHECK - How many cart icons are visible now?');
        
        // Detailed analysis of all cart-related elements
        const finalCartAnalysis = await page.evaluate(() => {
            // Look for all possible cart elements
            const selectors = [
                'a[href="/cart"]',
                '[class*="fixed"][class*="bottom"]',
                '[class*="cart"]',
                'div[class*="fixed bottom-6 right-6"]',
                '.fixed.bottom-6.right-6'
            ];
            
            const allElements = [];
            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    const style = window.getComputedStyle(el);
                    allElements.push({
                        selector,
                        tag: el.tagName,
                        classes: el.className,
                        text: el.textContent.trim(),
                        position: style.position,
                        display: style.display,
                        zIndex: style.zIndex,
                        visible: style.display !== 'none' && style.visibility !== 'hidden',
                        coords: {
                            x: el.getBoundingClientRect().x,
                            y: el.getBoundingClientRect().y,
                            width: el.getBoundingClientRect().width,
                            height: el.getBoundingClientRect().height
                        }
                    });
                });
            });
            
            return allElements;
        });
        
        console.log('\n📊 FINAL CART ANALYSIS:');
        console.log('========================');
        
        const visibleCartElements = finalCartAnalysis.filter(el => el.visible);
        console.log(`Total visible cart elements: ${visibleCartElements.length}`);
        
        visibleCartElements.forEach((el, index) => {
            console.log(`\n${index + 1}. ${el.tag} (${el.selector})`);
            console.log(`   Classes: ${el.classes}`);
            console.log(`   Text: "${el.text}"`);
            console.log(`   Position: ${el.position} (z-index: ${el.zIndex})`);
            console.log(`   Coords: x:${Math.round(el.coords.x)}, y:${Math.round(el.coords.y)}, w:${Math.round(el.coords.width)}, h:${Math.round(el.coords.height)}`);
        });
        
        // Check for floating cart buttons specifically
        const floatingCarts = visibleCartElements.filter(el => 
            el.position === 'fixed' && 
            el.classes.includes('bottom-6') && 
            el.classes.includes('right-6')
        );
        
        console.log(`\n🛒 FLOATING CART BUTTONS: ${floatingCarts.length}`);
        if (floatingCarts.length > 1) {
            console.log('❌ PROBLEM CONFIRMED: Multiple floating cart icons detected!');
            floatingCarts.forEach((cart, index) => {
                console.log(`   Cart ${index + 1}: "${cart.text}" at (${Math.round(cart.coords.x)}, ${Math.round(cart.coords.y)})`);
            });
        } else if (floatingCarts.length === 1) {
            console.log('✅ GOOD: Only one floating cart icon found');
            console.log(`   Shows: "${floatingCarts[0].text}"`);
        } else {
            console.log('⚠️ No floating cart icons found');
        }
        
        // Take screenshot
        await page.screenshot({ path: 'exact-scenario-test.png' });
        console.log('\n📷 Screenshot saved as exact-scenario-test.png');
        
        // Check localStorage for both cart systems
        const storageState = await page.evaluate(() => {
            return {
                cartItems: localStorage.getItem('cartItems'),
                menuCart: localStorage.getItem('menuCart')
            };
        });
        
        console.log('\n💾 STORAGE STATE:');
        console.log('CartItems (pizza):', storageState.cartItems ? JSON.parse(storageState.cartItems).length + ' items' : 'empty');
        console.log('MenuCart (menu):', storageState.menuCart ? JSON.parse(storageState.menuCart).length + ' items' : 'empty');
        
        if (floatingCarts.length > 1) {
            console.log('\n🚨 CONCLUSION: Issue reproduced! Multiple cart icons are appearing.');
            console.log('This suggests there are still multiple cart components being rendered.');
        } else {
            console.log('\n✅ CONCLUSION: Issue appears to be fixed - only one cart icon visible.');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
}

testExactScenario().catch(console.error);
