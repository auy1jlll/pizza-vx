const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function linkSandwichToppingsToMenuItems() {
  try {
    console.log('🔗 Linking Sandwich Toppings to Menu Items...\n');
    
    // Find the Sandwiches & Burgers category
    const category = await prisma.menuCategory.findFirst({
      where: {
        OR: [
          { name: { contains: 'Sandwich', mode: 'insensitive' } },
          { name: { contains: 'Burger', mode: 'insensitive' } }
        ]
      }
    });

    if (!category) {
      console.log('❌ Sandwiches & Burgers category not found!');
      return;
    }

    // Find the Sandwich Toppings group
    const sandwichToppingsGroup = await prisma.customizationGroup.findFirst({
      where: {
        name: 'Sandwich Toppings',
        categoryId: category.id
      }
    });

    if (!sandwichToppingsGroup) {
      console.log('❌ Sandwich Toppings group not found!');
      return;
    }

    console.log(`✅ Found group: ${sandwichToppingsGroup.name}`);

    // Get all menu items in the Sandwiches & Burgers category
    const menuItems = await prisma.menuItem.findMany({
      where: { categoryId: category.id },
      select: { id: true, name: true }
    });

    console.log(`📋 Found ${menuItems.length} menu items in ${category.name}:`);
    menuItems.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name}`);
    });

    // Link the Sandwich Toppings group to each menu item
    console.log(`\n🔗 Linking Sandwich Toppings group to menu items...`);
    
    for (const item of menuItems) {
      // Check if this link already exists
      const existingLink = await prisma.menuItemCustomization.findFirst({
        where: {
          menuItemId: item.id,
          customizationGroupId: sandwichToppingsGroup.id
        }
      });

      if (existingLink) {
        console.log(`   ⚠️ ${item.name} - Already linked, skipping`);
      } else {
        // Create the link
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: sandwichToppingsGroup.id,
            isRequired: false,
            sortOrder: 1
          }
        });
        console.log(`   ✅ ${item.name} - Linked successfully`);
      }
    }

    // Verify the links
    console.log(`\n🔍 Verifying links...`);
    const verificationItems = await prisma.menuItem.findMany({
      where: { categoryId: category.id },
      include: {
        customizationGroups: {
          include: {
            customizationGroup: {
              select: { name: true, type: true }
            }
          }
        }
      }
    });

    verificationItems.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name} - ${item.customizationGroups.length} customization groups`);
      item.customizationGroups.forEach(cg => {
        console.log(`      - ${cg.customizationGroup.name} (${cg.customizationGroup.type})`);
      });
    });

    console.log(`\n🎉 Successfully linked Sandwich Toppings to all menu items in ${category.name}!`);

  } catch (error) {
    console.error('❌ Error linking sandwich toppings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

linkSandwichToppingsToMenuItems();
