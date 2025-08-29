import { NextRequest, NextResponse } from 'next/server';
import { gmailService } from '@/lib/gmail-service';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
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

    // Check if Gmail service is configured
    if (!gmailService.isConfigured()) {
      console.error('Gmail service not configured');
      return NextResponse.json(
        { 
          error: 'Email service not configured',
          details: 'Gmail SMTP credentials are missing. Please check your environment variables.',
          serviceInfo: gmailService.getServiceInfo()
        },
        { status: 500 }
      );
    }

    // Send test email
    console.log(`📧 Sending Gmail test email to: ${email}`);
    const emailSent = await gmailService.sendTestEmail(email);

    if (emailSent) {
      console.log(`✅ Gmail test email sent successfully to: ${email}`);
      return NextResponse.json({
        message: 'Gmail test email sent successfully!',
        recipient: email,
        serviceInfo: gmailService.getServiceInfo()
      });
    } else {
      console.error(`❌ Failed to send Gmail test email to: ${email}`);
      return NextResponse.json(
        { 
          error: 'Failed to send test email',
          recipient: email,
          serviceInfo: gmailService.getServiceInfo()
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Gmail test email error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        serviceInfo: gmailService.getServiceInfo()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const serviceInfo = gmailService.getServiceInfo();
    
    return NextResponse.json({
      message: 'Gmail service status',
      ...serviceInfo,
      endpoints: {
        test: 'POST /api/test-email with { "email": "test@example.com" }',
        passwordReset: 'Integrated into forgot password routes'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to get service info',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
