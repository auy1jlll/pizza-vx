const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('🔍 Checking Database Contents...\n');
  
  try {
    // Check menu categories
    const categories = await prisma.menuCategory.findMany({
      include: { _count: { select: { menuItems: true } } }
    });
    console.log('📁 Menu Categories:');
    categories.forEach(cat => {
      console.log(`   - ${cat.name}: ${cat._count.menuItems} items`);
    });
    
    // Check menu items
    const menuItems = await prisma.menuItem.findMany({
      include: { category: true }
    });
    console.log('\n🍽️ Menu Items:');
    menuItems.forEach(item => {
      console.log(`   - ${item.name}: $${item.price} (${item.category.name})`);
    });
    
    // Check pizza sizes
    const pizzaSizes = await prisma.pizzaSize.findMany();
    console.log('\n🍕 Pizza Sizes:');
    pizzaSizes.forEach(size => {
      console.log(`   - ${size.name}: $${size.basePrice}`);
    });
    
    // Check specialty pizzas
    const specialtyPizzas = await prisma.specialtyPizza.findMany();
    console.log('\n🏆 Specialty Pizzas:');
    specialtyPizzas.forEach(pizza => {
      console.log(`   - ${pizza.name}: $${pizza.basePrice}`);
    });

    // Check what might be in localStorage format for testing
    console.log('\n🛒 Sample Cart Item Structure:');
    if (menuItems.length > 0) {
      const sampleItem = menuItems[0];
      console.log('Sample menu item for cart:', {
        id: `menu_${Date.now()}`,
        menuItemId: sampleItem.id,
        name: sampleItem.name,
        price: parseFloat(sampleItem.price),
        finalPrice: parseFloat(sampleItem.price),
        quantity: 1,
        type: 'menu'
      });
    }
    
    console.log('\n✅ Database check complete');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
