#!/usr/bin/env node

// Test the promotion service directly (no API call)
import PromotionService from './src/lib/promotion-service.js';

console.log('🧪 Testing Promotion Service Logic Directly\n');

// Test data - 2 pizzas of different prices
const testItems = [
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
];

console.log('🍕 Testing: Large Pepperoni ($24.99) + Medium Margherita ($18.99)');

try {
  const result = PromotionService.applyBuyOneGetSecondHalfOff(testItems);
  
  console.log('✅ Promotion calculation completed!');
  console.log(`📊 Original Total: $${result.originalTotal.toFixed(2)}`);
  console.log(`💰 Discount: $${result.discountAmount.toFixed(2)}`);
  console.log(`🎯 Final Total: $${result.finalTotal.toFixed(2)}`);
  console.log(`🏷️  Promotion: ${result.promotionApplied}`);
  
  if (result.discountDetails.length > 0) {
    console.log('\n📋 Discount Details:');
    result.discountDetails.forEach(detail => {
      console.log(`   • ${detail.itemName}: $${detail.originalPrice.toFixed(2)} → $${detail.finalPrice.toFixed(2)}`);
      console.log(`     Reason: ${detail.reason}`);
    });
  }

  // Expected: $18.99 pizza should get 50% off = $9.50 discount
  // Total should be $24.99 + $9.49 = $34.48
  const expectedDiscount = 18.99 * 0.5; // $9.495
  const expectedTotal = 24.99 + (18.99 - expectedDiscount); // $34.485
  
  console.log(`\n🧮 Expected discount: $${expectedDiscount.toFixed(2)}`);
  console.log(`🧮 Expected total: $${expectedTotal.toFixed(2)}`);
  console.log(`✅ Calculation ${Math.abs(result.discountAmount - expectedDiscount) < 0.01 ? 'CORRECT' : 'INCORRECT'}`);

} catch (error) {
  console.log('❌ Test failed:', error.message);
  console.log('Stack:', error.stack);
}
