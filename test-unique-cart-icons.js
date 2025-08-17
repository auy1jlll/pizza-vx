const { chromium } = require('playwright');

async function testUniqueCartIcons() {
    console.log('🔍 Testing for UNIQUE Cart Icons (Avoiding Selector Overlap)');
    
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
        
        console.log('\n🍕 Step 1: Add 2 pizzas');
        await page.goto('http://localhost:3005/pizza-builder');
        await page.waitForLoadState('networkidle');
        
        // Add first pizza
        const addFirstPizzaButton = await page.locator('button:has-text("Add to Cart"), button:has-text("Add Pizza")').first();
        if (await addFirstPizzaButton.isVisible()) {
            await addFirstPizzaButton.click();
            await page.waitForTimeout(1000);
        }
        
        // Add second pizza
        await page.reload();
        await page.waitForLoadState('networkidle');
        const addSecondPizzaButton = await page.locator('button:has-text("Add to Cart"), button:has-text("Add Pizza")').first();
        if (await addSecondPizzaButton.isVisible()) {
            await addSecondPizzaButton.click();
            await page.waitForTimeout(1000);
        }
        
        console.log('\n🥗 Step 2: Add 1 salad');
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
        
        console.log('\n🔍 Step 3: Count UNIQUE cart icons using DOM element references');
        
        const uniqueCartAnalysis = await page.evaluate(() => {
            // Get ALL elements that might be cart icons
            const selectors = [
                'a[href="/cart"]',
                '[class*="fixed"][class*="bottom"]',
                '[class*="cart"]',
                'div[class*="fixed bottom-6 right-6"]',
                '.fixed.bottom-6.right-6'
            ];
            
            const allPossibleCartElements = [];
            selectors.forEach(selector => {
                try {
                    const elements = document.querySelectorAll(selector);
                    allPossibleCartElements.push(...elements);
                } catch (e) {
                    console.warn('Invalid selector:', selector);
                }
            });
            
            // Create a Set to track unique elements by their DOM reference
            const uniqueElements = new Set();
            const elementDetails = [];
            
            allPossibleCartElements.forEach(el => {
                // Only add if it's actually a floating cart (fixed position, bottom-right)
                const style = window.getComputedStyle(el);
                const rect = el.getBoundingClientRect();
                
                const isFloatingCart = 
                    style.position === 'fixed' && 
                    el.className.includes('bottom-6') && 
                    el.className.includes('right-6') &&
                    rect.width > 0 && rect.height > 0;
                
                if (isFloatingCart && !uniqueElements.has(el)) {
                    uniqueElements.add(el);
                    elementDetails.push({
                        tag: el.tagName,
                        classes: el.className,
                        text: el.textContent.trim(),
                        coordinates: {
                            x: Math.round(rect.x),
                            y: Math.round(rect.y),
                            width: Math.round(rect.width),
                            height: Math.round(rect.height)
                        },
                        elementId: `element_${elementDetails.length + 1}`,
                        innerHTML: el.innerHTML.substring(0, 150) + '...'
                    });
                }
            });
            
            return {
                totalPossibleElements: allPossibleCartElements.length,
                uniqueFloatingCarts: uniqueElements.size,
                details: elementDetails
            };
        });
        
        console.log('\n📊 UNIQUE CART ICON ANALYSIS:');
        console.log('==============================');
        console.log(`Total elements found by selectors: ${uniqueCartAnalysis.totalPossibleElements}`);
        console.log(`Unique floating cart icons: ${uniqueCartAnalysis.uniqueFloatingCarts}`);
        
        if (uniqueCartAnalysis.uniqueFloatingCarts === 0) {
            console.log('⚠️ No floating cart icons found');
        } else if (uniqueCartAnalysis.uniqueFloatingCarts === 1) {
            console.log('✅ GOOD: Exactly one floating cart icon found');
            const cart = uniqueCartAnalysis.details[0];
            console.log(`   Content: "${cart.text}"`);
            console.log(`   Position: (${cart.coordinates.x}, ${cart.coordinates.y})`);
            console.log(`   Size: ${cart.coordinates.width}x${cart.coordinates.height}`);
        } else {
            console.log('❌ PROBLEM: Multiple unique floating cart icons found');
            uniqueCartAnalysis.details.forEach((cart, index) => {
                console.log(`\n   Cart ${index + 1}:`);
                console.log(`     Tag: ${cart.tag}`);
                console.log(`     Classes: ${cart.classes}`);
                console.log(`     Text: "${cart.text}"`);
                console.log(`     Position: (${cart.coordinates.x}, ${cart.coordinates.y})`);
                console.log(`     Size: ${cart.coordinates.width}x${cart.coordinates.height}`);
                console.log(`     HTML: ${cart.innerHTML}`);
            });
        }
        
        // Check storage state
        const storageState = await page.evaluate(() => {
            const cartItems = localStorage.getItem('cartItems');
            const menuCart = localStorage.getItem('menuCart');
            return {
                pizzaCount: cartItems ? JSON.parse(cartItems).length : 0,
                menuCount: menuCart ? JSON.parse(menuCart).length : 0,
                totalExpected: (cartItems ? JSON.parse(cartItems).reduce((sum, item) => sum + (item.quantity || 1), 0) : 0) +
                              (menuCart ? JSON.parse(menuCart).reduce((sum, item) => sum + item.quantity, 0) : 0)
            };
        });
        
        console.log('\n💾 CART STATE:');
        console.log(`Pizza items: ${storageState.pizzaCount} (should be 2)`);
        console.log(`Menu items: ${storageState.menuCount} (should be 1)`);
        console.log(`Total expected count: ${storageState.totalExpected} (should be 3)`);
        
        if (uniqueCartAnalysis.uniqueFloatingCarts === 1) {
            const displayedCount = uniqueCartAnalysis.details[0].text;
            if (displayedCount === storageState.totalExpected.toString()) {
                console.log(`✅ Cart icon shows correct count: ${displayedCount}`);
            } else {
                console.log(`❌ Cart icon shows ${displayedCount} but should show ${storageState.totalExpected}`);
            }
        }
        
        await page.screenshot({ path: 'unique-cart-test.png' });
        console.log('\n📷 Screenshot saved as unique-cart-test.png');
        
        // Final verdict
        if (uniqueCartAnalysis.uniqueFloatingCarts <= 1) {
            console.log('\n🎉 CONCLUSION: Cart icon duplication issue is RESOLVED!');
            console.log('Only one (or zero when empty) floating cart icon is being rendered.');
        } else {
            console.log('\n⚠️ CONCLUSION: There are still multiple floating cart icons being rendered.');
            console.log('Further investigation needed to find the source of duplication.');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
}

testUniqueCartIcons().catch(console.error);
