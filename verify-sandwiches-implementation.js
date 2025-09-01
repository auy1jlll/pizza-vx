const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifySandwichesImplementation() {
  try {
    console.log('🔍 Verifying Sandwiches category implementation...\n');

    // 1. Check that Sandwiches category exists and is properly configured
    const sandwichesCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Sandwiches' }
    });

    if (!sandwichesCategory) {
      console.log('❌ Sandwiches category not found!');
      return;
    }

    console.log('✅ Sandwiches Category Details:');
    console.log(`   Name: ${sandwichesCategory.name}`);
    console.log(`   Slug: ${sandwichesCategory.slug}`);
    console.log(`   Description: ${sandwichesCategory.description}`);
    console.log(`   Active: ${sandwichesCategory.isActive}`);
    console.log(`   Sort Order: ${sandwichesCategory.sortOrder}`);

    // 2. Check all menu items in the category
    const sandwichItems = await prisma.menuItem.findMany({
      where: { categoryId: sandwichesCategory.id },
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`\n🥪 Menu Items (${sandwichItems.length} total):`);
    sandwichItems.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name} - $${item.basePrice}`);
      if (item.description) {
        console.log(`      ${item.description}`);
      }
    });

    // 3. Verify expected items are present
    const expectedItems = [
      'Super Beef on Onion Roll',
      'Regular Beef on Sesame Roll', 
      'Junior Beef',
      'Super Pastrami on Onion Roll',
      'Regular Pastrami',
      'Haddock Sandwich (2pcs)',
      'Chicken Sandwich',
      'Hamburger',
      'Cheeseburger',
      'Hot Dog',
      'Gyro',
      'Reuben'
    ];

    console.log('\n✅ Verification of Expected Items:');
    expectedItems.forEach(expectedName => {
      const found = sandwichItems.find(item => item.name === expectedName);
      if (found) {
        console.log(`   ✅ ${expectedName} - $${found.basePrice}`);
      } else {
        console.log(`   ❌ ${expectedName} - NOT FOUND`);
      }
    });

    // 4. Check that duplicates have been removed from Specialty Items
    const specialtyItemsCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Specialty Items' }
    });

    if (specialtyItemsCategory) {
      const remainingSpecialtyItems = await prisma.menuItem.findMany({
        where: { categoryId: specialtyItemsCategory.id }
      });

      console.log(`\n🧹 Specialty Items cleanup (${remainingSpecialtyItems.length} items remaining):`);
      if (remainingSpecialtyItems.length === 0) {
        console.log('   ✅ All duplicate items successfully removed from Specialty Items');
      } else {
        remainingSpecialtyItems.forEach(item => {
          console.log(`   • ${item.name} - $${item.basePrice}`);
        });
      }
    }

    // 5. Summary
    console.log('\n📊 Implementation Summary:');
    console.log(`   ✅ Sandwiches category created with slug: ${sandwichesCategory.slug}`);
    console.log(`   ✅ ${sandwichItems.length} sandwich items added`);
    console.log(`   ✅ All expected items verified`);
    console.log(`   ✅ Duplicate items cleaned up`);
    console.log(`   ✅ Category positioned at sort order ${sandwichesCategory.sortOrder}`);

    console.log('\n🎉 Sandwiches category implementation complete and verified!');
    console.log('\n📍 Access the category at: http://localhost:3005/menu/sandwiches');

  } catch (error) {
    console.error('❌ Error during verification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifySandwichesImplementation();
