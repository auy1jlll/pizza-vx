const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkColdSubs() {
  try {
    console.log('🔍 Checking Cold Subs category...\n');

    const category = await prisma.menuCategory.findUnique({
      where: { slug: 'cold-subs' },
      include: {
        menuItems: {
          include: {
            customizationGroups: {
              include: {
                customizationGroup: {
                  include: {
                    options: true
                  }
                }
              },
              orderBy: { sortOrder: 'asc' }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!category) {
      console.log('❌ Cold Subs category not found');
      return;
    }

    console.log(`📋 Category: ${category.name}`);
    console.log(`📝 Description: ${category.description}`);
    console.log(`🔢 Total items: ${category.menuItems.length}\n`);

    // Display first few items with their customizations
    const itemsToShow = category.menuItems.slice(0, 3);
    itemsToShow.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} - $${item.basePrice}`);
      console.log(`   📝 ${item.description}`);
      
      if (item.customizationGroups.length > 0) {
        console.log(`   🎛️ Customization Groups (${item.customizationGroups.length}):`);
        
        item.customizationGroups.forEach((customization, custIndex) => {
          const group = customization.customizationGroup;
          const required = customization.isRequired ? '(Required)' : '(Optional)';
          console.log(`      ${custIndex + 1}. ${group.name} ${required} - ${group.type}`);
          console.log(`         📝 ${group.description}`);
          
          if (group.options.length > 0) {
            console.log(`         Options (${group.options.length}):`);
            // Show first few options to avoid too much output
            const optionsToShow = group.options.slice(0, 4);
            optionsToShow.forEach((option, optIndex) => {
              const price = option.priceModifier > 0 
                ? ` (+$${option.priceModifier.toFixed(2)})` 
                : ' (Free)';
              const defaultMark = option.isDefault ? ' [DEFAULT]' : '';
              console.log(`           - ${option.name}${price}${defaultMark}`);
            });
            if (group.options.length > 4) {
              console.log(`           ... and ${group.options.length - 4} more options`);
            }
          }
          console.log('');
        });
      }
      console.log('─'.repeat(80) + '\n');
    });

    // Show all item names and prices
    console.log('📋 All Cold Sub Items:');
    category.menuItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} - $${item.basePrice} (Small), $${(item.basePrice + 1.00).toFixed(2)} (Large/Wraps)`);
    });
    console.log('');

    // Summary of all customization groups in the category
    const allGroups = await prisma.customizationGroup.findMany({
      where: { categoryId: category.id },
      include: {
        options: true
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`📊 Customization Groups Summary (${allGroups.length} total):`);
    allGroups.forEach((group, index) => {
      console.log(`${index + 1}. ${group.name} (${group.options.length} options)`);
      console.log(`   Type: ${group.type}, Required: ${group.isRequired ? 'Yes' : 'No'}`);
      if (group.options.length > 0) {
        const minPrice = Math.min(...group.options.map(o => o.priceModifier));
        const maxPrice = Math.max(...group.options.map(o => o.priceModifier));
        console.log(`   Price range: $${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`);
      }
    });

  } catch (error) {
    console.error('❌ Error checking cold subs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkColdSubs();
