const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

// Function to create a slug from a name
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function importMainDataFixed() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Starting database import...');
    
    // Read the exported data
    const data = JSON.parse(fs.readFileSync('main_database_export_2025-09-02T22-39-32-214Z.json', 'utf8'));
    
    console.log('📂 Data file loaded successfully');
    console.log(`📊 Import Summary:`);
    console.log(`- Menu Categories: ${data.menu_categories.length}`);
    console.log(`- Menu Items: ${data.menu_items.length}`);
    console.log(`- Specialty Pizzas: ${data.specialty_pizzas.length}`);
    console.log(`- Customization Groups: ${data.customization_groups.length}`);
    console.log(`- Order Items: ${data.order_items.length}`);
    console.log(`- Orders: ${data.orders.length}`);
    console.log(`- Users: ${data.users.length}`);
    
    // Clear existing data first
    console.log('\n🗑️ Clearing existing data...');
    
    // Delete in correct order to respect foreign key constraints
    await prisma.orderItem.deleteMany();
    console.log('✅ Cleared order items');
    
    await prisma.order.deleteMany();
    console.log('✅ Cleared orders');
    
    await prisma.menuItem.deleteMany();
    console.log('✅ Cleared menu items');
    
    await prisma.specialtyPizza.deleteMany();
    console.log('✅ Cleared specialty pizzas');
    
    await prisma.menuCategory.deleteMany();
    console.log('✅ Cleared menu categories');
    
    await prisma.customizationGroup.deleteMany();
    console.log('✅ Cleared customization groups');
    
    await prisma.user.deleteMany();
    console.log('✅ Cleared users');
    
    // Import data in correct order
    console.log('\n📥 Importing new data...');
    
    // Import parent categories first
    const parentCategories = data.menu_categories.filter(cat => !cat.parentId);
    for (const category of parentCategories) {
      await prisma.menuCategory.create({
        data: {
          id: category.id,
          name: category.name,
          slug: category.slug || createSlug(category.name),
          description: category.description,
          displayOrder: category.displayOrder || 0,
          isActive: category.isActive,
          parentId: category.parentId,
          createdAt: new Date(category.createdAt),
          updatedAt: new Date(category.updatedAt)
        }
      });
    }
    console.log(`✅ Parent categories imported: ${parentCategories.length}`);
    
    // Import child categories
    const childCategories = data.menu_categories.filter(cat => cat.parentId);
    for (const category of childCategories) {
      await prisma.menuCategory.create({
        data: {
          id: category.id,
          name: category.name,
          slug: category.slug || createSlug(category.name),
          description: category.description,
          displayOrder: category.displayOrder || 0,
          isActive: category.isActive,
          parentId: category.parentId,
          createdAt: new Date(category.createdAt),
          updatedAt: new Date(category.updatedAt)
        }
      });
    }
    console.log(`✅ Child categories imported: ${childCategories.length}`);
    
    // Import menu items
    for (const item of data.menu_items) {
      await prisma.menuItem.create({
        data: {
          id: item.id,
          name: item.name,
          description: item.description,
          basePrice: item.basePrice,
          categoryId: item.categoryId,
          isActive: item.isActive,
          displayOrder: item.displayOrder || 0,
          imageUrl: item.imageUrl,
          isSpecial: item.isSpecial || false,
          preparationTime: item.preparationTime,
          calories: item.calories,
          allergens: item.allergens,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt)
        }
      });
    }
    console.log(`✅ Menu items imported: ${data.menu_items.length}`);
    
    // Import specialty pizzas
    for (const pizza of data.specialty_pizzas) {
      await prisma.specialtyPizza.create({
        data: {
          id: pizza.id,
          name: pizza.name,
          description: pizza.description,
          category: pizza.category,
          basePrice: pizza.basePrice,
          isActive: pizza.isActive,
          imageUrl: pizza.imageUrl,
          toppings: pizza.toppings,
          createdAt: new Date(pizza.createdAt),
          updatedAt: new Date(pizza.updatedAt)
        }
      });
    }
    console.log(`✅ Specialty pizzas imported: ${data.specialty_pizzas.length}`);
    
    // Import customization groups
    for (const group of data.customization_groups) {
      await prisma.customizationGroup.create({
        data: {
          id: group.id,
          name: group.name,
          description: group.description,
          isRequired: group.isRequired || false,
          maxSelections: group.maxSelections,
          categoryId: group.categoryId,
          displayOrder: group.displayOrder || 0,
          isActive: group.isActive,
          createdAt: new Date(group.createdAt),
          updatedAt: new Date(group.updatedAt)
        }
      });
    }
    console.log(`✅ Customization groups imported: ${data.customization_groups.length}`);
    
    // Import users
    for (const user of data.users) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          isActive: user.isActive,
          passwordHash: user.passwordHash,
          emailVerified: user.emailVerified || false,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt)
        }
      });
    }
    console.log(`✅ Users imported: ${data.users.length}`);
    
    // Import orders
    for (const order of data.orders) {
      await prisma.order.create({
        data: {
          id: order.id,
          userId: order.userId,
          status: order.status,
          totalAmount: order.totalAmount,
          orderType: order.orderType,
          customerInfo: order.customerInfo,
          deliveryAddress: order.deliveryAddress,
          specialInstructions: order.specialInstructions,
          estimatedDeliveryTime: order.estimatedDeliveryTime ? new Date(order.estimatedDeliveryTime) : null,
          createdAt: new Date(order.createdAt),
          updatedAt: new Date(order.updatedAt)
        }
      });
    }
    console.log(`✅ Orders imported: ${data.orders.length}`);
    
    // Import order items
    for (const item of data.order_items) {
      await prisma.orderItem.create({
        data: {
          id: item.id,
          orderId: item.orderId,
          menuItemId: item.menuItemId,
          specialtyPizzaId: item.specialtyPizzaId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          size: item.size,
          customizations: item.customizations,
          specialInstructions: item.specialInstructions,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt)
        }
      });
    }
    console.log(`✅ Order items imported: ${data.order_items.length}`);
    
    console.log('\n🎉 Database import completed successfully!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

importMainDataFixed()
  .then(() => {
    console.log('✅ Import process completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Import failed:', error);
    process.exit(1);
  });
