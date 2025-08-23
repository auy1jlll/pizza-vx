/**
 * Restore promotion data after schema migration
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function restorePromotionData() {
  try {
    console.log('🔄 Restoring promotion data...\n');

    // Read backup data
    const backupData = JSON.parse(fs.readFileSync('promotion-backup.json', 'utf8'));
    console.log(`Found ${backupData.length} promotions to restore`);

    // Restore each promotion
    for (const promo of backupData) {
      console.log(`\n📥 Restoring: ${promo.name}`);
      
      const restoredPromo = await prisma.promotion.create({
        data: {
          id: promo.id,
          name: promo.name,
          description: promo.description,
          type: promo.type, // Now using enum
          discountType: promo.discountType, // Now using enum
          discountValue: promo.discountValue,
          minimumOrderAmount: promo.minimumOrderAmount,
          maximumDiscountAmount: promo.maximumDiscountAmount,
          minimumQuantity: promo.minimumQuantity,
          applicableCategories: promo.applicableCategories || [],
          applicableItems: promo.applicableItems || [],
          requiresLogin: promo.requiresLogin || false,
          userGroupRestrictions: promo.userGroupRestrictions || [],
          startDate: promo.startDate ? new Date(promo.startDate) : null,
          endDate: promo.endDate ? new Date(promo.endDate) : null,
          isActive: promo.isActive,
          usageLimit: promo.usageLimit,
          usageCount: promo.usageCount || 0,
          perUserLimit: promo.perUserLimit,
          stackable: promo.stackable || false,
          priority: promo.priority || 1,
          terms: promo.terms
        }
      });
      
      console.log(`   ✅ Restored with ID: ${restoredPromo.id}`);
    }

    console.log('\n🎉 All promotions restored successfully!');

  } catch (error) {
    console.error('❌ Error restoring data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restorePromotionData();
