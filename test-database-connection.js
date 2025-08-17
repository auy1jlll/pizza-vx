const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing database connection...');
    console.log('Database URL from env:', process.env.DATABASE_URL || 'Not set');
    
    // Try to connect and perform a simple query
    await prisma.$connect();
    console.log('✅ Connected to database successfully');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database query test passed:', result);
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;
    console.log('📊 Database tables:', tables.length > 0 ? tables.map(t => t.tablename) : 'No tables found');
    
    return true;
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error details:', error);
    return false;
    
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection().catch(console.error);
