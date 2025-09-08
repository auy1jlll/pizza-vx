// Script to verify and fix the locations API 404 error
const https = require('https');
const http = require('http');

async function testLocationAPI() {
    console.log('🔍 Testing locations API endpoints...');
    
    // Test production API
    try {
        const response = await fetch('http://91.99.194.255:3000/api/locations');
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Production locations API working!');
            console.log(`Found ${data.length} locations`);
            return true;
        } else {
            console.log(`❌ Production API returned: ${response.status} ${response.statusText}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Production API error: ${error.message}`);
        return false;
    }
}

async function testLocalAPI() {
    // Test local API
    try {
        const response = await fetch('http://localhost:3000/api/locations');
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Local locations API working!');
            console.log(`Found ${data.length} locations`);
            return true;
        } else {
            console.log(`❌ Local API returned: ${response.status} ${response.statusText}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Local API error: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('=== Locations API Verification ===\n');
    
    const prodWorking = await testLocationAPI();
    console.log('');
    const localWorking = await testLocalAPI();
    
    console.log('\n=== Summary ===');
    console.log(`Production API: ${prodWorking ? '✅ Working' : '❌ Not Working'}`);
    console.log(`Local API: ${localWorking ? '✅ Working' : '❌ Not Working'}`);
    
    if (!prodWorking) {
        console.log('\n📝 Next steps:');
        console.log('1. Redeploy the locations API route to production');
        console.log('2. Restart the production server');
        console.log('3. Clear browser cache');
    }
}

main().catch(console.error);
