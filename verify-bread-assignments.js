const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyBreadGroupAssignments() {
  console.log('🔍 Verifying Bread Group Assignments...\n');

  try {
    // Get all bread customization groups
    const breadGroups = await prisma.customizationGroup.findMany({
      where: {
        name: {
          contains: 'bread',
          mode: 'insensitive'
        }
      },
      include: {
        options: {
          orderBy: { sortOrder: 'asc' }
        },
        menuItemCustomizations: {
          include: {
            menuItem: {
              select: {
                name: true,
                basePrice: true,
                category: true
              }
            }
          }
        }
      }
    });

    console.log(`📊 Found ${breadGroups.length} bread customization groups:`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    breadGroups.forEach((group, index) => {
      const hasSmallSub = group.options.some(opt => 
        opt.name.toLowerCase().includes('small sub')
      );
      
      console.log(`\n${index + 1}. 📂 ${group.name}`);
      console.log(`   🍞 Options: ${group.options.length} (Small Sub: ${hasSmallSub ? '✅ Yes' : '❌ No'})`);
      console.log(`   🔗 Connected Items: ${group.menuItemCustomizations.length}`);
      
      // Show options
      group.options.forEach((option, optIndex) => {
        const priceText = option.priceModifier > 0 ? ` (+$${option.priceModifier})` : 
                         option.priceModifier < 0 ? ` (-$${Math.abs(option.priceModifier)})` : ' (Free)';
        console.log(`      ${optIndex + 1}. ${option.name}${priceText}`);
      });
      
      // Show connected items
      if (group.menuItemCustomizations.length > 0) {
        console.log(`   📋 Connected Items:`);
        group.menuItemCustomizations.forEach((mic, itemIndex) => {
          const item = mic.menuItem;
          console.log(`      ${itemIndex + 1}. ${item.name} - $${item.basePrice}`);
        });
      }
    });

    console.log('\n✅ Verification complete!');

  } catch (error) {
    console.error('❌ Error verifying bread groups:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyBreadGroupAssignments();
