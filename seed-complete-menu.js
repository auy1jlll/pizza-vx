const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedMenuData() {
  console.log('🌱 Seeding complete menu data...\n');

  try {
    // First, clean existing data
    console.log('🧹 Cleaning existing menu data...');
    await prisma.orderItemCustomization.deleteMany();
    await prisma.cartItemCustomization.deleteMany();
    await prisma.menuItemCustomization.deleteMany();
    await prisma.customizationOption.deleteMany();
    await prisma.customizationGroup.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.menuCategory.deleteMany();

    // ========================================
    // 1. CREATE MENU CATEGORIES
    // ========================================
    console.log('📂 Creating menu categories...');

    const categories = await Promise.all([
      prisma.menuCategory.create({
        data: {
          name: 'Sandwiches',
          slug: 'sandwiches',
          description: 'Fresh sandwiches and subs made to order',
          isActive: true,
          sortOrder: 1
        }
      }),
      prisma.menuCategory.create({
        data: {
          name: 'Salads',
          slug: 'salads',
          description: 'Fresh, crisp salads with premium ingredients',
          isActive: true,
          sortOrder: 2
        }
      }),
      prisma.menuCategory.create({
        data: {
          name: 'Seafood',
          slug: 'seafood',
          description: 'Fresh seafood prepared to perfection',
          isActive: true,
          sortOrder: 3
        }
      }),
      prisma.menuCategory.create({
        data: {
          name: 'Dinner Plates',
          slug: 'dinner-plates',
          description: 'Hearty dinner plates with your choice of sides',
          isActive: true,
          sortOrder: 4
        }
      })
    ]);

    const [sandwichCategory, saladCategory, seafoodCategory, dinnerCategory] = categories;
    console.log(`✅ Created ${categories.length} categories`);

    // ========================================
    // 2. CREATE CUSTOMIZATION GROUPS
    // ========================================
    console.log('\n⚙️ Creating customization groups...');

    // Size groups (universal)
    const sizeGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Size',
        description: 'Choose your size',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 1,
        isActive: true
      }
    });

    // Sandwich-specific groups
    const breadGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: sandwichCategory.id,
        name: 'Bread',
        description: 'Choose your bread',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 2,
        isActive: true
      }
    });

    const condimentsGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: sandwichCategory.id,
        name: 'Condiments',
        description: 'Add condiments',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 3,
        isActive: true
      }
    });

    const sandwichToppingsGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: sandwichCategory.id,
        name: 'Toppings',
        description: 'Add toppings',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 4,
        isActive: true
      }
    });

    // Salad-specific groups
    const proteinGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: saladCategory.id,
        name: 'Protein',
        description: 'Add protein',
        type: 'SINGLE_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: 1,
        sortOrder: 2,
        isActive: true
      }
    });

    const dressingGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: saladCategory.id,
        name: 'Dressing',
        description: 'Choose your dressing',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 3,
        isActive: true
      }
    });

    const saladToppingsGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: saladCategory.id,
        name: 'Extra Toppings',
        description: 'Add extra toppings',
        type: 'MULTI_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: null,
        sortOrder: 4,
        isActive: true
      }
    });

    // Seafood-specific groups
    const preparationGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: seafoodCategory.id,
        name: 'Preparation',
        description: 'How would you like it prepared?',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 2,
        isActive: true
      }
    });

    const seasoningGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: seafoodCategory.id,
        name: 'Seasoning',
        description: 'Choose your seasoning',
        type: 'SINGLE_SELECT',
        isRequired: true,
        minSelections: 1,
        maxSelections: 1,
        sortOrder: 3,
        isActive: true
      }
    });

    const seafoodSidesGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: seafoodCategory.id,
        name: 'Side Dish',
        description: 'Choose a side dish',
        type: 'SINGLE_SELECT',
        isRequired: false,
        minSelections: 0,
        maxSelections: 1,
        sortOrder: 4,
        isActive: true
      }
    });

    // Dinner Plates specific groups
    const dinnerSidesGroup = await prisma.customizationGroup.create({
      data: {
        categoryId: dinnerCategory.id,
        name: 'Sides',
        description: 'Choose 2 of 3 sides',
        type: 'SPECIAL_LOGIC',
        isRequired: true,
        minSelections: 2,
        maxSelections: 2,
        sortOrder: 2,
        isActive: true
      }
    });

    console.log('✅ Created customization groups');

    // ========================================
    // 3. CREATE CUSTOMIZATION OPTIONS
    // ========================================
    console.log('\n🎛️ Creating customization options...');

    // Size options (universal)
    await Promise.all([
      prisma.customizationOption.create({
        data: {
          groupId: sizeGroup.id,
          name: 'Small',
          description: 'Perfect for light appetite',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 1
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: sizeGroup.id,
          name: 'Regular',
          description: 'Our most popular size',
          priceModifier: 2.00,
          priceType: 'FLAT',
          isDefault: true,
          isActive: true,
          sortOrder: 2
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: sizeGroup.id,
          name: 'Large',
          description: 'For big appetites',
          priceModifier: 4.00,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 3
        }
      })
    ]);

    // Bread options
    await Promise.all([
      prisma.customizationOption.create({
        data: {
          groupId: breadGroup.id,
          name: 'White',
          description: 'Classic white bread',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: true,
          isActive: true,
          sortOrder: 1
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: breadGroup.id,
          name: 'Wheat',
          description: 'Whole wheat bread',
          priceModifier: 0.50,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 2
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: breadGroup.id,
          name: 'Sourdough',
          description: 'Tangy sourdough bread',
          priceModifier: 1.00,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 3
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: breadGroup.id,
          name: 'Italian',
          description: 'Fresh Italian bread',
          priceModifier: 1.00,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 4
        }
      })
    ]);

    // Condiments
    await Promise.all([
      prisma.customizationOption.create({
        data: {
          groupId: condimentsGroup.id,
          name: 'Mayo',
          description: 'Creamy mayonnaise',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 1
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: condimentsGroup.id,
          name: 'Mustard',
          description: 'Classic yellow mustard',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 2
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: condimentsGroup.id,
          name: 'Ketchup',
          description: 'Tomato ketchup',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 3
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: condimentsGroup.id,
          name: 'Ranch',
          description: 'Creamy ranch dressing',
          priceModifier: 0.50,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 4
        }
      })
    ]);

    // Sandwich toppings
    await Promise.all([
      prisma.customizationOption.create({
        data: {
          groupId: sandwichToppingsGroup.id,
          name: 'Lettuce',
          description: 'Fresh crisp lettuce',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 1
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: sandwichToppingsGroup.id,
          name: 'Tomato',
          description: 'Fresh sliced tomatoes',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 2
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: sandwichToppingsGroup.id,
          name: 'Onion',
          description: 'Fresh sliced onions',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 3
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: sandwichToppingsGroup.id,
          name: 'Cheese',
          description: 'American cheese slice',
          priceModifier: 1.50,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 4
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: sandwichToppingsGroup.id,
          name: 'Bacon',
          description: 'Crispy bacon strips',
          priceModifier: 2.50,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 5
        }
      })
    ]);

    // Protein options
    await Promise.all([
      prisma.customizationOption.create({
        data: {
          groupId: proteinGroup.id,
          name: 'Grilled Chicken',
          description: 'Tender grilled chicken breast',
          priceModifier: 4.00,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 1
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: proteinGroup.id,
          name: 'Grilled Shrimp',
          description: 'Seasoned grilled shrimp',
          priceModifier: 6.00,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 2
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: proteinGroup.id,
          name: 'Salmon',
          description: 'Fresh grilled salmon',
          priceModifier: 8.00,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 3
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: proteinGroup.id,
          name: 'Turkey',
          description: 'Sliced turkey breast',
          priceModifier: 3.00,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 4
        }
      })
    ]);

    // Dressing options
    await Promise.all([
      prisma.customizationOption.create({
        data: {
          groupId: dressingGroup.id,
          name: 'Ranch',
          description: 'Creamy ranch dressing',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: true,
          isActive: true,
          sortOrder: 1
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: dressingGroup.id,
          name: 'Italian',
          description: 'Zesty Italian dressing',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 2
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: dressingGroup.id,
          name: 'Caesar',
          description: 'Classic Caesar dressing',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 3
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: dressingGroup.id,
          name: 'Balsamic',
          description: 'Balsamic vinaigrette',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 4
        }
      })
    ]);

    // Salad toppings
    await Promise.all([
      prisma.customizationOption.create({
        data: {
          groupId: saladToppingsGroup.id,
          name: 'Croutons',
          description: 'Crunchy garlic croutons',
          priceModifier: 1.00,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 1
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: saladToppingsGroup.id,
          name: 'Extra Cheese',
          description: 'Additional shredded cheese',
          priceModifier: 1.50,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 2
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: saladToppingsGroup.id,
          name: 'Avocado',
          description: 'Fresh sliced avocado',
          priceModifier: 2.50,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 3
        }
      })
    ]);

    // Preparation methods
    await Promise.all([
      prisma.customizationOption.create({
        data: {
          groupId: preparationGroup.id,
          name: 'Grilled',
          description: 'Grilled to perfection',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: true,
          isActive: true,
          sortOrder: 1
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: preparationGroup.id,
          name: 'Fried',
          description: 'Golden fried',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 2
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: preparationGroup.id,
          name: 'Baked',
          description: 'Oven baked',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 3
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: preparationGroup.id,
          name: 'Blackened',
          description: 'Cajun blackened',
          priceModifier: 1.00,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 4
        }
      })
    ]);

    // Seasoning options
    await Promise.all([
      prisma.customizationOption.create({
        data: {
          groupId: seasoningGroup.id,
          name: 'Lemon Pepper',
          description: 'Zesty lemon pepper seasoning',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: true,
          isActive: true,
          sortOrder: 1
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: seasoningGroup.id,
          name: 'Cajun',
          description: 'Spicy Cajun seasoning',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 2
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: seasoningGroup.id,
          name: 'Garlic Herb',
          description: 'Garlic and herb blend',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 3
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: seasoningGroup.id,
          name: 'Plain',
          description: 'No seasoning',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 4
        }
      })
    ]);

    // Seafood sides
    await Promise.all([
      prisma.customizationOption.create({
        data: {
          groupId: seafoodSidesGroup.id,
          name: 'French Fries',
          description: 'Crispy golden fries',
          priceModifier: 3.00,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 1
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: seafoodSidesGroup.id,
          name: 'Rice Pilaf',
          description: 'Seasoned rice pilaf',
          priceModifier: 3.00,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 2
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: seafoodSidesGroup.id,
          name: 'Steamed Vegetables',
          description: 'Fresh steamed vegetables',
          priceModifier: 3.50,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 3
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: seafoodSidesGroup.id,
          name: 'Coleslaw',
          description: 'Creamy coleslaw',
          priceModifier: 2.50,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 4
        }
      })
    ]);

    // Dinner sides (2 of 3 selection)
    await Promise.all([
      prisma.customizationOption.create({
        data: {
          groupId: dinnerSidesGroup.id,
          name: 'Mashed Potatoes',
          description: 'Creamy mashed potatoes',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 1
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: dinnerSidesGroup.id,
          name: 'Green Beans',
          description: 'Fresh green beans',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 2
        }
      }),
      prisma.customizationOption.create({
        data: {
          groupId: dinnerSidesGroup.id,
          name: 'Mac and Cheese',
          description: 'Creamy mac and cheese',
          priceModifier: 0,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 3
        }
      })
    ]);

    console.log('✅ Created customization options');

    // ========================================
    // 4. CREATE MENU ITEMS
    // ========================================
    console.log('\n🍽️ Creating menu items...');

    // Sandwiches
    const sandwichItems = await Promise.all([
      prisma.menuItem.create({
        data: {
          categoryId: sandwichCategory.id,
          name: 'Italian Sub',
          description: 'Ham, salami, pepperoni, provolone cheese with lettuce, tomato, onion',
          basePrice: 8.99,
          isActive: true,
          isAvailable: true,
          sortOrder: 1,
          preparationTime: 8
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: sandwichCategory.id,
          name: 'Turkey Club',
          description: 'Sliced turkey, bacon, lettuce, tomato, mayo on toasted bread',
          basePrice: 9.99,
          isActive: true,
          isAvailable: true,
          sortOrder: 2,
          preparationTime: 10
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: sandwichCategory.id,
          name: 'Chicken Parmesan Sub',
          description: 'Breaded chicken, marinara sauce, mozzarella cheese',
          basePrice: 10.99,
          isActive: true,
          isAvailable: true,
          sortOrder: 3,
          preparationTime: 12
        }
      })
    ]);

    // Salads
    const saladItems = await Promise.all([
      prisma.menuItem.create({
        data: {
          categoryId: saladCategory.id,
          name: 'Caesar Salad',
          description: 'Romaine lettuce, parmesan cheese, croutons, Caesar dressing',
          basePrice: 7.99,
          isActive: true,
          isAvailable: true,
          sortOrder: 1,
          preparationTime: 5
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: saladCategory.id,
          name: 'Garden Salad',
          description: 'Mixed greens, tomatoes, cucumbers, onions, choice of dressing',
          basePrice: 6.99,
          isActive: true,
          isAvailable: true,
          sortOrder: 2,
          preparationTime: 5
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: saladCategory.id,
          name: 'Chef Salad',
          description: 'Mixed greens, ham, turkey, cheese, hard boiled egg, choice of dressing',
          basePrice: 9.99,
          isActive: true,
          isAvailable: true,
          sortOrder: 3,
          preparationTime: 7
        }
      })
    ]);

    // Seafood
    const seafoodItems = await Promise.all([
      prisma.menuItem.create({
        data: {
          categoryId: seafoodCategory.id,
          name: 'Atlantic Salmon',
          description: 'Fresh Atlantic salmon fillet with your choice of preparation and seasoning',
          basePrice: 16.99,
          isActive: true,
          isAvailable: true,
          sortOrder: 1,
          preparationTime: 15
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: seafoodCategory.id,
          name: 'Shrimp Scampi',
          description: 'Large shrimp sautéed in garlic butter sauce',
          basePrice: 14.99,
          isActive: true,
          isAvailable: true,
          sortOrder: 2,
          preparationTime: 12
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: seafoodCategory.id,
          name: 'Fish and Chips',
          description: 'Beer battered cod with crispy french fries',
          basePrice: 12.99,
          isActive: true,
          isAvailable: true,
          sortOrder: 3,
          preparationTime: 18
        }
      })
    ]);

    // Dinner Plates
    const dinnerItems = await Promise.all([
      prisma.menuItem.create({
        data: {
          categoryId: dinnerCategory.id,
          name: 'Grilled Chicken Dinner',
          description: 'Grilled chicken breast with your choice of 2 sides',
          basePrice: 13.99,
          isActive: true,
          isAvailable: true,
          sortOrder: 1,
          preparationTime: 20
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: dinnerCategory.id,
          name: 'BBQ Ribs Dinner',
          description: 'Half rack of BBQ ribs with your choice of 2 sides',
          basePrice: 17.99,
          isActive: true,
          isAvailable: true,
          sortOrder: 2,
          preparationTime: 25
        }
      }),
      prisma.menuItem.create({
        data: {
          categoryId: dinnerCategory.id,
          name: 'Meatloaf Dinner',
          description: 'Homestyle meatloaf with gravy and your choice of 2 sides',
          basePrice: 12.99,
          isActive: true,
          isAvailable: true,
          sortOrder: 3,
          preparationTime: 18
        }
      })
    ]);

    console.log('✅ Created menu items');

    // ========================================
    // 5. LINK MENU ITEMS TO CUSTOMIZATION GROUPS
    // ========================================
    console.log('\n🔗 Linking menu items to customization groups...');

    // Link sandwich items to their customization groups
    for (const item of sandwichItems) {
      await Promise.all([
        prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: sizeGroup.id,
            isRequired: true,
            sortOrder: 1
          }
        }),
        prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: breadGroup.id,
            isRequired: true,
            sortOrder: 2
          }
        }),
        prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: condimentsGroup.id,
            isRequired: false,
            sortOrder: 3
          }
        }),
        prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: sandwichToppingsGroup.id,
            isRequired: false,
            sortOrder: 4
          }
        })
      ]);
    }

    // Link salad items to their customization groups
    for (const item of saladItems) {
      await Promise.all([
        prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: sizeGroup.id,
            isRequired: true,
            sortOrder: 1
          }
        }),
        prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: proteinGroup.id,
            isRequired: false,
            sortOrder: 2
          }
        }),
        prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: dressingGroup.id,
            isRequired: true,
            sortOrder: 3
          }
        }),
        prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: saladToppingsGroup.id,
            isRequired: false,
            sortOrder: 4
          }
        })
      ]);
    }

    // Link seafood items to their customization groups
    for (const item of seafoodItems) {
      await Promise.all([
        prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: preparationGroup.id,
            isRequired: true,
            sortOrder: 1
          }
        }),
        prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: seasoningGroup.id,
            isRequired: true,
            sortOrder: 2
          }
        }),
        prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: seafoodSidesGroup.id,
            isRequired: false,
            sortOrder: 3
          }
        })
      ]);
    }

    // Link dinner items to their customization groups
    for (const item of dinnerItems) {
      await Promise.all([
        prisma.menuItemCustomization.create({
          data: {
            menuItemId: item.id,
            customizationGroupId: dinnerSidesGroup.id,
            isRequired: true,
            sortOrder: 1
          }
        })
      ]);
    }

    console.log('✅ Linked menu items to customization groups');

    // ========================================
    // SUMMARY
    // ========================================
    console.log('\n📊 SEEDING SUMMARY');
    console.log('==================');
    console.log(`✅ Categories: ${categories.length}`);
    console.log(`✅ Menu Items: ${sandwichItems.length + saladItems.length + seafoodItems.length + dinnerItems.length}`);
    console.log(`✅ Customization Groups: 10`);
    console.log(`✅ Customization Options: ~45`);
    console.log('\n🎉 Menu data seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding menu data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedMenuData()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedMenuData;
