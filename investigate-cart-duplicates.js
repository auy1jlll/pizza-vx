const { chromium } = require('playwright');

async function investigateFloatingCartDuplicates() {
    console.log('🔍 Investigating Floating Cart Icon Duplicates');
    
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // Navigate to home page and clear cart first
        await page.goto('http://localhost:3005');
        await page.waitForLoadState('networkidle');
        
        await page.evaluate(() => {
            localStorage.clear();
        });
        
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        console.log('✅ Cleared cart and reloaded page');
        
        // Check for cart-related elements when cart is empty
        const emptyCartAnalysis = await page.evaluate(() => {
            // Find all possible cart icons/buttons
            const cartSelectors = [
                'a[href="/cart"]',
                '[class*="cart"]',
                '[data-testid*="cart"]',
                '.floating',
                '[class*="floating"]',
                '.fixed',
                '[class*="fixed"]'
            ];
            
            const foundElements = [];
            
            cartSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach((el, index) => {
                    const rect = el.getBoundingClientRect();
                    const styles = window.getComputedStyle(el);
                    
                    foundElements.push({
                        selector: selector,
                        index: index,
                        tagName: el.tagName,
                        className: el.className,
                        id: el.id,
                        textContent: el.textContent?.trim(),
                        visible: styles.display !== 'none' && styles.visibility !== 'hidden' && rect.width > 0 && rect.height > 0,
                        position: styles.position,
                        zIndex: styles.zIndex,
                        top: styles.top,
                        right: styles.right,
                        bottom: styles.bottom,
                        left: styles.left,
                        coords: {
                            x: rect.x,
                            y: rect.y,
                            width: rect.width,
                            height: rect.height
                        }
                    });
                });
            });
            
            return foundElements.filter(el => el.visible);
        });
        
        console.log('\n📊 EMPTY CART STATE - VISIBLE ELEMENTS:');
        console.log('=======================================');
        emptyCartAnalysis.forEach((el, i) => {
            console.log(`${i+1}. ${el.tagName} (${el.selector})`);
            console.log(`   Class: "${el.className}"`);
            console.log(`   Text: "${el.textContent}"`);
            console.log(`   Position: ${el.position} (z-index: ${el.zIndex})`);
            console.log(`   Coords: x:${el.coords.x}, y:${el.coords.y}, w:${el.coords.width}, h:${el.coords.height}`);
            console.log('');
        });
        
        // Add items to cart to see the duplicates
        console.log('🛒 Adding items to cart to trigger floating icons...');
        
        // Add a pizza first
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
        
        // Go back to home page to see the floating cart icons
        await page.goto('http://localhost:3005');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        
        // Now analyze the cart icons with items
        const withItemsAnalysis = await page.evaluate(() => {
            const cartSelectors = [
                'a[href="/cart"]',
                '[class*="cart"]',
                '[data-testid*="cart"]',
                '.floating',
                '[class*="floating"]',
                '.fixed',
                '[class*="fixed"]'
            ];
            
            const foundElements = [];
            
            cartSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach((el, index) => {
                    const rect = el.getBoundingClientRect();
                    const styles = window.getComputedStyle(el);
                    
                    // Look for count/number displays within this element
                    const countElements = el.querySelectorAll('span, div, [class*="count"], [class*="badge"]');
                    const counts = Array.from(countElements)
                        .map(countEl => countEl.textContent?.trim())
                        .filter(text => text && /^\d+(\+)?$/.test(text));
                    
                    foundElements.push({
                        selector: selector,
                        index: index,
                        tagName: el.tagName,
                        className: el.className,
                        id: el.id,
                        textContent: el.textContent?.trim(),
                        visible: styles.display !== 'none' && styles.visibility !== 'hidden' && rect.width > 0 && rect.height > 0,
                        position: styles.position,
                        zIndex: styles.zIndex,
                        top: styles.top,
                        right: styles.right,
                        bottom: styles.bottom,
                        left: styles.left,
                        coords: {
                            x: rect.x,
                            y: rect.y,
                            width: rect.width,
                            height: rect.height
                        },
                        counts: counts
                    });
                });
            });
            
            return foundElements.filter(el => el.visible);
        });
        
        console.log('\n🛒 WITH ITEMS - VISIBLE CART ELEMENTS:');
        console.log('======================================');
        withItemsAnalysis.forEach((el, i) => {
            console.log(`${i+1}. ${el.tagName} (${el.selector})`);
            console.log(`   Class: "${el.className}"`);
            console.log(`   Text: "${el.textContent}"`);
            console.log(`   Position: ${el.position} (z-index: ${el.zIndex})`);
            console.log(`   Location: ${el.top}, ${el.right}, ${el.bottom}, ${el.left}`);
            console.log(`   Coords: x:${el.coords.x}, y:${el.coords.y}, w:${el.coords.width}, h:${el.coords.height}`);
            console.log(`   Counts found: [${el.counts.join(', ')}]`);
            console.log('');
        });
        
        // Look for potential duplicates (same position or overlapping)
        const duplicates = [];
        for (let i = 0; i < withItemsAnalysis.length; i++) {
            for (let j = i + 1; j < withItemsAnalysis.length; j++) {
                const el1 = withItemsAnalysis[i];
                const el2 = withItemsAnalysis[j];
                
                // Check if they're in similar positions (floating carts)
                const similar = (
                    Math.abs(el1.coords.x - el2.coords.x) < 50 &&
                    Math.abs(el1.coords.y - el2.coords.y) < 50
                ) || (
                    el1.position === 'fixed' && el2.position === 'fixed' &&
                    (el1.bottom || el1.right || el1.top || el1.left) &&
                    (el2.bottom || el2.right || el2.top || el2.left)
                );
                
                if (similar) {
                    duplicates.push({ el1: i+1, el2: j+1, el1Data: el1, el2Data: el2 });
                }
            }
        }
        
        console.log('\n🚨 POTENTIAL DUPLICATES DETECTED:');
        console.log('==================================');
        if (duplicates.length === 0) {
            console.log('No obvious duplicates found.');
        } else {
            duplicates.forEach((dup, i) => {
                console.log(`Duplicate ${i+1}: Element ${dup.el1} vs Element ${dup.el2}`);
                console.log(`  Element ${dup.el1}: ${dup.el1Data.tagName}.${dup.el1Data.className} - Counts: [${dup.el1Data.counts.join(', ')}]`);
                console.log(`  Element ${dup.el2}: ${dup.el2Data.tagName}.${dup.el2Data.className} - Counts: [${dup.el2Data.counts.join(', ')}]`);
                console.log('');
            });
        }
        
        // Take screenshot for visual confirmation
        await page.screenshot({ path: 'floating-cart-duplicates.png' });
        
        console.log('\n📷 Screenshot saved as floating-cart-duplicates.png');
        
    } catch (error) {
        console.error('❌ Investigation failed:', error);
    } finally {
        await browser.close();
    }
}

investigateFloatingCartDuplicates().catch(console.error);
