const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function restoreFromDump(dumpFilePath) {
    console.log(`🔄 Restoring database from ${dumpFilePath}...`);
    
    try {
        // Read the dump file
        if (!fs.existsSync(dumpFilePath)) {
            throw new Error(`Dump file not found: ${dumpFilePath}`);
        }

        const dumpData = JSON.parse(fs.readFileSync(dumpFilePath, 'utf8'));
        console.log(`📊 Dump contains ${dumpData.metadata.totalRecords} records across ${dumpData.metadata.totalTables} tables`);
        console.log(`🕐 Dump created: ${dumpData.timestamp}`);

        // Clear existing data (in correct order to handle foreign keys)
        console.log('\n🗑️ Clearing existing data...');
        
        await prisma.orderItemTopping.deleteMany();
        await prisma.orderItemCustomization.deleteMany();
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();
        
        await prisma.menuItemTopping.deleteMany();
        await prisma.menuItemCustomization.deleteMany();
        await prisma.menuItemSize.deleteMany();
        
        await prisma.customization.deleteMany();
        await prisma.customizationGroup.deleteMany();
        await prisma.topping.deleteMany();
        await prisma.size.deleteMany();
        
        await prisma.menuItem.deleteMany();
        await prisma.subcategory.deleteMany();
        await prisma.category.deleteMany();
        
        await prisma.hour.deleteMany();
        await prisma.user.deleteMany();
        await prisma.setting.deleteMany();

        console.log('✅ Existing data cleared');

        // Restore data (in correct order)
        console.log('\n📥 Restoring data...');

        // Settings first
        if (dumpData.data.settings?.length > 0) {
            await prisma.setting.createMany({ data: dumpData.data.settings });
            console.log(`✅ Settings: ${dumpData.data.settings.length} restored`);
        }

        // Users
        if (dumpData.data.users?.length > 0) {
            await prisma.user.createMany({ data: dumpData.data.users });
            console.log(`✅ Users: ${dumpData.data.users.length} restored`);
        }

        // Hours
        if (dumpData.data.hours?.length > 0) {
            await prisma.hour.createMany({ data: dumpData.data.hours });
            console.log(`✅ Hours: ${dumpData.data.hours.length} restored`);
        }

        // Categories
        if (dumpData.data.categories?.length > 0) {
            // Clean the categories data (remove _count field)
            const cleanCategories = dumpData.data.categories.map(cat => {
                const { _count, ...cleanCat } = cat;
                return cleanCat;
            });
            await prisma.category.createMany({ data: cleanCategories });
            console.log(`✅ Categories: ${cleanCategories.length} restored`);
        }

        // Subcategories
        if (dumpData.data.subcategories?.length > 0) {
            await prisma.subcategory.createMany({ data: dumpData.data.subcategories });
            console.log(`✅ Subcategories: ${dumpData.data.subcategories.length} restored`);
        }

        // Sizes
        if (dumpData.data.sizes?.length > 0) {
            await prisma.size.createMany({ data: dumpData.data.sizes });
            console.log(`✅ Sizes: ${dumpData.data.sizes.length} restored`);
        }

        // Toppings
        if (dumpData.data.toppings?.length > 0) {
            await prisma.topping.createMany({ data: dumpData.data.toppings });
            console.log(`✅ Toppings: ${dumpData.data.toppings.length} restored`);
        }

        // Customization Groups
        if (dumpData.data.customizationGroups?.length > 0) {
            await prisma.customizationGroup.createMany({ data: dumpData.data.customizationGroups });
            console.log(`✅ Customization Groups: ${dumpData.data.customizationGroups.length} restored`);
        }

        // Customizations
        if (dumpData.data.customizations?.length > 0) {
            await prisma.customization.createMany({ data: dumpData.data.customizations });
            console.log(`✅ Customizations: ${dumpData.data.customizations.length} restored`);
        }

        // Menu Items (without relationships)
        if (dumpData.data.menuItems?.length > 0) {
            const cleanMenuItems = dumpData.data.menuItems.map(item => {
                const { category, subcategory, sizes, toppings, customizations, ...cleanItem } = item;
                return cleanItem;
            });
            await prisma.menuItem.createMany({ data: cleanMenuItems });
            console.log(`✅ Menu Items: ${cleanMenuItems.length} restored`);

            // Restore relationships
            console.log('🔗 Restoring menu item relationships...');
            for (const item of dumpData.data.menuItems) {
                if (item.sizes?.length > 0) {
                    await prisma.menuItem.update({
                        where: { id: item.id },
                        data: {
                            sizes: {
                                connect: item.sizes.map(size => ({ id: size.id }))
                            }
                        }
                    });
                }
                if (item.toppings?.length > 0) {
                    await prisma.menuItem.update({
                        where: { id: item.id },
                        data: {
                            toppings: {
                                connect: item.toppings.map(topping => ({ id: topping.id }))
                            }
                        }
                    });
                }
                if (item.customizations?.length > 0) {
                    await prisma.menuItem.update({
                        where: { id: item.id },
                        data: {
                            customizations: {
                                connect: item.customizations.map(custom => ({ id: custom.id }))
                            }
                        }
                    });
                }
            }
            console.log('✅ Menu item relationships restored');
        }

        // Orders
        if (dumpData.data.orders?.length > 0) {
            const cleanOrders = dumpData.data.orders.map(order => {
                const { items, ...cleanOrder } = order;
                return cleanOrder;
            });
            await prisma.order.createMany({ data: cleanOrders });
            console.log(`✅ Orders: ${cleanOrders.length} restored`);
        }

        // Order Items
        if (dumpData.data.orderItems?.length > 0) {
            await prisma.orderItem.createMany({ data: dumpData.data.orderItems });
            console.log(`✅ Order Items: ${dumpData.data.orderItems.length} restored`);
        }

        console.log('\n🎉 DATABASE RESTORATION COMPLETE!');
        console.log(`✅ Successfully restored ${dumpData.metadata.totalRecords} records`);

    } catch (error) {
        console.error('❌ Error restoring database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Command line usage
if (require.main === module) {
    const dumpFile = process.argv[2];
    if (!dumpFile) {
        console.error('❌ Usage: node restore-database-dump.js <dump-file-path>');
        process.exit(1);
    }

    restoreFromDump(dumpFile)
        .then(() => {
            console.log('✅ SUCCESS: Database restored successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ FAILED:', error.message);
            process.exit(1);
        });
}

module.exports = { restoreFromDump };
