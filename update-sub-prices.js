const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateSubPrices() {
  try {
    console.log('💰 Updating sub prices to $12.74...');

    // Find Cold Subs and Hot Subs categories
    const subCategories = await prisma.menuCategory.findMany({
      where: {
        name: {
          in: ['Cold Subs', 'Hot Subs']
        }
      }
    });

    if (subCategories.length === 0) {
      throw new Error('Cold Subs and Hot Subs categories not found');
    }

    console.log(`Found ${subCategories.length} sub categories`);

    // Get all menu items in these categories
    const subItems = await prisma.menuItem.findMany({
      where: {
        category: {
          name: {
            in: ['Cold Subs', 'Hot Subs']
          }
        }
      },
      include: {
        category: true
      }
    });

    console.log(`Found ${subItems.length} sub items to update`);

    if (subItems.length === 0) {
      console.log('No sub items found to update');
      return;
    }

    // Show current prices
    console.log('\n📋 Current Prices:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    subItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} (${item.category.name}) - $${item.basePrice.toFixed(2)}`);
    });

    // Update all sub prices to $12.74
    const newPrice = 12.74;
    
    const updateResult = await prisma.menuItem.updateMany({
      where: {
        category: {
          name: {
            in: ['Cold Subs', 'Hot Subs']
          }
        }
      },
      data: {
        basePrice: newPrice
      }
    });

    console.log(`\n✅ Updated ${updateResult.count} sub items to $${newPrice.toFixed(2)}`);

    // Verify the updates
    const updatedItems = await prisma.menuItem.findMany({
      where: {
        category: {
          name: {
            in: ['Cold Subs', 'Hot Subs']
          }
        }
      },
      include: {
        category: true
      },
      orderBy: [
        { category: { name: 'asc' } },
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    console.log('\n📋 Updated Prices:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    let coldSubsCount = 0;
    let hotSubsCount = 0;
    
    updatedItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} (${item.category.name}) - $${item.basePrice.toFixed(2)}`);
      
      if (item.category.name === 'Cold Subs') coldSubsCount++;
      if (item.category.name === 'Hot Subs') hotSubsCount++;
    });

    console.log('\n🎉 Price Update Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`💵 New Price: $${newPrice.toFixed(2)} for all subs`);
    console.log(`🥪 Cold Subs Updated: ${coldSubsCount} items`);
    console.log(`🌭 Hot Subs Updated: ${hotSubsCount} items`);
    console.log(`📊 Total Items Updated: ${updateResult.count}`);

  } catch (error) {
    console.error('❌ Error updating sub prices:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
updateSubPrices()
  .then(() => {
    console.log('\n✅ Sub prices updated successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Failed to update sub prices:', error);
    process.exit(1);
  });
