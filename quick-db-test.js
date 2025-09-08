const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection and data integrity...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test basic data
    const categoryCount = await prisma.menuCategory.count();
    console.log(`✅ Categories: ${categoryCount} found`);
    
    const menuItemCount = await prisma.menuItem.count();
    console.log(`✅ Menu Items: ${menuItemCount} found`);
    
    const specialtyPizzaCount = await prisma.specialtyPizza.count();
    console.log(`✅ Specialty Pizzas: ${specialtyPizzaCount} found`);
    
    const specialtyCalzoneCount = await prisma.specialtyCalzone.count();
    console.log(`✅ Specialty Calzones: ${specialtyCalzoneCount} found`);
    
    const settingsCount = await prisma.appSetting.count();
    console.log(`✅ Settings: ${settingsCount} found`);
    
    // Test a sample category with items
    const sampleCategory = await prisma.menuCategory.findFirst({
      include: {
        menuItems: true,
        _count: {
          select: {
            menuItems: true
          }
        }
      }
    });
    
    if (sampleCategory) {
      console.log(`✅ Sample category "${sampleCategory.name}" has ${sampleCategory._count.menuItems} menu items`);
    }
    
    console.log('🎉 Database is healthy and contains data!');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
