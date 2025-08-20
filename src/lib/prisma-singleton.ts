import { PrismaClient } from '@prisma/client';

// Global Prisma instance to avoid connection issues
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Ensure connection is established
export async function ensureConnection(): Promise<boolean> {
  try {
    await prisma.$connect();
    return true;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    return false;
  }
}

// Enhanced database client with connection handling
export const db = {
  ...prisma,
  ensureConnection,
  // Wrapper for database operations with automatic connection handling
  async safeQuery<T>(operation: () => Promise<T>): Promise<T> {
    try {
      const connected = await ensureConnection();
      if (!connected) {
        throw new Error('Database connection could not be established');
      }
      return await operation();
    } catch (error) {
      if (error instanceof Error && error.message.includes('Engine is not yet connected')) {
        // Retry once after reconnection
        console.log('Retrying database operation after connection error...');
        await ensureConnection();
        return await operation();
      }
      throw error;
    }
  }
};

export default db;
