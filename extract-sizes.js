const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function extractAndRestoreSizes(backupFile) {
  console.log(`🔄 Extracting and restoring specialty sizes from: ${backupFile}`);
  
  try {
    if (!fs.existsSync(backupFile)) {
      throw new Error(`Backup file not found: ${backupFile}`);
    }

    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    console.log(`📅 Backup from: ${backup.timestamp || 'Unknown'}`);

    // Extract specialty pizza sizes from nested data
    const specialtyPizzaSizes = [];
    if (backup.specialtyPizzas?.length) {
      for (const pizza of backup.specialtyPizzas) {
        if (pizza.sizes?.length) {
          for (const size of pizza.sizes) {
            const { pizzaSize, ...cleanSize } = size;
            specialtyPizzaSizes.push(cleanSize);
          }
        }
      }
    }

    // Extract specialty calzone sizes from nested data
    const specialtyCalzoneSizes = [];
    if (backup.specialtyCalzones?.length) {
      for (const calzone of backup.specialtyCalzones) {
        if (calzone.sizes?.length) {
          for (const size of calzone.sizes) {
            const { pizzaSize, ...cleanSize } = size;
            specialtyCalzoneSizes.push(cleanSize);
          }
        }
      }
    }

    console.log(`Found ${specialtyPizzaSizes.length} specialty pizza sizes to restore`);
    console.log(`Found ${specialtyCalzoneSizes.length} specialty calzone sizes to restore`);

    // Clear existing sizes
    console.log('🗑️ Clearing existing specialty sizes...');
    await prisma.specialtyPizzaSize.deleteMany();
    await prisma.specialtyCalzoneSize.deleteMany();

    // Restore specialty pizza sizes
    if (specialtyPizzaSizes.length > 0) {
      console.log('📏 Restoring specialty pizza sizes...');
      await prisma.specialtyPizzaSize.createMany({ data: specialtyPizzaSizes });
      console.log(`✅ Restored ${specialtyPizzaSizes.length} specialty pizza sizes`);
    }

    // Restore specialty calzone sizes
    if (specialtyCalzoneSizes.length > 0) {
      console.log('📏 Restoring specialty calzone sizes...');
      await prisma.specialtyCalzoneSize.createMany({ data: specialtyCalzoneSizes });
      console.log(`✅ Restored ${specialtyCalzoneSizes.length} specialty calzone sizes`);
    }

    // Verify final counts
    const finalPizzaSizes = await prisma.specialtyPizzaSize.count();
    const finalCalzoneSizes = await prisma.specialtyCalzoneSize.count();
    console.log(`\n📊 Final Counts:`);
    console.log(`Specialty Pizza Sizes: ${finalPizzaSizes}`);
    console.log(`Specialty Calzone Sizes: ${finalCalzoneSizes}`);

    console.log('\n🎉 Specialty sizes extraction and restoration complete!');
    
  } catch (error) {
    console.error('❌ Restore failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Usage: node extract-sizes.js path/to/backup.json
if (require.main === module) {
  const backupFile = process.argv[2];
  if (!backupFile) {
    console.error('Usage: node extract-sizes.js <backup-file>');
    process.exit(1);
  }
  extractAndRestoreSizes(backupFile).catch(console.error);
}

module.exports = { extractAndRestoreSizes };
