const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

async function restoreDatabase() {
  try {
    console.log('🔄 Restoring database from backup...');
    
    // Read backup files
    const appSettings = JSON.parse(await fs.readFile(path.join(__dirname, 'app-settings.json'), 'utf8'));
    const categories = JSON.parse(await fs.readFile(path.join(__dirname, 'menu-categories.json'), 'utf8'));
    const menuItems = JSON.parse(await fs.readFile(path.join(__dirname, 'menu-items.json'), 'utf8'));
    const customizationGroups = JSON.parse(await fs.readFile(path.join(__dirname, 'customization-groups.json'), 'utf8'));
    const customizationOptions = JSON.parse(await fs.readFile(path.join(__dirname, 'customization-options.json'), 'utf8'));
    const menuItemCustomizations = JSON.parse(await fs.readFile(path.join(__dirname, 'menu-item-customizations.json'), 'utf8'));
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️ Clearing existing data...');
    await prisma.menuItemCustomization.deleteMany();
    await prisma.customizationOption.deleteMany();
    await prisma.customizationGroup.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.menuCategory.deleteMany();
    await prisma.appSetting.deleteMany();
    
    // Restore data
    console.log('📊 Restoring app settings...');
    for (const setting of appSettings) {
      await prisma.appSetting.create({ data: setting });
    }
    
    console.log('📋 Restoring menu categories...');
    for (const category of categories) {
      await prisma.menuCategory.create({ data: category });
    }
    
    console.log('🍽️ Restoring menu items...');
    for (const item of menuItems) {
      await prisma.menuItem.create({ data: item });
    }
    
    console.log('🎛️ Restoring customization groups...');
    for (const group of customizationGroups) {
      await prisma.customizationGroup.create({ data: group });
    }
    
    console.log('⚙️ Restoring customization options...');
    for (const option of customizationOptions) {
      await prisma.customizationOption.create({ data: option });
    }
    
    console.log('🔗 Restoring menu item customizations...');
    for (const customization of menuItemCustomizations) {
      await prisma.menuItemCustomization.create({ data: customization });
    }
    
    console.log('✅ Database restoration completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during restoration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreDatabase();