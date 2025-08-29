import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { gmailService } from '@/lib/gmail-service';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Find customer user by email
    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        role: 'CUSTOMER'
      }
    });

    // For security (anti-enumeration), always return the same response
    // whether the user exists or not
    if (!user) {
      console.log(`Password reset requested for non-existent customer email: ${email}`);
      return NextResponse.json({ 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
        updatedAt: new Date()
      },
    });

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3005'}/auth/reset-password?token=${resetToken}`;
    
    console.log('='.repeat(80));
    console.log('CUSTOMER PASSWORD RESET REQUEST');
    console.log('='.repeat(80));
    console.log(`Customer Email: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Token expires: ${resetTokenExpiry.toISOString()}`);
    console.log('='.repeat(80));

    // Send password reset email
    try {
      if (gmailService.isConfigured()) {
        const emailSent = await gmailService.sendPasswordResetEmail(user.email, resetToken, 'customer');
        if (emailSent) {
          console.log(`✅ Password reset email sent successfully to: ${user.email}`);
        } else {
          console.error(`❌ Failed to send password reset email to: ${user.email}`);
        }
      } else {
        console.log('='.repeat(80));
        console.log('CUSTOMER PASSWORD RESET REQUEST - EMAIL SERVICE NOT CONFIGURED');
        console.log('='.repeat(80));
        console.log(`Customer Email: ${email}`);
        console.log(`Reset URL: ${resetUrl}`);
        console.log(`Token expires: ${resetTokenExpiry.toISOString()}`);
        console.log('='.repeat(80));
        console.log('⚠️ Gmail service not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in environment variables.');
      }
      
    } catch (error) {
      console.error('Email service error:', error);
      // Don't return error to user for security reasons (anti-enumeration)
    }

    return NextResponse.json({ 
      message: 'If an account with that email exists, a password reset link has been sent.' 
    });

  } catch (error) {
    console.error('Customer forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
