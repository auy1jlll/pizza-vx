const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSeafoodRollsSpecifically() {
  console.log('🦞 Checking Seafood Rolls Specifically for Duplicates...\n');

  try {
    // Get seafood rolls category
    const seafoodCategory = await prisma.menuCategory.findFirst({
      where: { 
        OR: [
          { name: { contains: 'Seafood Rolls', mode: 'insensitive' } },
          { slug: { contains: 'seafood-rolls', mode: 'insensitive' } }
        ]
      }
    });

    if (!seafoodCategory) {
      console.log('❌ Seafood Rolls category not found');
      return;
    }

    console.log(`✅ Found category: ${seafoodCategory.name} (ID: ${seafoodCategory.id})\n`);

    // Get all seafood roll items with their customizations
    const seafoodItems = await prisma.menuItem.findMany({
      where: { categoryId: seafoodCategory.id },
      include: {
        customizationGroups: {
          include: {
            customizationGroup: {
              include: {
                options: true
              }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    });

    console.log(`📋 Found ${seafoodItems.length} seafood roll items:\n`);

    seafoodItems.forEach((item, index) => {
      console.log(`${index + 1}. 🐟 ${item.name}:`);
      console.log(`   Base Price: $${item.basePrice}`);
      console.log(`   Description: ${item.description}`);
      console.log(`   Customization Groups (${item.customizationGroups.length}):`);
      
      if (item.customizationGroups.length === 0) {
        console.log(`      ❌ No customization groups!`);
      } else {
        // Group by customization group ID to check for duplicates
        const groupCounts = new Map();
        
        item.customizationGroups.forEach(cg => {
          const groupId = cg.customizationGroup.id;
          const groupName = cg.customizationGroup.name;
          
          if (!groupCounts.has(groupId)) {
            groupCounts.set(groupId, {
              name: groupName,
              type: cg.customizationGroup.type,
              connections: [],
              options: cg.customizationGroup.options
            });
          }
          groupCounts.get(groupId).connections.push(cg);
        });

        // Display each group and check for duplicates
        for (const [groupId, data] of groupCounts) {
          const isDuplicate = data.connections.length > 1;
          const status = isDuplicate ? '🔄 DUPLICATE' : '✅';
          
          console.log(`      ${status} ${data.name} (${data.type}):`);
          console.log(`         - Group ID: ${groupId}`);
          console.log(`         - Required: ${data.connections[0].isRequired}`);
          console.log(`         - Sort Order: ${data.connections[0].sortOrder}`);
          console.log(`         - Options: ${data.options.length}`);
          
          if (data.options.length > 0) {
            console.log(`         - Available options: ${data.options.map(opt => opt.name).join(', ')}`);
          }
          
          if (isDuplicate) {
            console.log(`         ⚠️  This group appears ${data.connections.length} times:`);
            data.connections.forEach((conn, idx) => {
              console.log(`            ${idx + 1}. Connection ID: ${conn.id} | Created: ${conn.createdAt?.toISOString()?.substring(0, 19)}`);
            });
          }
        }
      }
      console.log('');
    });

    // Check if there are specific "French Fries" and "Onion Rings" related duplicates
    console.log(`🔍 Looking for French Fries / Onion Rings related groups...\n`);
    
    const friesOrOnionGroups = await prisma.customizationGroup.findMany({
      where: {
        OR: [
          { name: { contains: 'fries', mode: 'insensitive' } },
          { name: { contains: 'onion', mode: 'insensitive' } },
          { name: { contains: 'rings', mode: 'insensitive' } }
        ]
      },
      include: {
        options: true,
        _count: {
          select: { menuItemCustomizations: true }
        }
      }
    });

    if (friesOrOnionGroups.length > 0) {
      console.log(`Found ${friesOrOnionGroups.length} groups related to fries/onion rings:`);
      friesOrOnionGroups.forEach((group, index) => {
        console.log(`   ${index + 1}. ${group.name} (${group.type})`);
        console.log(`      - ID: ${group.id}`);
        console.log(`      - Connected to ${group._count.menuItemCustomizations} menu items`);
        console.log(`      - Options: ${group.options.map(opt => opt.name).join(', ')}`);
        console.log('');
      });
    } else {
      console.log(`No groups found with fries/onion ring keywords.`);
    }

  } catch (error) {
    console.error('❌ Error checking seafood rolls:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSeafoodRollsSpecifically();
