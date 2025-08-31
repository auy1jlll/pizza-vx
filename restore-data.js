const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function restoreAllData(backupFile) {
  console.log(`🔄 Restoring data from: ${backupFile}`);
  
  try {
    if (!fs.existsSync(backupFile)) {
      throw new Error(`Backup file not found: ${backupFile}`);
    }

    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    console.log(`📅 Backup from: ${backup.timestamp}`);

    // Clear existing data (be careful!)
    console.log('🗑️ Clearing existing data...');
    await prisma.orderItemCustomization.deleteMany();
    await prisma.orderItemTopping.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItemCustomization.deleteMany();
    await prisma.cartItemPizzaTopping.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.itemModifier.deleteMany();
    await prisma.modifier.deleteMany();
    await prisma.menuItemCustomization.deleteMany();
    await prisma.customizationOption.deleteMany();
    await prisma.customizationGroup.deleteMany();
    await prisma.specialtyCalzoneSize.deleteMany();
    await prisma.specialtyPizzaSize.deleteMany();
    await prisma.specialtyCalzone.deleteMany();
    await prisma.specialtyPizza.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.menuCategory.deleteMany();
    await prisma.customerProfile.deleteMany();
    await prisma.employeeProfile.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
    await prisma.pizzaTopping.deleteMany();
    await prisma.pizzaSauce.deleteMany();
    await prisma.pizzaCrust.deleteMany();
    await prisma.pizzaSize.deleteMany();
    await prisma.promotion.deleteMany();
    await prisma.appSetting.deleteMany();
    await prisma.emailLog.deleteMany();
    await prisma.emailSettings.deleteMany();
    await prisma.emailTemplate.deleteMany();
    await prisma.jwtSecret.deleteMany();

    // Restore data in correct order
    console.log('📥 Restoring data...');
    
    if (backup.jwtSecrets?.length) {
      await prisma.jwtSecret.createMany({ data: backup.jwtSecrets });
      console.log(`✅ Restored ${backup.jwtSecrets.length} JWT secrets`);
    }

    if (backup.appSettings?.length) {
      await prisma.appSetting.createMany({ data: backup.appSettings });
      console.log(`✅ Restored ${backup.appSettings.length} app settings`);
    }

    if (backup.users?.length) {
      await prisma.user.createMany({ data: backup.users });
      console.log(`✅ Restored ${backup.users.length} users`);
    }

    if (backup.employeeProfiles?.length) {
      await prisma.employeeProfile.createMany({ data: backup.employeeProfiles });
      console.log(`✅ Restored ${backup.employeeProfiles.length} employee profiles`);
    }

    if (backup.customerProfiles?.length) {
      await prisma.customerProfile.createMany({ data: backup.customerProfiles });
      console.log(`✅ Restored ${backup.customerProfiles.length} customer profiles`);
    }

    if (backup.pizzaSizes?.length) {
      await prisma.pizzaSize.createMany({ data: backup.pizzaSizes });
      console.log(`✅ Restored ${backup.pizzaSizes.length} pizza sizes`);
    }

    if (backup.pizzaCrusts?.length) {
      await prisma.pizzaCrust.createMany({ data: backup.pizzaCrusts });
      console.log(`✅ Restored ${backup.pizzaCrusts.length} pizza crusts`);
    }

    if (backup.pizzaSauces?.length) {
      await prisma.pizzaSauce.createMany({ data: backup.pizzaSauces });
      console.log(`✅ Restored ${backup.pizzaSauces.length} pizza sauces`);
    }

    if (backup.pizzaToppings?.length) {
      await prisma.pizzaTopping.createMany({ data: backup.pizzaToppings });
      console.log(`✅ Restored ${backup.pizzaToppings.length} pizza toppings`);
    }

    if (backup.menuCategories?.length) {
      await prisma.menuCategory.createMany({ data: backup.menuCategories });
      console.log(`✅ Restored ${backup.menuCategories.length} menu categories`);
    }

    if (backup.menuItems?.length) {
      await prisma.menuItem.createMany({ data: backup.menuItems });
      console.log(`✅ Restored ${backup.menuItems.length} menu items`);
    }

    if (backup.specialtyPizzas?.length) {
      await prisma.specialtyPizza.createMany({ data: backup.specialtyPizzas });
      console.log(`✅ Restored ${backup.specialtyPizzas.length} specialty pizzas`);
    }

    if (backup.specialtyCalzones?.length) {
      await prisma.specialtyCalzone.createMany({ data: backup.specialtyCalzones });
      console.log(`✅ Restored ${backup.specialtyCalzones.length} specialty calzones`);
    }

    if (backup.specialtyPizzaSizes?.length) {
      await prisma.specialtyPizzaSize.createMany({ data: backup.specialtyPizzaSizes });
      console.log(`✅ Restored ${backup.specialtyPizzaSizes.length} specialty pizza sizes`);
    }

    if (backup.specialtyCalzoneSizes?.length) {
      await prisma.specialtyCalzoneSize.createMany({ data: backup.specialtyCalzoneSizes });
      console.log(`✅ Restored ${backup.specialtyCalzoneSizes.length} specialty calzone sizes`);
    }

    if (backup.customizationGroups?.length) {
      await prisma.customizationGroup.createMany({ data: backup.customizationGroups });
      console.log(`✅ Restored ${backup.customizationGroups.length} customization groups`);
    }

    if (backup.customizationOptions?.length) {
      await prisma.customizationOption.createMany({ data: backup.customizationOptions });
      console.log(`✅ Restored ${backup.customizationOptions.length} customization options`);
    }

    if (backup.menuItemCustomizations?.length) {
      await prisma.menuItemCustomization.createMany({ data: backup.menuItemCustomizations });
      console.log(`✅ Restored ${backup.menuItemCustomizations.length} menu item customizations`);
    }

    if (backup.modifiers?.length) {
      await prisma.modifier.createMany({ data: backup.modifiers });
      console.log(`✅ Restored ${backup.modifiers.length} modifiers`);
    }

    if (backup.itemModifiers?.length) {
      await prisma.itemModifier.createMany({ data: backup.itemModifiers });
      console.log(`✅ Restored ${backup.itemModifiers.length} item modifiers`);
    }

    if (backup.promotions?.length) {
      await prisma.promotion.createMany({ data: backup.promotions });
      console.log(`✅ Restored ${backup.promotions.length} promotions`);
    }

    if (backup.emailTemplates?.length) {
      await prisma.emailTemplate.createMany({ data: backup.emailTemplates });
      console.log(`✅ Restored ${backup.emailTemplates.length} email templates`);
    }

    if (backup.emailSettings?.length) {
      await prisma.emailSettings.createMany({ data: backup.emailSettings });
      console.log(`✅ Restored ${backup.emailSettings.length} email settings`);
    }

    // Restore orders with items
    if (backup.orders?.length) {
      for (const order of backup.orders) {
        const { orderItems, ...orderData } = order;
        const createdOrder = await prisma.order.create({ data: orderData });
        
        if (orderItems?.length) {
          for (const item of orderItems) {
            const { toppings, customizations, ...itemData } = item;
            itemData.orderId = createdOrder.id;
            const createdItem = await prisma.orderItem.create({ data: itemData });
            
            if (toppings?.length) {
              const toppingData = toppings.map(t => ({
                ...t,
                orderItemId: createdItem.id
              }));
              await prisma.orderItemTopping.createMany({ data: toppingData });
            }
            
            if (customizations?.length) {
              const customizationData = customizations.map(c => ({
                ...c,
                orderItemId: createdItem.id
              }));
              await prisma.orderItemCustomization.createMany({ data: customizationData });
            }
          }
        }
      }
      console.log(`✅ Restored ${backup.orders.length} orders with items`);
    }

    console.log('\n🎉 Data restoration complete!');
    
  } catch (error) {
    console.error('❌ Restore failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Usage: node restore-data.js path/to/backup.json
if (require.main === module) {
  const backupFile = process.argv[2];
  if (!backupFile) {
    console.error('Usage: node restore-data.js <backup-file>');
    process.exit(1);
  }
  restoreAllData(backupFile).catch(console.error);
}

module.exports = { restoreAllData };
