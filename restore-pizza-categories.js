const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function restorePizzaCategories() {
  try {
    console.log('🍕 Restoring Missing Pizza Categories...');
    console.log('=========================================');
    
    // Define the main pizza categories that should exist
    const pizzaCategories = [
      {
        name: 'Pizza',
        description: 'Build your own pizza with fresh ingredients',
        sortOrder: 1,
        isActive: true
      },
      {
        name: 'Specialty Pizzas',
        description: 'Our signature pizzas with unique combinations',
        sortOrder: 2,
        isActive: true
      },
      {
        name: 'Calzones',
        description: 'Build your own calzone with fresh ingredients',
        sortOrder: 3,
        isActive: true
      },
      {
        name: 'Specialty Calzones',
        description: 'Our signature calzones with unique combinations',
        sortOrder: 4,
        isActive: true
      },
      {
        name: 'Appetizers',
        description: 'Start your meal with our delicious appetizers',
        sortOrder: 5,
        isActive: true
      },
      {
        name: 'Salads',
        description: 'Fresh, healthy salads with various toppings and dressings',
        sortOrder: 6,
        isActive: true
      },
      {
        name: 'Pasta',
        description: 'Hearty pasta dishes with your choice of sauce',
        sortOrder: 7,
        isActive: true
      },
      {
        name: 'Sandwiches',
        description: 'Classic sandwiches and burgers',
        sortOrder: 8,
        isActive: true
      },
      {
        name: 'Wings',
        description: 'Chicken wings in various flavors',
        sortOrder: 9,
        isActive: true
      },
      {
        name: 'Beverages',
        description: 'Refreshing drinks and beverages',
        sortOrder: 10,
        isActive: true
      },
      {
        name: 'Desserts',
        description: 'Sweet treats to end your meal',
        sortOrder: 11,
        isActive: true
      },
      {
        name: 'Sides',
        description: 'Perfect sides to complement your meal',
        sortOrder: 12,
        isActive: true
      },
      {
        name: 'Soups',
        description: 'Hot soups and chowders',
        sortOrder: 13,
        isActive: true
      },
      {
        name: 'Kids Menu',
        description: 'Kid-friendly portions and favorites',
        sortOrder: 14,
        isActive: true
      },
      {
        name: 'Vegetarian',
        description: 'Vegetarian options and plant-based meals',
        sortOrder: 15,
        isActive: true
      },
      {
        name: 'Gluten Free',
        description: 'Gluten-free options for dietary needs',
        sortOrder: 16,
        isActive: true
      },
      {
        name: 'Combo Meals',
        description: 'Great value combo meals',
        sortOrder: 17,
        isActive: true
      },
      {
        name: 'Family Deals',
        description: 'Family-sized portions and deals',
        sortOrder: 18,
        isActive: true
      }
    ];
    
    console.log(`\n📋 Creating ${pizzaCategories.length} pizza categories...`);
    
    // Create categories one by one to avoid conflicts
    for (const categoryData of pizzaCategories) {
      try {
        // Check if category already exists
        const existing = await prisma.menuCategory.findFirst({
          where: { name: categoryData.name }
        });
        
        if (existing) {
          console.log(`✅ Category "${categoryData.name}" already exists`);
          continue;
        }
        
        // Create new category
        const category = await prisma.menuCategory.create({
          data: categoryData
        });
        
        console.log(`✅ Created category: ${category.name} (ID: ${category.id})`);
        
      } catch (error) {
        console.error(`❌ Error creating category "${categoryData.name}":`, error.message);
      }
    }
    
    // Now create category-topping relationships
    console.log('\n🔗 Creating Category-Topping Relationships...');
    
    // Get all pizza toppings
    const pizzaToppings = await prisma.pizzaTopping.findMany({
      where: { isActive: true }
    });
    
    // Get pizza categories
    const pizzaCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Pizza' }
    });
    
    const specialtyPizzaCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Specialty Pizzas' }
    });
    
    if (pizzaCategory && pizzaToppings.length > 0) {
      console.log(`\n🍕 Linking ${pizzaToppings.length} toppings to Pizza category...`);
      
      for (const topping of pizzaToppings) {
        try {
          // Check if relationship already exists
          const existing = await prisma.categoryTopping.findFirst({
            where: {
              categoryId: pizzaCategory.id,
              toppingId: topping.id
            }
          });
          
          if (existing) {
            continue; // Skip if already exists
          }
          
          // Create category-topping relationship
          await prisma.categoryTopping.create({
            data: {
              categoryId: pizzaCategory.id,
              toppingId: topping.id
            }
          });
          
        } catch (error) {
          console.error(`❌ Error linking topping "${topping.name}":`, error.message);
        }
      }
      
      console.log('✅ Pizza category-topping relationships created');
    }
    
    // Create calzone category-topping relationships
    const calzoneCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Calzones' }
    });
    
    if (calzoneCategory && pizzaToppings.length > 0) {
      console.log(`\n🥟 Linking ${pizzaToppings.length} toppings to Calzones category...`);
      
      for (const topping of pizzaToppings) {
        try {
          // Check if relationship already exists
          const existing = await prisma.categoryTopping.findFirst({
            where: {
              categoryId: calzoneCategory.id,
              toppingId: topping.id
            }
          });
          
          if (existing) {
            continue; // Skip if already exists
          }
          
          // Create category-topping relationship
          await prisma.categoryTopping.create({
            data: {
              categoryId: calzoneCategory.id,
              toppingId: topping.id
            }
          });
          
        } catch (error) {
          console.error(`❌ Error linking topping "${topping.name}":`, error.message);
        }
      }
      
      console.log('✅ Calzones category-topping relationships created');
    }
    
    // Final verification
    console.log('\n📊 Final Category Count:');
    const totalCategories = await prisma.menuCategory.count({
      where: { isActive: true }
    });
    console.log(`Total Active Categories: ${totalCategories}`);
    
    const pizzaCategoriesCount = await prisma.menuCategory.count({
      where: {
        isActive: true,
        name: {
          contains: 'pizza',
          mode: 'insensitive'
        }
      }
    });
    console.log(`Pizza-Related Categories: ${pizzaCategoriesCount}`);
    
    const categoryToppingCount = await prisma.categoryTopping.count();
    console.log(`Category-Topping Relationships: ${categoryToppingCount}`);
    
    console.log('\n🎉 Pizza categories and relationships restored successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restorePizzaCategories();
