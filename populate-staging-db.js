#!/usr/bin/env node

// 🗄️ POPULATE STAGING DATABASE
// Loads complete backup data into staging database

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

// Connect to staging database
const prisma = new PrismaClient({
    datasourceUrl: 'postgresql://pizzauser:pizzapass123!@localhost:5433/pizzadb_staging?schema=public'
});

console.log('🗄️ POPULATING STAGING DATABASE');
console.log('==============================');
console.log('📊 Source: COMPLETE-DATA-2025-09-08.json');
console.log('🎯 Target: PostgreSQL staging database');
console.log('');

async function populateStagingDatabase() {
    try {
        console.log('🔗 Connecting to staging database...');
        await prisma.$connect();
        console.log('✅ Connected to staging database');
        
        console.log('📄 Loading backup data...');
        const backupPath = './backups/clean-complete-2025-09-08/COMPLETE-DATA-2025-09-08.json';
        
        if (!fs.existsSync(backupPath)) {
            throw new Error(`Backup file not found: ${backupPath}`);
        }
        
        const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
        console.log(`✅ Loaded backup data (${backupData._metadata.totalRecords} records)`);
        console.log('');
        
        // Clear existing data first
        console.log('🧹 Clearing existing staging data...');
        
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
        
        for (const tableName of clearOrder) {
            try {
                const modelName = tableName.charAt(0).toLowerCase() + tableName.slice(1);
                if (prisma[modelName]) {
                    await prisma[modelName].deleteMany({});
                    console.log(`   🗑️ Cleared ${tableName}`);
                }
            } catch (error) {
                console.log(`   ⚠️ Could not clear ${tableName}: ${error.message}`);
            }
        }
        
        console.log('');
        console.log('📊 Populating staging database...');
        
        // Insert data in correct order
        const insertOrder = [
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
        
        let totalInserted = 0;
        
        for (const tableName of insertOrder) {
            try {
                const records = backupData[tableName];
                if (records && Array.isArray(records) && records.length > 0) {
                    const modelName = tableName.charAt(0).toLowerCase() + tableName.slice(1);
                    
                    if (prisma[modelName]) {
                        // Insert records in batches
                        const batchSize = 50;
                        for (let i = 0; i < records.length; i += batchSize) {
                            const batch = records.slice(i, i + batchSize);
                            await prisma[modelName].createMany({
                                data: batch,
                                skipDuplicates: true
                            });
                        }
                        
                        console.log(`   ✅ ${tableName}: ${records.length} records inserted`);
                        totalInserted += records.length;
                    } else {
                        console.log(`   ⚠️ ${tableName}: model not found`);
                    }
                } else {
                    console.log(`   📭 ${tableName}: no data to insert`);
                }
            } catch (error) {
                console.log(`   ❌ ${tableName}: ${error.message}`);
            }
        }
        
        console.log('');
        console.log('🎉 STAGING DATABASE POPULATION COMPLETE!');
        console.log('========================================');
        console.log(`📊 Total records inserted: ${totalInserted}`);
        console.log(`🗄️ Database: pizzadb_staging`);
        console.log(`🌐 Access: http://localhost:3001`);
        console.log(`🔧 Admin: http://localhost:8080`);
        console.log('');
        console.log('✅ Your staging environment now has complete production data!');
        
    } catch (error) {
        console.error('❌ Population failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the population
populateStagingDatabase();
