import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
const REISSUE_THRESHOLD_SECONDS = 6 * 60 * 60; // 6 hours - reissue when less than 6 hours remain

export async function middleware(request: NextRequest) {
  // We only want to run this middleware on API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Don't process the login route itself
  if (request.nextUrl.pathname.startsWith('/api/auth/login')) {
    return NextResponse.next();
  }

  // Check for tokens in the same order as verifyAdminToken
  let token = request.cookies.get('access-token')?.value;
  
  // Fallback to admin-token for backward compatibility
  if (!token) {
    token = request.cookies.get('admin-token')?.value;
  }

  if (!token) {
    return NextResponse.next();
  }

  let response = NextResponse.next();
  let isTokenReissued = false;

  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
      issuer: 'pizza-builder-app',
    });

    const now = Math.floor(Date.now() / 1000);
    const expiresAt = payload.exp as number;
    const timeRemaining = expiresAt - now;

    // If the token is valid and nearing expiration, reissue it
    if (timeRemaining > 0 && timeRemaining < REISSUE_THRESHOLD_SECONDS) {
      // Create a new token with the same payload, but new expiry
      const newPayload = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };

      const newToken = await new jose.SignJWT(newPayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer('pizza-builder-app')
        .setExpirationTime('72h') // 3 days for production stability
        .sign(JWT_SECRET);

      // Set the new token in the response cookies with consistent settings
      response.cookies.set('access-token', newToken, {
        httpOnly: true,
        secure: false, // Disabled for HTTP production deployment
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 72, // 72 hours to match JWT expiration
      });
      
      // Also update the legacy admin-token for compatibility
      response.cookies.set('admin-token', newToken, {
        httpOnly: true,
        secure: false, // Disabled for HTTP production deployment
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 72, // 72 hours to match JWT expiration
      });

      isTokenReissued = true;
    }
  } catch (error) {
    // If token verification fails, we don't need to do anything here.
    // The request will proceed to the API route, which will then deny access
    // based on the invalid token. We can clear the invalid cookie.
    if (error instanceof jose.errors.JWTExpired) {
        response.cookies.delete('access-token');
        response.cookies.delete('admin-token');
    }
  }

  return response;
}

export const config = {
  // Match all API routes except for static files and internal Next.js routes
  matcher: '/api/:path*',
};
