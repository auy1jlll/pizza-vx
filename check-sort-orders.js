const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSortOrders() {
  try {
    console.log('🔍 Current Customization Groups Sort Orders:\n');
    
    const groups = await prisma.customizationGroup.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        sortOrder: true,
        type: true,
        isActive: true
      }
    });

    groups.forEach((group, index) => {
      console.log(`${index + 1}. ${group.name}`);
      console.log(`   Sort Order: ${group.sortOrder}`);
      console.log(`   Type: ${group.type}`);
      console.log(`   Active: ${group.isActive}`);
      console.log('');
    });

    console.log('💡 To reorder:');
    console.log('1. Lower sort orders appear first');
    console.log('2. Edit the group and change its sort order');
    console.log('3. For sandwich size to appear first, give it sortOrder: 0 or 1');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSortOrders();
