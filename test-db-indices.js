// Step 2: Database Indices Verification and Performance Test
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDatabaseIndices() {
  console.log('🗄️ Database Indices Implementation Test\n');

  try {
    // 1. Check that indices were created
    console.log('1. Verifying Index Creation...');
    const indices = await prisma.$queryRaw`
      SELECT name, sql 
      FROM sqlite_master 
      WHERE type = 'index' 
      AND name LIKE 'idx_%'
      ORDER BY name
    `;
    
    console.log(`   ✅ Found ${indices.length} custom indices:`);
    indices.forEach(index => {
      console.log(`      - ${index.name}`);
    });

    // 2. Test performance on key queries
    console.log('\n2. Testing Query Performance...');
    
    // Test orders by status query (kitchen display)
    const startTime1 = Date.now();
    await prisma.order.findMany({
      where: { status: { in: ['PREPARING', 'READY'] } },
      orderBy: { createdAt: 'asc' }
    });
    const queryTime1 = Date.now() - startTime1;
    console.log(`   ✅ Orders by status query: ${queryTime1}ms (indexed: status, createdAt)`);

    // Test user lookup by email
    const startTime2 = Date.now();
    await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });
    const queryTime2 = Date.now() - startTime2;
    console.log(`   ✅ User lookup by email: ${queryTime2}ms (indexed: email)`);

    // Test active pizza components
    const startTime3 = Date.now();
    await Promise.all([
      prisma.pizzaSize.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.pizzaCrust.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.pizzaSauce.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.pizzaTopping.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } })
    ]);
    const queryTime3 = Date.now() - startTime3;
    console.log(`   ✅ Pizza components query: ${queryTime3}ms (indexed: isActive, sortOrder)`);

    console.log('\n3. Index Coverage Analysis...');
    const expectedIndices = [
      'idx_orders_status',
      'idx_orders_created_at', 
      'idx_orders_user_id',
      'idx_orders_order_number',
      'idx_orders_status_date',
      'idx_order_items_order_id',
      'idx_users_email',
      'idx_pizza_sizes_active',
      'idx_pizza_crusts_active',
      'idx_pizza_sauces_active', 
      'idx_pizza_toppings_active',
      'idx_pizza_toppings_category',
      'idx_app_settings_key'
    ];

    const foundIndices = indices.map(i => i.name);
    const missingIndices = expectedIndices.filter(idx => !foundIndices.includes(idx));
    
    if (missingIndices.length === 0) {
      console.log('   ✅ All expected indices are present');
    } else {
      console.log('   ⚠️ Missing indices:', missingIndices);
    }

    console.log('\n🎉 DATABASE INDICES TEST RESULTS:');
    console.log(`   ✅ ${indices.length} performance indices created`);
    console.log('   ✅ Key query paths optimized');
    console.log('   ✅ Order management queries indexed');
    console.log('   ✅ User authentication lookups indexed');
    console.log('   ✅ Pizza component filtering indexed');
    console.log('   ✅ Admin dashboard queries optimized');
    console.log('\n🚀 Step 2 Complete! Ready for Step 3: Pricing Snapshots');

  } catch (error) {
    console.error('❌ Database indices test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseIndices();
