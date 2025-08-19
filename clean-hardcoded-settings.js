const { PrismaClient } = require('@prisma/client');

async function checkAndCleanSettings() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking current app settings...');
    
    // Get all settings
    const settings = await prisma.appSetting.findMany();
    
    console.log('\n📋 All Current Settings:');
    settings.forEach(setting => {
      console.log(`  ${setting.key}: "${setting.value}"`);
    });
    
    // Check for hardcoded values
    const problematicSettings = settings.filter(s => 
      s.value === 'Greenland Famous' || 
      s.value === 'Pizza Builder Pro'
    );
    
    if (problematicSettings.length > 0) {
      console.log('\n⚠️  Found hardcoded values that need to be removed:');
      problematicSettings.forEach(setting => {
        console.log(`  ${setting.key}: "${setting.value}" ❌`);
      });
      
      console.log('\n🔄 Removing hardcoded values...');
      for (const setting of problematicSettings) {
        await prisma.appSetting.delete({
          where: { key: setting.key }
        });
        console.log(`  ✅ Removed ${setting.key}`);
      }
      
      console.log('\n✅ Cleanup complete! You can now set your preferred values in admin settings.');
    } else {
      console.log('\n✅ No hardcoded values found.');
    }
    
    // Show final state
    const finalSettings = await prisma.appSetting.findMany();
    console.log('\n📋 Settings after cleanup:');
    finalSettings.forEach(setting => {
      console.log(`  ${setting.key}: "${setting.value}"`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndCleanSettings();
