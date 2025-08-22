const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateCalzoneTypes() {
  try {
    console.log('🔄 Updating calzone product types...');
    
    // Update calzone sizes to have CALZONE product type
    const updated = await prisma.pizzaSize.updateMany({
      where: {
        name: {
          contains: 'Calzone'
        }
      },
      data: {
        productType: 'CALZONE'
      }
    });
    
    console.log(`✅ Updated ${updated.count} calzone sizes`);
    
    // Verify the changes
    const allSizes = await prisma.pizzaSize.findMany({ 
      orderBy: { sortOrder: 'asc' } 
    });
    
    console.log('\n📊 All sizes with product types:');
    allSizes.forEach(size => {
      console.log(`   ${size.name}: $${size.basePrice} (${size.productType})`);
    });
    
  } catch (error) {
    console.error('❌ Error updating calzone types:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCalzoneTypes();
