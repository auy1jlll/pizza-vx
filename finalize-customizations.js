const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function finalizeCustomizations() {
  try {
    console.log('🎯 Finalizing customizations...');

    // Add customization for Cole Slaw
    const dressingGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Choose Your Dressing' }
    });

    const vegetableGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Add Vegetables' }
    });

    if (dressingGroup) {
      const coleSlaw = await prisma.menuItem.findFirst({
        where: { name: { contains: 'Cole Slaw' } }
      });

      if (coleSlaw) {
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: coleSlaw.id,
            customizationGroupId: dressingGroup.id,
            isRequired: false,
            sortOrder: 1
          }
        });
        console.log('✅ Added dressing option to Cole Slaw');
      }
    }

    // Enhance vegetable options to make lettuce, tomato, onion more prominent
    if (vegetableGroup) {
      // Check current options
      const currentOptions = await prisma.customizationOption.findMany({
        where: { groupId: vegetableGroup.id }
      });

      const hasBasicVeggies = currentOptions.some(opt =>
        ['lettuce', 'tomato', 'onion'].some(veg =>
          opt.name.toLowerCase().includes(veg.toLowerCase())
        )
      );

      if (!hasBasicVeggies) {
        console.log('Adding basic vegetable options...');

        // Add basic vegetable options
        await prisma.customizationOption.createMany({
          data: [
            {
              groupId: vegetableGroup.id,
              name: 'Extra Lettuce',
              priceModifier: 0,
              isDefault: false,
              isActive: true,
              sortOrder: 1
            },
            {
              groupId: vegetableGroup.id,
              name: 'Extra Tomatoes',
              priceModifier: 0,
              isDefault: false,
              isActive: true,
              sortOrder: 2
            },
            {
              groupId: vegetableGroup.id,
              name: 'Extra Onions',
              priceModifier: 0,
              isDefault: false,
              isActive: true,
              sortOrder: 3
            }
          ]
        });
        console.log('✅ Added basic vegetable options');
      }
    }

    console.log('\n🎉 All customizations finalized!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

finalizeCustomizations();
