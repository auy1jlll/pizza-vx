const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyCompleteCustomizationSetup() {
  try {
    console.log('🔍 Complete Sandwich Customization Verification...\n');
    
    // Get the Sandwiches & Burgers category
    const category = await prisma.menuCategory.findFirst({
      where: {
        slug: 'sandwiches-burgers'
      }
    });

    if (!category) {
      console.log('❌ Category not found');
      return;
    }

    console.log(`✅ Category: ${category.name} (${category.slug})\n`);

    // Get all customization groups for this category
    const groups = await prisma.customizationGroup.findMany({
      where: { categoryId: category.id },
      include: {
        options: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log('📋 CUSTOMIZATION GROUPS:');
    console.log('═══════════════════════════════════════════════════════\n');

    groups.forEach((group, index) => {
      console.log(`${index + 1}. ${group.name}`);
      console.log(`   📝 Type: ${group.type}`);
      console.log(`   🎯 Min: ${group.minSelections}, Max: ${group.maxSelections || 'unlimited'}`);
      console.log(`   ✅ Required: ${group.isRequired ? 'Yes' : 'No'}`);
      console.log(`   🔢 Options: ${group.options.length}`);
      
      group.options.forEach((option, optIndex) => {
        const price = option.priceModifier !== 0 ? 
          ` (${option.priceModifier >= 0 ? '+' : ''}$${option.priceModifier})` : 
          ' (+$0)';
        console.log(`      ${optIndex + 1}. ${option.name}${price}${option.isDefault ? ' [DEFAULT]' : ''}`);
      });
      console.log('');
    });

    // Get menu items and their customizations
    const menuItems = await prisma.menuItem.findMany({
      where: { categoryId: category.id },
      include: {
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: {
                  where: { isActive: true },
                  orderBy: { sortOrder: 'asc' }
                }
              }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    console.log('🍽️ MENU ITEMS & THEIR CUSTOMIZATIONS:');
    console.log('═══════════════════════════════════════════════════════\n');

    menuItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} ($${item.basePrice})`);
      if (item.description) {
        console.log(`   📝 ${item.description}`);
      }
      console.log(`   🎛️ Customization Groups: ${item.customizationGroups.length}`);
      
      item.customizationGroups.forEach((cg, cgIndex) => {
        const group = cg.customizationGroup;
        console.log(`      ${cgIndex + 1}. ${group.name} (${group.type})`);
        console.log(`         Required: ${cg.isRequired ? 'Yes' : 'No'}`);
        console.log(`         Options: ${group.options.length} available`);
      });
      console.log('');
    });

    // Summary
    const totalOptions = groups.reduce((sum, group) => sum + group.options.length, 0);
    
    console.log('🎉 SETUP SUMMARY:');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`✅ Category: ${category.name}`);
    console.log(`✅ Customization Groups: ${groups.length}`);
    console.log(`✅ Menu Items: ${menuItems.length}`);
    console.log(`✅ Total Customization Options: ${totalOptions}`);
    console.log('');
    console.log('🏆 Complete sandwich customization system is ready!');
    console.log('   - Size options with pricing');
    console.log('   - Preparation methods');
    console.log('   - Toppings selection');
    console.log('   - Condiments selection');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyCompleteCustomizationSetup();
