const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifySaladCustomizations() {
  try {
    const saladsCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Salads' },
      include: {
        customizationGroups: {
          include: {
            options: true
          }
        },
        menuItems: {
          include: {
            customizationGroups: {
              include: {
                customizationGroup: {
                  include: {
                    options: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (saladsCategory) {
      console.log(`✅ Salads Category: ${saladsCategory.name}`);
      console.log(`   Menu Items: ${saladsCategory.menuItems.length}`);
      console.log(`   Customization Groups: ${saladsCategory.customizationGroups.length}`);
      console.log('');

      // Show customization groups
      console.log('🎯 Customization Groups:');
      saladsCategory.customizationGroups.forEach((group, index) => {
        console.log(`${index + 1}. ${group.name} (${group.type}, ${group.isRequired ? 'Required' : 'Optional'})`);
        group.options.forEach(option => {
          const price = group.name === 'Salad-Protein' 
            ? `+$${(option.priceModifier / 100).toFixed(2)}` 
            : option.priceModifier === 0 ? 'Free' : `+$${option.priceModifier.toFixed(2)}`;
          console.log(`   - ${option.name}: ${price}`);
        });
        console.log('');
      });

      // Show one example salad with all customizations
      if (saladsCategory.menuItems.length > 0) {
        const exampleSalad = saladsCategory.menuItems[0];
        console.log(`📋 Example: ${exampleSalad.name} - $${exampleSalad.basePrice.toFixed(2)}`);
        console.log(`   ${exampleSalad.description}`);
        console.log('   Available Customizations:');
        exampleSalad.customizationGroups.forEach(cg => {
          console.log(`   ✓ ${cg.customizationGroup.name} (${cg.customizationGroup.options.length} options)`);
        });
      }

    } else {
      console.log('❌ Salads category not found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifySaladCustomizations();
