#!/usr/bin/env node

// 📦 PRISMA DATABASE BACKUP - September 8, 2025
// Complete schema and data backup using Prisma only

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const BACKUP_DATE = '2025-09-08';
const BACKUP_TIME = new Date().toISOString().replace(/[:.]/g, '-');
const BACKUP_DIR = `./backups/backup-${BACKUP_DATE}`;

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

console.log('🚀 PRISMA DATABASE BACKUP - September 8, 2025');
console.log('==============================================');
console.log(`📁 Backup Directory: ${BACKUP_DIR}`);
console.log(`⏰ Backup Time: ${BACKUP_TIME}`);
console.log('');

async function exportAllData() {
    console.log('📊 EXPORTING ALL DATABASE TABLES...');
    console.log('===================================');
    
    try {
        const timestamp = new Date().toISOString();
        const exportData = {
            _metadata: {
                exportDate: timestamp,
                exportType: 'complete_prisma_backup',
                version: '2.0',
                source: 'Prisma Client',
                backupDate: BACKUP_DATE,
                databaseUrl: process.env.DATABASE_URL?.replace(/:[^@]*@/, ':***@') // Hide password
            }
        };
        
        // Export Users
        console.log('👥 Exporting users...');
        try {
            exportData.users = await prisma.user.findMany({
                include: {
                    orders: true
                }
            });
            console.log(`   ✅ ${exportData.users.length} users exported`);
        } catch (error) {
            console.log(`   ❌ Users export failed: ${error.message}`);
            exportData.users = [];
        }
        
        // Export Categories  
        console.log('📂 Exporting categories...');
        try {
            exportData.categories = await prisma.category.findMany({
                include: {
                    menuItems: true,
                    children: true,
                    parent: true
                }
            });
            console.log(`   ✅ ${exportData.categories.length} categories exported`);
        } catch (error) {
            console.log(`   ❌ Categories export failed: ${error.message}`);
            exportData.categories = [];
        }
        
        // Export Menu Items
        console.log('🍕 Exporting menu items...');
        try {
            exportData.menuItems = await prisma.menuItem.findMany({
                include: {
                    category: true,
                    customizationGroups: {
                        include: {
                            customizationGroup: {
                                include: {
                                    customizations: true
                                }
                            }
                        }
                    },
                    orderItems: true
                }
            });
            console.log(`   ✅ ${exportData.menuItems.length} menu items exported`);
        } catch (error) {
            console.log(`   ❌ Menu items export failed: ${error.message}`);
            exportData.menuItems = [];
        }
        
        // Export Customization Groups
        console.log('⚙️ Exporting customization groups...');
        try {
            exportData.customizationGroups = await prisma.customizationGroup.findMany({
                include: {
                    customizations: true,
                    menuItemCustomizationGroups: true
                }
            });
            console.log(`   ✅ ${exportData.customizationGroups.length} customization groups exported`);
        } catch (error) {
            console.log(`   ❌ Customization groups export failed: ${error.message}`);
            exportData.customizationGroups = [];
        }
        
        // Export Customizations
        console.log('🔧 Exporting customizations...');
        try {
            exportData.customizations = await prisma.customization.findMany({
                include: {
                    customizationGroup: true,
                    orderItemCustomizations: true
                }
            });
            console.log(`   ✅ ${exportData.customizations.length} customizations exported`);
        } catch (error) {
            console.log(`   ❌ Customizations export failed: ${error.message}`);
            exportData.customizations = [];
        }
        
        // Export Orders
        console.log('📋 Exporting orders...');
        try {
            exportData.orders = await prisma.order.findMany({
                include: {
                    user: true,
                    orderItems: {
                        include: {
                            menuItem: true,
                            customizations: {
                                include: {
                                    customization: true
                                }
                            }
                        }
                    }
                }
            });
            console.log(`   ✅ ${exportData.orders.length} orders exported`);
        } catch (error) {
            console.log(`   ❌ Orders export failed: ${error.message}`);
            exportData.orders = [];
        }
        
        // Export Order Items
        console.log('🛒 Exporting order items...');
        try {
            exportData.orderItems = await prisma.orderItem.findMany({
                include: {
                    order: true,
                    menuItem: true,
                    customizations: true
                }
            });
            console.log(`   ✅ ${exportData.orderItems.length} order items exported`);
        } catch (error) {
            console.log(`   ❌ Order items export failed: ${error.message}`);
            exportData.orderItems = [];
        }
        
        // Export App Settings
        console.log('⚙️ Exporting app settings...');
        try {
            exportData.appSettings = await prisma.appSetting.findMany();
            console.log(`   ✅ ${exportData.appSettings.length} app settings exported`);
        } catch (error) {
            console.log(`   ❌ App settings export failed: ${error.message}`);
            exportData.appSettings = [];
        }
        
        // Export Business Hours
        console.log('🕐 Exporting business hours...');
        try {
            exportData.businessHours = await prisma.businessHour.findMany();
            console.log(`   ✅ ${exportData.businessHours.length} business hours exported`);
        } catch (error) {
            console.log(`   ❌ Business hours export failed: ${error.message}`);
            exportData.businessHours = [];
        }
        
        // Export Additional Tables
        console.log('📋 Exporting additional tables...');
        
        // Try to export any other tables that might exist
        const additionalTables = [
            'menuItemCustomizationGroup',
            'orderItemCustomization'
        ];
        
        for (const tableName of additionalTables) {
            try {
                if (prisma[tableName]) {
                    exportData[tableName] = await prisma[tableName].findMany();
                    console.log(`   ✅ ${exportData[tableName].length} ${tableName} records exported`);
                }
            } catch (error) {
                console.log(`   ⚠️ ${tableName}: ${error.message}`);
                exportData[tableName] = [];
            }
        }
        
        // Calculate totals
        let totalRecords = 0;
        Object.keys(exportData).forEach(table => {
            if (table !== '_metadata' && Array.isArray(exportData[table])) {
                totalRecords += exportData[table].length;
            }
        });
        
        exportData._metadata.totalRecords = totalRecords;
        exportData._metadata.totalTables = Object.keys(exportData).length - 1; // Exclude metadata
        
        // Save complete export
        const exportFile = path.join(BACKUP_DIR, `complete-database-${BACKUP_DATE}.json`);
        fs.writeFileSync(exportFile, JSON.stringify(exportData, null, 2));
        
        console.log('');
        console.log('✅ DATABASE EXPORT COMPLETED!');
        console.log('=============================');
        console.log(`📁 File: ${exportFile}`);
        console.log(`📊 Size: ${(fs.statSync(exportFile).size / (1024 * 1024)).toFixed(2)} MB`);
        console.log(`🗂️ Total Records: ${totalRecords}`);
        console.log(`📋 Total Tables: ${exportData._metadata.totalTables}`);
        
        return exportData;
        
    } catch (error) {
        console.error('❌ Export failed:', error);
        throw error;
    }
}

async function createSchemaExport() {
    console.log('');
    console.log('📋 EXPORTING DATABASE SCHEMA...');
    console.log('===============================');
    
    try {
        // Read the Prisma schema file
        const schemaFile = './prisma/schema.prisma';
        if (fs.existsSync(schemaFile)) {
            const schemaContent = fs.readFileSync(schemaFile, 'utf8');
            
            const schemaExportFile = path.join(BACKUP_DIR, `schema-${BACKUP_DATE}.prisma`);
            fs.writeFileSync(schemaExportFile, schemaContent);
            
            console.log(`✅ Schema exported: ${schemaExportFile}`);
            console.log(`📊 Size: ${(fs.statSync(schemaExportFile).size / 1024).toFixed(2)} KB`);
        } else {
            console.log('❌ Schema file not found');
        }
        
        // Also create a schema summary
        const schemaSummary = {
            exportDate: new Date().toISOString(),
            schemaPath: schemaFile,
            models: [],
            enums: []
        };
        
        // Parse schema content for models (basic parsing)
        if (fs.existsSync(schemaFile)) {
            const content = fs.readFileSync(schemaFile, 'utf8');
            const modelMatches = content.match(/model\s+(\w+)\s*{/g);
            const enumMatches = content.match(/enum\s+(\w+)\s*{/g);
            
            if (modelMatches) {
                schemaSummary.models = modelMatches.map(match => 
                    match.replace(/model\s+(\w+)\s*{/, '$1')
                );
            }
            
            if (enumMatches) {
                schemaSummary.enums = enumMatches.map(match => 
                    match.replace(/enum\s+(\w+)\s*{/, '$1')
                );
            }
        }
        
        const summaryFile = path.join(BACKUP_DIR, `schema-summary-${BACKUP_DATE}.json`);
        fs.writeFileSync(summaryFile, JSON.stringify(schemaSummary, null, 2));
        
        console.log(`✅ Schema summary: ${summaryFile}`);
        
    } catch (error) {
        console.error('❌ Schema export failed:', error);
    }
}

async function main() {
    try {
        console.log('🔗 Connecting to database...');
        await prisma.$connect();
        console.log('✅ Database connected successfully');
        console.log('');
        
        // Export all data
        const exportData = await exportAllData();
        
        // Export schema
        await createSchemaExport();
        
        console.log('');
        console.log('🎉 BACKUP COMPLETED SUCCESSFULLY!');
        console.log('==================================');
        console.log(`📅 Date: ${BACKUP_DATE}`);
        console.log(`⏰ Time: ${BACKUP_TIME}`);
        console.log(`📁 Location: ${BACKUP_DIR}`);
        console.log('');
        console.log('📊 SUMMARY:');
        console.log('===========');
        
        Object.keys(exportData).forEach(table => {
            if (table !== '_metadata' && Array.isArray(exportData[table])) {
                console.log(`   ${table}: ${exportData[table].length} records`);
            }
        });
        
    } catch (error) {
        console.error('❌ Backup failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the backup
main();
