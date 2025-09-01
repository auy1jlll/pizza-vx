const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listHotSubs() {
  console.log('🔍 Listing all Hot Subs items...\n');

  try {
    const hotSubs = await prisma.menuItem.findMany({
      where: {
        category: {
          name: 'Hot Subs'
        }
      },
      select: {
        name: true,
        basePrice: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log(`📋 Found ${hotSubs.length} Hot Subs items:`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    hotSubs.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} - $${item.basePrice}`);
    });

    // Look specifically for items containing our search terms
    console.log('\n🔍 Items matching our search terms:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const searchTerms = ['CHICKEN CUTLET', 'CHICKEN FINGER', 'CHEESE BURGER', 'CHICKEN KABOB'];
    
    searchTerms.forEach(term => {
      const matches = hotSubs.filter(item => 
        item.name.toLowerCase().includes(term.toLowerCase()) ||
        item.name.toLowerCase().includes(term.toLowerCase().replace(' ', ''))
      );
      
      console.log(`\n🔍 "${term}"`);
      if (matches.length > 0) {
        matches.forEach(match => {
          console.log(`   ✅ ${match.name} - $${match.basePrice}`);
        });
      } else {
        console.log(`   ❌ No matches found`);
      }
    });

  } catch (error) {
    console.error('❌ Error listing hot subs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listHotSubs();
