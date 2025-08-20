const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSandwichCondimentsGroup() {
  try {
    console.log('🍯 Creating Sandwich Condiments Customization Group...\n');

    // Find the Sandwiches & Burgers category
    const sandwichBurgersCategory = await prisma.menuCategory.findFirst({
      where: {
        OR: [
          { name: { contains: 'Sandwich', mode: 'insensitive' } },
          { name: { contains: 'Burger', mode: 'insensitive' } }
        ]
      }
    });

    if (!sandwichBurgersCategory) {
      console.log('❌ Sandwiches and Burgers category not found!');
      return;
    }

    console.log(`✅ Found category: ${sandwichBurgersCategory.name} (ID: ${sandwichBurgersCategory.id})`);

    // Check if sandwich-condiments group already exists
    const existingGroup = await prisma.customizationGroup.findFirst({
      where: {
        name: 'Sandwich Condiments'
      }
    });

    if (existingGroup) {
      console.log('⚠️ Sandwich Condiments group already exists! Updating instead...');
      
      // Update the existing group
      const updatedGroup = await prisma.customizationGroup.update({
        where: { id: existingGroup.id },
        data: {
          name: 'Sandwich Condiments',
          description: 'Choose your sandwich condiments (up to 5)',
          type: 'MULTI_SELECT',
          isRequired: false,
          minSelections: 0,
          maxSelections: 5,
          sortOrder: 4,
          isActive: true,
          categoryId: sandwichBurgersCategory.id
        }
      });

      console.log(`✅ Updated existing group: ${updatedGroup.name}`);
    } else {
      // Create new customization group
      const sandwichCondimentsGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Sandwich Condiments',
          description: 'Choose your sandwich condiments (up to 5)',
          type: 'MULTI_SELECT',
          isRequired: false,
          minSelections: 0,
          maxSelections: 5,
          sortOrder: 4,
          isActive: true,
          categoryId: sandwichBurgersCategory.id
        }
      });

      console.log(`✅ Created new group: ${sandwichCondimentsGroup.name} (ID: ${sandwichCondimentsGroup.id})`);
    }

    // Get the group (whether updated or created)
    const condimentsGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Sandwich Condiments' }
    });

    // Define the sandwich condiment options
    const condimentOptions = [
      { name: 'Ketchup', price: 0.00, description: 'Classic tomato ketchup' },
      { name: 'Mustard', price: 0.00, description: 'Yellow mustard' },
      { name: 'Spicy Mustard', price: 0.00, description: 'Spicy brown mustard' },
      { name: 'BBQ Sauce', price: 0.00, description: 'Tangy barbecue sauce' },
      { name: 'Mayonnaise', price: 0.00, description: 'Creamy mayonnaise' },
      { name: 'Honey Mustard', price: 0.00, description: 'Sweet honey mustard' },
      { name: 'House Sauce', price: 0.00, description: 'Our signature house sauce' },
      { name: 'Horse Radish', price: 0.00, description: 'Spicy horseradish sauce' }
    ];

    // Delete existing options first to avoid duplicates
    await prisma.customizationOption.deleteMany({
      where: { groupId: condimentsGroup.id }
    });

    // Create the condiment options
    console.log('\n📝 Creating condiment options:');
    for (const [index, option] of condimentOptions.entries()) {
      const createdOption = await prisma.customizationOption.create({
        data: {
          name: option.name,
          description: option.description,
          priceModifier: option.price,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: index + 1,
          groupId: condimentsGroup.id
        }
      });

      console.log(`   ✅ ${option.name} (+$${option.price.toFixed(2)}) - ID: ${createdOption.id}`);
    }

    // Get all menu items in the Sandwiches & Burgers category
    const menuItems = await prisma.menuItem.findMany({
      where: { categoryId: sandwichBurgersCategory.id },
      select: { id: true, name: true }
    });

    console.log(`\n🔗 Linking Sandwich Condiments group to menu items...`);
    
    for (const item of menuItems) {
      // Check if this link already exists
      const existingLink = await prisma.menuItemCustomization.findFirst({
        where: {
          menuItemId: item.id,
          customizationGroupId: condimentsGroup.id
        }
      });

      if (existingLink) {
        console.log(`   ⚠️ ${item.name} - Already linked, skipping`);
      } else {
        // Create the link
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: condimentsGroup.id,
            isRequired: false,
            sortOrder: 2
          }
        });
        console.log(`   ✅ ${item.name} - Linked successfully`);
      }
    }

    console.log('\n🎉 Sandwich Condiments customization group created successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Group Name: ${condimentsGroup.name}`);
    console.log(`   Type: MULTI_SELECT`);
    console.log(`   Min Selections: 0`);
    console.log(`   Max Selections: 5`);
    console.log(`   Required: No`);
    console.log(`   Options: ${condimentOptions.length} condiments`);
    console.log(`   Category: ${sandwichBurgersCategory.name}`);
    console.log(`   Linked to: ${menuItems.length} menu items`);

    // Final verification
    console.log('\n🔍 Final Verification:');
    const verificationItems = await prisma.menuItem.findMany({
      where: { categoryId: sandwichBurgersCategory.id },
      include: {
        customizationGroups: {
          include: {
            customizationGroup: {
              select: { name: true, type: true }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    verificationItems.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name} - ${item.customizationGroups.length} customization groups`);
      item.customizationGroups.forEach(cg => {
        console.log(`      - ${cg.customizationGroup.name} (${cg.customizationGroup.type})`);
      });
    });

  } catch (error) {
    console.error('❌ Error creating sandwich condiments group:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSandwichCondimentsGroup();
