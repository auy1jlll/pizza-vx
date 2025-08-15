const { PrismaClient } = require('@prisma/client');

async function checkSettings() {
  const prisma = new PrismaClient();
  
  try {
    const settings = await prisma.appSetting.findMany({
      where: { key: { in: ['taxRate', 'deliveryFee', 'minimumOrder'] } }
    });
    
    console.log('🔧 Current app settings:');
    settings.forEach(setting => {
      console.log(`   ${setting.key}: ${setting.value}`);
    });
    
    if (settings.length === 0) {
      console.log('❌ No settings found in database');
    }
    
    // Also check default values used in OrderService
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    
    const taxRate = (parseFloat(settingsMap.taxRate || '8.25')) / 100;
    const deliveryFeeAmount = parseFloat(settingsMap.deliveryFee || '3.99');
    const minimumOrderAmount = parseFloat(settingsMap.minimumOrder || '15.00');
    
    console.log('\n📊 Calculated values used in backend:');
    console.log(`   Tax Rate: ${(taxRate * 100).toFixed(2)}%`);
    console.log(`   Delivery Fee: $${deliveryFeeAmount.toFixed(2)}`);
    console.log(`   Minimum Order: $${minimumOrderAmount.toFixed(2)}`);
    
    console.log('\n🎯 CheckoutModal hardcoded values:');
    console.log('   Tax Rate: 8.75%');
    console.log('   Delivery Fee: $3.99');
    console.log('   Minimum Order: $25.00');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSettings();
