const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSteakCheeseSubs() {
  try {
    console.log('🔍 Checking Steak and Cheese Subs category...\n');

    const category = await prisma.menuCategory.findUnique({
      where: { slug: 'steak-and-cheese-subs' },
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
      console.log('❌ Steak and Cheese Subs category not found');
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
            group.options.forEach((option, optIndex) => {
              const price = option.priceModifier > 0 
                ? ` (+$${option.priceModifier.toFixed(2)})` 
                : ' (Free)';
              const defaultMark = option.isDefault ? ' [DEFAULT]' : '';
              console.log(`           - ${option.name}${price}${defaultMark}`);
            });
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
      console.log(`   Price range: ${Math.min(...group.options.map(o => o.priceModifier))} - ${Math.max(...group.options.map(o => o.priceModifier))}`);
    });

  } catch (error) {
    console.error('❌ Error checking steak and cheese subs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSteakCheeseSubs();
