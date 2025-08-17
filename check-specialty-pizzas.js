const { PrismaClient } = require('@prisma/client');

async function checkSpecialtyPizzas() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🍕 Checking specialty pizzas data...\n');
    
    // Check total count
    const totalCount = await prisma.specialtyPizza.count();
    console.log(`Total specialty pizzas: ${totalCount}`);
    
    // Check active count
    const activeCount = await prisma.specialtyPizza.count({
      where: { isActive: true }
    });
    console.log(`Active specialty pizzas: ${activeCount}`);
    
    // Check sizes relationship
    const sizesCount = await prisma.specialtyPizzaSize.count();
    console.log(`Specialty pizza sizes: ${sizesCount}`);
    
    // Sample the data structure
    const samplePizza = await prisma.specialtyPizza.findFirst({
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      }
    });
    
    if (samplePizza) {
      console.log('\n📊 Sample specialty pizza structure:');
      console.log(`Name: ${samplePizza.name}`);
      console.log(`Sizes count: ${samplePizza.sizes.length}`);
      console.log('Sizes:', samplePizza.sizes.map(s => s.pizzaSize?.name || 'Unknown'));
    }
    
    // Test the problematic query
    console.log('\n🔍 Testing the problematic query...');
    const startTime = Date.now();
    
    const result = await prisma.specialtyPizza.findMany({
      where: {
        isActive: true
      },
      include: {
        sizes: {
          include: {
            pizzaSize: true
          },
          where: {
            isAvailable: true
          },
          orderBy: {
            pizzaSize: {
              sortOrder: 'asc'
            }
          }
        }
      },
      orderBy: {
        category: 'asc'
      }
    });
    
    const endTime = Date.now();
    console.log(`Query completed in ${endTime - startTime}ms`);
    console.log(`Returned ${result.length} specialty pizzas`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error checking specialty pizzas:', error);
    return false;
    
  } finally {
    await prisma.$disconnect();
  }
}

checkSpecialtyPizzas().catch(console.error);
