const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDuplicateCustomizations() {
  console.log('🔍 Analyzing Duplicate Customization Groups...\n');

  try {
    // 1. Find duplicate customization groups by name and type
    console.log('📊 Finding Duplicate Groups by Name and Type:');
    const allGroups = await prisma.customizationGroup.findMany({
      include: {
        _count: {
          select: { menuItemCustomizations: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    const groupsByNameType = new Map();
    
    allGroups.forEach(group => {
      const key = `${group.name}-${group.type}`;
      if (!groupsByNameType.has(key)) {
        groupsByNameType.set(key, []);
      }
      groupsByNameType.get(key).push(group);
    });

    // Show duplicates
    let totalDuplicates = 0;
    for (const [key, groups] of groupsByNameType) {
      if (groups.length > 1) {
        console.log(`\n🔄 DUPLICATE: "${groups[0].name}" (${groups[0].type})`);
        console.log(`   Found ${groups.length} copies:`);
        groups.forEach((group, index) => {
          console.log(`   ${index + 1}. ID: ${group.id} | Used by ${group._count.menuItemCustomizations} items | Active: ${group.isActive}`);
        });
        totalDuplicates += groups.length - 1;
      }
    }

    console.log(`\n📈 Summary: Found ${totalDuplicates} duplicate groups\n`);

    // 2. Check specific seafood items
    console.log('🦞 Checking Seafood Items Specifically:');
    const seafoodCategory = await prisma.menuCategory.findFirst({
      where: { name: { contains: 'Seafood', mode: 'insensitive' } }
    });

    if (seafoodCategory) {
      const seafoodItems = await prisma.menuItem.findMany({
        where: { categoryId: seafoodCategory.id },
        include: {
          customizationGroups: {
            include: {
              customizationGroup: true
            }
          }
        }
      });

      seafoodItems.forEach(item => {
        console.log(`\n🐟 ${item.name}:`);
        const sizeGroups = item.customizationGroups.filter(cg => 
          cg.customizationGroup.name.toLowerCase().includes('size')
        );
        
        if (sizeGroups.length > 1) {
          console.log(`   ⚠️  HAS ${sizeGroups.length} SIZE GROUPS!`);
          sizeGroups.forEach((sg, index) => {
            console.log(`   ${index + 1}. ${sg.customizationGroup.name} (ID: ${sg.customizationGroup.id})`);
          });
        } else if (sizeGroups.length === 1) {
          console.log(`   ✅ Has 1 size group: ${sizeGroups[0].customizationGroup.name}`);
        } else {
          console.log(`   ❌ No size groups attached`);
        }
      });
    }

    // 3. Show all menu items with multiple size groups
    console.log('\n🔍 All Menu Items with Multiple Size Groups:');
    const allItems = await prisma.menuItem.findMany({
      include: {
        category: true,
        customizationGroups: {
          include: {
            customizationGroup: true
          }
        }
      }
    });

    allItems.forEach(item => {
      const sizeGroups = item.customizationGroups.filter(cg => 
        cg.customizationGroup.name.toLowerCase().includes('size')
      );
      
      if (sizeGroups.length > 1) {
        console.log(`\n⚠️  ${item.category.name} → ${item.name}: ${sizeGroups.length} size groups`);
        sizeGroups.forEach((sg, index) => {
          console.log(`   ${index + 1}. ${sg.customizationGroup.name} (ID: ${sg.customizationGroup.id})`);
        });
      }
    });

    // 4. Suggest cleanup plan
    console.log('\n🧹 Cleanup Recommendations:');
    console.log('1. Keep the most used group for each name/type combination');
    console.log('2. Migrate all menu item connections to the kept group');
    console.log('3. Delete the duplicate groups');
    console.log('4. Verify no orphaned connections remain\n');

  } catch (error) {
    console.error('❌ Error checking duplicates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDuplicateCustomizations();
