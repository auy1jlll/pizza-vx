const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixCalzoneIngredients() {
  try {
    console.log('🔧 Fixing calzone ingredients to JSON format...');
    
    const calzones = await prisma.specialtyPizza.findMany({
      where: {
        category: 'CALZONE'
      }
    });
    
    console.log(`Found ${calzones.length} calzones to fix`);
    
    for (const calzone of calzones) {
      // Convert text ingredients to JSON array
      let ingredientsArray = [];
      
      if (calzone.ingredients && typeof calzone.ingredients === 'string') {
        // Try to parse as JSON first
        try {
          ingredientsArray = JSON.parse(calzone.ingredients);
        } catch {
          // If not JSON, split the text into an array
          ingredientsArray = calzone.ingredients
            .split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0);
        }
      }
      
      const updatedCalzone = await prisma.specialtyPizza.update({
        where: { id: calzone.id },
        data: {
          ingredients: JSON.stringify(ingredientsArray)
        }
      });
      
      console.log(`✅ Fixed ${calzone.name}: ${ingredientsArray.length} ingredients`);
    }
    
    console.log('\n🎉 All calzone ingredients fixed!');
    
  } catch (error) {
    console.error('❌ Error fixing calzone ingredients:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCalzoneIngredients();
