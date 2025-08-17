const { chromium } = require('playwright');

async function checkHomePageCart() {
    console.log('🏠 Checking Home Page Cart Display');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // Navigate to home page
        await page.goto('http://localhost:3005');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // Check cart data in localStorage
        const cartData = await page.evaluate(() => {
            return {
                cartItems: localStorage.getItem('cartItems'),
                menuCart: localStorage.getItem('menuCart'),
                pizzaCart: localStorage.getItem('pizzaCart')
            };
        });
        
        console.log('\n📊 LOCALSTORAGE CART DATA:');
        console.log('===========================');
        console.log('cartItems:', cartData.cartItems);
        console.log('menuCart:', cartData.menuCart);
        console.log('pizzaCart:', cartData.pizzaCart);
        
        // Parse and analyze the data
        if (cartData.cartItems) {
            try {
                const parsedCartItems = JSON.parse(cartData.cartItems);
                console.log(`\nParsed cartItems: ${parsedCartItems.length} items`);
                parsedCartItems.forEach((item, i) => {
                    console.log(`  ${i+1}. ${item.name || 'Unknown'} - Qty: ${item.quantity || 1}`);
                });
            } catch (e) {
                console.log('Error parsing cartItems:', e.message);
            }
        }
        
        if (cartData.menuCart) {
            try {
                const parsedMenuCart = JSON.parse(cartData.menuCart);
                console.log(`\nParsed menuCart: ${parsedMenuCart.length} items`);
                parsedMenuCart.forEach((item, i) => {
                    console.log(`  ${i+1}. ${item.name || 'Unknown'} - Qty: ${item.quantity || 1} - $${item.price || item.totalPrice}`);
                });
            } catch (e) {
                console.log('Error parsing menuCart:', e.message);
            }
        }
        
        if (cartData.pizzaCart) {
            try {
                const parsedPizzaCart = JSON.parse(cartData.pizzaCart);
                console.log(`\nParsed pizzaCart: ${parsedPizzaCart.length} items`);
                parsedPizzaCart.forEach((item, i) => {
                    console.log(`  ${i+1}. Pizza - Qty: ${item.quantity || 1} - $${item.totalPrice}`);
                });
            } catch (e) {
                console.log('Error parsing pizzaCart:', e.message);
            }
        }
        
        // Check what the home page cart counter shows
        const cartCounterData = await page.evaluate(() => {
            // Look for cart counter elements
            const cartCounters = document.querySelectorAll('[data-testid="cart-count"], .cart-count, [class*="cart"]');
            const cartButtons = document.querySelectorAll('a[href="/cart"], button[href="/cart"]');
            
            const counters = Array.from(cartCounters).map(el => ({
                text: el.textContent?.trim(),
                className: el.className,
                tagName: el.tagName
            }));
            
            const buttons = Array.from(cartButtons).map(el => ({
                text: el.textContent?.trim(),
                href: el.getAttribute('href'),
                className: el.className
            }));
            
            // Look for any element containing "2" that might be cart-related
            const allElements = document.querySelectorAll('*');
            const elementsWithTwo = Array.from(allElements)
                .filter(el => el.textContent?.trim() === '2' || el.textContent?.includes('2 item'))
                .map(el => ({
                    text: el.textContent?.trim(),
                    tagName: el.tagName,
                    className: el.className,
                    id: el.id
                }));
            
            return {
                counters,
                buttons,
                elementsWithTwo
            };
        });
        
        console.log('\n🔍 HOME PAGE CART DISPLAY:');
        console.log('===========================');
        console.log('Cart counters found:', cartCounterData.counters);
        console.log('Cart buttons found:', cartCounterData.buttons);
        console.log('Elements showing "2":', cartCounterData.elementsWithTwo);
        
        // Take screenshot
        await page.screenshot({ path: 'home-page-cart-check.png' });
        
        // Calculate total items from localStorage
        let totalItems = 0;
        
        if (cartData.cartItems) {
            const items = JSON.parse(cartData.cartItems);
            totalItems += items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        }
        
        if (cartData.menuCart) {
            const items = JSON.parse(cartData.menuCart);
            totalItems += items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        }
        
        if (cartData.pizzaCart) {
            const items = JSON.parse(cartData.pizzaCart);
            totalItems += items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        }
        
        console.log('\n🧮 CART CALCULATION:');
        console.log('====================');
        console.log(`Total items calculated: ${totalItems}`);
        console.log(`Home page showing: ${cartCounterData.elementsWithTwo.length > 0 ? '2 (found)' : 'Unknown'}`);
        
        if (totalItems !== 2 && cartCounterData.elementsWithTwo.length > 0) {
            console.log('🚨 MISMATCH: Home page shows 2 but localStorage calculates different total');
        } else if (totalItems === 2) {
            console.log('✅ MATCH: Home page correctly shows 2 items');
        }
        
    } catch (error) {
        console.error('❌ Check failed:', error);
    } finally {
        await browser.close();
    }
}

checkHomePageCart().catch(console.error);
