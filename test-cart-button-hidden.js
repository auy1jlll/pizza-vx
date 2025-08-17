const { chromium } = require('playwright');

async function testCartButtonHidden() {
    console.log('🔍 Testing Navigation Cart Button Hidden');
    
    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000
    });
    
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        console.log('\n📝 Step 1: Go to menu page');
        await page.goto('http://localhost:3005/menu/salads');
        await page.waitForLoadState('networkidle');
        
        console.log('\n🔍 Step 2: Check for cart buttons');
        
        const cartButtons = await page.evaluate(() => {
            // Look for all cart-related elements
            const elements = [];
            
            // Navigation cart button (should be hidden)
            const navCartButtons = document.querySelectorAll('a[href="/cart"]');
            navCartButtons.forEach((btn, i) => {
                const style = window.getComputedStyle(btn);
                const rect = btn.getBoundingClientRect();
                elements.push({
                    type: 'navigation',
                    index: i,
                    text: btn.textContent?.trim() || '',
                    classes: btn.className,
                    visible: style.display !== 'none' && rect.width > 0 && rect.height > 0,
                    display: style.display,
                    position: {
                        x: Math.round(rect.x),
                        y: Math.round(rect.y),
                        w: Math.round(rect.width),
                        h: Math.round(rect.height)
                    }
                });
            });
            
            // Floating cart button
            const floatingCartButton = document.querySelector('.fixed.bottom-6.right-6');
            if (floatingCartButton) {
                const style = window.getComputedStyle(floatingCartButton);
                const rect = floatingCartButton.getBoundingClientRect();
                const countSpan = floatingCartButton.querySelector('span');
                elements.push({
                    type: 'floating',
                    index: 0,
                    text: countSpan ? countSpan.textContent?.trim() || '' : 'no count',
                    classes: floatingCartButton.className,
                    visible: style.display !== 'none' && rect.width > 0 && rect.height > 0,
                    display: style.display,
                    position: {
                        x: Math.round(rect.x),
                        y: Math.round(rect.y),
                        w: Math.round(rect.width),
                        h: Math.round(rect.height)
                    }
                });
            }
            
            return elements;
        });
        
        console.log('\n📊 Cart Button Analysis:');
        console.log('========================');
        
        const navigationButtons = cartButtons.filter(btn => btn.type === 'navigation');
        const floatingButtons = cartButtons.filter(btn => btn.type === 'floating');
        
        console.log(`Navigation cart buttons: ${navigationButtons.length}`);
        navigationButtons.forEach((btn, i) => {
            console.log(`   ${i + 1}. "${btn.text}" | Visible: ${btn.visible} | Display: ${btn.display}`);
            if (btn.visible) {
                console.log(`      Position: (${btn.position.x}, ${btn.position.y}) ${btn.position.w}x${btn.position.h}`);
            }
        });
        
        console.log(`\nFloating cart buttons: ${floatingButtons.length}`);
        floatingButtons.forEach((btn, i) => {
            console.log(`   ${i + 1}. Count: "${btn.text}" | Visible: ${btn.visible}`);
            if (btn.visible) {
                console.log(`      Position: (${btn.position.x}, ${btn.position.y}) ${btn.position.w}x${btn.position.h}`);
            }
        });
        
        // Check if navigation button is properly hidden
        const navButtonsVisible = navigationButtons.filter(btn => btn.visible).length;
        const floatingButtonsVisible = floatingButtons.filter(btn => btn.visible).length;
        
        console.log('\n🎯 Results:');
        if (navButtonsVisible === 0) {
            console.log('   ✅ SUCCESS: Navigation cart button is hidden');
        } else {
            console.log('   ❌ ISSUE: Navigation cart button is still visible');
        }
        
        if (floatingButtonsVisible === 1) {
            console.log('   ✅ SUCCESS: Floating cart button is visible');
        } else if (floatingButtonsVisible === 0) {
            console.log('   ℹ️ INFO: Floating cart button hidden (likely empty cart)');
        } else {
            console.log('   ⚠️ WARNING: Multiple floating cart buttons detected');
        }
        
        console.log('\n📝 Step 3: Add item to test floating cart appears');
        
        const addSaladButton = await page.locator('button:has-text("Add")').first();
        if (await addSaladButton.isVisible()) {
            await addSaladButton.click();
            await page.waitForTimeout(500);
            
            const addToCartButton = await page.locator('button:has-text("Add to Cart")').first();
            if (await addToCartButton.isVisible()) {
                await addToCartButton.click();
                await page.waitForTimeout(1000);
                console.log('   ✅ Added item to cart');
            }
        }
        
        // Check final state
        const finalState = await page.evaluate(() => {
            const navButtons = Array.from(document.querySelectorAll('a[href="/cart"]'))
                .filter(btn => {
                    const style = window.getComputedStyle(btn);
                    const rect = btn.getBoundingClientRect();
                    return style.display !== 'none' && rect.width > 0 && rect.height > 0;
                });
            
            const floatingButton = document.querySelector('.fixed.bottom-6.right-6');
            const floatingVisible = floatingButton ? 
                window.getComputedStyle(floatingButton).display !== 'none' : false;
            
            const floatingCount = floatingButton ? 
                floatingButton.querySelector('span')?.textContent?.trim() || 'no count' : 'not found';
            
            return {
                navigationVisible: navButtons.length,
                floatingVisible,
                floatingCount
            };
        });
        
        console.log('\n📊 Final State:');
        console.log(`   Navigation cart buttons visible: ${finalState.navigationVisible}`);
        console.log(`   Floating cart button visible: ${finalState.floatingVisible}`);
        console.log(`   Floating cart count: ${finalState.floatingCount}`);
        
        const success = finalState.navigationVisible === 0 && 
                       finalState.floatingVisible && 
                       finalState.floatingCount !== 'not found';
        
        if (success) {
            console.log('\n🎉 SUCCESS: Navigation cart hidden, floating cart working!');
        } else {
            console.log('\n⚠️ Issues detected - may need further adjustment');
        }
        
        await page.screenshot({ path: 'cart-button-hidden-test.png' });
        console.log('\n📷 Screenshot saved as cart-button-hidden-test.png');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
}

testCartButtonHidden().catch(console.error);
