const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function restoreMissingData(backupFile) {
  console.log(`🔄 Restoring missing data from: ${backupFile}`);
  
  try {
    if (!fs.existsSync(backupFile)) {
      throw new Error(`Backup file not found: ${backupFile}`);
    }

    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    console.log(`📅 Backup from: ${backup.timestamp || 'Unknown'}`);

    // Restore specialty pizzas
    if (backup.specialtyPizzas?.length) {
      console.log('🍕 Restoring specialty pizzas...');
      const cleanSpecialtyPizzas = backup.specialtyPizzas.map(pizza => {
        const { sizes, ...cleanPizza } = pizza;
        return cleanPizza;
      });
      await prisma.specialtyPizza.createMany({ data: cleanSpecialtyPizzas });
      console.log(`✅ Restored ${cleanSpecialtyPizzas.length} specialty pizzas`);
    }

    // Restore specialty calzones
    if (backup.specialtyCalzones?.length) {
      console.log('🥟 Restoring specialty calzones...');
      const cleanSpecialtyCalzones = backup.specialtyCalzones.map(calzone => {
        const { sizes, ...cleanCalzone } = calzone;
        return cleanCalzone;
      });
      await prisma.specialtyCalzone.createMany({ data: cleanSpecialtyCalzones });
      console.log(`✅ Restored ${cleanSpecialtyCalzones.length} specialty calzones`);
    }

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

    // Restore modifiers
    if (backup.modifiers?.length) {
      console.log('🔧 Restoring modifiers...');
      await prisma.modifier.createMany({ data: backup.modifiers });
      console.log(`✅ Restored ${backup.modifiers.length} modifiers`);
    }

    // Restore item modifiers
    if (backup.itemModifiers?.length) {
      console.log('🔗 Restoring item modifiers...');
      await prisma.itemModifier.createMany({ data: backup.itemModifiers });
      console.log(`✅ Restored ${backup.itemModifiers.length} item modifiers`);
    }

    // Restore customization groups
    if (backup.customizationGroups?.length) {
      console.log('🎛️ Restoring customization groups...');
      const cleanCustomizationGroups = backup.customizationGroups.map(group => {
        const { options, ...cleanGroup } = group;
        return cleanGroup;
      });
      await prisma.customizationGroup.createMany({ data: cleanCustomizationGroups });
      console.log(`✅ Restored ${cleanCustomizationGroups.length} customization groups`);
    }

    // Restore customization options
    if (backup.customizationOptions?.length) {
      console.log('⚙️ Restoring customization options...');
      await prisma.customizationOption.createMany({ data: backup.customizationOptions });
      console.log(`✅ Restored ${backup.customizationOptions.length} customization options`);
    }

    // Restore menu item customizations
    if (backup.menuItemCustomizations?.length) {
      console.log('🍽️ Restoring menu item customizations...');
      await prisma.menuItemCustomization.createMany({ data: backup.menuItemCustomizations });
      console.log(`✅ Restored ${backup.menuItemCustomizations.length} menu item customizations`);
    }

    console.log('\n🎉 Missing data restoration complete!');
    
    // Verify the restoration
    const specialtyPizzas = await prisma.specialtyPizza.count();
    const specialtyCalzones = await prisma.specialtyCalzone.count();
    const modifiers = await prisma.modifier.count();
    
    console.log('\n📊 Final Data Counts:');
    console.log(`Specialty Pizzas: ${specialtyPizzas}`);
    console.log(`Specialty Calzones: ${specialtyCalzones}`);
    console.log(`Modifiers: ${modifiers}`);
    
  } catch (error) {
    console.error('❌ Restore failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Usage: node restore-missing-data.js path/to/backup.json
if (require.main === module) {
  const backupFile = process.argv[2];
  if (!backupFile) {
    console.error('Usage: node restore-missing-data.js <backup-file>');
    process.exit(1);
  }
  restoreMissingData(backupFile).catch(console.error);
}

module.exports = { restoreMissingData };
