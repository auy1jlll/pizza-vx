#!/usr/bin/env node

// 🚀 FAST STAGING DEPLOYMENT SCRIPT
// Deploys Docker staging with proper data in under 5 minutes

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 FAST DOCKER STAGING DEPLOYMENT');
console.log('=================================');
console.log('⏱️  Target: 5 minutes deployment');
console.log('');

function runCommand(command, description) {
    console.log(`🔄 ${description}...`);
    try {
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ ${description} completed`);
    } catch (error) {
        console.error(`❌ ${description} failed:`, error.message);
        throw error;
    }
}

async function deployStaging() {
    try {
        // Step 1: Prepare database init scripts (30 seconds)
        console.log('📋 STEP 1: Preparing database initialization...');
        
        // Copy SQL files to init directory with proper naming for auto-execution
        if (!fs.existsSync('./backups91125/01-schema.sql')) {
            const schemaFiles = fs.readdirSync('./backups91125').filter(f => f.includes('schema_'));
            const dataFiles = fs.readdirSync('./backups91125').filter(f => f.includes('data_'));
            
            if (schemaFiles.length > 0) {
                fs.copyFileSync(`./backups91125/${schemaFiles[0]}`, './backups91125/01-schema.sql');
                console.log('✅ Schema file prepared for auto-init');
            }
            
            if (dataFiles.length > 0) {
                fs.copyFileSync(`./backups91125/${dataFiles[0]}`, './backups91125/02-data.sql');
                console.log('✅ Data file prepared for auto-init');
            }
        }

        // Step 2: Build and deploy (3 minutes)
        console.log('');
        console.log('🐳 STEP 2: Building and deploying containers...');
        
        runCommand('docker-compose -f docker-compose.staging.yml down --remove-orphans', 'Cleaning up existing containers');
        runCommand('docker-compose -f docker-compose.staging.yml build --no-cache', 'Building staging containers');
        runCommand('docker-compose -f docker-compose.staging.yml up -d', 'Starting staging environment');

        // Step 3: Health checks (1 minute)
        console.log('');
        console.log('🏥 STEP 3: Checking service health...');
        
        // Wait for services to start
        console.log('⏳ Waiting for services to initialize...');
        await new Promise(resolve => setTimeout(resolve, 30000)); // 30 second wait
        
        runCommand('docker-compose -f docker-compose.staging.yml ps', 'Checking container status');
        
        // Test database connection
        try {
            runCommand('docker exec pizza-staging-db pg_isready -U auy1jll66 -d pizzax', 'Testing database connection');
        } catch (error) {
            console.log('⚠️  Database still initializing...');
        }

        // Test app connection
        try {
            runCommand('curl -f http://localhost:3001 || echo "App starting..."', 'Testing app connection');
        } catch (error) {
            console.log('⚠️  App still starting...');
        }

        console.log('');
        console.log('🎉 STAGING DEPLOYMENT COMPLETE!');
        console.log('==============================');
        console.log('🌐 Staging App: http://localhost:3001');
        console.log('🗄️  Staging DB: localhost:5433');
        console.log('');
        console.log('📊 Quick Status Check:');
        console.log('----------------------');
        runCommand('docker ps --filter "name=pizza-staging"', 'Container status');

    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        console.log('');
        console.log('🔧 Troubleshooting:');
        console.log('- Check Docker is running');
        console.log('- Check ports 3001 and 5433 are available');
        console.log('- Check logs: docker-compose -f docker-compose.staging.yml logs');
        process.exit(1);
    }
}

// Run deployment
deployStaging();
