import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma';

export { prisma };

// Base service class with common functionality
export abstract class BaseService {
  protected db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  // Common error handling
  protected handleError(error: any, context: string): never {
    console.error(`[${context}] Service error:`, error);
    
    if (error.code === 'P2002') {
      throw new Error('Duplicate entry found');
    }
    
    if (error.code === 'P2025') {
      throw new Error('Record not found');
    }
    
    throw new Error(`${context} failed: ${error.message}`);
  }

  // Transaction wrapper
  protected async withTransaction<T>(
    fn: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'>) => Promise<T>
  ): Promise<T> {
    return this.db.$transaction(fn);
  }
}
