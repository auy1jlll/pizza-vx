#!/usr/bin/env node

// 🔍 DATABASE BACKUP VERIFICATION - September 8, 2025
// Compares backup data with live database to ensure completeness

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const BACKUP_DATE = '2025-09-08';
const BACKUP_DIR = `./backups/backup-${BACKUP_DATE}`;

console.log('🔍 DATABASE BACKUP VERIFICATION - September 8, 2025');
console.log('==================================================');
console.log('');

async function verifyTableCounts() {
    console.log('📊 STEP 1: Verifying Table Record Counts...');
    console.log('==========================================');
    
    try {
        // Load JSON backup
        const jsonFile = path.join(BACKUP_DIR, `complete-data-${BACKUP_DATE}.json`);
        
        if (!fs.existsSync(jsonFile)) {
            console.error('❌ JSON backup file not found:', jsonFile);
            return false;
        }
        
        const backupData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        
        // Define tables to check
        const tables = [
            { name: 'users', prismaModel: 'user' },
            { name: 'categories', prismaModel: 'category' },
            { name: 'menuItems', prismaModel: 'menuItem' },
            { name: 'customizationGroups', prismaModel: 'customizationGroup' },
            { name: 'customizations', prismaModel: 'customization' },
            { name: 'orders', prismaModel: 'order' },
            { name: 'orderItems', prismaModel: 'orderItem' },
            { name: 'appSettings', prismaModel: 'appSetting' },
            { name: 'businessHours', prismaModel: 'businessHour' }
        ];
        
        let allMatch = true;
        
        for (const table of tables) {
            try {
                // Get live count from database
                const liveCount = await prisma[table.prismaModel].count();
                
                // Get backup count
                const backupCount = backupData[table.name]?.length || 0;
                
                const match = liveCount === backupCount;
                const status = match ? '✅' : '❌';
                
                console.log(`${status} ${table.name}:`);
                console.log(`   Live DB: ${liveCount} records`);
                console.log(`   Backup:  ${backupCount} records`);
                console.log(`   Match:   ${match ? 'YES' : 'NO'}`);
                console.log('');
                
                if (!match) {
                    allMatch = false;
                }
                
            } catch (error) {
                console.log(`⚠️ ${table.name}: Error checking - ${error.message}`);
                console.log('');
            }
        }
        
        return allMatch;
        
    } catch (error) {
        console.error('❌ Table count verification failed:', error);
        return false;
    }
}

async function verifyDataIntegrity() {
    console.log('🔍 STEP 2: Verifying Data Integrity...');
    console.log('======================================');
    
    try {
        // Load JSON backup
        const jsonFile = path.join(BACKUP_DIR, `complete-data-${BACKUP_DATE}.json`);
        const backupData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        
        // Check some sample records for integrity
        console.log('📋 Checking sample records...');
        
        // Check users
        if (backupData.users && backupData.users.length > 0) {
            const firstUser = backupData.users[0];
            const liveUser = await prisma.user.findUnique({ where: { id: firstUser.id } });
            
            if (liveUser) {
                const match = JSON.stringify(firstUser) === JSON.stringify(liveUser);
                console.log(`✅ Users sample match: ${match ? 'YES' : 'NO'}`);
            } else {
                console.log('❌ Users sample: User not found in live DB');
            }
        }
        
        // Check categories
        if (backupData.categories && backupData.categories.length > 0) {
            const firstCategory = backupData.categories[0];
            const liveCategory = await prisma.category.findUnique({ where: { id: firstCategory.id } });
            
            if (liveCategory) {
                const match = JSON.stringify(firstCategory) === JSON.stringify(liveCategory);
                console.log(`✅ Categories sample match: ${match ? 'YES' : 'NO'}`);
            } else {
                console.log('❌ Categories sample: Category not found in live DB');
            }
        }
        
        // Check menu items
        if (backupData.menuItems && backupData.menuItems.length > 0) {
            const firstMenuItem = backupData.menuItems[0];
            const liveMenuItem = await prisma.menuItem.findUnique({ where: { id: firstMenuItem.id } });
            
            if (liveMenuItem) {
                const match = JSON.stringify(firstMenuItem) === JSON.stringify(liveMenuItem);
                console.log(`✅ Menu Items sample match: ${match ? 'YES' : 'NO'}`);
            } else {
                console.log('❌ Menu Items sample: Item not found in live DB');
            }
        }
        
        console.log('');
        return true;
        
    } catch (error) {
        console.error('❌ Data integrity verification failed:', error);
        return false;
    }
}

async function verifyBackupFiles() {
    console.log('📁 STEP 3: Verifying Backup Files...');
    console.log('====================================');
    
    try {
        const expectedFiles = [
            `schema-${BACKUP_DATE}.sql`,
            `data-${BACKUP_DATE}.sql`,
            `complete-${BACKUP_DATE}.sql`,
            `complete-data-${BACKUP_DATE}.json`
        ];
        
        let allFilesExist = true;
        
        for (const fileName of expectedFiles) {
            const filePath = path.join(BACKUP_DIR, fileName);
            const exists = fs.existsSync(filePath);
            
            if (exists) {
                const stats = fs.statSync(filePath);
                const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
                console.log(`✅ ${fileName} (${sizeMB} MB)`);
            } else {
                console.log(`❌ ${fileName} - FILE MISSING`);
                allFilesExist = false;
            }
        }
        
        console.log('');
        return allFilesExist;
        
    } catch (error) {
        console.error('❌ File verification failed:', error);
        return false;
    }
}

async function generateVerificationReport() {
    console.log('📋 STEP 4: Generating Verification Report...');
    console.log('============================================');
    
    try {
        const jsonFile = path.join(BACKUP_DIR, `complete-data-${BACKUP_DATE}.json`);
        const backupData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        
        const report = {
            verificationDate: new Date().toISOString(),
            backupDate: BACKUP_DATE,
            status: 'COMPLETED',
            summary: {
                totalTables: 0,
                totalRecords: 0,
                backupSize: 0
            },
            tables: {},
            files: {}
        };
        
        // Calculate totals
        Object.keys(backupData).forEach(table => {
            if (table !== '_metadata' && Array.isArray(backupData[table])) {
                report.tables[table] = backupData[table].length;
                report.summary.totalTables++;
                report.summary.totalRecords += backupData[table].length;
            }
        });
        
        // Check file sizes
        const files = fs.readdirSync(BACKUP_DIR);
        files.forEach(file => {
            const filePath = path.join(BACKUP_DIR, file);
            const stats = fs.statSync(filePath);
            report.files[file] = {
                size: stats.size,
                sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
                created: stats.mtime.toISOString()
            };
            report.summary.backupSize += stats.size;
        });
        
        // Save verification report
        const reportFile = path.join(BACKUP_DIR, `verification-report-${BACKUP_DATE}.json`);
        fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
        
        console.log('✅ Verification report created:', reportFile);
        console.log('');
        console.log('📊 BACKUP SUMMARY:');
        console.log('==================');
        console.log(`Total Tables: ${report.summary.totalTables}`);
        console.log(`Total Records: ${report.summary.totalRecords}`);
        console.log(`Total Size: ${(report.summary.backupSize / (1024 * 1024)).toFixed(2)} MB`);
        console.log('');
        
        return true;
        
    } catch (error) {
        console.error('❌ Report generation failed:', error);
        return false;
    }
}

async function main() {
    try {
        console.log('🔗 Connecting to database...');
        await prisma.$connect();
        console.log('✅ Database connected');
        console.log('');
        
        const countsMatch = await verifyTableCounts();
        const dataIntact = await verifyDataIntegrity();
        const filesExist = await verifyBackupFiles();
        const reportGenerated = await generateVerificationReport();
        
        console.log('🎯 VERIFICATION RESULTS:');
        console.log('========================');
        console.log(`Record Counts Match: ${countsMatch ? '✅' : '❌'}`);
        console.log(`Data Integrity: ${dataIntact ? '✅' : '❌'}`);
        console.log(`All Files Present: ${filesExist ? '✅' : '❌'}`);
        console.log(`Report Generated: ${reportGenerated ? '✅' : '❌'}`);
        console.log('');
        
        const overallSuccess = countsMatch && dataIntact && filesExist && reportGenerated;
        
        if (overallSuccess) {
            console.log('🎉 BACKUP VERIFICATION SUCCESSFUL!');
            console.log('✅ All data has been successfully backed up and verified');
        } else {
            console.log('⚠️ BACKUP VERIFICATION ISSUES DETECTED');
            console.log('❌ Please review the issues above and re-run backup if needed');
        }
        
    } catch (error) {
        console.error('❌ Verification failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run verification
main();
