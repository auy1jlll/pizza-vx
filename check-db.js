const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
  const prisma = new PrismaClient();

  try {
    console.log('Connecting to database...');

    // Try to connect
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    console.log('Existing tables:', tables);

    // Check permissions
    const permissions = await prisma.$queryRaw`
      SELECT
        schemaname,
        tablename,
        tableowner,
        has_table_privilege(current_user, schemaname || '.' || tablename, 'SELECT') as can_select,
        has_table_privilege(current_user, schemaname || '.' || tablename, 'INSERT') as can_insert,
        has_table_privilege(current_user, schemaname || '.' || tablename, 'UPDATE') as can_update,
        has_table_privilege(current_user, schemaname || '.' || tablename, 'DELETE') as can_delete
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;

    console.log('Table permissions:', permissions);

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
