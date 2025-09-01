const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setCorrectBusinessName() {
  try {
    console.log('🔄 Setting correct business name to "Greenland Famous Pizza"...');
    
    // Update the businessName setting
    await prisma.appSetting.update({
      where: { key: 'businessName' },
      data: { value: 'Greenland Famous Pizza' }
    });
    console.log('✅ Updated businessName to "Greenland Famous Pizza"');
    
    // Check if business_name exists and update it too
    const businessNameUnderscore = await prisma.appSetting.findUnique({
      where: { key: 'business_name' }
    });
    
    if (businessNameUnderscore) {
      await prisma.appSetting.update({
        where: { key: 'business_name' },
        data: { value: 'Greenland Famous Pizza' }
      });
      console.log('✅ Updated business_name to "Greenland Famous Pizza"');
    } else {
      // Create business_name setting if it doesn't exist
      await prisma.appSetting.create({
        data: {
          key: 'business_name',
          value: 'Greenland Famous Pizza',
          type: 'STRING'
        }
      });
      console.log('✅ Created business_name with "Greenland Famous Pizza"');
    }
    
    // Also check and update app_name if it exists
    const appName = await prisma.appSetting.findUnique({
      where: { key: 'app_name' }
    });
    
    if (appName) {
      await prisma.appSetting.update({
        where: { key: 'app_name' },
        data: { value: 'Greenland Famous Pizza' }
      });
      console.log('✅ Updated app_name to "Greenland Famous Pizza"');
    }
    
    // Verify the changes
    console.log('\n✅ Verifying changes...');
    const updatedSettings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: ['businessName', 'business_name', 'app_name']
        }
      }
    });
    
    console.log('Updated business name settings:');
    updatedSettings.forEach(setting => {
      console.log(`  ${setting.key}: "${setting.value}"`);
    });
    
    console.log('\n🎉 Business name update completed successfully!');
    console.log('The navigation should now show "Greenland Famous Pizza"');
    console.log('Please refresh your browser to see the changes.');
    
  } catch (error) {
    console.error('❌ Error updating business name:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setCorrectBusinessName();
