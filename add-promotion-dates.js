/**
 * Add date ranges to existing promotions
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addPromotionDates() {
  try {
    console.log('📅 Adding date ranges to promotions...\n');

    // Get current date
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const nextWeekend = new Date(now);
    nextWeekend.setDate(now.getDate() + (6 - now.getDay())); // Next Saturday
    const weekendEnd = new Date(nextWeekend);
    weekendEnd.setDate(nextWeekend.getDate() + 1); // Sunday

    console.log(`Current date: ${now.toISOString().split('T')[0]}`);
    console.log(`One week ago: ${oneWeekAgo.toISOString().split('T')[0]}`);
    console.log(`One month from now: ${oneMonthFromNow.toISOString().split('T')[0]}`);
    console.log(`Next weekend: ${nextWeekend.toISOString().split('T')[0]} - ${weekendEnd.toISOString().split('T')[0]}\n`);

    // Update BOGO promotion - ongoing campaign
    console.log('🍕 Updating BOGO promotion with ongoing dates...');
    await prisma.promotion.update({
      where: { id: 'sample-bogo-50' },
      data: {
        startDate: oneWeekAgo,
        endDate: oneMonthFromNow,
        description: 'Buy any pizza and get the second pizza at 50% off! Valid until end of month.'
      }
    });
    console.log('   ✅ BOGO promotion updated');

    // Update Weekend Special - limited time
    console.log('🎉 Updating Weekend Special with weekend dates...');
    await prisma.promotion.update({
      where: { id: 'sample-weekend-20' },
      data: {
        startDate: nextWeekend,
        endDate: weekendEnd,
        minimumOrderAmount: 25.00,
        description: 'Weekend Special: 20% off orders over $25. Valid this weekend only!'
      }
    });
    console.log('   ✅ Weekend Special updated');

    // Update VIP Delivery - no end date (ongoing for VIP members)
    console.log('👑 Updating VIP Free Delivery...');
    await prisma.promotion.update({
      where: { id: 'sample-vip-delivery' },
      data: {
        startDate: oneWeekAgo,
        endDate: null, // No end date for VIP benefits
        minimumOrderAmount: 15.00,
        description: 'VIP members enjoy free delivery on orders over $15. Exclusive VIP benefit!'
      }
    });
    console.log('   ✅ VIP Free Delivery updated');

    // Create a limited-time flash sale
    console.log('⚡ Creating Flash Sale promotion...');
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(tomorrow.getDate() + 1);

    await prisma.promotion.create({
      data: {
        id: 'flash-sale-pizza',
        name: 'Flash Sale: 30% Off Pizza',
        description: 'Limited time flash sale! 30% off all pizzas. Hurry, ends soon!',
        type: 'PERCENTAGE_DISCOUNT',
        discountType: 'PERCENTAGE',
        discountValue: 30,
        minimumOrderAmount: 20.00,
        maximumDiscountAmount: 15.00,
        applicableCategories: ['pizza'],
        applicableItems: [],
        requiresLogin: false,
        userGroupRestrictions: [],
        startDate: tomorrow,
        endDate: dayAfterTomorrow,
        isActive: true,
        usageLimit: 100,
        usageCount: 0,
        perUserLimit: 1,
        stackable: false,
        priority: 5,
        terms: 'Limited time offer. One use per customer. Cannot be combined with other offers.'
      }
    });
    console.log('   ✅ Flash Sale created');

    console.log('\n📊 Updated promotion summary:');
    const updatedPromotions = await prisma.promotion.findMany({
      orderBy: { priority: 'desc' }
    });

    updatedPromotions.forEach(promo => {
      const startDate = promo.startDate ? promo.startDate.toISOString().split('T')[0] : 'No start';
      const endDate = promo.endDate ? promo.endDate.toISOString().split('T')[0] : 'No end';
      const status = promo.isActive ? '🟢 Active' : '🔴 Inactive';
      
      console.log(`\n${promo.name} ${status}`);
      console.log(`   Dates: ${startDate} → ${endDate}`);
      console.log(`   Type: ${promo.type} (${promo.discountValue}${promo.discountType === 'PERCENTAGE' ? '%' : '$'} off)`);
      if (promo.minimumOrderAmount) {
        console.log(`   Min Order: $${promo.minimumOrderAmount}`);
      }
      if (promo.usageLimit) {
        console.log(`   Usage: ${promo.usageCount}/${promo.usageLimit}`);
      }
    });

    console.log('\n✅ All promotion dates updated successfully!');

  } catch (error) {
    console.error('❌ Error updating promotion dates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addPromotionDates();
