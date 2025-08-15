import { NextRequest, NextResponse } from 'next/server';
import { JWTService } from '@/lib/jwt-service';

const jwtService = new JWTService();

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export async function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  requireAdmin: boolean = false
) {
  return async (request: NextRequest) => {
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
        // Try to refresh token automatically
        const refreshToken = request.cookies.get('refresh-token')?.value;
        
        if (refreshToken) {
          const clientInfo = {
            ipAddress: request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown'
          };

          const refreshResult = await jwtService.refreshAccessToken(refreshToken, clientInfo);
          
          if (refreshResult) {
            // Create response with new access token
            const response = await handler(request as AuthenticatedRequest);
            
            response.cookies.set('access-token', refreshResult.accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              maxAge: 15 * 60 // 15 minutes
            });

            return response;
          }
        }

        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      // Check admin requirement
      if (requireAdmin && payload.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }

      // Add user info to request
      (request as AuthenticatedRequest).user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role
      };

      return handler(request as AuthenticatedRequest);
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

// Helper function to verify token without automatic refresh
export async function verifyToken(request: NextRequest): Promise<{ userId: string; email: string; role: string } | null> {
  try {
    const accessToken = request.cookies.get('access-token')?.value;
    
    if (!accessToken) {
      return null;
    }

    const payload = await jwtService.verifyToken(accessToken, 'access');
    
    if (!payload) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}
