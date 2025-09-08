const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function exportLocalDatabase() {
    const prisma = new PrismaClient();
    
    try {
        console.log('🔄 Starting local database export...');
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const exportFile = `local-database-export-${timestamp}.json`;
        
        // Export all data
        const exportData = {
            timestamp: new Date().toISOString(),
            metadata: {
                source: "local development database",
                description: "Complete export for production deployment"
            },
            data: {}
        };

        // Settings
        console.log('📋 Exporting settings...');
        exportData.data.settings = await prisma.setting.findMany();
        console.log(`✅ Settings: ${exportData.data.settings.length} records`);

        // Users
        console.log('👥 Exporting users...');
        exportData.data.users = await prisma.user.findMany();
        console.log(`✅ Users: ${exportData.data.users.length} records`);

        // Categories
        console.log('📂 Exporting categories...');
        exportData.data.categories = await prisma.category.findMany();
        console.log(`✅ Categories: ${exportData.data.categories.length} records`);

        // Subcategories
        console.log('📁 Exporting subcategories...');
        exportData.data.subcategories = await prisma.subcategory.findMany();
        console.log(`✅ Subcategories: ${exportData.data.subcategories.length} records`);

        // Menu Items
        console.log('🍕 Exporting menu items...');
        exportData.data.menuItems = await prisma.menuItem.findMany();
        console.log(`✅ Menu Items: ${exportData.data.menuItems.length} records`);

        // Sizes
        console.log('📏 Exporting sizes...');
        exportData.data.sizes = await prisma.size.findMany();
        console.log(`✅ Sizes: ${exportData.data.sizes.length} records`);

        // Toppings
        console.log('🧄 Exporting toppings...');
        exportData.data.toppings = await prisma.topping.findMany();
        console.log(`✅ Toppings: ${exportData.data.toppings.length} records`);

        // Customizations
        console.log('⚙️ Exporting customizations...');
        exportData.data.customizations = await prisma.customization.findMany();
        console.log(`✅ Customizations: ${exportData.data.customizations.length} records`);

        // Customization Groups
        console.log('🔗 Exporting customization groups...');
        exportData.data.customizationGroups = await prisma.customizationGroup.findMany();
        console.log(`✅ Customization Groups: ${exportData.data.customizationGroups.length} records`);

        // Hours
        console.log('🕐 Exporting business hours...');
        exportData.data.hours = await prisma.hour.findMany();
        console.log(`✅ Hours: ${exportData.data.hours.length} records`);

        // Relationships
        console.log('🔗 Exporting relationships...');
        exportData.data.menuItemSizes = await prisma.menuItemSize.findMany();
        exportData.data.menuItemToppings = await prisma.menuItemTopping.findMany();
        exportData.data.menuItemCustomizations = await prisma.menuItemCustomization.findMany();
        console.log(`✅ Relationships exported`);

        // Write to file
        fs.writeFileSync(exportFile, JSON.stringify(exportData, null, 2));
        
        console.log('\n🎉 LOCAL DATABASE EXPORT COMPLETE!');
        console.log(`📁 File: ${exportFile}`);
        console.log(`📊 Total tables exported: ${Object.keys(exportData.data).length}`);
        
        const totalRecords = Object.values(exportData.data).reduce((sum, table) => sum + table.length, 0);
        console.log(`📈 Total records: ${totalRecords}`);
        
        return exportFile;
        
    } catch (error) {
        console.error('❌ Export failed:', error.message);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

exportLocalDatabase()
    .then((file) => {
        console.log(`\n✅ SUCCESS: Database exported to ${file}`);
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 FAILED:', error.message);
        process.exit(1);
    });
