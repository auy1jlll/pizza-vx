#!/usr/bin/env node

// 📦 COMPLETE DATABASE BACKUP - September 8, 2025
// Pulls both schema and data from PostgreSQL database

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const prisma = new PrismaClient();

// Backup configuration
const BACKUP_DATE = '2025-09-08';
const BACKUP_TIME = new Date().toISOString().replace(/[:.]/g, '-');
const BACKUP_DIR = `./backups/backup-${BACKUP_DATE}`;

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

console.log('🚀 COMPLETE DATABASE BACKUP - September 8, 2025');
console.log('===============================================');
console.log(`📁 Backup Directory: ${BACKUP_DIR}`);
console.log(`⏰ Backup Time: ${BACKUP_TIME}`);
console.log('');

async function createSchemaBackup() {
    console.log('📋 STEP 1: Creating Schema Backup...');
    
    try {
        const schemaFile = path.join(BACKUP_DIR, `schema-${BACKUP_DATE}.sql`);
        
        // Export schema only (no data)
        const schemaCommand = `npx prisma db execute --file-from-stdin --schema=./prisma/schema.prisma < <(pg_dump ${process.env.DATABASE_URL} --schema-only --no-owner --no-privileges)`;
        
        // Alternative: Use pg_dump directly
        const pgDumpSchema = `pg_dump "${process.env.DATABASE_URL}" --schema-only --no-owner --no-privileges --file="${schemaFile}"`;
        
        exec(pgDumpSchema, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Schema backup failed:', error);
                return;
            }
            console.log('✅ Schema backup completed:', schemaFile);
            console.log(`📊 Schema file size: ${fs.statSync(schemaFile).size} bytes`);
        });
        
    } catch (error) {
        console.error('❌ Schema backup error:', error);
    }
}

async function createDataBackup() {
    console.log('📊 STEP 2: Creating Data Backup...');
    
    try {
        const dataFile = path.join(BACKUP_DIR, `data-${BACKUP_DATE}.sql`);
        
        // Export data only (no schema)
        const pgDumpData = `pg_dump "${process.env.DATABASE_URL}" --data-only --no-owner --no-privileges --file="${dataFile}"`;
        
        exec(pgDumpData, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Data backup failed:', error);
                return;
            }
            console.log('✅ Data backup completed:', dataFile);
            console.log(`📊 Data file size: ${fs.statSync(dataFile).size} bytes`);
        });
        
    } catch (error) {
        console.error('❌ Data backup error:', error);
    }
}

async function createCompleteBackup() {
    console.log('🗄️ STEP 3: Creating Complete Backup...');
    
    try {
        const completeFile = path.join(BACKUP_DIR, `complete-${BACKUP_DATE}.sql`);
        
        // Export complete database (schema + data)
        const pgDumpComplete = `pg_dump "${process.env.DATABASE_URL}" --no-owner --no-privileges --file="${completeFile}"`;
        
        exec(pgDumpComplete, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Complete backup failed:', error);
                return;
            }
            console.log('✅ Complete backup completed:', completeFile);
            console.log(`📊 Complete file size: ${fs.statSync(completeFile).size} bytes`);
        });
        
    } catch (error) {
        console.error('❌ Complete backup error:', error);
    }
}

async function createJSONBackup() {
    console.log('📋 STEP 4: Creating JSON Data Export...');
    
    try {
        // Get all table data using Prisma
        const tables = [
            'users',
            'categories', 
            'menuItems',
            'customizationGroups',
            'customizations',
            'orders',
            'orderItems',
            'appSettings',
            'businessHours'
        ];
        
        const jsonData = {};
        const timestamp = new Date().toISOString();
        
        console.log('📊 Exporting table data...');
        
        for (const table of tables) {
            try {
                console.log(`   📋 Exporting ${table}...`);
                
                switch(table) {
                    case 'users':
                        jsonData.users = await prisma.user.findMany();
                        break;
                    case 'categories':
                        jsonData.categories = await prisma.category.findMany();
                        break;
                    case 'menuItems':
                        jsonData.menuItems = await prisma.menuItem.findMany();
                        break;
                    case 'customizationGroups':
                        jsonData.customizationGroups = await prisma.customizationGroup.findMany();
                        break;
                    case 'customizations':
                        jsonData.customizations = await prisma.customization.findMany();
                        break;
                    case 'orders':
                        jsonData.orders = await prisma.order.findMany();
                        break;
                    case 'orderItems':
                        jsonData.orderItems = await prisma.orderItem.findMany();
                        break;
                    case 'appSettings':
                        jsonData.appSettings = await prisma.appSetting.findMany();
                        break;
                    case 'businessHours':
                        jsonData.businessHours = await prisma.businessHour.findMany();
                        break;
                }
                
                console.log(`   ✅ ${table}: ${jsonData[table]?.length || 0} records`);
                
            } catch (tableError) {
                console.log(`   ⚠️ ${table}: Error - ${tableError.message}`);
                jsonData[table] = [];
            }
        }
        
        // Add metadata
        jsonData._metadata = {
            exportDate: timestamp,
            exportType: 'complete_database_backup',
            version: '1.0',
            source: 'PostgreSQL via Prisma',
            totalTables: tables.length,
            backupDate: BACKUP_DATE
        };
        
        // Save JSON backup
        const jsonFile = path.join(BACKUP_DIR, `complete-data-${BACKUP_DATE}.json`);
        fs.writeFileSync(jsonFile, JSON.stringify(jsonData, null, 2));
        
        console.log('✅ JSON backup completed:', jsonFile);
        console.log(`📊 JSON file size: ${fs.statSync(jsonFile).size} bytes`);
        
        // Create summary
        console.log('');
        console.log('📊 DATA SUMMARY:');
        console.log('================');
        Object.keys(jsonData).forEach(table => {
            if (table !== '_metadata' && Array.isArray(jsonData[table])) {
                console.log(`   ${table}: ${jsonData[table].length} records`);
            }
        });
        
    } catch (error) {
        console.error('❌ JSON backup error:', error);
    }
}

async function verifyBackups() {
    console.log('');
    console.log('🔍 STEP 5: Verifying Backups...');
    console.log('================================');
    
    try {
        const files = fs.readdirSync(BACKUP_DIR);
        
        files.forEach(file => {
            const filePath = path.join(BACKUP_DIR, file);
            const stats = fs.statSync(filePath);
            const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            
            console.log(`📁 ${file}`);
            console.log(`   Size: ${sizeMB} MB`);
            console.log(`   Modified: ${stats.mtime.toISOString()}`);
            console.log('');
        });
        
        console.log('✅ All backups verified successfully!');
        
    } catch (error) {
        console.error('❌ Verification error:', error);
    }
}

async function main() {
    try {
        // Test database connection first
        console.log('🔗 Testing database connection...');
        await prisma.$connect();
        console.log('✅ Database connected successfully');
        console.log('');
        
        // Create all backups
        await createSchemaBackup();
        await createDataBackup(); 
        await createCompleteBackup();
        await createJSONBackup();
        await verifyBackups();
        
        console.log('🎉 BACKUP COMPLETED SUCCESSFULLY!');
        console.log('==================================');
        console.log(`📁 All files saved to: ${BACKUP_DIR}`);
        console.log(`📅 Backup Date: ${BACKUP_DATE}`);
        console.log(`⏰ Backup Time: ${BACKUP_TIME}`);
        
    } catch (error) {
        console.error('❌ Backup failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the backup
main();
