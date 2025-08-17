const { PrismaClient } = require('@prisma/client');

async function fixDinnerPlatesSlug() {
  const prisma = new PrismaClient({
    log: ['error']
  });

  try {
    console.log("🔧 Fixing 'Dinner Plates' category slug...");
    
    // Find the Dinner Plates category
    const dinnerPlatesCategory = await prisma.menuCategory.findFirst({
      where: {
        name: 'Dinner Plates'
      }
    });

    if (!dinnerPlatesCategory) {
      console.log("❌ Dinner Plates category not found");
      return;
    }

    console.log(`Current name: "${dinnerPlatesCategory.name}"`);
    console.log(`Current slug: "${dinnerPlatesCategory.slug}"`);
    console.log("Expected slug: \"dinner-plates\"");

    // Update the slug to proper value
    const updated = await prisma.menuCategory.update({
      where: {
        id: dinnerPlatesCategory.id
      },
      data: {
        slug: 'dinner-plates'
      }
    });

    console.log(`✅ Updated slug from "${dinnerPlatesCategory.slug}" to "${updated.slug}"`);
    console.log(`URL will now work: /menu/dinner-plates`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixDinnerPlatesSlug();
