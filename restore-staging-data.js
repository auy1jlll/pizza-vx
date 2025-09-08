#!/usr/bin/env node

// 🔄 QUICK DATA RESTORE FOR STAGING
// Ensures proper data is loaded into staging container

const { execSync } = require('child_process');

console.log('🔄 QUICK STAGING DATA RESTORE');
console.log('=============================');

function runCommand(command, description) {
    console.log(`🔄 ${description}...`);
    try {
        const result = execSync(command, { encoding: 'utf8' });
        console.log(`✅ ${description} completed`);
        return result;
    } catch (error) {
        console.error(`❌ ${description} failed:`, error.message);
        throw error;
    }
}

async function restoreData() {
    try {
        // Wait for database to be ready
        console.log('⏳ Waiting for database to be ready...');
        let retries = 30;
        while (retries > 0) {
            try {
                runCommand('docker exec pizza-staging-db pg_isready -U auy1jll66 -d pizzax', 'Checking database readiness');
                break;
            } catch (error) {
                retries--;
                if (retries === 0) throw error;
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        // Apply schema and data if not already applied
        console.log('📊 Checking if data needs to be restored...');
        
        try {
            const tableCheck = runCommand(
                'docker exec pizza-staging-db psql -U auy1jll66 -d pizzax -c "SELECT COUNT(*) FROM menu_items;"',
                'Checking existing data'
            );
            
            if (tableCheck.includes('105') || tableCheck.includes('menu_items')) {
                console.log('✅ Data already exists in staging database');
                return;
            }
        } catch (error) {
            console.log('📋 No existing data found, proceeding with restore...');
        }

        // Restore schema first
        const schemaFile = 'schema_pizzax_2025-09-08_20-51-59.sql';
        const dataFile = 'data_pizzax_2025-09-08_20-52-00.sql';

        runCommand(
            `docker exec -i pizza-staging-db psql -U auy1jll66 -d pizzax < ./backups91125/${schemaFile}`,
            'Restoring database schema'
        );

        runCommand(
            `docker exec -i pizza-staging-db psql -U auy1jll66 -d pizzax < ./backups91125/${dataFile}`,
            'Restoring database data'
        );

        // Verify data
        const verification = runCommand(
            'docker exec pizza-staging-db psql -U auy1jll66 -d pizzax -c "SELECT COUNT(*) as menu_items FROM menu_items; SELECT COUNT(*) as app_settings FROM app_settings;"',
            'Verifying data restore'
        );

        console.log('');
        console.log('✅ STAGING DATA RESTORE COMPLETE!');
        console.log('=================================');
        console.log('📊 Database verification:', verification);

    } catch (error) {
        console.error('❌ Data restore failed:', error.message);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    restoreData();
}

module.exports = { restoreData };
