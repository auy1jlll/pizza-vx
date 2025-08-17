const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function copySeafoodToDinnerPlates() {
  try {
    console.log('🔍 Checking seafood category...');
    
    // Get the seafood category with all its data
    const seafoodCategory = await prisma.menuCategory.findFirst({
      where: { slug: 'seafood' },
      include: {
        menuItems: {
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
        }
      }
    });

    if (!seafoodCategory) {
      console.log('❌ No seafood category found to copy');
      return;
    }

    console.log(`📋 Found seafood category with ${seafoodCategory.menuItems.length} items`);

    // Check if dinner plates already exists
    const existingDinnerPlates = await prisma.menuCategory.findFirst({
      where: { slug: 'dinner-plates' }
    });

    if (existingDinnerPlates) {
      console.log('❌ Dinner plates category already exists');
      return;
    }

    console.log('🔧 Creating dinner plates category...');

    // Create the new dinner plates category
    const dinnerPlatesCategory = await prisma.menuCategory.create({
      data: {
        name: 'Dinner Plates',
        slug: 'dinner-plates',
        description: seafoodCategory.description || 'Hearty dinner plates with various options',
        parentCategoryId: seafoodCategory.parentCategoryId,
        imageUrl: seafoodCategory.imageUrl,
        isActive: true,
        sortOrder: seafoodCategory.sortOrder + 1
      }
    });

    console.log(`✅ Created dinner plates category: ${dinnerPlatesCategory.name}`);

    // Copy all menu items from seafood to dinner plates
    for (const seafoodItem of seafoodCategory.menuItems) {
      console.log(`\n🔧 Copying menu item: ${seafoodItem.name}`);

      // Create the new menu item
      const newMenuItem = await prisma.menuItem.create({
        data: {
          categoryId: dinnerPlatesCategory.id,
          name: seafoodItem.name.replace('Seafood', 'Dinner').replace('Fish', 'Chicken'), // Basic name transformation
          description: seafoodItem.description,
          basePrice: seafoodItem.basePrice,
          imageUrl: seafoodItem.imageUrl,
          isActive: true,
          isAvailable: true,
          sortOrder: seafoodItem.sortOrder,
          preparationTime: seafoodItem.preparationTime,
          allergens: seafoodItem.allergens,
          nutritionInfo: seafoodItem.nutritionInfo
        }
      });

      console.log(`  ✅ Created menu item: ${newMenuItem.name}`);

      // Copy customization groups and options
      for (const itemCustomization of seafoodItem.customizationGroups) {
        const originalGroup = itemCustomization.customizationGroup;
        
        console.log(`    🔧 Copying customization group: ${originalGroup.name}`);

        // Create new customization group for dinner plates
        const newGroup = await prisma.customizationGroup.create({
          data: {
            categoryId: dinnerPlatesCategory.id,
            name: originalGroup.name,
            description: originalGroup.description,
            type: originalGroup.type,
            isRequired: originalGroup.isRequired,
            minSelections: originalGroup.minSelections,
            maxSelections: originalGroup.maxSelections,
            sortOrder: originalGroup.sortOrder,
            isActive: true
          }
        });

        // Copy all options for this group
        for (const option of originalGroup.options) {
          await prisma.customizationOption.create({
            data: {
              groupId: newGroup.id,
              name: option.name,
              description: option.description,
              priceModifier: option.priceModifier,
              priceType: option.priceType,
              isDefault: option.isDefault,
              isActive: true,
              sortOrder: option.sortOrder,
              maxQuantity: option.maxQuantity,
              nutritionInfo: option.nutritionInfo,
              allergens: option.allergens
            }
          });
        }

        console.log(`      ✅ Copied ${originalGroup.options.length} options`);

        // Link the customization group to the menu item
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: newMenuItem.id,
            customizationGroupId: newGroup.id,
            isRequired: itemCustomization.isRequired,
            sortOrder: itemCustomization.sortOrder
          }
        });

        console.log(`      ✅ Linked group to menu item`);
      }
    }

    console.log('\n✅ Successfully copied seafood category to dinner plates!');
    
    // Show final result
    const finalCategories = await prisma.menuCategory.findMany({
      select: { name: true, slug: true },
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log('\n📋 All categories:');
    finalCategories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug})`);
    });

  } catch (error) {
    console.error('❌ Error copying seafood to dinner plates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

copySeafoodToDinnerPlates();
