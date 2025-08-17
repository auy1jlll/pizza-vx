const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedSandwichData() {
  console.log('🥪 Seeding sandwich data...');

  try {
    // Check if sandwiches category exists
    const sandwichCategory = await prisma.menuCategory.findUnique({
      where: { slug: 'sandwiches' }
    });

    if (!sandwichCategory) {
      console.log('❌ Sandwiches category not found. Please run seed-menu-categories.js first.');
      return;
    }

    console.log('✅ Found sandwiches category:', sandwichCategory.name);

    // Sample sandwich items
    const sandwichItems = [
      {
        id: 'italian-sub',
        name: 'Italian Sub',
        description: 'Classic Italian cold cuts with provolone cheese, lettuce, tomato, onion, and Italian dressing on fresh sub roll',
        basePrice: 12.99,
        imageUrl: null,
        preparationTime: 8,
        sortOrder: 1
      },
      {
        id: 'chicken-parmesan-sub',
        name: 'Chicken Parmesan Sub',
        description: 'Crispy breaded chicken breast with marinara sauce and melted mozzarella cheese on toasted sub roll',
        basePrice: 14.99,
        imageUrl: null,
        preparationTime: 12,
        sortOrder: 2
      },
      {
        id: 'meatball-sub',
        name: 'Meatball Sub',
        description: 'Homemade meatballs in marinara sauce with melted provolone cheese on fresh sub roll',
        basePrice: 13.99,
        imageUrl: null,
        preparationTime: 10,
        sortOrder: 3
      },
      {
        id: 'turkey-club',
        name: 'Turkey Club',
        description: 'Sliced turkey breast with bacon, lettuce, tomato, and mayo on toasted bread',
        basePrice: 11.99,
        imageUrl: null,
        preparationTime: 6,
        sortOrder: 4
      },
      {
        id: 'blt-sandwich',
        name: 'BLT Sandwich',
        description: 'Crispy bacon, fresh lettuce, and ripe tomatoes with mayo on toasted bread',
        basePrice: 9.99,
        imageUrl: null,
        preparationTime: 5,
        sortOrder: 5
      },
      {
        id: 'chicken-caesar-wrap',
        name: 'Chicken Caesar Wrap',
        description: 'Grilled chicken, romaine lettuce, parmesan cheese, and caesar dressing in a flour tortilla',
        basePrice: 12.49,
        imageUrl: null,
        preparationTime: 7,
        sortOrder: 6
      }
    ];

    // Create or update sandwich items
    for (const item of sandwichItems) {
      await prisma.menuItem.upsert({
        where: { id: item.id },
        update: {
          name: item.name,
          description: item.description,
          basePrice: item.basePrice,
          imageUrl: item.imageUrl,
          preparationTime: item.preparationTime,
          sortOrder: item.sortOrder,
          isActive: true,
          isAvailable: true
        },
        create: {
          id: item.id,
          categoryId: sandwichCategory.id,
          name: item.name,
          description: item.description,
          basePrice: item.basePrice,
          imageUrl: item.imageUrl,
          preparationTime: item.preparationTime,
          sortOrder: item.sortOrder,
          isActive: true,
          isAvailable: true
        }
      });
      console.log(`✅ Created/updated sandwich: ${item.name}`);
    }

    // Check if customization groups exist for sandwiches
    const existingGroups = await prisma.customizationGroup.findMany({
      where: { categoryId: sandwichCategory.id }
    });

    console.log(`📦 Found ${existingGroups.length} existing customization groups for sandwiches`);

    if (existingGroups.length === 0) {
      console.log('⚠️  No customization groups found. You may want to run the menu categories seed script.');
    } else {
      // Link sandwich items to customization groups
      for (const item of sandwichItems) {
        for (const group of existingGroups) {
          await prisma.menuItemCustomization.upsert({
            where: {
              menuItemId_customizationGroupId: {
                menuItemId: item.id,
                customizationGroupId: group.id
              }
            },
            update: {
              sortOrder: group.sortOrder
            },
            create: {
              menuItemId: item.id,
              customizationGroupId: group.id,
              sortOrder: group.sortOrder
            }
          });
        }
        console.log(`🔗 Linked ${item.name} to customization groups`);
      }
    }

    console.log('🎉 Sandwich data seeding completed successfully!');

    // Summary
    const totalSandwiches = await prisma.menuItem.count({
      where: { categoryId: sandwichCategory.id }
    });
    const totalGroups = await prisma.customizationGroup.count({
      where: { categoryId: sandwichCategory.id }
    });

    console.log(`\n📊 Summary:`);
    console.log(`   🥪 Total sandwiches: ${totalSandwiches}`);
    console.log(`   🛠️  Total customization groups: ${totalGroups}`);

  } catch (error) {
    console.error('❌ Error seeding sandwich data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedSandwichData();
}

module.exports = { seedSandwichData };
