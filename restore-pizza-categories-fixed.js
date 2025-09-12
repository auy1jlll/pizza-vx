const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function to create slug from name
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

async function restorePizzaCategories() {
  try {
    console.log('🍕 Restoring Missing Pizza Categories...');
    console.log('=========================================');
    
    // Define the main pizza categories that should exist
    const pizzaCategories = [
      {
        name: 'Pizza',
        slug: 'pizza',
        description: 'Build your own pizza with fresh ingredients',
        sortOrder: 1,
        isActive: true
      },
      {
        name: 'Specialty Pizzas',
        slug: 'specialty-pizzas',
        description: 'Our signature pizzas with unique combinations',
        sortOrder: 2,
        isActive: true
      },
      {
        name: 'Calzones',
        slug: 'calzones',
        description: 'Build your own calzone with fresh ingredients',
        sortOrder: 3,
        isActive: true
      },
      {
        name: 'Specialty Calzones',
        slug: 'specialty-calzones',
        description: 'Our signature calzones with unique combinations',
        sortOrder: 4,
        isActive: true
      },
      {
        name: 'Pasta',
        slug: 'pasta',
        description: 'Hearty pasta dishes with your choice of sauce',
        sortOrder: 7,
        isActive: true
      },
      {
        name: 'Beverages',
        slug: 'beverages',
        description: 'Refreshing drinks and beverages',
        sortOrder: 10,
        isActive: true
      },
      {
        name: 'Desserts',
        slug: 'desserts',
        description: 'Sweet treats to end your meal',
        sortOrder: 11,
        isActive: true
      },
      {
        name: 'Sides',
        slug: 'sides',
        description: 'Perfect sides to complement your meal',
        sortOrder: 12,
        isActive: true
      },
      {
        name: 'Kids Menu',
        slug: 'kids-menu',
        description: 'Kid-friendly portions and favorites',
        sortOrder: 14,
        isActive: true
      },
      {
        name: 'Vegetarian',
        slug: 'vegetarian',
        description: 'Vegetarian options and plant-based meals',
        sortOrder: 15,
        isActive: true
      },
      {
        name: 'Gluten Free',
        slug: 'gluten-free',
        description: 'Gluten-free options for dietary needs',
        sortOrder: 16,
        isActive: true
      },
      {
        name: 'Combo Meals',
        slug: 'combo-meals',
        description: 'Great value combo meals',
        sortOrder: 17,
        isActive: true
      },
      {
        name: 'Family Deals',
        slug: 'family-deals',
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
    
    console.log(`Found ${pizzaToppings.length} pizza toppings`);
    
    // Get pizza categories
    const pizzaCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Pizza' }
    });
    
    const calzoneCategory = await prisma.menuCategory.findFirst({
      where: { name: 'Calzones' }
    });
    
    if (pizzaCategory && pizzaToppings.length > 0) {
      console.log(`\n🍕 Linking ${pizzaToppings.length} toppings to Pizza category...`);
      
      let linkedCount = 0;
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
          
          linkedCount++;
          
        } catch (error) {
          console.error(`❌ Error linking topping "${topping.name}":`, error.message);
        }
      }
      
      console.log(`✅ Linked ${linkedCount} toppings to Pizza category`);
    }
    
    if (calzoneCategory && pizzaToppings.length > 0) {
      console.log(`\n🥟 Linking ${pizzaToppings.length} toppings to Calzones category...`);
      
      let linkedCount = 0;
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
          
          linkedCount++;
          
        } catch (error) {
          console.error(`❌ Error linking topping "${topping.name}":`, error.message);
        }
      }
      
      console.log(`✅ Linked ${linkedCount} toppings to Calzones category`);
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
