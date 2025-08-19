// Browser test to compare different cart data structures
console.log('🔍 CART DATA STRUCTURE COMPARISON TEST');
console.log('======================================');

console.log('\n📝 STEP 1: Clear cart and test manual structure');
console.log('Run this in browser console:');

const browserTestCode = `
// Clear cart
localStorage.removeItem('menuCart');

// Test Structure 1: Grouped customizations (what formatForCart should return)
const testItemGrouped = {
  id: 'menu-test-grouped',
  type: 'menu',
  name: 'Test BBQ Ribs (Grouped)',
  customizations: [
    {
      groupName: 'Side Choice',
      selections: [
        {
          optionName: 'Fries',
          price: 0,
          quantity: 1
        }
      ]
    },
    {
      groupName: 'Size',
      selections: [
        {
          optionName: 'Regular',
          price: 0,
          quantity: 1
        }
      ]
    }
  ],
  price: 19.99,
  quantity: 1
};

// Test Structure 2: Flat customizations (legacy format)
const testItemFlat = {
  id: 'menu-test-flat',
  type: 'menu',
  name: 'Test BBQ Ribs (Flat)',
  customizations: [
    {
      groupName: 'Side Choice',
      optionName: 'Fries',
      price: 0,
      quantity: 1
    },
    {
      groupName: 'Size',
      optionName: 'Regular',
      price: 0,
      quantity: 1
    }
  ],
  price: 19.99,
  quantity: 1
};

// Add both to cart
localStorage.setItem('menuCart', JSON.stringify([testItemGrouped, testItemFlat]));

console.log('✅ Added two test items with different customization structures');
console.log('📊 Test Item 1 (Grouped):', testItemGrouped);
console.log('📊 Test Item 2 (Flat):', testItemFlat);
console.log('🔄 Reload the page and check cart/checkout to see which format displays correctly');

// Also test the format-cart API
async function testAPI() {
  try {
    const response = await fetch('/api/menu/format-cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        menuItemId: 'cmeghhm32000dvk74ahje65y8',
        customizations: [
          { customizationOptionId: 'cmeghidt5005ivkxcd6oblt96', quantity: 1 },
          { customizationOptionId: 'cmef5tfjd000uvki4vznoqsoz', quantity: 1 }
        ]
      })
    });
    const result = await response.json();
    console.log('🔗 Format-cart API response:', result);
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

testAPI();
`;

console.log(browserTestCode);

console.log('\n📋 COPY THE CODE ABOVE AND:');
console.log('1. Open http://localhost:3005');
console.log('2. Open browser developer tools (F12)');
console.log('3. Go to Console tab');
console.log('4. Paste and run the code');
console.log('5. Go to /cart and /checkout to see which structure displays correctly');

console.log('\n🎯 EXPECTED RESULTS:');
console.log('- If "Grouped" structure works: checkout shows "Side Choice: Fries, Size: Regular"');
console.log('- If "Flat" structure works: checkout shows proper customization names');
console.log('- API response will show us the actual format being returned');

console.log('\n💡 This will help us determine the correct data structure to use.');
