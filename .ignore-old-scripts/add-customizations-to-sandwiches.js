const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addCustomizationsToSandwiches() {
  try {
    console.log('🥪 Adding Hot Sub customization groups to Sandwiches...\n');

    // Get Sandwiches category
    const sandwichesCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Sandwiches' }
    });

    if (!sandwichesCategory) {
      console.log('❌ Sandwiches category not found');
      return;
    }

    // Get Hot Subs category to find the customization groups
    const hotSubsCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Hot Subs' }
    });

    if (!hotSubsCategory) {
      console.log('❌ Hot Subs category not found');
      return;
    }

    // Get a sample hot sub item with its customizations
    const hotSubItem = await prisma.menuItem.findFirst({
      where: { categoryId: hotSubsCategory.id },
      include: {
        customizationGroups: {
          include: {
            customizationGroup: true
          }
        }
      }
    });

    if (!hotSubItem || hotSubItem.customizationGroups.length === 0) {
      console.log('❌ No customization groups found for hot subs');
      return;
    }

    console.log(`📋 Found ${hotSubItem.customizationGroups.length} customization groups from hot subs:`);
    hotSubItem.customizationGroups.forEach((mcg, index) => {
      const skipBread = mcg.customizationGroup.name === 'Bread Type' ? ' (will skip for sandwiches)' : '';
      console.log(`   ${index + 1}. ${mcg.customizationGroup.name} (Required: ${mcg.isRequired})${skipBread}`);
    });

    // Get all sandwich items
    const sandwichItems = await prisma.menuItem.findMany({
      where: { categoryId: sandwichesCategory.id },
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`\n🔄 Applying customizations to ${sandwichItems.length} sandwich items...\n`);

    let totalConnections = 0;

    // For each sandwich item, add the same customization groups (excluding Bread Type)
    for (const sandwich of sandwichItems) {
      console.log(`📝 Processing: ${sandwich.name}`);

      // Check if it already has customizations
      const existingCustomizations = await prisma.menuItemCustomization.findMany({
        where: { menuItemId: sandwich.id }
      });

      if (existingCustomizations.length > 0) {
        console.log(`   ⚠️ Already has ${existingCustomizations.length} customizations, skipping...`);
        continue;
      }

      // Add each customization group except Bread Type
      for (const mcg of hotSubItem.customizationGroups) {
        // Skip Bread Type customization for sandwiches
        if (mcg.customizationGroup.name === 'Bread Type') {
          console.log(`   ⏭️ Skipping: ${mcg.customizationGroup.name} (not applicable for sandwiches)`);
          continue;
        }

        const connection = await prisma.menuItemCustomization.create({
          data: {
            menuItemId: sandwich.id,
            customizationGroupId: mcg.customizationGroupId,
            isRequired: mcg.isRequired,
            sortOrder: mcg.sortOrder
          }
        });

        totalConnections++;
        console.log(`   ✅ Added: ${mcg.customizationGroup.name}`);
      }
    }

    console.log(`\n🎉 Successfully applied customizations!`);
    console.log(`✅ Total connections created: ${totalConnections}`);
    console.log(`✅ Items processed: ${sandwichItems.length}`);

    // Verify the result
    console.log('\n🔍 Verification - checking a sample sandwich item...');
    const verificationItem = await prisma.menuItem.findFirst({
      where: { categoryId: sandwichesCategory.id },
      include: {
        customizationGroups: {
          include: {
            customizationGroup: true
          }
        }
      }
    });

    if (verificationItem) {
      console.log(`📋 ${verificationItem.name} now has ${verificationItem.customizationGroups.length} customization groups:`);
      verificationItem.customizationGroups.forEach((mcg, index) => {
        console.log(`   ${index + 1}. ${mcg.customizationGroup.name} (Required: ${mcg.isRequired})`);
      });
    }

  } catch (error) {
    console.error('❌ Error adding customizations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addCustomizationsToSandwiches();
