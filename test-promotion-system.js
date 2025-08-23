/**
 * Test script for the enhanced promotion system
 * Tests database-driven promotions with various scenarios
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Mock cart items for testing
const sampleCartItems = [
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

async function testPromotionSystem() {
  try {
    console.log('🧪 Testing Enhanced Promotion System\n');

    // Test 1: Get active promotions
    console.log('📋 Test 1: Getting active promotions');
    const activePromotions = await prisma.promotion.findMany({
      where: { isActive: true }
    });
    console.log(`Found ${activePromotions.length} active promotions:`);
    activePromotions.forEach(promo => {
      console.log(`  - ${promo.name} (${promo.type}): ${promo.discountValue}${promo.discountType === 'PERCENTAGE' ? '%' : '$'} off`);
    });
    console.log('');

    // Test 2: Test BOGO promotion
    console.log('🍕 Test 2: Testing BOGO 50% promotion');
    const bogoPromo = activePromotions.find(p => p.type === 'BOGO_HALF_OFF');
    if (bogoPromo) {
      console.log(`Applying: ${bogoPromo.name}`);
      
      // Calculate original total
      const originalTotal = sampleCartItems.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
      console.log(`Original total: $${originalTotal.toFixed(2)}`);
      
      // Filter pizza items for BOGO
      const pizzaItems = sampleCartItems.filter(item => item.type === 'pizza');
      console.log(`Pizza items: ${pizzaItems.length}`);
      
      if (pizzaItems.length >= 2) {
        // Apply 50% discount to cheaper pizza
        const cheaperPrice = Math.min(...pizzaItems.map(p => p.totalPrice));
        const discount = cheaperPrice * 0.5;
        const finalTotal = originalTotal - discount;
        
        console.log(`Cheaper pizza price: $${cheaperPrice.toFixed(2)}`);
        console.log(`Discount applied: $${discount.toFixed(2)}`);
        console.log(`Final total: $${finalTotal.toFixed(2)}`);
        console.log(`Savings: $${discount.toFixed(2)} (${((discount/originalTotal)*100).toFixed(1)}%)`);
      }
    } else {
      console.log('No BOGO promotion found');
    }
    console.log('');

    // Test 3: Test percentage discount
    console.log('💯 Test 3: Testing percentage discount');
    const percentPromo = activePromotions.find(p => p.type === 'PERCENTAGE_DISCOUNT');
    if (percentPromo) {
      console.log(`Applying: ${percentPromo.name}`);
      
      const originalTotal = sampleCartItems.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
      const discount = originalTotal * (percentPromo.discountValue / 100);
      const finalTotal = originalTotal - discount;
      
      console.log(`Original total: $${originalTotal.toFixed(2)}`);
      console.log(`Discount (${percentPromo.discountValue}%): $${discount.toFixed(2)}`);
      console.log(`Final total: $${finalTotal.toFixed(2)}`);
    } else {
      console.log('No percentage discount found');
    }
    console.log('');

    // Test 4: Test category filtering
    console.log('🏷️ Test 4: Testing category-specific promotions');
    const categoryPromos = activePromotions.filter(p => p.applicableCategories.length > 0);
    console.log(`Found ${categoryPromos.length} category-specific promotions:`);
    
    categoryPromos.forEach(promo => {
      console.log(`  - ${promo.name}: applies to [${promo.applicableCategories.join(', ')}]`);
      
      // Check which items qualify
      const qualifyingItems = sampleCartItems.filter(item => 
        promo.applicableCategories.includes(item.category || item.type)
      );
      console.log(`    Qualifying items: ${qualifyingItems.length}`);
      qualifyingItems.forEach(item => {
        console.log(`      - ${item.name} (${item.category || item.type})`);
      });
    });
    console.log('');

    // Test 5: Test minimum order amount
    console.log('💰 Test 5: Testing minimum order requirements');
    const minOrderPromos = activePromotions.filter(p => p.minimumOrderAmount && p.minimumOrderAmount > 0);
    const currentTotal = sampleCartItems.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
    
    console.log(`Current cart total: $${currentTotal.toFixed(2)}`);
    minOrderPromos.forEach(promo => {
      const qualifies = currentTotal >= promo.minimumOrderAmount;
      console.log(`  - ${promo.name}: requires $${promo.minimumOrderAmount} - ${qualifies ? '✅ QUALIFIES' : '❌ DOES NOT QUALIFY'}`);
    });
    console.log('');

    // Test 6: Test user group restrictions
    console.log('👥 Test 6: Testing user group restrictions');
    const restrictedPromos = activePromotions.filter(p => p.userGroupRestrictions.length > 0);
    console.log(`Found ${restrictedPromos.length} promotions with user restrictions:`);
    
    restrictedPromos.forEach(promo => {
      console.log(`  - ${promo.name}: restricted to [${promo.userGroupRestrictions.join(', ')}]`);
    });
    console.log('');

    // Test 7: Test promotion priority
    console.log('🏆 Test 7: Testing promotion priority order');
    const sortedByPriority = [...activePromotions].sort((a, b) => b.priority - a.priority);
    console.log('Promotions by priority (highest first):');
    sortedByPriority.forEach((promo, index) => {
      console.log(`  ${index + 1}. ${promo.name} (Priority: ${promo.priority})`);
    });
    console.log('');

    // Test 8: Test usage limits
    console.log('📊 Test 8: Testing usage limits and counts');
    const limitedPromos = activePromotions.filter(p => p.usageLimit && p.usageLimit > 0);
    console.log(`Found ${limitedPromos.length} promotions with usage limits:`);
    
    limitedPromos.forEach(promo => {
      const remaining = promo.usageLimit - promo.usageCount;
      const percentage = ((promo.usageCount / promo.usageLimit) * 100).toFixed(1);
      console.log(`  - ${promo.name}: ${promo.usageCount}/${promo.usageLimit} used (${percentage}%, ${remaining} remaining)`);
    });
    console.log('');

    console.log('✅ All promotion tests completed successfully!');

  } catch (error) {
    console.error('❌ Error testing promotion system:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the tests
testPromotionSystem();
