const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportDatabase() {
  console.log('🔄 Starting database export...');
  
  try {
    // Get all data from each table
    const data = {
      // Core user data
      users: await prisma.user.findMany({
        include: {
          customerProfile: true,
          employeeProfile: true,
          customerAddresses: true,
          customerFavorites: true,
        }
      }),
      
      // App configuration
      appSettings: await prisma.appSetting.findMany(),
      
      // Pizza components
      pizzaSizes: await prisma.pizzaSize.findMany(),
      pizzaCrusts: await prisma.pizzaCrust.findMany(),
      pizzaSauces: await prisma.pizzaSauce.findMany(),
      pizzaToppings: await prisma.pizzaTopping.findMany(),
      
      // Specialty items
      specialtyPizzas: await prisma.specialtyPizza.findMany({
        include: {
          sizes: {
            include: {
              pizzaSize: true
            }
          }
        }
      }),
      specialtyCalzones: await prisma.specialtyCalzone.findMany({
        include: {
          sizes: {
            include: {
              pizzaSize: true
            }
          }
        }
      }),
      
      // Menu system
      menuCategories: await prisma.menuCategory.findMany(),
      menuItems: await prisma.menuItem.findMany({
        include: {
          category: true,
          customizationGroups: {
            include: {
              customizationGroup: {
                include: {
                  options: true
                }
              }
            }
          }
        }
      }),
      customizationGroups: await prisma.customizationGroup.findMany({
        include: {
          options: true
        }
      }),
      
      // Email and settings
      emailSettings: await prisma.emailSettings.findMany(),
      emailTemplates: await prisma.emailTemplate.findMany(),
      
      // JWT and security
      jwtSecrets: await prisma.jwtSecret.findMany(),
      
      // Promotions
      promotions: await prisma.promotion.findMany(),
    };
    
    // Create export directory if it doesn't exist
    const exportDir = path.join(__dirname, '..', 'database-exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `pizzax-export-${timestamp}.json`;
    const filepath = path.join(exportDir, filename);
    
    // Write data to file
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    
    console.log('✅ Database exported successfully!');
    console.log(`📁 Export location: ${filepath}`);
    console.log(`📊 Export summary:`);
    console.log(`   - Users: ${data.users.length}`);
    console.log(`   - App Settings: ${data.appSettings.length}`);
    console.log(`   - Pizza Sizes: ${data.pizzaSizes.length}`);
    console.log(`   - Pizza Crusts: ${data.pizzaCrusts.length}`);
    console.log(`   - Pizza Sauces: ${data.pizzaSauces.length}`);
    console.log(`   - Pizza Toppings: ${data.pizzaToppings.length}`);
    console.log(`   - Specialty Pizzas: ${data.specialtyPizzas.length}`);
    console.log(`   - Specialty Calzones: ${data.specialtyCalzones.length}`);
    console.log(`   - Menu Categories: ${data.menuCategories.length}`);
    console.log(`   - Menu Items: ${data.menuItems.length}`);
    console.log(`   - Customization Groups: ${data.customizationGroups.length}`);
    console.log(`   - Email Settings: ${data.emailSettings.length}`);
    console.log(`   - Promotions: ${data.promotions.length}`);
    
    // Create production import script
    const importScript = `
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function importDatabase() {
  console.log('🔄 Starting database import...');
  
  try {
    // Read the export file
    const data = JSON.parse(fs.readFileSync('${filename}', 'utf8'));
    
    console.log('⚠️  WARNING: This will overwrite existing data!');
    console.log('🔄 Clearing existing data...');
    
    // Clear existing data in dependency order
    await prisma.orderItemTopping.deleteMany();
    await prisma.orderItemCustomization.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItemCustomization.deleteMany();
    await prisma.cartItemPizzaTopping.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.customerFavorite.deleteMany();
    await prisma.customerAddress.deleteMany();
    await prisma.customerProfile.deleteMany();
    await prisma.employeeProfile.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
    await prisma.specialtyPizzaSize.deleteMany();
    await prisma.specialtyCalzoneSize.deleteMany();
    await prisma.specialtyPizza.deleteMany();
    await prisma.specialtyCalzone.deleteMany();
    await prisma.menuItemCustomization.deleteMany();
    await prisma.customizationOption.deleteMany();
    await prisma.customizationGroup.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.menuCategory.deleteMany();
    await prisma.pizzaTopping.deleteMany();
    await prisma.pizzaSauce.deleteMany();
    await prisma.pizzaCrust.deleteMany();
    await prisma.pizzaSize.deleteMany();
    await prisma.emailTemplate.deleteMany();
    await prisma.emailSettings.deleteMany();
    await prisma.promotion.deleteMany();
    await prisma.jwtSecret.deleteMany();
    await prisma.appSetting.deleteMany();
    
    console.log('🔄 Importing data...');
    
    // Import in dependency order
    if (data.appSettings?.length) {
      await prisma.appSetting.createMany({ data: data.appSettings, skipDuplicates: true });
      console.log(\`✅ Imported \${data.appSettings.length} app settings\`);
    }
    
    if (data.jwtSecrets?.length) {
      await prisma.jwtSecret.createMany({ data: data.jwtSecrets, skipDuplicates: true });
      console.log(\`✅ Imported \${data.jwtSecrets.length} JWT secrets\`);
    }
    
    if (data.emailSettings?.length) {
      await prisma.emailSettings.createMany({ data: data.emailSettings, skipDuplicates: true });
      console.log(\`✅ Imported \${data.emailSettings.length} email settings\`);
    }
    
    if (data.emailTemplates?.length) {
      await prisma.emailTemplate.createMany({ data: data.emailTemplates, skipDuplicates: true });
      console.log(\`✅ Imported \${data.emailTemplates.length} email templates\`);
    }
    
    if (data.promotions?.length) {
      await prisma.promotion.createMany({ data: data.promotions, skipDuplicates: true });
      console.log(\`✅ Imported \${data.promotions.length} promotions\`);
    }
    
    if (data.pizzaSizes?.length) {
      await prisma.pizzaSize.createMany({ data: data.pizzaSizes, skipDuplicates: true });
      console.log(\`✅ Imported \${data.pizzaSizes.length} pizza sizes\`);
    }
    
    if (data.pizzaCrusts?.length) {
      await prisma.pizzaCrust.createMany({ data: data.pizzaCrusts, skipDuplicates: true });
      console.log(\`✅ Imported \${data.pizzaCrusts.length} pizza crusts\`);
    }
    
    if (data.pizzaSauces?.length) {
      await prisma.pizzaSauce.createMany({ data: data.pizzaSauces, skipDuplicates: true });
      console.log(\`✅ Imported \${data.pizzaSauces.length} pizza sauces\`);
    }
    
    if (data.pizzaToppings?.length) {
      await prisma.pizzaTopping.createMany({ data: data.pizzaToppings, skipDuplicates: true });
      console.log(\`✅ Imported \${data.pizzaToppings.length} pizza toppings\`);
    }
    
    if (data.menuCategories?.length) {
      await prisma.menuCategory.createMany({ data: data.menuCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        parentCategoryId: cat.parentCategoryId,
        imageUrl: cat.imageUrl,
        isActive: cat.isActive,
        sortOrder: cat.sortOrder,
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt
      })), skipDuplicates: true });
      console.log(\`✅ Imported \${data.menuCategories.length} menu categories\`);
    }
    
    if (data.customizationGroups?.length) {
      for (const group of data.customizationGroups) {
        const createdGroup = await prisma.customizationGroup.create({
          data: {
            id: group.id,
            categoryId: group.categoryId,
            name: group.name,
            description: group.description,
            type: group.type,
            isRequired: group.isRequired,
            minSelections: group.minSelections,
            maxSelections: group.maxSelections,
            sortOrder: group.sortOrder,
            isActive: group.isActive,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt
          }
        });
        
        if (group.options?.length) {
          await prisma.customizationOption.createMany({
            data: group.options.map(option => ({
              id: option.id,
              groupId: createdGroup.id,
              name: option.name,
              description: option.description,
              priceModifier: option.priceModifier,
              priceType: option.priceType,
              isDefault: option.isDefault,
              isActive: option.isActive,
              sortOrder: option.sortOrder,
              maxQuantity: option.maxQuantity,
              nutritionInfo: option.nutritionInfo,
              allergens: option.allergens,
              createdAt: option.createdAt,
              updatedAt: option.updatedAt
            }))
          });
        }
      }
      console.log(\`✅ Imported \${data.customizationGroups.length} customization groups\`);
    }
    
    if (data.menuItems?.length) {
      for (const item of data.menuItems) {
        const createdItem = await prisma.menuItem.create({
          data: {
            id: item.id,
            categoryId: item.categoryId,
            name: item.name,
            description: item.description,
            basePrice: item.basePrice,
            imageUrl: item.imageUrl,
            isActive: item.isActive,
            isAvailable: item.isAvailable,
            sortOrder: item.sortOrder,
            preparationTime: item.preparationTime,
            allergens: item.allergens,
            nutritionInfo: item.nutritionInfo,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          }
        });
        
        if (item.customizationGroups?.length) {
          await prisma.menuItemCustomization.createMany({
            data: item.customizationGroups.map(cg => ({
              id: cg.id,
              menuItemId: createdItem.id,
              customizationGroupId: cg.customizationGroupId,
              isRequired: cg.isRequired,
              sortOrder: cg.sortOrder,
              createdAt: cg.createdAt
            }))
          });
        }
      }
      console.log(\`✅ Imported \${data.menuItems.length} menu items\`);
    }
    
    if (data.specialtyPizzas?.length) {
      for (const pizza of data.specialtyPizzas) {
        const createdPizza = await prisma.specialtyPizza.create({
          data: {
            id: pizza.id,
            name: pizza.name,
            description: pizza.description,
            basePrice: pizza.basePrice,
            category: pizza.category,
            imageUrl: pizza.imageUrl,
            ingredients: pizza.ingredients,
            isActive: pizza.isActive,
            sortOrder: pizza.sortOrder,
            createdAt: pizza.createdAt,
            updatedAt: pizza.updatedAt
          }
        });
        
        if (pizza.sizes?.length) {
          await prisma.specialtyPizzaSize.createMany({
            data: pizza.sizes.map(size => ({
              id: size.id,
              specialtyPizzaId: createdPizza.id,
              pizzaSizeId: size.pizzaSizeId,
              price: size.price,
              isAvailable: size.isAvailable,
              createdAt: size.createdAt,
              updatedAt: size.updatedAt
            }))
          });
        }
      }
      console.log(\`✅ Imported \${data.specialtyPizzas.length} specialty pizzas\`);
    }
    
    if (data.specialtyCalzones?.length) {
      for (const calzone of data.specialtyCalzones) {
        const createdCalzone = await prisma.specialtyCalzone.create({
          data: {
            id: calzone.id,
            calzoneName: calzone.calzoneName,
            calzoneDescription: calzone.calzoneDescription,
            basePrice: calzone.basePrice,
            category: calzone.category,
            imageUrl: calzone.imageUrl,
            fillings: calzone.fillings,
            isActive: calzone.isActive,
            sortOrder: calzone.sortOrder,
            createdAt: calzone.createdAt,
            updatedAt: calzone.updatedAt
          }
        });
        
        if (calzone.sizes?.length) {
          await prisma.specialtyCalzoneSize.createMany({
            data: calzone.sizes.map(size => ({
              id: size.id,
              specialtyCalzoneId: createdCalzone.id,
              pizzaSizeId: size.pizzaSizeId,
              price: size.price,
              isAvailable: size.isAvailable,
              createdAt: size.createdAt,
              updatedAt: size.updatedAt
            }))
          });
        }
      }
      console.log(\`✅ Imported \${data.specialtyCalzones.length} specialty calzones\`);
    }
    
    if (data.users?.length) {
      for (const user of data.users) {
        const createdUser = await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            name: user.name,
            password: user.password,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            avatarUrl: user.avatarUrl,
            isActive: user.isActive,
            lastLoginAt: user.lastLoginAt,
            emailVerified: user.emailVerified,
            marketingOptIn: user.marketingOptIn,
            role: user.role,
            resetTokenExpiry: user.resetTokenExpiry,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            resetToken: user.resetToken
          }
        });
        
        if (user.customerProfile) {
          await prisma.customerProfile.create({
            data: {
              ...user.customerProfile,
              userId: createdUser.id
            }
          });
        }
        
        if (user.employeeProfile) {
          await prisma.employeeProfile.create({
            data: {
              ...user.employeeProfile,
              userId: createdUser.id
            }
          });
        }
        
        if (user.customerAddresses?.length) {
          await prisma.customerAddress.createMany({
            data: user.customerAddresses.map(addr => ({
              ...addr,
              userId: createdUser.id
            }))
          });
        }
        
        if (user.customerFavorites?.length) {
          await prisma.customerFavorite.createMany({
            data: user.customerFavorites.map(fav => ({
              ...fav,
              userId: createdUser.id
            }))
          });
        }
      }
      console.log(\`✅ Imported \${data.users.length} users with profiles\`);
    }
    
    console.log('✅ Database import completed successfully!');
    console.log('🔄 Run "npx prisma generate" to update Prisma client');
    
  } catch (error) {
    console.error('❌ Error importing database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

importDatabase()
  .catch((e) => {
    console.error('❌ Import failed:', e);
    process.exit(1);
  });
`;
    
    const importFilepath = path.join(exportDir, `import-${filename.replace('.json', '.js')}`);
    fs.writeFileSync(importFilepath, importScript);
    
    console.log(`📜 Import script created: ${importFilepath}`);
    console.log('');
    console.log('🚀 PRODUCTION DEPLOYMENT STEPS:');
    console.log('1. Upload both files to your production server');
    console.log('2. Set your production DATABASE_URL environment variable');
    console.log('3. Run: node import-[filename].js');
    console.log('4. Run: npx prisma generate');
    console.log('5. Restart your application');
    
    return filepath;
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

exportDatabase()
  .catch((e) => {
    console.error('❌ Export error:', e);
    process.exit(1);
  });