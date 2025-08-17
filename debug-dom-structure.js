const { chromium } = require('playwright');

async function debugDOMStructure() {
    console.log('🔍 Deep DOM Analysis - Finding Multiple Cart Icons');
    
    const browser = await chromium.launch({
        headless: false,
        slowMo: 500
    });
    
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        // Add items to cart first
        await page.goto('http://localhost:3005');
        await page.evaluate(() => localStorage.clear());
        
        // Add pizza
        await page.goto('http://localhost:3005/pizza-builder');
        await page.waitForLoadState('networkidle');
        const addPizzaButton = await page.locator('button:has-text("Add to Cart"), button:has-text("Add Pizza")').first();
        if (await addPizzaButton.isVisible()) {
            await addPizzaButton.click();
        }
        
        // Add salad
        await page.goto('http://localhost:3005/menu/salads');
        await page.waitForLoadState('networkidle');
        const addSaladButton = await page.locator('button:has-text("Add")').first();
        if (await addSaladButton.isVisible()) {
            await addSaladButton.click();
            await page.waitForTimeout(500);
            const addToCartButton = await page.locator('button:has-text("Add to Cart")').first();
            if (await addToCartButton.isVisible()) {
                await addToCartButton.click();
            }
        }
        
        console.log('\n🔍 Analyzing DOM structure for duplicate cart icons...');
        
        // Get detailed DOM analysis
        const domAnalysis = await page.evaluate(() => {
            // Function to get full element path
            function getElementPath(element) {
                const path = [];
                let current = element;
                while (current && current !== document.body) {
                    let selector = current.tagName.toLowerCase();
                    if (current.id) {
                        selector += `#${current.id}`;
                    }
                    if (current.className) {
                        selector += `.${current.className.split(' ').join('.')}`;
                    }
                    path.unshift(selector);
                    current = current.parentElement;
                }
                return path.join(' > ');
            }
            
            // Find all floating cart elements
            const floatingCartElements = document.querySelectorAll('[class*="fixed bottom-6 right-6"]');
            
            return Array.from(floatingCartElements).map((el, index) => {
                const rect = el.getBoundingClientRect();
                return {
                    index: index + 1,
                    tag: el.tagName,
                    id: el.id || 'no-id',
                    classes: el.className,
                    text: el.textContent.trim(),
                    innerHTML: el.innerHTML.substring(0, 200) + (el.innerHTML.length > 200 ? '...' : ''),
                    path: getElementPath(el),
                    coordinates: {
                        x: Math.round(rect.x),
                        y: Math.round(rect.y),
                        width: Math.round(rect.width),
                        height: Math.round(rect.height)
                    },
                    computedStyle: {
                        position: window.getComputedStyle(el).position,
                        display: window.getComputedStyle(el).display,
                        zIndex: window.getComputedStyle(el).zIndex,
                        visibility: window.getComputedStyle(el).visibility
                    },
                    parentInfo: {
                        tag: el.parentElement?.tagName,
                        classes: el.parentElement?.className,
                        id: el.parentElement?.id
                    }
                };
            });
        });
        
        console.log(`\n📊 Found ${domAnalysis.length} floating cart elements:`);
        console.log('='.repeat(80));
        
        domAnalysis.forEach(element => {
            console.log(`\n${element.index}. ${element.tag} Element:`);
            console.log(`   ID: ${element.id}`);
            console.log(`   Classes: ${element.classes}`);
            console.log(`   Text: "${element.text}"`);
            console.log(`   Position: (${element.coordinates.x}, ${element.coordinates.y}) ${element.coordinates.width}x${element.coordinates.height}`);
            console.log(`   Style: ${element.computedStyle.position} z-index:${element.computedStyle.zIndex} display:${element.computedStyle.display}`);
            console.log(`   Parent: ${element.parentInfo.tag}${element.parentInfo.id ? '#' + element.parentInfo.id : ''}${element.parentInfo.classes ? '.' + element.parentInfo.classes.split(' ').join('.') : ''}`);
            console.log(`   DOM Path: ${element.path}`);
            console.log(`   HTML Preview: ${element.innerHTML}`);
        });
        
        // Check if they're identical or different
        if (domAnalysis.length > 1) {
            console.log(`\n🔍 DUPLICATE ANALYSIS:`);
            console.log('========================');
            
            // Group by identical content
            const groups = {};
            domAnalysis.forEach(el => {
                const key = `${el.classes}_${el.text}_${el.innerHTML}`;
                if (!groups[key]) groups[key] = [];
                groups[key].push(el);
            });
            
            Object.keys(groups).forEach(key => {
                const group = groups[key];
                if (group.length > 1) {
                    console.log(`\n⚠️ IDENTICAL DUPLICATES (${group.length} copies):`);
                    console.log(`   Content: "${group[0].text}"`);
                    console.log(`   Classes: ${group[0].classes}`);
                    group.forEach(el => {
                        console.log(`   Copy ${el.index}: Path = ${el.path}`);
                    });
                }
            });
        }
        
        // Take screenshot with highlights
        await page.addStyleTag({
            content: `
                [class*="fixed bottom-6 right-6"] {
                    outline: 3px solid red !important;
                    outline-offset: 2px !important;
                }
            `
        });
        
        await page.screenshot({ path: 'dom-debug-highlighted.png' });
        console.log('\n📷 Screenshot with highlights saved as dom-debug-highlighted.png');
        
    } catch (error) {
        console.error('❌ Debug failed:', error);
    } finally {
        await browser.close();
    }
}

debugDOMStructure().catch(console.error);
