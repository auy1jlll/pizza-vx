import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🔍 Checking if user auy1jll33@gmail.com exists...');
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'auy1jll33@gmail.com' }
    });

    if (existingUser) {
      console.log('✅ User already exists:', {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role
      });
      return existingUser;
    }

    console.log('📝 Creating new user...');
    
    // Create new user
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const newUser = await prisma.user.create({
      data: {
        email: 'auy1jll33@gmail.com',
        name: 'Test User 33',
        password: hashedPassword,
        role: 'CUSTOMER',
        emailVerified: false,
        isActive: true
      }
    });

    console.log('✅ User created successfully:', {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    });

    return newUser;
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
