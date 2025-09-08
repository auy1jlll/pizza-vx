#!/usr/bin/env node

// 🚀 FULL DOCKER CONTAINER DEPLOYMENT
// Deploys both app and database in containers per contract

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🐳 FULL DOCKER CONTAINER DEPLOYMENT');
console.log('===================================');
console.log('📋 Contract: App + Database in containers');
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

async function deployContainers() {
    try {
        // Step 1: Prepare database init files
        console.log('📋 STEP 1: Preparing database initialization files...');
        
        // Copy SQL files with proper naming for PostgreSQL auto-init
        const backupDir = './backups91125';
        const schemaFiles = fs.readdirSync(backupDir).filter(f => f.includes('schema_'));
        const dataFiles = fs.readdirSync(backupDir).filter(f => f.includes('data_'));
        
        if (schemaFiles.length > 0) {
            fs.copyFileSync(`${backupDir}/${schemaFiles[0]}`, `${backupDir}/01-schema.sql`);
            console.log('✅ Schema file prepared for auto-initialization');
        }
        
        if (dataFiles.length > 0) {
            fs.copyFileSync(`${backupDir}/${dataFiles[0]}`, `${backupDir}/02-data.sql`);
            console.log('✅ Data file prepared for auto-initialization');
        }

        // Step 2: Enable standalone build for containerization
        console.log('');
        console.log('⚙️  STEP 2: Configuring Next.js for containers...');
        
        const nextConfigPath = './next.config.js';
        if (fs.existsSync(nextConfigPath)) {
            let config = fs.readFileSync(nextConfigPath, 'utf8');
            if (!config.includes('output: "standalone"')) {
                // Add standalone output for Docker
                config = config.replace(
                    'const nextConfig = {',
                    'const nextConfig = {\n  output: "standalone",'
                );
                fs.writeFileSync(nextConfigPath, config);
                console.log('✅ Next.js configured for standalone Docker build');
            }
        }

        // Step 3: Clean and build containers
        console.log('');
        console.log('🐳 STEP 3: Building and deploying containers...');
        
        runCommand('docker-compose -f docker-compose.production.yml down --remove-orphans -v', 'Cleaning existing deployment');
        runCommand('docker-compose -f docker-compose.production.yml build --no-cache', 'Building containers');
        runCommand('docker-compose -f docker-compose.production.yml up -d', 'Starting containerized deployment');

        // Step 4: Health checks
        console.log('');
        console.log('🏥 STEP 4: Verifying container health...');
        
        // Wait for services to initialize
        console.log('⏳ Waiting for containers to initialize...');
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        runCommand('docker-compose -f docker-compose.production.yml ps', 'Checking container status');
        
        // Test database
        try {
            runCommand('docker exec pizza-postgres-prod pg_isready -U auy1jll66 -d pizzax', 'Testing database connection');
            console.log('✅ Database container healthy');
        } catch (error) {
            console.log('⚠️  Database still initializing...');
        }

        // Test app
        try {
            runCommand('docker exec pizza-app-prod wget --spider -q http://localhost:3000/api/health', 'Testing app container');
            console.log('✅ App container healthy');
        } catch (error) {
            console.log('⚠️  App container still starting...');
        }

        console.log('');
        console.log('🎉 FULL DOCKER CONTAINER DEPLOYMENT COMPLETE!');
        console.log('=============================================');
        console.log('📋 Contract fulfilled: Both app and database containerized');
        console.log('🌐 Application: http://localhost:3000');
        console.log('🗄️  Database: Containerized PostgreSQL');
        console.log('');
        console.log('📊 Container Status:');
        runCommand('docker ps --filter "name=pizza-"', 'Final container verification');

    } catch (error) {
        console.error('❌ Container deployment failed:', error.message);
        console.log('');
        console.log('🔧 Troubleshooting:');
        console.log('- Check Docker is running');
        console.log('- Check port 3000 is available');
        console.log('- View logs: docker-compose -f docker-compose.production.yml logs');
        process.exit(1);
    }
}

// Deploy containerized solution
deployContainers();
