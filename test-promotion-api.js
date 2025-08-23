/**
 * Test promotion API endpoint directly
 */

async function testPromotionAPI() {
  try {
    console.log('🧪 Testing Promotion API...\n');

    // Test data for a new promotion
    const testPromotion = {
      name: "Test API Promotion",
      description: "Testing the API endpoint",
      type: "PERCENTAGE_DISCOUNT",
      discountType: "PERCENTAGE",
      discountValue: 15,
      minimumOrderAmount: 20,
      maximumDiscountAmount: 10,
      applicableCategories: ["pizza"],
      requiresLogin: false,
      userGroupRestrictions: [],
      isActive: true,
      priority: 1,
      stackable: false,
      terms: "Test promotion terms"
    };

    console.log('📤 Sending POST request to create promotion...');
    console.log('Data:', JSON.stringify(testPromotion, null, 2));

    const response = await fetch('http://localhost:3005/api/admin/promotions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPromotion)
    });

    console.log(`\n📥 Response status: ${response.status}`);
    console.log(`Response status text: ${response.statusText}`);

    const responseText = await response.text();
    console.log(`Response body: ${responseText}`);

    if (response.ok) {
      const result = JSON.parse(responseText);
      console.log('\n✅ Promotion created successfully!');
      console.log('Promotion ID:', result.promotion?.id);
    } else {
      console.log('\n❌ Failed to create promotion');
      if (responseText) {
        try {
          const error = JSON.parse(responseText);
          console.log('Error message:', error.error);
        } catch (e) {
          console.log('Raw error:', responseText);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

testPromotionAPI();
