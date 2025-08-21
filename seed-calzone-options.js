const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createCalzoneOptions() {
  try {
    console.log('🍕 Creating Calzone Size options directly in database...');
    
    // First, find or create the calzone size group
    let calzoneGroup = await prisma.customizationGroup.findFirst({
      where: {
        name: { contains: 'calzone', mode: 'insensitive' }
      }
    });
    
    if (!calzoneGroup) {
      console.log('Creating Calzone Size group...');
      calzoneGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Calzone Size',
          description: 'Choose your calzone size',
          type: 'SINGLE_SELECT',
          isRequired: true,
          minSelections: 1,
          maxSelections: 1,
          sortOrder: 1,
          isActive: true
        }
      });
      console.log('✅ Created group:', calzoneGroup.name);
    } else {
      console.log('✅ Found existing group:', calzoneGroup.name);
    }
    
    // Create Small Calzone option
    const smallCalzone = await prisma.customizationOption.create({
      data: {
        name: 'Small Calzone',
        description: 'Regular size calzone',
        priceModifier: 0.0,
        priceType: 'FLAT',
        isDefault: true,
        isActive: true,
        sortOrder: 1,
        customizationGroupId: calzoneGroup.id
      }
    });
    
    // Create Large Calzone option
    const largeCalzone = await prisma.customizationOption.create({
      data: {
        name: 'Large Calzone',
        description: 'Extra large calzone',
        priceModifier: 3.0,
        priceType: 'FLAT',
        isDefault: false,
        isActive: true,
        sortOrder: 2,
        customizationGroupId: calzoneGroup.id
      }
    });
    
    console.log('✅ Created:', smallCalzone.name, '- No extra charge (default)');
    console.log('✅ Created:', largeCalzone.name, '- +$' + largeCalzone.priceModifier.toFixed(2));
    console.log('');
    console.log('🎉 Done! Your calzone size options are ready.');
    console.log('Group ID:', calzoneGroup.id);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createCalzoneOptions();
