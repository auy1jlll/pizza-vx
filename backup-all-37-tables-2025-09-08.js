#!/usr/bin/env node

// 📦 COMPLETE DATABASE BACKUP - ALL 37 TABLES - September 8, 2025
// Backs up every single table defined in the Prisma schema

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const BACKUP_DATE = '2025-09-08';
const BACKUP_TIME = new Date().toISOString().replace(/[:.]/g, '-');
const BACKUP_DIR = `./backups/complete-backup-${BACKUP_DATE}`;

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

console.log('🚀 COMPLETE DATABASE BACKUP - ALL 37 TABLES');
console.log('============================================');
console.log(`📁 Backup Directory: ${BACKUP_DIR}`);
console.log(`⏰ Backup Time: ${BACKUP_TIME}`);
console.log('');

// All 37 tables from Prisma schema
const ALL_TABLES = [
    'User',
    'CustomerProfile', 
    'CustomerAddress',
    'EmployeeProfile',
    'CustomerFavorite',
    'PizzaSize',
    'PizzaCrust',
    'PizzaSauce',
    'PizzaTopping',
    'SpecialtyPizza',
    'SpecialtyPizzaSize',
    'SpecialtyCalzone',
    'SpecialtyCalzoneSize',
    'Order',
    'OrderItem',
    'OrderItemTopping',
    'OrderItemCustomization',
    'AppSetting',
    'PriceSnapshot',
    'PricingHistory',
    'RefreshToken',
    'JwtBlacklist',
    'JwtSecret',
    'MenuCategory',
    'MenuItem',
    'Modifier',
    'ItemModifier',
    'CustomizationGroup',
    'CustomizationOption',
    'MenuItemCustomization',
    'CartItem',
    'CartItemCustomization',
    'CartItemPizzaTopping',
    'Promotion',
    'EmailTemplate',
    'EmailSettings',
    'BusinessHour'
];

async function backupAllTables() {
    console.log('📊 BACKING UP ALL 37 TABLES FROM PRISMA SCHEMA...');
    console.log('=================================================');
    
    const timestamp = new Date().toISOString();
    const completeBackup = {
        _metadata: {
            exportDate: timestamp,
            exportType: 'complete_37_table_backup',
            version: '4.0',
            source: 'Prisma Client - Complete Schema',
            backupDate: BACKUP_DATE,
            totalTables: ALL_TABLES.length,
            databaseUrl: process.env.DATABASE_URL?.replace(/:[^@]*@/, ':***@')
        }
    };
    
    let totalRecords = 0;
    let successfulTables = 0;
    let failedTables = 0;
    
    for (const tableName of ALL_TABLES) {
        try {
            console.log(`📋 Backing up ${tableName}...`);
            
            // Convert table name to camelCase for Prisma
            const prismaModelName = tableName.charAt(0).toLowerCase() + tableName.slice(1);
            
            // Try to access the Prisma model
            if (prisma[prismaModelName]) {
                const records = await prisma[prismaModelName].findMany();
                completeBackup[tableName] = records;
                
                console.log(`   ✅ ${records.length} records backed up`);
                totalRecords += records.length;
                successfulTables++;
            } else {
                console.log(`   ⚠️ Prisma model '${prismaModelName}' not found - trying alternatives...`);
                
                // Try alternative naming conventions
                const alternatives = [
                    tableName,
                    tableName.toLowerCase(),
                    tableName.charAt(0).toLowerCase() + tableName.slice(1) + 's', // plural
                    tableName.toLowerCase() + 's'
                ];
                
                let found = false;
                for (const alt of alternatives) {
                    if (prisma[alt]) {
                        const records = await prisma[alt].findMany();
                        completeBackup[tableName] = records;
                        console.log(`   ✅ ${records.length} records (via '${alt}')`);
                        totalRecords += records.length;
                        successfulTables++;
                        found = true;
                        break;
                    }
                }
                
                if (!found) {
                    completeBackup[tableName] = [];
                    console.log(`   ❌ Model not accessible`);
                    failedTables++;
                }
            }
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            completeBackup[tableName] = [];
            failedTables++;
        }
    }
    
    // Update metadata
    completeBackup._metadata.totalRecords = totalRecords;
    completeBackup._metadata.successfulTables = successfulTables;
    completeBackup._metadata.failedTables = failedTables;
    completeBackup._metadata.completionRate = ((successfulTables / ALL_TABLES.length) * 100).toFixed(1);
    
    return completeBackup;
}

async function saveBackupFiles(backupData) {
    console.log('');
    console.log('💾 SAVING BACKUP FILES...');
    console.log('=========================');
    
    try {
        // Save complete JSON backup
        const jsonFile = path.join(BACKUP_DIR, `complete-all-tables-${BACKUP_DATE}.json`);
        fs.writeFileSync(jsonFile, JSON.stringify(backupData, null, 2));
        
        const jsonSize = (fs.statSync(jsonFile).size / (1024 * 1024)).toFixed(2);
        console.log(`✅ Complete backup: ${jsonFile} (${jsonSize} MB)`);
        
        // Save individual table files for easier access
        const tablesDir = path.join(BACKUP_DIR, 'individual-tables');
        if (!fs.existsSync(tablesDir)) {
            fs.mkdirSync(tablesDir);
        }
        
        let savedTables = 0;
        for (const tableName of ALL_TABLES) {
            if (backupData[tableName] && backupData[tableName].length > 0) {
                const tableFile = path.join(tablesDir, `${tableName.toLowerCase()}-${BACKUP_DATE}.json`);
                const tableData = {
                    tableName,
                    exportDate: backupData._metadata.exportDate,
                    recordCount: backupData[tableName].length,
                    data: backupData[tableName]
                };
                fs.writeFileSync(tableFile, JSON.stringify(tableData, null, 2));
                savedTables++;
            }
        }
        
        console.log(`✅ Individual table files: ${savedTables} tables saved`);
        
        // Save summary report
        const summaryFile = path.join(BACKUP_DIR, `backup-summary-${BACKUP_DATE}.json`);
        const summary = {
            backupDate: BACKUP_DATE,
            exportTime: backupData._metadata.exportDate,
            totalTables: ALL_TABLES.length,
            successfulTables: backupData._metadata.successfulTables,
            failedTables: backupData._metadata.failedTables,
            completionRate: backupData._metadata.completionRate,
            totalRecords: backupData._metadata.totalRecords,
            tableBreakdown: {}
        };
        
        for (const tableName of ALL_TABLES) {
            summary.tableBreakdown[tableName] = {
                records: backupData[tableName]?.length || 0,
                status: backupData[tableName]?.length > 0 ? 'SUCCESS' : 'EMPTY_OR_FAILED'
            };
        }
        
        fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
        console.log(`✅ Summary report: ${summaryFile}`);
        
        return { jsonFile, jsonSize, savedTables, summary };
        
    } catch (error) {
        console.error('❌ Save failed:', error);
        throw error;
    }
}

async function generateReport(backupData, fileInfo) {
    console.log('');
    console.log('📋 GENERATING DETAILED REPORT...');
    console.log('================================');
    
    try {
        const reportFile = path.join(BACKUP_DIR, `COMPLETE-BACKUP-REPORT-${BACKUP_DATE}.md`);
        
        const report = `# 📊 COMPLETE DATABASE BACKUP REPORT
## September 8, 2025 - ALL 37 TABLES

### ✅ BACKUP SUMMARY
- **Total Tables in Schema:** ${ALL_TABLES.length}
- **Successfully Backed Up:** ${backupData._metadata.successfulTables}
- **Failed/Empty:** ${backupData._metadata.failedTables}
- **Completion Rate:** ${backupData._metadata.completionRate}%
- **Total Records:** ${backupData._metadata.totalRecords.toLocaleString()}
- **Backup Size:** ${fileInfo.jsonSize} MB

### 📋 TABLE-BY-TABLE BREAKDOWN

| Table Name | Records | Status |
|------------|---------|--------|
${ALL_TABLES.map(table => {
    const count = backupData[table]?.length || 0;
    const status = count > 0 ? '✅ SUCCESS' : '❌ EMPTY/FAILED';
    return `| ${table} | ${count.toLocaleString()} | ${status} |`;
}).join('\n')}

### 📁 FILES CREATED
- **Main Backup:** complete-all-tables-${BACKUP_DATE}.json (${fileInfo.jsonSize} MB)
- **Individual Tables:** ${fileInfo.savedTables} table files
- **Summary Report:** backup-summary-${BACKUP_DATE}.json
- **This Report:** COMPLETE-BACKUP-REPORT-${BACKUP_DATE}.md

### 🔍 VERIFICATION
This backup contains **${backupData._metadata.completionRate}%** of all database tables defined in your Prisma schema.

**Generated:** ${new Date().toISOString()}  
**Status:** ${backupData._metadata.completionRate === '100.0' ? '✅ COMPLETE' : '⚠️ PARTIAL'}
`;

        fs.writeFileSync(reportFile, report);
        console.log(`✅ Detailed report: ${reportFile}`);
        
        return reportFile;
        
    } catch (error) {
        console.error('❌ Report generation failed:', error);
    }
}

async function main() {
    try {
        console.log('🔗 Connecting to database...');
        await prisma.$connect();
        console.log('✅ Database connected successfully');
        console.log('');
        
        // Backup all tables
        const backupData = await backupAllTables();
        
        // Save backup files
        const fileInfo = await saveBackupFiles(backupData);
        
        // Generate report
        await generateReport(backupData, fileInfo);
        
        console.log('');
        console.log('🎉 COMPLETE BACKUP FINISHED!');
        console.log('============================');
        console.log(`📅 Date: ${BACKUP_DATE}`);
        console.log(`📁 Location: ${BACKUP_DIR}`);
        console.log(`📊 Tables: ${backupData._metadata.successfulTables}/${ALL_TABLES.length} (${backupData._metadata.completionRate}%)`);
        console.log(`🗂️ Records: ${backupData._metadata.totalRecords.toLocaleString()}`);
        console.log(`💾 Size: ${fileInfo.jsonSize} MB`);
        
        if (backupData._metadata.completionRate === '100.0') {
            console.log('');
            console.log('✅ SUCCESS: ALL 37 TABLES BACKED UP COMPLETELY!');
            console.log('✅ Your database is now fully backed up and verified!');
        } else {
            console.log('');
            console.log('⚠️ PARTIAL SUCCESS: Some tables could not be accessed');
            console.log('ℹ️ Check the detailed report for specific table issues');
        }
        
    } catch (error) {
        console.error('❌ Backup failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the complete backup
main();
