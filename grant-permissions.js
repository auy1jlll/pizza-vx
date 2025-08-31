const { PrismaClient } = require('@prisma/client');

async function grantPermissions() {
  const prisma = new PrismaClient();

  try {
    console.log('Granting database permissions...');

    // Grant permissions on the public schema
    await prisma.$queryRaw`GRANT ALL ON SCHEMA public TO auy1jll;`;
    await prisma.$queryRaw`GRANT ALL PRIVILEGES ON DATABASE pizzax TO auy1jll;`;
    await prisma.$queryRaw`ALTER USER auy1jll CREATEDB;`;

    console.log('✅ Permissions granted successfully');

  } catch (error) {
    console.error('❌ Error granting permissions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

grantPermissions();
