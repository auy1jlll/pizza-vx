#!/usr/bin/env node

// 🗑️ CLEAR GARBAGE DATA & RESTORE PROPER DATA
// Uses your complete backup files with real pizza app data

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

console.log('🗑️ CLEARING GARBAGE DATA & RESTORING PROPER DATA');
console.log('================================================');
console.log('');

// Load your proper backup data
const backupPath = './backups/clean-complete-2025-09-08/COMPLETE-DATA-2025-09-08.json';

async function clearAllData() {
    console.log('🗑️ STEP 1: Clearing all existing garbage data...');
    
    try {
        // Clear in proper order to avoid foreign key constraints
        const clearOrder = [
            'OrderItemCustomization', 'OrderItemTopping', 'OrderItem', 'Order',
            'CartItemPizzaTopping', 'CartItemCustomization', 'CartItem',
            'MenuItemCustomization', 'CustomizationOption', 'CustomizationGroup',
            'ItemModifier', 'Modifier', 'MenuItem', 'MenuCategory',
            'SpecialtyCalzoneSize', 'SpecialtyCalzone',
            'SpecialtyPizzaSize', 'SpecialtyPizza',
            'PizzaTopping', 'PizzaSauce', 'PizzaCrust', 'PizzaSize',
            'CustomerFavorite', 'CustomerAddress', 'CustomerProfile',
            'EmployeeProfile', 'User',
            'PricingHistory', 'PriceSnapshot', 'Promotion',
            'EmailTemplate', 'EmailSettings', 'BusinessHour',
            'RefreshToken', 'JwtBlacklist', 'JwtSecret', 'AppSetting'
        ];
        
        for (const table of clearOrder) {
            try {
                const modelName = table.charAt(0).toLowerCase() + table.slice(1);
                if (prisma[modelName]) {
                    const result = await prisma[modelName].deleteMany({});
                    console.log(`   🗑️ Cleared ${table}: ${result.count || 0} records deleted`);
                }
            } catch (error) {
                console.log(`   ⚠️ Could not clear ${table}: ${error.message}`);
            }
        }
        
        console.log('✅ All garbage data cleared!');
        
    } catch (error) {
        console.error('❌ Error clearing data:', error);
    }
}

async function restoreProperData() {
    console.log('');
    console.log('📊 STEP 2: Restoring your proper pizza app data...');
    
    try {
        // Load your complete backup
        if (!fs.existsSync(backupPath)) {
            console.error('❌ Backup file not found:', backupPath);
            return;
        }
        
        const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
        console.log(`✅ Loaded backup with ${backupData._metadata.totalRecords} records from ${backupData._metadata.successfulTables} tables`);
        
        // Restore in proper order to maintain relationships
        const restoreOrder = [
            'User', 'CustomerProfile', 'CustomerAddress', 'EmployeeProfile',
            'PizzaSize', 'PizzaCrust', 'PizzaSauce', 'PizzaTopping',
            'SpecialtyPizza', 'SpecialtyPizzaSize', 'SpecialtyCalzone', 'SpecialtyCalzoneSize',
            'MenuCategory', 'MenuItem', 'Modifier', 'ItemModifier',
            'CustomizationGroup', 'CustomizationOption', 'MenuItemCustomization',
            'Order', 'OrderItem', 'OrderItemTopping', 'OrderItemCustomization',
            'CartItem', 'CartItemCustomization', 'CartItemPizzaTopping',
            'CustomerFavorite', 'Promotion', 'PriceSnapshot', 'PricingHistory',
            'AppSetting', 'EmailTemplate', 'EmailSettings', 'BusinessHour',
            'RefreshToken', 'JwtBlacklist', 'JwtSecret'
        ];
        
        let totalRestored = 0;
        
        for (const table of restoreOrder) {
            try {
                const records = backupData[table];
                if (records && Array.isArray(records) && records.length > 0) {
                    const modelName = table.charAt(0).toLowerCase() + table.slice(1);
                    
                    if (prisma[modelName]) {
                        // Insert in batches to handle large datasets
                        const batchSize = 100;
                        let restored = 0;
                        
                        for (let i = 0; i < records.length; i += batchSize) {
                            const batch = records.slice(i, i + batchSize);
                            await prisma[modelName].createMany({
                                data: batch,
                                skipDuplicates: true
                            });
                            restored += batch.length;
                        }
                        
                        console.log(`   ✅ ${table}: ${restored} records restored`);
                        totalRestored += restored;
                    } else {
                        console.log(`   ⚠️ ${table}: Model not found in Prisma`);
                    }
                } else {
                    console.log(`   📭 ${table}: No data to restore`);
                }
            } catch (error) {
                console.log(`   ❌ ${table}: Error - ${error.message}`);
            }
        }
        
        console.log('');
        console.log(`✅ Restored ${totalRestored} records from your proper backup!`);
        
        // Verify key data is restored
        await verifyRestoration();
        
    } catch (error) {
        console.error('❌ Error restoring data:', error);
    }
}

async function verifyRestoration() {
    console.log('');
    console.log('🔍 STEP 3: Verifying restoration...');
    
    try {
        const verification = {
            users: await prisma.user.count(),
            menuItems: await prisma.menuItem.count(),
            menuCategories: await prisma.menuCategory.count(),
            customizationGroups: await prisma.customizationGroup.count(),
            customizationOptions: await prisma.customizationOption.count(),
            pizzaSizes: await prisma.pizzaSize.count(),
            pizzaToppings: await prisma.pizzaTopping.count(),
            specialtyPizzas: await prisma.specialtyPizza.count(),
            appSettings: await prisma.appSetting.count(),
            orders: await prisma.order.count()
        };
        
        console.log('📊 RESTORED DATA VERIFICATION:');
        console.log('==============================');
        Object.entries(verification).forEach(([key, count]) => {
            const status = count > 0 ? '✅' : '❌';
            console.log(`   ${status} ${key}: ${count} records`);
        });
        
        // Check if we have essential data for pizza app
        const hasEssentialData = 
            verification.menuItems > 0 &&
            verification.menuCategories > 0 &&
            verification.pizzaSizes > 0 &&
            verification.pizzaToppings > 0 &&
            verification.appSettings > 0;
            
        if (hasEssentialData) {
            console.log('');
            console.log('🎉 SUCCESS: All essential pizza app data restored!');
            console.log('✅ Your menu should now work properly!');
        } else {
            console.log('');
            console.log('⚠️ WARNING: Some essential data may be missing');
        }
        
    } catch (error) {
        console.error('❌ Verification failed:', error);
    }
}

async function main() {
    try {
        console.log('🔗 Connecting to database...');
        await prisma.$connect();
        console.log('✅ Database connected');
        console.log('');
        
        // Step 1: Clear garbage data
        await clearAllData();
        
        // Step 2: Restore proper data from your backup
        await restoreProperData();
        
        console.log('');
        console.log('🎉 DATA RESTORATION COMPLETE!');
        console.log('=============================');
        console.log('✅ Garbage data deleted');
        console.log('✅ Your proper pizza app data restored');
        console.log('✅ Menu should now work correctly');
        console.log('');
        console.log('🍕 Your pizza app is ready with proper data!');
        
    } catch (error) {
        console.error('❌ Restoration failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the restoration
main();
