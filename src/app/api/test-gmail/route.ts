import { NextResponse } from 'next/server';
import { gmailService } from '@/lib/gmail-service';

interface TestResults {
  serviceInfo: {
    configured: boolean;
    fromEmail: string;
  };
  tests: {
    passwordReset?: { success: boolean; message?: string; error?: string };
    configuration?: { success: boolean; message: string };
  };
}

export async function GET() {
  try {
    console.log('🔧 Testing Gmail Service Configuration...\n');

    // Check service configuration
    const serviceInfo = gmailService.getServiceInfo();
    console.log('Gmail Service Info:');
    console.log(`- Configured: ${serviceInfo.configured}`);
    console.log(`- From Email: ${serviceInfo.fromEmail}`);

    const results: TestResults = {
      serviceInfo,
      tests: {}
    };

    if (serviceInfo.configured) {
      console.log('\n✅ Gmail service is configured');

      // Test password reset email function
      try {
        console.log('\n📧 Testing password reset email function...');
        const testResult = await gmailService.sendPasswordResetEmail(
          'test@example.com',
          'test-reset-token-123',
          'customer'
        );

        if (testResult) {
          console.log('✅ Password reset email sent successfully');
          results.tests.passwordReset = { success: true, message: 'Email sent successfully' };
        } else {
          console.log('❌ Password reset email function failed');
          results.tests.passwordReset = { success: false, message: 'Email sending failed' };
        }
      } catch (error) {
        console.log('❌ Error testing password reset email:', error instanceof Error ? error.message : String(error));
        results.tests.passwordReset = {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        };
      }
    } else {
      console.log('\n❌ Gmail service not configured properly');
      console.log('Please ensure GMAIL_USER and GMAIL_APP_PASSWORD are set in your environment variables');
      results.tests.configuration = { success: false, message: 'Gmail service not configured' };
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
