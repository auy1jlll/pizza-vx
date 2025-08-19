const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugCustomizationOptionValidation() {
  try {
    console.log('🔍 Debugging Customization Option Validation...\n');

    // First, let's check what customization groups exist
    console.log('📋 Checking existing customization groups:');
    const groups = await prisma.customizationGroup.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        categoryId: true,
        isActive: true
      },
      orderBy: { name: 'asc' }
    });

    if (groups.length === 0) {
      console.log('❌ No customization groups found! You need to create a group first.');
      return;
    }

    groups.forEach((group, index) => {
      console.log(`${index + 1}. ${group.name} (ID: ${group.id})`);
      console.log(`   Type: ${group.type}, Active: ${group.isActive}`);
      console.log(`   Category ID: ${group.categoryId || 'No category'}`);
    });

    // Let's test validation with the first group
    const testGroup = groups[0];
    console.log(`\n🧪 Testing validation with group: "${testGroup.name}"\n`);

    // Test cases for validation
    const testCases = [
      {
        name: 'Valid Option Test',
        data: {
          name: 'Extra Cheese',
          groupId: testGroup.id,
          description: 'Add extra cheese to your item',
          priceModifier: 2.50,
          priceType: 'FLAT',
          isDefault: false,
          isActive: true,
          sortOrder: 0
        }
      },
      {
        name: 'Empty Name Test',
        data: {
          name: '',
          groupId: testGroup.id,
          description: 'Test with empty name',
          priceModifier: 1.00,
          priceType: 'FLAT'
        }
      },
      {
        name: 'Missing Group ID Test',
        data: {
          name: 'Test Option',
          groupId: '',
          description: 'Test with missing group ID',
          priceModifier: 1.00,
          priceType: 'FLAT'
        }
      },
      {
        name: 'Invalid Price Type Test',
        data: {
          name: 'Test Option',
          groupId: testGroup.id,
          description: 'Test with invalid price type',
          priceModifier: 1.00,
          priceType: 'INVALID_TYPE'
        }
      },
      {
        name: 'Invalid Price Modifier Test',
        data: {
          name: 'Test Option',
          groupId: testGroup.id,
          description: 'Test with invalid price modifier',
          priceModifier: 150, // Over 100 limit
          priceType: 'FLAT'
        }
      }
    ];

    // Test validation manually since TypeScript import isn't working
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

      if (data.maxQuantity !== undefined) {
        const qty = typeof data.maxQuantity === 'string' ? parseInt(data.maxQuantity) : data.maxQuantity;
        if (typeof qty !== 'number' || isNaN(qty) || qty < 1) {
          errors.push('Maximum quantity must be a positive number');
        }
      }

      if (data.sortOrder !== undefined) {
        const sort = typeof data.sortOrder === 'string' ? parseInt(data.sortOrder) : data.sortOrder;
        if (typeof sort !== 'number' || isNaN(sort) || sort < 0) {
          errors.push('Customization option sort order must be a non-negative number');
        }
      }

      if (data.nutritionInfo) {
        try {
          JSON.parse(data.nutritionInfo);
        } catch (e) {
          errors.push('Nutrition info must be valid JSON format');
        }
      }

      if (data.allergens) {
        try {
          JSON.parse(data.allergens);
        } catch (e) {
          errors.push('Allergens must be valid JSON format');
        }
      }

      // Warnings
      if (data.name && data.name.length < 2) {
        warnings.push('Option name is very short - consider a more descriptive name');
      }

      if (data.priceModifier && Math.abs(data.priceModifier) > 20) {
        warnings.push('Price modifier is unusually high - please verify');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    }

    for (const testCase of testCases) {
      console.log(`\n--- ${testCase.name} ---`);
      console.log('Data:', JSON.stringify(testCase.data, null, 2));
      
      try {
        const result = validateCustomizationOption(testCase.data);
        console.log('Validation Result:', JSON.stringify(result, null, 2));
        
        if (!result.isValid) {
          console.log('❌ Validation Failed:');
          result.errors.forEach(error => console.log(`   • ${error}`));
        } else {
          console.log('✅ Validation Passed');
          if (result.warnings && result.warnings.length > 0) {
            console.log('⚠️ Warnings:');
            result.warnings.forEach(warning => console.log(`   • ${warning}`));
          }
        }
      } catch (error) {
        console.log('❌ Validation Error:', error.message);
      }
    }

    // Now let's test with a real API call to see what happens
    console.log('\n🌐 Testing with actual API call...');
    
    const testData = {
      name: 'Test Option',
      groupId: testGroup.id,
      description: 'Test option for debugging',
      priceModifier: 1.50,
      priceType: 'FLAT',
      isDefault: false,
      isActive: true,
      sortOrder: 0
    };

    console.log('Test Data:', JSON.stringify(testData, null, 2));

    try {
      // Simulate the API call logic
      const validationResult = validateCustomizationOption(testData);
      
      if (!validationResult.isValid) {
        console.log('❌ API would return validation error:');
        console.log({
          success: false,
          error: 'Customization Option validation failed',
          details: validationResult.errors,
          warnings: validationResult.warnings
        });
      } else {
        console.log('✅ API validation would pass');
        
        // Check if the group actually exists
        const groupExists = await prisma.customizationGroup.findUnique({
          where: { id: testData.groupId }
        });
        
        if (!groupExists) {
          console.log('❌ Group does not exist in database!');
        } else {
          console.log('✅ Group exists in database');
          console.log('Group details:', JSON.stringify(groupExists, null, 2));
        }
      }
    } catch (error) {
      console.log('❌ API simulation error:', error.message);
    }

    console.log('\n📊 Summary:');
    console.log('- Check that your customization option has a valid name (1-100 characters)');
    console.log('- Ensure the group ID exists and is valid');
    console.log('- Verify price modifier is between -100 and 100');
    console.log('- Check that price type is one of: FLAT, PERCENTAGE, PER_UNIT');
    console.log('- Make sure all JSON fields (if used) are valid JSON');

  } catch (error) {
    console.error('❌ Debug script error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugCustomizationOptionValidation();
