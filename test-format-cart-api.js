// Test the format-cart API to see what structure it actually returns
const fetch = require('node-fetch');

async function testFormatCartAPI() {
  console.log('🔍 TESTING FORMAT-CART API');
  console.log('===========================');

  try {
    // Test data that might be sent from a dinner plate customizer
    const testRequest = {
      menuItemId: 'cmeghhm32000dvk74ahje65y8', // BBQ Ribs ID from the logs
      customizations: [
        {
          customizationOptionId: 'cmeghidt5005ivkxcd6oblt96', // Fries option ID from logs
          quantity: 1
        },
        {
          customizationOptionId: 'cmef5tfjd000uvki4vznoqsoz', // Regular size option ID from logs
          quantity: 1
        }
      ]
    };

    console.log('📤 Request payload:');
    console.log(JSON.stringify(testRequest, null, 2));

    const response = await fetch('http://localhost:3005/api/menu/format-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testRequest)
    });

    const result = await response.json();

    console.log('\n📥 API Response:');
    console.log(JSON.stringify(result, null, 2));

    if (result.success && result.data) {
      console.log('\n📊 CUSTOMIZATIONS STRUCTURE:');
      console.log(JSON.stringify(result.data.customizations, null, 2));

      console.log('\n🔧 ANALYSIS:');
      if (result.data.customizations && Array.isArray(result.data.customizations)) {
        result.data.customizations.forEach((group, index) => {
          console.log(`Group ${index + 1}: "${group.groupName}"`);
          if (group.selections && Array.isArray(group.selections)) {
            group.selections.forEach((selection, selIndex) => {
              console.log(`  Selection ${selIndex + 1}: "${selection.optionName}" (price: $${selection.price})`);
            });
          }
        });
      }

      console.log('\n💡 COMPARISON WITH CHECKOUT DISPLAY:');
      console.log('Checkout expects: custom.groupName and custom.optionName');
      console.log('API returns: group.groupName and group.selections[].optionName');
      console.log('🚨 MISMATCH! The display logic needs to be updated.');
    }

  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    console.log('\n🔧 Make sure the server is running on localhost:3005');
  }
}

testFormatCartAPI();
