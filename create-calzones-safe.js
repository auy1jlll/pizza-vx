/**
 * Safe Calzone Creation Script
 * 
 * This version uses proper database connection management to prevent server crashes.
 */

import { createIsolatedPrismaClient } from './src/lib/prisma';

async function createCalzonesSafely() {
  console.log('🍕 Creating Calzones category and menu items safely...');
  
  // Use isolated client to prevent interference with dev server
  const prisma = createIsolatedPrismaClient();

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

    // Step 2: Find or create calzone size customization group
    console.log('🔍 Finding/creating calzone size customization group...');
    let sizeGroup = await prisma.customizationGroup.findFirst({
      where: {
        name: 'Calzone Size'
      },
      include: {
        options: true
      }
    });

    if (!sizeGroup) {
      console.log('⚠️ Creating calzone-specific size group...');
      sizeGroup = await prisma.customizationGroup.create({
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

      // Create size options
      await prisma.customizationOption.createMany({
        data: [
          {
            groupId: sizeGroup.id,
            name: 'Small',
            description: 'Perfect for one person',
            priceModifier: 0,
            priceType: 'FIXED',
            isDefault: true,
            isActive: true,
            sortOrder: 1
          },
          {
            groupId: sizeGroup.id,
            name: 'Large',
            description: 'Great for sharing',
            priceModifier: 2.00,
            priceType: 'FIXED',
            isDefault: false,
            isActive: true,
            sortOrder: 2
          }
        ]
      });

      console.log('✅ Created calzone size group with Small/Large options');
    } else {
      console.log('✅ Found existing calzone size group:', sizeGroup.name);
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
    let created = 0;
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
        created++;
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️ ${item.name} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating ${item.name}:`, error.message);
        }
      }
    }

    console.log('\n🎉 Calzones setup complete!');
    console.log('📋 Summary:');
    console.log(`   Category: ${calzoneCategory.name}`);
    console.log(`   Items: ${created} calzones created`);
    console.log(`   Customization: ${sizeGroup.name} linked`);
    console.log('\n💡 You can now:');
    console.log('   1. View calzones at: /menu/calzones');
    console.log('   2. Manage them at: /admin/menu-manager');
    console.log('   3. Customize sizes in the admin interface');

  } catch (error) {
    console.error('❌ Error creating calzones:', error);
    throw error;
  } finally {
    // Safe disconnect - only for isolated scripts
    try {
      await prisma.$disconnect();
      console.log('🔌 Database connection closed safely');
    } catch (disconnectError) {
      console.warn('⚠️ Warning during disconnect:', disconnectError);
    }
  }
}

// Only run if called directly
if (require.main === module) {
  createCalzonesSafely()
    .then(() => {
      console.log('🎯 Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export default createCalzonesSafely;
