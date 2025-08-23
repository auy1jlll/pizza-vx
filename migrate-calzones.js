const { PrismaClient } = require('@prisma/client');

async function migrateCalzones() {
  const prisma = new PrismaClient();

  try {
    console.log('🔄 Starting calzone migration...');

    // Find all specialty pizzas that are actually calzones
    const calzones = await prisma.specialtyPizza.findMany({
      where: {
        category: 'CALZONE'
      },
      include: {
        sizes: true
      }
    });

    console.log(`📋 Found ${calzones.length} calzones to migrate`);

    if (calzones.length === 0) {
      console.log('✅ No calzones found to migrate');
      return;
    }

    // Migrate each calzone to the new table
    for (const calzone of calzones) {
      console.log(`📦 Migrating: ${calzone.name}`);

      // Create the specialty calzone
      const newCalzone = await prisma.specialtyCalzone.create({
        data: {
          calzoneName: calzone.name,
          calzoneDescription: calzone.description,
          basePrice: calzone.basePrice,
          category: calzone.category,
          imageUrl: calzone.imageUrl,
          fillings: calzone.ingredients, // Map ingredients to fillings
          isActive: calzone.isActive,
          sortOrder: calzone.sortOrder,
          sizes: {
            create: calzone.sizes.map(size => ({
              pizzaSizeId: size.pizzaSizeId,
              price: size.price,
              isAvailable: size.isAvailable
            }))
          }
        }
      });

      console.log(`✅ Created calzone: ${newCalzone.calzoneName} (ID: ${newCalzone.id})`);

      // Delete the old specialty pizza sizes first (due to foreign key constraint)
      await prisma.specialtyPizzaSize.deleteMany({
        where: {
          specialtyPizzaId: calzone.id
        }
      });

      // Delete the old specialty pizza
      await prisma.specialtyPizza.delete({
        where: {
          id: calzone.id
        }
      });

      console.log(`🗑️  Removed old entry: ${calzone.name}`);
    }

    console.log('✅ Calzone migration completed successfully!');

    // Show summary
    const remainingPizzas = await prisma.specialtyPizza.count();
    const totalCalzones = await prisma.specialtyCalzone.count();

    console.log('\n📊 Migration Summary:');
    console.log(`   Specialty Pizzas remaining: ${remainingPizzas}`);
    console.log(`   Specialty Calzones created: ${totalCalzones}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
if (require.main === module) {
  migrateCalzones()
    .then(() => {
      console.log('🎉 Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateCalzones };
