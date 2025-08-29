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
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findFirst({
      where: { 
        email: email.toLowerCase(),
        isActive: true
      },
    });

    // Always return success to prevent email enumeration attacks
    // Don't reveal whether email exists or not
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return NextResponse.json(
        { message: 'If an account with that email exists, we have sent a password reset link.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
        updatedAt: new Date()
      } as any,
    });

    // In a real application, you would send an email here
    // For now, we'll log the reset link to console (for development)
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3005'}/management-portal/reset-password?token=${resetToken}`;
    
    console.log('='.repeat(80));
    console.log('ADMIN PASSWORD RESET REQUEST');
    console.log('='.repeat(80));
    console.log(`Email: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Token expires: ${resetTokenExpiry.toISOString()}`);
    console.log('='.repeat(80));

    // Send password reset email
    try {
      if (gmailService.isConfigured()) {
        const emailSent = await gmailService.sendPasswordResetEmail(user.email, resetToken, 'admin');
        if (emailSent) {
          console.log(`✅ Admin password reset email sent successfully to: ${user.email}`);
        } else {
          console.error(`❌ Failed to send admin password reset email to: ${user.email}`);
        }
      } else {
        console.log('⚠️ Gmail service not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in environment variables.');
        console.log(`🔗 Reset URL: ${resetUrl}`);
        console.log(`⏰ Expires: ${resetTokenExpiry.toISOString()}`);
      }
    } catch (error) {
      console.error('Email service error:', error);
      // Don't return error to user for security reasons (anti-enumeration)
    }

    // TODO: Replace this console.log with actual email sending
    // Example using a service like SendGrid, Nodemailer, etc.
    /*
    const emailContent = {
      to: email,
      subject: 'Password Reset Request - Restaurant Management',
      html: `
        <h2>Password Reset Request</h2>
        <p>You have requested to reset your password. Click the link below to proceed:</p>
        <a href="${resetUrl}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this reset, please ignore this email.</p>
      `
    };
    await sendEmail(emailContent);
    */

    return NextResponse.json(
      { message: 'If an account with that email exists, we have sent a password reset link.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
