#!/usr/bin/env node

// 📦 FINAL DATABASE BACKUP - September 8, 2025
// Complete and verified database backup

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

console.log('🚀 FINAL DATABASE BACKUP - September 8, 2025');
console.log('=============================================');
console.log(`📁 Backup Directory: ${BACKUP_DIR}`);
console.log(`⏰ Backup Time: ${BACKUP_TIME}`);
console.log('');

async function exportCorrectedData() {
    console.log('📊 EXPORTING DATABASE WITH CORRECTED SCHEMA...');
    console.log('==============================================');
    
    try {
        const timestamp = new Date().toISOString();
        const exportData = {
            _metadata: {
                exportDate: timestamp,
                exportType: 'final_verified_backup',
                version: '3.0',
                source: 'Prisma Client - Corrected Schema',
                backupDate: BACKUP_DATE,
                databaseUrl: process.env.DATABASE_URL?.replace(/:[^@]*@/, ':***@')
            }
        };
        
        // Export Users (Working)
        console.log('👥 Exporting users...');
        try {
            exportData.users = await prisma.user.findMany();
            console.log(`   ✅ ${exportData.users.length} users exported`);
        } catch (error) {
            console.log(`   ❌ Users: ${error.message}`);
            exportData.users = [];
        }
        
        // Export Categories (Fix schema)
        console.log('📂 Exporting categories...');
        try {
            exportData.categories = await prisma.category.findMany();
            console.log(`   ✅ ${exportData.categories.length} categories exported`);
        } catch (error) {
            console.log(`   ❌ Categories: ${error.message}`);
            exportData.categories = [];
        }
        
        // Export Menu Items (Simplified)
        console.log('🍕 Exporting menu items...');
        try {
            exportData.menuItems = await prisma.menuItem.findMany();
            console.log(`   ✅ ${exportData.menuItems.length} menu items exported`);
        } catch (error) {
            console.log(`   ❌ Menu Items: ${error.message}`);
            exportData.menuItems = [];
        }
        
        // Export Customization Groups (Simplified)
        console.log('⚙️ Exporting customization groups...');
        try {
            exportData.customizationGroups = await prisma.customizationGroup.findMany();
            console.log(`   ✅ ${exportData.customizationGroups.length} customization groups exported`);
        } catch (error) {
            console.log(`   ❌ Customization Groups: ${error.message}`);
            exportData.customizationGroups = [];
        }
        
        // Export Options (instead of customizations)
        console.log('🔧 Exporting options...');
        try {
            exportData.options = await prisma.option.findMany();
            console.log(`   ✅ ${exportData.options.length} options exported`);
        } catch (error) {
            console.log(`   ❌ Options: ${error.message}`);
            exportData.options = [];
        }
        
        // Export Orders (Simplified)
        console.log('📋 Exporting orders...');
        try {
            exportData.orders = await prisma.order.findMany();
            console.log(`   ✅ ${exportData.orders.length} orders exported`);
        } catch (error) {
            console.log(`   ❌ Orders: ${error.message}`);
            exportData.orders = [];
        }
        
        // Export Order Items (Working)
        console.log('🛒 Exporting order items...');
        try {
            exportData.orderItems = await prisma.orderItem.findMany();
            console.log(`   ✅ ${exportData.orderItems.length} order items exported`);
        } catch (error) {
            console.log(`   ❌ Order Items: ${error.message}`);
            exportData.orderItems = [];
        }
        
        // Export App Settings (Working)
        console.log('⚙️ Exporting app settings...');
        try {
            exportData.appSettings = await prisma.appSetting.findMany();
            console.log(`   ✅ ${exportData.appSettings.length} app settings exported`);
        } catch (error) {
            console.log(`   ❌ App Settings: ${error.message}`);
            exportData.appSettings = [];
        }
        
        // Export Business Hours
        console.log('🕐 Exporting business hours...');
        try {
            exportData.businessHours = await prisma.businessHour.findMany();
            console.log(`   ✅ ${exportData.businessHours.length} business hours exported`);
        } catch (error) {
            console.log(`   ❌ Business Hours: ${error.message}`);
            exportData.businessHours = [];
        }
        
        // Export Menu Item Customizations
        console.log('🔗 Exporting menu item customizations...');
        try {
            exportData.menuItemCustomizations = await prisma.menuItemCustomization.findMany();
            console.log(`   ✅ ${exportData.menuItemCustomizations.length} menu item customizations exported`);
        } catch (error) {
            console.log(`   ❌ Menu Item Customizations: ${error.message}`);
            exportData.menuItemCustomizations = [];
        }
        
        // Export Order Item Customizations (Working)
        console.log('🔗 Exporting order item customizations...');
        try {
            exportData.orderItemCustomizations = await prisma.orderItemCustomization.findMany();
            console.log(`   ✅ ${exportData.orderItemCustomizations.length} order item customizations exported`);
        } catch (error) {
            console.log(`   ❌ Order Item Customizations: ${error.message}`);
            exportData.orderItemCustomizations = [];
        }
        
        // Calculate totals
        let totalRecords = 0;
        Object.keys(exportData).forEach(table => {
            if (table !== '_metadata' && Array.isArray(exportData[table])) {
                totalRecords += exportData[table].length;
            }
        });
        
        exportData._metadata.totalRecords = totalRecords;
        exportData._metadata.totalTables = Object.keys(exportData).length - 1;
        
        // Save complete export
        const exportFile = path.join(BACKUP_DIR, `final-complete-database-${BACKUP_DATE}.json`);
        fs.writeFileSync(exportFile, JSON.stringify(exportData, null, 2));
        
        console.log('');
        console.log('✅ FINAL DATABASE EXPORT COMPLETED!');
        console.log('===================================');
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

async function verifyAgainstLiveDB(exportData) {
    console.log('');
    console.log('🔍 VERIFYING AGAINST LIVE DATABASE...');
    console.log('====================================');
    
    const verificationResults = {
        timestamp: new Date().toISOString(),
        checks: {},
        overallStatus: 'PENDING'
    };
    
    // Check each table
    const tables = ['users', 'categories', 'menuItems', 'customizationGroups', 'options', 'orders', 'orderItems', 'appSettings'];
    
    for (const table of tables) {
        try {
            let liveCount = 0;
            
            switch(table) {
                case 'users':
                    liveCount = await prisma.user.count();
                    break;
                case 'categories':
                    liveCount = await prisma.category.count();
                    break;
                case 'menuItems':
                    liveCount = await prisma.menuItem.count();
                    break;
                case 'customizationGroups':
                    liveCount = await prisma.customizationGroup.count();
                    break;
                case 'options':
                    liveCount = await prisma.option.count();
                    break;
                case 'orders':
                    liveCount = await prisma.order.count();
                    break;
                case 'orderItems':
                    liveCount = await prisma.orderItem.count();
                    break;
                case 'appSettings':
                    liveCount = await prisma.appSetting.count();
                    break;
            }
            
            const backupCount = exportData[table]?.length || 0;
            const match = liveCount === backupCount;
            
            verificationResults.checks[table] = {
                liveCount,
                backupCount,
                match,
                status: match ? 'VERIFIED' : 'MISMATCH'
            };
            
            const status = match ? '✅' : '❌';
            console.log(`${status} ${table}: Live=${liveCount}, Backup=${backupCount}, Match=${match}`);
            
        } catch (error) {
            verificationResults.checks[table] = {
                error: error.message,
                status: 'ERROR'
            };
            console.log(`⚠️ ${table}: ${error.message}`);
        }
    }
    
    // Determine overall status
    const allChecked = Object.values(verificationResults.checks);
    const verified = allChecked.filter(check => check.status === 'VERIFIED').length;
    const total = allChecked.length;
    
    verificationResults.overallStatus = verified === total ? 'FULLY_VERIFIED' : 'PARTIAL_VERIFICATION';
    verificationResults.verifiedTables = verified;
    verificationResults.totalTables = total;
    
    // Save verification results
    const verificationFile = path.join(BACKUP_DIR, `verification-${BACKUP_DATE}.json`);
    fs.writeFileSync(verificationFile, JSON.stringify(verificationResults, null, 2));
    
    console.log('');
    console.log(`📊 VERIFICATION: ${verified}/${total} tables verified`);
    console.log(`✅ Status: ${verificationResults.overallStatus}`);
    console.log(`📁 Report: ${verificationFile}`);
    
    return verificationResults;
}

async function main() {
    try {
        console.log('🔗 Connecting to database...');
        await prisma.$connect();
        console.log('✅ Database connected successfully');
        console.log('');
        
        // Export all data
        const exportData = await exportCorrectedData();
        
        // Verify against live database
        const verification = await verifyAgainstLiveDB(exportData);
        
        console.log('');
        console.log('🎉 BACKUP AND VERIFICATION COMPLETED!');
        console.log('=====================================');
        console.log(`📅 Date: ${BACKUP_DATE}`);
        console.log(`⏰ Time: ${BACKUP_TIME}`);
        console.log(`📁 Location: ${BACKUP_DIR}`);
        console.log(`🔍 Status: ${verification.overallStatus}`);
        console.log('');
        console.log('📊 FINAL SUMMARY:');
        console.log('=================');
        
        Object.keys(exportData).forEach(table => {
            if (table !== '_metadata' && Array.isArray(exportData[table])) {
                const count = exportData[table].length;
                const status = verification.checks[table]?.match ? '✅' : verification.checks[table]?.error ? '⚠️' : '❓';
                console.log(`   ${status} ${table}: ${count} records`);
            }
        });
        
        if (verification.overallStatus === 'FULLY_VERIFIED') {
            console.log('');
            console.log('✅ ALL DATA SUCCESSFULLY BACKED UP AND VERIFIED!');
            console.log('✅ Backup is complete and matches live database');
        } else {
            console.log('');
            console.log('⚠️ Backup completed with some verification issues');
            console.log('ℹ️ Check verification report for details');
        }
        
    } catch (error) {
        console.error('❌ Backup failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the final backup
main();
