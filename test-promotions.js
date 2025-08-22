#!/usr/bin/env node

console.log('🧪 Testing Promotion Service');

async function testPromotions() {
  try {
    console.log('\n📦 Testing "Buy One Get Second Half Off" Promotion\n');

    // Test data - 2 pizzas of different prices
    const testOrder1 = {
      items: [
        {
          id: 'pizza-1',
          name: 'Large Pepperoni Pizza',
          basePrice: 24.99,
          totalPrice: 24.99,
          quantity: 1,
          type: 'pizza',
          size: { name: 'Large', basePrice: 24.99 }
        },
        {
          id: 'pizza-2', 
          name: 'Medium Margherita Pizza',
          basePrice: 18.99,
          totalPrice: 18.99,
          quantity: 1,
          type: 'pizza',
          size: { name: 'Medium', basePrice: 18.99 }
        }
      ]
    };

    console.log('🍕 Order 1: Large Pepperoni ($24.99) + Medium Margherita ($18.99)');
    
    const response1 = await fetch('http://localhost:3005/api/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testOrder1)
    });

    const result1 = await response1.json();
    
    if (result1.success) {
      console.log('✅ Promotion applied successfully!');
      console.log(`📊 Original Total: $${result1.data.originalTotal.toFixed(2)}`);
      console.log(`💰 Discount: $${result1.data.discountAmount.toFixed(2)}`);
      console.log(`🎯 Final Total: $${result1.data.finalTotal.toFixed(2)}`);
      console.log(`🏷️  Promotion: ${result1.data.promotionApplied}`);
      
      if (result1.data.discountDetails.length > 0) {
        console.log('\n📋 Discount Details:');
        result1.data.discountDetails.forEach(detail => {
          console.log(`   • ${detail.itemName}: $${detail.originalPrice.toFixed(2)} → $${detail.finalPrice.toFixed(2)} (${detail.reason})`);
        });
      }
    } else {
      console.log('❌ Failed:', result1.error);
    }

    // Test with 3 pizzas to see if quantity-based promotion triggers
    console.log('\n\n🍕 Order 2: Testing 3 pizzas (should get 20% off)');
    
    const testOrder2 = {
      items: [
        {
          id: 'pizza-1',
          name: 'Large Pepperoni Pizza',
          basePrice: 24.99,
          totalPrice: 24.99,
          quantity: 1,
          type: 'pizza'
        },
        {
          id: 'pizza-2',
          name: 'Medium Margherita Pizza', 
          basePrice: 18.99,
          totalPrice: 18.99,
          quantity: 1,
          type: 'pizza'
        },
        {
          id: 'pizza-3',
          name: 'Small Hawaiian Pizza',
          basePrice: 15.99,
          totalPrice: 15.99,
          quantity: 1,
          type: 'pizza'
        }
      ]
    };

    const response2 = await fetch('http://localhost:3005/api/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testOrder2)
    });

    const result2 = await response2.json();
    
    if (result2.success) {
      console.log('✅ Best promotion applied:');
      console.log(`📊 Original Total: $${result2.data.originalTotal.toFixed(2)}`);
      console.log(`💰 Discount: $${result2.data.discountAmount.toFixed(2)}`);
      console.log(`🎯 Final Total: $${result2.data.finalTotal.toFixed(2)}`);
      console.log(`🏷️  Promotion: ${result2.data.promotionApplied}`);
    }

    // Test with single pizza (no promotion should apply)
    console.log('\n\n🍕 Order 3: Single pizza (no promotion should apply)');
    
    const testOrder3 = {
      items: [
        {
          id: 'pizza-1',
          name: 'Large Pepperoni Pizza',
          basePrice: 24.99,
          totalPrice: 24.99,
          quantity: 1,
          type: 'pizza'
        }
      ]
    };

    const response3 = await fetch('http://localhost:3005/api/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testOrder3)
    });

    const result3 = await response3.json();
    
    if (result3.success) {
      console.log(`📊 Total: $${result3.data.finalTotal.toFixed(2)}`);
      console.log(`🏷️  Result: ${result3.data.promotionApplied}`);
    }

    // Test available promotions endpoint
    console.log('\n\n📋 Available Promotions:');
    
    const promotionsResponse = await fetch('http://localhost:3005/api/promotions');
    const promotionsResult = await promotionsResponse.json();
    
    if (promotionsResult.success) {
      promotionsResult.data.forEach((promo, index) => {
        console.log(`${index + 1}. ${promo.name}`);
        console.log(`   ${promo.description}`);
        if (promo.termsAndConditions) {
          console.log(`   Terms: ${promo.termsAndConditions}`);
        }
        console.log('');
      });
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testPromotions();
