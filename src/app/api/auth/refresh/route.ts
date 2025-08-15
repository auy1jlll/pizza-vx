import { NextRequest, NextResponse } from 'next/server';
import { JWTService } from '@/lib/jwt-service';

const jwtService = new JWTService();

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookies
    const refreshToken = request.cookies.get('refresh-token')?.value;
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not provided' },
        { status: 401 }
      );
    }

    // Get client info
    const clientInfo = {
      ipAddress: request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    };

    // Refresh access token
    const result = await jwtService.refreshAccessToken(refreshToken, clientInfo);
    
    if (!result) {
      // Clear cookies if refresh failed
      const response = NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
      
      response.cookies.delete('access-token');
      response.cookies.delete('refresh-token');
      
      return response;
    }

    // Set new access token in cookie
    const response = NextResponse.json({
      message: 'Token refreshed successfully',
      expiresAt: result.expiresAt
    });

    response.cookies.set('access-token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 // 15 minutes
    });

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
