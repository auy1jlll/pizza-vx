const { PrismaClient } = require('@prisma/client');

async function addRateLimitSettings() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Adding rate limiting and system configuration settings...');
    
    const systemSettings = [
      // General API Rate Limiting
      { 
        key: 'rateLimitWindowSeconds', 
        value: '900', // 15 minutes in seconds
        type: 'NUMBER',
        description: 'General API rate limit window duration (seconds)'
      },
      { 
        key: 'rateLimitMaxRequests', 
        value: '100', 
        type: 'NUMBER',
        description: 'Maximum requests per general rate limit window'
      },
      
      // Admin/Kitchen Display Rate Limiting
      { 
        key: 'adminRateLimitWindowSeconds', 
        value: '900', // 15 minutes in seconds
        type: 'NUMBER',
        description: 'Admin endpoints rate limit window duration (seconds)'
      },
      { 
        key: 'adminRateLimitMaxRequests', 
        value: '200', 
        type: 'NUMBER',
        description: 'Maximum admin requests per rate limit window'
      },
      
      // Kitchen Display Polling
      { 
        key: 'kitchenPollingIntervalSeconds', 
        value: '35', 
        type: 'NUMBER',
        description: 'Kitchen display order refresh interval (seconds)'
      }
    ];
    
    for (const setting of systemSettings) {
      const existing = await prisma.appSetting.findUnique({
        where: { key: setting.key }
      });
      
      if (!existing) {
        await prisma.appSetting.create({
          data: {
            key: setting.key,
            value: setting.value,
            type: setting.type
          }
        });
        console.log(`✅ Added: ${setting.key} = ${setting.value} seconds`);
      } else {
        console.log(`⏭️  Already exists: ${setting.key} = ${existing.value} seconds`);
      }
    }
    
    console.log('\n📊 Current system configuration settings:');
    const systemConfigSettings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: [
            'rateLimitWindowSeconds', 'rateLimitMaxRequests', 
            'adminRateLimitWindowSeconds', 'adminRateLimitMaxRequests',
            'kitchenPollingIntervalSeconds'
          ]
        }
      },
      orderBy: { key: 'asc' }
    });
    
    systemConfigSettings.forEach(setting => {
      const displayValue = setting.key.includes('Seconds') 
        ? `${setting.value} seconds (${Math.round(parseInt(setting.value) / 60)} minutes)`
        : setting.value;
      console.log(`   ${setting.key}: ${displayValue}`);
    });
    
    console.log('\n✅ System configuration settings added successfully!');
    console.log('\n🛡️ Rate Limiting Configuration:');
    console.log('   • General API: 100 requests per 15 minutes');
    console.log('   • Admin/Kitchen: 200 requests per 15 minutes');
    console.log('   • Kitchen Polling: Every 35 seconds');
    console.log('\n⚠️  Warning: These are advanced technical settings.');
    console.log('   Only modify if you understand rate limiting and system performance.');

  } catch (error) {
    console.error('❌ Error adding system settings:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addRateLimitSettings();
