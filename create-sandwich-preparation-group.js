const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSandwichPreparationGroup() {
  try {
    console.log('🔍 Creating Sandwich Preparation Group...\n');

    // Find the Sandwiches & Burgers category
    const category = await prisma.menuCategory.findFirst({
      where: { slug: 'sandwiches-burgers' }
    });

    if (!category) {
      console.log('❌ Sandwiches & Burgers category not found');
      return;
    }

    console.log(`✅ Found category: ${category.name}`);

    // Create or find Preparation Group
    let preparationGroup = await prisma.customizationGroup.findFirst({
      where: { 
        name: 'Sandwich Preparation',
        categoryId: category.id
      }
    });

    if (preparationGroup) {
      console.log(`✅ Found existing group: ${preparationGroup.name}`);
      // Update if needed
      preparationGroup = await prisma.customizationGroup.update({
        where: { id: preparationGroup.id },
        data: {
          description: 'How would you like your sandwich prepared?',
          type: 'SINGLE_SELECT',
          isRequired: true,
          minSelections: 1,
          maxSelections: 1,
          sortOrder: 2,
          isActive: true
        }
      });
    } else {
      preparationGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Sandwich Preparation',
          description: 'How would you like your sandwich prepared?',
          type: 'SINGLE_SELECT',
          isRequired: true,
          minSelections: 1,
          maxSelections: 1,
          sortOrder: 2,
          isActive: true,
          categoryId: category.id
        }
      });
      console.log(`✅ Created new group: ${preparationGroup.name}`);
    }

    // Create preparation options
    const preparationOptions = [
      {
        name: 'Normal',
        description: 'Served as-is, fresh and cold',
        priceModifier: 0.00,
        priceType: 'FLAT',
        sortOrder: 1,
        isDefault: true
      },
      {
        name: 'Toasted',
        description: 'Lightly toasted for extra crunch',
        priceModifier: 0.00,
        priceType: 'FLAT',
        sortOrder: 2
      },
      {
        name: 'Grilled',
        description: 'Grilled to perfection with crispy exterior',
        priceModifier: 1.00,
        priceType: 'FLAT',
        sortOrder: 3
      }
    ];

    console.log('\n📝 Creating preparation options...');

    for (const option of preparationOptions) {
      const createdOption = await prisma.customizationOption.findFirst({
        where: {
          name: option.name,
          groupId: preparationGroup.id
        }
      }).then(async (existingOption) => {
        if (existingOption) {
          return await prisma.customizationOption.update({
            where: { id: existingOption.id },
            data: {
              description: option.description,
              priceModifier: option.priceModifier,
              priceType: option.priceType,
              isDefault: option.isDefault || false,
              isActive: true,
              sortOrder: option.sortOrder
            }
          });
        } else {
          return await prisma.customizationOption.create({
            data: {
              name: option.name,
              description: option.description,
              priceModifier: option.priceModifier,
              priceType: option.priceType,
              isDefault: option.isDefault || false,
              isActive: true,
              sortOrder: option.sortOrder,
              groupId: preparationGroup.id
            }
          });
        }
      });

      console.log(`   ✅ ${createdOption.name} (${createdOption.priceModifier >= 0 ? '+' : ''}$${createdOption.priceModifier.toFixed(2)})`);
    }

    console.log(`\n✅ Sandwich Preparation Group created with ${preparationOptions.length} options!`);
    return preparationGroup;

  } catch (error) {
    console.error('❌ Error creating preparation group:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSandwichPreparationGroup();
