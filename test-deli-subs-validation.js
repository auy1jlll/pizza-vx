const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDeliSubsValidation() {
  try {
    console.log('🥪 Testing Deli Subs Customization Option Validation...\n');

    // Find the Deli Subs topping group
    const deliGroup = await prisma.customizationGroup.findFirst({
      where: {
        name: {
          contains: 'Deli Subs',
          mode: 'insensitive'
        }
      }
    });

    if (!deliGroup) {
      console.log('❌ Deli Subs group not found!');
      
      // Show all groups that contain "deli" or "sub"
      const relatedGroups = await prisma.customizationGroup.findMany({
        where: {
          OR: [
            { name: { contains: 'deli', mode: 'insensitive' } },
            { name: { contains: 'sub', mode: 'insensitive' } }
          ]
        }
      });
      
      console.log('Related groups found:');
      relatedGroups.forEach(group => {
        console.log(`- ${group.name} (ID: ${group.id})`);
      });
      return;
    }

    console.log('✅ Found Deli Subs group:');
    console.log(`Name: ${deliGroup.name}`);
    console.log(`ID: ${deliGroup.id}`);
    console.log(`Type: ${deliGroup.type}`);
    console.log(`Active: ${deliGroup.isActive}`);

    // Test your specific data
    const breadOptionData = {
      name: 'Bread Options',  // Your option name
      groupId: deliGroup.id,  // The Deli Subs group ID
      description: 'Choose your bread type for the deli sub',
      priceModifier: 1,       // Your price modifier
      priceType: 'FLAT',      // Default price type
      isDefault: false,
      isActive: true,
      sortOrder: 0
    };

    console.log('\n🧪 Testing your bread options data:');
    console.log(JSON.stringify(breadOptionData, null, 2));

    // Validation function
    function validateCustomizationOption(data) {
      const errors = [];
      const warnings = [];

      // Required field: name
      if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 1 || data.name.trim().length > 100) {
        errors.push('Customization option name is required and must be 1-100 characters long');
      }

      // Required field: groupId
      if (!data.groupId || typeof data.groupId !== 'string' || data.groupId.trim().length === 0) {
        errors.push('Group ID is required');
      }

      // Optional but validated fields
      if (data.description && (typeof data.description !== 'string' || data.description.length > 500)) {
        errors.push('Customization option description must be under 500 characters');
      }

      if (data.priceModifier !== undefined) {
        const price = typeof data.priceModifier === 'string' ? parseFloat(data.priceModifier) : data.priceModifier;
        if (typeof price !== 'number' || isNaN(price) || price < -100 || price > 100) {
          errors.push('Price modifier must be between -100 and 100');
        }
      }

      const validPriceTypes = ['FLAT', 'PERCENTAGE', 'PER_UNIT'];
      if (data.priceType && !validPriceTypes.includes(data.priceType)) {
        errors.push('Price type must be one of: ' + validPriceTypes.join(', '));
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    }

    // Test validation
    const validationResult = validateCustomizationOption(breadOptionData);
    
    console.log('\n📋 Validation Result:');
    if (validationResult.isValid) {
      console.log('✅ Validation PASSED! Your data is valid.');
      
      // Try to actually create the option
      console.log('\n🚀 Attempting to create the customization option...');
      
      try {
        const newOption = await prisma.customizationOption.create({
          data: breadOptionData,
          include: {
            group: {
              select: {
                id: true,
                name: true,
                type: true
              }
            }
          }
        });
        
        console.log('✅ SUCCESS! Customization option created:');
        console.log(JSON.stringify(newOption, null, 2));
        
      } catch (dbError) {
        console.log('❌ Database error while creating option:');
        console.log(dbError.message);
        
        if (dbError.code === 'P2002') {
          console.log('💡 This might be a duplicate name in the same group.');
        }
      }
      
    } else {
      console.log('❌ Validation FAILED:');
      validationResult.errors.forEach(error => {
        console.log(`   • ${error}`);
      });
    }

    // Test variations of bread options
    console.log('\n🍞 Testing specific bread option variations:');
    
    const breadVariations = [
      { name: 'White Bread', priceModifier: 0 },
      { name: 'Wheat Bread', priceModifier: 0.5 },
      { name: 'Italian Bread', priceModifier: 1 },
      { name: 'Sourdough', priceModifier: 1.5 },
      { name: 'Gluten-Free Bread', priceModifier: 2 }
    ];

    for (const [index, bread] of breadVariations.entries()) {
      const breadData = {
        name: bread.name,
        groupId: deliGroup.id,
        description: `${bread.name} option for deli subs`,
        priceModifier: bread.priceModifier,
        priceType: 'FLAT',
        isDefault: index === 0, // First option is default
        isActive: true,
        sortOrder: index
      };

      const result = validateCustomizationOption(breadData);
      console.log(`${result.isValid ? '✅' : '❌'} ${bread.name}: ${result.isValid ? 'Valid' : result.errors.join(', ')}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDeliSubsValidation();
