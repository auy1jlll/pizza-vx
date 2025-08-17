const { PrismaClient } = require('@prisma/client');

async function fixDinnerSlug() {
  const prisma = new PrismaClient({
    log: ['error']
  });

  try {
    console.log("🔧 Fixing Dinner category slug...");
    
    // Find the Dinner category
    const dinnerCategory = await prisma.menuCategory.findFirst({
      where: {
        name: 'Dinner'
      }
    });

    if (!dinnerCategory) {
      console.log("❌ Dinner category not found");
      return;
    }

    console.log(`Current slug: "${dinnerCategory.slug}"`);
    console.log("Expected slug: \"dinner\"");

    // Update the slug to proper value
    const updated = await prisma.menuCategory.update({
      where: {
        id: dinnerCategory.id
      },
      data: {
        slug: 'dinner'
      }
    });

    console.log(`✅ Updated slug from "${dinnerCategory.slug}" to "${updated.slug}"`);
    console.log(`URL will now work: /menu/dinner`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixDinnerSlug();
