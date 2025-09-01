const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateAdditionalHotSubs() {
  console.log('🔥 Updating Additional Hot Subs to Large-Only...\n');

  try {
    // Items to update with their new prices and large-only bread
    const itemsToUpdate = [
      { name: 'CHICKEN CUTLET', searchName: 'Chicken Cutlet Sub', price: 13.00 },
      { name: 'CHICKEN FINGER', searchName: 'Chicken Fingers/tenders', price: 13.00 },
      { name: 'CHEESE BURGER', searchName: 'Cheese Burger', price: 13.00 },
      { name: 'CHICKEN KABOB', searchName: 'Grilled Chicken Kabob', price: 13.74 }
    ];

    // Find the large-only bread customization group
    const largeOnlyBreadGroup = await prisma.customizationGroup.findFirst({
      where: {
        name: 'Bread Type - Large Only'
      }
    });

    if (!largeOnlyBreadGroup) {
      console.error('❌ Large-only bread group not found!');
      return;
    }

    console.log(`✅ Found large-only bread group: ${largeOnlyBreadGroup.name}`);

    // Find and update each item
    for (const itemData of itemsToUpdate) {
      console.log(`\n🔍 Processing: ${itemData.name}...`);

      // Find the menu item
      const menuItem = await prisma.menuItem.findFirst({
        where: {
          OR: [
            {
              name: {
                contains: itemData.searchName || itemData.name,
                mode: 'insensitive'
              }
            },
            {
              name: {
                equals: itemData.searchName || itemData.name,
                mode: 'insensitive'
              }
            }
          ],
          // Make sure it's in Hot Subs category and not a plate
          category: {
            name: 'Hot Subs'
          },
          NOT: {
            name: {
              contains: 'Plate',
              mode: 'insensitive'
            }
          }
        },
        include: {
          customizationGroups: {
            include: {
              customizationGroup: true
            }
          }
        }
      });

      if (!menuItem) {
        console.log(`❌ Menu item "${itemData.name}" not found`);
        continue;
      }

      console.log(`✅ Found menu item: ${menuItem.name} (Current price: $${menuItem.basePrice})`);

      // Update the price
      await prisma.menuItem.update({
        where: { id: menuItem.id },
        data: { basePrice: itemData.price }
      });

      console.log(`💰 Updated price to $${itemData.price}`);

      // Check if it already has the large-only bread group
      const hasLargeOnlyBread = menuItem.customizationGroups.some(cg => 
        cg.customizationGroup.name === 'Bread Type - Large Only'
      );

      if (hasLargeOnlyBread) {
        console.log(`✅ Already has large-only bread group`);
        continue;
      }

      // Remove any existing bread customization groups
      const breadGroups = menuItem.customizationGroups.filter(cg =>
        cg.customizationGroup.name.toLowerCase().includes('bread')
      );

      for (const breadGroup of breadGroups) {
        await prisma.menuItemCustomization.delete({
          where: { id: breadGroup.id }
        });
        console.log(`🗑️ Removed old bread group: ${breadGroup.customizationGroup.name}`);
      }

      // Add the large-only bread customization group
      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: menuItem.id,
          customizationGroupId: largeOnlyBreadGroup.id,
          isRequired: true,
          sortOrder: 0
        }
      });

      console.log(`✅ Added large-only bread customization group`);
    }

    // Summary - check all updated items
    console.log('\n📊 Updated Items Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    for (const itemData of itemsToUpdate) {
      const updatedItem = await prisma.menuItem.findFirst({
        where: {
          OR: [
            {
              name: {
                contains: itemData.searchName || itemData.name,
                mode: 'insensitive'
              }
            },
            {
              name: {
                equals: itemData.searchName || itemData.name,
                mode: 'insensitive'
              }
            }
          ],
          category: {
            name: 'Hot Subs'
          },
          NOT: {
            name: {
              contains: 'Plate',
              mode: 'insensitive'
            }
          }
        },
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
      });

      if (updatedItem) {
        const breadGroup = updatedItem.customizationGroups.find(cg =>
          cg.customizationGroup.name.toLowerCase().includes('bread')
        );

        const hasSmallSub = breadGroup?.customizationGroup.options.some(opt =>
          opt.name.toLowerCase().includes('small sub')
        ) || false;

        console.log(`🔥 ${updatedItem.name}: $${updatedItem.basePrice} (Small Sub: ${hasSmallSub ? '❌ Still has small' : '✅ Large only'})`);
      }
    }

    console.log('\n🎉 Additional hot subs update complete!');

  } catch (error) {
    console.error('❌ Error updating additional hot subs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdditionalHotSubs();
