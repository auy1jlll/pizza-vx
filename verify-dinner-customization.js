const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyDinnerCustomization() {
  try {
    const dinnerPlateCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Dinner Plate' },
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
          },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (dinnerPlateCategory) {
      console.log(`✅ ${dinnerPlateCategory.name} Category`);
      console.log(`   Description: ${dinnerPlateCategory.description}`);
      console.log(`   Menu Items: ${dinnerPlateCategory.menuItems.length}`);
      console.log(`   Customization Groups: ${dinnerPlateCategory.customizationGroups.length}`);
      console.log('');

      // Show customization groups
      console.log('🎯 Customization Groups:');
      dinnerPlateCategory.customizationGroups.forEach((group, index) => {
        console.log(`${index + 1}. ${group.name} (${group.type}, ${group.isRequired ? 'Required' : 'Optional'})`);
        group.options.forEach(option => {
          const price = option.priceModifier === 0 ? 'Free' : `+$${option.priceModifier.toFixed(2)}`;
          console.log(`   - ${option.name}: ${price}`);
        });
        console.log('');
      });

      // Show example items with customizations
      console.log('📋 Dinner Plate Items with Customizations:');
      dinnerPlateCategory.menuItems.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} - $${item.basePrice.toFixed(2)}`);
        
        if (item.customizationGroups.length > 0) {
          console.log(`   Available Customizations:`);
          item.customizationGroups.forEach(cg => {
            console.log(`   ✓ ${cg.customizationGroup.name} (${cg.customizationGroup.options.length} options)`);
          });
        } else {
          console.log(`   ⚠️  No customizations (${item.name})`);
        }
        console.log('');
      });

    } else {
      console.log('❌ Dinner Plate category not found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDinnerCustomization();
