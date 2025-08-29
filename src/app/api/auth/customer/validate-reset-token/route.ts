import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      );
    }

    // Find customer user with this reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        role: 'CUSTOMER',
        resetTokenExpiry: {
          gt: new Date() // Token not expired
        }
      } as any
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true });

  } catch (error) {
    console.error('Customer validate reset token error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
