const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifySandwichToppings() {
  try {
    console.log('🔍 Verifying Sandwich Toppings Group...\n');
    
    const group = await prisma.customizationGroup.findFirst({
      where: { name: 'Sandwich Toppings' },
      include: {
        category: { select: { name: true, slug: true } },
        options: { orderBy: { sortOrder: 'asc' } }
      }
    });

    if (!group) {
      console.log('❌ Group not found!');
      return;
    }

    console.log('✅ SANDWICH TOPPINGS GROUP DETAILS:');
    console.log('   ID: ' + group.id);
    console.log('   Name: ' + group.name);
    console.log('   Description: ' + group.description);
    console.log('   Type: ' + group.type);
    console.log('   Required: ' + (group.isRequired ? 'Yes' : 'No'));
    console.log('   Min Selections: ' + group.minSelections);
    console.log('   Max Selections: ' + group.maxSelections);
    console.log('   Active: ' + (group.isActive ? 'Yes' : 'No'));
    console.log('   Category: ' + (group.category ? group.category.name + ' (' + group.category.slug + ')' : 'Global'));
    
    console.log('\n📝 OPTIONS (' + group.options.length + '):');
    group.options.forEach((option, index) => {
      console.log('   ' + (index + 1) + '. ' + option.name + ' (+$' + option.priceModifier + ')');
      console.log('      Description: ' + option.description);
      console.log('      Active: ' + (option.isActive ? 'Yes' : 'No'));
    });

    console.log('\n🎯 SUCCESS: Sandwich Toppings group is ready for use!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifySandwichToppings();
