const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifySteakCheeseCustomizations() {
  try {
    console.log('🔍 Verifying Steak and Cheese Sub Customizations...\n');

    // Get steak and cheese subs with their customizations
    const steakCheeseSubs = await prisma.menuItem.findMany({
      where: {
        category: { slug: 'steak-and-cheese-subs' }
      },
      include: {
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: {
                  orderBy: { sortOrder: 'asc' }
                }
              }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    console.log(`📋 Found ${steakCheeseSubs.length} steak and cheese subs:\n`);

    steakCheeseSubs.forEach((sub, index) => {
      console.log(`${index + 1}. ${sub.name}:`);
      console.log(`   Customization Groups (${sub.customizationGroups.length}):`);
      
      if (sub.customizationGroups.length === 0) {
        console.log('   ❌ No customizations found!');
      } else {
        sub.customizationGroups.forEach((customization, idx) => {
          const group = customization.customizationGroup;
          const requiredText = customization.isRequired ? ' (REQUIRED)' : '';
          const maxText = group.maxSelections ? ` (max ${group.maxSelections})` : '';
          console.log(`   ${idx + 1}. ${group.name}${requiredText}${maxText} - ${group.options.length} options`);
        });
      }
      console.log('');
    });

    // Check for the specific groups we want
    const expectedGroups = ['Bread Type', 'Condiments', 'Add Cheese', 'Hot Sub Toppings'];
    
    console.log('🎯 VERIFICATION SUMMARY:');
    
    for (const sub of steakCheeseSubs) {
      console.log(`\n${sub.name}:`);
      const groupNames = sub.customizationGroups.map(cg => cg.customizationGroup.name);
      
      for (const expectedGroup of expectedGroups) {
        const hasGroup = groupNames.includes(expectedGroup);
        const status = hasGroup ? '✅' : '❌';
        console.log(`   ${status} ${expectedGroup}`);
      }
    }

    // Show example complete order
    if (steakCheeseSubs.length > 0) {
      const firstSub = steakCheeseSubs[0];
      console.log(`\n🥪 EXAMPLE ORDER - ${firstSub.name}:`);
      console.log(`Base Price: $${firstSub.basePrice.toFixed(2)}`);
      
      if (firstSub.customizationGroups.length > 0) {
        console.log('Available Customizations:');
        firstSub.customizationGroups.forEach((customization) => {
          const group = customization.customizationGroup;
          console.log(`✓ ${group.name}: ${group.options.length} options available`);
          
          // Show first few options as examples
          const examples = group.options.slice(0, 3).map(opt => {
            const price = opt.priceModifier > 0 ? ` ($${opt.priceModifier.toFixed(2)})` : ' (FREE)';
            const quantity = opt.maxQuantity > 1 ? ` up to ${opt.maxQuantity}x` : '';
            return `${opt.name}${price}${quantity}`;
          });
          console.log(`   Examples: ${examples.join(', ')}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

verifySteakCheeseCustomizations();
