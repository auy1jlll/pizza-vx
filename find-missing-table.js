#!/usr/bin/env node

// 🔍 FIND MISSING TABLE - Quick Analysis

const fs = require('fs');

// All 37 tables from Prisma schema
const ALL_TABLES = [
    'User', 'CustomerProfile', 'CustomerAddress', 'EmployeeProfile', 'CustomerFavorite',
    'PizzaSize', 'PizzaCrust', 'PizzaSauce', 'PizzaTopping', 'SpecialtyPizza',
    'SpecialtyPizzaSize', 'SpecialtyCalzone', 'SpecialtyCalzoneSize', 'Order', 'OrderItem',
    'OrderItemTopping', 'OrderItemCustomization', 'AppSetting', 'PriceSnapshot', 'PricingHistory',
    'RefreshToken', 'JwtBlacklist', 'JwtSecret', 'MenuCategory', 'MenuItem',
    'Modifier', 'ItemModifier', 'CustomizationGroup', 'CustomizationOption', 'MenuItemCustomization',
    'CartItem', 'CartItemCustomization', 'CartItemPizzaTopping', 'Promotion', 'EmailTemplate',
    'EmailSettings', 'BusinessHour'
];

console.log('🔍 FINDING MISSING TABLE...');
console.log('==========================');

try {
    // Read the backup data
    const backupData = JSON.parse(fs.readFileSync('./backups/clean-complete-2025-09-08/COMPLETE-DATA-2025-09-08.json', 'utf8'));
    
    console.log(`📊 Expected tables: ${ALL_TABLES.length}`);
    console.log(`📊 Successful tables: ${backupData._metadata.successfulTables}`);
    console.log(`📊 Missing tables: ${ALL_TABLES.length - backupData._metadata.successfulTables}`);
    console.log('');
    
    // Check which tables are in the backup
    const tablesInBackup = [];
    const missingTables = [];
    
    for (const tableName of ALL_TABLES) {
        if (backupData[tableName] !== undefined) {
            tablesInBackup.push(tableName);
            console.log(`✅ ${tableName}: ${backupData[tableName].length} records`);
        } else {
            missingTables.push(tableName);
            console.log(`❌ ${tableName}: MISSING FROM BACKUP`);
        }
    }
    
    console.log('');
    console.log('🎯 MISSING TABLE FOUND:');
    console.log('=======================');
    
    if (missingTables.length > 0) {
        missingTables.forEach(table => {
            console.log(`❌ MISSING: ${table}`);
        });
    } else {
        console.log('✅ All tables present in backup');
    }
    
    console.log('');
    console.log('📋 SUMMARY:');
    console.log(`   Present: ${tablesInBackup.length}/${ALL_TABLES.length}`);
    console.log(`   Missing: ${missingTables.length}/${ALL_TABLES.length}`);
    
} catch (error) {
    console.error('❌ Error:', error.message);
}
