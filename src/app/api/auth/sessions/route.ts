import { NextRequest, NextResponse } from 'next/server';
import { JWTService } from '@/lib/jwt-service';

const jwtService = new JWTService();

export async function GET(request: NextRequest) {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('access-token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      );
    }

    // Verify access token
    const payload = await jwtService.verifyToken(accessToken, 'access');
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired access token' },
        { status: 401 }
      );
    }

    // Get user's active sessions
    const sessions = await jwtService.getUserSessions(payload.userId);

    return NextResponse.json({
      sessions: sessions.map(session => ({
        id: session.id,
        ipAddress: session.ip_address,
        userAgent: session.user_agent,
        deviceFingerprint: session.device_fingerprint,
        createdAt: session.created_at,
        lastUsedAt: session.last_used_at
      }))
    });
  } catch (error) {
    console.error('Sessions fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
