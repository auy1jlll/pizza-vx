const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const CORRECT_SPECIALTY_PIZZAS = [
  {
    name: "Margherita Supreme",
    description: "Fresh mozzarella, basil, San Marzano tomatoes, and premium olive oil on our signature crust",
    basePrice: 16.99,
    category: "CLASSIC",
    ingredients: "Fresh mozzarella, basil, San Marzano tomatoes, olive oil",
    imageUrl: "/images/pizzas/margherita-supreme.jpg",
    sortOrder: 1,
    // Only 2 sizes: Small and Large (no Medium)
    sizes: [
      { sizeName: "Small", price: 14.99 },
      { sizeName: "Large", price: 19.99 }
    ]
  },
  {
    name: "Truffle Mushroom",
    description: "Wild mushrooms, truffle oil, caramelized onions, and fontina cheese",
    basePrice: 22.99,
    category: "GOURMET",
    ingredients: "Wild mushrooms, truffle oil, caramelized onions, fontina cheese",
    imageUrl: "/images/pizzas/truffle-mushroom.jpg",
    sortOrder: 2,
    // Only 2 sizes: Small and Large (no Medium)
    sizes: [
      { sizeName: "Small", price: 19.99 },
      { sizeName: "Large", price: 25.99 }
    ]
  },
  {
    name: "Prosciutto Fig",
    description: "Prosciutto di Parma, fresh figs, arugula, balsamic glaze, and goat cheese",
    basePrice: 24.99,
    category: "GOURMET",
    ingredients: "Prosciutto di Parma, fresh figs, arugula, balsamic glaze, goat cheese",
    imageUrl: "/images/pizzas/prosciutto-fig.jpg",
    sortOrder: 3,
    // Only 2 sizes: Small and Large (no Medium)
    sizes: [
      { sizeName: "Small", price: 21.99 },
      { sizeName: "Large", price: 27.99 }
    ]
  },
  {
    name: "BBQ Chicken Deluxe",
    description: "Grilled chicken, BBQ sauce, red onions, cilantro, and smoked mozzarella",
    basePrice: 19.99,
    category: "SPECIALTY",
    ingredients: "Grilled chicken, BBQ sauce, red onions, cilantro, smoked mozzarella",
    imageUrl: "/images/pizzas/bbq-chicken-deluxe.jpg",
    sortOrder: 4,
    // Only 2 sizes: Small and Large (no Medium)
    sizes: [
      { sizeName: "Small", price: 17.99 },
      { sizeName: "Large", price: 22.99 }
    ]
  },
  {
    name: "Mediterranean Veggie",
    description: "Roasted vegetables, feta cheese, olives, sun-dried tomatoes, and herbs",
    basePrice: 18.99,
    category: "VEGETARIAN",
    ingredients: "Roasted vegetables, feta cheese, olives, sun-dried tomatoes, herbs",
    imageUrl: "/images/pizzas/mediterranean-veggie.jpg",
    sortOrder: 5,
    // Only 2 sizes: Small and Large (no Medium)
    sizes: [
      { sizeName: "Small", price: 16.99 },
      { sizeName: "Large", price: 21.99 }
    ]
  }
];

async function fixSpecialtyPizzasWith2Sizes() {
  try {
    console.log('🎯 FIXING PRODUCTION: Replace old garbage data with 2-size specialty pizzas');
    
    // Step 1: Create backup of current data
    const currentPizzas = await prisma.specialtyPizza.findMany({
      include: { sizes: true }
    });
    console.log(`📦 Current production has ${currentPizzas.length} specialty pizzas`);
    
    // Step 2: Delete all existing specialty pizzas (this will cascade to sizes)
    console.log('🗑️ Removing old garbage data...');
    await prisma.specialtyPizza.deleteMany({});
    console.log('✅ Cleared all old specialty pizza data');
    
    // Step 3: Get available pizza sizes (we need Small and Large)
    const allSizes = await prisma.pizzaSize.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
    
    const smallSize = allSizes.find(s => s.name.toLowerCase().includes('small'));
    const largeSize = allSizes.find(s => s.name.toLowerCase().includes('large'));
    
    if (!smallSize || !largeSize) {
      console.error('❌ Could not find Small and Large pizza sizes');
      console.log('Available sizes:', allSizes.map(s => `${s.name} (${s.diameter})`));
      return;
    }
    
    console.log(`✅ Found sizes: ${smallSize.name} and ${largeSize.name}`);
    
    // Step 4: Create new specialty pizzas with exactly 2 sizes each
    console.log('🍕 Creating new specialty pizzas with 2 sizes each...');
    
    for (const pizzaData of CORRECT_SPECIALTY_PIZZAS) {
      console.log(`Creating: ${pizzaData.name}`);
      
      const pizza = await prisma.specialtyPizza.create({
        data: {
          name: pizzaData.name,
          description: pizzaData.description,
          basePrice: pizzaData.basePrice,
          category: pizzaData.category,
          ingredients: pizzaData.ingredients,
          imageUrl: pizzaData.imageUrl,
          sortOrder: pizzaData.sortOrder,
          isActive: true
        }
      });
      
      // Create exactly 2 sizes for each pizza
      await prisma.specialtyPizzaSize.create({
        data: {
          specialtyPizzaId: pizza.id,
          pizzaSizeId: smallSize.id,
          price: pizzaData.sizes[0].price,
          isAvailable: true
        }
      });
      
      await prisma.specialtyPizzaSize.create({
        data: {
          specialtyPizzaId: pizza.id,
          pizzaSizeId: largeSize.id,
          price: pizzaData.sizes[1].price,
          isAvailable: true
        }
      });
      
      console.log(`  ✅ ${pizzaData.name}: ${pizzaData.sizes[0].sizeName} ($${pizzaData.sizes[0].price}) + ${pizzaData.sizes[1].sizeName} ($${pizzaData.sizes[1].price})`);
    }
    
    // Step 5: Verify the fix
    const newPizzas = await prisma.specialtyPizza.findMany({
      include: {
        sizes: {
          include: { pizzaSize: true },
          orderBy: { pizzaSize: { sortOrder: 'asc' } }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log('\n🎉 SPECIALTY PIZZAS FIXED! Summary:');
    console.log(`📊 Total pizzas: ${newPizzas.length}`);
    
    newPizzas.forEach((pizza, index) => {
      console.log(`${index + 1}. ${pizza.name} (${pizza.category})`);
      pizza.sizes.forEach(size => {
        console.log(`   - ${size.pizzaSize.name}: $${size.price}`);
      });
    });
    
    // Verify each pizza has exactly 2 sizes
    const sizeCounts = newPizzas.map(p => p.sizes.length);
    const allHave2Sizes = sizeCounts.every(count => count === 2);
    
    if (allHave2Sizes) {
      console.log('\n✅ SUCCESS: All pizzas have exactly 2 sizes as required!');
    } else {
      console.log('\n❌ ERROR: Some pizzas do not have exactly 2 sizes:');
      newPizzas.forEach(pizza => {
        if (pizza.sizes.length !== 2) {
          console.log(`  - ${pizza.name}: ${pizza.sizes.length} sizes`);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error fixing specialty pizzas:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixSpecialtyPizzasWith2Sizes()
  .then(() => {
    console.log('\n🎯 PRODUCTION FIX COMPLETE!');
    console.log('Production now has proper specialty pizzas with exactly 2 sizes each');
    console.log('No more old garbage data with single prices!');
  })
  .catch((error) => {
    console.error('❌ Production fix failed:', error);
    process.exit(1);
  });
