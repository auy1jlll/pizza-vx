const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createZitiPasta() {
  try {
    console.log('Creating Ziti Pasta category...');
    
    // 1. Create Ziti Pasta category
    const zitiCategory = await prisma.menuCategory.create({
      data: {
        name: 'Ziti Pasta',
        slug: 'ziti-pasta',
        description: 'Fresh ziti pasta dishes with your choice of sauces, proteins, and toppings',
        isActive: true,
        sortOrder: 5
      }
    });

    console.log(`✓ Created category: ${zitiCategory.name}`);

    // 2. Create customization groups for ziti pasta
    
    // Base ingredients group (free items)
    const baseIngredientsGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: zitiCategory.id,
        name: 'Base Ingredients',
        description: 'Choose your base sauce and ingredients (free)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 1
      }
    });

    // Cheese group ($1.50)
    const cheeseGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: zitiCategory.id,
        name: 'Add Cheese',
        description: 'Add cheese (+$1.50 each)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 2
      }
    });

    // Garlic bread group ($1.75)
    const garlicBreadGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: zitiCategory.id,
        name: 'Garlic Bread',
        description: 'Add garlic bread (+$1.75)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: 1,
        sortOrder: 3
      }
    });

    // Vegetables group ($2.00)
    const vegetablesGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: zitiCategory.id,
        name: 'Vegetables',
        description: 'Add vegetables (+$2.00 each)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 4
      }
    });

    // Proteins $3.00 group
    const proteins3Group = await prisma.customizationGroup.create({
      data: {
        categoryId: zitiCategory.id,
        name: 'Proteins ($3.00)',
        description: 'Add proteins (+$3.00 each)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 5
      }
    });

    // Chicken cutlet group ($3.50)
    const chickenCutletGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: zitiCategory.id,
        name: 'Chicken Cutlet',
        description: 'Add chicken cutlet (+$3.50)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: 1,
        sortOrder: 6
      }
    });

    // Grilled chicken group ($4.00)
    const grilledChickenGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: zitiCategory.id,
        name: 'Grilled Chicken',
        description: 'Add grilled chicken (+$4.00)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: 1,
        sortOrder: 7
      }
    });

    // Steak tips group ($6.00)
    const steakTipsGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: zitiCategory.id,
        name: 'Steak Tips',
        description: 'Add steak tips (+$6.00)',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: 1,
        sortOrder: 8
      }
    });

    console.log('✓ Created 8 customization groups');

    // 3. Create customization options

    // Base ingredients options (free)
    const baseIngredients = [
      'No Protein', 'Alfredo Sauce', 'Butter Sauce'
    ];

    for (const ingredient of baseIngredients) {
      await prisma.customizationOption.create({
        data: {
          groupId: baseIngredientsGroup.id,
          name: ingredient,
          priceModifier: 0,
          priceType: 'FLAT',
          isActive: true
        }
      });
    }

    // Cheese options ($1.50 each)
    const cheeseOptions = [
      'Add Mozzarella Cheese', 'Add Provolone Cheese', 'Mozzarella Cheese', 'Provolone Cheese'
    ];

    for (const cheese of cheeseOptions) {
      await prisma.customizationOption.create({
        data: {
          groupId: cheeseGroup.id,
          name: cheese,
          priceModifier: 1.50,
          priceType: 'FLAT',
          isActive: true
        }
      });
    }

    // Garlic bread option ($1.75)
    await prisma.customizationOption.create({
      data: {
        groupId: garlicBreadGroup.id,
        name: 'Garlic Bread',
        priceModifier: 1.75,
        priceType: 'FLAT',
        isActive: true
      }
    });

    // Vegetables options ($2.00 each)
    const vegetableOptions = [
      'Add Broccoli', 'Broccoli'
    ];

    for (const vegetable of vegetableOptions) {
      await prisma.customizationOption.create({
        data: {
          groupId: vegetablesGroup.id,
          name: vegetable,
          priceModifier: 2.00,
          priceType: 'FLAT',
          isActive: true
        }
      });
    }

    // Proteins $3.00 options
    const proteins3Options = [
      'Eggplant', 'Meatballs', 'Veal'
    ];

    for (const protein of proteins3Options) {
      await prisma.customizationOption.create({
        data: {
          groupId: proteins3Group.id,
          name: protein,
          priceModifier: 3.00,
          priceType: 'FLAT',
          isActive: true
        }
      });
    }

    // Chicken cutlet option ($3.50)
    await prisma.customizationOption.create({
      data: {
        groupId: chickenCutletGroup.id,
        name: 'Chicken Cutlet',
        priceModifier: 3.50,
        priceType: 'FLAT',
        isActive: true
      }
    });

    // Grilled chicken option ($4.00)
    await prisma.customizationOption.create({
      data: {
        groupId: grilledChickenGroup.id,
        name: 'Grilled Chicken',
        priceModifier: 4.00,
        priceType: 'FLAT',
        isActive: true
      }
    });

    // Steak tips option ($6.00)
    await prisma.customizationOption.create({
      data: {
        groupId: steakTipsGroup.id,
        name: 'Steak Tips',
        priceModifier: 6.00,
        priceType: 'FLAT',
        isActive: true
      }
    });

    console.log('✓ Created customization options');

    // 4. Create menu items
    const zitiItems = [
      {
        name: 'Steak Tips Alfredo Ziti Pasta',
        description: 'Ziti with steak tips, broccoli and alfredo sauce',
        basePrice: 13.25
      },
      {
        name: 'Chicken Alfredo Ziti Pasta',
        description: 'Grilled chicken, broccoli and alfredo on bed of ziti',
        basePrice: 10.99
      },
      {
        name: 'Eggplant Marinara Ziti Pasta',
        description: 'Ziti with eggplant and marinara sauce',
        basePrice: 11.00
      },
      {
        name: 'Ziti Pasta Customize Your Own',
        description: 'Fresh ziti pasta you can have it as is or add your cheese, protein and broccoli',
        basePrice: 7.00
      },
      {
        name: 'Ziti Pasta with Meatballs',
        description: 'Ziti with meatballs and marinara',
        basePrice: 11.00
      }
    ];

    const createdItems = [];
    for (let i = 0; i < zitiItems.length; i++) {
      const item = zitiItems[i];
      const menuItem = await prisma.menuItem.create({
        data: {
          categoryId: zitiCategory.id,
          name: item.name,
          description: item.description,
          basePrice: item.basePrice,
          isActive: true,
          isAvailable: true,
          sortOrder: i + 1
        }
      });
      createdItems.push(menuItem);
      console.log(`✓ Created item: ${item.name} - $${item.basePrice}`);
    }

    // 5. Link menu items to customization groups
    const allGroups = [
      baseIngredientsGroup, cheeseGroup, garlicBreadGroup, vegetablesGroup,
      proteins3Group, chickenCutletGroup, grilledChickenGroup, steakTipsGroup
    ];

    for (const item of createdItems) {
      // Only the "Customize Your Own" item gets all customization options
      if (item.name === 'Ziti Pasta Customize Your Own') {
        for (let i = 0; i < allGroups.length; i++) {
          const group = allGroups[i];
          await prisma.menuItemCustomization.create({
            data: {
              menuItemId: item.id,
              customizationGroupId: group.id,
              isRequired: false,
              sortOrder: i + 1
            }
          });
        }
      } else {
        // Other items get limited customization (just base ingredients and extras)
        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: baseIngredientsGroup.id,
            isRequired: false,
            sortOrder: 1
          }
        });

        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: cheeseGroup.id,
            isRequired: false,
            sortOrder: 2
          }
        });

        await prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: garlicBreadGroup.id,
            isRequired: false,
            sortOrder: 3
          }
        });
      }
    }

    console.log('✓ Linked items to customization groups');

    console.log('\n🎉 Successfully created Ziti Pasta category!');
    console.log(`📊 Summary:`);
    console.log(`   - Category: ${zitiCategory.name}`);
    console.log(`   - Items created: ${createdItems.length}`);
    console.log(`   - Customization groups: 8`);
    console.log(`   - Special feature: "Customize Your Own" gets full customization options`);

  } catch (error) {
    console.error('❌ Error creating ziti pasta:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createZitiPasta();
