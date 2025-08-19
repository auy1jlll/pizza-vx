const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function analyzeMenuItems() {
  try {
    console.log('=== ANALYZING MENU ITEM TYPES ===\n');

    // Get all order items and analyze their notes
    const orderItems = await prisma.orderItem.findMany({
      include: {
        order: {
          select: {
            orderNumber: true,
            customerName: true,
            status: true
          }
        }
      }
    });

    const categories = new Map();
    const pizzaItems = [];
    const menuItems = [];

    orderItems.forEach(item => {
      if (item.pizzaSizeId && item.pizzaCrustId && item.pizzaSauceId) {
        // This is a pizza
        pizzaItems.push(item);
      } else {
        // This is a menu item
        menuItems.push(item);
        
        // Extract category from notes
        const notes = item.notes || '';
        const categoryMatch = notes.match(/\*\*(.*?)\*\*\s*\((.*?)\)/);
        if (categoryMatch) {
          const itemName = categoryMatch[1];
          const category = categoryMatch[2];
          
          if (!categories.has(category)) {
            categories.set(category, []);
          }
          categories.get(category).push({
            name: itemName,
            notes: notes,
            orderNumber: item.order.orderNumber
          });
        }
      }
    });

    console.log(`Total order items: ${orderItems.length}`);
    console.log(`Pizza items: ${pizzaItems.length}`);
    console.log(`Menu items: ${menuItems.length}\n`);

    console.log('=== MENU ITEM CATEGORIES ===');
    categories.forEach((items, category) => {
      console.log(`\n${category.toUpperCase()} (${items.length} items):`);
      const uniqueItems = new Map();
      items.forEach(item => {
        if (!uniqueItems.has(item.name)) {
          uniqueItems.set(item.name, item);
        }
      });
      
      uniqueItems.forEach((item, name) => {
        console.log(`  - ${name}`);
        console.log(`    Example order: ${item.orderNumber}`);
        console.log(`    Notes format: ${item.notes.substring(0, 100)}...`);
      });
    });

    // Sample a few recent menu items to see the structure
    console.log('\n=== RECENT MENU ITEM EXAMPLES ===');
    const recentMenuItems = menuItems.slice(-5);
    recentMenuItems.forEach((item, index) => {
      console.log(`\nExample ${index + 1}:`);
      console.log(`Order: ${item.order.orderNumber}`);
      console.log(`Quantity: ${item.quantity}`);
      console.log(`Price: $${item.totalPrice}`);
      console.log(`Notes: ${item.notes}`);
    });

  } catch (error) {
    console.error('Error analyzing menu items:', error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeMenuItems();
