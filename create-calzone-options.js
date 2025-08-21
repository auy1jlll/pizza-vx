const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createCalzoneOptions() {
  try {
    console.log('🔍 Checking for existing Calzone customization group...\n');
    
    // Check if calzone group exists
    let calzoneGroup = await prisma.customizationGroup.findFirst({
      where: {
        name: { contains: 'calzone', mode: 'insensitive' }
      },
      include: { options: true }
    });
    
    if (!calzoneGroup) {
      console.log('📝 Creating new "Calzone Size" customization group...\n');
      
      // Create the calzone size group
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
        },
        include: { options: true }
      });
      
      console.log('✅ Created group:', calzoneGroup.name);
    } else {
      console.log('✅ Found existing group:', calzoneGroup.name);
      console.log('Current options:', calzoneGroup.options.length);
      calzoneGroup.options.forEach(opt => {
        console.log('  -', opt.name, '($' + opt.priceModifier.toFixed(2) + ')');
      });
    }
    
    console.log('\n🍕 Creating calzone size options...\n');
    
    // Create Small Calzone option
    const smallCalzone = await prisma.customizationOption.create({
      data: {
        name: 'Small Calzone',
        description: 'Regular size calzone',
        priceModifier: 0.0, // No extra charge for small
        priceType: 'FLAT',
        isDefault: true, // Make small the default
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
        priceModifier: 3.0, // $3 extra for large
        priceType: 'FLAT',
        isDefault: false,
        isActive: true,
        sortOrder: 2,
        customizationGroupId: calzoneGroup.id
      }
    });
    
    console.log('✅ Created:', smallCalzone.name, '- No extra charge (default)');
    console.log('✅ Created:', largeCalzone.name, '- +$' + largeCalzone.priceModifier.toFixed(2));
    
    console.log('\n🎉 SUCCESS! Your Calzone Size options are ready!');
    console.log('\nGroup ID:', calzoneGroup.id);
    console.log('You can now assign this group to your calzone menu items.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createCalzoneOptions();
