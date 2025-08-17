const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedCustomizationGroups() {
  try {
    console.log('Seeding customization groups and options...');

    // Find the Sandwiches category for menu items
    const sandwichCategory = await prisma.menuCategory.findFirst({
      where: { slug: 'sandwiches' }
    });

    if (!sandwichCategory) {
      console.error('Sandwiches category not found');
      return;
    }

    // 1. Size - SINGLE_SELECT (3 options)
    let sizeGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Size', categoryId: sandwichCategory.id }
    });

    if (!sizeGroup) {
      sizeGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Size',
          type: 'SINGLE_SELECT',
          categoryId: sandwichCategory.id,
          isRequired: true,
          sortOrder: 1
        }
      });
    }

    const sizeOptions = [
      { name: 'Small (6")', price: 0.00 },
      { name: 'Medium (8")', price: 2.00 },
      { name: 'Large (12")', price: 4.00 }
    ];

    for (let i = 0; i < sizeOptions.length; i++) {
      const existing = await prisma.customizationOption.findFirst({
        where: { groupId: sizeGroup.id, name: sizeOptions[i].name }
      });

      if (!existing) {
        await prisma.customizationOption.create({
          data: {
            groupId: sizeGroup.id,
            name: sizeOptions[i].name,
            priceModifier: sizeOptions[i].price,
            priceType: 'FLAT',
            isDefault: i === 0,
            sortOrder: i + 1
          }
        });
      }
    }

    // 2. Bread - SINGLE_SELECT (5 options)
    let breadGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Bread', categoryId: sandwichCategory.id }
    });

    if (!breadGroup) {
      breadGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Bread',
          type: 'SINGLE_SELECT',
          categoryId: sandwichCategory.id,
          isRequired: true,
          sortOrder: 2
        }
      });
    }

    const breadOptions = [
      { name: 'White Sub Roll', price: 0.00 },
      { name: 'Wheat Sub Roll', price: 0.50 },
      { name: 'Italian Herb Roll', price: 0.75 },
      { name: 'Sourdough', price: 1.00 },
      { name: 'Ciabatta', price: 1.25 }
    ];

    for (let i = 0; i < breadOptions.length; i++) {
      const existing = await prisma.customizationOption.findFirst({
        where: { groupId: breadGroup.id, name: breadOptions[i].name }
      });

      if (!existing) {
        await prisma.customizationOption.create({
          data: {
            groupId: breadGroup.id,
            name: breadOptions[i].name,
            priceModifier: breadOptions[i].price,
            priceType: 'FLAT',
            isDefault: i === 0,
            sortOrder: i + 1
          }
        });
      }
    }

    // 3. Cheese - MULTI_SELECT (5 options)
    let cheeseGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Cheese', categoryId: sandwichCategory.id }
    });

    if (!cheeseGroup) {
      cheeseGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Cheese',
          type: 'MULTI_SELECT',
          categoryId: sandwichCategory.id,
          isRequired: false,
          sortOrder: 3
        }
      });
    }

    const cheeseOptions = [
      { name: 'American Cheese', price: 1.00 },
      { name: 'Provolone', price: 1.25 },
      { name: 'Swiss', price: 1.25 },
      { name: 'Cheddar', price: 1.00 },
      { name: 'Mozzarella', price: 1.50 }
    ];

    for (let i = 0; i < cheeseOptions.length; i++) {
      const existing = await prisma.customizationOption.findFirst({
        where: { groupId: cheeseGroup.id, name: cheeseOptions[i].name }
      });

      if (!existing) {
        await prisma.customizationOption.create({
          data: {
            groupId: cheeseGroup.id,
            name: cheeseOptions[i].name,
            priceModifier: cheeseOptions[i].price,
            priceType: 'FLAT',
            sortOrder: i + 1
          }
        });
      }
    }

    // 4. Vegetables - MULTI_SELECT (8 options)
    let vegetableGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Vegetables', categoryId: sandwichCategory.id }
    });

    if (!vegetableGroup) {
      vegetableGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Vegetables',
          type: 'MULTI_SELECT',
          categoryId: sandwichCategory.id,
          isRequired: false,
          sortOrder: 4
        }
      });
    }

    const vegetableOptions = [
      { name: 'Lettuce', price: 0.00 },
      { name: 'Tomato', price: 0.00 },
      { name: 'Onions', price: 0.00 },
      { name: 'Pickles', price: 0.00 },
      { name: 'Bell Peppers', price: 0.50 },
      { name: 'Mushrooms', price: 0.75 },
      { name: 'Jalapeños', price: 0.50 },
      { name: 'Avocado', price: 1.50 }
    ];

    for (let i = 0; i < vegetableOptions.length; i++) {
      const existing = await prisma.customizationOption.findFirst({
        where: { groupId: vegetableGroup.id, name: vegetableOptions[i].name }
      });

      if (!existing) {
        await prisma.customizationOption.create({
          data: {
            groupId: vegetableGroup.id,
            name: vegetableOptions[i].name,
            priceModifier: vegetableOptions[i].price,
            priceType: 'FLAT',
            sortOrder: i + 1
          }
        });
      }
    }

    // 5. Condiments - MULTI_SELECT (7 options)
    let condimentGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Condiments', categoryId: sandwichCategory.id }
    });

    if (!condimentGroup) {
      condimentGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Condiments',
          type: 'MULTI_SELECT',
          categoryId: sandwichCategory.id,
          isRequired: false,
          sortOrder: 5
        }
      });
    }

    const condimentOptions = [
      { name: 'Mayo', price: 0.00 },
      { name: 'Mustard', price: 0.00 },
      { name: 'Italian Dressing', price: 0.00 },
      { name: 'Ranch', price: 0.25 },
      { name: 'Hot Sauce', price: 0.00 },
      { name: 'BBQ Sauce', price: 0.25 },
      { name: 'Pesto', price: 0.75 }
    ];

    for (let i = 0; i < condimentOptions.length; i++) {
      const existing = await prisma.customizationOption.findFirst({
        where: { groupId: condimentGroup.id, name: condimentOptions[i].name }
      });

      if (!existing) {
        await prisma.customizationOption.create({
          data: {
            groupId: condimentGroup.id,
            name: condimentOptions[i].name,
            priceModifier: condimentOptions[i].price,
            priceType: 'FLAT',
            sortOrder: i + 1
          }
        });
      }
    }

    // 6. Extras - MULTI_SELECT (4 options)
    let extrasGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Extras', categoryId: sandwichCategory.id }
    });

    if (!extrasGroup) {
      extrasGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Extras',
          type: 'MULTI_SELECT',
          categoryId: sandwichCategory.id,
          isRequired: false,
          sortOrder: 6
        }
      });
    }

    const extrasOptions = [
      { name: 'Extra Meat', price: 3.00 },
      { name: 'Extra Cheese', price: 1.50 },
      { name: 'Bacon', price: 2.00 },
      { name: 'Make it a Combo', price: 4.50 }
    ];

    for (let i = 0; i < extrasOptions.length; i++) {
      const existing = await prisma.customizationOption.findFirst({
        where: { groupId: extrasGroup.id, name: extrasOptions[i].name }
      });

      if (!existing) {
        await prisma.customizationOption.create({
          data: {
            groupId: extrasGroup.id,
            name: extrasOptions[i].name,
            priceModifier: extrasOptions[i].price,
            priceType: 'FLAT',
            sortOrder: i + 1
          }
        });
      }
    }

    console.log('✅ Successfully seeded all customization groups and options!');
    console.log('Created groups:');
    console.log('- Size (3 options)');
    console.log('- Bread (5 options)');
    console.log('- Cheese (5 options)');
    console.log('- Vegetables (8 options)');
    console.log('- Condiments (7 options)');
    console.log('- Extras (4 options)');

  } catch (error) {
    console.error('Error seeding customization groups:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCustomizationGroups();
