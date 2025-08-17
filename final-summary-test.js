const { chromium } = require('playwright');

async function finalSummaryTest() {
    console.log('🎉 FINAL SUMMARY: Cart System Status Check');
    console.log('==========================================');
    
    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000
    });
    
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        
        // Clear cart and start fresh
        await page.goto('http://localhost:3005');
        await page.evaluate(() => localStorage.clear());
        
        console.log('\n📝 Test Scenario: Add 2 pizzas + 1 salad');
        console.log('Expected Result: 1 cart icon showing count "3"');
        
        // Add 2 pizzas
        console.log('\n🍕 Adding pizzas...');
        await page.goto('http://localhost:3005/pizza-builder');
        await page.waitForLoadState('networkidle');
        
        for (let i = 1; i <= 2; i++) {
            const addPizzaButton = await page.locator('button:has-text("Add to Cart"), button:has-text("Add Pizza")').first();
            if (await addPizzaButton.isVisible()) {
                await addPizzaButton.click();
                await page.waitForTimeout(1000);
                console.log(`   ✅ Pizza ${i} added`);
            }
            if (i < 2) {
                await page.reload();
                await page.waitForLoadState('networkidle');
            }
        }
        
        // Add 1 salad
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
                console.log('   ✅ Salad added');
            }
        }
        
        console.log('\n🔍 Final Assessment:');
        console.log('====================');
        
        // Get the actual floating cart button (unique DOM element)
        const cartButtonInfo = await page.evaluate(() => {
            const floatingCartButton = document.querySelector('.fixed.bottom-6.right-6.z-50');
            
            if (!floatingCartButton) {
                return { found: false };
            }
            
            const rect = floatingCartButton.getBoundingClientRect();
            const countElement = floatingCartButton.querySelector('span');
            
            return {
                found: true,
                count: countElement ? countElement.textContent.trim() : 'no count',
                position: {
                    x: Math.round(rect.x),
                    y: Math.round(rect.y),
                    width: Math.round(rect.width),
                    height: Math.round(rect.height)
                },
                classes: floatingCartButton.className,
                html: floatingCartButton.innerHTML.substring(0, 200) + '...'
            };
        });
        
        // Get storage state
        const storageInfo = await page.evaluate(() => {
            const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            const menuCart = JSON.parse(localStorage.getItem('menuCart') || '[]');
            
            const pizzaCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
            const menuCount = menuCart.reduce((sum, item) => sum + item.quantity, 0);
            
            return {
                pizzaItems: cartItems.length,
                menuItems: menuCart.length,
                pizzaQuantity: pizzaCount,
                menuQuantity: menuCount,
                totalExpected: pizzaCount + menuCount
            };
        });
        
        console.log('🛒 Cart Icon Status:');
        if (cartButtonInfo.found) {
            console.log(`   ✅ ONE cart icon found`);
            console.log(`   📍 Position: (${cartButtonInfo.position.x}, ${cartButtonInfo.position.y})`);
            console.log(`   📏 Size: ${cartButtonInfo.position.width}x${cartButtonInfo.position.height}`);
            console.log(`   🔢 Displays count: "${cartButtonInfo.count}"`);
        } else {
            console.log('   ❌ No cart icon found');
        }
        
        console.log('\n💾 Cart Contents:');
        console.log(`   🍕 Pizza items: ${storageInfo.pizzaItems} (quantity: ${storageInfo.pizzaQuantity})`);
        console.log(`   🥗 Menu items: ${storageInfo.menuItems} (quantity: ${storageInfo.menuQuantity})`);
        console.log(`   📊 Total expected: ${storageInfo.totalExpected}`);
        
        console.log('\n🎯 Results:');
        if (cartButtonInfo.found && cartButtonInfo.count === storageInfo.totalExpected.toString()) {
            console.log('   ✅ PASS: Cart icon shows correct count');
        } else {
            console.log('   ❌ FAIL: Cart icon count mismatch');
            console.log(`      Expected: ${storageInfo.totalExpected}, Got: ${cartButtonInfo.count}`);
        }
        
        // Check for duplicates using a more reliable method
        const duplicateCheck = await page.evaluate(() => {
            const allElements = document.querySelectorAll('*');
            const floatingCarts = Array.from(allElements).filter(el => {
                const style = window.getComputedStyle(el);
                return style.position === 'fixed' && 
                       el.className.includes('bottom-6') && 
                       el.className.includes('right-6') &&
                       el.className.includes('z-50');
            });
            
            return floatingCarts.length;
        });
        
        if (duplicateCheck === 1) {
            console.log('   ✅ PASS: Only one floating cart component');
        } else {
            console.log(`   ⚠️ WARNING: ${duplicateCheck} floating cart components detected`);
        }
        
        await page.screenshot({ path: 'final-summary-test.png' });
        console.log('\n📷 Screenshot saved as final-summary-test.png');
        
        console.log('\n🏆 FINAL VERDICT:');
        console.log('=================');
        
        const isSuccess = cartButtonInfo.found && 
                         cartButtonInfo.count === storageInfo.totalExpected.toString() && 
                         duplicateCheck === 1;
        
        if (isSuccess) {
            console.log('🎉 SUCCESS: Cart system is working correctly!');
            console.log('   ✅ Single cart icon displayed');
            console.log('   ✅ Correct item count shown');
            console.log('   ✅ No duplicate cart components');
            console.log('\n👥 User Issue Status: RESOLVED');
            console.log('   The reported "2 floating cart icons" issue has been fixed.');
            console.log('   Cart now correctly shows combined count of pizza + menu items.');
        } else {
            console.log('❌ ISSUES REMAIN: Cart system needs more work');
            if (!cartButtonInfo.found) console.log('   - No cart icon visible');
            if (cartButtonInfo.count !== storageInfo.totalExpected.toString()) console.log('   - Incorrect count displayed');
            if (duplicateCheck !== 1) console.log('   - Multiple cart components detected');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
}

finalSummaryTest().catch(console.error);
