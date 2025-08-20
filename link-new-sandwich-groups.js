const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function linkNewGroupsToSandwiches() {
  try {
    console.log('🔍 Linking new groups to sandwich menu items...\n');

    // Find the Sandwiches & Burgers category
    const category = await prisma.menuCategory.findFirst({
      where: { slug: 'sandwiches-burgers' }
    });

    if (!category) {
      console.log('❌ Sandwiches & Burgers category not found');
      return;
    }

    // Find the new groups
    const sizeGroup = await prisma.customizationGroup.findFirst({
      where: { 
        name: 'Sandwich Size',
        categoryId: category.id
      }
    });

    const preparationGroup = await prisma.customizationGroup.findFirst({
      where: { 
        name: 'Sandwich Preparation',
        categoryId: category.id
      }
    });

    if (!sizeGroup || !preparationGroup) {
      console.log('❌ Could not find size or preparation groups');
      return;
    }

    console.log(`✅ Found Size Group: ${sizeGroup.name}`);
    console.log(`✅ Found Preparation Group: ${preparationGroup.name}`);

    // Get all menu items in the category
    const menuItems = await prisma.menuItem.findMany({
      where: { categoryId: category.id },
      include: {
        customizationGroups: true
      }
    });

    console.log(`\n📋 Found ${menuItems.length} menu items to link\n`);

    for (const menuItem of menuItems) {
      console.log(`🍽️ Linking groups to: ${menuItem.name}`);

      // Link Size Group (sortOrder: 0 - first)
      const existingSizeLink = menuItem.customizationGroups.find(
        cg => cg.customizationGroupId === sizeGroup.id
      );

      if (!existingSizeLink) {
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: menuItem.id,
            customizationGroupId: sizeGroup.id,
            isRequired: true,
            sortOrder: 0
          }
        });
        console.log(`   ✅ Linked Size Group (required)`);
      } else {
        console.log(`   ⚠️  Size Group already linked`);
      }

      // Link Preparation Group (sortOrder: 1 - second)
      const existingPrepLink = menuItem.customizationGroups.find(
        cg => cg.customizationGroupId === preparationGroup.id
      );

      if (!existingPrepLink) {
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: menuItem.id,
            customizationGroupId: preparationGroup.id,
            isRequired: true,
            sortOrder: 1
          }
        });
        console.log(`   ✅ Linked Preparation Group (required)`);
      } else {
        console.log(`   ⚠️  Preparation Group already linked`);
      }

      console.log('');
    }

    console.log('🎉 All sandwich menu items updated with Size and Preparation groups!');

  } catch (error) {
    console.error('❌ Error linking groups:', error);
  } finally {
    await prisma.$disconnect();
  }
}

linkNewGroupsToSandwiches();
