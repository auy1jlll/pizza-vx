const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateSeafoodPlates() {
  console.log('🦞 Updating Seafood Plates...');
  
  try {
    // Find the Seafood Plates category
    const seafoodCategory = await prisma.menuCategory.findFirst({
      where: { slug: 'seafood-plates' }
    });

    if (!seafoodCategory) {
      console.log('❌ Seafood Plates category not found!');
      return;
    }

    // Get all seafood plate items
    const seafoodItems = await prisma.menuItem.findMany({
      where: { categoryId: seafoodCategory.id }
    });

    console.log(`\n📋 Found ${seafoodItems.length} seafood plate items:`);

    // Update prices by adding $1.00
    for (const item of seafoodItems) {
      const oldPrice = item.basePrice;
      const newPrice = oldPrice + 1.00;
      
      await prisma.menuItem.update({
        where: { id: item.id },
        data: { basePrice: newPrice }
      });

      console.log(`  ✅ ${item.name}: $${oldPrice} → $${newPrice}`);
    }

    // Create customization groups for seafood plates
    console.log('\n🍟 Creating customization groups...');

    // 1. Fries and Onion Rings group
    let friesOnionRingsGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Fries and Onion Rings' }
    });

    if (!friesOnionRingsGroup) {
      friesOnionRingsGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Fries and Onion Rings',
          description: 'Choose your fries and onion rings',
          type: 'MULTI_SELECT',
          maxSelections: 2, // All fries + All onion rings
          isRequired: true,
          sortOrder: 1
        }
      });
    }

    // Create options for Fries and Onion Rings
    const friesOnionRingsOptions = [
      { name: 'All Fries', description: 'French fries', priceModifier: 0, sortOrder: 1 },
      { name: 'All Onion Rings', description: 'Crispy onion rings', priceModifier: 0, sortOrder: 2 }
    ];

    for (const option of friesOnionRingsOptions) {
      const existingOption = await prisma.customizationOption.findFirst({
        where: {
          groupId: friesOnionRingsGroup.id,
          name: option.name
        }
      });

      if (!existingOption) {
        await prisma.customizationOption.create({
          data: {
            ...option,
            groupId: friesOnionRingsGroup.id,
            isActive: true,
            isDefault: false
          }
        });
      }
    }

    // 2. Side Choice group (Coleslaw or Pasta Salad)
    let sideChoiceGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Side Choice' }
    });

    if (!sideChoiceGroup) {
      sideChoiceGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Side Choice',
          description: 'Choose your side',
          type: 'SINGLE_SELECT',
          maxSelections: 1,
          isRequired: true,
          sortOrder: 2
        }
      });
    }

    // Create options for Side Choice
    const sideChoiceOptions = [
      { name: 'Coleslaw', description: 'Fresh coleslaw', priceModifier: 0, sortOrder: 1, isDefault: true },
      { name: 'Pasta Salad', description: 'Homemade pasta salad', priceModifier: 0, sortOrder: 2 }
    ];

    for (const option of sideChoiceOptions) {
      const existingOption = await prisma.customizationOption.findFirst({
        where: {
          groupId: sideChoiceGroup.id,
          name: option.name
        }
      });

      if (!existingOption) {
        await prisma.customizationOption.create({
          data: {
            ...option,
            groupId: sideChoiceGroup.id,
            isActive: true
          }
        });
      }
    }

    console.log(`  ✅ Created "Fries and Onion Rings" group`);
    console.log(`  ✅ Created "Side Choice" group`);

    // Apply customization groups to all seafood plates
    console.log('\n🔗 Applying customizations to seafood plates...');

    for (const item of seafoodItems) {
      // Add Fries and Onion Rings group
      await prisma.menuItemCustomization.upsert({
        where: {
          menuItemId_customizationGroupId: {
            menuItemId: item.id,
            customizationGroupId: friesOnionRingsGroup.id
          }
        },
        update: {},
        create: {
          menuItemId: item.id,
          customizationGroupId: friesOnionRingsGroup.id,
          isRequired: true,
          sortOrder: 1
        }
      });

      // Add Side Choice group
      await prisma.menuItemCustomization.upsert({
        where: {
          menuItemId_customizationGroupId: {
            menuItemId: item.id,
            customizationGroupId: sideChoiceGroup.id
          }
        },
        update: {},
        create: {
          menuItemId: item.id,
          customizationGroupId: sideChoiceGroup.id,
          isRequired: true,
          sortOrder: 2
        }
      });

      console.log(`  ✅ Applied customizations to: ${item.name}`);
    }

    console.log('\n🎉 Seafood plates update completed successfully!');
    console.log(`\n📋 Summary:`);
    console.log(`   • Updated prices for ${seafoodItems.length} items (+$1.00 each)`);
    console.log(`   • Created 2 customization groups`);
    console.log(`   • Applied customizations to all seafood plates`);
    console.log(`\n🍽️ Each seafood dinner plate now includes:`);
    console.log(`   • Choice of All Fries OR All Onion Rings`);
    console.log(`   • Choice of Coleslaw OR Pasta Salad`);

  } catch (error) {
    console.error('❌ Error updating seafood plates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateSeafoodPlates();
