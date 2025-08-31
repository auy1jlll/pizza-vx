const { PrismaClient } = require('@prisma/client');

async function findScallops() {
  const prisma = new PrismaClient();

  try {
    const scallopsItems = await prisma.menuItem.findMany({
      where: {
        name: {
          contains: 'scallop',
          mode: 'insensitive'
        }
      },
      include: {
        category: true
      }
    });

    console.log('Scallops-related menu items:');
    scallopsItems.forEach(item => {
      console.log(`- ${item.name} (ID: ${item.id}) - Category: ${item.category?.name} - Price: $${item.basePrice}`);
    });

    if (scallopsItems.length === 0) {
      console.log('No scallops items found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findScallops();
