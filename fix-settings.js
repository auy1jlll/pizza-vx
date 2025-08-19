const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixSettings() {
  console.log('🔧 Fixing problematic settings...');

  // Fix the truncated business_name
  await prisma.appSetting.update({
    where: { key: 'businessName' },
    data: { value: 'Omar Pizza' }
  });
  console.log('✅ Fixed businessName');

  // Fix empty contact info
  await prisma.appSetting.update({
    where: { key: 'businessEmail' },
    data: { value: 'orders@omarpizza.com' }
  });
  console.log('✅ Fixed businessEmail');

  await prisma.appSetting.update({
    where: { key: 'businessPhone' },
    data: { value: '(555) 123-PIZZA' }
  });
  console.log('✅ Fixed businessPhone');

  await prisma.appSetting.update({
    where: { key: 'businessAddress' },
    data: { value: '123 Pizza Street' }
  });
  console.log('✅ Fixed businessAddress');

  // Remove old duplicate keys (keep the underscore versions)
  const duplicatesToRemove = [
    'businessName', 'businessEmail', 'businessPhone', 'businessAddress',
    'minimumOrder', 'deliveryFee', 'taxRate', 'preparationTime'
  ];

  for (const key of duplicatesToRemove) {
    try {
      await prisma.appSetting.delete({
        where: { key }
      });
      console.log(`🗑️  Removed duplicate: ${key}`);
    } catch (error) {
      console.log(`⚠️  Could not remove ${key}: ${error.message}`);
    }
  }

  console.log('\n✨ Settings cleanup complete!');
  
  // Verify final count
  const finalCount = await prisma.appSetting.count();
  console.log(`📊 Final settings count: ${finalCount}`);
  
  await prisma.$disconnect();
}

fixSettings().catch(console.error);
