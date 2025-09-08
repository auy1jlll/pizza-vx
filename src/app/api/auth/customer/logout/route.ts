import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ 
      message: 'Logout successful' 
    });
    
    // Clear the user token cookie
    response.cookies.set('user-token', '', {
      httpOnly: true,
      secure: false, // Disabled for HTTP production deployment
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
