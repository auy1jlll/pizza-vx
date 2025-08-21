const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupSides() {
  try {
    console.log('Cleaning up Sides category - removing duplicates and fixing pricing...');

    // Find the Sides category
    const sidesCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Sides' },
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
                customizationGroup: true
              }
            }
          }
        }
      }
    });

    if (!sidesCategory) {
      console.log('❌ Sides category not found');
      return;
    }

    // Remove the generic "Side Size" group - we want item-specific groups
    const genericSizeGroup = sidesCategory.customizationGroups.find(g => g.name === 'Side Size');
    if (genericSizeGroup) {
      console.log('Removing generic Side Size group...');
      
      // First remove all links to this group
      await prisma.menuItemCustomization.deleteMany({
        where: { customizationGroupId: genericSizeGroup.id }
      });
      
      // Then delete the group and its options
      await prisma.customizationOption.deleteMany({
        where: { groupId: genericSizeGroup.id }
      });
      
      await prisma.customizationGroup.delete({
        where: { id: genericSizeGroup.id }
      });
      
      console.log('✓ Removed generic Side Size group');
    }

    // Update the specific item pricing options
    const itemPricing = {
      'French Fries Size': { smallPrice: 6.00, largeAdd: 1.00 },
      'Onion Rings Size': { smallPrice: 6.00, largeAdd: 1.00 },
      'Pasta Salad Size': { smallPrice: 5.00, largeAdd: 4.00 },
      'Cole Slaw Size': { smallPrice: 5.00, largeAdd: 4.00 }
    };

    for (const [groupName, pricing] of Object.entries(itemPricing)) {
      const group = await prisma.customizationGroup.findFirst({
        where: { name: groupName },
        include: { options: true }
      });

      if (group) {
        // Update the Large option pricing
        const largeOption = group.options.find(opt => opt.name === 'Large');
        if (largeOption) {
          await prisma.customizationOption.update({
            where: { id: largeOption.id },
            data: { priceModifier: pricing.largeAdd * 100 } // Convert to cents
          });
          console.log(`✓ Updated ${groupName}: Large option now +$${pricing.largeAdd.toFixed(2)}`);
        }
      }
    }

    console.log('\n🎉 Sides cleanup complete!');
    
    // Final verification
    const updatedCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Sides' },
      include: {
        menuItems: {
          include: {
            customizationGroups: {
              include: {
                customizationGroup: {
                  include: { options: true }
                }
              }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    console.log('\n📋 Final Sides Menu:');
    console.log('Item                Small Price    Large Price');
    console.log('─────────────────   ───────────    ───────────');
    
    updatedCategory.menuItems.forEach(item => {
      const sizeGroup = item.customizationGroups.find(cg => 
        cg.customizationGroup.name.includes(item.name + ' Size')
      );
      
      if (sizeGroup) {
        const largeOption = sizeGroup.customizationGroup.options.find(opt => opt.name === 'Large');
        const largePrice = item.basePrice + (largeOption ? largeOption.priceModifier / 100 : 0);
        console.log(`${item.name.padEnd(18)} $${item.basePrice.toFixed(2).padEnd(12)} $${largePrice.toFixed(2)}`);
      }
    });

  } catch (error) {
    console.error('Error cleaning up sides:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupSides();
