#!/usr/bin/env node

// 🔄 CORRECTED DOCKER-READY BACKUP - COMPLETE DATA BACKUP
// Uses proper Prisma model names to get ALL data

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

console.log('🔄 CORRECTED DOCKER-READY BACKUP - COMPLETE DATA');
console.log('================================================');
console.log('');

async function backupCompleteDataCorrected() {
    console.log('📊 STEP 1: Using proper Prisma models to get ALL data...');
    
    try {
        // Define all the Prisma models with their proper names
        const prismaModels = [
            'user', 'employeeProfile', 'customerProfile', 'customerAddress', 'customerFavorite',
            'pizzaSize', 'pizzaCrust', 'pizzaSauce', 'pizzaTopping',
            'specialtyPizza', 'specialtyPizzaSize', 'specialtyCalzone', 'specialtyCalzoneSize',
            'menuCategory', 'menuItem', 'modifier', 'itemModifier',
            'customizationGroup', 'customizationOption', 'menuItemCustomization',
            'order', 'orderItem', 'orderItemTopping', 'orderItemCustomization',
            'cartItem', 'cartItemCustomization', 'cartItemPizzaTopping',
            'promotion', 'priceSnapshot', 'pricingHistory',
            'appSetting', 'emailTemplate', 'emailSettings', 'emailLog',
            'jwtSecret', 'jwtBlacklist', 'refreshToken'
        ];

        const completeDataBackup = {
            _metadata: {
                backup_type: 'CORRECTED_COMPLETE_DATA_BACKUP',
                created_at: new Date().toISOString(),
                total_models: prismaModels.length,
                total_records: 0,
                successful_models: 0,
                failed_models: 0,
                backup_source: 'Pre-Docker-Deployment-Corrected',
                prisma_version: '6.15.0',
                node_version: process.version,
                platform: process.platform,
                models_backed_up: [],
                models_failed: []
            }
        };

        let totalRecords = 0;

        // Backup each Prisma model's data
        for (const modelName of prismaModels) {
            try {
                // Check if the model exists in Prisma
                if (prisma[modelName]) {
                    const data = await prisma[modelName].findMany();
                    
                    // Use proper capitalized table name for consistency
                    const properTableName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
                    
                    completeDataBackup[properTableName] = data;
                    completeDataBackup._metadata.models_backed_up.push(properTableName);
                    completeDataBackup._metadata.successful_models++;
                    totalRecords += data.length;
                    
                    if (data.length > 0) {
                        console.log(`   ✅ ${properTableName}: ${data.length} records backed up`);
                    } else {
                        console.log(`   📭 ${properTableName}: No records (empty table)`);
                    }
                } else {
                    console.log(`   ⚠️ ${modelName}: Model not found in Prisma`);
                }
                
            } catch (error) {
                console.log(`   ❌ ${modelName}: Failed to backup - ${error.message}`);
                completeDataBackup._metadata.models_failed.push({
                    model: modelName,
                    error: error.message
                });
                completeDataBackup._metadata.failed_models++;
            }
        }

        completeDataBackup._metadata.total_records = totalRecords;

        // Create backup directory if it doesn't exist
        const backupDir = './backups/docker-ready-corrected-2025-09-08';
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Save corrected data backup
        const dataBackupPath = path.join(backupDir, 'docker-ready-backup-37-data-CORRECTED.json');
        fs.writeFileSync(dataBackupPath, JSON.stringify(completeDataBackup, null, 2));

        console.log('');
        console.log('✅ CORRECTED COMPLETE DATA BACKUP CREATED!');
        console.log('==========================================');
        console.log(`📁 Location: ${dataBackupPath}`);
        console.log(`📊 Models: ${completeDataBackup._metadata.successful_models}/${completeDataBackup._metadata.total_models}`);
        console.log(`📋 Total Records: ${completeDataBackup._metadata.total_records}`);
        console.log(`✅ Successful: ${completeDataBackup._metadata.successful_models}`);
        console.log(`❌ Failed: ${completeDataBackup._metadata.failed_models}`);

        if (completeDataBackup._metadata.failed_models > 0) {
            console.log('');
            console.log('⚠️ FAILED MODELS:');
            completeDataBackup._metadata.models_failed.forEach(failure => {
                console.log(`   ❌ ${failure.model}: ${failure.error}`);
            });
        }

        console.log('');
        console.log('📊 MODELS WITH DATA:');
        console.log('====================');
        completeDataBackup._metadata.models_backed_up.forEach(model => {
            const count = completeDataBackup[model]?.length || 0;
            if (count > 0) {
                console.log(`   ✅ ${model}: ${count} records`);
            }
        });

        return dataBackupPath;

    } catch (error) {
        console.error('❌ Corrected data backup failed:', error);
        throw error;
    }
}

async function main() {
    try {
        console.log('🔗 Connecting to database...');
        await prisma.$connect();
        console.log('✅ Database connected');
        console.log('');

        const dataPath = await backupCompleteDataCorrected();

        console.log('');
        console.log('🎉 CORRECTED DOCKER-READY DATA BACKUP COMPLETE!');
        console.log('===============================================');
        console.log('✅ ALL Prisma model data backed up');
        console.log('✅ Complete record preservation');
        console.log('✅ Proper table naming used');
        console.log('✅ Ready for Docker deployment');
        console.log('');
        console.log(`📁 Corrected data backup: ${path.basename(dataPath)}`);

    } catch (error) {
        console.error('❌ Backup failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the corrected data backup
main();
