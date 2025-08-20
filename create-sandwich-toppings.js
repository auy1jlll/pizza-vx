const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSandwichToppingsGroup() {
  try {
    console.log('🥪 Creating Sandwich Toppings Customization Group...\n');

    // Find the "Sandwiches and Burgers" category
    const sandwichBurgersCategory = await prisma.menuCategory.findFirst({
      where: {
        OR: [
          { name: { contains: 'Sandwich', mode: 'insensitive' } },
          { name: { contains: 'Burger', mode: 'insensitive' } },
          { slug: { contains: 'sandwich' } },
          { slug: { contains: 'burger' } }
        ]
      }
    });

    if (!sandwichBurgersCategory) {
      console.log('❌ Sandwiches and Burgers category not found! Listing all categories:');
      const allCategories = await prisma.menuCategory.findMany({
        select: { id: true, name: true, slug: true }
      });
      allCategories.forEach(cat => {
        console.log(`- ${cat.name} (ID: ${cat.id}, Slug: ${cat.slug})`);
      });
      return;
    }

    console.log(`✅ Found category: ${sandwichBurgersCategory.name} (ID: ${sandwichBurgersCategory.id})`);

    // Check if sandwich-toppings group already exists
    const existingGroup = await prisma.customizationGroup.findFirst({
      where: {
        name: 'Sandwich Toppings'
      }
    });

    if (existingGroup) {
      console.log('⚠️ Sandwich Toppings group already exists! Updating instead...');
      
      // Update the existing group
      const updatedGroup = await prisma.customizationGroup.update({
        where: { id: existingGroup.id },
        data: {
          name: 'Sandwich Toppings',
          description: 'Choose your sandwich/burger toppings (up to 5)',
          type: 'MULTI_SELECT',
          isRequired: false,
          minSelections: 0,
          maxSelections: 5,
          sortOrder: 3,
          isActive: true,
          categoryId: sandwichBurgersCategory.id
        }
      });

      console.log(`✅ Updated existing group: ${updatedGroup.name}`);
    } else {
      // Create new customization group
      const sandwichToppingsGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Sandwich Toppings',
          description: 'Choose your sandwich/burger toppings (up to 5)',
          type: 'MULTI_SELECT',
          isRequired: false,
          minSelections: 0,
          maxSelections: 5,
          sortOrder: 3,
          isActive: true,
          categoryId: sandwichBurgersCategory.id
        }
      });

      console.log(`✅ Created new group: ${sandwichToppingsGroup.name} (ID: ${sandwichToppingsGroup.id})`);
    }

    // Get the group (whether updated or created)
    const toppingsGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Sandwich Toppings' }
    });

    // Define the sandwich topping options
    const toppingOptions = [
      { name: 'Lettuce', price: 0.00, description: 'Fresh crisp lettuce' },
      { name: 'Tomatoes', price: 0.00, description: 'Fresh sliced tomatoes' },
      { name: 'Onions', price: 0.00, description: 'Fresh sliced onions' },
      { name: 'Pickles', price: 0.00, description: 'Crispy dill pickles' },
      { name: 'Jalapeños', price: 0.00, description: 'Spicy jalapeño peppers' }
    ];

    // Delete existing options first to avoid duplicates
    await prisma.customizationOption.deleteMany({
      where: { groupId: toppingsGroup.id }
    });

    // Create the topping options
    console.log('\n📝 Creating topping options:');
    for (const [index, option] of toppingOptions.entries()) {
      const createdOption = await prisma.customizationOption.create({
        data: {
          name: option.name,
          description: option.description,
          priceModifier: option.price,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: index + 1,
          groupId: toppingsGroup.id
        }
      });

      console.log(`   ✅ ${option.name} (+$${option.price.toFixed(2)}) - ID: ${createdOption.id}`);
    }

    console.log('\n🎉 Sandwich Toppings customization group created successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Group Name: ${toppingsGroup.name}`);
    console.log(`   Type: MULTI_SELECT`);
    console.log(`   Min Selections: 0`);
    console.log(`   Max Selections: 5`);
    console.log(`   Required: No`);
    console.log(`   Options: ${toppingOptions.length} toppings`);
    console.log(`   Category: ${sandwichBurgersCategory.name}`);

  } catch (error) {
    console.error('❌ Error creating sandwich toppings group:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSandwichToppingsGroup();
