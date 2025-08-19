const { chromium } = require('playwright');

async function testCartDeliveryFix() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🧪 Testing Cart Delivery Fee Fix...');
    
    // Navigate to cart page
    await page.goto('http://localhost:3005/cart');
    await page.waitForTimeout(2000);
    
    // Check if delivery fee appears in cart (it shouldn't)
    const deliveryFeeElement = page.locator('text=Delivery Fee');
    const deliveryFeeExists = await deliveryFeeElement.count() > 0;
    
    console.log('📋 Cart Page Results:');
    console.log(`   ❌ Delivery Fee shown in cart: ${deliveryFeeExists ? 'YES (BAD)' : 'NO (GOOD)'}`);
    
    if (!deliveryFeeExists) {
      console.log('   ✅ Cart correctly shows no delivery fee before order type selection');
    } else {
      console.log('   ❌ Cart still shows delivery fee - fix needed');
    }
    
    // Now test checkout page
    await page.goto('http://localhost:3005/checkout');
    await page.waitForTimeout(2000);
    
    // Check if delivery option is available (depends on deliveryEnabled setting)
    const deliveryOption = page.locator('input[value="DELIVERY"]');
    const deliveryOptionExists = await deliveryOption.count() > 0;
    
    console.log('🛒 Checkout Page Results:');
    console.log(`   📦 Delivery option available: ${deliveryOptionExists ? 'YES' : 'NO'}`);
    
    if (deliveryOptionExists) {
      // Test selecting delivery
      await deliveryOption.click();
      await page.waitForTimeout(1000);
      
      // Check if delivery fee appears after selecting delivery
      const checkoutDeliveryFee = page.locator('text=Delivery Fee');
      const checkoutDeliveryFeeExists = await checkoutDeliveryFee.count() > 0;
      
      console.log(`   💰 Delivery fee shown after selecting delivery: ${checkoutDeliveryFeeExists ? 'YES (GOOD)' : 'NO (CHECK)'}`);
    }
    
    console.log('\n✅ Test completed successfully!');
    console.log('📊 Summary:');
    console.log('   - Cart should NOT show delivery fee');
    console.log('   - Checkout should show delivery fee ONLY after selecting delivery');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testCartDeliveryFix();
