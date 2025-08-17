const { chromium } = require('playwright');

async function investigateHomeCartDisplay() {
    console.log('🔍 Investigating Home Page Cart Display');
    
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // Navigate to home page and completely clear localStorage
        await page.goto('http://localhost:3005');
        await page.waitForLoadState('networkidle');
        
        // Clear all localStorage
        await page.evaluate(() => {
            localStorage.clear();
        });
        
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        console.log('✅ Cleared localStorage and reloaded page');
        
        // Take a screenshot of the clean state
        await page.screenshot({ path: 'home-cart-clean.png' });
        
        // Check for any cart-related elements with specific inspection
        const cartInvestigation = await page.evaluate(() => {
            // Find all text that contains numbers
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                const text = node.textContent?.trim();
                if (text && /\d/.test(text)) {
                    textNodes.push({
                        text: text,
                        parent: node.parentElement?.tagName,
                        parentClass: node.parentElement?.className,
                        parentText: node.parentElement?.textContent?.trim()
                    });
                }
            }
            
            // Also check for specific cart-related elements
            const cartElements = [];
            const possibleCartSelectors = [
                '[data-testid*="cart"]',
                '[class*="cart"]',
                '[id*="cart"]',
                'a[href="/cart"]',
                'a[href*="cart"]',
                '[aria-label*="cart" i]',
                '[title*="cart" i]'
            ];
            
            possibleCartSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    cartElements.push({
                        selector: selector,
                        tagName: el.tagName,
                        text: el.textContent?.trim(),
                        className: el.className,
                        id: el.id,
                        href: el.getAttribute('href')
                    });
                });
            });
            
            return {
                textNodes: textNodes.filter(node => node.text.length < 50), // Filter out very long text
                cartElements: cartElements,
                bodyText: document.body.textContent?.substring(0, 500) // First 500 chars
            };
        });
        
        console.log('\n📝 TEXT NODES WITH NUMBERS:');
        console.log('============================');
        cartInvestigation.textNodes.forEach((node, i) => {
            console.log(`${i+1}. "${node.text}" (${node.parent}) - Parent: "${node.parentText?.substring(0, 50)}"`);
        });
        
        console.log('\n🛒 CART-RELATED ELEMENTS:');
        console.log('==========================');
        cartInvestigation.cartElements.forEach((el, i) => {
            console.log(`${i+1}. ${el.tagName} (${el.selector})`);
            console.log(`   Text: "${el.text}"`);
            console.log(`   Class: "${el.className}"`);
            console.log(`   Href: "${el.href}"`);
        });
        
        console.log('\n📄 BODY TEXT PREVIEW:');
        console.log('======================');
        console.log(cartInvestigation.bodyText);
        
        // Now add some items and see if the count updates
        console.log('\n🥗 Adding test items to see cart update...');
        
        // Go to salads and add an item
        await page.goto('http://localhost:3005/menu/salads');
        await page.waitForLoadState('networkidle');
        
        // Add Caesar Salad
        const addButton = await page.locator('text=Caesar Salad').locator('..').locator('button:has-text("Add")').first();
        await addButton.click();
        await page.waitForTimeout(1000);
        await page.locator('button:has-text("Add to Cart")').first().click();
        await page.waitForTimeout(1000);
        
        console.log('✅ Added Caesar Salad');
        
        // Go back to home page
        await page.goto('http://localhost:3005');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // Check cart display again
        const afterAddingItem = await page.evaluate(() => {
            const cartElements = document.querySelectorAll('[data-testid*="cart"], [class*="cart"], a[href="/cart"]');
            return Array.from(cartElements).map(el => ({
                text: el.textContent?.trim(),
                className: el.className,
                tagName: el.tagName,
                href: el.getAttribute('href')
            }));
        });
        
        console.log('\n🔄 AFTER ADDING ITEM:');
        console.log('======================');
        afterAddingItem.forEach((el, i) => {
            console.log(`${i+1}. ${el.tagName}: "${el.text}" (${el.className})`);
        });
        
        await page.screenshot({ path: 'home-cart-after-add.png' });
        
    } catch (error) {
        console.error('❌ Investigation failed:', error);
    } finally {
        await browser.close();
    }
}

investigateHomeCartDisplay().catch(console.error);
