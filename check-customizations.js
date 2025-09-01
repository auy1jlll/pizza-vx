const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCustomizations() {
  try {
    // Get all customization groups to see what we have
    console.log('=== ALL CUSTOMIZATION GROUPS ===');
    const allGroups = await prisma.customizationGroup.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        _count: {
          select: {
            options: true
          }
        }
      }
    });

    allGroups.forEach(group => {
      console.log(`${group.name} (${group.type}) - ${group._count.options} options`);
    });

    console.log('\n=== GROUPS WITH "CHEESE" OR "CONDIMENT" IN NAME ===');
    // Get groups that might be related to condiments or cheese
    const groups = await prisma.customizationGroup.findMany({
      where: {
        OR: [
          { name: { contains: 'Condiment', mode: 'insensitive' } },
          { name: { contains: 'Cheese', mode: 'insensitive' } },
          { name: { equals: 'Condiments' } },
          { name: { equals: 'Cheese' } }
        ]
      },
      include: {
        options: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    for (const group of groups) {
      console.log(`=== ${group.name} Group ===`);
      console.log(`Type: ${group.type}`);
      console.log('Options:');
      for (const option of group.options) {
        console.log(`  - ${option.name}: $${option.priceModifier} (maxQty: ${option.maxQuantity || 'unlimited'})`);
      }
      console.log('');
    }

    console.log('Done!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

checkCustomizations();
