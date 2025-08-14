const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateSpecialtyPizzaImages() {
  try {
    const pizzas = await prisma.specialtyPizza.findMany({
      select: { id: true, name: true, imageUrl: true }
    });
    
    console.log('=== CURRENT SPECIALTY PIZZAS ===');
    pizzas.forEach((pizza, index) => {
      console.log(`${index + 1}. ${pizza.name}`);
      console.log(`   ID: ${pizza.id}`);
      console.log(`   Image: ${pizza.imageUrl || 'No image'}`);
      console.log('---');
    });
    
    console.log(`Total pizzas: ${pizzas.length}`);
    
    // Add sample images for pizzas without images
    const pizzaImages = {
      'Margherita Classic': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop&auto=format',
      'Pepperoni Supreme': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop&auto=format', 
      'Meat Lovers Deluxe': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop&auto=format',
      'BBQ Chicken Ranch': 'https://images.unsplash.com/photo-1579751626657-72bc17010498?w=400&h=400&fit=crop&auto=format',
      'Hawaiian Paradise': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop&auto=format'
    };
    
    let updatedCount = 0;
    for (const pizza of pizzas) {
      if (!pizza.imageUrl && pizzaImages[pizza.name]) {
        await prisma.specialtyPizza.update({
          where: { id: pizza.id },
          data: { imageUrl: pizzaImages[pizza.name] }
        });
        console.log(`✅ Updated ${pizza.name} with image`);
        updatedCount++;
      }
    }
    
    console.log(`\nUpdated ${updatedCount} pizzas with sample images`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateSpecialtyPizzaImages();
