const { PrismaClient } = require('@prisma/client');

async function addPricingSettings() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Adding dynamic pricing settings...');
    
    const pricingSettings = [
      // Intensity Multipliers
      { key: 'intensityLightMultiplier', value: '0.75', type: 'NUMBER' },
      { key: 'intensityRegularMultiplier', value: '1.0', type: 'NUMBER' },
      { key: 'intensityExtraMultiplier', value: '1.5', type: 'NUMBER' },
      
      // Business Logic
      { key: 'removalCreditPercentage', value: '0.5', type: 'NUMBER' },
      { key: 'deliveryTimeBuffer', value: '10', type: 'NUMBER' }, // Extra minutes for delivery
      
      // Display Settings
      { key: 'showPricingBreakdown', value: 'true', type: 'BOOLEAN' },
      { key: 'allowRemovalCredits', value: 'true', type: 'BOOLEAN' }
    ];
    
    for (const setting of pricingSettings) {
      const existing = await prisma.appSetting.findUnique({
        where: { key: setting.key }
      });
      
      if (!existing) {
        await prisma.appSetting.create({
          data: setting
        });
        console.log(`✅ Added: ${setting.key} = ${setting.value}`);
      } else {
        console.log(`⏭️  Already exists: ${setting.key} = ${existing.value}`);
      }
    }
    
    console.log('\n📊 Current pricing settings:');
    const allSettings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: [
            'taxRate', 'deliveryFee', 'minimumOrder', 'preparationTime',
            'intensityLightMultiplier', 'intensityRegularMultiplier', 'intensityExtraMultiplier',
            'removalCreditPercentage', 'deliveryTimeBuffer'
          ]
        }
      },
      orderBy: { key: 'asc' }
    });
    
    allSettings.forEach(setting => {
      console.log(`   ${setting.key}: ${setting.value} (${setting.type})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addPricingSettings();
