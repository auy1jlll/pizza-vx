#!/usr/bin/env node

// 🔍 DEEP COMPREHENSIVE BACKUP - SCHEMA + ALL DATA
// Complete backup including all relations, categories, subcategories

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

console.log('🔍 DEEP COMPREHENSIVE BACKUP - SCHEMA + ALL DATA');
console.log('================================================');
console.log('');

async function deepSchemaBackup() {
    console.log('📋 STEP 1: Deep schema analysis with ALL relations...');
    
    try {
        // Get ALL database objects - tables, views, functions, etc.
        const allTables = await prisma.$queryRaw`
            SELECT 
                schemaname,
                tablename,
                tableowner,
                hasindexes,
                hasrules,
                hastriggers,
                rowsecurity
            FROM pg_tables 
            WHERE schemaname = 'public'
            ORDER BY tablename;
        `;

        // Get ALL columns with full details
        const allColumns = await prisma.$queryRaw`
            SELECT 
                table_name,
                column_name,
                ordinal_position,
                column_default,
                is_nullable,
                data_type,
                character_maximum_length,
                numeric_precision,
                numeric_scale,
                datetime_precision,
                is_identity,
                identity_generation,
                is_generated,
                generation_expression,
                is_updatable
            FROM information_schema.columns
            WHERE table_schema = 'public'
            ORDER BY table_name, ordinal_position;
        `;

        // Get ALL constraints including foreign keys
        const allConstraints = await prisma.$queryRaw`
            SELECT 
                tc.constraint_name,
                tc.constraint_type,
                tc.table_name,
                kcu.column_name,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name,
                rc.match_option,
                rc.update_rule,
                rc.delete_rule
            FROM information_schema.table_constraints tc
            LEFT JOIN information_schema.key_column_usage kcu 
                ON tc.constraint_name = kcu.constraint_name
            LEFT JOIN information_schema.constraint_column_usage ccu 
                ON ccu.constraint_name = tc.constraint_name
            LEFT JOIN information_schema.referential_constraints rc 
                ON tc.constraint_name = rc.constraint_name
            WHERE tc.table_schema = 'public'
            ORDER BY tc.table_name, tc.constraint_name;
        `;

        // Get ALL indexes
        const allIndexes = await prisma.$queryRaw`
            SELECT 
                schemaname,
                tablename,
                indexname,
                tablespace,
                indexdef
            FROM pg_indexes
            WHERE schemaname = 'public'
            ORDER BY tablename, indexname;
        `;

        // Get ALL sequences
        const allSequences = await prisma.$queryRaw`
            SELECT 
                sequence_schema,
                sequence_name,
                data_type,
                numeric_precision,
                numeric_precision_radix,
                numeric_scale,
                start_value,
                minimum_value,
                maximum_value,
                increment,
                cycle_option
            FROM information_schema.sequences
            WHERE sequence_schema = 'public';
        `;

        // Get ALL views
        const allViews = await prisma.$queryRaw`
            SELECT 
                table_schema,
                table_name,
                view_definition,
                check_option,
                is_updatable,
                is_insertable_into,
                is_trigger_updatable,
                is_trigger_deletable,
                is_trigger_insertable_into
            FROM information_schema.views
            WHERE table_schema = 'public';
        `;

        console.log(`✅ Found ${allTables.length} tables`);
        console.log(`✅ Found ${allColumns.length} columns`);
        console.log(`✅ Found ${allConstraints.length} constraints`);
        console.log(`✅ Found ${allIndexes.length} indexes`);
        console.log(`✅ Found ${allSequences.length} sequences`);
        console.log(`✅ Found ${allViews.length} views`);

        const deepSchema = {
            _metadata: {
                backup_type: 'DEEP_COMPREHENSIVE_SCHEMA',
                created_at: new Date().toISOString(),
                database_analysis: {
                    total_tables: allTables.length,
                    total_columns: allColumns.length,
                    total_constraints: allConstraints.length,
                    total_indexes: allIndexes.length,
                    total_sequences: allSequences.length,
                    total_views: allViews.length
                },
                backup_source: 'Deep-Pre-Docker-Deployment',
                prisma_version: '6.15.0'
            },
            tables: allTables,
            columns: allColumns,
            constraints: allConstraints,
            indexes: allIndexes,
            sequences: allSequences,
            views: allViews
        };

        return deepSchema;

    } catch (error) {
        console.error('❌ Deep schema backup failed:', error);
        throw error;
    }
}

async function deepDataBackup() {
    console.log('');
    console.log('📊 STEP 2: Deep data backup with ALL relations and categories...');
    
    try {
        // Get ALL Prisma models dynamically
        const allModels = Object.keys(prisma).filter(key => 
            typeof prisma[key] === 'object' && 
            prisma[key].findMany && 
            !key.startsWith('$') && 
            !key.startsWith('_')
        );

        console.log(`✅ Found ${allModels.length} Prisma models to backup`);

        const deepDataBackup = {
            _metadata: {
                backup_type: 'DEEP_COMPREHENSIVE_DATA',
                created_at: new Date().toISOString(),
                total_models: allModels.length,
                total_records: 0,
                successful_models: 0,
                failed_models: 0,
                models_with_data: 0,
                empty_models: 0,
                backup_source: 'Deep-Pre-Docker-Deployment',
                model_details: []
            }
        };

        let totalRecords = 0;

        // Backup each model with deep relations
        for (const modelName of allModels) {
            try {
                console.log(`   🔍 Processing ${modelName}...`);
                
                // Get data with all possible includes/relations
                let data;
                try {
                    // Try to get data with deep relations first
                    data = await prisma[modelName].findMany({
                        include: await generateDeepInclude(modelName)
                    });
                } catch (includeError) {
                    // If deep relations fail, get basic data
                    console.log(`     ⚠️ Deep relations failed for ${modelName}, using basic query`);
                    data = await prisma[modelName].findMany();
                }
                
                // Use proper capitalized name
                const properName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
                
                deepDataBackup[properName] = data;
                deepDataBackup._metadata.successful_models++;
                totalRecords += data.length;
                
                const modelDetail = {
                    model: properName,
                    record_count: data.length,
                    has_data: data.length > 0,
                    sample_fields: data.length > 0 ? Object.keys(data[0]) : []
                };
                
                deepDataBackup._metadata.model_details.push(modelDetail);
                
                if (data.length > 0) {
                    deepDataBackup._metadata.models_with_data++;
                    console.log(`   ✅ ${properName}: ${data.length} records with ${modelDetail.sample_fields.length} fields`);
                } else {
                    deepDataBackup._metadata.empty_models++;
                    console.log(`   📭 ${properName}: Empty table`);
                }
                
            } catch (error) {
                console.log(`   ❌ ${modelName}: Failed - ${error.message}`);
                deepDataBackup._metadata.failed_models++;
            }
        }

        deepDataBackup._metadata.total_records = totalRecords;

        return deepDataBackup;

    } catch (error) {
        console.error('❌ Deep data backup failed:', error);
        throw error;
    }
}

async function generateDeepInclude(modelName) {
    // Try to generate includes for common relations
    const commonIncludes = {};
    
    try {
        // This is a simplified approach - in reality, we'd need to analyze the Prisma schema
        // For now, we'll just try basic relations and catch errors
        switch (modelName.toLowerCase()) {
            case 'menuitem':
                return {
                    category: true,
                    customizations: true,
                    modifiers: true
                };
            case 'order':
                return {
                    items: {
                        include: {
                            toppings: true,
                            customizations: true
                        }
                    },
                    customer: true
                };
            case 'user':
                return {
                    employeeProfile: true,
                    customerProfile: true
                };
            default:
                return {};
        }
    } catch (error) {
        return {};
    }
}

async function main() {
    try {
        console.log('🔗 Connecting to database...');
        await prisma.$connect();
        console.log('✅ Database connected');
        console.log('');

        // Create backup directory
        const backupDir = './backups/deep-comprehensive-2025-09-08';
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Deep schema backup
        const schemaData = await deepSchemaBackup();
        const schemaPath = path.join(backupDir, 'DEEP-SCHEMA-BACKUP.json');
        fs.writeFileSync(schemaPath, JSON.stringify(schemaData, null, 2));

        // Deep data backup  
        const dataBackup = await deepDataBackup();
        const dataPath = path.join(backupDir, 'DEEP-DATA-BACKUP.json');
        fs.writeFileSync(dataPath, JSON.stringify(dataBackup, null, 2));

        console.log('');
        console.log('🎉 DEEP COMPREHENSIVE BACKUP COMPLETE!');
        console.log('======================================');
        console.log(`📋 Schema backup: ${path.basename(schemaPath)}`);
        console.log(`📊 Data backup: ${path.basename(dataPath)}`);
        console.log(`🔍 Total models: ${dataBackup._metadata.total_models}`);
        console.log(`📈 Total records: ${dataBackup._metadata.total_records}`);
        console.log(`✅ Models with data: ${dataBackup._metadata.models_with_data}`);
        console.log(`📭 Empty models: ${dataBackup._metadata.empty_models}`);
        console.log(`❌ Failed models: ${dataBackup._metadata.failed_models}`);

        console.log('');
        console.log('📊 DETAILED MODEL BREAKDOWN:');
        console.log('============================');
        dataBackup._metadata.model_details
            .filter(detail => detail.has_data)
            .forEach(detail => {
                console.log(`   ✅ ${detail.model}: ${detail.record_count} records (${detail.sample_fields.length} fields)`);
            });

    } catch (error) {
        console.error('❌ Deep backup failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the deep comprehensive backup
main();
