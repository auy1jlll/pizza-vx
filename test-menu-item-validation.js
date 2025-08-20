const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testMenuItemCreation() {
  try {
    console.log('Testing menu item creation with blank preparation time...');

    // First, get a category to use
    const category = await prisma.menuCategory.findFirst();
    if (!category) {
      throw new Error('No categories found. Please create a category first.');
    }

    console.log('Using category:', category.name);

    // Test data similar to what the form would send
    const testData = {
      name: "Test Item",
      description: "Test description",
      basePrice: 12.99,
      categoryId: category.id,
      isActive: true,
      isAvailable: true,
      sortOrder: 0,
      preparationTime: null, // This is what causes the validation error
      allergens: null,
      nutritionInfo: null,
      customizationGroups: []
    };

    // Import the validator to test it directly
    const { MenuValidator } = require('./src/lib/validation/menu-validation');
    
    const validationResult = MenuValidator.validateItem(testData);
    
    console.log('Validation result:', validationResult);
    
    if (validationResult.isValid) {
      console.log('✅ Validation passed! Creating menu item...');
      
      const menuItem = await prisma.menuItem.create({
        data: {
          name: testData.name,
          description: testData.description,
          basePrice: testData.basePrice,
          categoryId: testData.categoryId,
          isActive: testData.isActive,
          isAvailable: testData.isAvailable,
          sortOrder: testData.sortOrder,
          preparationTime: testData.preparationTime,
          allergens: testData.allergens,
          nutritionInfo: testData.nutritionInfo
        }
      });
      
      console.log('✅ Menu item created successfully:', menuItem.id);
      
      // Clean up - delete the test item
      await prisma.menuItem.delete({
        where: { id: menuItem.id }
      });
      
      console.log('✅ Test item cleaned up');
    } else {
      console.log('❌ Validation failed:', validationResult.errors);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testMenuItemCreation();
