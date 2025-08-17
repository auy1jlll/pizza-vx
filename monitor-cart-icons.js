const { chromium } = require('playwright');

async function monitorCartIcons() {
    console.log('🔍 Real-time Cart Icon Monitoring');
    console.log('Will track DOM changes as items are added to cart');
    
    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000
    });
    
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        // Monitor DOM mutations
        await page.addInitScript(() => {
            window.cartIconLog = [];
            
            function logCartIcons(step) {
                const floatingCarts = document.querySelectorAll('[class*="fixed bottom-6 right-6"]');
                window.cartIconLog.push({
                    step,
                    timestamp: new Date().toISOString(),
                    count: floatingCarts.length,
                    elements: Array.from(floatingCarts).map(el => ({
                        text: el.textContent.trim(),
                        classes: el.className,
                        innerHTML: el.innerHTML.substring(0, 100)
                    }))
                });
                console.log(`[${step}] Found ${floatingCarts.length} floating cart icons`);
            }
            
            // Setup mutation observer
            const observer = new MutationObserver((mutations) => {
                let hasCartChanges = false;
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) { // Element node
                                if (node.className && node.className.includes('fixed bottom-6 right-6')) {
                                    hasCartChanges = true;
                                }
                                // Check descendants too
                                const descendants = node.querySelectorAll && node.querySelectorAll('[class*="fixed bottom-6 right-6"]');
                                if (descendants && descendants.length > 0) {
                                    hasCartChanges = true;
                                }
                            }
                        });
                    }
                    if (mutation.type === 'attributes' && mutation.target.className && mutation.target.className.includes('fixed bottom-6 right-6')) {
                        hasCartChanges = true;
                    }
                });
                
                if (hasCartChanges) {
                    logCartIcons('DOM_MUTATION');
                }
            });
            
            observer.observe(document, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });
            
            // Log initial state when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => logCartIcons('DOM_READY'));
            } else {
                logCartIcons('SCRIPT_INIT');
            }
            
            window.logCartIcons = logCartIcons;
        });
        
        // Clear cart and start fresh
        await page.goto('http://localhost:3005');
        await page.evaluate(() => {
            localStorage.clear();
            window.logCartIcons('CLEARED_STORAGE');
        });
        
        await page.waitForTimeout(1000);
        
        console.log('\n🏠 Step 1: Initial page load');
        await page.goto('http://localhost:3005');
        await page.waitForLoadState('networkidle');
        await page.evaluate(() => window.logCartIcons('HOME_LOADED'));
        
        console.log('\n🍕 Step 2: Adding first pizza');
        await page.goto('http://localhost:3005/pizza-builder');
        await page.waitForLoadState('networkidle');
        await page.evaluate(() => window.logCartIcons('PIZZA_BUILDER_LOADED'));
        
        const addPizzaButton = await page.locator('button:has-text("Add to Cart"), button:has-text("Add Pizza")').first();
        if (await addPizzaButton.isVisible()) {
            await addPizzaButton.click();
            await page.waitForTimeout(1000);
            await page.evaluate(() => window.logCartIcons('PIZZA_ADDED'));
        }
        
        console.log('\n🍕 Step 3: Adding second pizza');
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.evaluate(() => window.logCartIcons('PIZZA_BUILDER_RELOADED'));
        
        const addSecondPizzaButton = await page.locator('button:has-text("Add to Cart"), button:has-text("Add Pizza")').first();
        if (await addSecondPizzaButton.isVisible()) {
            await addSecondPizzaButton.click();
            await page.waitForTimeout(1000);
            await page.evaluate(() => window.logCartIcons('SECOND_PIZZA_ADDED'));
        }
        
        console.log('\n🥗 Step 4: Going to salads page');
        await page.goto('http://localhost:3005/menu/salads');
        await page.waitForLoadState('networkidle');
        await page.evaluate(() => window.logCartIcons('SALADS_PAGE_LOADED'));
        
        console.log('\n🥗 Step 5: Adding salad');
        const addSaladButton = await page.locator('button:has-text("Add")').first();
        if (await addSaladButton.isVisible()) {
            await addSaladButton.click();
            await page.waitForTimeout(500);
            await page.evaluate(() => window.logCartIcons('SALAD_ADD_CLICKED'));
            
            const addToCartButton = await page.locator('button:has-text("Add to Cart")').first();
            if (await addToCartButton.isVisible()) {
                await addToCartButton.click();
                await page.waitForTimeout(1500);
                await page.evaluate(() => window.logCartIcons('SALAD_ADDED_TO_CART'));
            }
        }
        
        console.log('\n📊 Cart Icon History Log:');
        console.log('===========================');
        
        const cartLog = await page.evaluate(() => window.cartIconLog);
        cartLog.forEach((entry, index) => {
            console.log(`\n${index + 1}. ${entry.step} (${entry.timestamp.split('T')[1].split('.')[0]})`);
            console.log(`   Cart Icons: ${entry.count}`);
            if (entry.count > 0) {
                entry.elements.forEach((el, i) => {
                    console.log(`   Icon ${i + 1}: "${el.text}" (${el.classes})`);
                });
            }
        });
        
        // Final analysis
        console.log('\n🔍 Final State Analysis:');
        const finalState = await page.evaluate(() => {
            const cartElements = document.querySelectorAll('[class*="fixed bottom-6 right-6"]');
            return {
                count: cartElements.length,
                elements: Array.from(cartElements).map((el, i) => ({
                    index: i + 1,
                    tag: el.tagName,
                    text: el.textContent.trim(),
                    classes: el.className,
                    rect: el.getBoundingClientRect(),
                    parentTag: el.parentElement?.tagName,
                    parentClasses: el.parentElement?.className
                }))
            };
        });
        
        console.log(`Total cart icons: ${finalState.count}`);
        finalState.elements.forEach(el => {
            console.log(`   ${el.index}. ${el.tag} "${el.text}" at (${Math.round(el.rect.x)}, ${Math.round(el.rect.y)})`);
            console.log(`      Parent: ${el.parentTag}.${el.parentClasses}`);
        });
        
        if (finalState.count > 1) {
            console.log('\n❌ MULTIPLE CART ICONS DETECTED!');
            console.log('This suggests either:');
            console.log('1. Multiple React components rendering the same cart');
            console.log('2. A component is being mounted multiple times');
            console.log('3. DOM is not being properly cleaned up during navigation');
        } else {
            console.log('\n✅ Only one cart icon found - issue may be intermittent');
        }
        
        await page.screenshot({ path: 'cart-monitoring-final.png' });
        console.log('\n📷 Final screenshot saved as cart-monitoring-final.png');
        
    } catch (error) {
        console.error('❌ Monitoring failed:', error);
    } finally {
        await browser.close();
    }
}

monitorCartIcons().catch(console.error);
