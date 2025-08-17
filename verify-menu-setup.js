// Verification script to check the new menu categories setup
const { PrismaClient } = require('@prisma/client');

async function verifyMenuSetup() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Verifying menu categories setup...\n');
    
    // Check menu categories
    const categories = await prisma.menuCategory.findMany({
      include: {
        menuItems: true,
        customizationGroups: {
          include: {
            options: true
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log('📋 MENU CATEGORIES:');
    categories.forEach(category => {
      console.log(`\n🏷️  ${category.name} (${category.slug})`);
      console.log(`   Description: ${category.description}`);
      console.log(`   Items: ${category.menuItems.length}`);
      console.log(`   Customization Groups: ${category.customizationGroups.length}`);
      
      if (category.menuItems.length > 0) {
        console.log(`   📝 Items:`);
        category.menuItems.forEach(item => {
          console.log(`      - ${item.name} ($${item.basePrice})`);
        });
      }
      
      if (category.customizationGroups.length > 0) {
        console.log(`   ⚙️  Customization Groups:`);
        category.customizationGroups.forEach(group => {
          console.log(`      - ${group.name} (${group.type}) - ${group.options.length} options`);
        });
      }
    });
    
    // Check global customization groups
    const globalGroups = await prisma.customizationGroup.findMany({
      where: { categoryId: null },
      include: { options: true }
    });
    
    if (globalGroups.length > 0) {
      console.log('\n🌐 GLOBAL CUSTOMIZATION GROUPS:');
      globalGroups.forEach(group => {
        console.log(`   - ${group.name} (${group.type}) - ${group.options.length} options`);
        group.options.forEach(option => {
          console.log(`     • ${option.name} (+$${option.priceModifier})`);
        });
      });
    }
    
    // Summary
    const totalItems = await prisma.menuItem.count();
    const totalCustomizationGroups = await prisma.customizationGroup.count();
    const totalCustomizationOptions = await prisma.customizationOption.count();
    
    console.log('\n📊 SUMMARY:');
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Menu Items: ${totalItems}`);
    console.log(`   Customization Groups: ${totalCustomizationGroups}`);
    console.log(`   Customization Options: ${totalCustomizationOptions}`);
    
    console.log('\n✅ Menu categories setup verified successfully!');
    console.log('🚀 Ready for Step 2: Generic Customization Engine');
    
  } catch (error) {
    console.error('❌ Error verifying menu setup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyMenuSetup();
