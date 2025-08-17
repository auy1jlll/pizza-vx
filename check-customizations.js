const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCustomizations() {
  try {
    console.log('🔍 Checking customization groups...');
    const groups = await prisma.customizationGroup.findMany({
      include: {
        options: true
      }
    });
    
    console.log('📋 Available customization groups:');
    groups.forEach(group => {
      console.log(`- ${group.name} (ID: ${group.id})`);
      group.options.forEach(option => {
        console.log(`  • ${option.name} (ID: ${option.id}) - Price: $${option.price}`);
      });
    });
    
    console.log(`\n📊 Total groups: ${groups.length}`);
    console.log(`📊 Total options: ${groups.reduce((sum, g) => sum + g.options.length, 0)}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCustomizations();
