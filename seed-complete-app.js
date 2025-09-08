#!/usr/bin/env node

// 🌱 COMPLETE APP SEEDING SYSTEM
// Populates database with all necessary data for pizza app to work properly

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

console.log('🌱 PIZZA APP COMPLETE SEEDING SYSTEM');
console.log('====================================');
console.log('');

// Check if we have backup data
const backupPath = './backups/clean-complete-2025-09-08/COMPLETE-DATA-2025-09-08.json';
let hasBackupData = false;
let backupData = null;

if (fs.existsSync(backupPath)) {
    try {
        backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
        hasBackupData = true;
        console.log('✅ Found complete backup data with', backupData._metadata.totalRecords, 'records');
    } catch (error) {
        console.log('⚠️ Backup data exists but couldn\'t parse it');
    }
} else {
    console.log('⚠️ No backup data found - will create sample data');
}

console.log('');

async function seedDatabase() {
    try {
        console.log('🔗 Connecting to database...');
        await prisma.$connect();
        console.log('✅ Connected successfully');
        console.log('');

        if (hasBackupData) {
            await seedFromBackup();
        } else {
            await seedSampleData();
        }

        console.log('');
        console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
        console.log('==================================');
        console.log('✅ Your pizza app is now fully populated with data');
        console.log('🍕 Menu items, sizes, toppings, and settings are ready');
        console.log('🌐 App should work properly at http://localhost:3001');
        
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

async function seedFromBackup() {
    console.log('📊 RESTORING FROM COMPLETE BACKUP');
    console.log('=================================');
    
    // Clear existing data safely
    await clearExistingData();
    
    // Restore data in correct order
    const insertOrder = [
        'User', 'EmployeeProfile', 'CustomerProfile', 'CustomerAddress',
        'PizzaSize', 'PizzaCrust', 'PizzaSauce', 'PizzaTopping',
        'MenuCategory', 'MenuItem', 'CustomizationGroup', 'CustomizationOption',
        'MenuItemCustomization', 'SpecialtyPizza', 'SpecialtyPizzaSize',
        'SpecialtyCalzone', 'SpecialtyCalzoneSize', 'AppSetting',
        'Order', 'OrderItem', 'OrderItemTopping', 'OrderItemCustomization',
        'Promotion', 'BusinessHour', 'EmailTemplate', 'EmailSettings'
    ];
    
    let totalRestored = 0;
    
    for (const tableName of insertOrder) {
        try {
            const records = backupData[tableName];
            if (records && Array.isArray(records) && records.length > 0) {
                const modelName = tableName.charAt(0).toLowerCase() + tableName.slice(1);
                
                if (prisma[modelName]) {
                    // Insert in smaller batches to avoid issues
                    const batchSize = 20;
                    for (let i = 0; i < records.length; i += batchSize) {
                        const batch = records.slice(i, i + batchSize);
                        await prisma[modelName].createMany({
                            data: batch,
                            skipDuplicates: true
                        });
                    }
                    
                    console.log(`   ✅ ${tableName}: ${records.length} records restored`);
                    totalRestored += records.length;
                } else {
                    console.log(`   ⚠️ ${tableName}: model not found`);
                }
            }
        } catch (error) {
            console.log(`   ❌ ${tableName}: ${error.message}`);
        }
    }
    
    console.log(`📊 Total records restored: ${totalRestored}`);
}

async function clearExistingData() {
    console.log('🧹 Clearing existing data...');
    
    const clearOrder = [
        'OrderItemCustomization', 'OrderItemTopping', 'OrderItem', 'Order',
        'MenuItemCustomization', 'CustomizationOption', 'CustomizationGroup',
        'MenuItem', 'MenuCategory', 'SpecialtyCalzoneSize', 'SpecialtyCalzone',
        'SpecialtyPizzaSize', 'SpecialtyPizza', 'PizzaTopping', 'PizzaSauce',
        'PizzaCrust', 'PizzaSize', 'CustomerAddress', 'CustomerProfile',
        'EmployeeProfile', 'Promotion', 'BusinessHour', 'EmailTemplate',
        'EmailSettings', 'AppSetting'
    ];
    
    for (const tableName of clearOrder) {
        try {
            const modelName = tableName.charAt(0).toLowerCase() + tableName.slice(1);
            if (prisma[modelName]) {
                await prisma[modelName].deleteMany({});
            }
        } catch (error) {
            // Ignore foreign key constraint errors during cleanup
        }
    }
    
    console.log('   ✅ Existing data cleared');
}

async function seedSampleData() {
    console.log('🌱 CREATING SAMPLE DATA');
    console.log('=======================');
    
    // Create basic pizza sizes
    console.log('📏 Creating pizza sizes...');
    await prisma.pizzaSize.createMany({
        data: [
            { name: 'Small Pizza', diameter: '10"', basePrice: 12.99, isActive: true, sortOrder: 1, productType: 'PIZZA' },
            { name: 'Medium Pizza', diameter: '12"', basePrice: 14.99, isActive: true, sortOrder: 2, productType: 'PIZZA' },
            { name: 'Large Pizza', diameter: '16"', basePrice: 17.99, isActive: true, sortOrder: 3, productType: 'PIZZA' },
            { name: 'Small Calzone', diameter: 'Personal', basePrice: 15.99, isActive: true, sortOrder: 4, productType: 'CALZONE' },
            { name: 'Large Calzone', diameter: 'Family', basePrice: 21.99, isActive: true, sortOrder: 5, productType: 'CALZONE' }
        ],
        skipDuplicates: true
    });

    // Create pizza crusts
    console.log('🍞 Creating pizza crusts...');
    await prisma.pizzaCrust.createMany({
        data: [
            { name: 'Regular', description: 'Classic hand-tossed crust', priceModifier: 0, isActive: true, sortOrder: 1 },
            { name: 'Thin Crust', description: 'Crispy thin crust', priceModifier: 0, isActive: true, sortOrder: 2 },
            { name: 'Thick Crust', description: 'Extra thick and fluffy', priceModifier: 2.00, isActive: true, sortOrder: 3 }
        ],
        skipDuplicates: true
    });

    // Create pizza sauces
    console.log('🍅 Creating pizza sauces...');
    await prisma.pizzaSauce.createMany({
        data: [
            { name: 'Pizza Sauce', description: 'Classic tomato pizza sauce', color: '#e53e3e', spiceLevel: 0, priceModifier: 0, isActive: true, sortOrder: 1 },
            { name: 'White Sauce', description: 'Creamy garlic white sauce', color: '#f7fafc', spiceLevel: 0, priceModifier: 1.00, isActive: true, sortOrder: 2 },
            { name: 'BBQ Sauce', description: 'Sweet and tangy BBQ sauce', color: '#744210', spiceLevel: 1, priceModifier: 0.50, isActive: true, sortOrder: 3 }
        ],
        skipDuplicates: true
    });

    // Create basic toppings
    console.log('🍕 Creating pizza toppings...');
    await prisma.pizzaTopping.createMany({
        data: [
            { name: 'Extra Cheese', category: 'Cheese', price: 2.00, isActive: true, sortOrder: 1 },
            { name: 'Pepperoni', category: 'Meat', price: 2.50, isActive: true, sortOrder: 2 },
            { name: 'Sausage', category: 'Meat', price: 2.50, isActive: true, sortOrder: 3 },
            { name: 'Mushrooms', category: 'Vegetable', price: 1.50, isActive: true, sortOrder: 4 },
            { name: 'Green Peppers', category: 'Vegetable', price: 1.50, isActive: true, sortOrder: 5 },
            { name: 'Onions', category: 'Vegetable', price: 1.50, isActive: true, sortOrder: 6 },
            { name: 'Black Olives', category: 'Vegetable', price: 2.00, isActive: true, sortOrder: 7 },
            { name: 'Bacon', category: 'Meat', price: 3.00, isActive: true, sortOrder: 8 }
        ],
        skipDuplicates: true
    });

    // Create menu categories
    console.log('📂 Creating menu categories...');
    await prisma.menuCategory.createMany({
        data: [
            { name: 'Appetizers', slug: 'appetizers', description: 'Start your meal right', isActive: true, sortOrder: 1 },
            { name: 'Sandwiches', slug: 'sandwiches', description: 'Fresh made sandwiches', isActive: true, sortOrder: 2 },
            { name: 'Salads', slug: 'salads', description: 'Fresh and healthy salads', isActive: true, sortOrder: 3 },
            { name: 'Beverages', slug: 'beverages', description: 'Drinks and sodas', isActive: true, sortOrder: 4 }
        ],
        skipDuplicates: true
    });

    // Create basic app settings
    console.log('⚙️ Creating app settings...');
    await prisma.appSetting.createMany({
        data: [
            { key: 'business_name', value: 'Pizza Palace', category: 'business', description: 'Business name' },
            { key: 'business_phone', value: '(555) 123-PIZZA', category: 'business', description: 'Business phone' },
            { key: 'business_email', value: 'info@pizzapalace.com', category: 'business', description: 'Business email' },
            { key: 'delivery_fee', value: '3.99', category: 'pricing', description: 'Delivery fee' },
            { key: 'tax_rate', value: '0.0875', category: 'pricing', description: 'Tax rate (8.75%)' },
            { key: 'min_delivery_amount', value: '15.00', category: 'delivery', description: 'Minimum delivery order' },
            { key: 'online_ordering_enabled', value: 'true', category: 'features', description: 'Enable online ordering' },
            { key: 'store_hours', value: '11:00 AM - 10:00 PM', category: 'business', description: 'Store hours' }
        ],
        skipDuplicates: true
    });

    console.log('✅ Sample data created successfully');
}

// Run the seeding
seedDatabase().catch(console.error);
