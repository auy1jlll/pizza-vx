const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function createFullDatabaseDump() {
    console.log('🔄 Creating comprehensive database dump...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dumpFileName = `complete-database-dump-${timestamp}.json`;
    
    try {
        const dumpData = {
            timestamp: new Date().toISOString(),
            metadata: {
                version: "2.0",
                description: "Complete pizza app database dump before production deployment",
                totalTables: 0,
                totalRecords: 0
            },
            data: {}
        };

        // Core Settings
        console.log('📋 Exporting settings...');
        const settings = await prisma.setting.findMany();
        dumpData.data.settings = settings;
        console.log(`✅ Settings: ${settings.length} records`);

        // Users and Authentication
        console.log('👥 Exporting users...');
        const users = await prisma.user.findMany();
        dumpData.data.users = users;
        console.log(`✅ Users: ${users.length} records`);

        // Menu Categories
        console.log('📂 Exporting categories...');
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        menuItems: true,
                        subcategories: true
                    }
                }
            }
        });
        dumpData.data.categories = categories;
        console.log(`✅ Categories: ${categories.length} records`);

        // Subcategories
        console.log('📁 Exporting subcategories...');
        const subcategories = await prisma.subcategory.findMany();
        dumpData.data.subcategories = subcategories;
        console.log(`✅ Subcategories: ${subcategories.length} records`);

        // Menu Items
        console.log('🍕 Exporting menu items...');
        const menuItems = await prisma.menuItem.findMany({
            include: {
                category: true,
                subcategory: true,
                sizes: true,
                toppings: true,
                customizations: true
            }
        });
        dumpData.data.menuItems = menuItems;
        console.log(`✅ Menu Items: ${menuItems.length} records`);

        // Sizes
        console.log('📏 Exporting sizes...');
        const sizes = await prisma.size.findMany();
        dumpData.data.sizes = sizes;
        console.log(`✅ Sizes: ${sizes.length} records`);

        // Toppings
        console.log('🧄 Exporting toppings...');
        const toppings = await prisma.topping.findMany();
        dumpData.data.toppings = toppings;
        console.log(`✅ Toppings: ${toppings.length} records`);

        // Customizations
        console.log('⚙️ Exporting customizations...');
        const customizations = await prisma.customization.findMany();
        dumpData.data.customizations = customizations;
        console.log(`✅ Customizations: ${customizations.length} records`);

        // Customization Groups
        console.log('🔗 Exporting customization groups...');
        const customizationGroups = await prisma.customizationGroup.findMany();
        dumpData.data.customizationGroups = customizationGroups;
        console.log(`✅ Customization Groups: ${customizationGroups.length} records`);

        // Orders
        console.log('🛒 Exporting orders...');
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        toppings: true,
                        customizations: true
                    }
                }
            }
        });
        dumpData.data.orders = orders;
        console.log(`✅ Orders: ${orders.length} records`);

        // Order Items
        console.log('📦 Exporting order items...');
        const orderItems = await prisma.orderItem.findMany();
        dumpData.data.orderItems = orderItems;
        console.log(`✅ Order Items: ${orderItems.length} records`);

        // Hours
        console.log('🕐 Exporting business hours...');
        const hours = await prisma.hour.findMany();
        dumpData.data.hours = hours;
        console.log(`✅ Hours: ${hours.length} records`);

        // Calculate totals
        const tableNames = Object.keys(dumpData.data);
        dumpData.metadata.totalTables = tableNames.length;
        dumpData.metadata.totalRecords = tableNames.reduce((total, tableName) => {
            return total + dumpData.data[tableName].length;
        }, 0);

        // Write to file
        const dumpPath = path.join(__dirname, dumpFileName);
        fs.writeFileSync(dumpPath, JSON.stringify(dumpData, null, 2));

        console.log('\n🎉 DATABASE DUMP COMPLETE!');
        console.log(`📁 File: ${dumpFileName}`);
        console.log(`📊 Total Tables: ${dumpData.metadata.totalTables}`);
        console.log(`📈 Total Records: ${dumpData.metadata.totalRecords}`);
        console.log(`📂 Location: ${dumpPath}`);

        // Create summary report
        console.log('\n📋 DUMP SUMMARY:');
        tableNames.forEach(tableName => {
            const count = dumpData.data[tableName].length;
            console.log(`   ${tableName}: ${count} records`);
        });

        return dumpPath;

    } catch (error) {
        console.error('❌ Error creating database dump:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

if (require.main === module) {
    createFullDatabaseDump()
        .then((dumpPath) => {
            console.log(`\n✅ SUCCESS: Database dump created at ${dumpPath}`);
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ FAILED:', error.message);
            process.exit(1);
        });
}

module.exports = { createFullDatabaseDump };
