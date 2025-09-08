const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixSpecialtyCalzones() {
  console.log('🔧 Starting specialty calzones fix...');

  try {
    // Check current state
    const existingCalzones = await prisma.specialtyCalzone.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log(`Found ${existingCalzones.length} existing specialty calzones`);
    
    // Expected calzone data
    const calzoneData = [
      {
        calzoneName: 'Veggie Calzone',
        calzoneDescription: 'Fresh vegetable calzone',
        basePrice: 21.5,
        category: 'CALZONE',
        fillings: 'Roasted peppers, roasted onions, grilled tomatoes, mushrooms and broccoli',
        sortOrder: 1,
        isActive: true
      },
      {
        calzoneName: 'Traditional Calzone',
        calzoneDescription: 'Classic pepperoni calzone',
        basePrice: 21.5,
        category: 'CALZONE',
        fillings: 'Pepperoni, ricotta cheese, sauce and our blends of mozzarella cheese',
        sortOrder: 2,
        isActive: true
      },
      {
        calzoneName: 'Ham & Cheese Calzone',
        calzoneDescription: 'Ham and cheese calzone',
        basePrice: 21.5,
        category: 'CALZONE',
        fillings: 'Sauce, a blend of our cheese and ham and american cheese',
        sortOrder: 3,
        isActive: true
      },
      {
        calzoneName: 'Chicken Parmesan Calzone',
        calzoneDescription: 'Chicken parmesan calzone with marinara',
        basePrice: 21.5,
        category: 'CALZONE',
        fillings: 'Chicken parmesan, ricotta cheese with marinara sauce',
        sortOrder: 4,
        isActive: true
      },
      {
        calzoneName: 'Chicken Broccoli Alfredo Calzone',
        calzoneDescription: 'Chicken and broccoli with alfredo sauce',
        basePrice: 21.5,
        category: 'CALZONE',
        fillings: 'Chicken, broccoli and onions with white alfredo sauce',
        sortOrder: 5,
        isActive: true
      },
      {
        calzoneName: 'Greek Calzone',
        calzoneDescription: 'Mediterranean style calzone',
        basePrice: 21.5,
        category: 'CALZONE',
        fillings: 'Feta, spinach and tomatoes',
        sortOrder: 6,
        isActive: true
      },
      {
        calzoneName: 'Meatball Calzone',
        calzoneDescription: 'Hearty meatball calzone',
        basePrice: 21.5,
        category: 'CALZONE',
        fillings: 'Meatballs with marinara sauce and mozzarella cheese',
        sortOrder: 7,
        isActive: true
      }
    ];

    // Update each calzone by sortOrder
    let updatedCount = 0;
    for (let i = 0; i < Math.min(existingCalzones.length, calzoneData.length); i++) {
      const existingCalzone = existingCalzones[i];
      const newData = calzoneData[i];
      
      console.log(`\n🔄 Updating calzone ${i + 1}:`);
      console.log(`  From: "${existingCalzone.calzoneName || 'EMPTY'}" -> To: "${newData.calzoneName}"`);
      
      await prisma.specialtyCalzone.update({
        where: { id: existingCalzone.id },
        data: {
          calzoneName: newData.calzoneName,
          calzoneDescription: newData.calzoneDescription,
          basePrice: newData.basePrice,
          category: newData.category,
          fillings: newData.fillings,
          sortOrder: newData.sortOrder,
          isActive: newData.isActive
        }
      });
      
      updatedCount++;
      console.log(`  ✅ Updated successfully`);
    }

    console.log(`\n✅ Fixed ${updatedCount} specialty calzones!`);
    
    // Verify the fix
    const verifyCalzones = await prisma.specialtyCalzone.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    
    console.log('\n📋 Verification - Updated calzones:');
    verifyCalzones.forEach((calzone, index) => {
      console.log(`${index + 1}. ${calzone.calzoneName} - $${calzone.basePrice}`);
      console.log(`   Description: ${calzone.calzoneDescription}`);
      console.log(`   Fillings: ${calzone.fillings}`);
    });

  } catch (error) {
    console.error('❌ Error fixing specialty calzones:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixSpecialtyCalzones().catch(console.error);
