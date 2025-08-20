const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSandwichBurgersMenuItems() {
  try {
    console.log('🔍 Checking Sandwiches & Burgers Menu Items and Customization Groups...\n');
    
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

    console.log(`✅ Found category: ${category.name} (${category.slug})\n`);

    // Get all menu items in this category
    const menuItems = await prisma.menuItem.findMany({
      where: { categoryId: category.id },
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

    console.log(`📋 Menu Items in ${category.name} (${menuItems.length} items):`);
    menuItems.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name} - ${item.customizationGroups.length} customization groups`);
      item.customizationGroups.forEach(cg => {
        console.log(`      - ${cg.customizationGroup.name} (${cg.customizationGroup.options.length} options)`);
      });
    });

    // Check if Sandwich Toppings group exists for this category
    const sandwichToppingsGroup = await prisma.customizationGroup.findFirst({
      where: {
        name: 'Sandwich Toppings',
        categoryId: category.id
      },
      include: {
        options: true,
        menuItemCustomizations: {
          include: {
            menuItem: {
              select: { name: true }
            }
          }
        }
      }
    });

    console.log(`\n🥪 Sandwich Toppings Group Status:`);
    if (sandwichToppingsGroup) {
      console.log(`   ✅ Group exists: ${sandwichToppingsGroup.name}`);
      console.log(`   📝 Options: ${sandwichToppingsGroup.options.length}`);
      console.log(`   🔗 Linked to menu items: ${sandwichToppingsGroup.menuItemCustomizations.length}`);
      
      if (sandwichToppingsGroup.menuItemCustomizations.length > 0) {
        console.log(`   📋 Connected menu items:`);
        sandwichToppingsGroup.menuItemCustomizations.forEach(mic => {
          console.log(`      - ${mic.menuItem.name}`);
        });
      } else {
        console.log(`   ⚠️ Group exists but is NOT linked to any menu items yet!`);
        console.log(`   💡 You need to link this group to specific menu items in the category.`);
      }
    } else {
      console.log(`   ❌ Sandwich Toppings group not found for this category!`);
    }

    // Show all customization groups for this category
    const allGroupsForCategory = await prisma.customizationGroup.findMany({
      where: { categoryId: category.id },
      include: { options: true }
    });

    console.log(`\n📊 All Customization Groups for ${category.name}:`);
    allGroupsForCategory.forEach((group, index) => {
      console.log(`   ${index + 1}. ${group.name} (${group.type}, ${group.options.length} options)`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSandwichBurgersMenuItems();
