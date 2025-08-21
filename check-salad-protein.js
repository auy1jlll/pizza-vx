const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSaladProteinGroup() {
  try {
    const group = await prisma.customizationGroup.findFirst({
      where: { name: 'Salad-Protein' },
      include: {
        options: true,
        category: true
      }
    });

    if (group) {
      console.log(`✓ Found Salad-Protein group: ${group.id}`);
      console.log(`  Category: ${group.category.name}`);
      console.log(`  Type: ${group.type}`);
      console.log(`  Required: ${group.isRequired}`);
      console.log(`  Options (${group.options.length}):`);
      
      group.options.forEach(option => {
        const price = (option.priceModifier / 100).toFixed(2);
        console.log(`    - ${option.name}: +$${price}`);
      });
    } else {
      console.log('❌ Salad-Protein group not found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSaladProteinGroup();
