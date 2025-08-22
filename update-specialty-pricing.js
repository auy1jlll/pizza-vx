const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateSpecialtyPizzaPricing() {
  try {
    console.log('🍕 UPDATING SPECIALTY PIZZA PRICING');
    console.log('====================================');
    console.log('Target Pricing:');
    console.log('- Small: $15.45');
    console.log('- Large: $23.50');
    console.log('');

    // Get all specialty pizzas with their sizes
    const specialtyPizzas = await prisma.specialtyPizza.findMany({
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      }
    });

    console.log(`Found ${specialtyPizzas.length} specialty pizzas to update:`);
    
    let totalUpdates = 0;
    
    for (const pizza of specialtyPizzas) {
      console.log(`\n📝 Updating: ${pizza.name}`);
      
      for (const sizeRelation of pizza.sizes) {
        const sizeName = sizeRelation.pizzaSize.name.toLowerCase();
        let newPrice;
        
        if (sizeName.includes('small')) {
          newPrice = 15.45;
        } else if (sizeName.includes('large')) {
          newPrice = 23.50;
        } else {
          console.log(`   ⚠️  Unknown size: ${sizeRelation.pizzaSize.name} - skipping`);
          continue;
        }
        
        // Update the price
        await prisma.specialtyPizzaSize.update({
          where: {
            id: sizeRelation.id
          },
          data: {
            price: newPrice
          }
        });
        
        console.log(`   ✅ ${sizeRelation.pizzaSize.name}: $${sizeRelation.price} → $${newPrice}`);
        totalUpdates++;
      }
    }
    
    console.log(`\n🎉 PRICING UPDATE COMPLETE!`);
    console.log(`===========================`);
    console.log(`Total price updates: ${totalUpdates}`);
    
    // Verify the changes
    console.log('\n📊 VERIFICATION - Updated Pricing:');
    console.log('===================================');
    
    const updatedPizzas = await prisma.specialtyPizza.findMany({
      include: {
        sizes: {
          include: {
            pizzaSize: true
          },
          orderBy: {
            pizzaSize: {
              sortOrder: 'asc'
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    for (const pizza of updatedPizzas) {
      console.log(`\n${pizza.name}:`);
      for (const size of pizza.sizes) {
        console.log(`  ${size.pizzaSize.name}: $${size.price}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error updating specialty pizza pricing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateSpecialtyPizzaPricing();
