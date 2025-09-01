const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCategoryRelationships() {
  try {
    console.log('=== CATEGORY HIERARCHY ANALYSIS ===\n');
    
    // Get all categories with their parent/child relationships
    const allCategories = await prisma.menuCategory.findMany({
      include: {
        parentCategory: true,
        subcategories: true,
        menuItems: {
          select: {
            id: true,
            name: true,
            basePrice: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log('📊 CATEGORY STRUCTURE:\n');
    
    // First, show parent categories (no parent)
    const parentCategories = allCategories.filter(cat => !cat.parentCategoryId);
    const subcategories = allCategories.filter(cat => cat.parentCategoryId);
    
    console.log(`🔹 Parent Categories: ${parentCategories.length}`);
    console.log(`🔸 Subcategories: ${subcategories.length}\n`);
    
    // Show hierarchy
    parentCategories.forEach(parent => {
      console.log(`📂 ${parent.name} (${parent.menuItems.length} items)`);
      
      // Show subcategories under this parent
      const children = subcategories.filter(sub => sub.parentCategoryId === parent.id);
      children.forEach(child => {
        console.log(`  └── 📁 ${child.name} (${child.menuItems.length} items)`);
      });
      
      if (children.length === 0 && parent.menuItems.length > 0) {
        // Show first few items for parent categories without subcategories
        console.log(`      Items: ${parent.menuItems.slice(0, 3).map(item => item.name).join(', ')}${parent.menuItems.length > 3 ? '...' : ''}`);
      }
      console.log('');
    });

    // Show detailed view of any subcategories
    if (subcategories.length > 0) {
      console.log('\n🔍 SUBCATEGORY DETAILS:\n');
      subcategories.forEach(sub => {
        const parent = allCategories.find(cat => cat.id === sub.parentCategoryId);
        console.log(`📁 ${sub.name}`);
        console.log(`   Parent: ${parent?.name || 'Unknown'}`);
        console.log(`   Items: ${sub.menuItems.length}`);
        if (sub.menuItems.length > 0) {
          sub.menuItems.forEach(item => {
            console.log(`     • ${item.name} - $${item.basePrice}`);
          });
        }
        console.log('');
      });
    }

    // Analyze menu item distribution
    console.log('\n📈 MENU ITEM DISTRIBUTION:\n');
    const totalItems = allCategories.reduce((sum, cat) => sum + cat.menuItems.length, 0);
    console.log(`Total Menu Items: ${totalItems}`);
    
    // Show categories with most items
    const sortedByItems = [...allCategories].sort((a, b) => b.menuItems.length - a.menuItems.length);
    console.log('\nTop 5 Categories by Item Count:');
    sortedByItems.slice(0, 5).forEach(cat => {
      const type = cat.parentCategoryId ? '(subcategory)' : '(parent)';
      console.log(`  ${cat.menuItems.length} items - ${cat.name} ${type}`);
    });

    console.log('\n=== RELATIONSHIP SUMMARY ===');
    console.log(`• Parent-Child relationship: ${subcategories.length > 0 ? 'YES' : 'NO'}`);
    console.log(`• Menu items connect to: Individual categories (parent OR child)`);
    console.log(`• Menu items in subcategories: ${subcategories.reduce((sum, sub) => sum + sub.menuItems.length, 0)}`);
    console.log(`• Menu items in parent categories: ${parentCategories.reduce((sum, parent) => sum + parent.menuItems.length, 0)}`);

  } catch (error) {
    console.error('Error checking category relationships:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategoryRelationships();
