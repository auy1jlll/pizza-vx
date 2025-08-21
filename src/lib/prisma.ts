import { PrismaClient } from '@prisma/client';

// Global Prisma client instance to prevent connection pool exhaustion
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// Enhanced connection configuration
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: { 
      db: { 
        url: process.env.DATABASE_URL 
      } 
    },
    // Add connection pool settings for stability
    __internal: {
      engine: {
        connection_limit: 10,
        pool_timeout: 10,
      },
    } as any,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Enhanced graceful shutdown handling
if (process.env.NODE_ENV === 'development') {
  let isShuttingDown = false;

  const gracefulShutdown = async () => {
    if (!isShuttingDown) {
      isShuttingDown = true;
      console.log('🔌 Gracefully disconnecting from database...');
      try {
        await prisma.$disconnect();
        console.log('✅ Database disconnected safely');
      } catch (error) {
        console.error('❌ Error during database disconnect:', error);
      }
    }
  };

  // Only add listeners once
  if (!global.__prismaShutdownListeners) {
    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
    process.on('beforeExit', gracefulShutdown);
    global.__prismaShutdownListeners = true;
  }
}

/**
 * Safe database operation wrapper for scripts
 * Use this for operations that might run while dev server is active
 */
export async function safeDbOperation<T>(
  operation: (client: PrismaClient) => Promise<T>,
  skipDisconnect = true
): Promise<T> {
  try {
    const result = await operation(prisma);
    return result;
  } catch (error) {
    console.error('❌ Database operation failed:', error);
    throw error;
  }
  // In development, don't disconnect to avoid server crashes
}

/**
 * Creates isolated Prisma client for standalone scripts
 * Only use this for scripts that run independently of the dev server
 */
export function createIsolatedPrismaClient() {
  return new PrismaClient({
    log: ['error', 'warn'],
    datasources: { 
      db: { 
        url: process.env.DATABASE_URL 
      } 
    },
  });
}

export default prisma;
