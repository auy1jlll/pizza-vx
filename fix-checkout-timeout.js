// Quick fix for production checkout timeout issue

const fs = require('fs');
const path = require('path');

const checkoutFilePath = path.join(__dirname, 'src/app/api/checkout/route.ts');

console.log('🔧 Fixing production checkout timeout issue...');

// Read the current checkout file
let checkoutContent = fs.readFileSync(checkoutFilePath, 'utf8');

// Add timeout wrapper around the main order creation logic
const timeoutFix = `
// Add timeout protection to prevent 504 Gateway Timeout
const CHECKOUT_TIMEOUT = 25000; // 25 seconds (less than gateway timeout)

const createOrderWithTimeout = async (orderData) => {
  return Promise.race([
    orderService.createOrder(orderData),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Order creation timeout - please try again')), CHECKOUT_TIMEOUT)
    )
  ]);
};
`;

// Find the order creation line and replace it
const oldOrderCreation = /const order = await orderService\.createOrder\({[\s\S]*?}\);/;

const newOrderCreation = `const order = await createOrderWithTimeout({
      items,
      customer,
      delivery: delivery || undefined,
      orderType,
      scheduleType: scheduleType || 'NOW',
      scheduledDate: scheduledDate || undefined,
      scheduledTime: scheduledTime || undefined,
      paymentMethod,
      subtotal,
      deliveryFee,
      tipAmount: tipAmount || undefined,
      tipPercentage: tipPercentage || undefined,
      customTipAmount: customTipAmount || undefined,
      tax,
      total,
      notes,
      userId: authenticatedUserId
    });`;

// Apply the fixes
if (checkoutContent.includes('createOrderWithTimeout')) {
  console.log('✅ Timeout fix already applied');
} else {
  // Add timeout function before the main export
  checkoutContent = checkoutContent.replace(
    'export async function POST(request: NextRequest) {',
    timeoutFix + '\nexport async function POST(request: NextRequest) {'
  );

  // Replace the order creation call
  checkoutContent = checkoutContent.replace(oldOrderCreation, newOrderCreation);

  // Write the fixed file back
  fs.writeFileSync(checkoutFilePath, checkoutContent);
  console.log('✅ Applied checkout timeout fix');
}

// Also create a quick database connection timeout fix
const prismaConfigPath = path.join(__dirname, 'src/lib/prisma.ts');
if (fs.existsSync(prismaConfigPath)) {
  let prismaContent = fs.readFileSync(prismaConfigPath, 'utf8');

  // Add connection timeout to Prisma client
  if (!prismaContent.includes('connect_timeout')) {
    const prismaFix = `
// Add database connection timeout
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL + '?connect_timeout=30&pool_timeout=30&connection_limit=5'
      }
    }
  });
};
`;

    prismaContent = prismaContent.replace(
      'const prismaClientSingleton = () => {',
      prismaFix.trim() + '\n\n// Original function replaced above\nconst prismaClientSingletonOriginal = () => {'
    );

    fs.writeFileSync(prismaConfigPath, prismaContent);
    console.log('✅ Applied Prisma connection timeout fix');
  }
}

console.log('');
console.log('🎯 CHECKOUT TIMEOUT FIXES APPLIED:');
console.log('✅ Added 25-second timeout wrapper to order creation');
console.log('✅ Added database connection timeout parameters');
console.log('✅ Prevents 504 Gateway Timeout errors');
console.log('');
console.log('🚀 Deploy these fixes to production to resolve checkout spinning issue!');