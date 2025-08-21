const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyHotSubs() {
  try {
    // Get the hot subs category with its items and customizations
    const hotSubsCategory = await prisma.menuCategory.findFirst({
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
              }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });
    
    if (!hotSubsCategory) {
      console.log('Hot Subs category not found');
      return;
    }
    
    console.log(`Category: ${hotSubsCategory.name}`);
    console.log(`Description: ${hotSubsCategory.description}`);
    console.log(`Items: ${hotSubsCategory.menuItems.length}`);
    console.log('');
    
    // Display first item's customization options to verify pricing
    if (hotSubsCategory.menuItems.length > 0) {
      const firstItem = hotSubsCategory.menuItems[0];
      console.log(`Sample item: ${firstItem.name} - $${firstItem.basePrice}`);
      console.log('Available customizations:');
      
      firstItem.customizationGroups.forEach(icg => {
        const group = icg.customizationGroup;
        console.log(`  Group: ${group.name}`);
        group.options.forEach(option => {
          const priceDisplay = option.priceModifier > 0 ? `+$${option.priceModifier.toFixed(2)}` : 
                              option.priceModifier < 0 ? `-$${Math.abs(option.priceModifier).toFixed(2)}` : 
                              'No charge';
          console.log(`    - ${option.name}: ${priceDisplay}`);
        });
      });
    }
    
  } catch (error) {
    console.error('Error verifying hot subs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyHotSubs();
