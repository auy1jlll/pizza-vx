const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSaladMenuItems() {
  try {
    console.log('Creating Salad menu items...');

    // Find or create the Salads category
    let saladsCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Salads' }
    });

    if (!saladsCategory) {
      console.log('Creating Salads category...');
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
      console.log(`✓ Found existing Salads category: ${saladsCategory.id}`);
    }

    // Find the Salad-Protein customization group to link to these items
    const proteinGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Salad-Protein' }
    });

    // Define the salad menu items
    const saladItems = [
      {
        name: 'Caesar Salad',
        description: 'Fresh Romaine lettuce, Croutons and aged shaved parmesan cheese',
        basePrice: 11.50, // $11.50 as float
        sortOrder: 1
      },
      {
        name: 'Chef Salad',
        description: 'Fresh mixed greens, ham, turkey, salami and a scoop of tuna salad.',
        basePrice: 13.75, // $13.75 as float
        sortOrder: 2
      },
      {
        name: 'California Salad',
        description: 'Fresh mixed greens, Cherry tomatoes, red onions, cucumbers, fresh mozzarella balls and avocado.',
        basePrice: 12.99, // $12.99 as float
        sortOrder: 3
      },
      {
        name: 'Greek Salad',
        description: 'Fresh mixed greens, Kalamata olives, feta cheese, cucumbers, bell peppers, red onions and cherry tomatoes.',
        basePrice: 11.75, // $11.75 as float
        sortOrder: 4
      },
      {
        name: 'Salad with Lobster',
        description: 'Fresh mixed greens, with our local lobster',
        basePrice: 38.00, // $38.00 as float
        sortOrder: 5
      }
    ];

    console.log(`Creating ${saladItems.length} salad menu items...`);

    for (const item of saladItems) {
      // Check if item already exists
      const existingItem = await prisma.menuItem.findFirst({
        where: {
          name: item.name,
          categoryId: saladsCategory.id
        }
      });

      if (existingItem) {
        console.log(`  - ${item.name} already exists, skipping...`);
        continue;
      }

      // Create the menu item
      const menuItem = await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description,
          basePrice: item.basePrice,
          categoryId: saladsCategory.id,
          isActive: true,
          isAvailable: true,
          sortOrder: item.sortOrder
        }
      });

      console.log(`  ✓ Created: ${item.name} - $${item.basePrice.toFixed(2)}`);

      // Link the Salad-Protein customization group to this item (if it exists)
      if (proteinGroup) {
        const existingLink = await prisma.menuItemCustomization.findFirst({
          where: {
            menuItemId: menuItem.id,
            customizationGroupId: proteinGroup.id
          }
        });

        if (!existingLink) {
          await prisma.menuItemCustomization.create({
            data: {
              menuItemId: menuItem.id,
              customizationGroupId: proteinGroup.id,
              isRequired: false,
              sortOrder: 1
            }
          });
          console.log(`    ✓ Linked Salad-Protein customization group`);
        }
      }
    }

    console.log('\n🎉 Salad menu items created successfully!');
    console.log('\nCreated Items:');
    console.log('  1. Caesar Salad - $11.50');
    console.log('     Fresh Romaine lettuce, Croutons and aged shaved parmesan cheese');
    console.log('  2. Chef Salad - $13.75');
    console.log('     Fresh mixed greens, ham, turkey, salami and a scoop of tuna salad.');
    console.log('  3. California Salad - $12.99');
    console.log('     Fresh mixed greens, Cherry tomatoes, red onions, cucumbers, fresh mozzarella balls and avocado.');
    console.log('  4. Greek Salad - $11.75');
    console.log('     Fresh mixed greens, Kalamata olives, feta cheese, cucumbers, bell peppers, red onions and cherry tomatoes.');
    console.log('  5. Salad with Lobster - $38.00');
    console.log('     Fresh mixed greens, with our local lobster');

    if (proteinGroup) {
      console.log('\n✓ All salads are linked to the Salad-Protein customization group');
      console.log('  Customers can add: Extra Avocado, Chicken Fingers, Chicken Salad, Crab Meat, Grilled Chicken, Steak Tips, or Tuna Fish');
    }

  } catch (error) {
    console.error('Error creating salad menu items:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSaladMenuItems();
