const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixApiDataMapping() {
  console.log('🔧 Fixing API Data Mapping Issues');
  console.log('==================================');
  
  try {
    // Check current database keys vs expected API keys
    const allSettings = await prisma.appSetting.findMany({
      orderBy: { key: 'asc' }
    });
    
    console.log('📊 Current Database Keys:');
    allSettings.forEach(setting => {
      console.log(`   ${setting.key}: ${setting.value}`);
    });
    
    // Test what the API returns
    console.log('\n🧪 Testing API Response...');
    
    try {
      const fetch = require('node-fetch');
      const response = await fetch('http://localhost:3007/api/settings');
      const data = await response.json();
      
      console.log('📤 API Settings Response:');
      console.log(`   business_name: ${data.settings.business_name}`);
      console.log(`   business_phone: ${data.settings.business_phone}`);
      console.log(`   business_address: ${data.settings.business_address}`);
      
      // Check if it's using fallback data
      if (data.settings.business_name === 'Restaurant') {
        console.log('\n❌ PROBLEM IDENTIFIED: API is returning default fallback data');
        console.log('   This means the key mapping in the API is not working correctly');
        
        // Check specific mapping issues
        const businessNameInDB = await prisma.appSetting.findFirst({
          where: { key: 'businessName' }
        });
        
        const businessNameInDB2 = await prisma.appSetting.findFirst({
          where: { key: 'business_name' }
        });
        
        console.log('\n🔍 Key Analysis:');
        console.log(`   businessName in DB: ${businessNameInDB ? businessNameInDB.value : 'NOT FOUND'}`);
        console.log(`   business_name in DB: ${businessNameInDB2 ? businessNameInDB2.value : 'NOT FOUND'}`);
        
        // The fix: The database has keys that don't match the API expectations
        console.log('\n💡 Solution: Create missing key mappings or update database keys');
        
        // Create the missing mapped keys based on the existing data
        const keyMappings = [
          { dbKey: 'businessName', apiKey: 'business_name' },
          { dbKey: 'businessPhone', apiKey: 'business_phone' },
          { dbKey: 'businessAddress', apiKey: 'business_address' },
          { dbKey: 'businessEmail', apiKey: 'business_email' },
          { dbKey: 'businessSlogan', apiKey: 'business_slogan' },
          { dbKey: 'app_name', apiKey: 'app_name' },
          { dbKey: 'app_tagline', apiKey: 'app_tagline' }
        ];
        
        console.log('\n🔄 Creating proper key mappings...');
        
        for (const mapping of keyMappings) {
          const existingDbSetting = await prisma.appSetting.findFirst({
            where: { key: mapping.dbKey }
          });
          
          const existingApiSetting = await prisma.appSetting.findFirst({
            where: { key: mapping.apiKey }
          });
          
          if (existingDbSetting && !existingApiSetting) {
            // Create the API-expected key with the same value
            await prisma.appSetting.create({
              data: {
                key: mapping.apiKey,
                value: existingDbSetting.value,
                type: existingDbSetting.type,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            });
            console.log(`   ✅ Created ${mapping.apiKey} from ${mapping.dbKey}`);
          }
        }
        
        // Also ensure we have the main app name
        const appNameSetting = await prisma.appSetting.findFirst({
          where: { key: 'app_name' }
        });
        
        if (!appNameSetting) {
          const businessName = await prisma.appSetting.findFirst({
            where: { key: 'businessName' }
          });
          
          if (businessName) {
            await prisma.appSetting.create({
              data: {
                key: 'app_name',
                value: businessName.value,
                type: 'STRING',
                createdAt: new Date(),
                updatedAt: new Date()
              }
            });
            console.log(`   ✅ Created app_name from businessName`);
          }
        }
        
        console.log('\n🎉 Key mapping fixes applied!');
        console.log('🔄 The API should now return your restaurant data instead of fallback defaults');
        
      } else {
        console.log('\n✅ API is correctly returning your restaurant data');
        console.log(`   Restaurant: ${data.settings.business_name}`);
      }
      
    } catch (apiError) {
      console.log('\n⚠️ Could not test API (server may not be running)');
      console.log('   Manual fix: Check if server is running on http://localhost:3007');
    }
    
  } catch (error) {
    console.error('❌ Error fixing API mapping:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
if (require.main === module) {
  fixApiDataMapping().catch(console.error);
}

module.exports = { fixApiDataMapping };