const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createCalzones() {
  console.log('🍕 Creating Calzones category and menu items...');

  try {
    // Step 1: Create or find Calzones category
    console.log('📁 Creating/finding Calzones category...');
    let calzoneCategory;
    
    try {
      calzoneCategory = await prisma.menuCategory.create({
        data: {
          name: 'Calzones',
          slug: 'calzones',
          description: 'Delicious baked calzones with various fillings',
          isActive: true,
          sortOrder: 8
        }
      });
      console.log('✅ Created new category:', calzoneCategory.name);
    } catch (error) {
      if (error.code === 'P2002') {
        calzoneCategory = await prisma.menuCategory.findUnique({
          where: { name: 'Calzones' }
        });
        console.log('✅ Found existing category:', calzoneCategory?.name);
      } else {
        throw error;
      }
    }

    // Step 2: Find the calzone size customization group
    console.log('🔍 Finding calzone size customization group...');
    const sizeGroup = await prisma.customizationGroup.findFirst({
      where: {
        name: {
          contains: 'Size',
          mode: 'insensitive'
        }
      },
      include: {
        options: true
      }
    });

    if (!sizeGroup) {
      console.log('⚠️ No size group found, creating one...');
      const newSizeGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Calzone Size',
          description: 'Choose your calzone size',
          type: 'SINGLE_SELECT',
          isRequired: true,
          minSelections: 1,
          maxSelections: 1,
          categoryId: calzoneCategory.id,
          isActive: true,
          sortOrder: 1
        }
      });
      console.log('✅ Created size group:', newSizeGroup.name);
    } else {
      console.log('✅ Found existing size group:', sizeGroup.name);
      console.log('📋 Size options:', sizeGroup.options.map(opt => `${opt.name} (+$${opt.priceModifier})`));
    }

    // Step 3: Create calzone menu items
    const calzoneItems = [
      {
        name: 'Veggie Calzone',
        description: 'Roasted peppers, roasted onions, grilled tomatoes, mushrooms and broccoli',
        basePrice: 11.99
      },
      {
        name: 'Traditional Calzone',
        description: 'Pepperoni, ricotta cheese, sauce and our blends of mozzarella cheese',
        basePrice: 12.99
      },
      {
        name: 'Ham & Cheese Calzone',
        description: 'Sauce, a blend of our cheese and ham and american cheese',
        basePrice: 12.99
      },
      {
        name: 'Chicken Parmesan Calzone',
        description: 'Chicken parmesan, ricotta cheese with marinara sauce',
        basePrice: 13.99
      },
      {
        name: 'Chicken Broccoli Alfredo Calzone',
        description: 'Chicken, broccoli and onions with white alfredo sauce',
        basePrice: 13.99
      },
      {
        name: 'Greek Calzone',
        description: 'Feta, spinach and tomatoes',
        basePrice: 12.99
      },
      {
        name: 'Meatballs Calzone',
        description: 'Meatballs in marinara sauce and a blend of our cheese',
        basePrice: 13.99
      }
    ];

    console.log('🍽️ Creating calzone menu items...');
    let sortOrder = 1;

    for (const item of calzoneItems) {
      try {
        const menuItem = await prisma.menuItem.create({
          data: {
            name: item.name,
            description: item.description,
            basePrice: item.basePrice,
            categoryId: calzoneCategory.id,
            isActive: true,
            isAvailable: true,
            sortOrder: sortOrder++,
            preparationTime: 15 // 15 minutes prep time for calzones
          }
        });
        console.log(`✅ Created: ${menuItem.name} - $${menuItem.basePrice}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️ ${item.name} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating ${item.name}:`, error.message);
        }
      }
    }

    // Step 4: Link calzone category to size customization group (if we created/found one)
    const finalSizeGroup = sizeGroup || await prisma.customizationGroup.findFirst({
      where: { categoryId: calzoneCategory.id }
    });

    if (finalSizeGroup && finalSizeGroup.categoryId !== calzoneCategory.id) {
      await prisma.customizationGroup.update({
        where: { id: finalSizeGroup.id },
        data: { categoryId: calzoneCategory.id }
      });
      console.log('🔗 Linked size group to calzone category');
    }

    console.log('\n🎉 Calzones setup complete!');
    console.log('📋 Summary:');
    console.log(`   Category: ${calzoneCategory.name}`);
    console.log(`   Items: ${calzoneItems.length} calzones created`);
    console.log(`   Customization: Size group linked`);
    console.log('\n💡 You can now:');
    console.log('   1. View calzones at: /menu/calzones');
    console.log('   2. Manage them at: /admin/menu-manager');
    console.log('   3. Add size options if needed at: /admin/menu-manager/customization-options/new');

  } catch (error) {
    console.error('❌ Error creating calzones:', error);
  } finally {
    // Don't disconnect Prisma when dev server is running
    // await prisma.$disconnect();
    console.log('✅ Script completed (keeping database connection alive for dev server)');
  }
}

createCalzones();
