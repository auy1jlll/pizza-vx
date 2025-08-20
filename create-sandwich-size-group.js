const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSandwichSizeGroup() {
  try {
    console.log('🔍 Creating Sandwich Size Group...\n');

    // Find the Sandwiches & Burgers category
    const category = await prisma.menuCategory.findFirst({
      where: { slug: 'sandwiches-burgers' }
    });

    if (!category) {
      console.log('❌ Sandwiches & Burgers category not found');
      return;
    }

    console.log(`✅ Found category: ${category.name}`);

    // Create or find Size Group
    let sizeGroup = await prisma.customizationGroup.findFirst({
      where: { 
        name: 'Sandwich Size',
        categoryId: category.id
      }
    });

    if (sizeGroup) {
      console.log(`✅ Found existing group: ${sizeGroup.name}`);
      // Update if needed
      sizeGroup = await prisma.customizationGroup.update({
        where: { id: sizeGroup.id },
        data: {
          description: 'Choose your sandwich size',
          type: 'SINGLE_SELECT',
          isRequired: true,
          minSelections: 1,
          maxSelections: 1,
          sortOrder: 1,
          isActive: true
        }
      });
    } else {
      sizeGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Sandwich Size',
          description: 'Choose your sandwich size',
          type: 'SINGLE_SELECT',
          isRequired: true,
          minSelections: 1,
          maxSelections: 1,
          sortOrder: 1,
          isActive: true,
          categoryId: category.id
        }
      });
      console.log(`✅ Created new group: ${sizeGroup.name}`);
    }

    // Create size options
    const sizeOptions = [
      {
        name: 'Junior',
        description: 'Smaller portion, perfect for light appetite',
        priceModifier: -2.00,
        priceType: 'FLAT',
        sortOrder: 1
      },
      {
        name: 'Regular Sesame',
        description: 'Standard size on sesame seed bun',
        priceModifier: 0.00,
        priceType: 'FLAT',
        sortOrder: 2,
        isDefault: true
      },
      {
        name: 'Onion Roll (Supreme)',
        description: 'Large size on premium onion roll',
        priceModifier: 3.50,
        priceType: 'FLAT',
        sortOrder: 3
      }
    ];

    console.log('\n📝 Creating size options...');

    for (const option of sizeOptions) {
      const createdOption = await prisma.customizationOption.findFirst({
        where: {
          name: option.name,
          groupId: sizeGroup.id
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
              groupId: sizeGroup.id
            }
          });
        }
      });

      console.log(`   ✅ ${createdOption.name} (${createdOption.priceModifier >= 0 ? '+' : ''}$${createdOption.priceModifier.toFixed(2)})`);
    }

    console.log(`\n✅ Sandwich Size Group created with ${sizeOptions.length} options!`);
    return sizeGroup;

  } catch (error) {
    console.error('❌ Error creating size group:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSandwichSizeGroup();
