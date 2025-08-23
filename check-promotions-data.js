/**
 * Check current promotions data before schema migration
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPromotionsData() {
  try {
    console.log('🔍 Checking current promotions data...\n');

    // Get current promotions
    const promotions = await prisma.promotion.findMany();
    
    console.log(`Found ${promotions.length} promotions in the database:`);
    
    promotions.forEach((promo, index) => {
      console.log(`\n${index + 1}. ${promo.name}`);
      console.log(`   ID: ${promo.id}`);
      console.log(`   Type: ${promo.type} (${typeof promo.type})`);
      console.log(`   Discount Type: ${promo.discountType} (${typeof promo.discountType})`);
      console.log(`   Discount Value: ${promo.discountValue}`);
      console.log(`   Active: ${promo.isActive}`);
      console.log(`   Start Date: ${promo.startDate || 'No start date'}`);
      console.log(`   End Date: ${promo.endDate || 'No end date'}`);
      console.log(`   Categories: ${JSON.stringify(promo.applicableCategories)}`);
      console.log(`   Usage: ${promo.usageCount}/${promo.usageLimit || 'unlimited'}`);
      console.log(`   Requires Login: ${promo.requiresLogin}`);
      console.log(`   User Restrictions: ${JSON.stringify(promo.userGroupRestrictions)}`);
      console.log(`   Priority: ${promo.priority}`);
    });

    console.log('\n✅ Data check completed');

  } catch (error) {
    console.error('❌ Error checking promotions data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPromotionsData();
