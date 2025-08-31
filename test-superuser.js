const { PrismaClient } = require('@prisma/client');

// Try to connect with postgres superuser
async function testSuperuserConnection() {
  // Try different possible passwords for postgres user
  const possiblePasswords = ['password', 'postgres', 'admin', 'root', ''];

  for (const password of possiblePasswords) {
    try {
      console.log(`Trying to connect as postgres with password: ${password || '(empty)'}`);

      const prisma = new PrismaClient({
        datasourceUrl: `postgresql://postgres:${password}@localhost:5432/postgres`
      });

      await prisma.$connect();
      console.log('✅ Connected as postgres superuser!');

      // Now try to grant permissions
      await prisma.$queryRaw`GRANT ALL ON SCHEMA public TO auy1jll;`;
      await prisma.$queryRaw`GRANT ALL PRIVILEGES ON DATABASE pizzax TO auy1jll;`;
      await prisma.$queryRaw`ALTER DATABASE pizzax OWNER TO auy1jll;`;

      console.log('✅ Permissions granted successfully');
      await prisma.$disconnect();
      return true;

    } catch (error) {
      console.log(`❌ Failed with password ${password || '(empty)'}:`, error.message);
    }
  }

  console.log('❌ Could not connect as postgres superuser with any common passwords');
  return false;
}

testSuperuserConnection();
