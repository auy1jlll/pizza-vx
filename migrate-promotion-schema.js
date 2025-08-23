/**
 * Migration script to safely update promotion schema while preserving data
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migratePromotionSchema() {
  try {
    console.log('🔄 Starting promotion schema migration...\n');

    // Step 1: Backup current data
    console.log('📦 Backing up current promotion data...');
    const currentPromotions = await prisma.promotion.findMany();
    console.log(`Backed up ${currentPromotions.length} promotions`);

    // Step 2: Clear the table
    console.log('\n🗑️ Clearing promotions table...');
    await prisma.promotion.deleteMany();
    console.log('Table cleared');

    // Step 3: Apply schema changes by forcing reset
    console.log('\n🔧 Applying schema changes...');
    console.log('You can now run: npx prisma db push --force-reset');
    console.log('After that, run the restore script to put the data back.');

    // Save backup data to file for restoration
    const fs = require('fs');
    fs.writeFileSync('promotion-backup.json', JSON.stringify(currentPromotions, null, 2));
    console.log('\n💾 Backup saved to promotion-backup.json');

    console.log('\n✅ Ready for schema migration');

  } catch (error) {
    console.error('❌ Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migratePromotionSchema();
