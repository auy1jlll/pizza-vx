const { PrismaClient } = require('@prisma/client');
(async () => {
  const p = new PrismaClient();
  try {
    const r = await p.$queryRaw`SELECT 1`;
    console.log('RAW OK', r);
  } catch (e) {
    console.error('RAW FAIL', e);
  } finally {
    await p.$disconnect();
  }
})();
