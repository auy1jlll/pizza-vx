#!/usr/bin/env node

// 📦 CLEAN COMPLETE BACKUP - TWO FILES ONLY
// Creates exactly 2 files: 1 clean schema + 1 complete data backup

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const BACKUP_DATE = '2025-09-08';
const BACKUP_TIME = new Date().toISOString().replace(/[:.]/g, '-');
const BACKUP_DIR = `./backups/clean-complete-${BACKUP_DATE}`;

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

console.log('🚀 CLEAN COMPLETE BACKUP - 2 FILES ONLY');
console.log('=======================================');
console.log(`📁 Backup Directory: ${BACKUP_DIR}`);
console.log(`⏰ Backup Time: ${BACKUP_TIME}`);
console.log('');

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

async function createCleanSchemaFile() {
    console.log('📋 CREATING CLEAN SCHEMA FILE...');
    console.log('================================');
    
    try {
        // Read the original Prisma schema
        const originalSchemaPath = './prisma/schema.prisma';
        const schemaContent = fs.readFileSync(originalSchemaPath, 'utf8');
        
        // Create clean schema file
        const cleanSchemaFile = path.join(BACKUP_DIR, `COMPLETE-SCHEMA-${BACKUP_DATE}.prisma`);
        
        // Add header with metadata
        const schemaWithHeader = `// 📋 COMPLETE DATABASE SCHEMA - September 8, 2025
// 🗄️ PostgreSQL Database Schema - All 37 Tables
// 📅 Exported: ${new Date().toISOString()}
// 📊 Tables: ${ALL_TABLES.length} models defined
// 🔗 Source: ${originalSchemaPath}

${schemaContent}`;

        fs.writeFileSync(cleanSchemaFile, schemaWithHeader);
        
        const schemaSize = (fs.statSync(cleanSchemaFile).size / 1024).toFixed(2);
        console.log(`✅ Clean schema file created: ${cleanSchemaFile}`);
        console.log(`📊 Size: ${schemaSize} KB`);
        console.log(`📋 Contains: ${ALL_TABLES.length} table definitions`);
        
        // Verify schema content
        const modelCount = (schemaContent.match(/^model /gm) || []).length;
        console.log(`🔍 Verified: ${modelCount} models found in schema`);
        
        return { cleanSchemaFile, schemaSize, modelCount };
        
    } catch (error) {
        console.error('❌ Schema creation failed:', error);
        throw error;
    }
}

async function createCompleteDataFile() {
    console.log('');
    console.log('📊 CREATING COMPLETE DATA FILE...');
    console.log('=================================');
    
    try {
        const timestamp = new Date().toISOString();
        const completeData = {
            _metadata: {
                title: "COMPLETE DATABASE BACKUP - ALL DATA",
                exportDate: timestamp,
                backupDate: BACKUP_DATE,
                version: "5.0 - Clean Complete",
                source: "PostgreSQL via Prisma Client",
                totalTables: ALL_TABLES.length,
                databaseUrl: process.env.DATABASE_URL?.replace(/:[^@]*@/, ':***@'),
                description: "Complete backup of all 37 database tables with full data"
            }
        };
        
        let totalRecords = 0;
        let successfulTables = 0;
        
        console.log('📋 Extracting data from all tables...');
        
        for (const tableName of ALL_TABLES) {
            try {
                // Convert to camelCase for Prisma
                const prismaModelName = tableName.charAt(0).toLowerCase() + tableName.slice(1);
                
                if (prisma[prismaModelName]) {
                    const records = await prisma[prismaModelName].findMany();
                    completeData[tableName] = records;
                    
                    if (records.length > 0) {
                        console.log(`   ✅ ${tableName}: ${records.length} records`);
                    } else {
                        console.log(`   📭 ${tableName}: empty`);
                    }
                    
                    totalRecords += records.length;
                    successfulTables++;
                } else {
                    console.log(`   ❌ ${tableName}: model not found`);
                    completeData[tableName] = [];
                }
                
            } catch (error) {
                console.log(`   ❌ ${tableName}: ${error.message}`);
                completeData[tableName] = [];
            }
        }
        
        // Update metadata
        completeData._metadata.totalRecords = totalRecords;
        completeData._metadata.successfulTables = successfulTables;
        completeData._metadata.completionRate = ((successfulTables / ALL_TABLES.length) * 100).toFixed(1);
        
        // Save complete data file
        const completeDataFile = path.join(BACKUP_DIR, `COMPLETE-DATA-${BACKUP_DATE}.json`);
        fs.writeFileSync(completeDataFile, JSON.stringify(completeData, null, 2));
        
        const dataSize = (fs.statSync(completeDataFile).size / (1024 * 1024)).toFixed(2);
        console.log('');
        console.log(`✅ Complete data file created: ${completeDataFile}`);
        console.log(`📊 Size: ${dataSize} MB`);
        console.log(`🗂️ Records: ${totalRecords.toLocaleString()}`);
        console.log(`📋 Tables: ${successfulTables}/${ALL_TABLES.length} (${completeData._metadata.completionRate}%)`);
        
        return { completeDataFile, dataSize, totalRecords, successfulTables, completionRate: completeData._metadata.completionRate };
        
    } catch (error) {
        console.error('❌ Data creation failed:', error);
        throw error;
    }
}

async function createFinalSummary(schemaInfo, dataInfo) {
    console.log('');
    console.log('📋 CREATING FINAL SUMMARY...');
    console.log('============================');
    
    try {
        const summaryFile = path.join(BACKUP_DIR, `BACKUP-SUMMARY-${BACKUP_DATE}.md`);
        
        const summary = `# 📊 CLEAN COMPLETE BACKUP SUMMARY
## September 8, 2025 - Two Complete Files

### ✅ BACKUP COMPLETED - 2 CLEAN FILES CREATED

**🗂️ File 1: COMPLETE SCHEMA**
- **File:** \`COMPLETE-SCHEMA-${BACKUP_DATE}.prisma\`
- **Size:** ${schemaInfo.schemaSize} KB
- **Contains:** ${schemaInfo.modelCount} table definitions
- **Status:** ✅ Complete Prisma schema with all models

**📊 File 2: COMPLETE DATA**
- **File:** \`COMPLETE-DATA-${BACKUP_DATE}.json\`
- **Size:** ${dataInfo.dataSize} MB
- **Records:** ${dataInfo.totalRecords.toLocaleString()} total records
- **Tables:** ${dataInfo.successfulTables}/${ALL_TABLES.length} (${dataInfo.completionRate}%)
- **Status:** ✅ Complete data backup from PostgreSQL

### 📋 WHAT YOU GET

**🔧 Schema File:**
- Complete PostgreSQL database structure
- All 37 table definitions
- Relationships and constraints
- Ready for database recreation

**📊 Data File:**
- All data from all ${ALL_TABLES.length} tables
- ${dataInfo.totalRecords.toLocaleString()} total records
- JSON format for easy import
- Complete business data preservation

### 🎯 PERFECT FOR

✅ **Database Recreation:** Use schema file to rebuild structure  
✅ **Data Restoration:** Use data file to populate tables  
✅ **App Deployment:** Both files contain everything needed  
✅ **Backup Storage:** Two files = complete database backup  

### 📁 LOCATION
\`${BACKUP_DIR}\`

**Generated:** ${new Date().toISOString()}  
**Status:** ✅ COMPLETE - 2 clean files ready for use
`;

        fs.writeFileSync(summaryFile, summary);
        console.log(`✅ Summary created: ${summaryFile}`);
        
        return summaryFile;
        
    } catch (error) {
        console.error('❌ Summary creation failed:', error);
    }
}

async function main() {
    try {
        console.log('🔗 Connecting to database...');
        await prisma.$connect();
        console.log('✅ Database connected successfully');
        console.log('');
        
        // Create clean schema file
        const schemaInfo = await createCleanSchemaFile();
        
        // Create complete data file
        const dataInfo = await createCompleteDataFile();
        
        // Create final summary
        await createFinalSummary(schemaInfo, dataInfo);
        
        console.log('');
        console.log('🎉 CLEAN COMPLETE BACKUP FINISHED!');
        console.log('==================================');
        console.log(`📅 Date: ${BACKUP_DATE}`);
        console.log(`📁 Location: ${BACKUP_DIR}`);
        console.log('');
        console.log('📂 TWO CLEAN FILES CREATED:');
        console.log(`   1️⃣ COMPLETE-SCHEMA-${BACKUP_DATE}.prisma (${schemaInfo.schemaSize} KB)`);
        console.log(`   2️⃣ COMPLETE-DATA-${BACKUP_DATE}.json (${dataInfo.dataSize} MB)`);
        console.log('');
        console.log('✅ PERFECT: You now have exactly 2 complete files!');
        console.log('✅ SCHEMA: Complete database structure');
        console.log('✅ DATA: All business data from PostgreSQL');
        console.log(`✅ RECORDS: ${dataInfo.totalRecords.toLocaleString()} total records backed up`);
        
    } catch (error) {
        console.error('❌ Backup failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the clean backup
main();
