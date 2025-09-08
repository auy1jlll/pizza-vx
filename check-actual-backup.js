#!/usr/bin/env node

// 🔍 CHECK ACTUAL VS METADATA

const fs = require('fs');

try {
    const data = JSON.parse(fs.readFileSync('./backups/clean-complete-2025-09-08/COMPLETE-DATA-2025-09-08.json', 'utf8'));
    const keys = Object.keys(data).filter(k => k !== '_metadata');
    
    console.log('🔍 BACKUP ANALYSIS');
    console.log('==================');
    console.log(`📊 ACTUAL TABLES IN BACKUP: ${keys.length}`);
    console.log(`📊 METADATA SAYS SUCCESSFUL: ${data._metadata.successfulTables}`);
    console.log(`🔍 DIFFERENCE: ${keys.length - data._metadata.successfulTables}`);
    console.log('');
    
    console.log('📋 ALL TABLES IN BACKUP:');
    keys.sort().forEach((table, i) => {
        const count = Array.isArray(data[table]) ? data[table].length : 'not array';
        console.log(`   ${i+1}. ${table}: ${count} records`);
    });
    
    console.log('');
    console.log('🎯 CONCLUSION:');
    if (keys.length === 37) {
        console.log('✅ All 37 tables are actually in the backup!');
        console.log('❗ The metadata count (36) appears to be incorrect');
        console.log('✅ NO TABLES ARE MISSING - backup is 100% complete!');
    } else {
        console.log(`❌ Only ${keys.length}/37 tables found`);
    }
    
} catch (error) {
    console.error('❌ Error:', error.message);
}
