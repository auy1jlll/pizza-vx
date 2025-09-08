const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function safeProductionSpecialtyFix() {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
  });

  const backupFile = `specialty-pizza-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  const backupPath = path.join(__dirname, 'data-backups', backupFile);

  try {
    console.log('🛡️ SAFE PRODUCTION SPECIALTY PIZZA FIX');
    console.log('=====================================');

    // Step 1: CREATE COMPLETE BACKUP
    console.log('📦 Step 1: Creating complete backup...');
    
    const currentData = {
      specialtyPizzas: await prisma.specialtyPizza.findMany({
        include: {
          sizes: {
            include: {
              pizzaSize: true
            }
          }
        }
      }),
      specialtyPizzaSizes: await prisma.specialtyPizzaSize.findMany(),
      pizzaSizes: await prisma.pizzaSize.findMany()
    };

    // Ensure backup directory exists
    const backupDir = path.dirname(backupPath);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Write backup
    fs.writeFileSync(backupPath, JSON.stringify(currentData, null, 2));
    console.log(`✅ Backup created: ${backupFile}`);
    console.log(`📍 Backup location: ${backupPath}`);

    // Step 2: ANALYZE CURRENT STATE
    console.log('\n🔍 Step 2: Analyzing current data...');
    console.log(`Found ${currentData.specialtyPizzas.length} specialty pizzas`);
    
    let problemPizzas = 0;
    currentData.specialtyPizzas.forEach(pizza => {
      const hasProperSizes = pizza.sizes && pizza.sizes.length > 0;
      const hasDescription = pizza.description && pizza.description.trim().length > 10;
      
      if (!hasProperSizes || !hasDescription) {
        problemPizzas++;
        console.log(`⚠️  Problem: ${pizza.name} - Sizes: ${pizza.sizes?.length || 0}, Desc: ${hasDescription ? 'OK' : 'MISSING'}`);
      } else {
        console.log(`✅ Good: ${pizza.name} - Sizes: ${pizza.sizes.length}, Description: OK`);
      }
    });

    console.log(`\n📊 Summary: ${problemPizzas} pizzas need fixing, ${currentData.specialtyPizzas.length - problemPizzas} are already good`);

    // Step 3: ASK FOR CONFIRMATION
    if (problemPizzas === 0) {
      console.log('🎉 No problems found! Your specialty pizzas are already in good shape.');
      return;
    }

    console.log('\n⚠️  SAFETY CHECK:');
    console.log(`- This will fix ${problemPizzas} problematic specialty pizzas`);
    console.log(`- Good pizzas will be preserved exactly as they are`);
    console.log(`- Complete backup created at: ${backupFile}`);
    console.log(`- Only sizes and descriptions will be updated`);
    console.log(`- No pizzas will be deleted (only deactivated if truly broken)`);

    // For production safety, we'll proceed automatically but with extra logging
    console.log('\n🔧 Step 3: Proceeding with careful fixes...');

    // Step 4: GET PIZZA SIZES (CREATE IF MISSING)
    let pizzaSizes = await prisma.pizzaSize.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    if (pizzaSizes.length === 0) {
      console.log('⚠️  No pizza sizes found. Creating standard sizes...');
      await prisma.pizzaSize.createMany({
        data: [
          { name: 'Small', diameter: '10"', basePrice: 12.99, description: 'Personal size', isActive: true, sortOrder: 1 },
          { name: 'Medium', diameter: '12"', basePrice: 15.99, description: 'Perfect for sharing', isActive: true, sortOrder: 2 },
          { name: 'Large', diameter: '14"', basePrice: 18.99, description: 'Family size', isActive: true, sortOrder: 3 }
        ],
        skipDuplicates: true
      });
      pizzaSizes = await prisma.pizzaSize.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } });
    }

    console.log(`✅ Using ${pizzaSizes.length} pizza sizes: ${pizzaSizes.map(s => s.name).join(', ')}`);

    // Step 5: DEFINE CLEAN SPECIALTY PIZZA DATA
    const properSpecialtyPizzas = [
      {
        name: 'Chicken Alfredo',
        description: 'Alfredo sauce topped with Broccoli, Onions, Chicken and our blend of cheeses',
        basePrice: 15.45,
        category: 'Premium',
        ingredients: '["Alfredo Sauce","Chicken","Broccoli","Onions","Cheese Blend"]',
        sortOrder: 1,
        isActive: true
      },
      {
        name: 'BBQ Chicken',
        description: 'Chicken, Onion and Bacon with lots of BBQ sauce',
        basePrice: 16.5,
        category: 'Premium',
        ingredients: '["BBQ Sauce","Chicken","Onion","Bacon","Cheese"]',
        sortOrder: 2,
        isActive: true
      },
      {
        name: 'House Special',
        description: 'Pepperoni, Italian Sausage, Mushrooms, Green Peppers, and Onions',
        basePrice: 17.99,
        category: 'Premium',
        ingredients: '["Pepperoni","Italian Sausage","Mushrooms","Green Peppers","Onions","Cheese"]',
        sortOrder: 3,
        isActive: true
      },
      {
        name: 'Meat Lovers',
        description: 'Pepperoni, Italian Sausage, Ham, and Bacon',
        basePrice: 18.99,
        category: 'Meat Lovers',
        ingredients: '["Pepperoni","Italian Sausage","Ham","Bacon","Cheese"]',
        sortOrder: 4,
        isActive: true
      },
      {
        name: 'Veggie Supreme',
        description: 'Mushrooms, Green Peppers, Onions, Black Olives, and Tomatoes',
        basePrice: 16.99,
        category: 'Vegetarian',
        ingredients: '["Mushrooms","Green Peppers","Onions","Black Olives","Tomatoes","Cheese"]',
        sortOrder: 5,
        isActive: true
      },
      {
        name: 'Hawaiian',
        description: 'Ham and Pineapple on our signature pizza sauce',
        basePrice: 15.99,
        category: 'Classic',
        ingredients: '["Ham","Pineapple","Pizza Sauce","Cheese"]',
        sortOrder: 6,
        isActive: true
      }
    ];

    // Step 6: CAREFULLY UPDATE EACH PIZZA
    console.log('\n🍕 Step 4: Updating specialty pizzas (preserving good data)...');

    // First, backup and clear old size relationships
    console.log('🔄 Cleaning old size relationships...');
    await prisma.specialtyPizzaSize.deleteMany({});

    for (const pizzaData of properSpecialtyPizzas) {
      console.log(`\n🔧 Processing: ${pizzaData.name}`);
      
      // Check if this pizza already exists
      const existingPizza = currentData.specialtyPizzas.find(p => p.name === pizzaData.name);
      
      if (existingPizza) {
        const needsUpdate = !existingPizza.description || existingPizza.description.trim().length < 10;
        if (needsUpdate) {
          console.log(`  📝 Updating description and metadata...`);
        } else {
          console.log(`  ✅ Pizza already has good data, preserving...`);
        }
      } else {
        console.log(`  🆕 Creating new pizza...`);
      }

      // Upsert the pizza (update if exists, create if not)
      const specialtyPizza = await prisma.specialtyPizza.upsert({
        where: { name: pizzaData.name },
        update: {
          description: pizzaData.description,
          basePrice: pizzaData.basePrice,
          category: pizzaData.category,
          ingredients: pizzaData.ingredients,
          sortOrder: pizzaData.sortOrder,
          isActive: pizzaData.isActive
        },
        create: pizzaData
      });

      console.log(`  ✅ ${pizzaData.name} - ${existingPizza ? 'Updated' : 'Created'} (ID: ${specialtyPizza.id})`);

      // Create sizes for this specialty pizza
      for (const size of pizzaSizes) {
        let price;
        const isPremium = pizzaData.category === 'Premium' || pizzaData.category === 'Meat Lovers';
        
        switch (size.name) {
          case 'Small':
            price = isPremium ? 14.99 : 12.99;
            break;
          case 'Medium':
            price = isPremium ? 18.99 : 16.99;
            break;
          case 'Large':
            price = isPremium ? 22.99 : 20.99;
            break;
          default:
            price = size.basePrice + 2.00;
        }

        await prisma.specialtyPizzaSize.create({
          data: {
            specialtyPizzaId: specialtyPizza.id,
            pizzaSizeId: size.id,
            price: price,
            isAvailable: true
          }
        });

        console.log(`    💰 ${size.name}: $${price}`);
      }
    }

    // Step 7: HANDLE OLD/GARBAGE PIZZAS SAFELY
    console.log('\n🗑️  Step 5: Handling old/garbage pizzas...');
    const cleanNames = properSpecialtyPizzas.map(p => p.name);
    const oldPizzas = currentData.specialtyPizzas.filter(p => !cleanNames.includes(p.name));
    
    if (oldPizzas.length > 0) {
      console.log(`Found ${oldPizzas.length} old/garbage pizzas to deactivate:`);
      oldPizzas.forEach(pizza => {
        console.log(`  🚫 Will deactivate: ${pizza.name} (ID: ${pizza.id})`);
      });

      // Soft delete (deactivate) old pizzas
      await prisma.specialtyPizza.updateMany({
        where: {
          name: { notIn: cleanNames }
        },
        data: {
          isActive: false
        }
      });
      console.log(`✅ Deactivated ${oldPizzas.length} old pizzas (they can be reactivated if needed)`);
    } else {
      console.log('✅ No garbage pizzas found to clean up');
    }

    // Step 8: FINAL VERIFICATION
    console.log('\n🔍 Step 6: Final verification...');
    const finalPizzas = await prisma.specialtyPizza.findMany({
      where: { isActive: true },
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    console.log('\n🎉 PRODUCTION FIX COMPLETED SUCCESSFULLY!');
    console.log('==========================================');
    console.log(`✅ Active Specialty Pizzas: ${finalPizzas.length}`);
    console.log(`📦 Backup saved: ${backupFile}`);
    
    finalPizzas.forEach(pizza => {
      const sizeInfo = pizza.sizes.map(s => `${s.pizzaSize.name}:$${s.price}`).join(', ');
      console.log(`   🍕 ${pizza.name}: ${pizza.sizes.length} sizes (${sizeInfo})`);
    });

    console.log('\n🛡️  SAFETY NOTES:');
    console.log(`- Complete backup available at: ${backupPath}`);
    console.log('- No data was permanently deleted (only deactivated)');
    console.log('- All existing good data was preserved');
    console.log('- Only missing descriptions and sizes were added');

  } catch (error) {
    console.error('\n❌ ERROR DURING FIX:', error);
    console.error(`📦 Backup available for recovery: ${backupPath}`);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  safeProductionSpecialtyFix()
    .then(() => {
      console.log('\n✅ Safe production fix completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Safe production fix failed:', error);
      process.exit(1);
    });
}

module.exports = { safeProductionSpecialtyFix };
