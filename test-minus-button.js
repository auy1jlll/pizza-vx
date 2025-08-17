const { chromium } = require('playwright');

async function testMinusButtonSpecific() {
    console.log('🔍 Testing Minus Button Functionality - Direct Click Test');
    
    const browser = await chromium.launch({
        headless: false,
        slowMo: 2000 // Extra slow to see what happens
    });
    
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        // Clear cart and start fresh
        await page.goto('http://localhost:3005');
        await page.evaluate(() => localStorage.clear());
        
        console.log('\n📝 Step 1: Add one salad to cart');
        
        await page.goto('http://localhost:3005/menu/salads');
        await page.waitForLoadState('networkidle');
        
        const addSaladButton = await page.locator('button:has-text("Add")').first();
        if (await addSaladButton.isVisible()) {
            await addSaladButton.click();
            await page.waitForTimeout(500);
            
            const addToCartButton = await page.locator('button:has-text("Add to Cart")').first();
            if (await addToCartButton.isVisible()) {
                await addToCartButton.click();
                await page.waitForTimeout(1000);
                console.log('   ✅ Added 1 salad');
            }
        }
        
        // Check cart count
        let cartCount = await page.evaluate(() => {
            const cartIcon = document.querySelector('.fixed.bottom-6.right-6 span');
            return cartIcon ? cartIcon.textContent.trim() : 'not found';
        });
        console.log(`   🛒 Cart count: ${cartCount}`);
        
        console.log('\n📝 Step 2: Go to cart page');
        await page.goto('http://localhost:3005/cart');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000); // Wait for everything to load
        
        console.log('\n📝 Step 3: Find and analyze minus buttons');
        
        // Get detailed button analysis
        const buttonAnalysis = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            return buttons.map((btn, index) => {
                const rect = btn.getBoundingClientRect();
                const style = window.getComputedStyle(btn);
                return {
                    index,
                    text: btn.textContent?.trim() || '',
                    innerHTML: btn.innerHTML,
                    className: btn.className,
                    onclick: btn.onclick ? 'has onclick' : 'no onclick',
                    hasMinusIcon: btn.innerHTML.includes('minus') || btn.innerHTML.includes('Minus'),
                    isVisible: style.display !== 'none' && rect.width > 0 && rect.height > 0,
                    position: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) }
                };
            }).filter(btn => btn.hasMinusIcon && btn.isVisible);
        });
        
        console.log(`Found ${buttonAnalysis.length} minus buttons:`);
        buttonAnalysis.forEach((btn, i) => {
            console.log(`   ${i + 1}. Button ${btn.index}: "${btn.text}"`);
            console.log(`      Position: (${btn.position.x}, ${btn.position.y}) ${btn.position.w}x${btn.position.h}`);
            console.log(`      Classes: ${btn.className}`);
            console.log(`      HTML: ${btn.innerHTML.substring(0, 150)}...`);
        });
        
        if (buttonAnalysis.length === 0) {
            console.log('❌ No minus buttons found. Checking page content...');
            
            const pageText = await page.textContent('body');
            console.log('Page contains salad:', pageText.includes('Salad') || pageText.includes('salad'));
            console.log('Page contains quantity controls:', pageText.includes('quantity') || pageText.includes('1'));
            
            await page.screenshot({ path: 'cart-page-debug.png' });
            console.log('📷 Debug screenshot saved as cart-page-debug.png');
            return;
        }
        
        console.log('\n📝 Step 4: Click the first minus button');
        
        // Click the first minus button using a more specific selector
        try {
            // Wait for the button to be ready
            const minusButton = page.locator('button').nth(buttonAnalysis[0].index);
            await minusButton.waitFor({ state: 'visible' });
            
            console.log('   🖱️ Clicking minus button...');
            await minusButton.click();
            
            // Wait a moment for the update to propagate
            await page.waitForTimeout(2000);
            
            console.log('   ⏱️ Waiting for updates...');
            
            // Check if quantity changed on the page
            const quantityAfterClick = await page.evaluate(() => {
                // Look for quantity display elements
                const quantityElements = Array.from(document.querySelectorAll('span'))
                    .filter(el => /^\d+$/.test(el.textContent?.trim() || ''));
                return quantityElements.map(el => el.textContent?.trim());
            });
            
            console.log(`   📊 Quantities found on page: ${quantityAfterClick.join(', ')}`);
            
            // Check localStorage state
            const storageAfterClick = await page.evaluate(() => {
                const menuCart = JSON.parse(localStorage.getItem('menuCart') || '[]');
                return {
                    itemCount: menuCart.length,
                    quantities: menuCart.map(item => item.quantity),
                    totalQuantity: menuCart.reduce((sum, item) => sum + item.quantity, 0)
                };
            });
            
            console.log(`   💾 Storage after click: ${storageAfterClick.itemCount} items, quantities: [${storageAfterClick.quantities.join(', ')}], total: ${storageAfterClick.totalQuantity}`);
            
            // Check floating cart button
            const cartCountAfter = await page.evaluate(() => {
                const cartIcon = document.querySelector('.fixed.bottom-6.right-6 span');
                return cartIcon ? cartIcon.textContent.trim() : 'not found';
            });
            
            console.log(`   🛒 Floating cart count after click: ${cartCountAfter}`);
            
            // Determine success
            if (storageAfterClick.totalQuantity === 0) {
                console.log('   ✅ SUCCESS: Item removed from storage');
                if (cartCountAfter === 'not found') {
                    console.log('   ✅ SUCCESS: Floating cart icon hidden (empty cart)');
                } else {
                    console.log(`   ❌ ISSUE: Floating cart still shows "${cartCountAfter}" but cart is empty`);
                }
            } else {
                console.log('   ❌ ISSUE: Item not removed from storage');
            }
            
        } catch (error) {
            console.error('❌ Error clicking minus button:', error);
        }
        
        await page.screenshot({ path: 'minus-button-test.png' });
        console.log('\n📷 Screenshot saved as minus-button-test.png');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
}

testMinusButtonSpecific().catch(console.error);
