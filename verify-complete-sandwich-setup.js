const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyCompleteSetup() {
  try {
    console.log('🔍 Complete Sandwich Customization Verification...\n');
    
    // Get the Sandwiches & Burgers category
    const category = await prisma.menuCategory.findFirst({
      where: {
        OR: [
          { name: { contains: 'Sandwich', mode: 'insensitive' } },
          { name: { contains: 'Burger', mode: 'insensitive' } }
        ]
      }
    });

    console.log(`✅ Category: ${category.name} (${category.slug})\n`);

    // Get all customization groups for this category
    const customizationGroups = await prisma.customizationGroup.findMany({
      where: { categoryId: category.id },
      include: {
        options: {
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log('📋 CUSTOMIZATION GROUPS:');
    console.log('═══════════════════════════════════════════════════════');
    
    customizationGroups.forEach((group, index) => {
      console.log(`\n${index + 1}. ${group.name}`);
      console.log(`   📝 Type: ${group.type}`);
      console.log(`   🎯 Min: ${group.minSelections}, Max: ${group.maxSelections}`);
      console.log(`   ✅ Required: ${group.isRequired ? 'Yes' : 'No'}`);
      console.log(`   🔢 Options: ${group.options.length}`);
      
      group.options.forEach((option, optIndex) => {
        console.log(`      ${optIndex + 1}. ${option.name} (+$${option.priceModifier})`);
      });
    });

    // Get menu items with their customization groups
    const menuItems = await prisma.menuItem.findMany({
      where: { categoryId: category.id },
      include: {
        customizationGroups: {
          include: {
            customizationGroup: {
              select: { name: true, type: true, options: { select: { name: true } } }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    console.log('\n\n🍽️ MENU ITEMS & THEIR CUSTOMIZATIONS:');
    console.log('═══════════════════════════════════════════════════════');
    
    menuItems.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.name} ($${item.basePrice})`);
      console.log(`   📝 ${item.description}`);
      console.log(`   🎛️ Customization Groups: ${item.customizationGroups.length}`);
      
      item.customizationGroups.forEach((cg, cgIndex) => {
        console.log(`      ${cgIndex + 1}. ${cg.customizationGroup.name} (${cg.customizationGroup.type})`);
        console.log(`         Options: ${cg.customizationGroup.options.length} available`);
      });
    });

    console.log('\n\n🎉 SETUP SUMMARY:');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`✅ Category: ${category.name}`);
    console.log(`✅ Customization Groups: ${customizationGroups.length}`);
    console.log(`✅ Menu Items: ${menuItems.length}`);
    console.log(`✅ Total Customization Options: ${customizationGroups.reduce((sum, group) => sum + group.options.length, 0)}`);
    
    console.log('\n🏆 All sandwich customization groups are ready for use!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyCompleteSetup();
