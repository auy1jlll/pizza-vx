// Test script to verify calzone data structure
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCalzoneData() {
  try {
    console.log('🧪 Testing calzone data structure...\n');

    // Get calzones from specialty pizzas
    const calzones = await prisma.specialtyPizza.findMany({
      where: {
        category: 'CALZONE'
      },
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      }
    });

    console.log(`Found ${calzones.length} calzones:`);
    
    calzones.forEach((calzone, index) => {
      console.log(`\n${index + 1}. ${calzone.name}`);
      console.log(`   Base Price: $${calzone.basePrice}`);
      console.log(`   Sizes available:`);
      
      if (calzone.sizes && calzone.sizes.length > 0) {
        calzone.sizes.forEach(sizeOption => {
          console.log(`     - ${sizeOption.pizzaSize.name}: $${sizeOption.price}`);
        });
      } else {
        console.log(`     - No sizes configured!`);
      }
    });

    console.log('\n🎯 Expected on webpage:');
    console.log('- Size buttons should show "Small Calzone", "Large Calzone"');
    console.log('- Prices should be from the sizes array, not base prices');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCalzoneData();
