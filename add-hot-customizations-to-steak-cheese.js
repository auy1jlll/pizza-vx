const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addHotSubCustomizationsToSteakCheese() {
  try {
    console.log('🔍 Finding steak and cheese subs and existing hot sub customizations...\n');

    // Find steak and cheese category
    const steakCheeseCategory = await prisma.menuCategory.findFirst({
      where: { 
        OR: [
          { slug: 'steak-cheese-subs' },
          { slug: 'steak-and-cheese' },
          { name: { contains: 'Steak', mode: 'insensitive' } }
        ]
      }
    });

    if (!steakCheeseCategory) {
      console.log('❌ Could not find steak and cheese category');
      return;
    }

    console.log(`✅ Found category: ${steakCheeseCategory.name} (${steakCheeseCategory.slug})`);

    // Get all steak and cheese subs
    const steakCheeseSubs = await prisma.menuItem.findMany({
      where: { categoryId: steakCheeseCategory.id },
      select: { id: true, name: true }
    });

    console.log(`📋 Found ${steakCheeseSubs.length} steak and cheese subs:`);
    steakCheeseSubs.forEach((sub, index) => {
      console.log(`   ${index + 1}. ${sub.name}`);
    });

    // Get existing hot sub customization groups
    const hotSubCustomizationGroups = await prisma.customizationGroup.findMany({
      where: {
        name: {
          in: ['Bread Type', 'Condiments', 'Add Cheese', 'Hot Sub Toppings']
        }
      },
      select: { id: true, name: true }
    });

    console.log(`\n🔧 Found ${hotSubCustomizationGroups.length} existing customization groups:`);
    hotSubCustomizationGroups.forEach((group, index) => {
      console.log(`   ${index + 1}. ${group.name} (ID: ${group.id})`);
    });

    // Apply each customization group to all steak and cheese subs
    let totalAssignments = 0;

    for (const sub of steakCheeseSubs) {
      console.log(`\n🔄 Adding customizations to: ${sub.name}`);
      
      for (const group of hotSubCustomizationGroups) {
        // Check if this combination already exists
        const existingAssignment = await prisma.menuItemCustomization.findFirst({
          where: {
            menuItemId: sub.id,
            customizationGroupId: group.id
          }
        });

        if (!existingAssignment) {
          // Determine sort order and if required based on group type
          let sortOrder = 1;
          let isRequired = false;

          switch (group.name) {
            case 'Bread Type':
              sortOrder = 1;
              isRequired = true;
              break;
            case 'Condiments':
              sortOrder = 2;
              isRequired = false;
              break;
            case 'Add Cheese':
              sortOrder = 3;
              isRequired = false;
              break;
            case 'Hot Sub Toppings':
              sortOrder = 4;
              isRequired = false;
              break;
          }

          await prisma.menuItemCustomization.create({
            data: {
              menuItemId: sub.id,
              customizationGroupId: group.id,
              isRequired,
              sortOrder
            }
          });

          console.log(`   ✅ Added ${group.name}`);
          totalAssignments++;
        } else {
          console.log(`   ⚠️ ${group.name} already exists`);
        }
      }
    }

    console.log(`\n🎉 SUMMARY:`);
    console.log(`✅ Applied hot sub customizations to ${steakCheeseSubs.length} steak and cheese subs`);
    console.log(`✅ Total new customization assignments: ${totalAssignments}`);
    console.log(`✅ Each steak and cheese sub now has the same customizations as hot subs:`);
    console.log(`   • Bread Type (required, single select)`);
    console.log(`   • Condiments (optional, multi-select, up to 3x each, FREE)`);
    console.log(`   • Add Cheese (optional, multi-select, up to 3x each, $0.75 each)`);
    console.log(`   • Hot Sub Toppings (optional, max 5 selections, up to 3x each, FREE)`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

addHotSubCustomizationsToSteakCheese();
