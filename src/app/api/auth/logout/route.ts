import { NextRequest, NextResponse } from 'next/server';
import { JWTService } from '@/lib/jwt-service';

const jwtService = new JWTService();

export async function POST(request: NextRequest) {
  try {
    // Get tokens from cookies
    const accessToken = request.cookies.get('access-token')?.value;
    const refreshToken = request.cookies.get('refresh-token')?.value;
    const adminToken = request.cookies.get('admin-token')?.value; // Legacy token

    // Revoke tokens if they exist
    const promises = [];
    
    if (accessToken) {
      promises.push(jwtService.blacklistToken(accessToken, 'LOGOUT'));
    }
    
    if (refreshToken) {
      promises.push(jwtService.revokeRefreshToken(refreshToken, 'LOGOUT'));
    }

    if (adminToken) {
      promises.push(jwtService.blacklistToken(adminToken, 'LOGOUT'));
    }

    await Promise.all(promises);

    // Clear all cookies
    const response = NextResponse.json({
      message: 'Logout successful'
    });

    response.cookies.delete('access-token');
    response.cookies.delete('refresh-token');
    response.cookies.delete('admin-token'); // Legacy token

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if there's an error, clear the cookies
    const response = NextResponse.json({
      message: 'Logout completed'
    });

    response.cookies.delete('access-token');
    response.cookies.delete('refresh-token');
    response.cookies.delete('admin-token'); // Legacy token

    return response;
  }
}
