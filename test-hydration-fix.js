const { PrismaClient } = require('@prisma/client');

async function testHydrationFix() {
  console.log('🧪 Testing hydration fix...');
  
  try {
    // Test the settings API
    const response = await fetch('http://localhost:3005/api/admin/settings');
    const data = await response.json();
    
    console.log('✅ API Response received');
    console.log('App Name:', data.settings.app_name);
    console.log('Business Name:', data.settings.business_name);
    
    // Test that the values match what we expect for SSR
    const expectedName = 'Omar Pizza';
    const actualAppName = data.settings.app_name;
    const actualBusinessName = data.settings.business_name;
    
    if (actualAppName === expectedName && actualBusinessName === expectedName) {
      console.log('✅ SSR/Client names match - hydration should work!');
    } else {
      console.log('⚠️  Potential hydration mismatch:');
      console.log(`   Expected: "${expectedName}"`);
      console.log(`   App Name: "${actualAppName}"`);
      console.log(`   Business Name: "${actualBusinessName}"`);
    }
    
    // Test homepage
    console.log('\n🌐 Testing homepage...');
    const homeResponse = await fetch('http://localhost:3005');
    if (homeResponse.ok) {
      console.log('✅ Homepage loads successfully');
    } else {
      console.log('❌ Homepage failed to load');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testHydrationFix();
