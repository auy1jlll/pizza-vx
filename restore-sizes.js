const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function restoreSizes(backupFile) {
  console.log(`🔄 Restoring specialty pizza and calzone sizes from: ${backupFile}`);
  
  try {
    if (!fs.existsSync(backupFile)) {
      throw new Error(`Backup file not found: ${backupFile}`);
    }

    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    console.log(`📅 Backup from: ${backup.timestamp || 'Unknown'}`);

    // Check current counts
    const currentPizzaSizes = await prisma.specialtyPizzaSize.count();
    const currentCalzoneSizes = await prisma.specialtyCalzoneSize.count();
    console.log(`Current Specialty Pizza Sizes: ${currentPizzaSizes}`);
    console.log(`Current Specialty Calzone Sizes: ${currentCalzoneSizes}`);

    // Clear existing sizes
    console.log('🗑️ Clearing existing specialty sizes...');
    await prisma.specialtyPizzaSize.deleteMany();
    await prisma.specialtyCalzoneSize.deleteMany();

    // Restore specialty pizza sizes
    if (backup.specialtyPizzaSizes?.length) {
      console.log('📏 Restoring specialty pizza sizes...');
      await prisma.specialtyPizzaSize.createMany({ data: backup.specialtyPizzaSizes });
      console.log(`✅ Restored ${backup.specialtyPizzaSizes.length} specialty pizza sizes`);
    }

    // Restore specialty calzone sizes
    if (backup.specialtyCalzoneSizes?.length) {
      console.log('📏 Restoring specialty calzone sizes...');
      await prisma.specialtyCalzoneSize.createMany({ data: backup.specialtyCalzoneSizes });
      console.log(`✅ Restored ${backup.specialtyCalzoneSizes.length} specialty calzone sizes`);
    }

    // Verify final counts
    const finalPizzaSizes = await prisma.specialtyPizzaSize.count();
    const finalCalzoneSizes = await prisma.specialtyCalzoneSize.count();
    console.log(`\n📊 Final Counts:`);
    console.log(`Specialty Pizza Sizes: ${finalPizzaSizes}`);
    console.log(`Specialty Calzone Sizes: ${finalCalzoneSizes}`);

    console.log('\n🎉 Specialty sizes restoration complete!');
    
  } catch (error) {
    console.error('❌ Restore failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Usage: node restore-sizes.js path/to/backup.json
if (require.main === module) {
  const backupFile = process.argv[2];
  if (!backupFile) {
    console.error('Usage: node restore-sizes.js <backup-file>');
    process.exit(1);
  }
  restoreSizes(backupFile).catch(console.error);
}

module.exports = { restoreSizes };
