const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkLatestOrder() {
  try {
    const order = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { orderItems: true }
    });
    
    console.log('Latest order:');
    console.log('Order Number:', order?.orderNumber);
    console.log('Customer Email:', order?.customerEmail);
    console.log('Status:', order?.status);
    console.log('Total:', order?.total);
    console.log('Items:', order?.orderItems?.length || 0);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLatestOrder();
