const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function reorderGroups() {
  try {
    console.log('🔄 Reordering customization groups...\n');
    
    // First, find the groups by name to get their IDs
    const sandwichSizeGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Sandwich Size' }
    });
    
    const roastBeefSizeGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Roast Beef Size' }
    });

    if (!sandwichSizeGroup || !roastBeefSizeGroup) {
      console.log('❌ Could not find one or both size groups');
      return;
    }

    console.log(`Found Sandwich Size group: ${sandwichSizeGroup.id}`);
    console.log(`Found Roast Beef Size group: ${roastBeefSizeGroup.id}\n`);

    // Set Sandwich Size to sortOrder 0 (first)
    await prisma.customizationGroup.update({
      where: { id: sandwichSizeGroup.id },
      data: { sortOrder: 0 }
    });
    console.log('✅ Sandwich Size → sortOrder: 0 (first)');

    // Set Roast Beef Size to sortOrder 1 (second)  
    await prisma.customizationGroup.update({
      where: { id: roastBeefSizeGroup.id },
      data: { sortOrder: 1 }
    });
    console.log('✅ Roast Beef Size → sortOrder: 1 (second)');

    console.log('\n🎯 New Order:');
    const updatedGroups = await prisma.customizationGroup.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { name: true, sortOrder: true }
    });

    updatedGroups.forEach((group, index) => {
      console.log(`${index + 1}. ${group.name} (sortOrder: ${group.sortOrder})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

reorderGroups();
