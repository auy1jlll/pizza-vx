const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

async function createDatabaseBackup() {
  try {
    console.log('🗄️ Creating comprehensive database backup...\n');

    // Create backup directory with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, `backup-${timestamp}`);
    await fs.mkdir(backupDir, { recursive: true });

    console.log(`📁 Backup directory: ${backupDir}\n`);

    // 1. Backup App Settings
    console.log('📊 Backing up App Settings...');
    const appSettings = await prisma.appSetting.findMany({
      orderBy: { key: 'asc' }
    });
    await fs.writeFile(
      path.join(backupDir, 'app-settings.json'),
      JSON.stringify(appSettings, null, 2)
    );
    console.log(`✓ Exported ${appSettings.length} app settings`);

    // 2. Backup Menu Categories with full relationships
    console.log('📋 Backing up Menu Categories...');
    const menuCategories = await prisma.menuCategory.findMany({
      include: {
        menuItems: {
          include: {
            customizationGroups: {
              include: {
                customizationGroup: {
                  include: {
                    options: true
                  }
                }
              },
              orderBy: { sortOrder: 'asc' }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });
    await fs.writeFile(
      path.join(backupDir, 'menu-categories-full.json'),
      JSON.stringify(menuCategories, null, 2)
    );
    console.log(`✓ Exported ${menuCategories.length} menu categories with full relationships`);

    // 3. Backup individual tables for easier restoration
    console.log('🗃️ Backing up individual tables...');

    // Menu Categories (simple)
    const categories = await prisma.menuCategory.findMany({ orderBy: { sortOrder: 'asc' } });
    await fs.writeFile(
      path.join(backupDir, 'menu-categories.json'),
      JSON.stringify(categories, null, 2)
    );
    console.log(`✓ Exported ${categories.length} menu categories`);

    // Menu Items
    const menuItems = await prisma.menuItem.findMany({ orderBy: { sortOrder: 'asc' } });
    await fs.writeFile(
      path.join(backupDir, 'menu-items.json'),
      JSON.stringify(menuItems, null, 2)
    );
    console.log(`✓ Exported ${menuItems.length} menu items`);

    // Customization Groups
    const customizationGroups = await prisma.customizationGroup.findMany({ 
      orderBy: { sortOrder: 'asc' }
    });
    await fs.writeFile(
      path.join(backupDir, 'customization-groups.json'),
      JSON.stringify(customizationGroups, null, 2)
    );
    console.log(`✓ Exported ${customizationGroups.length} customization groups`);

    // Customization Options
    const customizationOptions = await prisma.customizationOption.findMany();
    await fs.writeFile(
      path.join(backupDir, 'customization-options.json'),
      JSON.stringify(customizationOptions, null, 2)
    );
    console.log(`✓ Exported ${customizationOptions.length} customization options`);

    // Menu Item Customizations (relationships)
    const menuItemCustomizations = await prisma.menuItemCustomization.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    await fs.writeFile(
      path.join(backupDir, 'menu-item-customizations.json'),
      JSON.stringify(menuItemCustomizations, null, 2)
    );
    console.log(`✓ Exported ${menuItemCustomizations.length} menu item customization relationships`);

    // 4. Create a summary report
    const summary = {
      backupDate: new Date().toISOString(),
      backupDirectory: backupDir,
      tables: {
        appSettings: appSettings.length,
        menuCategories: categories.length,
        menuItems: menuItems.length,
        customizationGroups: customizationGroups.length,
        customizationOptions: customizationOptions.length,
        menuItemCustomizations: menuItemCustomizations.length
      },
      categories: categories.map(cat => ({
        name: cat.name,
        slug: cat.slug,
        itemCount: menuItems.filter(item => item.categoryId === cat.id).length
      }))
    };

    await fs.writeFile(
      path.join(backupDir, 'backup-summary.json'),
      JSON.stringify(summary, null, 2)
    );

    // 5. Create restoration script
    const restoreScript = `const { PrismaClient } = require('@prisma/client');
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

restoreDatabase();`;

    await fs.writeFile(
      path.join(backupDir, 'restore-database.js'),
      restoreScript
    );

    console.log('\n🎉 Backup completed successfully!');
    console.log('📊 Backup Summary:');
    console.log(`   📁 Location: ${backupDir}`);
    console.log(`   📊 App Settings: ${summary.tables.appSettings}`);
    console.log(`   📋 Menu Categories: ${summary.tables.menuCategories}`);
    console.log(`   🍽️ Menu Items: ${summary.tables.menuItems}`);
    console.log(`   🎛️ Customization Groups: ${summary.tables.customizationGroups}`);
    console.log(`   ⚙️ Customization Options: ${summary.tables.customizationOptions}`);
    console.log(`   🔗 Item-Customization Links: ${summary.tables.menuItemCustomizations}`);

    console.log('\n📋 Categories backed up:');
    summary.categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.itemCount} items)`);
    });

    console.log('\n🔧 Files created:');
    console.log('   - backup-summary.json (overview of backup)');
    console.log('   - menu-categories-full.json (complete data with relationships)');
    console.log('   - app-settings.json');
    console.log('   - menu-categories.json');
    console.log('   - menu-items.json');
    console.log('   - customization-groups.json');
    console.log('   - customization-options.json');
    console.log('   - menu-item-customizations.json');
    console.log('   - restore-database.js (restoration script)');

    console.log('\n💡 To restore from backup:');
    console.log(`   cd "${backupDir}"`);
    console.log('   node restore-database.js');

    return backupDir;

  } catch (error) {
    console.error('❌ Error creating backup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDatabaseBackup();
