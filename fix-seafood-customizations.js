const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixSeafoodPlatesCustomizations() {
  console.log('🔧 Fixing Seafood Plates Customizations...');
  
  try {
    // Find the existing "Fries and Onion Rings" group
    const friesOnionRingsGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Fries and Onion Rings' },
      include: { options: true }
    });

    if (!friesOnionRingsGroup) {
      console.log('❌ Fries and Onion Rings group not found!');
      return;
    }

    console.log('📋 Current group setup:');
    console.log(`   Type: ${friesOnionRingsGroup.type}`);
    console.log(`   Max Selections: ${friesOnionRingsGroup.maxSelections}`);
    console.log(`   Options: ${friesOnionRingsGroup.options.map(o => o.name).join(', ')}`);

    // Delete existing options
    console.log('\n🗑️  Removing old options...');
    await prisma.customizationOption.deleteMany({
      where: { groupId: friesOnionRingsGroup.id }
    });

    // Update the group to be SINGLE_SELECT
    console.log('🔄 Updating group to SINGLE_SELECT...');
    await prisma.customizationGroup.update({
      where: { id: friesOnionRingsGroup.id },
      data: {
        type: 'SINGLE_SELECT',
        maxSelections: 1,
        description: 'Choose your fries option'
      }
    });

    // Create the correct options
    console.log('➕ Adding new options...');
    const correctOptions = [
      { 
        name: 'French Fries & Onion Rings', 
        description: 'Combination of french fries and onion rings', 
        priceModifier: 0, 
        sortOrder: 1,
        isDefault: true
      },
      { 
        name: 'All Fries', 
        description: 'French fries only', 
        priceModifier: 0, 
        sortOrder: 2 
      },
      { 
        name: 'All Onion Rings', 
        description: 'Onion rings only', 
        priceModifier: 0, 
        sortOrder: 3 
      }
    ];

    for (const option of correctOptions) {
      await prisma.customizationOption.create({
        data: {
          ...option,
          groupId: friesOnionRingsGroup.id,
          isActive: true
        }
      });
      console.log(`  ✅ Added: ${option.name}`);
    }

    // Verify the Side Choice group is correct
    const sideChoiceGroup = await prisma.customizationGroup.findFirst({
      where: { name: 'Side Choice' },
      include: { options: true }
    });

    console.log('\n📋 Side Choice group:');
    console.log(`   Type: ${sideChoiceGroup.type}`);
    console.log(`   Max Selections: ${sideChoiceGroup.maxSelections}`);
    console.log(`   Options: ${sideChoiceGroup.options.map(o => o.name).join(', ')}`);

    console.log('\n🎉 Seafood plates customizations fixed successfully!');
    console.log('\n🍽️ Now customers can choose:');
    console.log('   1️⃣ Fries Option (radio buttons):');
    console.log('      • French Fries & Onion Rings (default)');
    console.log('      • All Fries');
    console.log('      • All Onion Rings');
    console.log('   2️⃣ Side Option (radio buttons):');
    console.log('      • Coleslaw (default)');
    console.log('      • Pasta Salad');

  } catch (error) {
    console.error('❌ Error fixing customizations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSeafoodPlatesCustomizations();
