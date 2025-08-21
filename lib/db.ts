/**
 * Database Connection Manager
 * 
 * This utility manages Prisma Client connections safely to prevent
 * connection pool exhaustion and server crashes during development.
 */

import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

// Create a singleton Prisma Client instance
function createPrismaClient() {
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : [],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  // Handle graceful shutdown
  if (process.env.NODE_ENV === 'development') {
    process.on('beforeExit', async () => {
      await prisma.$disconnect();
    });

    process.on('SIGINT', async () => {
      await prisma.$disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  }

  return prisma;
}

// Use singleton pattern in development to avoid connection issues
const prisma = globalThis.__prisma || createPrismaClient();

if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

export default prisma;

/**
 * Safe database operation wrapper
 * Use this for scripts that might be run while dev server is active
 */
export async function safeDbOperation<T>(
  operation: (client: PrismaClient) => Promise<T>
): Promise<T> {
  try {
    const result = await operation(prisma);
    return result;
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
  }
  // Do NOT disconnect here - let the singleton manage connections
}

/**
 * For scripts only - creates isolated connection
 * Use this for standalone scripts that won't interfere with dev server
 */
export function createIsolatedPrismaClient() {
  return new PrismaClient({
    log: ['error', 'warn'],
  });
}
