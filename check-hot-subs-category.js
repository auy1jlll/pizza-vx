const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkHotSubs() {
  try {
    console.log('🔍 Checking Hot Subs category...\n');

    const category = await prisma.menuCategory.findUnique({
      where: { slug: 'hot-subs' },
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
      console.log('❌ Hot Subs category not found');
      return;
    }

    console.log(`📋 Category: ${category.name}`);
    console.log(`📝 Description: ${category.description}`);
    console.log(`🔢 Total items: ${category.menuItems.length}\n`);

    // Display each item with its customizations
    category.menuItems.forEach((item, index) => {
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
            const optionsToShow = group.options.slice(0, 5);
            optionsToShow.forEach((option, optIndex) => {
              const price = option.priceModifier > 0 
                ? ` (+$${option.priceModifier.toFixed(2)})` 
                : ' (Free)';
              const defaultMark = option.isDefault ? ' [DEFAULT]' : '';
              console.log(`           - ${option.name}${price}${defaultMark}`);
            });
            if (group.options.length > 5) {
              console.log(`           ... and ${group.options.length - 5} more options`);
            }
          }
          console.log('');
        });
      }
      console.log('─'.repeat(80) + '\n');
    });

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
    console.error('❌ Error checking hot subs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkHotSubs();
