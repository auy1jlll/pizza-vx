const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function inspectMenuImages() {
  console.log('🔍 Inspecting current menu item images...\n');

  try {
    // Get all menu items with their categories
    const menuItems = await prisma.menuItem.findMany({
      include: {
        category: true
      },
      orderBy: [
        { category: { name: 'asc' } },
        { name: 'asc' }
      ]
    });

    console.log(`📋 Found ${menuItems.length} menu items\n`);

    let categoryName = '';
    for (const item of menuItems) {
      if (item.category?.name !== categoryName) {
        categoryName = item.category?.name || 'Unknown';
        console.log(`\n🏷️  === ${categoryName.toUpperCase()} ===`);
      }
      
      console.log(`📱 ${item.name}`);
      if (item.imageUrl) {
        // Extract the photo ID from Unsplash URL to see what image it is
        const match = item.imageUrl.match(/photo-([a-zA-Z0-9_-]+)/);
        const photoId = match ? match[1] : 'unknown';
        console.log(`   🖼️  ${photoId}`);
        console.log(`   🔗 ${item.imageUrl.split('?')[0]}`);
      } else {
        console.log(`   ❌ No image set`);
      }
    }

    // Let's specifically look for problematic items
    console.log('\n\n🔍 CHECKING SPECIFIC ITEMS THAT MIGHT BE WRONG...\n');
    
    const bltItem = await prisma.menuItem.findFirst({
      where: {
        name: {
          contains: 'BLT',
          mode: 'insensitive'
        }
      }
    });
    
    if (bltItem) {
      console.log(`🥪 BLT Item: ${bltItem.name}`);
      console.log(`   Image: ${bltItem.imageUrl}`);
    }

    // Check a few more potentially problematic items
    const problematicItems = ['Italian Sub', 'Turkey Sub', 'Sea Monster'];
    
    for (const searchTerm of problematicItems) {
      const item = await prisma.menuItem.findFirst({
        where: {
          name: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        }
      });
      
      if (item) {
        console.log(`🍽️  ${item.name}`);
        console.log(`   Image: ${item.imageUrl}`);
      }
    }

  } catch (error) {
    console.error('❌ Error during inspection:', error);
  } finally {
    await prisma.$disconnect();
  }
}

inspectMenuImages();
