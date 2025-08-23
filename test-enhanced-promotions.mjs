/**
 * Test the enhanced promotion service with database integration
 */

// Import the enhanced promotion service
import PromotionService from './src/lib/promotion-service-enhanced.js';

// Mock cart items for testing
const sampleCart = [
  {
    id: 'pizza-1',
    name: 'Margherita Pizza',
    type: 'pizza',
    category: 'pizza',
    basePrice: 18.99,
    totalPrice: 18.99,
    quantity: 1,
    size: { name: 'Large', basePrice: 18.99 }
  },
  {
    id: 'pizza-2',
    name: 'Pepperoni Pizza',
    type: 'pizza',
    category: 'pizza',
    basePrice: 19.99,
    totalPrice: 19.99,
    quantity: 1,
    size: { name: 'Large', basePrice: 19.99 }
  },
  {
    id: 'drink-1',
    name: 'Coca Cola',
    type: 'menu',
    category: 'drinks',
    basePrice: 2.99,
    totalPrice: 2.99,
    quantity: 2
  }
];

async function testEnhancedPromotionService() {
  try {
    console.log('🧪 Testing Enhanced Promotion Service\n');

    // Test 1: Get active promotions
    console.log('📋 Test 1: Getting active promotions');
    const activePromotions = await PromotionService.getActivePromotions();
    console.log(`Found ${activePromotions.length} active promotions`);
    
    // Test 2: Apply best promotion
    console.log('\n🎯 Test 2: Applying best promotion');
    const result = await PromotionService.applyBestPromotions(sampleCart);
    console.log(`Original Total: $${result.originalTotal.toFixed(2)}`);
    console.log(`Discount: $${result.discountAmount.toFixed(2)}`);
    console.log(`Final Total: $${result.finalTotal.toFixed(2)}`);
    console.log(`Promotion Applied: ${result.promotionApplied}`);
    
    if (result.discountDetails.length > 0) {
      console.log('\nDiscount Details:');
      result.discountDetails.forEach(detail => {
        console.log(`  - ${detail.itemName}: $${detail.originalPrice.toFixed(2)} → $${detail.finalPrice.toFixed(2)} (${detail.reason})`);
      });
    }

    // Test 3: Test with VIP user
    console.log('\n👑 Test 3: Testing with VIP user');
    const vipResult = await PromotionService.applyBestPromotions(sampleCart, 'VIP');
    console.log(`VIP Result: ${vipResult.promotionApplied}`);
    console.log(`VIP Discount: $${vipResult.discountAmount.toFixed(2)}`);

    // Test 4: Test promotion applicability
    console.log('\n✅ Test 4: Testing promotion applicability');
    for (const promotion of activePromotions) {
      const applicable = PromotionService.isPromotionApplicable(promotion, sampleCart);
      console.log(`${promotion.name}: ${applicable ? '✅ Applicable' : '❌ Not applicable'}`);
    }

    console.log('\n🎉 Enhanced promotion service test completed!');

  } catch (error) {
    console.error('❌ Error testing enhanced promotion service:', error);
  }
}

testEnhancedPromotionService();
