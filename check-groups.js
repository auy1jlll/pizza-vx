const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkGroups() {
  try {
    const groups = await prisma.customizationGroup.findMany({
      include: { 
        _count: { select: { options: true } },
        options: true
      }
    });
    
    console.log('📋 Customization Groups in Database:');
    console.log('Total groups:', groups.length);
    console.log('');
    
    if (groups.length === 0) {
      console.log('❌ NO CUSTOMIZATION GROUPS FOUND!');
      console.log('This explains why you don\'t see clone buttons - there are no groups to display.');
      
      // Let's create a test group
      console.log('');
      console.log('🔧 Creating a test customization group...');
      
      const testGroup = await prisma.customizationGroup.create({
        data: {
          name: 'Test Sandwich Sizes',
          description: 'Choose your sandwich size',
          type: 'SINGLE_SELECT',
          isRequired: true,
          minSelections: 1,
          maxSelections: 1,
          sortOrder: 0,
          isActive: true
        }
      });
      
      // Add some options
      await prisma.customizationOption.createMany({
        data: [
          {
            groupId: testGroup.id,
            name: '6 inch',
            description: 'Small sandwich',
            priceModifier: 0,
            priceType: 'FIXED',
            isDefault: true,
            isActive: true,
            sortOrder: 0
          },
          {
            groupId: testGroup.id,
            name: '12 inch',
            description: 'Large sandwich',
            priceModifier: 2.50,
            priceType: 'FIXED',
            isDefault: false,
            isActive: true,
            sortOrder: 1
          }
        ]
      });
      
      console.log('✅ Created test group:', testGroup.name);
      console.log('✅ Added 2 options to the group');
      console.log('');
      console.log('🔄 Now refresh the page at: http://localhost:3005/admin/menu-manager/customization-groups');
      console.log('You should see the test group with clone buttons!');
      
    } else {
      groups.forEach((group, index) => {
        console.log(`${index + 1}. ${group.name} (ID: ${group.id})`);
        console.log(`   - Type: ${group.type}`);
        console.log(`   - Active: ${group.isActive}`);
        console.log(`   - Options: ${group._count.options}`);
        console.log(`   - Required: ${group.isRequired}`);
        console.log('');
      });
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
  }
}

checkGroups();
