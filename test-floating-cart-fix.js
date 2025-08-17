const { chromium } = require('playwright');

async function testFloatingCartFix() {
    console.log('🔧 Testing Floating Cart Duplicate Fix');
    
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // Clear cart and navigate to home
        await page.goto('http://localhost:3005');
        await page.waitForLoadState('networkidle');
        
        await page.evaluate(() => {
            localStorage.clear();
        });
        
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        console.log('✅ Cleared cart and reloaded page');
        
        // Add items to cart
        console.log('🛒 Adding items to cart...');
        
        // Add a pizza
        await page.goto('http://localhost:3005/pizza-builder');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        const addPizzaButton = await page.locator('button:has-text("Add to Cart"), button:has-text("Add Pizza")').first();
        if (await addPizzaButton.isVisible()) {
            await addPizzaButton.click();
            await page.waitForTimeout(1000);
            console.log('✅ Added pizza to cart');
        }
        
        // Add a salad
        await page.goto('http://localhost:3005/menu/salads');
        await page.waitForLoadState('networkidle');
        
        const addSaladButton = await page.locator('text=Caesar Salad').locator('..').locator('button:has-text("Add")').first();
        if (await addSaladButton.isVisible()) {
            await addSaladButton.click();
            await page.waitForTimeout(1000);
            await page.locator('button:has-text("Add to Cart")').first().click();
            await page.waitForTimeout(1000);
            console.log('✅ Added salad to cart');
        }
        
        // Go back to home page
        await page.goto('http://localhost:3005');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        
        // Check for cart icons
        const cartAnalysis = await page.evaluate(() => {
            const cartElements = document.querySelectorAll('a[href="/cart"], [class*="fixed"][class*="bottom"], [class*="cart"]');
            
            const foundElements = [];
            cartElements.forEach((el, index) => {
                const rect = el.getBoundingClientRect();
                const styles = window.getComputedStyle(el);
                
                if (styles.display !== 'none' && styles.visibility !== 'hidden' && rect.width > 0 && rect.height > 0) {
                    const countElements = el.querySelectorAll('span, div');
                    const counts = Array.from(countElements)
                        .map(countEl => countEl.textContent?.trim())
                        .filter(text => text && /^\d+(\+)?$/.test(text));
                    
                    foundElements.push({
                        index: index,
                        tagName: el.tagName,
                        className: el.className,
                        textContent: el.textContent?.trim(),
                        position: styles.position,
                        zIndex: styles.zIndex,
                        coords: {
                            x: rect.x,
                            y: rect.y,
                            width: rect.width,
                            height: rect.height
                        },
                        counts: counts
                    });
                }
            });
            
            return foundElements;
        });
        
        console.log('\n🔍 FLOATING CART ICONS AFTER FIX:');
        console.log('=================================');
        cartAnalysis.forEach((el, i) => {
            console.log(`${i+1}. ${el.tagName} (${el.className})`);
            console.log(`   Text: "${el.textContent}"`);
            console.log(`   Position: ${el.position} (z-index: ${el.zIndex})`);
            console.log(`   Coords: x:${el.coords.x}, y:${el.coords.y}`);
            console.log(`   Counts: [${el.counts.join(', ')}]`);
            console.log('');
        });
        
        // Check for duplicates
        const fixedPositionElements = cartAnalysis.filter(el => el.position === 'fixed');
        
        console.log('🎯 ANALYSIS RESULTS:');
        console.log('====================');
        console.log(`Total cart elements found: ${cartAnalysis.length}`);
        console.log(`Fixed position elements: ${fixedPositionElements.length}`);
        
        if (fixedPositionElements.length === 1) {
            console.log('✅ SUCCESS: Only one floating cart icon found');
            console.log(`   Count displayed: [${fixedPositionElements[0].counts.join(', ')}]`);
        } else if (fixedPositionElements.length === 0) {
            console.log('⚠️ No floating cart icons found');
        } else {
            console.log('❌ STILL DUPLICATED: Multiple floating cart icons found');
            fixedPositionElements.forEach((el, i) => {
                console.log(`   ${i+1}. ${el.tagName} - Counts: [${el.counts.join(', ')}]`);
            });
        }
        
        // Take screenshot
        await page.screenshot({ path: 'floating-cart-fixed.png' });
        console.log('\n📷 Screenshot saved as floating-cart-fixed.png');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
}

testFloatingCartFix().catch(console.error);
