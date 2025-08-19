const { PrismaClient } = require('@prisma/client');

async function debugMenuIssues() {
  const prisma = new PrismaClient();
  
  try {
    console.log('\n🔍 DEBUGGING MENU ISSUES');
    console.log('============================\n');
    
    // Check Italian Sub specifically
    console.log('1. ITALIAN SUB DATA:');
    const italianSub = await prisma.menuItem.findFirst({
      where: { name: 'Italian Sub' },
      include: {
        category: true,
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
    
    if (italianSub) {
      console.log(`✅ Found: ${italianSub.name} (ID: ${italianSub.id})`);
      console.log(`   Category: ${italianSub.category.name} (${italianSub.category.slug})`);
      console.log(`   Base Price: $${italianSub.basePrice}`);
      
      console.log('\n   Customization Groups:');
      italianSub.customizationGroups.forEach((cg, index) => {
        console.log(`   ${index + 1}. ${cg.customizationGroup.name} (Required: ${cg.isRequired})`);
        console.log(`      Options:`);
        cg.customizationGroup.options.forEach(option => {
          console.log(`      - ${option.name}: +$${option.priceModifier}`);
        });
      });
    } else {
      console.log('❌ Italian Sub not found!');
    }
    
    // Check for any items with undefined or null names
    console.log('\n\n2. CHECKING FOR DATA INTEGRITY ISSUES:');
    const itemsWithIssues = await prisma.menuItem.findMany({
      where: {
        OR: [
          { name: null },
          { name: '' }
        ]
      }
    });
    
    if (itemsWithIssues.length > 0) {
      console.log('❌ Found items with missing names:');
      itemsWithIssues.forEach(item => {
        console.log(`   - ID: ${item.id}, Name: "${item.name}"`);
      });
    } else {
      console.log('✅ All menu items have valid names');
    }
    
    // Check customization options for issues
    console.log('\n3. CHECKING CUSTOMIZATION OPTIONS:');
    const optionsWithIssues = await prisma.customizationOption.findMany({
      where: {
        OR: [
          { name: null },
          { name: '' },
          { name: undefined }
        ]
      }
    });
    
    if (optionsWithIssues.length > 0) {
      console.log('❌ Found customization options with missing names:');
      optionsWithIssues.forEach(option => {
        console.log(`   - ID: ${option.id}, Name: "${option.name}", Price: +$${option.priceModifier}`);
      });
    } else {
      console.log('✅ All customization options have valid names');
    }
    
    // Check for Chicken Noodle Soup
    console.log('\n4. CHICKEN NOODLE SOUP DATA:');
    const soup = await prisma.menuItem.findFirst({
      where: { name: { contains: 'Chicken Noodle', mode: 'insensitive' } },
      include: { category: true }
    });
    
    if (soup) {
      console.log(`✅ Found: ${soup.name} (ID: ${soup.id})`);
      console.log(`   Category: ${soup.category.name} (${soup.category.slug})`);
      console.log(`   Base Price: $${soup.basePrice}`);
    } else {
      console.log('❌ Chicken Noodle Soup not found!');
    }
    
  } catch (error) {
    console.error('❌ Error debugging menu issues:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugMenuIssues();
