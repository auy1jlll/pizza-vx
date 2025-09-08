#!/usr/bin/env node

// 🔄 DOCKER-READY BACKUP - COMPLETE PRISMA SCHEMA
// Backs up the entire database schema for Docker deployment

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

console.log('🔄 DOCKER-READY BACKUP - COMPLETE PRISMA SCHEMA');
console.log('===============================================');
console.log('');

async function backupCompleteSchema() {
    console.log('📋 STEP 1: Collecting complete database schema information...');
    
    try {
        // Get all table information from the database
        const tableInfo = await prisma.$queryRaw`
            SELECT 
                t.table_name,
                t.table_type,
                t.table_schema
            FROM information_schema.tables t
            WHERE t.table_schema = 'public'
            AND t.table_type = 'BASE TABLE'
            ORDER BY t.table_name;
        `;

        console.log(`✅ Found ${tableInfo.length} tables in database`);

        // Get detailed column information for each table
        const schemaDetails = {};
        let totalColumns = 0;

        for (const table of tableInfo) {
            const tableName = table.table_name;
            
            // Get column details
            const columns = await prisma.$queryRaw`
                SELECT 
                    c.column_name,
                    c.data_type,
                    c.is_nullable,
                    c.column_default,
                    c.character_maximum_length,
                    c.numeric_precision,
                    c.numeric_scale,
                    c.ordinal_position
                FROM information_schema.columns c
                WHERE c.table_schema = 'public'
                AND c.table_name = ${tableName}
                ORDER BY c.ordinal_position;
            `;

            // Get constraints (primary keys, foreign keys, unique, etc.)
            const constraints = await prisma.$queryRaw`
                SELECT 
                    tc.constraint_name,
                    tc.constraint_type,
                    kcu.column_name,
                    ccu.table_name AS foreign_table_name,
                    ccu.column_name AS foreign_column_name
                FROM information_schema.table_constraints tc
                LEFT JOIN information_schema.key_column_usage kcu 
                    ON tc.constraint_name = kcu.constraint_name
                LEFT JOIN information_schema.constraint_column_usage ccu 
                    ON ccu.constraint_name = tc.constraint_name
                WHERE tc.table_schema = 'public'
                AND tc.table_name = ${tableName};
            `;

            // Get indexes
            const indexes = await prisma.$queryRaw`
                SELECT 
                    i.indexname,
                    i.indexdef
                FROM pg_indexes i
                WHERE i.schemaname = 'public'
                AND i.tablename = ${tableName};
            `;

            schemaDetails[tableName] = {
                table_info: table,
                columns: columns,
                constraints: constraints,
                indexes: indexes,
                column_count: columns.length
            };

            totalColumns += columns.length;
            console.log(`   📋 ${tableName}: ${columns.length} columns, ${constraints.length} constraints, ${indexes.length} indexes`);
        }

        // Get database-level information
        const databaseInfo = await prisma.$queryRaw`
            SELECT 
                current_database() as database_name,
                current_schema() as current_schema,
                version() as postgresql_version;
        `;

        // Get Prisma migrations information if available
        let migrationsInfo = [];
        try {
            migrationsInfo = await prisma.$queryRaw`
                SELECT * FROM "_prisma_migrations" 
                ORDER BY started_at DESC;
            `;
        } catch (error) {
            console.log('   ℹ️ No Prisma migrations table found');
        }

        const completeSchema = {
            _metadata: {
                backup_type: 'COMPLETE_PRISMA_SCHEMA',
                created_at: new Date().toISOString(),
                database_info: databaseInfo[0],
                total_tables: tableInfo.length,
                total_columns: totalColumns,
                total_constraints: Object.values(schemaDetails).reduce((sum, table) => sum + table.constraints.length, 0),
                total_indexes: Object.values(schemaDetails).reduce((sum, table) => sum + table.indexes.length, 0),
                migrations_count: migrationsInfo.length,
                backup_source: 'Pre-Docker-Deployment',
                prisma_version: '6.15.0',
                node_version: process.version,
                platform: process.platform
            },
            database_info: databaseInfo[0],
            prisma_migrations: migrationsInfo,
            tables_overview: tableInfo,
            schema_details: schemaDetails
        };

        // Create backup directory if it doesn't exist
        const backupDir = './backups/docker-ready-2025-09-08';
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Save schema backup
        const schemaBackupPath = path.join(backupDir, 'docker-ready-backup-37-prisma.json');
        fs.writeFileSync(schemaBackupPath, JSON.stringify(completeSchema, null, 2));

        console.log('');
        console.log('✅ COMPLETE SCHEMA BACKUP CREATED!');
        console.log('==================================');
        console.log(`📁 Location: ${schemaBackupPath}`);
        console.log(`📊 Tables: ${completeSchema._metadata.total_tables}`);
        console.log(`📋 Columns: ${completeSchema._metadata.total_columns}`);
        console.log(`🔗 Constraints: ${completeSchema._metadata.total_constraints}`);
        console.log(`🔍 Indexes: ${completeSchema._metadata.total_indexes}`);
        console.log(`🔄 Migrations: ${completeSchema._metadata.migrations_count}`);
        console.log('');

        return schemaBackupPath;

    } catch (error) {
        console.error('❌ Schema backup failed:', error);
        throw error;
    }
}

async function main() {
    try {
        console.log('🔗 Connecting to database...');
        await prisma.$connect();
        console.log('✅ Database connected');
        console.log('');

        const schemaPath = await backupCompleteSchema();

        console.log('🎉 DOCKER-READY SCHEMA BACKUP COMPLETE!');
        console.log('=======================================');
        console.log('✅ Complete Prisma schema backed up');
        console.log('✅ All table structures preserved');
        console.log('✅ All constraints and relationships saved');
        console.log('✅ All indexes and migrations recorded');
        console.log('✅ Ready for Docker deployment');
        console.log('');
        console.log(`📁 Schema backup: ${path.basename(schemaPath)}`);

    } catch (error) {
        console.error('❌ Backup failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the schema backup
main();
