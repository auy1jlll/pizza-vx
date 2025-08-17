import { PrismaClient } from '@prisma/client';

// Global Prisma client instance to prevent connection pool exhaustion / multiple instantiations in dev
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// NOTE: Removed 'beforeExit' disconnect handler. In Next.js dev, frequent hot reloads combined
// with an early disconnect can lead to the dev server becoming unreachable (port closes
// between fast reload cycles). Prisma will clean up on process exit automatically.

export default prisma;
