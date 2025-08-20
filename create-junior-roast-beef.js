const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createJuniorRoastBeef() {
  try {
    console.log('🔍 Creating Junior Roast Beef menu item...\n');

    // Find the Sandwiches & Burgers category
    const category = await prisma.menuCategory.findFirst({
      where: { slug: 'sandwiches-burgers' }
    });

    if (!category) {
      console.log('❌ Sandwiches & Burgers category not found');
      return;
    }

    console.log(`✅ Found category: ${category.name}`);

    // Create the Junior Roast Beef menu item
    const menuItem = await prisma.menuItem.create({
      data: {
        name: 'Junior Roast Beef',
        description: 'Tender sliced roast beef on your choice of bread with fresh toppings',
        basePrice: 8.95,
        imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        isActive: true,
        isAvailable: true,
        sortOrder: 3,
        preparationTime: 5,
        allergens: 'gluten,dairy',
        categoryId: category.id
      }
    });

    console.log(`✅ Created menu item: ${menuItem.name} ($${menuItem.basePrice})`);

    // Get the customization groups
    const groups = await prisma.customizationGroup.findMany({
      where: { 
        categoryId: category.id,
        name: {
          in: ['Sandwich Size', 'Sandwich Preparation', 'Sandwich Toppings', 'Sandwich Condiments']
        }
      }
    });

    console.log(`\n📋 Found ${groups.length} customization groups to link:`);

    // Link each group to the menu item
    for (const group of groups) {
      let sortOrder = 0;
      let isRequired = false;

      // Determine sort order and requirement based on group type
      switch (group.name) {
        case 'Sandwich Size':
          sortOrder = 0;
          isRequired = true;
          break;
        case 'Sandwich Preparation':
          sortOrder = 1;
          isRequired = true;
          break;
        case 'Sandwich Toppings':
          sortOrder = 2;
          isRequired = false;
          break;
        case 'Sandwich Condiments':
          sortOrder = 3;
          isRequired = false;
          break;
      }

      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: menuItem.id,
          customizationGroupId: group.id,
          isRequired: isRequired,
          sortOrder: sortOrder
        }
      });

      console.log(`   ✅ Linked ${group.name} (${isRequired ? 'Required' : 'Optional'}, Order: ${sortOrder})`);
    }

    console.log(`\n🎉 Junior Roast Beef created successfully with ${groups.length} customization groups!`);
    
    // Verify the setup
    const verification = await prisma.menuItem.findUnique({
      where: { id: menuItem.id },
      include: {
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: {
                  where: { isActive: true },
                  orderBy: { sortOrder: 'asc' }
                }
              }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    console.log('\n📋 VERIFICATION:');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`🍽️ ${verification.name} ($${verification.basePrice})`);
    console.log(`   📝 ${verification.description}`);
    console.log(`   🎛️ Customization Groups: ${verification.customizationGroups.length}`);
    
    verification.customizationGroups.forEach((cg, index) => {
      const group = cg.customizationGroup;
      console.log(`      ${index + 1}. ${group.name} (${group.type})`);
      console.log(`         Required: ${cg.isRequired ? 'Yes' : 'No'}`);
      console.log(`         Options: ${group.options.length} available`);
      
      if (group.options.length <= 5) {
        group.options.forEach((option, optIndex) => {
          const price = option.priceModifier !== 0 ? 
            ` (${option.priceModifier >= 0 ? '+' : ''}$${option.priceModifier})` : 
            '';
          console.log(`           ${optIndex + 1}. ${option.name}${price}${option.isDefault ? ' [DEFAULT]' : ''}`);
        });
      }
    });

    return menuItem;

  } catch (error) {
    console.error('❌ Error creating Junior Roast Beef:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createJuniorRoastBeef();
