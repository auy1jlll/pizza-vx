const { PrismaClient } = require('@prisma/client');

async function checkAndAddSizes() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking existing sizes...');
    
    const existingSizes = await prisma.pizzaSize.findMany();
    console.log('Current sizes:', existingSizes.length);
    
    if (existingSizes.length === 0) {
      console.log('Adding default sizes...');
      
      const sizes = [
        { name: 'SMALL', diameter: '10"', basePrice: 12.99 },
        { name: 'MEDIUM', diameter: '12"', basePrice: 15.99 },
        { name: 'LARGE', diameter: '14"', basePrice: 18.99 },
        { name: 'EXTRA LARGE', diameter: '16"', basePrice: 21.99 }
      ];
      
      let sizeCount = 0;
      for (const size of sizes) {
        try {
          await prisma.pizzaSize.create({ data: size });
          sizeCount++;
        } catch (error) {
          if (error.code === 'P2002') {
            console.log(`Size ${size.name} already exists, skipping...`);
          } else {
            throw error;
          }
        }
      }
      console.log('✅ Added sizes:', sizeCount);
    } else {
      console.log('✅ Sizes already exist:', existingSizes.map(s => s.name).join(', '));
    }

    console.log('🎉 Size check complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndAddSizes();
