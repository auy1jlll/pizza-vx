const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createFriendlyUrls() {
  try {
    console.log('Creating user-friendly URL versions...');
    
    // Create short URLs for existing pages
    const updates = [
      {
        originalSlug: 'best-pizza-and-fresh-salads-in-greenland-nh-or-restoapp',
        newSlug: 'home',
        title: 'RestoApp Home | Best Pizza Greenland NH'
      },
      {
        originalSlug: 'about-us-or-restoapp-greenland-nh-your-local-pizza-experts', 
        newSlug: 'about-us',
        title: 'About RestoApp | Family-Owned Pizza Restaurant | Greenland NH'
      },
      {
        originalSlug: 'menu-and-prices-or-best-pizza-restaurant-greenland-nh',
        newSlug: 'menu',
        title: 'Menu & Prices | RestoApp Greenland NH'
      },
      {
        originalSlug: 'contact-us-or-restoapp-greenland-nh-order-pizza-and-salads',
        newSlug: 'contact',
        title: 'Contact RestoApp Greenland NH | Order Pizza & Salads'
      },
      {
        originalSlug: 'pizza-delivery-greenland-nh-or-order-online-or-restoapp',
        newSlug: 'delivery',
        title: 'Pizza Delivery Greenland NH | RestoApp'
      }
    ];

    for (const update of updates) {
      // Get the original page
      const originalPage = await prisma.dynamicPage.findUnique({
        where: { slug: update.originalSlug }
      });

      if (originalPage) {
        // Create a new page with short slug
        await prisma.dynamicPage.create({
          data: {
            slug: update.newSlug,
            title: update.title,
            excerpt: originalPage.excerpt,
            content: originalPage.content,
            metaTitle: originalPage.metaTitle,
            metaDescription: originalPage.metaDescription,
            metaKeywords: originalPage.metaKeywords,
            status: 'PUBLISHED',
            publishedAt: new Date(),
            authorId: originalPage.authorId
          }
        });
        
        console.log(`✅ Created: http://localhost:3005/${update.newSlug}`);
      }
    }
    
    console.log('\n🎯 All user-friendly URLs created!');
    console.log('Available pages:');
    console.log('- http://localhost:3005/home');
    console.log('- http://localhost:3005/about-us');
    console.log('- http://localhost:3005/menu');
    console.log('- http://localhost:3005/contact'); 
    console.log('- http://localhost:3005/delivery');
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('✅ Friendly URLs already exist!');
    } else {
      console.error('Error:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createFriendlyUrls();
