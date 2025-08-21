const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSaladProteinGroup() {
  try {
    console.log('Creating Salad-Protein customization group...');

    // Find the Salads category (assuming it exists)
    let saladsCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Salads' }
    });

    if (!saladsCategory) {
      console.log('❌ Salads category not found. Creating it first...');
      
      // Create Salads category if it doesn't exist
      saladsCategory = await prisma.menuCategory.create({
        data: {
          name: 'Salads',
          slug: 'salads',
          description: 'Fresh salads with various protein options',
          isActive: true,
          sortOrder: 12
        }
      });
      console.log(`✓ Created Salads category: ${saladsCategory.id}`);
    } else {
      console.log(`✓ Found Salads category: ${saladsCategory.id}`);
    }

    // Create the Salad-Protein customization group
    const proteinGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Salad-Protein',
        type: 'MULTI_SELECT',
        isRequired: false,
        categoryId: saladsCategory.id,
        sortOrder: 1,
        options: {
          create: [
            {
              name: 'Extra Avocado',
              priceModifier: 350, // $3.50 in cents
              priceType: 'FLAT',
              sortOrder: 1
            },
            {
              name: 'Chicken Fingers',
              priceModifier: 400, // $4.00 in cents
              priceType: 'FLAT',
              sortOrder: 2
            },
            {
              name: 'Chicken Salad',
              priceModifier: 350, // $3.50 in cents
              priceType: 'FLAT',
              sortOrder: 3
            },
            {
              name: 'Crab Meat',
              priceModifier: 400, // $4.00 in cents
              priceType: 'FLAT',
              sortOrder: 4
            },
            {
              name: 'Grilled Chicken',
              priceModifier: 500, // $5.00 in cents
              priceType: 'FLAT',
              sortOrder: 5
            },
            {
              name: 'Steak Tips',
              priceModifier: 550, // $5.50 in cents
              priceType: 'FLAT',
              sortOrder: 6
            },
            {
              name: 'Tuna Fish',
              priceModifier: 400, // $4.00 in cents
              priceType: 'FLAT',
              sortOrder: 7
            }
          ]
        }
      }
    });

    console.log(`✓ Created Salad-Protein customization group: ${proteinGroup.id}`);

    // Get all salad menu items to link the customization group
    const saladItems = await prisma.menuItem.findMany({
      where: { categoryId: saladsCategory.id }
    });

    console.log(`Found ${saladItems.length} salad items to link customization group to`);

    // If there are existing salad items, link the customization group to them
    if (saladItems.length > 0) {
      for (const item of saladItems) {
        // Check if this customization group is already linked
        const existingLink = await prisma.menuItemCustomization.findFirst({
          where: {
            menuItemId: item.id,
            customizationGroupId: proteinGroup.id
          }
        });

        if (!existingLink) {
          await prisma.menuItemCustomization.create({
            data: {
              menuItemId: item.id,
              customizationGroupId: proteinGroup.id,
              isRequired: false,
              sortOrder: 1
            }
          });
          console.log(`  ✓ Linked to: ${item.name}`);
        } else {
          console.log(`  - Already linked to: ${item.name}`);
        }
      }
    } else {
      console.log('  ℹ️ No existing salad items found. Group created but not linked to any items.');
      console.log('  💡 You can link this group to salad items when you create them.');
    }

    console.log('\n🎉 Salad-Protein customization group created successfully!');
    console.log('Protein Options (Multi-Select, Optional):');
    console.log('  - Extra Avocado: +$3.50');
    console.log('  - Chicken Fingers: +$4.00');
    console.log('  - Chicken Salad: +$3.50');
    console.log('  - Crab Meat: +$4.00');
    console.log('  - Grilled Chicken: +$5.00');
    console.log('  - Steak Tips: +$5.50');
    console.log('  - Tuna Fish: +$4.00');
    console.log('\nPrices are stored in cents and will display correctly as USD with 2 decimals.');

  } catch (error) {
    console.error('Error creating Salad-Protein group:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSaladProteinGroup();
