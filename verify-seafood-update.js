const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifySeafoodPlatesUpdate() {
  console.log('🔍 Verifying Seafood Plates Updates...');
  
  try {
    // Get seafood category
    const seafoodCategory = await prisma.menuCategory.findFirst({
      where: { slug: 'seafood-plates' }
    });

    // Get all seafood items with their customizations
    const seafoodItems = await prisma.menuItem.findMany({
      where: { categoryId: seafoodCategory.id },
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
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`\n📋 Seafood Plates (${seafoodItems.length} items):`);
    console.log('==================================');

    seafoodItems.forEach(item => {
      console.log(`\n🦞 ${item.name}`);
      console.log(`   💰 Price: $${item.basePrice}`);
      console.log(`   🎛️  Customizations: ${item.customizationGroups.length}`);
      
      item.customizationGroups.forEach(customization => {
        const group = customization.customizationGroup;
        console.log(`     • ${group.name} (${group.type})`);
        console.log(`       Required: ${customization.isRequired ? 'Yes' : 'No'}`);
        console.log(`       Options: ${group.options.map(opt => opt.name).join(', ')}`);
      });
    });

    // Check customization groups
    console.log('\n\n🎛️  New Customization Groups:');
    console.log('===========================');

    const newGroups = await prisma.customizationGroup.findMany({
      where: {
        name: {
          in: ['Fries and Onion Rings', 'Side Choice']
        }
      },
      include: {
        options: true,
        _count: {
          select: { menuItemCustomizations: true }
        }
      }
    });

    newGroups.forEach(group => {
      console.log(`\n📁 ${group.name}`);
      console.log(`   Type: ${group.type}`);
      console.log(`   Required: ${group.isRequired ? 'Yes' : 'No'}`);
      console.log(`   Max Selections: ${group.maxSelections || 'Unlimited'}`);
      console.log(`   Connected to: ${group._count.menuItemCustomizations} menu items`);
      console.log(`   Options:`);
      group.options.forEach(option => {
        console.log(`     • ${option.name}${option.isDefault ? ' (Default)' : ''}`);
        if (option.description) {
          console.log(`       ${option.description}`);
        }
      });
    });

    console.log('\n✅ Verification completed!');

  } catch (error) {
    console.error('❌ Error verifying updates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifySeafoodPlatesUpdate();
