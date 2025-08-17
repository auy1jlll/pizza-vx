const fetch = require('node-fetch');

async function testCartRefreshWithRealData() {
  try {
    console.log('🧪 Testing cart refresh-prices with REAL database IDs...\n');

    // Use actual IDs from the database
    const realCartData = {
      pizzaItems: [
        {
          id: 'pizza-test-1',
          size: { id: 'cmedughin0000vkjwzquehzwn' }, // Small
          crust: { id: 'cmedtz4u50001vk4kc54gk39n' }, // Regular Crust
          sauce: { id: 'cmedtz4vb0003vk4kdd41lpsl' }, // Original Pizza Sauce
          toppings: [
            { id: 'cmedtz4xs0007vk4k2czguwk2', quantity: 1 }, // Pepperoni
            { id: 'cmedtz4x50006vk4kkt5ntf7v', quantity: 1 }  // Extra Cheese
          ]
        }
      ],
      menuItems: [
        {
          id: 'menu-test-1',
          menuItemId: 'cmef5tfxh0034vki4st3l89ac', // Italian Sub
          name: 'Italian Sub',
          price: 8.99,
          customizations: []
        }
      ]
    };

    console.log('📤 Sending request with real IDs...');
    console.log('Cart data:', JSON.stringify(realCartData, null, 2));

    const response = await fetch('http://localhost:3005/api/cart/refresh-prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(realCartData)
    });

    console.log(`\n📨 Response status: ${response.status}`);

    const responseText = await response.text();
    console.log('📥 Response body:', responseText);

    if (response.ok) {
      try {
        const jsonData = JSON.parse(responseText);
        console.log('\n✅ SUCCESS! Cart refresh-prices worked with real data');
        console.log('Parsed response:', JSON.stringify(jsonData, null, 2));
        return true;
      } catch (parseError) {
        console.error('❌ Failed to parse JSON response:', parseError.message);
        return false;
      }
    } else {
      console.error(`❌ Request failed with status: ${response.status}`);
      console.error('Response body:', responseText);
      return false;
    }

  } catch (error) {
    console.error('❌ Error testing cart refresh-prices:', error);
    return false;
  }
}

async function testWithEmptyCart() {
  try {
    console.log('\n🧪 Testing with empty cart...');
    
    const emptyCartData = {
      pizzaItems: [],
      menuItems: []
    };

    const response = await fetch('http://localhost:3005/api/cart/refresh-prices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emptyCartData)
    });

    console.log(`📨 Empty cart response status: ${response.status}`);
    const responseData = await response.text();
    console.log('📥 Empty cart response:', responseData);

    return response.ok;
  } catch (error) {
    console.error('❌ Error testing empty cart:', error);
    return false;
  }
}

async function runRealDataTests() {
  console.log('🚀 Testing cart refresh-prices with real database data...\n');
  
  const realDataTest = await testCartRefreshWithRealData();
  const emptyCartTest = await testWithEmptyCart();

  console.log('\n📊 Test Results Summary:');
  console.log('Real data test:', realDataTest ? '✅ PASS' : '❌ FAIL');
  console.log('Empty cart test:', emptyCartTest ? '✅ PASS' : '❌ FAIL');

  if (realDataTest) {
    console.log('\n🎉 The cart refresh-prices endpoint is working correctly!');
    console.log('The 500 error you saw might be caused by:');
    console.log('1. Invalid IDs in the cart data sent from the frontend');
    console.log('2. Malformed cart data structure');
    console.log('3. Network/timing issues');
  } else {
    console.log('\n🔍 The endpoint is still failing - need deeper investigation');
  }
}

runRealDataTests().catch(console.error);
