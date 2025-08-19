// Test menu items to ensure validation errors are fixed
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testMenuValidation() {
  try {
    console.log('🧪 Testing menu item validation after cleanup...\n');

    // Test a few specific menu items that were having issues
    const testItems = ['American Sub', 'Italian Sub', 'Chicken Noodle Soup'];

    for (const itemName of testItems) {
      console.log(`🔍 Testing: ${itemName}`);
      
      const menuItem = await prisma.menuItem.findFirst({
        where: { name: itemName },
        include: {
          customizationGroups: {
            include: {
              customizationGroup: {
                include: {
                  options: true
                }
              }
            }
          }
        }
      });

      if (menuItem) {
        console.log(`   ✅ Found menu item with ${menuItem.customizationGroups.length} customization groups`);
        
        let hasValidationIssues = false;
        
        menuItem.customizationGroups.forEach(gc => {
          const group = gc.customizationGroup;
          const isRequired = gc.isRequired;
          const hasOptions = group.options.length > 0;
          
          console.log(`     - ${group.name}: ${group.options.length} options, required: ${isRequired}`);
          
          if (isRequired && !hasOptions) {
            console.log(`       ❌ VALIDATION ERROR: Required group with no options!`);
            hasValidationIssues = true;
          }
        });
        
        if (!hasValidationIssues) {
          console.log(`   ✅ No validation issues found!`);
        }
      } else {
        console.log(`   ❌ Menu item not found`);
      }
      console.log('');
    }

    console.log('🎉 Menu validation test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testMenuValidation();
