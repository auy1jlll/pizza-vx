#!/usr/bin/env node

// 🔄 DOCKER-READY BACKUP - COMPLETE DATA BACKUP
// Backs up ALL data from every table for Docker deployment

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

console.log('🔄 DOCKER-READY BACKUP - COMPLETE DATA BACKUP');
console.log('==============================================');
console.log('');

async function backupCompleteData() {
    console.log('📊 STEP 1: Collecting complete data from all tables...');
    
    try {
        // Get all table names from the database
        const tables = await prisma.$queryRaw`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
            AND table_name != '_prisma_migrations'
            ORDER BY table_name;
        `;

        console.log(`✅ Found ${tables.length} data tables to backup`);

        const completeDataBackup = {
            _metadata: {
                backup_type: 'COMPLETE_DATA_BACKUP',
                created_at: new Date().toISOString(),
                total_tables: tables.length,
                total_records: 0,
                successful_tables: 0,
                failed_tables: 0,
                backup_source: 'Pre-Docker-Deployment',
                prisma_version: '6.15.0',
                node_version: process.version,
                platform: process.platform,
                tables_backed_up: [],
                tables_failed: []
            }
        };

        let totalRecords = 0;

        // Backup each table's data
        for (const tableInfo of tables) {
            const tableName = tableInfo.table_name;
            
            try {
                // Use raw query to get all data from each table
                const data = await prisma.$queryRawUnsafe(`SELECT * FROM "${tableName}"`);
                
                completeDataBackup[tableName] = data;
                completeDataBackup._metadata.tables_backed_up.push(tableName);
                completeDataBackup._metadata.successful_tables++;
                totalRecords += data.length;
                
                console.log(`   ✅ ${tableName}: ${data.length} records backed up`);
                
            } catch (error) {
                console.log(`   ❌ ${tableName}: Failed to backup - ${error.message}`);
                completeDataBackup._metadata.tables_failed.push({
                    table: tableName,
                    error: error.message
                });
                completeDataBackup._metadata.failed_tables++;
            }
        }

        completeDataBackup._metadata.total_records = totalRecords;

        // Get database statistics
        const dbStats = {};
        for (const tableInfo of tables) {
            const tableName = tableInfo.table_name;
            try {
                const count = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "${tableName}"`);
                dbStats[tableName] = parseInt(count[0].count);
            } catch (error) {
                dbStats[tableName] = 'ERROR';
            }
        }

        completeDataBackup._metadata.table_record_counts = dbStats;

        // Create backup directory if it doesn't exist
        const backupDir = './backups/docker-ready-2025-09-08';
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Save data backup
        const dataBackupPath = path.join(backupDir, 'docker-ready-backup-37-data.json');
        fs.writeFileSync(dataBackupPath, JSON.stringify(completeDataBackup, null, 2));

        console.log('');
        console.log('✅ COMPLETE DATA BACKUP CREATED!');
        console.log('================================');
        console.log(`📁 Location: ${dataBackupPath}`);
        console.log(`📊 Tables: ${completeDataBackup._metadata.successful_tables}/${completeDataBackup._metadata.total_tables}`);
        console.log(`📋 Total Records: ${completeDataBackup._metadata.total_records}`);
        console.log(`✅ Successful: ${completeDataBackup._metadata.successful_tables}`);
        console.log(`❌ Failed: ${completeDataBackup._metadata.failed_tables}`);

        if (completeDataBackup._metadata.failed_tables > 0) {
            console.log('');
            console.log('⚠️ FAILED TABLES:');
            completeDataBackup._metadata.tables_failed.forEach(failure => {
                console.log(`   ❌ ${failure.table}: ${failure.error}`);
            });
        }

        console.log('');
        console.log('📊 RECORD COUNTS BY TABLE:');
        console.log('==========================');
        Object.entries(dbStats).forEach(([table, count]) => {
            const status = count === 'ERROR' ? '❌' : '✅';
            console.log(`   ${status} ${table}: ${count} records`);
        });

        console.log('');
        return dataBackupPath;

    } catch (error) {
        console.error('❌ Data backup failed:', error);
        throw error;
    }
}

async function main() {
    try {
        console.log('🔗 Connecting to database...');
        await prisma.$connect();
        console.log('✅ Database connected');
        console.log('');

        const dataPath = await backupCompleteData();

        console.log('🎉 DOCKER-READY DATA BACKUP COMPLETE!');
        console.log('=====================================');
        console.log('✅ ALL table data backed up');
        console.log('✅ Complete record preservation');
        console.log('✅ Metadata and statistics included');
        console.log('✅ Ready for Docker deployment');
        console.log('');
        console.log(`📁 Data backup: ${path.basename(dataPath)}`);

    } catch (error) {
        console.error('❌ Backup failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the data backup
main();
