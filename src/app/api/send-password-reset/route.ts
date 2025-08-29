import { NextRequest, NextResponse } from 'next/server';
import { gmailService } from '@/lib/gmail-service';

export async function POST(request: NextRequest) {
  try {
    const { email, resetToken, userType = 'customer' } = await request.json();

    if (!email || !resetToken) {
      return NextResponse.json(
        { success: false, error: 'Email and reset token are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if Gmail service is available
    if (!gmailService.isAvailable()) {
      console.log('Gmail service not available, logging reset token instead');
      console.log(`Password reset for ${email}: token=${resetToken}`);
      
      return NextResponse.json({
        success: true,
        message: 'Password reset request processed (service unavailable, check logs)',
        serviceStatus: gmailService.getServiceInfo()
      });
    }

    // Send password reset email
    const emailSent = await gmailService.sendPasswordResetEmail(email, resetToken, userType);

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Password reset email sent successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send password reset email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Send password reset error:', error);
    
    // Don't expose internal errors to client
    if (error instanceof Error && error.message.includes('rate limited')) {
      return NextResponse.json(
        { success: false, error: 'Email service temporarily unavailable. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
