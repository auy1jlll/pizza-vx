const { PrismaClient } = require('@prisma/client');

async function seedSaladDressingCustomizations() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🥗 Adding salad dressing customization options...\n');
    
    // Get the Salads category
    const saladCategory = await prisma.menuCategory.findUnique({
      where: { slug: 'salads' }
    });
    
    if (!saladCategory) {
      throw new Error('Salads category not found! Please run the salad seeding script first.');
    }
    
    console.log('✅ Found Salads category:', saladCategory.name);
    
    // Create Dressing customization group
    const dressingGroup = await prisma.customizationGroup.create({
      data: {
        name: 'Dressing',
        description: 'Choose your salad dressing',
        type: 'SINGLE_SELECT', // Customer can only choose one dressing
        isRequired: false, // Dressing is optional
        categoryId: saladCategory.id,
        sortOrder: 1
      }
    });
    
    console.log('✅ Created Dressing customization group');
    
    // Create all the dressing options
    const dressingOptions = [
      { name: 'Honey Mustard', priceModifier: 0.00, sortOrder: 1 },
      { name: 'Balsamic Dressing', priceModifier: 0.00, sortOrder: 2 },
      { name: 'Bleu Cheese', priceModifier: 0.00, sortOrder: 3 },
      { name: 'Oil & Vinegar', priceModifier: 0.00, sortOrder: 4 },
      { name: 'Caesar Dressing', priceModifier: 0.00, sortOrder: 5 },
      { name: 'House Dressing', priceModifier: 0.00, sortOrder: 6 },
      { name: 'Italian Dressing', priceModifier: 0.00, sortOrder: 7 },
      { name: 'Ranch Dressing', priceModifier: 0.00, sortOrder: 8 }
    ];
    
    console.log('\n📝 Creating dressing options...');
    
    for (const option of dressingOptions) {
      const createdOption = await prisma.customizationOption.create({
        data: {
          name: option.name,
          description: `${option.name} (Free)`,
          priceModifier: option.priceModifier,
          priceType: 'FLAT',
          groupId: dressingGroup.id,
          isActive: true,
          sortOrder: option.sortOrder
        }
      });
      console.log(`✅ ${createdOption.name} - Free`);
    }
    
    // Now link this customization group to all salad menu items
    const saladItems = await prisma.menuItem.findMany({
      where: { categoryId: saladCategory.id }
    });
    
    console.log('\n🔗 Linking dressing options to all salad items...');
    
    for (const item of saladItems) {
      await prisma.menuItemCustomization.create({
        data: {
          menuItemId: item.id,
          customizationGroupId: dressingGroup.id
        }
      });
      console.log(`✅ Linked dressings to: ${item.name}`);
    }
    
    console.log('\n🎉 Successfully created salad dressing customizations!');
    console.log(`📊 Created ${dressingOptions.length} dressing options`);
    console.log(`🔗 Linked to ${saladItems.length} salad items`);
    
    // Verify the data
    const verifyGroup = await prisma.customizationGroup.findUnique({
      where: { id: dressingGroup.id },
      include: {
        customizationOptions: {
          orderBy: { sortOrder: 'asc' }
        },
        menuItemCustomizations: {
          include: {
            menuItem: {
              select: { name: true }
            }
          }
        }
      }
    });
    
    console.log('\n📋 Verification:');
    console.log(`Group: ${verifyGroup.name} (${verifyGroup.type})`);
    console.log(`Options: ${verifyGroup.customizationOptions.length}`);
    console.log(`Applied to: ${verifyGroup.menuItemCustomizations.length} menu items`);
    
  } catch (error) {
    console.error('❌ Error creating salad dressing customizations:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSaladDressingCustomizations();
