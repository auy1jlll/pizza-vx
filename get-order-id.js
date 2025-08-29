import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getOrderId() {
  const orders = await prisma.order.findMany({
    take: 1,
    orderBy: { createdAt: 'desc' },
    where: {
      customerEmail: 'auy1jll@gmail.com'  // This email should work
    }
  });
  
  if (orders.length > 0) {
    console.log('Order ID:', orders[0].id);
    console.log('Customer Email:', orders[0].customerEmail);
  }
  
  await prisma.$disconnect();
}

getOrderId().catch(console.error);
